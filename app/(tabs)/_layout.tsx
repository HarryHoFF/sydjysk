import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { Home, CreditCard, Users, MoreHorizontal } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green400,
        tabBarInactiveTintColor: colors.gray600,
        tabBarStyle: {
          backgroundColor: colors.dark100,
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.06)',
          height: Platform.OS === 'web' ? 72 : 84,
          paddingBottom: Platform.OS === 'web' ? 14 : 28,
          paddingTop: 10,
          elevation: 0,
          ...(Platform.OS === 'web' ? { position: 'relative' as const } : {}),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hjem',
          tabBarIcon: ({ color }) => <Home size={22} color={color} strokeWidth={1.8} />,
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: 'Kort',
          tabBarIcon: ({ color }) => <CreditCard size={22} color={color} strokeWidth={1.8} />,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Kontakter',
          tabBarIcon: ({ color }) => <Users size={22} color={color} strokeWidth={1.8} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Mere',
          tabBarIcon: ({ color }) => <MoreHorizontal size={22} color={color} strokeWidth={1.8} />,
        }}
      />
    </Tabs>
  );
}
