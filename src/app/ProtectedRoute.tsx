import React from "react";
import { useAppSelector } from "./reduxHooks";
import { Role } from "../types";
import { canAccess } from "../utils/accessControl";
import Unauthorized from "../components/ui/Unauthorized";

interface ProtectedRouteProps {
  requiredRoles: Role[];
  children: React.ReactNode;
}

const ProtectedRoute = ({ requiredRoles, children }: ProtectedRouteProps) => {
  const currentUser = useAppSelector(state => state.user.loggedInUser);

  if (currentUser && !canAccess(currentUser.role, requiredRoles)) {
    return <Unauthorized />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
