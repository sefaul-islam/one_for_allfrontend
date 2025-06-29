import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRoles = decoded.roles || [];

    // If no role restriction, allow
    if (!allowedRoles || allowedRoles.length === 0) {
      return children;
    }

    // Check if user has any of the allowed roles
    const hasAccess = userRoles.some(role => allowedRoles.includes(role));

    return hasAccess ? children : <Navigate to="/unauthorized" replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
