import { Global, Module, DynamicModule } from '@nestjs/common';
import { AsyncContext } from './async-context';
import LRUCache, * as LRU from 'lru-cache';

@Global()
@Module({})
export class AsyncTraceModule {

  static forRoot(options?: LRUCache.Options<string, any> | null): DynamicModule {
    return {
      module: AsyncTraceModule,
      providers: [
        {
          provide: AsyncContext,
          useValue: AsyncContext.getInstance(options),
        },
      ],
      exports: [AsyncContext],
    };
  }
}
