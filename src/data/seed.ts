import { FocusRecord, Settings, User } from '../types';

export const USERS: User[] = [
  {
    id: 'u-admin',
    name: 'Administrador FocusAI',
    email: 'admin@focusai.app',
    password: 'admin123',
    role: 'admin',
    area: 'Control de productividad institucional',
    avatar: 'AD',
  },
  {
    id: 'u-student',
    name: 'María González',
    email: 'maria@focusai.app',
    password: '123456',
    role: 'student',
    area: 'Estudiante / productividad personal',
    avatar: 'MG',
  },
  {
    id: 'u-guest',
    name: 'Usuario Invitado',
    email: 'demo@focusai.app',
    password: 'demo123',
    role: 'guest',
    area: 'Vista limitada de demostración',
    avatar: 'IV',
  },
];

export const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  highContrast: false,
  largeText: false,
  reduceMotion: false,
  backgroundMusic: true,
  notifications: true,
  keyboardNavigation: true,
};

export const DEFAULT_RECORDS: FocusRecord[] = [
  {
    id: 'r-001',
    title: 'Diseño de interfaces responsivas',
    owner: 'María González',
    category: 'Estudio',
    priority: 'Alta',
    status: 'En progreso',
    duration: '90 min',
    blocker: 'TikTok, Instagram',
    notes: 'Bloquear redes y trabajar en modo Pomodoro adaptativo.',
    createdAt: '2026-05-27',
  },
  {
    id: 'r-002',
    title: 'Revisión de prototipo FocusAI',
    owner: 'Administrador FocusAI',
    category: 'Validación UX',
    priority: 'Alta',
    status: 'Pendiente',
    duration: '60 min',
    blocker: 'Mensajería',
    notes: 'Validar contraste, rutas por rol, formularios y navegación.',
    createdAt: '2026-05-27',
  },
  {
    id: 'r-003',
    title: 'Descanso guiado antiansiedad',
    owner: 'María González',
    category: 'Bienestar digital',
    priority: 'Media',
    status: 'Completado',
    duration: '10 min',
    blocker: 'Notificaciones',
    notes: 'Respiración y pausa visual después de sesión intensiva.',
    createdAt: '2026-05-26',
  },
];
