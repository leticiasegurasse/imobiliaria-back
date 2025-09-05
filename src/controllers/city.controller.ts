import { Request, Response } from 'express';
import { City } from '../config/db';
import { Op } from 'sequelize';

// Interface para filtros de busca
interface CityFilters {
  search?: string;
  estado?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
}

// Buscar todas as cidades com filtros e paginação
export const getAllCities = async (req: Request, res: Response) => {
  try {
    const {
      search,
      estado,
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
        { estado: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filtros específicos
    if (estado) where.estado = estado;
    if (ativo !== undefined) where.ativo = ativo === 'true';

    // Configuração de paginação
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const limitNum = parseInt(limit as string);

    // Configuração de ordenação
    const order: any = [[orderBy as string, orderDirection as string]];

    // Buscar cidades
    const { count, rows: cities } = await City.findAndCountAll({
      where,
      order,
      limit: limitNum,
      offset,
    });

    res.json({
      success: true,
      data: {
        cities,
        pagination: {
          total: count,
          page: parseInt(page as string),
          limit: limitNum,
          totalPages: Math.ceil(count / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Buscar cidade por ID
export const getCityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const city = await City.findByPk(id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'Cidade não encontrada'
      });
    }

    res.json({
      success: true,
      data: city
    });
  } catch (error) {
    console.error('Erro ao buscar cidade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Criar nova cidade
export const createCity = async (req: Request, res: Response) => {
  try {
    const { nome, estado, cep, ativo } = req.body;

    // Verificar se já existe uma cidade com o mesmo nome no mesmo estado
    const existingCity = await City.findOne({
      where: {
        nome: nome,
        estado: estado
      }
    });

    if (existingCity) {
      return res.status(400).json({
        success: false,
        message: 'Já existe uma cidade com este nome neste estado'
      });
    }

    const city = await City.create({
      nome,
      estado: estado.toUpperCase(),
      cep,
      ativo: ativo !== undefined ? ativo : true
    });

    res.status(201).json({
      success: true,
      message: 'Cidade criada com sucesso',
      data: city
    });
  } catch (error) {
    console.error('Erro ao criar cidade:', error);
    
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

// Atualizar cidade
export const updateCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Buscar cidade existente
    const city = await City.findByPk(id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'Cidade não encontrada'
      });
    }

    // Se estiver alterando nome ou estado, verificar se já existe
    if (updateData.nome || updateData.estado) {
      const nome = updateData.nome || city.nome;
      const estado = updateData.estado || city.estado;

      const existingCity = await City.findOne({
        where: {
          nome: nome,
          estado: estado,
          id: { [Op.ne]: id }
        }
      });

      if (existingCity) {
        return res.status(400).json({
          success: false,
          message: 'Já existe uma cidade com este nome neste estado'
        });
      }
    }

    // Converter estado para maiúsculas se fornecido
    if (updateData.estado) {
      updateData.estado = updateData.estado.toUpperCase();
    }

    // Atualizar cidade
    await city.update(updateData);

    res.json({
      success: true,
      message: 'Cidade atualizada com sucesso',
      data: city
    });
  } catch (error) {
    console.error('Erro ao atualizar cidade:', error);
    
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

// Excluir cidade
export const deleteCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const city = await City.findByPk(id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'Cidade não encontrada'
      });
    }

    await city.destroy();

    res.json({
      success: true,
      message: 'Cidade excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir cidade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Toggle status da cidade
export const toggleCityStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const city = await City.findByPk(id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'Cidade não encontrada'
      });
    }

    const newStatus = !city.ativo;
    await city.update({ ativo: newStatus });

    res.json({
      success: true,
      message: `Status alterado para ${newStatus ? 'ativo' : 'inativo'}`,
      data: { ativo: newStatus }
    });
  } catch (error) {
    console.error('Erro ao alterar status da cidade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Buscar cidades por estado
export const getCitiesByState = async (req: Request, res: Response) => {
  try {
    const { estado } = req.params;
    const { ativo = true } = req.query;

    const cities = await City.findAll({
      where: {
        estado: estado.toUpperCase(),
        ativo: ativo === 'true'
      },
      order: [['nome', 'ASC']]
    });

    res.json({
      success: true,
      data: cities
    });
  } catch (error) {
    console.error('Erro ao buscar cidades por estado:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};
