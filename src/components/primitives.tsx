import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { buildTheme } from '../constants/theme';
import { useFocusAI } from '../context/FocusAIContext';

type IconName = keyof typeof Ionicons.glyphMap;

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  const { settings } = useFocusAI();
  const t = buildTheme(settings);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: t.card,
          borderColor: t.border,
          shadowColor: t.shadowColor,
        },
        settings.reduceMotion && styles.noMotion,
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function AppText({
  children,
  variant = 'body',
  style,
}: {
  children: React.ReactNode;
  variant?: 'hero' | 'title' | 'subtitle' | 'body' | 'label' | 'muted';
  style?: any;
}) {
  const { settings } = useFocusAI();
  const t = buildTheme(settings);
  const scale = t.fontScale;

  const map = {
    hero: {
      fontSize: 40 * scale,
      fontWeight: '900',
      color: t.text,
      lineHeight: 46 * scale,
    },
    title: {
      fontSize: 23 * scale,
      fontWeight: '900',
      color: t.text,
      lineHeight: 29 * scale,
    },
    subtitle: {
      fontSize: 16.5 * scale,
      fontWeight: '850' as any,
      color: t.text,
      lineHeight: 22 * scale,
    },
    body: {
      fontSize: 14.5 * scale,
      fontWeight: '600',
      color: t.text,
      lineHeight: 22 * scale,
    },
    label: {
      fontSize: 11.5 * scale,
      fontWeight: '900',
      color: t.accent,
      letterSpacing: 1.4,
      textTransform: 'uppercase' as const,
      lineHeight: 17 * scale,
    },
    muted: {
      fontSize: 13.5 * scale,
      fontWeight: '650' as any,
      color: t.muted,
      lineHeight: 21 * scale,
    },
  };

  return <Text style={[map[variant], style]}>{children}</Text>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: IconName;
  disabled?: boolean;
}) {
  const { settings } = useFocusAI();
  const t = buildTheme(settings);

  const bg =
    variant === 'danger'
      ? t.danger
      : variant === 'secondary'
        ? t.card2
        : t.primary;

  const textColor = variant === 'secondary' ? t.text : '#fff';

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: bg,
          borderColor: variant === 'primary' ? t.primary : t.border,
          opacity: disabled ? 0.55 : 1,
          minHeight: settings.keyboardNavigation ? 58 : 50,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text
        numberOfLines={1}
        style={{
          color: textColor,
          fontWeight: '900',
          fontSize: 14 * t.fontScale,
        }}
      >
        {label}
      </Text>

      {icon ? <Ionicons name={icon} color={textColor} size={18} /> : null}
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  multiline,
  autoCapitalize,
}: any) {
  const { settings } = useFocusAI();
  const t = buildTheme(settings);

  return (
    <View style={styles.field}>
      <AppText variant="muted" style={styles.fieldLabel}>
        {label}
      </AppText>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={t.placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        style={[
          styles.input,
          {
            backgroundColor: t.card2,
            borderColor: t.border,
            color: t.text,
            minHeight: multiline ? 88 : 50,
            fontSize: 15 * t.fontScale,
          },
        ]}
        accessibilityLabel={label}
      />
    </View>
  );
}

export function ToggleRow({
  title,
  subtitle,
  value,
  onChange,
  icon,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onChange: () => void;
  icon: IconName;
}) {
  const { settings } = useFocusAI();
  const t = buildTheme(settings);

  return (
    <Pressable
      onPress={onChange}
      style={[
        styles.toggleRow,
        {
          backgroundColor: t.card2,
          borderColor: value ? t.primary : t.border,
          minHeight: settings.keyboardNavigation ? 82 : 74,
        },
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={title}
    >
      <View style={[styles.iconBox, { backgroundColor: value ? t.primary : t.card }]}>
        <Ionicons name={icon} size={20} color={value ? '#fff' : t.accent} />
      </View>

      <View style={styles.toggleText}>
        <AppText variant="subtitle">{title}</AppText>
        <AppText variant="muted">{subtitle}</AppText>
      </View>

      <View style={[styles.switchTrack, { backgroundColor: value ? t.success : t.border }]}>
        <View
          style={[
            styles.switchThumb,
            {
              transform: [{ translateX: value ? 22 : 0 }],
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 26,
    padding: 18,
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  noMotion: {
    shadowOpacity: 0.08,
  },
  button: {
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
  },
  field: {
    gap: 7,
    width: '100%',
  },
  fieldLabel: {
    fontWeight: '900',
  },
  input: {
    borderWidth: 1,
    borderRadius: 17,
    paddingHorizontal: 15,
    paddingVertical: 11,
    outlineStyle: 'none' as any,
  },
  toggleRow: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 15,
    flexDirection: 'row',
    gap: 13,
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    flex: 1,
    minWidth: 0,
  },
  switchTrack: {
    width: 54,
    height: 30,
    borderRadius: 999,
    padding: 4,
    flexShrink: 0,
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: '#fff',
  },
});