import {
    type RouteConfig,
    route,
} from "@react-router/dev/routes";

export default [
  route("some/path", "./some/file.tsx"),
] satisfies RouteConfig;
