import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  const navLinks = (
    <>
      <Link to="/dashboard" onClick={closeMenu} className="hover:text-indigo-300">
        Dashboard
      </Link>
      <Link to="/courses" onClick={closeMenu} className="hover:text-indigo-300">
        Courses
      </Link>
      <Link to="/instructors" onClick={closeMenu} className="hover:text-indigo-300">
        Instructors
      </Link>

      {(role === "instructor" || role === "admin") && (
        <Link to="/my-courses" onClick={closeMenu} className="hover:text-indigo-300">
          My Courses
        </Link>
      )}

      {role === "admin" && (
        <>
          <Link to="/admin/users" onClick={closeMenu} className="hover:text-indigo-300">
            Manage Users
          </Link>
          <Link to="/admin/categories" onClick={closeMenu} className="hover:text-indigo-300">
            Manage Categories
          </Link>
        </>
      )}

      {(role === "instructor" || role === "admin") && (
        <Link to="/courses/create" onClick={closeMenu} className="hover:text-indigo-300">
          Create Course
        </Link>
      )}
    </>
  );

  return (
    <nav className="bg-indigo-950 border-b border-gray-100 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="text-lg md:text-2xl font-extrabold tracking-wide text-white">
          🎯TARGET
        </Link>

        {isAuthenticated && (
          <>
            {/* Desktop nav — md ebong tar upore dekha jabe */}
            <div className="hidden md:flex items-center text-white gap-6 text-sm md:text-base">
              {navLinks}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <span className="text-green-500">
                  {user?.username}{" "}
                  <span className="text-xs text-gray-400">({role})</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 font-medium"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Hamburger button — shudhu mobile e dekha jabe */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden text-white p-1"
              aria-label="Menu toggle korun"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {isAuthenticated && menuOpen && (
        <div className="md:hidden flex flex-col gap-4 text-white text-sm mt-4 pb-2">
          {navLinks}
          <div className="flex items-center justify-between pt-3 border-t border-indigo-800">
            <span className="text-green-500">
              {user?.username}{" "}
              <span className="text-xs text-gray-400">({role})</span>
            </span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>

    
  );
}
