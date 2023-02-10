import { RestrictAuthenticatedUser } from "../middleware";

export const Login = () => {
  return <div>ログインページ</div>;
};

Login.Middleware = RestrictAuthenticatedUser;
