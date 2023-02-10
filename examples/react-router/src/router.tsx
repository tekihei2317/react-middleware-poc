import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { RenderPage } from "./middleware";
import { Admin } from "./pages/Admin";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Top } from "./pages/Top";

const router = createBrowserRouter([
  {
    path: "",
    element: (
      <AppLayout>
        <Top />
      </AppLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <AppLayout>
        <RenderPage page={Login} />
      </AppLayout>
    ),
  },
  {
    path: "/profile",
    element: (
      <AppLayout>
        <RenderPage page={Profile} />
      </AppLayout>
    ),
  },
  {
    path: "/admin",
    element: (
      <AppLayout>
        <RenderPage page={Admin} />
      </AppLayout>
    ),
  },
]);

export const AppRoutes = () => <RouterProvider router={router} />;
