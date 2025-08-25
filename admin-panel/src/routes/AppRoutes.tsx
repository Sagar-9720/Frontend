import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "../pages/AuthPages/Login";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { Destinations } from "../pages/DestinationManagement/Destinations";
import Regions from "../pages/Region&CountryManagement/Regions";
import Itineraries from "../pages/TripManagement/Itineraries";
import TravelJournals from "../pages/TravelJournal/TravelJournals";
import Profile from "../pages/Profile/Profile";
import SubAdminManagement from "../pages/UserManagement/SubAdminManagement";
import Users from "../pages/UserManagement/Users";
import Trips from "../pages/TripManagement/Trips";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";

// Placeholder component for settings
const Settings = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
    <p className="text-gray-600">Application settings and configurations</p>
    <div className="bg-white p-8 rounded-lg shadow text-center">
      <p className="text-gray-500">Settings interface coming soon...</p>
    </div>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="p-6 space-y-6">
                  <Dashboard />
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sub-admins"
        element={
          <ProtectedRoute>
            <SubAdminManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/destinations"
        element={
          <ProtectedRoute>
            <Destinations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips"
        element={
          <ProtectedRoute>
            <Trips />
          </ProtectedRoute>
        }
      />
      <Route
        path="/itineraries"
        element={
          <ProtectedRoute>
            <Itineraries />
          </ProtectedRoute>
        }
      />
      <Route
        path="/travel-journals"
        element={
          <ProtectedRoute>
            <TravelJournals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/regions"
        element={
          <ProtectedRoute>
            <Regions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
