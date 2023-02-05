import { AuthContextProvider, useAuthContext } from "./Authentication";

function Main() {
  return <div>トップページ</div>;
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

export default function App() {
  return (
    <AuthContextProvider>
      <AuthGuard>
        <Main />
      </AuthGuard>
    </AuthContextProvider>
  );
}
