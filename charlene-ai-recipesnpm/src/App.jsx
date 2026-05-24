import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import "./index.css";
import "./App.css";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import RecipeDetails from "./pages/RecipeDetails";
import Admin from "./pages/Admin";
import ChefChat from "./components/ChefChat";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {

  const [darkMode, setDarkMode] = useState(false);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  )

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <BrowserRouter>

      <div
        className={
          darkMode
            ? "bg-gray-900 text-white min-h-screen"
            : "bg-pink-50 min-h-screen"
        }
      >

        <nav className="navbar bg-purple-700 text-white shadow-lg">

          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center w-full">

            <h1 className="text-3xl font-bold">
              Charlene AI Recipes
            </h1>

            <div className="nav-links flex gap-5 items-center">

              <Link to="/">Home</Link>

              <Link to="/about">About</Link>

              <Link to="/contact">Contact</Link>

              {user && (
                <Link to="/admin">
                  Admin
                </Link>
              )}

              {!user ? (
                <>
                  {!user ? (
                    <>
                      <Link to="/signup" className="hover:text-pink-200 transition">
                        Signup
                      </Link>

                      <Link to="/login" className="hover:text-pink-200 transition">
                        Login
                      </Link>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">
                        👋 {user.username}
                      </span>

                      <button
                        onClick={() => {
                          localStorage.removeItem("token")
                          localStorage.removeItem("user")
                          setUser(null)
                          window.location.href = "/"
                        }}
                        className="bg-red-500 px-4 py-2 rounded-full"
                      >
                        Sign Out
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <span className="font-semibold">
                    👤 {user.username}
                  </span>

                  <button
                    onClick={logout}
                    className="bg-red-500 px-4 py-2 rounded-full"
                  >
                    Logout
                  </button>
                </>
              )}

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="bg-white text-purple-700 px-4 py-2 rounded-full font-semibold hover:scale-105 transition"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>

            </div>

          </div>

        </nav>

        <Routes>

          <Route
            path="/"
            element={
              <>
                <Home darkMode={darkMode} />
                <ChefChat darkMode={darkMode} />
              </>
            }
          />

          <Route
            path="/about"
            element={<About darkMode={darkMode} />}
          />

          <Route
            path="/contact"
            element={<Contact darkMode={darkMode} />}
          />

          <Route
            path="/admin"
            element={<Admin darkMode={darkMode} user={user} />}
          />

          <Route
            path="/signup"
            element={<Signup darkMode={darkMode} />}
          />

          <Route
            path="/login"
            element={<Login darkMode={darkMode} />}
          />

          <Route
            path="/recipe/:id"
            element={<RecipeDetails darkMode={darkMode} />}
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;