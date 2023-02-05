import {
  AuthContextProvider,
  useAuthContext,
  useAuthenticatedUser,
} from "./Authentication";

function Main() {
  const user = useAuthenticatedUser();
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

const AuthGuard = ({ children }: { children: React.ReactElement }) => {
  const { userState } = useAuthContext();

  if (userState.isLoading) return <Loading />;
  if (userState.user === undefined) return <div>ログインしてください.</div>;
  return children;
};

const AdminOnly = ({ children }: { children: React.ReactElement }) => {
  const { userState } = useAuthContext();

  // assertしたい
  if (userState.isLoading || userState.user === undefined) {
    throw new Error("Please use this component inside AuthGuard");
  }

  if (userState.user.type === "general") {
    return <div>権限がありません</div>;
  }

  return children;
};

const Debug = () => {
  const { setUserState } = useAuthContext();

  return (
    <div>
      <button onClick={() => setUserState({ isLoading: true })}>
        ローディング
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
    </div>
  );
};

export default function App() {
  return (
    <AuthContextProvider>
      <Debug />
      <AuthGuard>
        <AdminOnly>
          <Main />
        </AdminOnly>
      </AuthGuard>
    </AuthContextProvider>
  );
}
