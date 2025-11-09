import { useState } from 'react';
import { storageUtility } from '../utils';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = storageUtility.getItem<T>(key);
    return item !== null ? item : initialValue;
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storageUtility.setItem(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      storageUtility.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
}

// New hook for session storage
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = storageUtility.getSessionItem<T>(key);
    return item !== null ? item : initialValue;
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storageUtility.setSessionItem(key, valueToStore);
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      storageUtility.removeSessionItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
}