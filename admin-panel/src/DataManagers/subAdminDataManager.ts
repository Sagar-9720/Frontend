import { useState, useEffect } from "react";
import { User } from "../models/entity/User";
import { authService } from "../services/api";
import { logger } from "../utils";

export const useSubAdmins = () => {
  const [subAdmins, setSubAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubAdmins = async () => {
    setLoading(true);
    try {
      const response = await authService.getAllSubAdmins();
      logger.info("Fetched sub-admins successfully", response.data);
      setSubAdmins(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch sub-admins");
      setSubAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const createSubAdmin = async (payload: any) => {
    return authService.registerSubAdmin(payload);
  };

  const updateSubAdmin = async (payload: any) => {
    return authService.updateUserInfo(payload);
  };

  const deleteSubAdmin = async (id: string) => {
    return authService.deleteUser(id);
  };

  const updateSubAdminRole = async (payload: any) => {
    return authService.updateRole(payload);
  };

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;
    debounceTimer = setTimeout(() => {
      fetchSubAdmins();
    }, 300);
    return () => {
      clearTimeout(debounceTimer);
    };
  }, []);

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
