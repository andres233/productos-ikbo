import { Controller, Get, Post, Body, Param, Delete, Put, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/product.dto';
import { CreateInventoryRequestDto } from './dto/inventory.dto';
import { Inventory } from './entities/inventory.entity';
import { PaginationDto, PaginationResponseDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  //get all products
  @Get()
  @MessagePattern({ cmd: 'find_all_product' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Payload() paginationDto: PaginationDto): Promise<PaginationResponseDto> {
    return await this.productsService.findall(paginationDto);
  }

  //get one product
  @Get(':id')
  @MessagePattern({ cmd: 'find_one_product' })
  async findOne(@Param('id') id: number): Promise<Product> {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new Error('Product not found');
    } else {
      return product;
    }
  }

  //create product
  @Post()
  @MessagePattern({ cmd: 'create_product' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() product: CreateProductDto): Promise<Product> {
    return await this.productsService.create(product);
  }

  //update product
  @Put(':id')
  @MessagePattern({ cmd: 'update_product' })
  async update(@Param('id') id: number, @Body() product: Product): Promise<Product> {
    return this.productsService.update(id, product);
  }

  //delete product
  @Delete(':id')
  @MessagePattern({ cmd: 'delete_product' })
  async delete(@Payload('id') id: number): Promise<void> {
    return this.productsService.delete(id);
  }

  // Modify inventory
  @Post(':id/inventory')
  @MessagePattern({ cmd: 'modify_inventory_product' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async modifyInventory(@Payload() data: { productId: number; inventoryDto: CreateInventoryRequestDto }): Promise<Inventory> {
    const { productId, inventoryDto } = data;
    return await this.productsService.modifyInventory(productId, inventoryDto);
  }

  // get inventory by product
  @Get(':id/inventory')
  @MessagePattern({ cmd: 'get_inventory_product' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInventoryByProduct(@Payload() data: { productId: number, paginationDto: PaginationDto }): Promise<PaginationResponseDto> {
    const { productId, paginationDto } = data;
    return await this.productsService.getInventoryByProduct(productId, paginationDto);
  }
}
