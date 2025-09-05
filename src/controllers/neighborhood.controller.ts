import { Request, Response } from 'express';
import { Neighborhood, City } from '../config/db';
import { Op } from 'sequelize';

// Interface para filtros de busca
interface NeighborhoodFilters {
  search?: string;
  cidade_id?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
}

// Buscar todos os bairros com filtros e paginação
export const getAllNeighborhoods = async (req: Request, res: Response) => {
  try {
    const {
      search,
      cidade_id,
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
        { nome: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filtros específicos
    if (cidade_id) where.cidade_id = cidade_id;
    if (ativo !== undefined) where.ativo = ativo === 'true';

    // Configuração de paginação
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const limitNum = parseInt(limit as string);

    // Configuração de ordenação
    const order: any = [[orderBy as string, orderDirection as string]];

    // Buscar bairros com informações da cidade
    const { count, rows: neighborhoods } = await Neighborhood.findAndCountAll({
      where,
      order,
      limit: limitNum,
      offset,
      include: [
        {
          model: City,
          as: 'cidade',
          attributes: ['id', 'nome', 'estado']
        }
      ]
    });

    res.json({
      success: true,
      data: {
        neighborhoods,
        pagination: {
          total: count,
          page: parseInt(page as string),
          limit: limitNum,
          totalPages: Math.ceil(count / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar bairros:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Buscar bairro por ID
export const getNeighborhoodById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const neighborhood = await Neighborhood.findByPk(id, {
      include: [
        {
          model: City,
          as: 'cidade',
          attributes: ['id', 'nome', 'estado']
        }
      ]
    });

    if (!neighborhood) {
      return res.status(404).json({
        success: false,
        message: 'Bairro não encontrado'
      });
    }

    res.json({
      success: true,
      data: neighborhood
    });
  } catch (error) {
    console.error('Erro ao buscar bairro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Criar novo bairro
export const createNeighborhood = async (req: Request, res: Response) => {
  try {
    const { nome, cidade_id, ativo } = req.body;

    // Verificar se a cidade existe
    const city = await City.findByPk(cidade_id);
    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'Cidade não encontrada'
      });
    }

    // Verificar se já existe um bairro com o mesmo nome na mesma cidade
    const existingNeighborhood = await Neighborhood.findOne({
      where: {
        nome: nome,
        cidade_id: cidade_id
      }
    });

    if (existingNeighborhood) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um bairro com este nome nesta cidade'
      });
    }

    const neighborhood = await Neighborhood.create({
      nome,
      cidade_id,
      ativo: ativo !== undefined ? ativo : true
    });

    // Buscar o bairro criado com informações da cidade
    const createdNeighborhood = await Neighborhood.findByPk(neighborhood.id, {
      include: [
        {
          model: City,
          as: 'cidade',
          attributes: ['id', 'nome', 'estado']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Bairro criado com sucesso',
      data: createdNeighborhood
    });
  } catch (error) {
    console.error('Erro ao criar bairro:', error);
    
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

// Atualizar bairro
export const updateNeighborhood = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Buscar bairro existente
    const neighborhood = await Neighborhood.findByPk(id);

    if (!neighborhood) {
      return res.status(404).json({
        success: false,
        message: 'Bairro não encontrado'
      });
    }

    // Se estiver alterando cidade_id, verificar se a cidade existe
    if (updateData.cidade_id) {
      const city = await City.findByPk(updateData.cidade_id);
      if (!city) {
        return res.status(400).json({
          success: false,
          message: 'Cidade não encontrada'
        });
      }
    }

    // Se estiver alterando nome ou cidade_id, verificar se já existe
    if (updateData.nome || updateData.cidade_id) {
      const nome = updateData.nome || neighborhood.nome;
      const cidade_id = updateData.cidade_id || neighborhood.cidade_id;

      const existingNeighborhood = await Neighborhood.findOne({
        where: {
          nome: nome,
          cidade_id: cidade_id,
          id: { [Op.ne]: id }
        }
      });

      if (existingNeighborhood) {
        return res.status(400).json({
          success: false,
          message: 'Já existe um bairro com este nome nesta cidade'
        });
      }
    }

    // Atualizar bairro
    await neighborhood.update(updateData);

    // Buscar o bairro atualizado com informações da cidade
    const updatedNeighborhood = await Neighborhood.findByPk(id, {
      include: [
        {
          model: City,
          as: 'cidade',
          attributes: ['id', 'nome', 'estado']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Bairro atualizado com sucesso',
      data: updatedNeighborhood
    });
  } catch (error) {
    console.error('Erro ao atualizar bairro:', error);
    
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

// Excluir bairro
export const deleteNeighborhood = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const neighborhood = await Neighborhood.findByPk(id);

    if (!neighborhood) {
      return res.status(404).json({
        success: false,
        message: 'Bairro não encontrado'
      });
    }

    await neighborhood.destroy();

    res.json({
      success: true,
      message: 'Bairro excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir bairro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Toggle status do bairro
export const toggleNeighborhoodStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const neighborhood = await Neighborhood.findByPk(id);

    if (!neighborhood) {
      return res.status(404).json({
        success: false,
        message: 'Bairro não encontrado'
      });
    }

    const newStatus = !neighborhood.ativo;
    await neighborhood.update({ ativo: newStatus });

    res.json({
      success: true,
      message: `Status alterado para ${newStatus ? 'ativo' : 'inativo'}`,
      data: { ativo: newStatus }
    });
  } catch (error) {
    console.error('Erro ao alterar status do bairro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Buscar bairros por cidade
export const getNeighborhoodsByCity = async (req: Request, res: Response) => {
  try {
    const { cidade_id } = req.params;
    const { ativo = true } = req.query;

    // Verificar se a cidade existe
    const city = await City.findByPk(cidade_id);
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'Cidade não encontrada'
      });
    }

    const neighborhoods = await Neighborhood.findAll({
      where: {
        cidade_id: cidade_id,
        ativo: ativo === 'true'
      },
      order: [['nome', 'ASC']],
      include: [
        {
          model: City,
          as: 'cidade',
          attributes: ['id', 'nome', 'estado']
        }
      ]
    });

    res.json({
      success: true,
      data: neighborhoods
    });
  } catch (error) {
    console.error('Erro ao buscar bairros por cidade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};
