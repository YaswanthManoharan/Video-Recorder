import React from 'react';
import { FiLogOut } from 'react-icons/fi'; // Importing a logout icon from react-icons

interface HeaderProps {
  onLogout: () => void;
  showLogout: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLogout, showLogout }) => {
  return (
    <header className="bg-blue-500 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">My Video Recorder App</h1>
        {showLogout && (
          <button
            onClick={onLogout}
            className="w-10 h-10 flex items-center justify-center bg-red-500 rounded-full hover:bg-red-600 transition duration-300"
            aria-label="Logout"
          >
            <FiLogOut className="text-white text-xl" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
