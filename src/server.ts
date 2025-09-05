import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import sequelize from './config/db';
import authRoutes from './routes/auth.routes';
import uploadRoutes from './routes/upload.routes';
import propertyRoutes from './routes/property.routes';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware';
import seedDatabase from './scripts/seed';

dotenv.config();

const app = express();

// Middlewares de segurança e parsing
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Middleware para lidar com requisições OPTIONS (preflight) - temporariamente desabilitado

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/properties', propertyRoutes);

// Rota para servir arquivos de upload
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const uploadDir = path.join(__dirname, '../uploads');
  const filePath = path.join(uploadDir, filename);
  
  if (fs.existsSync(filePath)) {
    // Configurar headers CORS para imagens
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache por 1 ano
    
    res.sendFile(filePath);
  } else {
    res.status(404).json({
      success: false,
      message: 'Arquivo não encontrado'
    });
  }
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando! 🚀' });
});

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

// Middleware para rotas não encontradas (deve vir antes do errorHandler)
app.use(notFoundHandler);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Conexão com banco de dados e seed
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
    // Executar seed se não estiver em produção
    if (process.env.NODE_ENV !== 'production') {
      seedDatabase();
    }
  })
  .catch(err => console.error('❌ Não foi possível conectar ao banco de dados:', err));

const PORT = process.env.PORT || '3001';

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📝 Endpoints disponíveis:`);
  console.log(`   🔐 Autenticação:`);
  console.log(`      POST /api/auth/register - Registrar usuário`);
  console.log(`      POST /api/auth/login - Fazer login`);
  console.log(`      POST /api/auth/logout - Fazer logout`);
  console.log(`      POST /api/auth/refresh - Renovar token`);
  console.log(`      POST /api/auth/forgot-password - Esqueci a senha`);
  console.log(`      POST /api/auth/reset-password - Redefinir senha`);
  console.log(`      GET  /api/auth/verify-token - Verificar token (protegido)`);
  console.log(`      GET  /api/auth/profile - Perfil do usuário (protegido)`);
  console.log(`      PUT  /api/auth/profile - Atualizar perfil (protegido)`);
  console.log(`      POST /api/auth/change-password - Alterar senha (protegido)`);
  console.log(`   🏠 Propriedades:`);
  console.log(`      GET  /api/properties - Listar propriedades (com filtros)`);
  console.log(`      GET  /api/properties/featured - Propriedades em destaque`);
  console.log(`      GET  /api/properties/property-of-month - Imóvel do mês`);
  console.log(`      GET  /api/properties/:id - Buscar propriedade por ID`);
  console.log(`      POST /api/properties - Criar propriedade (protegido)`);
  console.log(`      PUT  /api/properties/:id - Atualizar propriedade (protegido)`);
  console.log(`      DELETE /api/properties/:id - Excluir propriedade (protegido)`);
  console.log(`      PATCH /api/properties/:id/toggle-status - Toggle status (protegido)`);
  console.log(`      PATCH /api/properties/:id/toggle-featured - Toggle destaque (protegido)`);
  console.log(`      PATCH /api/properties/:id/toggle-property-of-month - Toggle imóvel do mês (protegido)`);
  console.log(`   📸 Upload:`);
  console.log(`      POST /api/upload/image - Upload de imagem (protegido)`);
  console.log(`      GET  /uploads/:filename - Servir arquivo de imagem`);
  console.log(`      DELETE /api/upload/image/:filename - Excluir imagem (protegido)`);
  console.log(`   🏥 Sistema:`);
  console.log(`      GET  /api/health - Health check`);
});

export default app;
