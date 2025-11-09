import React, { useState } from "react";
import { Eye, EyeOff, Plane, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import {useAuth} from "../../../context/AuthContext.tsx";

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error("Invalid credentials. Try user@travelmate.com / user123");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
    >
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Plane className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to continue your journey</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Enter your email"
            />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-sky-600 hover:text-sky-700">Forgot password?</Link>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
      <div className="mt-6 p-4 bg-sky-50 rounded-lg">
        <h3 className="text-sm font-semibold text-sky-800 mb-2">Demo Credentials:</h3>
        <p className="text-xs text-sky-700">Email: user@travelmate.com</p>
        <p className="text-xs text-sky-700">Password: user123</p>
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-sky-600 hover:text-sky-700 font-medium">Sign up here</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginForm;

