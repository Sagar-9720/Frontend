import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {authService} from "../../../services/api.ts";

const VerifyEmailForm: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (!token) {
      setMessage("Invalid verification link.");
      setLoading(false);
      return;
    }
    authService
      .verifyEmail(token)
      .then(() => {
        setMessage("Email verified successfully!");
      })
      .catch(() => {
        setMessage("Verification failed or token expired.");
      })
      .finally(() => setLoading(false));
  }, [location.search]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {loading ? (
        <div>Verifying email...</div>
      ) : (
        <div>{message}</div>
      )}
    </div>
  );
};

export default VerifyEmailForm;

