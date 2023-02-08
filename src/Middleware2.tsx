import { useAuthContext } from "./Authentication";
import { initMiddleware } from "./lib/ReactMiddleware";

function createMiddlewareContext() {
  const { userState } = useAuthContext();

  return { userState };
}

type Context = ReturnType<typeof createMiddlewareContext>;

const { MiddlewareComponent, createMiddleware } = initMiddleware<Context>();

const ensureLoggedIn = createMiddleware(({ ctx, next }) => {
  if (ctx.userState.isLoading) return <div>Loading...</div>;
  if (ctx.userState.user === undefined) return <div>ログインしてください</div>;

  return next({ ...ctx, user: ctx.userState.user });
});

// const ensureUserIsAdmin = ensureLoggedIn.pipe(...)みたいにしたい

export const AuthMiddleware = MiddlewareComponent.use(ensureLoggedIn).use(({ ctx, next }) => {
  if (ctx.user.type !== "admin") return <div>権限がありません</div>;
  return next({ ...ctx, user: ctx.user });
});
