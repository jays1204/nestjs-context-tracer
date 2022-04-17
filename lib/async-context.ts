import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AsyncLocalStorage } from 'async_hooks';
import { AsyncTraceError } from './async-trace-error';


export class AsyncContext implements OnModuleDestroy {
  private readonly asyncLocalStorage: AsyncLocalStorage<any>;
  private readonly TRACE_ID_NAME: string = "traceId";

  constructor() {
    this.asyncLocalStorage = new AsyncLocalStorage();
  }

  onModuleDestroy() {
    this.asyncLocalStorage.disable();
  }

  set(key: string, value: unknown): void {
    const store: Map<string, unknown> = this.asyncLocalStorage.getStore();
    if (!store) {
      throw new AsyncTraceError('EMPTY_STORE_ON_SET');
    }
    store.set(key, value);
  }

  get(key: string): unknown {
    const store: Map<string, unknown> = this.asyncLocalStorage.getStore();
    if (!store) {
      throw new AsyncTraceError('EMPTY_STORE_ON_SET');
    }
    return store.get(key);
  }

  getTraceId(): string | null {
    // @ts-ignore 
    return this.get(this.TRACE_ID_NAME) || null;
  }

  run(fn: Function) {
    const storage = new Map<string, unknown>();
    return this.asyncLocalStorage.run(storage, () => {
      const traceId = randomUUID();
      const store: Map<string, unknown> = this.asyncLocalStorage.getStore();
      store.set(this.TRACE_ID_NAME, traceId);
      return fn();
    });
  }

}
