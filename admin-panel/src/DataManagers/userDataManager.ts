import { userService } from "../services/userService";
import { authService } from "../services/authService";
import { useEffect } from "react";

export const useUserData = () => {
  const getUserComments = async (userId: string) => {
    return await userService.getComments(userId);
  };

  const getUserLikes = async (userId: string) => {
    return await userService.getLikes(userId);
  };

  const getUserSavedTrips = async (userId: string) => {
    return await userService.getSavedTrips(userId);
  };

  const getUserViews = async (userId: string) => {
    return await userService.getViews(userId);
  };

  // New functions from authService
  const getAllUsers = async () => {
    return await authService.getAllUsers();
  };

  const getRequestedDeleteUser = async () => {
    return await authService.deleteUserRequest();
  };

  const deleteUser = async (userId: string) => {
    return await authService.deleteUser(userId);
  };

  // Add the useEffect with debouncing
  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;
    debounceTimer = setTimeout(() => {
      getAllUsers();
    }, 300);
    return () => {
      clearTimeout(debounceTimer);
    };
  }, []);

  return {
    getUserComments,
    getUserLikes,
    getUserSavedTrips,
    getUserViews,
    getAllUsers,
    getRequestedDeleteUser,
    deleteUser,
  };
};
