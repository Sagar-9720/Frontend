import { Routes, Route } from "react-router-dom";
import { Login } from "../pages/Auth/Login";
import { Register } from "../pages/Auth/Register";
import Home from "../pages/Home/Home";
import Destinations from "../pages/Destination/Destinations";
import DestinationPage from "../pages/Destination/DestinationPage";
import Trips from "../pages/Trips/Trips";
import TripsPage from "../pages/Trips/TripsPage";
import TravelJournalMain from "../pages/Journal/TravelJournalMain";
import TravelJournal from "../pages/Journal/TravelJournal";
import VerifyEmail from "../pages/Auth/VerifyEmail";
// import { ProtectedRoute } from "./ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    <Route path="/verify-email/:token" element={<VerifyEmail />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/"
      // element={
      //   <ProtectedRoute>
      //     <Home />
      //   </ProtectedRoute>
      // }
      element={<Home />}
    />
    <Route
      path="/destinations"
      // element={
      //   <ProtectedRoute>
      //     <Destinations />
      //   </ProtectedRoute>
      // }
      element={<Destinations />}
    />
    <Route
      path="/destinations/:id"
      // element={
      //   <ProtectedRoute>
      //     <DestinationPage />
      //   </ProtectedRoute>
      // }
      element={<DestinationPage />}
    />
    <Route
      path="/trips"
      // element={
      //   <ProtectedRoute>
      //     <Trips />
      //   </ProtectedRoute>
      // }
      element={<Trips />}
    />
    <Route
      path="/trips/:id"
      // element={
      //   <ProtectedRoute>
      //     <TripsPage />
      //   </ProtectedRoute>
      // }
      element={<TripsPage />}
    />
    <Route
      path="/journal"
      // element={
      //   <ProtectedRoute>
      //     <TravelJournalMain />
      //   </ProtectedRoute>
      // }
      element={<TravelJournalMain />}
    />
    <Route
      path="/journal/:id"
      // element={
      //   <ProtectedRoute>
      //     <TravelJournal />
      //   </ProtectedRoute>
      // }
      element={<TravelJournal />}
    />
  </Routes>
);

export default AppRoutes;
