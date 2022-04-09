import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AsyncTraceIdMiddleware, AsyncTraceModule } from 'nestjs-context-tracer';

@Module({
  imports: [ AsyncTraceModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AsyncTraceIdMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
