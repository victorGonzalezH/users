import { NestFactory } from '@nestjs/core';
import { UsersApiModule } from './users.api.module';
import * as fs from 'fs';
import { AppConfigService } from 'usa/users.application/configuration/appConfig.service';

async function bootstrap() {

  // Se obtienen la llave y el certificado para usar el protocolo https
  const httpsOptions = {
    key: fs.readFileSync('./certs/localhost.key'),
    cert: fs.readFileSync('./certs/localhost.pem'),
  };

  // Se crea la aplicacion
  const app = await NestFactory.create(UsersApiModule, {
    httpsOptions,
  });

  // Una vez creada la aplicacion se obtiene el servicio de configuracion
  const appConfigService = app.get<AppConfigService>(AppConfigService);

  // Se configura el microservicio para la comunicacion con otros microservicios
  app.connectMicroservice({ transport: appConfigService.getMicroserviceProtocol(), options: {  port: appConfigService.getMicroservicePort() } } );

  await app.startAllMicroservicesAsync();

  await app.listen(appConfigService.getWebPort());

}


bootstrap();
