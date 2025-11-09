import React from "react";
import RegisterForm from "./components/RegisterForm";

export const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <RegisterForm />
    </div>
  );
};
