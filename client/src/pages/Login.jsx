import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);
      const { token } = response.data.data;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 blur-3xl"></div>
        <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 opacity-20 blur-3xl"></div>
      </div>

      <Card className="relative w-full max-w-md border-0 shadow-2xl shadow-purple-500/10">
        {/* Gradient top border */}
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500"></div>

        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold">
            <span className="gradient-text">Welcome back</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:border-purple-400 focus:bg-white focus:ring-purple-400/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:border-purple-400 focus:bg-white focus:ring-purple-400/20 transition-all"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:from-violet-700 hover:to-indigo-700 transition-all"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-purple-600 underline-offset-4 hover:text-purple-700 hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
