import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_PACKAGE_NAME, PRODUCT_SERVICE_NAME } from './product.pb';
import { ProductController } from './product.controller';
import { envs } from 'src/config';

// @Module({
//   imports: [
//     ClientsModule.register([
//       {
//         name: PRODUCT_SERVICE_NAME,
//         transport: Transport.GRPC,
//         options: {
//           url: envs.url_grpc_product_service,
//           package: PRODUCT_PACKAGE_NAME,
//           protoPath: 'node_modules/common-proto/proto/product.proto',
//         },
//       },
//     ]),
//   ],
//   controllers: [ProductController],
// })

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCTS_SERVICE',
        transport: Transport.TCP, // Asegúrate de que coincida con la configuración del microservicio
        options: {
          host: process.env.HOST_PRODUCT_SERVICE,
          port: parseInt(process.env.PORT_PRODUCT_SERVICE), // Debe coincidir con el puerto del microservicio
        },
      },
    ]),
  ],
  controllers: [ProductController],
})
export class ProductModule {}