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
    </div>
  );
}

const Loading = () => {
  return <div>Loading...</div>;
};

type AuthenticationProps = {
  children: (user: User) => React.ReactElement;
};

const Authentication = ({ children }: AuthenticationProps) => {
  const { userState } = useAuthContext();

  if (userState.isLoading) return <Loading />;
  if (userState.user === undefined) return <div>ログインしてください.</div>;
  return children(userState.user);
};

type AdminOnlyProps = {
  user: User;
  children: (user: AdminUser) => React.ReactElement;
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

export default function App() {
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
    </AuthContextProvider>
  );
}
