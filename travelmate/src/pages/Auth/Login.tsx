import React from "react";
import { Link } from "react-router-dom";
import { Plane } from "lucide-react";
import { motion } from "framer-motion";

import LoginForm from "./components/LoginForm";

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute inset-0 bg-black opacity-10"></div>

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to continue your journey</p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-sky-600 hover:text-sky-700 font-medium"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
