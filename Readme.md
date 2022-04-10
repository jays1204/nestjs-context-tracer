# nestjs-context-tracer
Trace each http context of your nest.js application.
This enable to trace http request by unique id. Each request has unique Id and You can get id on controller, service, dao, anywhere.


# Usage
## Configuration

`Add module and set middleware` 
- configure middleware for every http method and path

### example 
- app.module.ts
```ts
import { AsyncTraceIdMiddleware, AsyncTraceModule } from 'nestjs-context-tracer';

@Module({
  imports: [ AsyncTraceModule ],
  controllers: [AppController],
  ...
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AsyncTraceIdMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
```

## Get Trace Id
`Use getTraceId method of AsyncContext `

### `asyncContext.getTraceId(): string | null`

example
- app.controller.ts

```ts
import { AsyncContext } from 'nestjs-context-tracer';

@Controller()
export class AppController {
  constructor(
    private readonly asyncContext: AsyncContext
  ) {}

  @Get()
  getHello(): string {
    console.log('begin trace-id:', this.asyncContext.getTraceId());
    ....
  }
```
You can see unique begin trace-id output by each http request.
trace-id is generated by uuid v4.


## Set & Get For Custom data
You can set any data and get by this library.


### `asyncContext.set(key, value): void`

Arguments:

* **key** `string`
* **value** `unknown`

example
```ts
asyncContext.set('role', 'ADMIN');
```

### `asyncContext.get(key): unknown`

Arguments:

* **key** `string`

example
```ts
const userRole = asyncContext.get('role');
```


## Important Note
### Performance Issue
This library based on [AsyncLocalStorage](https://nodejs.org/docs/latest-v14.x/api/async_hooks.html#async_hooks_class_asynclocalstorage)
AsyncLocalStorage tend to drop application performance.
Drop rate is different by node.js version. It recommends to use v16.2 or above version.
If you want to see more information see this [issue](https://github.com/nodejs/node/issues/34493#issuecomment-845094849). 

### Context loss
If your code is based on callback, not promsie, you must read this [document](https://nodejs.org/dist/latest-v16.x/docs/api/async_context.html#troubleshooting-context-loss). 

---
This library inspired by https://github.com/nestjs/nest/pull/1407

## License

MIT
