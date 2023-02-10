import { AdminMiddleware, useMiddlewareContext } from "../middleware";
import { InferHandlerProps } from "../lib/react-middleware";

export const AdminContents = ({ ctx }: InferHandlerProps<typeof AdminMiddleware>) => {
  return (
    <div>
      <p>管理者ページ</p>
      <p>{ctx.user.userName}</p>
    </div>
  );
};

export const Admin = () => {
  return <AdminMiddleware ctx={useMiddlewareContext()} component={AdminContents} />;
};
