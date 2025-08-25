import { useState } from 'react';
import { userService } from '../services/userService';
import { roleService } from '../services/roleService';
import { User } from '../models/entity/User';

export const useSubAdmins = () => {
  const [subAdmins, setSubAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubAdmins = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers({ role: 'SUBADMIN', page: 1, limit: 100 });
      setSubAdmins(
        response.users?.filter((user: User) =>
          user.roles?.some(role => role.name.toUpperCase().includes('SUBADMIN'))
        ) || []
      );
      setError(null);
    } catch (err) {
      setError('Failed to fetch sub-admins');
      setSubAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const createSubAdmin = async (payload: any) => {
    return userService.createUser(payload);
  };

  const updateSubAdmin = async (id: string, payload: any) => {
    return userService.updateUser(id, payload);
  };

  const deleteSubAdmin = async (id: string) => {
    return userService.deleteUser(id);
  };

  const updateSubAdminRole = async (id: string, roleId: string) => {
    return roleService.assignRoleToUser(id, roleId);
  };

  return {
    subAdmins,
    loading,
    error,
    fetchSubAdmins,
    createSubAdmin,
    updateSubAdmin,
    deleteSubAdmin,
    updateSubAdminRole,
  };
};
