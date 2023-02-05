import {
  AdminUser,
  AuthContextProvider,
  useAuthContext,
} from "./Authentication";

function Main({ user }: { user: AdminUser }) {
  return (
    <div>
      <h1>トップページ</h1>
      <div>{user.userName}</div>
    </div>
  );
}

const Loading = () => {
  return <div>Loading...</div>;
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
  let currentIndex = 0;

  const next = (props: any) => {
    const middleware = middlewares[currentIndex++];

    if (middleware) return middleware(props, next);
    else {
      // 全てのミドルウェアを実行した場合
      return children(props);
    }
  };

  return next({});
};

const AppContents = () => {
  const { userState } = useAuthContext();

  const middlewares = [
    (props, next) => {
      if (userState.isLoading) return <Loading />;
      if (userState.user === undefined) return <div>ログインしてください.</div>;

      return next({ ...props, user: userState.user });
    },
    (props, next) => {
      if (props.user.type !== "admin") return <div>権限がありません</div>;
      return next({ ...props, user: props.user });
    },
  ];

  return (
    <>
      <Debug />
      <ComponentMiddleware middlewares={middlewares}>
        {(props) => <Main user={props.user} />}
      </ComponentMiddleware>
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
