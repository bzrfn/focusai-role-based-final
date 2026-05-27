import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Field } from '../components/primitives';
import { buildTheme } from '../constants/theme';
import { useFocusAI } from '../context/FocusAIContext';
import { Role } from '../types';

type IconName = keyof typeof Ionicons.glyphMap;

const roles: { key: Role; label: string; hint: string; icon: IconName }[] = [
  {
    key: 'admin',
    label: 'Administrador',
    hint: 'Control total',
    icon: 'shield-checkmark-outline',
  },
  {
    key: 'student',
    label: 'Estudiante',
    hint: 'Productividad personal',
    icon: 'school-outline',
  },
  {
    key: 'guest',
    label: 'Invitado',
    hint: 'Vista limitada',
    icon: 'person-outline',
  },
];

export function AuthScreen() {
  const { settings, login, register } = useFocusAI();
  const t = buildTheme(settings);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<Role>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const desktop = width >= 980;
  const tablet = width >= 720 && width < 980;
  const mobile = width < 720;

  const topSafe = mobile ? Math.max(insets.top + 18, 42) : 24;
  const bottomSafe = mobile ? Math.max(insets.bottom + 18, 28) : 24;

  const submit = async () => {
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword || (mode === 'register' && !name.trim())) {
      const message =
        mode === 'login'
          ? 'Ingresa correo, contraseña y selecciona un rol.'
          : 'Completa nombre, correo, contraseña y rol.';

      setError(message);
      if (Platform.OS !== 'web') Alert.alert('FocusAI', message);
      return;
    }

    const result =
      mode === 'login'
        ? await login({ email: cleanEmail, password: cleanPassword, role })
        : await register({
            name,
            email: cleanEmail,
            password: cleanPassword,
            role,
          });

    if (!result.ok) {
      const message = result.message ?? 'No fue posible procesar la solicitud.';
      setError(message);
      if (Platform.OS !== 'web') Alert.alert('FocusAI', message);
    }
  };

  const changeMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setPassword('');
    if (mode === 'register') setName('');
  };

  return (
    <LinearGradient colors={[t.bg, t.bg2]} style={styles.root}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.page,
          {
            paddingTop: topSafe,
            paddingBottom: bottomSafe,
            paddingHorizontal: mobile ? 16 : tablet ? 28 : 38,
          },
        ]}
      >
        <View
          style={[
            styles.grid,
            {
              flexDirection: desktop ? 'row' : 'column',
              gap: mobile ? 16 : 24,
            },
          ]}
        >
          <View
            style={[
              styles.brandPanel,
              {
                backgroundColor: t.primary,
                minHeight: desktop ? 620 : mobile ? 260 : 360,
                padding: mobile ? 22 : 32,
              },
            ]}
          >
            <View style={styles.brandHeader}>
              <View style={styles.brandBadge}>
                <Ionicons name="sparkles-outline" size={16} color="#fff" />
                <Text style={styles.badgeText}>FocusAI</Text>
              </View>

              <View style={styles.brandMiniBadge}>
                <Ionicons name="phone-portrait-outline" size={16} color="#fff" />
                <Text style={styles.brandMiniText}>Móvil</Text>
              </View>
            </View>

            <View style={styles.brandMain}>
              <Text
                style={[
                  styles.brandTitle,
                  {
                    fontSize: desktop ? 54 : mobile ? 36 : 44,
                    lineHeight: desktop ? 58 : mobile ? 40 : 48,
                  },
                ]}
              >
                Tu enfoque, potenciado por IA
              </Text>

              <Text
                style={[
                  styles.brandText,
                  {
                    fontSize: mobile ? 15 : 17,
                    lineHeight: mobile ? 23 : 28,
                  },
                ]}
              >
                Planificación predictiva, sesiones Pomodoro adaptativas, analíticas
                y protección contra distractores digitales.
              </Text>
            </View>

            <View style={[styles.featureGrid, mobile && styles.featureGridMobile]}>
              <Feature
                icon="analytics-outline"
                title="Analíticas"
                text="Enfoque real vs. tiempo perdido."
                compact={mobile}
              />
              <Feature
                icon="shield-checkmark-outline"
                title="Roles"
                text="Cada usuario ve solo lo permitido."
                compact={mobile}
              />
              {!mobile ? (
                <>
                  <Feature
                    icon="accessibility-outline"
                    title="Accesibilidad"
                    text="Contraste, texto escalable y navegación clara."
                    compact={false}
                  />
                  <Feature
                    icon="phone-portrait-outline"
                    title="Responsivo"
                    text="Diseñado para móvil, tablet y web."
                    compact={false}
                  />
                </>
              ) : null}
            </View>
          </View>

          <Card
            style={[
              styles.authCard,
              {
                borderColor: t.border,
                padding: mobile ? 20 : 28,
              },
            ]}
          >
            <View style={styles.authHeader}>
              <View style={styles.authHeaderText}>
                <Text style={[styles.eyebrow, { color: t.accent }]}>
                  ACCESO SEGURO
                </Text>
                <Text
                  style={[
                    styles.authTitle,
                    {
                      color: t.text,
                      fontSize: mobile ? 34 : 40,
                      lineHeight: mobile ? 38 : 46,
                    },
                  ]}
                >
                  {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                </Text>
              </View>

              <View style={[styles.authIcon, { backgroundColor: t.primary }]}>
                <Ionicons name="sparkles" color="#fff" size={26} />
              </View>
            </View>

            <Text style={[styles.description, { color: t.muted }]}>
              Ingresa con tu rol asignado. La sesión se mantiene al actualizar y
              el menú se protege según permisos.
            </Text>

            {mode === 'register' ? (
              <Field
                label="Nombre completo"
                value={name}
                onChangeText={setName}
                placeholder="Ej. María González"
              />
            ) : null}

            <Field
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              placeholder="correo@focusai.app"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Field
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña"
              secureTextEntry
            />

            <Text style={[styles.roleTitle, { color: t.text }]}>Rol de acceso</Text>

            <View style={styles.roleGrid}>
              {roles.map((item) => {
                const selected = role === item.key;

                return (
                  <Pressable
                    key={item.key}
                    onPress={() => setRole(item.key)}
                    style={[
                      styles.rolePill,
                      {
                        backgroundColor: selected ? t.primary : t.card2,
                        borderColor: selected ? t.primary : t.border,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Seleccionar rol ${item.label}`}
                  >
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={selected ? '#fff' : t.text}
                    />
                    <View style={styles.roleTextBox}>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: selected ? '#fff' : t.text,
                          fontWeight: '900',
                          fontSize: 13 * t.fontScale,
                        }}
                      >
                        {item.label}
                      </Text>
                      {!mobile ? (
                        <Text
                          numberOfLines={1}
                          style={{
                            color: selected ? '#fff' : t.muted,
                            fontSize: 11 * t.fontScale,
                            fontWeight: '700',
                          }}
                        >
                          {item.hint}
                        </Text>
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {error ? <Text style={[styles.error, { color: t.danger }]}>{error}</Text> : null}

            <Button
              label={mode === 'login' ? 'Entrar a FocusAI' : 'Registrar y entrar'}
              icon="arrow-forward"
              onPress={submit}
            />

            <Pressable onPress={changeMode}>
              <Text style={[styles.link, { color: t.accent }]}>
                {mode === 'login' ? 'Crear una cuenta nueva' : 'Ya tengo cuenta'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShowDemo(!showDemo)}
              style={[styles.demoToggle, { borderColor: t.border, backgroundColor: t.card2 }]}
            >
              <Ionicons name="key-outline" size={18} color={t.accent} />
              <Text style={{ color: t.text, fontWeight: '900', flex: 1 }}>
                Credenciales de prueba
              </Text>
              <Ionicons
                name={showDemo ? 'chevron-up-outline' : 'chevron-down-outline'}
                size={18}
                color={t.muted}
              />
            </Pressable>

            {showDemo ? (
              <View style={[styles.demoBox, { backgroundColor: t.card2, borderColor: t.border }]}>
                <Text style={{ color: t.muted, lineHeight: 21, fontWeight: '700' }}>
                  admin@focusai.app / admin123 / Administrador{'\n'}
                  maria@focusai.app / 123456 / Estudiante{'\n'}
                  demo@focusai.app / demo123 / Invitado
                </Text>
              </View>
            ) : null}
          </Card>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function Feature({
  icon,
  title,
  text,
  compact,
}: {
  icon: IconName;
  title: string;
  text: string;
  compact: boolean;
}) {
  return (
    <View style={[styles.feature, compact && styles.featureCompact]}>
      <Ionicons name={icon} color="#fff" size={compact ? 20 : 24} />
      <View style={styles.featureTextBox}>
        <Text style={[styles.featureTitle, compact && { fontSize: 14 }]}>{title}</Text>
        <Text
          numberOfLines={compact ? 2 : undefined}
          style={[styles.featureText, compact && { fontSize: 12, lineHeight: 17 }]}
        >
          {text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  page: {
    minHeight: '100%',
    justifyContent: 'center',
  },
  grid: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'stretch',
  },
  brandPanel: {
    flex: 1.05,
    borderRadius: 34,
    justifyContent: 'space-between',
    overflow: 'hidden',
    gap: 22,
  },
  brandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 13,
  },
  brandMiniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.12)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  brandMiniText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
  },
  brandMain: {
    gap: 16,
  },
  brandTitle: {
    color: '#fff',
    fontWeight: '900',
    maxWidth: 720,
  },
  brandText: {
    color: 'rgba(255,255,255,0.88)',
    maxWidth: 720,
    fontWeight: '600',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  featureGridMobile: {
    gap: 10,
  },
  feature: {
    width: '47%',
    minWidth: 210,
    gap: 8,
  },
  featureCompact: {
    width: '48%',
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  featureTextBox: {
    flex: 1,
    minWidth: 0,
  },
  featureTitle: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 17,
  },
  featureText: {
    color: 'rgba(255,255,255,0.84)',
    fontWeight: '600',
    lineHeight: 21,
  },
  authCard: {
    flex: 0.78,
    minWidth: 320,
    justifyContent: 'center',
    gap: 13,
  },
  authHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 18,
    alignItems: 'flex-start',
  },
  authHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  authIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  authTitle: {
    fontWeight: '900',
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '650' as any,
  },
  roleTitle: {
    marginTop: 2,
    fontWeight: '900',
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  rolePill: {
    flex: 1,
    minWidth: 96,
    borderRadius: 17,
    paddingVertical: 10,
    paddingHorizontal: 11,
    borderWidth: 1,
    gap: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleTextBox: {
    flex: 1,
    minWidth: 0,
  },
  error: {
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 20,
  },
  link: {
    textAlign: 'center',
    fontWeight: '900',
    marginTop: 2,
  },
  demoToggle: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  demoBox: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginTop: -2,
  },
});