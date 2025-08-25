import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { useAuth } from "../../context/AuthContext";
import {
  APP_STRINGS,
  BUTTON_STRINGS,
  MESSAGE_STRINGS,
  customThemes,
} from "../../utils";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, login, isLoading } = useAuth();

  useEffect(() => {
    // Initialize theme system for login page
    customThemes.getCurrentTheme();
  }, []);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
    } catch (err) {
      setError(MESSAGE_STRINGS.ERROR.INVALID_CREDENTIALS);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <MapPin className="w-8 h-8 text-[var(--color-primary)]" />
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                {APP_STRINGS.APP_NAME}
              </h1>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--color-text-primary)]">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
            {APP_STRINGS.APP_DESCRIPTION}
          </p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-8 border border-[var(--color-border)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                size="lg"
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                size="lg"
              />
            </div>

            {error && (
              <div className="p-3 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-[var(--radius-md)] text-[var(--color-error)] text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                size="lg"
              >
                {BUTTON_STRINGS.SIGN_IN}
              </Button>
            </div>
          </form>
        </div>

        <div className="text-center text-xs text-[var(--color-text-secondary)]">
          {APP_STRINGS.COPYRIGHT}
        </div>
      </div>
    </div>
  );
};
