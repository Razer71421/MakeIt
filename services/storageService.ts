import { ScanResult } from '../types';

const STORAGE_KEY = 'makeit_history';

export const getHistory = (): ScanResult[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const saveScan = (scan: ScanResult) => {
  const history = getHistory();
  // Prepend new scan
  const newHistory = [scan, ...history].slice(0, 50); // Keep last 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
};

export const deleteScan = (id: string) => {
  const history = getHistory();
  const newHistory = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};