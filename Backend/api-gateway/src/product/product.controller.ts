// import { Controller, Get, Inject, OnModuleInit, Param, ParseIntPipe, UseGuards, Post, Body, Query } from '@nestjs/common';
// import { ClientGrpc } from '@nestjs/microservices';
// import { Observable } from 'rxjs';
// import {
//   FindOneResponse,
//   ProductServiceClient,
//   PRODUCT_SERVICE_NAME,
//   CreateProductResponse,
//   CreateProductRequest,
// } from './product.pb';
// import { AuthGuard } from '../auth/auth.guard';
// import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
// import { CreateProductRequestDto } from './product.dto';
// import { PaginateRequest } from './common.pb';
// import { PaginationQueryDto } from 'src/common/pagination.dto';

// @ApiTags('Products')
// @ApiBearerAuth()
// @ApiOkResponse()
// @ApiUnauthorizedResponse({ description: "Unauthorized Bearer Auth"})
// @Controller('product')
// export class ProductController implements OnModuleInit {
//   private svc: ProductServiceClient;

//   @Inject(PRODUCT_SERVICE_NAME)
//   private readonly client: ClientGrpc;

//   public onModuleInit(): void {
//     this.svc = this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
//   }

//   @Post()
//   @UseGuards(AuthGuard)
//   private async createProduct(@Body() body: CreateProductRequestDto): Promise<Observable<CreateProductResponse>> {
//     return this.svc.createProduct(body);
//   }

//   @Get()
//   @UseGuards(AuthGuard)
//   private async findAll(@Query() query:PaginationQueryDto) {
//     return this.svc.findAll(query);
//   }

//   @Get(':id')
//   @UseGuards(AuthGuard)
//   private async findOne(@Param('id', ParseIntPipe) id: number): Promise<Observable<FindOneResponse>> {
//     return this.svc.findOne({ id });
//   }
// }


import { Controller, Get, Post, Body, Param, Delete, Put, Query, Inject ,UsePipes, ValidationPipe} from '@nestjs/common';
import { ClientProxy, MessagePattern, RmqContext } from '@nestjs/microservices';
import { CreateProductDto } from './dto/product.dto';
import { CreateInventoryRequestDto } from './dto/inventory.dto';
import { PaginationDto, PaginationResponseDto } from './../common';

@Controller('product')
export class ProductController {
  constructor(@Inject('PRODUCTS_SERVICE') private readonly client: ClientProxy) {}

  // Get all products
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() paginationDto: PaginationDto): Promise<PaginationResponseDto> {
    return this.client.send({ cmd: 'find_all_product' }, paginationDto).toPromise();
  }

  // Get one product
  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param('id') id: number): Promise<any> {
    return this.client.send({ cmd: 'find_one_product' }, id).toPromise();
  }

  // Create product
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() product: CreateProductDto): Promise<any> {
    return this.client.send({ cmd: 'create_product' }, product).toPromise();
  }

  // Update product
  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: number, @Body() product: CreateProductDto): Promise<any> {
    return this.client.send({ cmd: 'update_product' }, { id, product }).toPromise();
  }

  // Delete product
  @Delete(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async delete(@Param('id') id: number): Promise<void> {
    return this.client.send({ cmd: 'delete_product' }, {id}).toPromise();
  }

  // Modify inventory
  @Post(':id/inventory')
  @UsePipes(new ValidationPipe({ transform: true }))
  async modifyInventory(@Param('id') productId: number, @Body() inventoryDto: CreateInventoryRequestDto){
    return this.client.send({ cmd: 'modify_inventory_product' }, { productId, inventoryDto }).toPromise();
  }

  // Get inventory by product
  @Get(':id/inventory')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInventoryByProduct(@Param('id') productId: number, @Query() paginationDto: PaginationDto): Promise<PaginationResponseDto> {
    return this.client.send({ cmd: 'get_inventory_product' }, { productId, paginationDto }).toPromise();
  }
}