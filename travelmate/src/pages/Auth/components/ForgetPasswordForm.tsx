import React, { useState } from "react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";

const ForgetPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgetPassword(email);
      toast.success("Password reset link sent to your email.");
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Enter your email"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
};

export default ForgetPasswordForm;

