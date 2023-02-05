import { useReducer } from "react";
import {
  AdminUser,
  AuthContextProvider,
  useAuthContext,
  User,
} from "./Authentication";

function Main({ user }: { user: AdminUser }) {
  return (
    <div>
      <h1>トップページ</h1>
      <div>{user.userName}</div>
      <div>{JSON.stringify(user)}</div>
    </div>
  );
}

const Loading = () => {
  return <div>Loading...</div>;
};

type AuthenticationProps = {
  children: (user: User) => JSX.Element;
};

const Authentication = ({ children }: AuthenticationProps) => {
  const { userState } = useAuthContext();

  if (userState.isLoading) return <Loading />;
  if (userState.user === undefined) return <div>ログインしてください.</div>;
  return children(userState.user);
};

type AdminOnlyProps = {
  user: User;
  children: (user: AdminUser) => JSX.Element;
};

const AdminOnly = ({ user, children }: AdminOnlyProps) => {
  if (user.type === "general") {
    return <div>権限がありません</div>;
  }

  return children(user);
};

const Debug = () => {
  const { setUserState } = useAuthContext();

  return (
    <div>
      <button onClick={() => setUserState({ isLoading: true })}>
        ローディング
      </button>
      <button
        onClick={() =>
          setUserState({
            isLoading: false,
            user: { type: "general", userName: "tekihei2317", userId: 1 },
          })
        }
      >
        一般ユーザー
      </button>
      <button
        onClick={() => setUserState({ isLoading: false, user: undefined })}
      >
        未ログイン
      </button>
      <button
        onClick={() =>
          setUserState({
            isLoading: false,
            user: { type: "admin", userName: "tekihei2317" },
          })
        }
      >
        管理者ユーザー
      </button>
    </div>
  );
};

type ComponentMiddlewareProps = {
  middlewares: any[];
  children: (props: unknown) => any;
};

const ComponentMiddleware = ({
  children,
  middlewares,
}: ComponentMiddlewareProps) => {
  const [currentIndex, increment] = useReducer((prev) => prev + 1, 0);

  const next = (props: any) => {
    const middleware = middlewares[currentIndex];
    increment();

    if (middleware) return middleware(props, next);
    else {
      // 全てのミドルウェアを実行した場合
      return children(props);
    }
  };

  const result = next({});
  console.log({ result });
  return result;
};

export default function App() {
  const { userState } = useAuthContext();

  const middlewares = [
    (props, next) => {
      console.log("middleware called");
      console.log({ userState });

      if (userState.isLoading) return <Loading />;
      if (userState.user === undefined) return <div>ログインしてください.</div>;

      console.log({ user: userState.user });

      // return next({ ...props, user: userState.user });
      return next({ hoge: "hoge" });
    },
  ];

  return (
    <AuthContextProvider>
      <Debug />
      <Authentication>
        {(user) => (
          <AdminOnly user={user}>
            {(adminUser) => <Main user={adminUser} />}
          </AdminOnly>
        )}
      </Authentication>
      {/* <ComponentMiddleware middlewares={middlewares}>
        {(props) => JSON.stringify(props)}
      </ComponentMiddleware> */}
    </AuthContextProvider>
  );
}
