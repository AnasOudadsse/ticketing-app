import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RoleProtectedRoute({ children, allowedRoles }) {
    const userRole = localStorage.getItem('role');

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

