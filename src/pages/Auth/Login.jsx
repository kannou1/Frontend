import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  GraduationCap,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/users`;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetError, setResetError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setSuccess("Login successful! Redirecting...");

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setTimeout(() => {
        const role = data.user?.role;
        switch (role) {
          case "admin":
            window.location.href = "/admin/";
            break;
          case "enseignant":
            window.location.href = "/teacher/";
            break;
          case "etudiant":
            window.location.href = "/student/";
            break;
          default:
            window.location.href = "/login";
        }
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      if (
        err.message.includes("Invalid") ||
        err.message.includes("incorrect")
      ) {
        setError("Invalid email or password");
      } else if (err.message.includes("fetch")) {
        setError(
          "Unable to connect to server. Please check if the backend is running."
        );
      } else {
        setError(err.message || "An error occurred during login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-cyan-600/30 rounded-full blur-3xl animate-pulse opacity-40"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tr from-pink-600/30 via-purple-600/30 to-blue-600/30 rounded-full blur-3xl animate-pulse opacity-40"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse opacity-30"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      <Card className="w-full max-w-md border border-slate-800/50 backdrop-blur-xl bg-slate-900/60 shadow-2xl shadow-purple-900/20 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-600/10 pointer-events-none"></div>

        <CardHeader className="space-y-4 text-center pb-8 relative">
          <div className="flex justify-center mb-2">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              <div
                className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-50 animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>

              <div className="relative h-24 w-24 rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-500 border border-white/20">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                <GraduationCap className="h-12 w-12 text-white relative z-10 drop-shadow-lg" />
                <Sparkles className="absolute top-2 right-2 h-4 w-4 text-cyan-300 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                <Sparkles
                  className="absolute bottom-2 left-2 h-3 w-3 text-purple-300 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ animationDelay: "0.5s" }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-400 text-base">
              Enter your credentials to access your portal
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative">
          {error && (
            <Alert className="bg-red-950/50 text-red-300 border-red-800/50 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-emerald-950/50 text-emerald-300 border-emerald-800/50 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <AlertDescription className="font-medium text-emerald-200">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-slate-300"
              >
                Email Address
              </Label>
              <div className="relative group">
                <Mail
                  className={`absolute left-3 top-3.5 h-5 w-5 transition-all duration-300 ${
                    focusedField === "email"
                      ? "text-blue-400 scale-110"
                      : "text-slate-500 group-hover:text-slate-400"
                  }`}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  className={`pl-10 h-12 text-base bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 
                    focus:bg-slate-800/70 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                    transition-all duration-300 backdrop-blur-sm
                    ${
                      errors.email
                        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }
                    ${
                      focusedField === "email"
                        ? "shadow-lg shadow-blue-500/10"
                        : ""
                    }`}
                  disabled={loading}
                />
                {focusedField === "email" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-md -z-10 blur-xl"></div>
                )}
              </div>
              {errors.email && (
                <p className="text-sm text-red-400 flex items-center gap-1 animate-in slide-in-from-top-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-300"
                >
                  Password
                </Label>
                <button
                  type="button"
                  className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors hover:underline"
                  onClick={() => navigate("/Forget")}
                >
                  Forget password?
                </button>
              </div>
              <div className="relative group">
                <Lock
                  className={`absolute left-3 top-3.5 h-5 w-5 transition-all duration-300 ${
                    focusedField === "password"
                      ? "text-purple-400 scale-110"
                      : "text-slate-500 group-hover:text-slate-400"
                  }`}
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  className={`pl-10 h-12 text-base bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500
                    focus:bg-slate-800/70 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20
                    transition-all duration-300 backdrop-blur-sm
                    ${
                      errors.password
                        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }
                    ${
                      focusedField === "password"
                        ? "shadow-lg shadow-purple-500/10"
                        : ""
                    }`}
                  disabled={loading}
                />
                {focusedField === "password" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-md -z-10 blur-xl"></div>
                )}
              </div>
              {errors.password && (
                <p className="text-sm text-red-400 flex items-center gap-1 animate-in slide-in-from-top-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <Button
                onClick={handleSubmit}
                className="relative w-full h-13 text-base font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-500 
                  text-white shadow-xl shadow-purple-900/30 hover:shadow-2xl hover:shadow-purple-900/50
                  transition-all duration-300 border-0 group overflow-hidden"
                disabled={loading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                {loading ? (
                  <div className="flex items-center justify-center relative z-10">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center relative z-10">
                    <span>Sign In</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900/60 backdrop-blur-sm px-3 text-slate-500 font-semibold tracking-wider">
                EduNex Portal
              </span>
            </div>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <button
              type="button"
              className="font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-cyan-300 transition-all"
              onClick={() => alert("Sign up functionality")}
            >
              Create one now
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
