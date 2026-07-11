"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const users_route_1 = require("../modules/users/users.route");
const client_route_1 = require("../modules/client/client.route");
const admin_route_1 = require("../modules/admin/admin.route");
const project_routes_1 = require("../modules/project/project.routes");
const lead_routes_1 = require("../modules/lead/lead.routes");
const categories_route_1 = require("../modules/categories/categories.route");
const accounts_route_1 = require("../modules/accounts/accounts.route");
const staff_route_1 = require("../modules/staff/staff.route");
const niche_routes_1 = require("../modules/niche/niche.routes");
const query_routes_1 = require("../modules/query/query.routes");
const issue_routes_1 = require("../modules/issue/issue.routes");
const calendar_routes_1 = require("../modules/calendar/calendar.routes");
const blog_route_1 = require("../modules/blog/blog.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: users_route_1.userRoutes,
    },
    {
        path: "/admin",
        route: admin_route_1.AdminRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoute,
    },
    {
        path: "/client",
        route: client_route_1.ClientRoutes,
    },
    {
        path: "/project",
        route: project_routes_1.ProjectRoutes,
    },
    {
        path: "/lead",
        route: lead_routes_1.LeadRoutes,
    },
    {
        path: "/category",
        route: categories_route_1.CategoryRoutes,
    },
    {
        path: "/account",
        route: accounts_route_1.AccountRoutes,
    },
    {
        path: "/staff",
        route: staff_route_1.StaffRoutes,
    },
    {
        path: "/niche",
        route: niche_routes_1.NicheRoutes,
    },
    {
        path: "/query",
        route: query_routes_1.QueryRoutes,
    },
    {
        path: "/issue",
        route: issue_routes_1.IssueRoutes,
    },
    {
        path: "/calendar",
        route: calendar_routes_1.CalendarRoutes,
    },
    {
        path: "/blog",
        route: blog_route_1.BlogRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
