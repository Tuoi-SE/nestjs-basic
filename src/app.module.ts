import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://funny_tuoi:cB0B4B2gimZpOBPe@nestjs.rmitfzy.mongodb.net/?appName=NestJS')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
