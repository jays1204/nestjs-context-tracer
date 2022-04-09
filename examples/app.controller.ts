import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AsyncContext } from 'nestjs-context-tracer';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly asyncContext: AsyncContext
  ) {}

  @Get()
  getHello(): string {
    const rand = Math.random();
    console.log('begin trace-id:', this.asyncContext.getTraceId());
    console.log('rand-id:', rand);
    this.asyncContext.set('RAND', rand);
    return this.appService.getHello();
  }
}
