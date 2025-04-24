import { Routes, Route } from "react-router-dom"
import "./css/App.css"
import Home from "./pages/Home"
import Favorites from "./pages/Favorites"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import VerifyOTP from "./pages/VerifyOTP"
import Watchlist from "./pages/Watchlist"
import NavBar from "./components/NavBar"
import { MovieProvider } from "./contexts/MovieContext"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <MovieProvider>
        <main className="main-content">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/watchlist"
              element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </MovieProvider>
    </AuthProvider>
  )
}

export default App
