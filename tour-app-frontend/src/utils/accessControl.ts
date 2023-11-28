import { Role } from "../types";

export const canAccess = (userRole: Role, requiredRoles: Role[]): boolean => {
  return requiredRoles.includes(userRole);
};
