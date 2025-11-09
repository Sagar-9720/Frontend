import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { Form } from "../../components/common/Form";
import {
    APP_STRINGS,
    BUTTON_STRINGS,
    MESSAGE_STRINGS,
    customThemes,
    logger,
    PLACEHOLDER_STRINGS,
    FORM_LABELS,
    INPUT_TYPES
} from "../../utils";

const log = logger.forSource('LoginPage');

interface LoginFormValues {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const auth = useAuth();
  const user = auth?.user || null;
  const loginFn = auth?.login;
  const isLoading = auth?.isLoading || false;

  useEffect(() => {
    try {
      customThemes.getCurrentTheme();
      log.info('Login page mounted');
    } catch (error) {
      log.error('Failed to init theme on login page', error as unknown);
    }
  }, []);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (vals: LoginFormValues) => {
    setError("");
    try {
      const success = await (loginFn ? loginFn(vals.email, vals.password) : Promise.resolve(false));
      if (!success) {
        setError(MESSAGE_STRINGS.ERROR.INVALID_CREDENTIALS);
        log.warn('Login unsuccessful', { email: vals.email });
      } else {
        log.info('Login successful', { email: vals.email });
      }
    } catch (err) {
      log.error('Login exception', err as unknown);
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
              {PLACEHOLDER_STRINGS.SIGN_IN_TO_YOUR_ACCOUNT}
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
            {APP_STRINGS.APP_DESCRIPTION}
          </p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-8 border border-[var(--color-border)]">
          <Form
            fields={[
              { name: 'email', label: FORM_LABELS.EMAIL, type: INPUT_TYPES.EMAIL, required: true },
              { name: 'password', label: FORM_LABELS.PASSWORD, type: INPUT_TYPES.PASSWORD, required: true }
            ]}
            value={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            submitting={isLoading}
            submitLabel={BUTTON_STRINGS.SIGN_IN}
            renderActions={({ submitting }) => (
              <div className="space-y-4">
                {error && (
                  <div className="p-3 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-[var(--radius-md)] text-[var(--color-error)] text-sm text-center">
                    {error}
                  </div>
                )}
                <Button
                  type={INPUT_TYPES.SUBMIT}
                  className="w-full"
                  loading={submitting}
                  size="lg"
                >
                  {BUTTON_STRINGS.SIGN_IN}
                </Button>
              </div>
            )}
          />
        </div>

        <div className="text-center text-xs text-[var(--color-text-secondary)]">
          {APP_STRINGS.COPYRIGHT}
        </div>
      </div>
    </div>
  );
};
