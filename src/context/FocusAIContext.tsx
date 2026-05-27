import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_RECORDS, DEFAULT_SETTINGS, USERS } from '../data/seed';
import { FocusRecord, LoginPayload, Role, ScreenKey, Settings, User } from '../types';
import {
  loadRecords,
  loadSession,
  loadSettings,
  saveRecords,
  saveSession,
  saveSettings,
} from '../services/storage';

type ContextValue = {
  booting: boolean;
  user: User | null;
  settings: Settings;
  records: FocusRecord[];
  activeScreen: ScreenKey;
  login: (payload: LoginPayload) => Promise<{ ok: boolean; message?: string }>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  setActiveScreen: (screen: ScreenKey) => void;
  updateSettings: (patch: Partial<Settings>) => Promise<void>;
  addRecord: (record: Omit<FocusRecord, 'id' | 'createdAt'>) => Promise<void>;
  updateRecord: (record: FocusRecord) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  canAccess: (screen: ScreenKey) => boolean;
  menu: ScreenKey[];
};

const FocusAIContext = createContext<ContextValue | null>(null);

const roleMenus: Record<Role, ScreenKey[]> = {
  admin: ['home', 'aiPlan', 'adminCrud', 'analytics', 'security', 'settings', 'profile'],
  student: ['home', 'aiPlan', 'analytics', 'settings', 'profile'],
  guest: ['home', 'aiPlan', 'analytics', 'profile'],
};

export function FocusAIProvider({ children }: { children: React.ReactNode }) {
  const [booting, setBooting] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [records, setRecords] = useState<FocusRecord[]>(DEFAULT_RECORDS);
  const [customUsers, setCustomUsers] = useState<User[]>([]);
  const [activeScreen, setActiveScreenState] = useState<ScreenKey>('home');

  const allUsers = useMemo(() => [...USERS, ...customUsers], [customUsers]);
  const menu = user ? roleMenus[user.role] : [];

  useEffect(() => {
    async function boot() {
      const [storedUser, storedSettings, storedRecords] = await Promise.all([
        loadSession(),
        loadSettings(),
        loadRecords(),
      ]);

      if (storedUser) setUser(storedUser);
      if (storedSettings) setSettings(storedSettings);
      if (storedRecords) setRecords(storedRecords);

      setBooting(false);
    }

    boot();
  }, []);

  useEffect(() => {
    if (user && !roleMenus[user.role].includes(activeScreen)) {
      setActiveScreenState('home');
    }
  }, [user, activeScreen]);

  const canAccess = (screen: ScreenKey) => {
    if (!user) return false;
    return roleMenus[user.role].includes(screen);
  };

  const setActiveScreen = (screen: ScreenKey) => {
    if (canAccess(screen)) {
      setActiveScreenState(screen);
      return;
    }

    setActiveScreenState('home');
  };

  const login = async ({ email, password, role }: LoginPayload) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const found = allUsers.find(
      (item) =>
        item.email.toLowerCase() === cleanEmail &&
        item.password === cleanPassword &&
        item.role === role
    );

    if (!found) {
      return {
        ok: false,
        message:
          'Credenciales inválidas o rol incorrecto. Verifica correo, contraseña y tipo de acceso.',
      };
    }

    setUser(found);
    setActiveScreenState('home');
    await saveSession(found);

    return { ok: true };
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) => {
    const cleanName = payload.name.trim();
    const cleanEmail = payload.email.trim().toLowerCase();
    const cleanPassword = payload.password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      return { ok: false, message: 'Completa nombre, correo y contraseña.' };
    }

    const exists = allUsers.some((item) => item.email.toLowerCase() === cleanEmail);

    if (exists) {
      return { ok: false, message: 'El correo ya está registrado.' };
    }

    const next: User = {
      id: `u-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      role: payload.role,
      area:
        payload.role === 'admin'
          ? 'Administración'
          : payload.role === 'student'
            ? 'Estudiante / productividad personal'
            : 'Invitado / demostración',
      avatar: cleanName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    };

    setCustomUsers((prev) => [...prev, next]);
    setUser(next);
    setActiveScreenState('home');
    await saveSession(next);

    return { ok: true };
  };

  const logout = async () => {
    setUser(null);
    setActiveScreenState('home');
    await saveSession(null);
  };

  const updateSettings = async (patch: Partial<Settings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    await saveSettings(next);
  };

  const persistRecords = async (next: FocusRecord[]) => {
    setRecords(next);
    await saveRecords(next);
  };

  const addRecord = async (record: Omit<FocusRecord, 'id' | 'createdAt'>) => {
    if (!user || user.role !== 'admin') return;

    await persistRecords([
      {
        ...record,
        id: `r-${Date.now()}`,
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...records,
    ]);
  };

  const updateRecord = async (record: FocusRecord) => {
    if (!user || user.role !== 'admin') return;

    await persistRecords(records.map((item) => (item.id === record.id ? record : item)));
  };

  const deleteRecord = async (id: string) => {
    if (!user || user.role !== 'admin') return;

    await persistRecords(records.filter((item) => item.id !== id));
  };

  return (
    <FocusAIContext.Provider
      value={{
        booting,
        user,
        settings,
        records,
        activeScreen,
        login,
        register,
        logout,
        setActiveScreen,
        updateSettings,
        addRecord,
        updateRecord,
        deleteRecord,
        canAccess,
        menu,
      }}
    >
      {children}
    </FocusAIContext.Provider>
  );
}

export function useFocusAI() {
  const context = useContext(FocusAIContext);

  if (!context) {
    throw new Error('useFocusAI must be used inside FocusAIProvider');
  }

  return context;
}