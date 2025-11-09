import { userService } from "../services/userService";
import { authService } from "../services/authService";
import { useResource, useMutationWithRefetch } from "../utils/dataManagerFactory";
import { DATA_MANAGER } from "../utils/constants/dataManager";
import { User } from "../models/entity/User";

// Shape that auth endpoints may return
interface ApiListResponse<T> { success?: boolean; data?: T[]; [k: string]: unknown }

export const useUserData = () => {
  // Users list resource
  const { data: users, loading: usersLoading, error: usersError, refetch: refetchUsers, setData: setUsers } = useResource<User, ApiListResponse<User> | User[]>({
    sourceName: 'UserDataManager:Users',
    fetchFn: async () => {
      const resp = await authService.getAllUsers();
      if (resp && typeof resp === 'object' && 'data' in (resp as ApiListResponse<User>)) {
        const dataVal = (resp as ApiListResponse<User>).data;
        return Array.isArray(dataVal) ? dataVal : [];
      }
      return Array.isArray(resp) ? resp : [];
    },
    mapListFn: (raw) => Array.isArray(raw) ? raw as User[] : [],
    isList: true,
    errorMessage: DATA_MANAGER.ERRORS.USERS,
  });

  // Delete request users resource
  const { data: deleteRequestUsers, loading: deleteReqLoading, error: deleteReqError, refetch: refetchDeleteRequests, setData: setDeleteRequestUsers } = useResource<User, ApiListResponse<User> | User[]>({
    sourceName: 'UserDataManager:DeleteRequests',
    fetchFn: async () => {
      const resp = await authService.deleteUserRequest();
      if (resp && typeof resp === 'object' && 'data' in (resp as ApiListResponse<User>)) {
        const dataVal = (resp as ApiListResponse<User>).data;
        return Array.isArray(dataVal) ? dataVal : [];
      }
      return Array.isArray(resp) ? resp : [];
    },
    mapListFn: (raw) => Array.isArray(raw) ? raw as User[] : [],
    isList: true,
    errorMessage: DATA_MANAGER.ERRORS.DELETE_REQUESTS,
    autoStart: false,
  });

  // Mutations (delete returns maybe success flag)
  interface DeleteResponse { success?: boolean; [k: string]: unknown }
  const deleteUser = useMutationWithRefetch<[string], DeleteResponse>(
    async (userId: string) => authService.deleteUser(userId) as Promise<DeleteResponse>,
    refetchUsers,
    'UserDataManager:DeleteUser'
  );

  // Activity endpoints (pass-through)
  const getUserComments = async (userId: string) => userService.getComments({ userId });
  const getUserLikes = async (userId: string) => userService.getLikes({ userId });
  const getUserSavedTrips = async (userId: string) => userService.getSavedTrips({ userId });
  const getUserViews = async (userId: string) => userService.getViews({ userId });

  return {
    users: (users as User[]) || [],
    usersLoading,
    usersError,
    refetchUsers,
    setUsers,
    deleteRequestUsers: (deleteRequestUsers as User[]) || [],
    deleteReqLoading,
    deleteReqError,
    refetchDeleteRequests,
    setDeleteRequestUsers,
    deleteUser,
    getUserComments,
    getUserLikes,
    getUserSavedTrips,
    getUserViews,
  };
};
