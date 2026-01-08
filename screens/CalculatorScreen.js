import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useSettings } from '../contexts/SettingsContext';

function InputField({ label, value, onChangeText, placeholder, unit }) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
    </View>
  );
}

function MealSelector({ selectedMeal, onSelectMeal }) {
  const meals = [
    { key: 'breakfast', label: 'Petit-déj' },
    { key: 'lunch', label: 'Déjeuner' },
    { key: 'dinner', label: 'Dîner' },
    { key: 'snack', label: 'Collation' },
  ];

  return (
    <View style={styles.mealSelector}>
      {meals.map((meal) => (
        <TouchableOpacity
          key={meal.key}
          style={[
            styles.mealButton,
            selectedMeal === meal.key && styles.mealButtonSelected,
          ]}
          onPress={() => onSelectMeal(meal.key)}
        >
          <Text
            style={[
              styles.mealButtonText,
              selectedMeal === meal.key && styles.mealButtonTextSelected,
            ]}
          >
            {meal.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function CalculatorScreen() {
  const { settings, clientId, isLoaded } = useSettings();
  const [carbs, setCarbs] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('lunch');
  const [currentGlucose, setCurrentGlucose] = useState('');
  const [lastInjectionHours, setLastInjectionHours] = useState('');
  const [lastInjectionUnits, setLastInjectionUnits] = useState('');
  const [result, setResult] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const saveCalculation = useMutation(api.calculations.save);

  const getMealCoefficient = () => {
    return settings.mealCoefficients[selectedMeal] || '';
  };

  const calculateBolus = async () => {
    setSaveError(null);

    const carbsNum = Math.max(0, parseFloat(carbs) || 0);
    const mealCoefNum = Math.max(0, parseFloat(getMealCoefficient()) || 0);
    const currentGlucoseNum = Math.max(0, parseFloat(currentGlucose) || 0);
    const targetGlucoseNum = Math.max(0, parseFloat(settings.targetGlucose) || 0);
    const sensitivityNum = parseFloat(settings.insulinSensitivity);
    const lastHours = Math.max(0, parseFloat(lastInjectionHours) || 0);
    const lastUnits = Math.max(0, parseFloat(lastInjectionUnits) || 0);

    if (!sensitivityNum || sensitivityNum <= 0) {
      setSaveError('Configurez la sensibilité dans les paramètres');
      return;
    }

    if (!mealCoefNum || mealCoefNum <= 0) {
      setSaveError('Configurez le coefficient repas dans les paramètres');
      return;
    }

    const mealBolus = (carbsNum / 10) * mealCoefNum;

    let correctionBolus = 0;
    if (currentGlucoseNum > targetGlucoseNum && sensitivityNum > 0) {
      const glucoseDiffInGL = (currentGlucoseNum - targetGlucoseNum) / 100;
      correctionBolus = glucoseDiffInGL / sensitivityNum;
    }

    let iob = 0;
    if (lastHours < 4 && lastUnits > 0) {
      iob = lastUnits * (1 - lastHours / 4);
    }

    const totalBolus = Math.max(0, mealBolus + correctionBolus - iob);

    const calculationResult = {
      mealBolus: Math.round(mealBolus * 100) / 100,
      correctionBolus: Math.round(correctionBolus * 100) / 100,
      iob: Math.round(iob * 100) / 100,
      totalBolus: Math.round(totalBolus * 100) / 100,
    };

    setResult(calculationResult);

    if (clientId) {
      try {
        await saveCalculation({
          clientId,
          carbs: carbsNum,
          mealCoefficient: mealCoefNum,
          currentGlucose: currentGlucoseNum,
          targetGlucose: targetGlucoseNum,
          insulinSensitivity: sensitivityNum,
          lastInjectionHours: lastHours,
          lastInjectionUnits: lastUnits,
          mealBolus: calculationResult.mealBolus,
          correctionBolus: calculationResult.correctionBolus,
          totalBolus: calculationResult.totalBolus,
        });
      } catch (error) {
        setSaveError('Erreur lors de la sauvegarde');
      }
    }
  };

  const isFormValid = () => {
    return (
      carbs !== '' &&
      currentGlucose !== '' &&
      isLoaded &&
      settings.targetGlucose !== '' &&
      settings.insulinSensitivity !== '' &&
      getMealCoefficient() !== ''
    );
  };

  const hasSettingsConfigured = () => {
    return (
      settings.targetGlucose !== '' &&
      settings.insulinSensitivity !== '' &&
      Object.values(settings.mealCoefficients).some((v) => v !== '')
    );
  };

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Calculateur d'Insuline</Text>

        {!hasSettingsConfigured() && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              Configurez vos paramètres dans l'onglet Paramètres
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Repas</Text>
          <MealSelector selectedMeal={selectedMeal} onSelectMeal={setSelectedMeal} />
          <View style={styles.coefficientInfo}>
            <Text style={styles.coefficientLabel}>Coefficient:</Text>
            <Text style={styles.coefficientValue}>
              {getMealCoefficient() || '—'} UI/10g
            </Text>
          </View>
          <InputField
            label="Glucides"
            value={carbs}
            onChangeText={setCarbs}
            placeholder="0"
            unit="g"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Glycémie</Text>
          <InputField
            label="Glycémie actuelle"
            value={currentGlucose}
            onChangeText={setCurrentGlucose}
            placeholder="0"
            unit="mg/dL"
          />
          <View style={styles.settingsInfo}>
            <Text style={styles.settingsInfoLabel}>Glycémie cible:</Text>
            <Text style={styles.settingsInfoValue}>
              {settings.targetGlucose || '—'} mg/dL
            </Text>
          </View>
          <View style={styles.settingsInfo}>
            <Text style={styles.settingsInfoLabel}>Sensibilité:</Text>
            <Text style={styles.settingsInfoValue}>
              {settings.insulinSensitivity || '—'} g/L/UI
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dernière injection</Text>
          <InputField
            label="Temps écoulé"
            value={lastInjectionHours}
            onChangeText={setLastInjectionHours}
            placeholder="0"
            unit="heures"
          />
          <InputField
            label="Unités injectées"
            value={lastInjectionUnits}
            onChangeText={setLastInjectionUnits}
            placeholder="0"
            unit="UI"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !isFormValid() && styles.buttonDisabled]}
          onPress={calculateBolus}
          disabled={!isFormValid()}
        >
          <Text style={styles.buttonText}>Calculer</Text>
        </TouchableOpacity>

        {saveError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{saveError}</Text>
          </View>
        )}

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Résultat</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Bolus repas:</Text>
              <Text style={styles.resultValue}>{result.mealBolus} UI</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Bolus correction:</Text>
              <Text style={styles.resultValue}>{result.correctionBolus} UI</Text>
            </View>
            {result.iob > 0 && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Insuline active (IOB):</Text>
                <Text style={styles.resultValue}>-{result.iob} UI</Text>
              </View>
            )}
            <View style={styles.resultDivider} />
            <View style={styles.resultRow}>
              <Text style={styles.resultLabelTotal}>Bolus total:</Text>
              <Text style={styles.resultValueTotal}>{result.totalBolus} UI</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  warningContainer: {
    backgroundColor: '#fff3e0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#ff9800',
  },
  warningText: {
    color: '#e65100',
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#555',
  },
  mealSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  mealButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  mealButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  mealButtonText: {
    fontSize: 14,
    color: '#666',
  },
  mealButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  coefficientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  coefficientLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  coefficientValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  settingsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  settingsInfoLabel: {
    fontSize: 14,
    color: '#666',
  },
  settingsInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  unit: {
    marginLeft: 10,
    fontSize: 14,
    color: '#888',
    minWidth: 60,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2e7d32',
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 16,
    color: '#555',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  resultDivider: {
    height: 1,
    backgroundColor: '#4CAF50',
    marginVertical: 12,
  },
  resultLabelTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  resultValueTotal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
});
