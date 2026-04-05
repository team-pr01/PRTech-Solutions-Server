import { Router } from "express";
import { AuthRoute } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/users/users.route";
import { ClientRoutes } from "../modules/client/client.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { ProjectRoutes } from "../modules/project/project.routes";
import { LeadRoutes } from "../modules/lead/lead.routes";
import { CategoryRoutes } from "../modules/categories/categories.route";

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
  {
    path: "/project",
    route: ProjectRoutes,
  },
  {
    path: "/lead",
    route: LeadRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;