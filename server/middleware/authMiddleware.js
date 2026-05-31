import { AuthService } from "../services/AuthService.js";
import { httpError } from "../utils/httpError.js";

export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw httpError(401, "Authentication token is required.");
    }

    req.user = await AuthService.verifyToken(token);
    next();
  } catch (error) {
    next(error);
  }
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    const allowed = roles.map((role) => role.toUpperCase());

    if (!req.user || !allowed.includes(req.user.role)) {
      return next(httpError(403, "You do not have permission to perform this action."));
    }

    return next();
  };
}
