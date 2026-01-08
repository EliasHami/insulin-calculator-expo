import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../convex/_generated/api';

const SettingsContext = createContext(null);

const ONBOARDING_KEY = 'onboardingComplete';

const DEFAULT_SETTINGS = {
  targetGlucose: '',
  insulinSensitivity: '',
  mealCoefficients: {
    breakfast: '',
    lunch: '',
    dinner: '',
    snack: '',
  },
};

function generateClientId() {
  return 'client_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function SettingsProvider({ children }) {
  const [clientId, setClientId] = useState(null);
  const [localSettings, setLocalSettings] = useState(DEFAULT_SETTINGS);
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(null);

  const convexSettings = useQuery(
    api.settings.get,
    clientId ? { clientId } : 'skip'
  );
  const upsertSettings = useMutation(api.settings.upsert);

  useEffect(() => {
    loadClientId();
  }, []);

  useEffect(() => {
    if (convexSettings) {
      setLocalSettings({
        targetGlucose: convexSettings.targetGlucose,
        insulinSensitivity: convexSettings.insulinSensitivity,
        mealCoefficients: convexSettings.mealCoefficients,
      });
    }
  }, [convexSettings]);

  const loadClientId = async () => {
    try {
      let id = await AsyncStorage.getItem('clientId');
      if (!id) {
        id = generateClientId();
        await AsyncStorage.setItem('clientId', id);
      }
      setClientId(id);

      const onboardingStatus = await AsyncStorage.getItem(ONBOARDING_KEY);
      let isComplete = false;
      if (onboardingStatus !== null) {
        isComplete = onboardingStatus === true;
      }
      setOnboardingComplete(isComplete);
    } catch {
      const id = generateClientId();
      setClientId(id);
      setOnboardingComplete(false);
    } finally {
      setIsClientLoaded(true);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(true));
      setOnboardingComplete(true);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(false));
      setOnboardingComplete(false);
    } catch (error) {
      console.error('Error resetting onboarding status:', error);
    }
  };

  const saveToConvex = useCallback(
    async (newSettings) => {
      if (!clientId) return;
      try {
        await upsertSettings({
          clientId,
          targetGlucose: newSettings.targetGlucose,
          insulinSensitivity: newSettings.insulinSensitivity,
          mealCoefficients: newSettings.mealCoefficients,
        });
      } catch (error) {
        console.error('Error saving settings to Convex:', error);
      }
    },
    [clientId, upsertSettings]
  );

  const updateSettings = useCallback(
    async (newSettings) => {
      const updated = { ...localSettings, ...newSettings };
      setLocalSettings(updated);
      await saveToConvex(updated);
    },
    [localSettings, saveToConvex]
  );

  const updateMealCoefficient = useCallback(
    async (meal, value) => {
      const newCoefficients = { ...localSettings.mealCoefficients, [meal]: value };
      const updated = { ...localSettings, mealCoefficients: newCoefficients };
      setLocalSettings(updated);
      await saveToConvex(updated);
    },
    [localSettings, saveToConvex]
  );

  const isLoaded = isClientLoaded && (convexSettings !== undefined || convexSettings === null);

  return (
    <SettingsContext.Provider
      value={{
        settings: localSettings,
        clientId,
        isLoaded,
        onboardingComplete,
        updateSettings,
        updateMealCoefficient,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
