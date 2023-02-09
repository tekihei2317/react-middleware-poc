import { Link } from "react-router-dom";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
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
