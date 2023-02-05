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
          setUserState({ isLoading: false, user: { userName: "tekihei2317" } })
        }
      >
        ログイン済み
      </button>
    </div>
  );
};

export default function App() {
  return (
    <AuthContextProvider>
      <Debug />
      <AuthGuard>
        <Main />
      </AuthGuard>
    </AuthContextProvider>
  );
}
