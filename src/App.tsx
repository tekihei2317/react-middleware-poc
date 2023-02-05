import {
  AdminUser,
  AuthContextProvider,
  useAuthContext,
} from "./Authentication";
import { MiddlewareComponent } from "./Middleware";

function Main({ user }: { user: AdminUser }) {
  return (
    <div>
      <h1>トップページ</h1>
      <div>{user.userName}</div>
    </div>
  );
}

const DebugButtons = () => {
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
            user: { type: "general", userName: "tekihei2317", userId: 1 },
          })
        }
      >
        一般ユーザー
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
      <DebugButtons />
      <MiddlewareComponent>
        {(props) => <Main user={props.user} />}
      </MiddlewareComponent>
    </AuthContextProvider>
  );
}
