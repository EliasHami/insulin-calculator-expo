import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useSettings } from '../../contexts/SettingsContext';
import InsulinSensitivityStep from './steps/InsulinSensitivityStep';
import TargetGlucoseStep from './steps/TargetGlucoseStep';
import MealCoefficientsStep from './steps/MealCoefficientsStep';
import NotificationsStep from './steps/NotificationsStep';

const STEPS = [
  { key: 'sensitivity', title: 'Sensibilité à l\'insuline' },
  { key: 'glucose', title: 'Glycémie cible' },
  { key: 'coefficients', title: 'Coefficients par repas' },
  { key: 'notifications', title: 'Notifications' },
];

export default function OnboardingScreen() {
  const { updateSettings, updateMealCoefficient, completeOnboarding } = useSettings();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    insulinSensitivity: '',
    targetGlucose: '',
    mealCoefficients: {
      breakfast: '',
      lunch: '',
      dinner: '',
      snack: '',
    },
  });

  const validateStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 0:
        if (!formData.insulinSensitivity || parseFloat(formData.insulinSensitivity) <= 0) {
          newErrors.sensitivity = 'Veuillez entrer une valeur valide';
        }
        break;
      case 1:
        if (!formData.targetGlucose || parseFloat(formData.targetGlucose) <= 0) {
          newErrors.glucose = 'Veuillez entrer une valeur valide';
        }
        break;
      case 2:
        const hasAtLeastOne = Object.values(formData.mealCoefficients).some(
          (v) => v && parseFloat(v) > 0
        );
        if (!hasAtLeastOne) {
          newErrors.coefficients = 'Veuillez renseigner au moins un coefficient';
        }
        break;
      case 3:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleFinish = async () => {
    if (!validateStep()) return;

    await updateSettings({
      insulinSensitivity: formData.insulinSensitivity,
      targetGlucose: formData.targetGlucose,
    });

    for (const [meal, value] of Object.entries(formData.mealCoefficients)) {
      if (value) {
        await updateMealCoefficient(meal, value);
      }
    }

    await completeOnboarding();
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateMealCoefficientLocal = (meal, value) => {
    setFormData((prev) => ({
      ...prev,
      mealCoefficients: { ...prev.mealCoefficients, [meal]: value },
    }));
    if (errors.coefficients) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.coefficients;
        return newErrors;
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <InsulinSensitivityStep
            value={formData.insulinSensitivity}
            onChange={(value) => updateFormData('insulinSensitivity', value)}
            error={errors.sensitivity}
          />
        );
      case 1:
        return (
          <TargetGlucoseStep
            value={formData.targetGlucose}
            onChange={(value) => updateFormData('targetGlucose', value)}
            error={errors.glucose}
          />
        );
      case 2:
        return (
          <MealCoefficientsStep
            values={formData.mealCoefficients}
            onChange={updateMealCoefficientLocal}
            error={errors.coefficients}
          />
        );
      case 3:
        return <NotificationsStep />;
      default:
        return null;
    }
  };

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.stepLabel}>
            Étape {currentStep + 1} sur {STEPS.length}
          </Text>
          <View style={styles.stepIndicator}>
            {STEPS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentStep && styles.dotActive,
                  index < currentStep && styles.dotCompleted,
                ]}
              />
            ))}
          </View>
          <Text style={styles.title}>{STEPS[currentStep].title}</Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep()}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary, currentStep === 0 && styles.buttonHidden]}
            onPress={handlePrevious}
            disabled={currentStep === 0}
          >
            <Text style={styles.buttonSecondaryText}>Précédent</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={isLastStep ? handleFinish : handleNext}
          >
            <Text style={styles.buttonPrimaryText}>
              {isLastStep ? 'Terminer' : 'Suivant'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  stepIndicator: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
    marginHorizontal: 6,
  },
  dotActive: {
    backgroundColor: '#4CAF50',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotCompleted: {
    backgroundColor: '#81c784',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    paddingBottom: 32,
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#4CAF50',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonHidden: {
    opacity: 0,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});
