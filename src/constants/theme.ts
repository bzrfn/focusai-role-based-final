import { Settings } from '../types';

export function buildTheme(settings: Settings) {
  const dark = settings.theme === 'dark';
  const high = settings.highContrast;

  const base = {
    primary: '#a855f7',
    secondary: '#7c3aed',
    accent: '#22d3ee',
    success: '#2dd4bf',
    danger: '#fb7185',
    warning: '#fbbf24',
  };

  if (high) {
    return {
      dark,
      bg: '#000000',
      bg2: '#050505',
      card: '#080808',
      card2: '#111111',
      text: '#ffffff',
      muted: '#ffffff',
      placeholder: '#d4d4d4',
      border: '#ffffff',
      shadow: 'rgba(0,0,0,0.45)',
      shadowColor: '#000000',
      fontScale: settings.largeText ? 1.1 : 1,
      motion: !settings.reduceMotion,
      ...base,
    };
  }

  if (dark) {
    return {
      dark,
      bg: '#090014',
      bg2: '#21003d',
      card: '#160722',
      card2: '#231038',
      text: '#ffffff',
      muted: '#c6b4e6',
      placeholder: '#9f8ec2',
      border: 'rgba(168,85,247,0.34)',
      shadow: 'rgba(0,0,0,0.35)',
      shadowColor: '#000000',
      fontScale: settings.largeText ? 1.1 : 1,
      motion: !settings.reduceMotion,
      ...base,
    };
  }

  return {
    dark,
    bg: '#f7f2ff',
    bg2: '#eadcff',
    card: '#ffffff',
    card2: '#f4edff',
    text: '#171022',
    muted: '#625477',
    placeholder: '#8a7d9f',
    border: 'rgba(124,58,237,0.18)',
    shadow: 'rgba(76,29,149,0.16)',
    shadowColor: '#4c1d95',
    fontScale: settings.largeText ? 1.1 : 1,
    motion: !settings.reduceMotion,
    ...base,
  };
}