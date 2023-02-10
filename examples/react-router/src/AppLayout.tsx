import { Link } from "react-router-dom";
import { useAuthContext } from "./authentication";

const DebugButtons = () => {
  const { setUserState, userState } = useAuthContext();

  return (
    <div>
      <button onClick={() => setUserState({ isLoading: true })}>ローディング</button>
      <button onClick={() => setUserState({ isLoading: false, user: undefined })}>未ログイン</button>
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
      <span>{JSON.stringify(userState)}</span>
    </div>
  );
};

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <DebugButtons />
      <ul
        style={{
          display: "flex",
          gap: "1rem",
          paddingLeft: 0,
          paddingTop: "1rem",
          paddingBottom: "1rem",
          margin: 0,
          borderBottom: "1px solid gray",
        }}
      >
        <li style={{ listStyle: "none" }}>
          <Link to="/">トップ</Link>
        </li>
        <li style={{ listStyle: "none" }}>
          <Link to="/login">ログイン</Link>
        </li>
        <li style={{ listStyle: "none" }}>
          <Link to="/profile">プロフィール</Link>
        </li>
        <li style={{ listStyle: "none" }}>
          <Link to="/admin">管理者</Link>
        </li>
      </ul>
      <main style={{ padding: "1rem" }}>{children}</main>
    </div>
  );
};
