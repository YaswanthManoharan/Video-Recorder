import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import RecorderSwitcher from './components/RecorderSwitcher';
import Login from './components/Login';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <div className="flex flex-col min-h-screen">
      {isLoggedIn && <Header onLogout={handleLogout} showLogout={true} />}
      <main className="flex-grow">
        {isLoggedIn ? <RecorderSwitcher /> : <Login onLogin={handleLogin} />}
      </main>
      {isLoggedIn && <Footer />}
    </div>
  );
};

export default App;
