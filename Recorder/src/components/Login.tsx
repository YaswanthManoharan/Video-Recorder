import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Dictionary of users mapped to their passwords
  const users: Record<string, string> = {
    admin: 'admin',
    // Add more users as needed
    user1: 'password1',
    user2: 'password2',
  };

  const handleLogin = () => {
    // Authenticate the user
    if (users[username] && users[username] === password) {
      onLogin(); // Call the parent handler to update login status
    } else {
      alert('Invalid username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-12 shadow-lg rounded-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
