import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const DOC_TITLE = 'The Sakila Project';
const DOC_DESC = 'List sakila endpoints';
const DOC_VERSION = '1.0';

export const configSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder();
  config.setTitle(DOC_TITLE).setDescription(DOC_DESC).setVersion(DOC_VERSION);
  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('docs', app, document);
};
