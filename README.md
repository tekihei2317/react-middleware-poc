# react-middleware-poc

tRPCのmiddlewareっぽいものをReactで作ってみました。条件に応じてコンポーネントを出し分けつつ、型を絞り込んだデータを次のミドルウェアやハンドラに渡すことができます。

## 使い方

`createMiddleware`でミドルウェアを作成し、`MiddlewareComponent`に登録します。

```tsx
// Middleware.tsx
import { useAuthContext } from "./Authentication";
import { initMiddleware } from "./lib/ReactMiddleware";

export function createMiddlewareContext() {
  const { userState } = useAuthContext();

  return { userState };
}

type Context = ReturnType<typeof createMiddlewareContext>;

const { MiddlewareComponent, createMiddleware } = initMiddleware<Context>();

const ensureLoggedIn = createMiddleware(({ ctx, next }) => {
  if (ctx.userState.isLoading) return <div>Loading...</div>;
  if (ctx.userState.user === undefined) return <div>ログインしてください</div>;

  // 次のミドルウェア or ハンドラを呼び出す
  return next({ ...ctx, user: ctx.userState.user });
});

export const AuthMiddleware = MiddlewareComponent.use(ensureLoggedIn).use(({ ctx, next }) => {
  if (ctx.user.type !== "admin") return <div>権限がありません</div>;
  return next({ ...ctx, user: ctx.user });
});
```

ミドルウェアコンポーネントの`children`に渡す関数のことをハンドラと呼ぶことにします。ハンドラの引数の`ctx`の型は、ミドルウェアを通過するごとに`next`に渡した値の型に変化します。

この例では、ハンドラの`ctx.user`は`AdminUser`型になっています。

```tsx
// App.tsx
function Main({ user }: { user: AdminUser }) {
  return (
    <div>
      <h1>トップページ</h1>
      <div>{user.userName}</div>
    </div>
  );
}

const AppContents = () => {
  const ctx = createMiddlewareContext();
  return (
    <>
      <DebugButtons />
      <AuthMiddleware ctx={ctx}>{(ctx) => <Main user={ctx.user} />}</AuthMiddleware>
    </>
  );
};

export default function App() {
  return (
    <AuthContextProvider>
      <AppContents />
    </AuthContextProvider>
  );
}
```
