export type Role = 'admin' | 'student' | 'guest';

export type ThemeMode = 'dark' | 'light';

export type ScreenKey =
  | 'home'
  | 'aiPlan'
  | 'adminCrud'
  | 'analytics'
  | 'security'
  | 'settings'
  | 'profile';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  area: string;
  avatar: string;
};

export type FocusRecord = {
  id: string;
  title: string;
  owner: string;
  category: string;
  priority: 'Alta' | 'Media' | 'Baja';
  status: 'Pendiente' | 'En progreso' | 'Completado' | 'Bloqueado';
  duration: string;
  blocker: string;
  notes: string;
  createdAt: string;
};

export type Settings = {
  theme: ThemeMode;
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  backgroundMusic: boolean;
  notifications: boolean;
  keyboardNavigation: boolean;
};

export type LoginPayload = {
  email: string;
  password: string;
  role: Role;
};