export { auth as middleware } from "./auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/issues/:path*",
    "/api/issues/:path*",
    "/api/teams/:path*",
    "/api/projects/:path*"
  ]
};
