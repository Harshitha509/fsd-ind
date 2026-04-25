import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserCircle, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-dark-800/80 backdrop-blur-md border-b border-dark-700 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          JobTracker
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <div className="flex items-center space-x-2 text-slate-300">
              <UserCircle className="h-6 w-6 text-primary-500" />
              <span className="font-medium">{user.name}</span>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-slate-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;
