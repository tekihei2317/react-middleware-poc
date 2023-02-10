import { Navigate } from "react-router-dom";
import { useAuthContext } from "./authentication";
import { initMiddleware } from "./lib/react-middleware";

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
  if (!ctx.userState.user) return <Navigate to="/login" />;

  return next({ user: ctx.userState.user });
});

export const AuthMiddleware = MiddlewareComponent.use(ensureLoggedIn);

export const AdminMiddleware = AuthMiddleware.use(({ ctx, next }) => {
  if (ctx.user.type !== "admin") return <Unauthorized />;

  return next({ user: ctx.user });
});
