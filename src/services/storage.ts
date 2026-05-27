import AsyncStorage from '@react-native-async-storage/async-storage';
import { FocusRecord, Settings, User } from '../types';

const KEYS = {
  session: 'focusai.session.v2',
  settings: 'focusai.settings.v2',
  records: 'focusai.records.v2',
};

export async function saveSession(user: User | null) {
  if (!user) {
    await AsyncStorage.removeItem(KEYS.session);
    return;
  }
  await AsyncStorage.setItem(KEYS.session, JSON.stringify(user));
}

export async function loadSession(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(KEYS.session);
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function saveSettings(settings: Settings) {
  await AsyncStorage.setItem(KEYS.settings, JSON.stringify(settings));
}

export async function loadSettings(): Promise<Settings | null> {
  const raw = await AsyncStorage.getItem(KEYS.settings);
  return raw ? (JSON.parse(raw) as Settings) : null;
}

export async function saveRecords(records: FocusRecord[]) {
  await AsyncStorage.setItem(KEYS.records, JSON.stringify(records));
}

export async function loadRecords(): Promise<FocusRecord[] | null> {
  const raw = await AsyncStorage.getItem(KEYS.records);
  return raw ? (JSON.parse(raw) as FocusRecord[]) : null;
}
