import { Request, Response } from 'express';
import { Property } from '../config/db';
import { Op } from 'sequelize';

// Interface para filtros de busca
interface PropertyFilters {
  search?: string;
  status?: string;
  tipo?: string;
  finalidade?: string;
  cidade?: string;
  bairro?: string;
  minValor?: number;
  maxValor?: number;
  minArea?: number;
  maxArea?: number;
  quartos?: number;
  banheiros?: number;
  vagas?: number;
  destaque?: boolean;
  imovel_do_mes?: boolean;
  page?: number;
  limit?: number;
}

// Interface para ordenação
interface PropertyOrder {
  field: string;
  direction: 'ASC' | 'DESC';
}

// Buscar todas as propriedades com filtros e paginação
export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const {
      search,
      status,
      tipo,
      finalidade,
      cidade,
      bairro,
      minValor,
      maxValor,
      minArea,
      maxArea,
      quartos,
      banheiros,
      vagas,
      destaque,
      imovel_do_mes,
      page = 1,
      limit = 10,
      orderBy = 'createdAt',
      orderDirection = 'DESC'
    } = req.query;

    // Construir filtros
    const where: any = {};

    // Filtro de busca por texto
    if (search) {
      where[Op.or] = [
        { titulo: { [Op.iLike]: `%${search}%` } },
        { descricao: { [Op.iLike]: `%${search}%` } },
        { bairro: { [Op.iLike]: `%${search}%` } },
        { cidade: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filtros específicos
    if (status) where.status = status;
    if (tipo) where.tipo = tipo;
    if (finalidade) where.finalidade = finalidade;
    if (cidade) where.cidade = cidade;
    if (bairro) where.bairro = bairro;
    if (destaque !== undefined) where.destaque = destaque === 'true';
    if (imovel_do_mes !== undefined) where.imovel_do_mes = imovel_do_mes === 'true';

    // Filtros numéricos
    if (minValor || maxValor) {
      where.valor = {};
      if (minValor) where.valor[Op.gte] = parseFloat(minValor as string);
      if (maxValor) where.valor[Op.lte] = parseFloat(maxValor as string);
    }

    if (minArea || maxArea) {
      where.area_util = {};
      if (minArea) where.area_util[Op.gte] = parseFloat(minArea as string);
      if (maxArea) where.area_util[Op.lte] = parseFloat(maxArea as string);
    }

    if (quartos) where.quartos = parseInt(quartos as string);
    if (banheiros) where.banheiros = parseInt(banheiros as string);
    if (vagas) where.vagas = parseInt(vagas as string);

    // Configuração de paginação
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const limitNum = parseInt(limit as string);

    // Configuração de ordenação
    const order: any = [[orderBy as string, orderDirection as string]];

    // Buscar propriedades
    const { count, rows: properties } = await Property.findAndCountAll({
      where,
      order,
      limit: limitNum,
      offset,
    });

    // Calcular estatísticas
    const stats = await Property.findAll({
      attributes: [
        'status',
        [Property.sequelize!.fn('COUNT', Property.sequelize!.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const totalDestaques = await Property.count({ where: { destaque: true } });
    const totalImoveisDoMes = await Property.count({ where: { imovel_do_mes: true } });

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          total: count,
          page: parseInt(page as string),
          limit: limitNum,
          totalPages: Math.ceil(count / limitNum)
        },
        stats: {
          byStatus: stats,
          totalDestaques,
          totalImoveisDoMes
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar propriedades:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Buscar propriedade por ID
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Propriedade não encontrada'
      });
    }

    // Se não há token de autenticação (acesso público), verificar se a propriedade está ativa
    if (!req.headers.authorization && property.status !== 'ativo') {
      return res.status(404).json({
        success: false,
        message: 'Propriedade não encontrada'
      });
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Erro ao buscar propriedade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Criar nova propriedade
export const createProperty = async (req: Request, res: Response) => {
  try {
    const {
      titulo,
      descricao,
      tipo,
      finalidade,
      valor,
      bairro,
      cidade,
      area_util,
      quartos,
      banheiros,
      vagas,
      imagens,
      destaque,
      imovel_do_mes,
      status
    } = req.body;

    // Validar se pelo menos uma imagem foi fornecida
    if (!imagens || !Array.isArray(imagens) || imagens.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Deve ser fornecida pelo menos uma imagem'
      });
    }

    // Validar se já existe um imóvel do mês quando tentando marcar como imóvel do mês
    if (imovel_do_mes) {
      const existingPropertyOfMonth = await Property.findOne({
        where: { imovel_do_mes: true }
      });

      if (existingPropertyOfMonth) {
        return res.status(400).json({
          success: false,
          message: 'Já existe um imóvel do mês cadastrado',
          details: {
            existingProperty: {
              id: existingPropertyOfMonth.id,
              titulo: existingPropertyOfMonth.titulo
            }
          }
        });
      }
    }

    const property = await Property.create({
      titulo,
      descricao,
      tipo,
      finalidade,
      valor: parseFloat(valor),
      bairro,
      cidade,
      area_util: parseFloat(area_util),
      quartos: parseInt(quartos),
      banheiros: parseInt(banheiros),
      vagas: parseInt(vagas),
      imagens,
      destaque: destaque || false,
      imovel_do_mes: imovel_do_mes || false,
      status: status || 'ativo'
    });

    res.status(201).json({
      success: true,
      message: 'Propriedade criada com sucesso',
      data: property
    });
  } catch (error) {
    console.error('Erro ao criar propriedade:', error);
    
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: (error as any).errors.map((err: any) => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Atualizar propriedade
export const updateProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Buscar propriedade existente
    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Propriedade não encontrada'
      });
    }

    // Validar se já existe um imóvel do mês quando tentando marcar como imóvel do mês
    if (updateData.imovel_do_mes === true) {
      const existingPropertyOfMonth = await Property.findOne({
        where: { 
          imovel_do_mes: true,
          id: { [Op.ne]: id } // Excluir a propriedade atual da busca
        }
      });

      if (existingPropertyOfMonth) {
        return res.status(400).json({
          success: false,
          message: 'Já existe um imóvel do mês cadastrado',
          details: {
            existingProperty: {
              id: existingPropertyOfMonth.id,
              titulo: existingPropertyOfMonth.titulo
            }
          }
        });
      }
    }

    // Converter valores numéricos se fornecidos
    if (updateData.valor) updateData.valor = parseFloat(updateData.valor);
    if (updateData.area_util) updateData.area_util = parseFloat(updateData.area_util);
    if (updateData.quartos) updateData.quartos = parseInt(updateData.quartos);
    if (updateData.banheiros) updateData.banheiros = parseInt(updateData.banheiros);
    if (updateData.vagas) updateData.vagas = parseInt(updateData.vagas);

    // Atualizar propriedade
    await property.update(updateData);

    res.json({
      success: true,
      message: 'Propriedade atualizada com sucesso',
      data: property
    });
  } catch (error) {
    console.error('Erro ao atualizar propriedade:', error);
    
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: (error as any).errors.map((err: any) => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Excluir propriedade
export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Propriedade não encontrada'
      });
    }

    await property.destroy();

    res.json({
      success: true,
      message: 'Propriedade excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir propriedade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Toggle status da propriedade
export const togglePropertyStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Propriedade não encontrada'
      });
    }

    // Alternar entre ativo e inativo
    const newStatus = property.status === 'ativo' ? 'inativo' : 'ativo';
    await property.update({ status: newStatus });

    res.json({
      success: true,
      message: `Status alterado para ${newStatus}`,
      data: { status: newStatus }
    });
  } catch (error) {
    console.error('Erro ao alterar status da propriedade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Toggle destaque da propriedade
export const togglePropertyFeatured = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Propriedade não encontrada'
      });
    }

    const newDestaque = !property.destaque;
    await property.update({ destaque: newDestaque });

    res.json({
      success: true,
      message: `Destaque ${newDestaque ? 'ativado' : 'desativado'}`,
      data: { destaque: newDestaque }
    });
  } catch (error) {
    console.error('Erro ao alterar destaque da propriedade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Toggle imóvel do mês
export const togglePropertyOfMonth = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Propriedade não encontrada'
      });
    }

    const newImovelDoMes = !property.imovel_do_mes;

    // Se tentando ativar como imóvel do mês, verificar se já existe outro
    if (newImovelDoMes) {
      const existingPropertyOfMonth = await Property.findOne({
        where: { 
          imovel_do_mes: true,
          id: { [Op.ne]: id } // Excluir a propriedade atual da busca
        }
      });

      if (existingPropertyOfMonth) {
        return res.status(400).json({
          success: false,
          message: 'Já existe um imóvel do mês cadastrado',
          details: {
            existingProperty: {
              id: existingPropertyOfMonth.id,
              titulo: existingPropertyOfMonth.titulo
            }
          }
        });
      }
    }

    await property.update({ imovel_do_mes: newImovelDoMes });

    res.json({
      success: true,
      message: `Imóvel do mês ${newImovelDoMes ? 'ativado' : 'desativado'}`,
      data: { imovel_do_mes: newImovelDoMes }
    });
  } catch (error) {
    console.error('Erro ao alterar imóvel do mês:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Buscar propriedades em destaque
export const getFeaturedProperties = async (req: Request, res: Response) => {
  try {
    const { limit = 6 } = req.query;

    const properties = await Property.findAll({
      where: { 
        destaque: true,
        status: 'ativo'
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit as string)
    });

    res.json({
      success: true,
      data: properties
    });
  } catch (error) {
    console.error('Erro ao buscar propriedades em destaque:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Buscar imóvel do mês
export const getPropertyOfMonth = async (req: Request, res: Response) => {
  try {
    const property = await Property.findOne({
      where: { 
        imovel_do_mes: true,
        status: 'ativo'
      },
      order: [['updatedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Erro ao buscar imóvel do mês:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};
