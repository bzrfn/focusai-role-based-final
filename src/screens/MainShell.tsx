import React, { useEffect, useMemo, useState } from 'react';
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
import { AppText, Button, Card, Field, ToggleRow } from '../components/primitives';
import { buildTheme } from '../constants/theme';
import { useFocusAI } from '../context/FocusAIContext';
import { FocusRecord, ScreenKey } from '../types';

type IconName = keyof typeof Ionicons.glyphMap;

const meta: Record<ScreenKey, { label: string; title: string; desc: string; icon: IconName }> = {
  home: {
    label: 'Inicio',
    title: 'Centro de control',
    desc: 'Resumen inteligente de productividad según el rol activo.',
    icon: 'grid-outline',
  },
  aiPlan: {
    label: 'Plan IA',
    title: 'Agenda inteligente',
    desc: 'Planificación predictiva, sesiones Pomodoro y control de distractores.',
    icon: 'calendar-outline',
  },
  adminCrud: {
    label: 'Registros',
    title: 'Registros CRUD',
    desc: 'Administración completa de registros de enfoque.',
    icon: 'create-outline',
  },
  analytics: {
    label: 'Analíticas',
    title: 'Analíticas',
    desc: 'Indicadores de enfoque, distractores y rendimiento semanal.',
    icon: 'bar-chart-outline',
  },
  security: {
    label: 'Seguridad',
    title: 'Seguridad',
    desc: 'Auditoría de roles, permisos, sesión y protección de rutas.',
    icon: 'shield-checkmark-outline',
  },
  settings: {
    label: 'Ajustes',
    title: 'Ajustes',
    desc: 'Configuración funcional de tema, contraste, texto y experiencia.',
    icon: 'settings-outline',
  },
  profile: {
    label: 'Perfil',
    title: 'Perfil activo',
    desc: 'Información del usuario autenticado y preferencias activas.',
    icon: 'person-outline',
  },
};

export function MainShell() {
  const { user, settings, menu, activeScreen, setActiveScreen, logout, updateSettings } = useFocusAI();
  const t = buildTheme(settings);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isMobile = width < 760;
  const isPhone = width < 520;
  const isTablet = width >= 760 && width < 1080;

  const mobileTopSafe = isMobile
    ? Platform.OS === 'web'
      ? 92
      : Math.max(insets.top + 24, 76)
    : 0;

  const mobileBottomSafe = isMobile ? Math.max(insets.bottom + 14, 18) : 0;

  useEffect(() => {
    if (menu.length > 0 && !menu.includes(activeScreen)) {
      setActiveScreen('home');
    }
  }, [activeScreen, menu, setActiveScreen]);

  if (!user) return null;

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const visibleScreen = menu.includes(activeScreen) ? activeScreen : 'home';
  const visibleMeta = meta[visibleScreen];

  return (
    <LinearGradient colors={[t.bg, t.bg2]} style={{ flex: 1 }}>
      <View
        style={[
          styles.shell,
          isMobile && styles.shellMobile,
          isMobile && { paddingTop: mobileTopSafe },
        ]}
      >
        {!isMobile ? (
          <DesktopSidebar
            user={user}
            menu={menu}
            activeScreen={visibleScreen}
            setActiveScreen={setActiveScreen}
            logout={logout}
            isTablet={isTablet}
          />
        ) : null}

        <View style={styles.mainArea}>
          {isMobile ? (
            <MobileHeader
              user={user}
              settingsTheme={settings.theme}
              onToggleTheme={toggleTheme}
              onLogout={logout}
            />
          ) : null}

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.contentInner,
              {
                paddingHorizontal: isMobile ? 14 : 24,
                paddingTop: isMobile ? 14 : 24,
                paddingBottom: isMobile ? 178 + mobileBottomSafe : 40,
                maxWidth: isMobile ? '100%' : 1240,
              },
            ]}
          >
            <Card style={[styles.topbar, isMobile && styles.topbarMobile]}>
              <View style={styles.topbarText}>
                <AppText variant="label">{visibleMeta.label}</AppText>
                <AppText
                  variant="hero"
                  style={{
                    fontSize: isPhone ? 27 * t.fontScale : isMobile ? 29 * t.fontScale : isTablet ? 34 * t.fontScale : 40 * t.fontScale,
                    lineHeight: isPhone ? 33 * t.fontScale : isMobile ? 36 * t.fontScale : 48 * t.fontScale,
                  }}
                >
                  {visibleMeta.title}
                </AppText>
                <AppText variant="muted">{visibleMeta.desc}</AppText>
              </View>

              {!isMobile ? (
                <View style={styles.topActions}>
                  <Button
                    label={settings.theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                    variant="secondary"
                    icon={settings.theme === 'dark' ? 'sunny-outline' : 'moon-outline'}
                    onPress={toggleTheme}
                  />
                  <Button label="Salir" variant="danger" icon="log-out-outline" onPress={logout} />
                </View>
              ) : null}
            </Card>

            {visibleScreen === 'home' ? <Home /> : null}
            {visibleScreen === 'aiPlan' ? <AIPlan /> : null}
            {visibleScreen === 'adminCrud' && user.role === 'admin' ? <AdminCrud /> : null}
            {visibleScreen === 'analytics' ? <Analytics /> : null}
            {visibleScreen === 'security' && user.role === 'admin' ? <Security /> : null}
            {visibleScreen === 'settings' ? <Settings /> : null}
            {visibleScreen === 'profile' ? <Profile /> : null}
          </ScrollView>

          {isMobile ? (
            <MobileBottomNav
              menu={menu}
              activeScreen={visibleScreen}
              setActiveScreen={setActiveScreen}
              bottomSafe={mobileBottomSafe}
            />
          ) : null}
        </View>
      </View>
    </LinearGradient>
  );
}

