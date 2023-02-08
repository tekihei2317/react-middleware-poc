// type ComponentMiddlewareProps = {
//   middlewares: any[];
//   children: (props: unknown) => any;
// };

// export const ComponentMiddleware = ({
//   children,
//   middlewares,
// }: ComponentMiddlewareProps) => {
//   let currentIndex = 0;

//   const next = (props: any) => {
//     const middleware = middlewares[currentIndex++];

//     if (middleware) return middleware(props, next);
//     else {
//       // 全てのミドルウェアを実行した場合
//       return children(props);
//     }
//   };

//   return next({});
// };

type CreateMiddlewareContext = () => unknown;

type ComponentProps = {
  children: (props: any) => any;
};

type Middleware = (ctx: any, next: CallNextMiddleware) => any;

type MiddlewareComponent = {
  use: (middleware: Middleware) => void;
};

type InitComponentMiddlewareReturn = {
  Component: MiddlewareComponent;
  defineMiddleware: (middleware: Middleware) => Middleware;
};

type CallNextMiddleware = (ctx: any) => any;

export function initComponentMiddleware(
  createMiddlewareContext: CreateMiddlewareContext
) {
  const Component = ({ children }: ComponentProps) => {
    const ctx = createMiddlewareContext();
    let index = 0;

    const next = (ctx: any) => {
      const middleware = Component.middlewares[index++];

      if (middleware) {
        return middleware(ctx, next);
      } else {
        return children(ctx);
      }
    };

    return next(ctx);
  };

  Component.middlewares = [] as Middleware[];
  Component.use = function (middleware: Middleware) {
    Component.middlewares.push(middleware);
  };

  const defineMiddleware = (middleware: Middleware) => middleware;

  return {
    Component,
    defineMiddleware,
  } satisfies InitComponentMiddlewareReturn;
}
