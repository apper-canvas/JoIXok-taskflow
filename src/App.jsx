import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut } from "lucide-react";
import { motion } from "framer-motion";

import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { isAuthenticated, getCurrentUser, logout } from "./services/ApperService";
import UserPreferenceService from "./services/UserPreferenceService";

// Protected route wrapper component
const ProtectedRoute = ({ children }) => {
  const authenticated = isAuthenticated();

  if (!authenticated) {
    return <Navigate to="/login" replace />;

  }
  return children;
};

function App() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Handle initial authentication check and theme loading
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Load theme preference from database if authenticated
    const loadThemePreference = async () => {
      try {
        if (currentUser) {
          const themePreference = await UserPreferenceService.fetchThemePreference();
          setDarkMode(themePreference === "dark");
        } else {
          // Use browser preference if not logged in
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          setDarkMode(prefersDark);

        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setDarkMode(prefersDark);
      } finally {
        setIsLoading(false);

      }
    };

    loadThemePreference();
  }, []);

  // Apply theme changes and save to database
  useEffect(() => {
    if (isLoading) return;

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");

    }
    // Save theme preference to database if authenticated
    if (user) {
      UserPreferenceService.saveThemePreference(darkMode ? "dark" : "light")
        .catch(error => console.error("Error saving theme preference:", error));
    } else {
      // Save to localStorage if not authenticated
      localStorage.setItem("theme", darkMode ? "dark" : "light");

    }
  }, [darkMode, isLoading, user]);

  // Handle logout
  const handleLogout = () => {
    logout(() => {
      setUser(null);
      navigate("/login");
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );


  } return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border-b border-surface-200 dark:border-surface-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{
                rotate: -10
              }} animate={{
                rotate: 0
              }} className="text-primary font-bold text-2xl"
            >
              TaskFlow
            </motion.div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <button
                onClick={handleLogout
                } className="p-2 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors text-surface-600"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            )
            }
            <motion.button
              whileTap={{
                scale: 0.9
              }} onClick={() => setDarkMode(!darkMode)
              } className="p-2 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-surface-600" />
              )
              }            </motion.button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="py-4 border-t border-surface-200 dark:border-surface-800 text-center text-sm text-surface-500">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );


} export default App;