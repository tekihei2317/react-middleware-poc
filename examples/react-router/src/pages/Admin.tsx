import { AdminMiddleware } from "../middleware";
import { InferHandlerProps } from "../lib/react-middleware";

export const Admin = ({ ctx }: InferHandlerProps<typeof AdminMiddleware>) => {
  return (
    <div>
      <p>管理者ページ</p>
      <p>{ctx.user.userName}</p>
    </div>
  );
};

Admin.Middleware = AdminMiddleware;
