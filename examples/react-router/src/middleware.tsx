import { Navigate } from "react-router-dom";
import { useAuthContext } from "./authentication";
import { initMiddleware, MiddlewareComponent as IMiddlewareComponent } from "./lib/react-middleware";

export function useMiddlewareContext() {
  const authContext = useAuthContext();

  return { userState: authContext.userState };
}

type Context = ReturnType<typeof useMiddlewareContext>;

const { MiddlewareComponent, createMiddleware } = initMiddleware<Context>();

const Loading = () => <div>ローディング中...</div>;
const Unauthorized = () => <div>権限がありません</div>;

const ensureLoggedIn = createMiddleware(({ ctx, next }) => {
  if (ctx.userState.isLoading) return <Loading />;
  if (!ctx.userState.user) return <Navigate to="/login" replace />;

  return next({ user: ctx.userState.user });
});

const ensureNotLoggedIn = createMiddleware(({ ctx, next }) => {
  if (ctx.userState.isLoading) return <Loading />;
  if (ctx.userState.user !== undefined)
    return <Navigate to={ctx.userState.user.type == "admin" ? "/admin" : "/profile"} replace />;

  return next({ user: ctx.userState.user });
});

export const AuthMiddleware = MiddlewareComponent.use(ensureLoggedIn);

export const RestrictAuthenticatedUser = MiddlewareComponent.use(ensureNotLoggedIn);

export const AdminMiddleware = AuthMiddleware.use(({ ctx, next }) => {
  if (ctx.user.type !== "admin") return <Unauthorized />;

  return next({ user: ctx.user });
});

interface PageComponent<TContext> {
  ({ ctx }: { ctx: TContext }): JSX.Element;
  Middleware: IMiddlewareComponent<Context, TContext>;
}

export function RenderPage<TContext>({ page: Page }: { page: PageComponent<TContext> }) {
  return <Page.Middleware ctx={useMiddlewareContext()} component={Page} />;
}
