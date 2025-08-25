import { userService } from '../services/userService';

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

  return {
    getUserComments,
    getUserLikes,
    getUserSavedTrips,
    getUserViews,
  };
};
