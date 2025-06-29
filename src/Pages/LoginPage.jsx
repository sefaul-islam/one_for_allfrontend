import { useState } from 'react';
import authService from '../Services/authService';
import {jwtDecode} from 'jwt-decode';
import headingLogo from '../assets/headinglogo.jpg';
import LoginCard from '../Components/LoginCard';


export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!credentials.username || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Uncomment and use this when you have the authService set up:
      const result = await authService.login(credentials);
      
      if (result.success) {
        const token = result.data;
      
        const decoded = jwtDecode(token);

      // Redirect user based on role
      const roles = decoded.roles ;

     if (roles.includes('ROLE_ADMIN')) {
     window.location.href = '/admin';
     } else if (roles.includes('ROLE_FACULTY')) {
     window.location.href = '/faculty';
     } else if (roles.includes('ROLE_STUDENT')) {
     window.location.href = '/student';
     } else {
     window.location.href = '/dashboard';
     }
      } else {
        setError(result.message);
      }
     
      
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-gray-700 flex items-center justify-center px-4">
      <LoginCard
        logo={headingLogo}
        error={error}
        loading={loading}
        credentials={credentials}
        onInputChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onSubmit={handleSubmit}
      />
    </div>
  );
}