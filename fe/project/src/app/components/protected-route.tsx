import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
    allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const userString = localStorage.getItem("ACCESS_TOKEN");
    const user = userString ? JSON.parse(userString) : null;

    if (!user) {
        return <Navigate to="/" replace />;
    }

    const hasPermission = allowedRoles.includes(user.role);

    if (!hasPermission) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}