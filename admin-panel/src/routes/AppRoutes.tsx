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
import ROUTES from "./routes";

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
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              {/* make main area a flex column with a scrollable content pane */}
              <div className="flex-1 flex flex-col min-h-0">
                <Navbar />
                <div className="p-6 space-y-6 overflow-auto flex-1 min-h-0">
                  <Dashboard />
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      {/* Consolidate protected routes into a small config and map over them to avoid repetition */}
      {(() => {
        const protectedRoutes: { path: string; element: JSX.Element }[] = [
          { path: ROUTES.SUB_ADMINS, element: <SubAdminManagement /> },
          { path: ROUTES.USERS, element: <Users /> },
          { path: ROUTES.DESTINATIONS, element: <Destinations /> },
          { path: ROUTES.TRIPS, element: <Trips /> },
          { path: ROUTES.ITINERARIES, element: <Itineraries /> },
          { path: ROUTES.TRAVEL_JOURNALS, element: <TravelJournals /> },
          { path: ROUTES.REGIONS, element: <Regions /> },
          { path: ROUTES.PROFILE, element: <Profile /> },
          { path: ROUTES.SETTINGS, element: <Settings /> },
        ];

        return protectedRoutes.map((r) => (
          <Route
            key={r.path}
            path={r.path}
            element={<ProtectedRoute>{r.element}</ProtectedRoute>}
          />
        ));
      })()}
    </Routes>
  );
};
