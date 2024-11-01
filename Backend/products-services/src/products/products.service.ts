import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/product.dto';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryRequestDto } from './dto/inventory.dto';
import { Movement } from './entities/movement.entity';
import { PaginationDto, PaginationResponseDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Movement)
    private readonly movementsRepository: Repository<Movement>,
  ) { }

  // get all products
  async findall(paginationDto: PaginationDto): Promise<PaginationResponseDto> {
    const { page, limit, search } = paginationDto;

    // const totalPages = await this.productsRepository.count();
    // const lastPage = Math.ceil(totalPages / limit);

    // const data = await this.productsRepository.find({
    //   skip: (page - 1) * limit,
    //   take: limit,
    //   where: {
    //     name: ''
    //   }
    // });

    const query = this.productsRepository.createQueryBuilder('product');

    // Agregar el filtro de búsqueda si se proporciona
    if (search) {
        query.where('product.name LIKE :search', { search: `%${search}%` });
    }

    query.orderBy('product.id', 'DESC');

    const totalPages = await query.getCount(); // Total de productos después del filtro
    const lastPage = Math.ceil(totalPages / limit);

    // Obtener los productos paginados
    const data = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();


    return {
      data: data,
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
        perPage: limit,
      }
    };
  }

  // get one product
  async findOne(id: number): Promise<Product> {
    return await this.productsRepository.findOne({ where: { id } });
  }

  //create product
  async create(product: CreateProductDto): Promise<Product> {
    const newProduct = this.productsRepository.create(product);
    return await this.productsRepository.save(newProduct);
  }

  // update product
  async update(id: number, product: Product): Promise<Product> {
    await this.productsRepository.update(id, product);
    return await this.productsRepository.findOne({ where: { id } });
  }

  // delete product
  async delete(id: number): Promise<void> {
    const product = await this.productsRepository.findOne({ where: { id: id } });
    if (!product) {
      throw new RpcException({
        message: 'Product not found',
        status: HttpStatus.NOT_FOUND
      });
    }
    await this.productsRepository.delete(id);
  }

  async getInventoryByProduct(productId: number, paginationDto: PaginationDto): Promise<PaginationResponseDto> {
    const { page, limit } = paginationDto;

    const product = await this.productsRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new RpcException({
        message: 'Product not found',
        status: HttpStatus.NOT_FOUND
      });
    }

    const totalPages = await this.inventoryRepository.count({
      where: {
        product: { id: productId },
        quantity: MoreThan(0)
      }
    });
    const lastPage = Math.ceil(totalPages / limit);


    const inventories = await this.inventoryRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        product: { id: productId },
        quantity: MoreThan(0)
      }
    });

    const data = inventories.map(inventory => ({
      ...inventory,
      status: inventory.status,
    }));

    return {
      data: data,
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
        perPage: limit,
      }
    };
  }

  async modifyInventory(productId: number, inventoryDto: CreateInventoryRequestDto): Promise<Inventory> {

    const product = await this.productsRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new RpcException({
        message: 'Product not found',
        status: HttpStatus.NOT_FOUND
      });
    }

    const expiredAt = new Date(inventoryDto.expiredAt);

    if (expiredAt <= new Date()) {
      throw new RpcException({
        message: 'Expiration date must be in the future',
        status: HttpStatus.BAD_REQUEST
      });
    }

    const inventory = this.inventoryRepository.create(
      {
        quantity: inventoryDto.quantity,
        expiredAt: expiredAt,
        product,
      }
    );

    try {
      // Buscar si ya existe un registro de inventario con el mismo producto y fecha de expiración
      let inventory = await this.inventoryRepository.findOne({
        where: {
          product: { id: productId },
          expiredAt: expiredAt,
        },
      });

      if (inventory) {
        if (inventoryDto.quantity * (-1) > inventory.quantity) {
          throw new RpcException({
            message: 'Insufficient quantity in inventory',
            status: HttpStatus.BAD_REQUEST
          });
        }

        inventory.product = product;
        inventory.quantity += inventoryDto.quantity;
        await this.inventoryRepository.save(inventory);

      } else {
        // si el lote es nuevo la cantidad debe ser mayor a 0
        if (inventoryDto.quantity < 1) {
          throw new RpcException({
            message: 'The quantity is not valid',
            status: HttpStatus.BAD_REQUEST
          });
        }

        inventory = this.inventoryRepository.create({
          quantity: inventoryDto.quantity,
          expiredAt: expiredAt,
          product,
        });
        await this.inventoryRepository.save(inventory);
      }

      let movement = this.movementsRepository.create({
        quantity: inventoryDto.quantity,
        inventory,
      });
      await this.movementsRepository.save(movement);

      return {
        ...inventory,
        status: inventory.status
      };

    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to add inventory');
      }
    }
  }
}
