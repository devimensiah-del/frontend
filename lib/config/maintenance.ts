/**
 * Maintenance Mode Configuration
 *
 * Set NEXT_PUBLIC_MAINTENANCE_MODE=true to enable maintenance mode.
 * Only the landing page will be accessible during maintenance.
 */

export const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

/** Routes that are accessible during maintenance */
export const MAINTENANCE_ALLOWED_ROUTES = [
  "/",
  "/privacidade",
  "/termos",
];

/** Check if a route is allowed during maintenance */
export function isRouteAllowedDuringMaintenance(pathname: string): boolean {
  return MAINTENANCE_ALLOWED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
