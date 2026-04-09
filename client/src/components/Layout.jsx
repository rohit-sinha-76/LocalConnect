import { Link, useNavigate } from "react-router-dom";

function decodeToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { id: payload.id, role: payload.role };
  } catch {
    return null;
  }
}

export default function Layout({ children }) {
  const navigate = useNavigate();
  const user = decodeToken();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30">
      {/* Gradient Navbar */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 shadow-lg shadow-purple-500/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <Link
            to="/"
            className="text-xl font-bold text-white tracking-tight hover:text-purple-100 transition-colors"
          >
            <span className="text-yellow-300">Local</span>Connect
          </Link>

          <nav className="flex items-center gap-5">
            <Link
              to="/workers"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Workers
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm hover:bg-purple-50 transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 py-4 text-center text-sm text-white/70">
        &copy; {new Date().getFullYear()} <span className="text-yellow-300 font-medium">LocalConnect</span> — Connecting you with local talent
      </footer>
    </div>
  );
}
