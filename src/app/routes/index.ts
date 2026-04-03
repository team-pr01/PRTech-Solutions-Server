import { Router } from "express";
import { AuthRoute } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/users/users.route";
import { ClientRoutes } from "../modules/client/client.route";
import { AdminRoutes } from "../modules/admin/admin.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/client",
    route: ClientRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;