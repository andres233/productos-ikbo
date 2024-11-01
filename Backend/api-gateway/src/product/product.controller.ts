
import { Controller, Get, Post, Body, Param, Delete, Put, Query, Inject ,UsePipes,UseGuards, ValidationPipe} from '@nestjs/common';
import { ClientProxy, MessagePattern, RmqContext } from '@nestjs/microservices';
import { CreateProductDto } from './dto/product.dto';
import { CreateInventoryRequestDto } from './dto/inventory.dto';
import { PaginationDto, PaginationResponseDto } from './../common';
import { AuthGuard } from '../auth/auth.guard';

@Controller('product')
export class ProductController {
  constructor(@Inject('PRODUCTS_SERVICE') private readonly client: ClientProxy) {}

  // Get all products
  @Get()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() paginationDto: PaginationDto): Promise<PaginationResponseDto> {
    return this.client.send({ cmd: 'find_all_product' }, paginationDto).toPromise();
  }

  // Get one product
  @Get(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param('id') id: number): Promise<any> {
    return this.client.send({ cmd: 'find_one_product' }, id).toPromise();
  }

  // Create product
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() product: CreateProductDto): Promise<any> {
    return this.client.send({ cmd: 'create_product' }, product).toPromise();
  }

  // Update product
  @Put(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: number, @Body() product: CreateProductDto): Promise<any> {
    return this.client.send({ cmd: 'update_product' }, { id, product }).toPromise();
  }

  // Delete product
  @Delete(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async delete(@Param('id') id: number): Promise<void> {
    return this.client.send({ cmd: 'delete_product' }, {id}).toPromise();
  }

  // Modify inventory
  @Post(':id/inventory')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async modifyInventory(@Param('id') productId: number, @Body() inventoryDto: CreateInventoryRequestDto){
    return this.client.send({ cmd: 'modify_inventory_product' }, { productId, inventoryDto }).toPromise();
  }

  // Get inventory by product
  @Get(':id/inventory')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInventoryByProduct(@Param('id') productId: number, @Query() paginationDto: PaginationDto): Promise<PaginationResponseDto> {
    return this.client.send({ cmd: 'get_inventory_product' }, { productId, paginationDto }).toPromise();
  }
}