function DesktopSidebar({
  user,
  menu,
  activeScreen,
  setActiveScreen,
  logout,
  isTablet,
}: {
  user: NonNullable<ReturnType<typeof useFocusAI>['user']>;
  menu: ScreenKey[];
  activeScreen: ScreenKey;
  setActiveScreen: (screen: ScreenKey) => void;
  logout: () => void;
  isTablet: boolean;
}) {
  const { settings } = useFocusAI();
  const t = buildTheme(settings);

  return (
    <View
      style={[
        styles.sidebar,
        {
          width: isTablet ? 108 : 304,
          backgroundColor: t.card,
          borderColor: t.border,
        },
      ]}
    >
      <View style={styles.sidebarTop}>
        <View style={[styles.brandRow, isTablet && styles.brandRowTablet]}>
          <View style={[styles.logo, { backgroundColor: t.primary }]}>
            <Text style={styles.logoText}>FAI</Text>
          </View>

          {!isTablet ? (
            <View style={{ flex: 1 }}>
              <AppText variant="title">FocusAI</AppText>
              <AppText variant="muted">{roleLabel(user.role)}</AppText>
            </View>
          ) : null}
        </View>

        <View style={styles.navColumn}>
          {menu.map((key) => {
            const item = meta[key];
            const selected = activeScreen === key;

            return (
              <Pressable
                key={key}
                onPress={() => setActiveScreen(key)}
                style={[
                  styles.navItemDesktop,
                  isTablet && styles.navItemTablet,
                  {
                    backgroundColor: selected ? t.primary : t.card2,
                    borderColor: selected ? t.primary : t.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Abrir ${item.label}`}
              >
                <Ionicons name={item.icon} size={22} color={selected ? '#fff' : t.text} />

                {!isTablet ? (
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: selected ? '#fff' : t.text,
                        fontWeight: '900',
                        fontSize: 14 * t.fontScale,
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: selected ? '#fff' : t.muted,
                        fontWeight: '700',
                        fontSize: 11 * t.fontScale,
                        marginTop: 2,
                      }}
                    >
                      {item.title}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      {!isTablet ? (
        <Card style={styles.userCard}>
          <View style={styles.userCardHeader}>
            <View style={[styles.userMiniAvatar, { backgroundColor: t.primary }]}>
              <Text style={styles.userMiniAvatarText}>{user.avatar}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="subtitle">{user.name}</AppText>
              <AppText variant="muted">{user.email}</AppText>
            </View>
          </View>
          <Button label="Cerrar sesión" variant="danger" icon="log-out-outline" onPress={logout} />
        </Card>
      ) : (
        <Pressable
          onPress={logout}
          style={[styles.logoutIconBtn, { backgroundColor: t.danger }]}
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" />
        </Pressable>
      )}
    </View>
  );
}

function MobileHeader({
  user,
  settingsTheme,
  onToggleTheme,
  onLogout,
}: {
  user: NonNullable<ReturnType<typeof useFocusAI>['user']>;
  settingsTheme: string;
  onToggleTheme: () => void;
  onLogout: () => void;
}) {
  const { settings } = useFocusAI();
  const t = buildTheme(settings);

  return (
    <View style={[styles.mobileHeader, { backgroundColor: t.card, borderColor: t.border }]}>
      <View style={styles.mobileBrand}>
        <View style={[styles.mobileLogo, { backgroundColor: t.primary }]}>
          <Text style={styles.logoText}>FAI</Text>
        </View>

        <View style={styles.mobileBrandText}>
          <Text numberOfLines={1} style={[styles.mobileTitle, { color: t.text }]}>
            FocusAI
          </Text>
          <Text numberOfLines={1} style={[styles.mobileSubtitle, { color: t.muted }]}>
            {roleLabel(user.role)}
          </Text>
        </View>
      </View>

      <View style={styles.mobileHeaderActions}>
        <Pressable
          onPress={onToggleTheme}
          style={[styles.mobileActionBtn, { backgroundColor: t.card2, borderColor: t.border }]}
          accessibilityRole="button"
          accessibilityLabel={settingsTheme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
          <Ionicons
            name={settingsTheme === 'dark' ? 'sunny-outline' : 'moon-outline'}
            size={20}
            color={t.text}
          />
        </Pressable>

        <Pressable
          onPress={onLogout}
          style={[styles.mobileActionBtn, { backgroundColor: t.danger, borderColor: t.danger }]}
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

function MobileBottomNav({
  menu,
  activeScreen,
  setActiveScreen,
  bottomSafe,
}: {
  menu: ScreenKey[];
  activeScreen: ScreenKey;
  setActiveScreen: (screen: ScreenKey) => void;
  bottomSafe: number;
}) {
  const { settings } = useFocusAI();
  const t = buildTheme(settings);

  return (
    <View
      style={[
        styles.bottomNav,
        {
          backgroundColor: t.card,
          borderColor: t.border,
          bottom: bottomSafe,
        },
      ]}
    >
      {menu.map((key) => {
        const item = meta[key];
        const selected = activeScreen === key;

        return (
          <Pressable
            key={key}
            onPress={() => setActiveScreen(key)}
            style={[
              styles.bottomNavItem,
              {
                backgroundColor: selected ? t.primary : 'transparent',
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Abrir ${item.label}`}
          >
            <Ionicons name={item.icon} size={20} color={selected ? '#fff' : t.muted} />
            <Text
              numberOfLines={1}
              style={[
                styles.bottomNavLabel,
                {
                  color: selected ? '#fff' : t.muted,
                  fontSize: 10 * t.fontScale,
                },
              ]}
            >
              {shortLabel(item.label)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Home() {
  const { user } = useFocusAI();
  if (!user) return null;

  if (user.role === 'admin') return <AdminHome />;
  if (user.role === 'student') return <StudentHome />;
  return <GuestHome />;
}

function AdminHome() {
  const { records, menu } = useFocusAI();

  return (
    <View style={styles.sectionGap}>
      <View style={styles.kpis}>
        <Kpi label="Rol activo" value="ADMIN" icon="person-circle-outline" />
        <Kpi label="Registros" value={String(records.length)} icon="server-outline" />
        <Kpi label="Rutas visibles" value={String(menu.length)} icon="eye-outline" />
      </View>

      <Card>
        <AppText variant="title">Dashboard administrativo</AppText>
        <AppText variant="muted">
          Control completo del prototipo: registros CRUD, seguridad, analíticas, ajustes y perfil.
        </AppText>

        <View style={styles.infoGrid}>
          <Info
            title="Control de registros"
            text="El administrador puede crear, consultar, modificar y eliminar registros."
            icon="create-outline"
          />
          <Info
            title="Protección por rol"
            text="Las pantallas no autorizadas no se renderizan en el menú ni en el contenido."
            icon="shield-checkmark-outline"
          />
          <Info
            title="Auditoría visual"
            text="El módulo de seguridad muestra permisos activos y rutas disponibles."
            icon="lock-closed-outline"
          />
        </View>
      </Card>
    </View>
  );
}

function StudentHome() {
  return (
    <View style={styles.sectionGap}>
      <View style={styles.kpis}>
        <Kpi label="Rol activo" value="ALUMNO" icon="school-outline" />
        <Kpi label="Enfoque sugerido" value="3.8 h" icon="timer-outline" />
        <Kpi label="Sesiones activas" value="4" icon="flash-outline" />
      </View>

      <Card>
        <AppText variant="title">Dashboard del estudiante</AppText>
        <AppText variant="muted">
          Vista enfocada en planificación inteligente, analíticas personales, accesibilidad y seguimiento de concentración.
        </AppText>

        <View style={styles.infoGrid}>
          <Info
            title="Agenda IA"
            text="Organiza actividades de estudio según energía, prioridad y sesiones Pomodoro."
            icon="calendar-outline"
          />
          <Info
            title="Distractores"
            text="Detecta apps que afectan la concentración y sugiere bloqueo temporal."
            icon="ban-outline"
          />
          <Info
            title="Accesibilidad"
            text="Permite adaptar texto, tema, contraste y navegación."
            icon="accessibility-outline"
          />
        </View>
      </Card>
    </View>
  );
}

function GuestHome() {
  return (
    <View style={styles.sectionGap}>
      <View style={styles.kpis}>
        <Kpi label="Rol activo" value="INVITADO" icon="person-outline" />
        <Kpi label="Modo" value="Demo" icon="phone-portrait-outline" />
        <Kpi label="Vista" value="Limitada" icon="eye-outline" />
      </View>

      <Card>
        <AppText variant="title">Vista de invitado</AppText>
        <AppText variant="muted">
          Acceso de demostración para conocer las funciones principales de FocusAI sin permisos administrativos.
        </AppText>

        <View style={styles.infoGrid}>
          <Info
            title="Demostración funcional"
            text="Permite visualizar la idea general de FocusAI sin acceso administrativo."
            icon="sparkles-outline"
          />
          <Info
            title="Plan IA"
            text="Muestra una agenda de ejemplo con horarios y control de distractores."
            icon="calendar-outline"
          />
          <Info
            title="Analíticas"
            text="Presenta métricas simuladas de productividad y concentración."
            icon="bar-chart-outline"
          />
        </View>
      </Card>
    </View>
  );
}

function Kpi({ label, value, icon }: { label: string; value: string; icon: IconName }) {
  const { settings } = useFocusAI();
  const t = buildTheme(settings);

  return (
    <Card style={styles.kpi}>
      <Ionicons name={icon} size={24} color={t.accent} />
      <AppText variant="muted">{label}</AppText>
      <AppText variant="title">{value}</AppText>
    </Card>
  );
}

function Info({ title, text, icon }: { title: string; text: string; icon: IconName }) {
  const { settings } = useFocusAI();
  const t = buildTheme(settings);

  return (
    <View style={[styles.info, { backgroundColor: t.card2, borderColor: t.border }]}>
      <Ionicons name={icon} size={26} color={t.primary} />
      <AppText variant="subtitle">{title}</AppText>
      <AppText variant="muted">{text}</AppText>
    </View>
  );
}

function AIPlan() {
  const { settings, user } = useFocusAI();
  const t = buildTheme(settings);
  const { width } = useWindowDimensions();
  const isPhone = width < 520;

  const items = [
    {
      time: '08:30',
      energy: 'Alta',
      title: 'Diseño de interfaces responsivas',
      method: 'Pomodoro 50/10',
      blocker: 'Redes bloqueadas',
      progress: 86,
    },
    {
      time: '10:15',
      energy: 'Media',
      title: 'Revisión de documentación FocusAI',
      method: 'Pomodoro 35/8',
      blocker: 'Mensajería limitada',
      progress: 74,
    },
    {
      time: '12:00',
      energy: 'Baja',
      title: 'Pausa antiansiedad guiada',
      method: 'Respiración 4-7-8',
      blocker: 'Notificaciones silenciadas',
      progress: 58,
    },
    {
      time: '16:30',
      energy: 'Alta',
      title: 'Entrega y validación final',
      method: 'Deep Focus 60',
      blocker: 'Bloqueo completo',
      progress: 92,
    },
  ];

  return (
    <View style={styles.sectionGap}>
      <Card>
        <AppText variant="title">
          Plan personalizado {user?.role === 'guest' ? 'de demostración' : `para ${user?.name}`}
        </AppText>
        <AppText variant="muted">
          Agenda visual con horarios, energía estimada, método de enfoque y control de distractores.
        </AppText>
      </Card>

      <View style={styles.timeline}>
        {items.map((item, index) => (
          <Card key={item.time} style={[styles.timelineCard, isPhone && styles.timelineCardPhone]}>
            <View style={styles.timelineLeft}>
              <View style={[styles.time, { backgroundColor: t.primary }]}>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>

              <View style={[styles.energyPillMobile, { backgroundColor: t.card2, borderColor: t.border }]}>
                <Text numberOfLines={1} style={{ color: t.text, fontWeight: '900', fontSize: 11 }}>
                  {item.energy}
                </Text>
              </View>
            </View>

            <View style={styles.timelineContent}>
              <AppText variant="subtitle" style={isPhone ? styles.timelineTitlePhone : undefined}>
                {item.title}
              </AppText>

              <AppText variant="muted">Método: {item.method}</AppText>
              <AppText variant="muted">{item.blocker}</AppText>

              <View style={[styles.progress, { backgroundColor: t.card2 }]}>
                <View
                  style={[
                    styles.progressIn,
                    {
                      backgroundColor: index % 2 ? t.accent : t.success,
                      width: `${item.progress}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.kpis}>
        <Kpi label="Enfoque sugerido" value="3.8 h" icon="timer-outline" />
        <Kpi label="Distractores" value="5 apps" icon="ban-outline" />
        <Kpi label="Fatiga" value="Media" icon="pulse-outline" />
      </View>
    </View>
  );
}

const emptyRecord: Omit<FocusRecord, 'id' | 'createdAt'> = {
  title: '',
  owner: '',
  category: 'Estudio',
  priority: 'Media',
  status: 'Pendiente',
  duration: '25 min',
  blocker: '',
  notes: '',
};

function AdminCrud() {
  const { records, addRecord, updateRecord, deleteRecord, settings } = useFocusAI();
  const t = buildTheme(settings);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Todos');
  const [editing, setEditing] = useState<FocusRecord | null>(null);
  const [form, setForm] = useState<Omit<FocusRecord, 'id' | 'createdAt'> | FocusRecord>(emptyRecord);

  const filtered = useMemo(
    () =>
      records.filter(
        (record) =>
          (status === 'Todos' || record.status === status) &&
          `${record.title} ${record.owner} ${record.category} ${record.blocker}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [records, query, status]
  );

  const save = async () => {
    if (!form.title.trim() || !form.owner.trim()) {
      Alert.alert('FocusAI', 'Título y responsable son obligatorios.');
      return;
    }

    if (editing) {
      await updateRecord({ ...editing, ...form } as FocusRecord);
      setEditing(null);
    } else {
      await addRecord(form);
    }

    setForm(emptyRecord);
  };

  return (
    <View style={styles.sectionGap}>
      <Card>
        <AppText variant="title">CRUD administrativo real</AppText>
        <AppText variant="muted">
          Solo aparece para Administrador. Permite crear, consultar, buscar, filtrar, editar y eliminar registros.
        </AppText>
      </Card>

      <Card>
        <AppText variant="subtitle">{editing ? 'Editar registro' : 'Nuevo registro'}</AppText>

        <View style={styles.formGrid}>
          <View style={styles.fieldCell}>
            <Field label="Título" value={form.title} onChangeText={(value: string) => setForm({ ...form, title: value })} placeholder="Nombre del registro" />
          </View>
          <View style={styles.fieldCell}>
            <Field label="Responsable" value={form.owner} onChangeText={(value: string) => setForm({ ...form, owner: value })} placeholder="Responsable" />
          </View>
          <View style={styles.fieldCell}>
            <Field label="Categoría" value={form.category} onChangeText={(value: string) => setForm({ ...form, category: value })} placeholder="Categoría" />
          </View>
          <View style={styles.fieldCell}>
            <Field label="Duración" value={form.duration} onChangeText={(value: string) => setForm({ ...form, duration: value })} placeholder="25 min" />
          </View>
          <View style={styles.fieldCell}>
            <Field label="Bloqueador" value={form.blocker} onChangeText={(value: string) => setForm({ ...form, blocker: value })} placeholder="Apps a bloquear" />
          </View>
          <View style={styles.fieldCellFull}>
            <Field label="Notas" value={form.notes} onChangeText={(value: string) => setForm({ ...form, notes: value })} placeholder="Notas del registro" multiline />
          </View>
        </View>

        <View style={styles.actions}>
          <Button label={editing ? 'Actualizar registro' : 'Crear registro'} icon="save-outline" onPress={save} />
          {editing ? (
            <Button
              label="Cancelar edición"
              variant="secondary"
              onPress={() => {
                setEditing(null);
                setForm(emptyRecord);
              }}
            />
          ) : null}
        </View>
      </Card>

      <Card>
        <AppText variant="subtitle">Consulta de registros</AppText>

        <View style={styles.filterRow}>
          <View style={styles.fieldCellFull}>
            <Field label="Buscar" value={query} onChangeText={setQuery} placeholder="Buscar registros" />
          </View>

          <View style={{ gap: 8 }}>
            <AppText variant="muted" style={{ fontWeight: '900' }}>Estado</AppText>
            <View style={styles.roleGrid}>
              {['Todos', 'Pendiente', 'En progreso', 'Completado', 'Bloqueado'].map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setStatus(item)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: status === item ? t.primary : t.card2,
                      borderColor: t.border,
                    },
                  ]}
                >
                  <Text style={{ color: status === item ? '#fff' : t.text, fontWeight: '900', fontSize: 12 }}>
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.recordList}>
          {filtered.map((record) => (
            <View key={record.id} style={[styles.record, { borderColor: t.border, backgroundColor: t.card2 }]}>
              <View style={styles.recordInfo}>
                <AppText variant="subtitle">{record.title}</AppText>
                <AppText variant="muted">{record.owner} · {record.category} · {record.duration}</AppText>
                <AppText variant="muted">Estado: {record.status} · Prioridad: {record.priority}</AppText>
                <AppText variant="muted">Bloqueador: {record.blocker || 'Sin bloqueo'}</AppText>
              </View>

              <View style={styles.actionsMini}>
                <Button
                  label="Editar"
                  variant="secondary"
                  onPress={() => {
                    setEditing(record);
                    setForm({ ...record });
                  }}
                />
                <Button label="Eliminar" variant="danger" onPress={() => deleteRecord(record.id)} />
              </View>
            </View>
          ))}

          {filtered.length === 0 ? (
            <View style={[styles.emptyState, { borderColor: t.border }]}>
              <AppText variant="subtitle">Sin registros encontrados</AppText>
              <AppText variant="muted">Ajusta los filtros o crea un nuevo registro.</AppText>
            </View>
          ) : null}
        </View>
      </Card>
    </View>
  );
}

function Analytics() {
  return (
    <View style={styles.sectionGap}>
      <View style={styles.kpis}>
        <Kpi label="Enfoque semanal" value="35.1 h" icon="time-outline" />
        <Kpi label="Cumplimiento" value="82%" icon="trending-up-outline" />
        <Kpi label="Distracción" value="-12%" icon="remove-circle-outline" />
      </View>

      <Card>
        <AppText variant="title">Horas de enfoque por día</AppText>
        <BarChart />
        <AppText variant="muted">Las barras muestran concentración estimada con base en la agenda IA.</AppText>
      </Card>

      <Card>
        <AppText variant="title">Apps distractoras detectadas</AppText>
        <View style={styles.infoGrid}>
          {['TikTok', 'Instagram', 'X / Twitter', 'WhatsApp'].map((app, index) => (
            <Info
              key={app}
              title={app}
              text={`Riesgo de distracción ${['alto', 'alto', 'medio', 'medio'][index]}. Acción sugerida: bloqueo temporal.`}
              icon="phone-portrait-outline"
            />
          ))}
        </View>
      </Card>
    </View>
  );
}

function BarChart() {
  const { settings } = useFocusAI();
  const t = buildTheme(settings);

  return (
    <View style={[styles.chart, { backgroundColor: t.card2 }]}>
      {[48, 76, 64, 92, 70, 82, 54].map((height, index) => (
        <View key={index} style={[styles.bar, { height, backgroundColor: index === 3 ? t.accent : t.primary }]} />
      ))}
    </View>
  );
}

function Security() {
  const { user, menu } = useFocusAI();

  return (
    <View style={styles.sectionGap}>
      <Card>
        <AppText variant="title">Protección de rutas activa</AppText>
        <AppText variant="muted">
          El menú se genera desde permisos por rol. Las pantallas no autorizadas no aparecen ni se renderizan.
        </AppText>
      </Card>

      <View style={styles.kpis}>
        <Kpi label="Rol" value={user?.role.toUpperCase() || ''} icon="id-card-outline" />
        <Kpi label="Sesión" value="Persistente" icon="key-outline" />
        <Kpi label="Rutas visibles" value={String(menu.length)} icon="eye-outline" />
      </View>

      <Card>
        <AppText variant="subtitle">Permisos actuales</AppText>
        <View style={{ gap: 8, marginTop: 10 }}>
          {menu.map((key) => (
            <AppText key={key} variant="muted">✓ {meta[key].title}</AppText>
          ))}
        </View>
      </Card>
    </View>
  );
}

function Settings() {
  const { settings, updateSettings } = useFocusAI();

  return (
    <View style={styles.sectionGap}>
      <Card>
        <AppText variant="title">Preferencias funcionales</AppText>
        <AppText variant="muted">Estos ajustes modifican la interfaz y se conservan al actualizar la página.</AppText>
      </Card>

      <ToggleRow title="Modo claro / oscuro" subtitle={`Tema actual: ${settings.theme}`} value={settings.theme === 'dark'} onChange={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })} icon="moon-outline" />
      <ToggleRow title="Alto contraste" subtitle="Mejora lectura y diferenciación visual." value={settings.highContrast} onChange={() => updateSettings({ highContrast: !settings.highContrast })} icon="contrast-outline" />
      <ToggleRow title="Texto escalable" subtitle="Aumenta el tamaño tipográfico general." value={settings.largeText} onChange={() => updateSettings({ largeText: !settings.largeText })} icon="text-outline" />
      <ToggleRow title="Reducir movimiento" subtitle="Minimiza animaciones y transiciones." value={settings.reduceMotion} onChange={() => updateSettings({ reduceMotion: !settings.reduceMotion })} icon="remove-circle-outline" />
      <ToggleRow title="Música de fondo" subtitle="Ambiente sonoro simulado para concentración." value={settings.backgroundMusic} onChange={() => updateSettings({ backgroundMusic: !settings.backgroundMusic })} icon="musical-notes-outline" />
      <ToggleRow title="Notificaciones" subtitle="Recordatorios de inicio y salida de enfoque." value={settings.notifications} onChange={() => updateSettings({ notifications: !settings.notifications })} icon="notifications-outline" />
      <ToggleRow title="Navegación por teclado" subtitle="Botones grandes y etiquetas descriptivas." value={settings.keyboardNavigation} onChange={() => updateSettings({ keyboardNavigation: !settings.keyboardNavigation })} icon="keypad-outline" />
    </View>
  );
}

function Profile() {
  const { user, settings } = useFocusAI();

  return (
    <View style={styles.sectionGap}>
      <Card style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.avatar}</Text>
        </View>

        <AppText variant="title">{user?.name}</AppText>
        <AppText variant="muted">{user?.email}</AppText>
        <AppText variant="muted">{user?.area}</AppText>
      </Card>

      <View style={styles.kpis}>
        <Kpi label="Tema" value={settings.theme} icon="color-palette-outline" />
        <Kpi label="Accesibilidad" value={settings.highContrast || settings.largeText ? 'Activa' : 'Base'} icon="accessibility-outline" />
        <Kpi label="Persistencia" value="OK" icon="checkmark-circle-outline" />
      </View>

      <Card>
        <AppText variant="subtitle">Resumen de preferencias</AppText>
        <View style={{ gap: 8, marginTop: 10 }}>
          <AppText variant="muted">Tema: {settings.theme}</AppText>
          <AppText variant="muted">Alto contraste: {settings.highContrast ? 'Activado' : 'Desactivado'}</AppText>
          <AppText variant="muted">Texto escalable: {settings.largeText ? 'Activado' : 'Desactivado'}</AppText>
          <AppText variant="muted">Notificaciones: {settings.notifications ? 'Activadas' : 'Desactivadas'}</AppText>
        </View>
      </Card>
    </View>
  );
}

function roleLabel(role: string) {
  if (role === 'admin') return 'Administrador';
  if (role === 'student') return 'Estudiante';
  return 'Invitado';
}

function shortLabel(label: string) {
  if (label === 'Analíticas') return 'Stats';
  if (label === 'Registros') return 'CRUD';
  if (label === 'Seguridad') return 'Seg.';
  if (label === 'Ajustes') return 'Ajustes';
  return label;
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    padding: 16,
    gap: 16,
    flexDirection: 'row',
  },
  shellMobile: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    gap: 10,
  },
  sidebar: {
    borderWidth: 1,
    borderRadius: 30,
    padding: 16,
    gap: 16,
    justifyContent: 'space-between',
  },
  sidebarTop: {
    gap: 18,
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandRowTablet: {
    justifyContent: 'center',
  },
  logo: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontWeight: '900',
  },
  navColumn: {
    gap: 10,
  },
  navItemDesktop: {
    minHeight: 62,
    borderWidth: 1,
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navItemTablet: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    padding: 0,
  },
  userCard: {
    padding: 14,
    gap: 12,
  },
  userCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userMiniAvatar: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMiniAvatarText: {
    color: '#fff',
    fontWeight: '900',
  },
  logoutIconBtn: {
    width: 64,
    height: 54,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  mainArea: {
    flex: 1,
    minWidth: 0,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    alignSelf: 'center',
    width: '100%',
    gap: 18,
  },
  mobileHeader: {
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 76,
  },
  mobileBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
    paddingRight: 6,
  },
  mobileBrandText: {
    flex: 1,
    minWidth: 0,
  },
  mobileLogo: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileTitle: {
    fontSize: 19,
    lineHeight: 23,
    fontWeight: '900',
  },
  mobileSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  mobileHeaderActions: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 0,
  },
  mobileActionBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topbar: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  topbarMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  topbarText: {
    flex: 1,
    minWidth: 0,
  },
  topActions: {
    gap: 10,
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  bottomNav: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    left: 10,
    right: 10,
    borderWidth: 1,
    borderRadius: 24,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  } as any,
  bottomNavItem: {
    flex: 1,
    minWidth: 0,
    minHeight: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    gap: 3,
  },
  bottomNavLabel: {
    fontWeight: '900',
    textAlign: 'center',
  },
  sectionGap: {
    gap: 18,
  },
  kpis: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  kpi: {
    flex: 1,
    minWidth: 150,
    gap: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  info: {
    flex: 1,
    minWidth: 210,
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    gap: 8,
  },
  timeline: {
    gap: 12,
  },
  timelineCard: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  timelineCardPhone: {
    gap: 12,
    padding: 16,
  },
  timelineLeft: {
    width: 78,
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  timelineContent: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  timelineTitlePhone: {
    fontSize: 18,
    lineHeight: 24,
  },
  energyPillMobile: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    maxWidth: 76,
    alignItems: 'center',
  },
  time: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  timeText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 13,
  },
  progress: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 10,
    width: '100%',
  },
  progressIn: {
    height: '100%',
    borderRadius: 999,
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 14,
  },
  fieldCell: {
    flex: 1,
    minWidth: 220,
  },
  fieldCellFull: {
    width: '100%',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
  },
  filterRow: {
    gap: 14,
    marginTop: 14,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  recordList: {
    marginTop: 16,
    gap: 12,
  },
  record: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 14,
    gap: 12,
  },
  recordInfo: {
    gap: 4,
  },
  actionsMini: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  emptyState: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 22,
    padding: 18,
    gap: 6,
  },
  chart: {
    height: 210,
    borderRadius: 24,
    marginVertical: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  bar: {
    width: 28,
    borderRadius: 12,
  },
  profileCard: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 32,
    backgroundColor: '#a855f7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: '900',
  },
});