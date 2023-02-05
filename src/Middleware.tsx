import { initComponentMiddleware } from "./lib/Middleware";
import { useAuthContext } from "./Authentication";

function createMiddlewareContext() {
  const { userState } = useAuthContext();

  return { userState };
}

export const { Component: MiddlewareComponent, defineMiddleware } =
  initComponentMiddleware(createMiddlewareContext);

const ensureUserIsLoggedIn = defineMiddleware((ctx, next) => {
  if (ctx.userState.isLoading) return <div>Loading...</div>;
  if (ctx.userState.user === undefined) return <div>ログインしてください</div>;

  return next({ ...ctx, user: ctx.userState.user });
});

const ensureUserIsAdmin = defineMiddleware((ctx, next) => {
  if (ctx.userState.user.type !== "admin") return <div>権限がありません</div>;

  return next({ ...ctx, user: ctx.userState.user });
});

MiddlewareComponent.use(ensureUserIsLoggedIn);
MiddlewareComponent.use(ensureUserIsAdmin);
