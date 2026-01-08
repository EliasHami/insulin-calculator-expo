import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ConvexProvider } from 'convex/react';
import { ConvexReactClient } from 'convex/react';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import CalculatorScreen from './screens/CalculatorScreen';
import SettingsScreen from './screens/SettingsScreen';
import OnboardingScreen from './screens/onboarding/OnboardingScreen';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabIcon({ name, focused }) {
  const icons = {
    calculator: focused ? '🧮' : '🔢',
    settings: focused ? '⚙️' : '🔧',
  };
  return <Text style={{ fontSize: 24 }}>{icons[name]}</Text>;
}

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4CAF50" />
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      }}
    >
      <Tab.Screen
        name="Calculateur"
        component={CalculatorScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="calculator" focused={focused} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Paramètres"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="settings" focused={focused} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { isLoaded, onboardingComplete } = useSettings();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {onboardingComplete === false ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <Stack.Screen name="Main" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <SettingsProvider>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </SettingsProvider>
    </ConvexProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    paddingBottom: 8,
    height: 70,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  header: {
    backgroundColor: '#4CAF50',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
