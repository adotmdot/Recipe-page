import { useState } from "react"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

import "./index.css";
import "./App.css";

import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import RecipeDetails from "./pages/RecipeDetails"
import Admin from "./pages/Admin"
import ChefChat from "./components/ChefChat";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {

  const [darkMode, setDarkMode] = useState(false)

  return (
    <BrowserRouter>

      <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-pink-50 min-h-screen"}>

      <nav className="navbar bg-purple-700 text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center w-full">

          <h1 className="text-3xl font-bold">
            Charlene AI Recipes
          </h1>

          <div className="nav-links">

            <Link to="/" className="hover:text-pink-200 transition">
              Home
            </Link>

            <Link to="/about" className="hover:text-pink-200 transition">
              About
            </Link>

            <Link to="/contact" className="hover:text-pink-200 transition">
              Contact
            </Link>

            <Link to="/admin" className="hover:text-pink-200 transition">
              Admin
            </Link>

            <Link to="/signup" className="hover:text-pink-200 transition">
              Signup
            </Link>

            <Link to="/login" className="hover:text-pink-200 transition">
              Login
            </Link>

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
              <Home />
              <ChefChat />
            </>
          }
        />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/recipe/:id" element={<RecipeDetails />} />

        <Route path="/admin" element={<Admin />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

      </Routes>

      </div>

    </BrowserRouter>
  )
}

export default App