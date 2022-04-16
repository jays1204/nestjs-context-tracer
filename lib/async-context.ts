import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AsyncLocalStorage } from 'async_hooks';
import { AsyncTraceError } from './async-trace-error';
import LRUCache, * as LRU from 'lru-cache';


const DEFAULT_LRU_OPTIONS: LRUCache.Options<string, any> = {
  ttl: 1000 * 60 * 5,
  max: 500,
  updateAgeOnGet: false,
};

export class AsyncContext implements OnModuleDestroy {
  private static _instance: AsyncContext;
  private readonly TRACE_ID_NAME: string = "traceId";

  private constructor(
    private readonly internalStorage: LRUCache<string, any>,
    private readonly asyncLocalStorage
  ) {
  }

  static getInstance(options: LRUCache.Options<string, any>): AsyncContext {
    if (!this._instance) {
      this.initialize(options ? options : DEFAULT_LRU_OPTIONS);
    }
    return this._instance;
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
    return this.asyncLocalStorage.run(this.internalStorage, () => {
      const traceId = randomUUID();
      const store: Map<string, unknown> = this.asyncLocalStorage.getStore();
      store.set(this.TRACE_ID_NAME, traceId);
      return fn();
    });
  }

  private static initialize(options: LRUCache.Options<string, any>) {
    const storage: LRUCache<string, any> = new LRU(options);
    this._instance = new AsyncContext(storage, new AsyncLocalStorage());
  }
}
