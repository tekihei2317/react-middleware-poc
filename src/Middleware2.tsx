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

export const AuthMiddleware = MiddlewareComponent.use(ensureLoggedIn);

// 目標
// const Layout createComponent().use(({ ctx, next}) => {
//  return next(newContext)
// })
// としたとき、
// <Layout>{((ctx) => ctx)}</Layout>
// のctxの型がtypeof newContextになっていること
