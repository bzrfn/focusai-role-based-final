import AsyncStorage from '@react-native-async-storage/async-storage';
import { FocusRecord, Settings, User } from '../types';

const KEYS = {
  session: 'focusai.session.v2',
  settings: 'focusai.settings.v2',
  records: 'focusai.records.v2',
};

function safeParse<T>(raw: string | null): T | null {
  try {
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn('[FocusAI Storage] Error parsing stored data:', error);
    return null;
  }
}

export async function saveSession(user: User | null) {
  try {
    if (!user) {
      await AsyncStorage.removeItem(KEYS.session);
      return;
    }

    await AsyncStorage.setItem(KEYS.session, JSON.stringify(user));
  } catch (error) {
    console.warn('[FocusAI Storage] Error saving session:', error);
  }
}

export async function loadSession(): Promise<User | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.session);
    return safeParse<User>(raw);
  } catch (error) {
    console.warn('[FocusAI Storage] Error loading session:', error);
    return null;
  }
}

export async function saveSettings(settings: Settings) {
  try {
    await AsyncStorage.setItem(KEYS.settings, JSON.stringify(settings));
  } catch (error) {
    console.warn('[FocusAI Storage] Error saving settings:', error);
  }
}

export async function loadSettings(): Promise<Settings | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.settings);
    return safeParse<Settings>(raw);
  } catch (error) {
    console.warn('[FocusAI Storage] Error loading settings:', error);
    return null;
  }
}

export async function saveRecords(records: FocusRecord[]) {
  try {
    await AsyncStorage.setItem(KEYS.records, JSON.stringify(records));
  } catch (error) {
    console.warn('[FocusAI Storage] Error saving records:', error);
  }
}

export async function loadRecords(): Promise<FocusRecord[] | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.records);
    return safeParse<FocusRecord[]>(raw);
  } catch (error) {
    console.warn('[FocusAI Storage] Error loading records:', error);
    return null;
  }
}