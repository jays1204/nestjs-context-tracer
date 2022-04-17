import { Global, Module, DynamicModule } from '@nestjs/common';
import { AsyncContext } from './async-context';

@Global()
@Module({})
export class AsyncTraceModule {

  static forRoot(): DynamicModule {
    return {
      module: AsyncTraceModule,
      providers: [ 
        {
          provide: AsyncContext,
          useValue: new AsyncContext(),
        },
      ],
      exports: [AsyncContext],
    };
  }
}
