import { Injectable } from '@nestjs/common';
import { AsyncContext } from 'nestjs-context-tracer';

@Injectable()
export class AppService {

  constructor(
    private readonly asyncContext: AsyncContext
  ) {
  }
  getHello(): string {
    console.log('service trace-id:', this.asyncContext.getTraceId());
    console.log('service rand-id:', this.asyncContext.get('RAND'));
    console.log('service unknown:', this.asyncContext.get('ganadara'));
    return 'Hello World!';
  }
}
