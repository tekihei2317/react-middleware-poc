import { InferHandlerProps } from "../lib/react-middleware";
import { AuthMiddleware } from "../middleware";

export const Profile = ({ ctx }: InferHandlerProps<typeof AuthMiddleware>) => {
  return (
    <div>
      <p>プロフィール</p>
      <p>{ctx.user.userName}</p>
    </div>
  );
};

Profile.Middleware = AuthMiddleware;
