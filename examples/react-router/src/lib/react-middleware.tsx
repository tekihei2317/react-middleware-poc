// コンテキストを型推論するときに、nextに渡す値とreturnする値を区別するために、_okを追加
type MiddlewareSuccessResult<TContext> = TContext & { _ok: true };
type MiddlewareErrorResult = JSX.Element;

type MiddlewareResult<TContext> = MiddlewareSuccessResult<TContext> | MiddlewareErrorResult;

type MiddlewareFunctionParams<TContext> = {
  ctx: TContext;
  next: <TNewContext>(newContext: TNewContext) => MiddlewareSuccessResult<TNewContext>;
};

type MiddlewareFunction<TContext, TNewContext> = (
  params: MiddlewareFunctionParams<TContext>
) => MiddlewareResult<TNewContext>;

function createMiddlewareFactory<TContext>() {
  function createMiddleware<TNewContext>(fn: MiddlewareFunction<TContext, TNewContext>) {
    return fn;
  }

  return createMiddleware;
}

type MiddlewareComponentProps<TInputContext, TOutputContext> = {
  ctx: TInputContext;
  component: ({ ctx }: { ctx: TOutputContext }) => JSX.Element;
};

type AnyMiddlewareFunction = MiddlewareFunction<any, any>;

export interface MiddlewareComponent<TInputContext, TOutputContext> {
  (props: MiddlewareComponentProps<TInputContext, TOutputContext>): JSX.Element;
  _middlewares: AnyMiddlewareFunction[];
  use: <TNewContext>(
    fn: MiddlewareFunction<TOutputContext, TNewContext>
  ) => MiddlewareComponent<TInputContext, TNewContext>;
}

function createMiddlewareComponent<TInputContext, TOutputContext = TInputContext>(
  middlewares?: AnyMiddlewareFunction[]
): MiddlewareComponent<TInputContext, TOutputContext> {
  const MiddlewareComponent = ({ ctx, component }: MiddlewareComponentProps<TInputContext, TOutputContext>) => {
    let index = 0;

    const next = (ctx: unknown) => {
      const middleware = MiddlewareComponent._middlewares[index++];

      if (middleware) return middleware({ ctx, next });
      return component({ ctx: ctx as TOutputContext });
    };

    return next(ctx);
  };

  MiddlewareComponent._middlewares = middlewares ? middlewares : [];

  MiddlewareComponent.use = function <TNewContext>(fn: MiddlewareFunction<TOutputContext, TNewContext>) {
    return createMiddlewareComponent<TInputContext, TNewContext>([...MiddlewareComponent._middlewares, fn]);
  };

  return MiddlewareComponent;
}

export function initMiddleware<Context>() {
  return {
    MiddlewareComponent: createMiddlewareComponent<Context>(),
    createMiddleware: createMiddlewareFactory<Context>(),
  };
}

type InferMiddlewareOutput<T extends MiddlewareComponent<any, any>> = T extends MiddlewareComponent<any, infer U>
  ? U
  : never;

export type InferHandlerProps<T extends MiddlewareComponent<any, any>> = {
  ctx: InferMiddlewareOutput<T>;
};
