import { Request, Response } from 'express';
import { PropertyType } from '../config/db';
import { Op } from 'sequelize';

// Interface para filtros de busca
interface PropertyTypeFilters {
  search?: string;
  categoria?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
}

// Buscar todos os tipos de imóvel com filtros e paginação
export const getAllPropertyTypes = async (req: Request, res: Response) => {
  try {
    const {
      search,
      categoria,
      ativo,
      page = 1,
      limit = 10,
      orderBy = 'nome',
      orderDirection = 'ASC'
    } = req.query;

    // Construir filtros
    const where: any = {};

    // Filtro de busca por texto
    if (search) {
      where[Op.or] = [
        { nome: { [Op.iLike]: `%${search}%` } },
        { descricao: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filtros específicos
    if (categoria) where.categoria = categoria;
    if (ativo !== undefined) where.ativo = ativo === 'true';

    // Configuração de paginação
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const limitNum = parseInt(limit as string);

    // Configuração de ordenação
    const order: any = [[orderBy as string, orderDirection as string]];

    // Buscar tipos de imóvel
    const { count, rows: propertyTypes } = await PropertyType.findAndCountAll({
      where,
      order,
      limit: limitNum,
      offset,
    });

    res.json({
      success: true,
      data: {
        propertyTypes,
        pagination: {
          total: count,
          page: parseInt(page as string),
          limit: limitNum,
          totalPages: Math.ceil(count / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar tipos de imóvel:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Buscar tipo de imóvel por ID
export const getPropertyTypeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const propertyType = await PropertyType.findByPk(id);

    if (!propertyType) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de imóvel não encontrado'
      });
    }

    res.json({
      success: true,
      data: propertyType
    });
  } catch (error) {
    console.error('Erro ao buscar tipo de imóvel:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Criar novo tipo de imóvel
export const createPropertyType = async (req: Request, res: Response) => {
  try {
    const { nome, descricao, categoria, ativo } = req.body;

    // Verificar se já existe um tipo de imóvel com o mesmo nome
    const existingPropertyType = await PropertyType.findOne({
      where: {
        nome: nome
      }
    });

    if (existingPropertyType) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um tipo de imóvel com este nome'
      });
    }

    const propertyType = await PropertyType.create({
      nome,
      descricao,
      categoria,
      ativo: ativo !== undefined ? ativo : true
    });

    res.status(201).json({
      success: true,
      message: 'Tipo de imóvel criado com sucesso',
      data: propertyType
    });
  } catch (error) {
    console.error('Erro ao criar tipo de imóvel:', error);
    
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

// Atualizar tipo de imóvel
export const updatePropertyType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Buscar tipo de imóvel existente
    const propertyType = await PropertyType.findByPk(id);

    if (!propertyType) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de imóvel não encontrado'
      });
    }

    // Se estiver alterando nome, verificar se já existe
    if (updateData.nome) {
      const existingPropertyType = await PropertyType.findOne({
        where: {
          nome: updateData.nome,
          id: { [Op.ne]: id }
        }
      });

      if (existingPropertyType) {
        return res.status(400).json({
          success: false,
          message: 'Já existe um tipo de imóvel com este nome'
        });
      }
    }

    // Atualizar tipo de imóvel
    await propertyType.update(updateData);

    res.json({
      success: true,
      message: 'Tipo de imóvel atualizado com sucesso',
      data: propertyType
    });
  } catch (error) {
    console.error('Erro ao atualizar tipo de imóvel:', error);
    
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

// Excluir tipo de imóvel
export const deletePropertyType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const propertyType = await PropertyType.findByPk(id);

    if (!propertyType) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de imóvel não encontrado'
      });
    }

    await propertyType.destroy();

    res.json({
      success: true,
      message: 'Tipo de imóvel excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir tipo de imóvel:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Toggle status do tipo de imóvel
export const togglePropertyTypeStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const propertyType = await PropertyType.findByPk(id);

    if (!propertyType) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de imóvel não encontrado'
      });
    }

    const newStatus = !propertyType.ativo;
    await propertyType.update({ ativo: newStatus });

    res.json({
      success: true,
      message: `Status alterado para ${newStatus ? 'ativo' : 'inativo'}`,
      data: { ativo: newStatus }
    });
  } catch (error) {
    console.error('Erro ao alterar status do tipo de imóvel:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Buscar tipos de imóvel por categoria
export const getPropertyTypesByCategory = async (req: Request, res: Response) => {
  try {
    const { categoria } = req.params;
    const { ativo = true } = req.query;

    const propertyTypes = await PropertyType.findAll({
      where: {
        categoria: categoria,
        ativo: ativo === 'true'
      },
      order: [['nome', 'ASC']]
    });

    res.json({
      success: true,
      data: propertyTypes
    });
  } catch (error) {
    console.error('Erro ao buscar tipos de imóvel por categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Buscar categorias disponíveis
export const getAvailableCategories = async (req: Request, res: Response) => {
  try {
    const categories = [
      { value: 'residencial', label: 'Residencial' },
      { value: 'comercial', label: 'Comercial' },
      { value: 'rural', label: 'Rural' },
      { value: 'terreno', label: 'Terreno' }
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};
