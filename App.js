import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
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
import { ConvexProvider, useMutation } from 'convex/react';
import { ConvexReactClient } from 'convex/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './convex/_generated/api';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL);

function generateClientId() {
  return 'client_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

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

function Calculator() {
  const [clientId, setClientId] = useState(null);
  const [carbs, setCarbs] = useState('');
  const [mealCoefficient, setMealCoefficient] = useState('');
  const [currentGlucose, setCurrentGlucose] = useState('');
  const [targetGlucose, setTargetGlucose] = useState('');
  const [insulinSensitivity, setInsulinSensitivity] = useState('');
  const [lastInjectionHours, setLastInjectionHours] = useState('');
  const [lastInjectionUnits, setLastInjectionUnits] = useState('');
  const [result, setResult] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const saveCalculation = useMutation(api.calculations.save);

  useEffect(() => {
    loadClientId();
  }, []);

  const loadClientId = async () => {
    try {
      let id = await AsyncStorage.getItem('clientId');
      if (!id) {
        id = generateClientId();
        await AsyncStorage.setItem('clientId', id);
      }
      setClientId(id);
    } catch {
      setClientId(generateClientId());
    }
  };

  const calculateBolus = async () => {
    setSaveError(null);

    const carbsNum = Math.max(0, parseFloat(carbs) || 0);
    const mealCoefNum = Math.max(0, parseFloat(mealCoefficient) || 0);
    const currentGlucoseNum = Math.max(0, parseFloat(currentGlucose) || 0);
    const targetGlucoseNum = Math.max(0, parseFloat(targetGlucose) || 0);
    const sensitivityNum = parseFloat(insulinSensitivity);
    const lastHours = Math.max(0, parseFloat(lastInjectionHours) || 0);
    const lastUnits = Math.max(0, parseFloat(lastInjectionUnits) || 0);

    // Validation: sensitivity must be a positive number
    if (!sensitivityNum || sensitivityNum <= 0) {
      setSaveError('La sensibilité à l\'insuline doit être un nombre positif');
      return;
    }

    // Meal bolus: (carbs / 10) * meal coefficient
    const mealBolus = (carbsNum / 10) * mealCoefNum;

    // Correction bolus: (current glucose - target glucose) / insulin sensitivity
    // Glucose is in mg/dL, sensitivity is in g/L/UI (1 g/L = 100 mg/dL)
    let correctionBolus = 0;
    if (currentGlucoseNum > targetGlucoseNum && sensitivityNum > 0) {
      const glucoseDiffInGL = (currentGlucoseNum - targetGlucoseNum) / 100;
      correctionBolus = glucoseDiffInGL / sensitivityNum;
    }

    // Adjust for insulin on board (IOB) - simple linear decay over 4 hours
    let iob = 0;
    if (lastHours < 4 && lastUnits > 0) {
      iob = lastUnits * (1 - lastHours / 4);
    }

    // Total bolus = meal bolus + correction bolus - IOB
    const totalBolus = Math.max(0, mealBolus + correctionBolus - iob);

    const calculationResult = {
      mealBolus: Math.round(mealBolus * 100) / 100,
      correctionBolus: Math.round(correctionBolus * 100) / 100,
      iob: Math.round(iob * 100) / 100,
      totalBolus: Math.round(totalBolus * 100) / 100,
    };

    setResult(calculationResult);

    // Save to Convex
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
      mealCoefficient !== '' &&
      currentGlucose !== '' &&
      targetGlucose !== '' &&
      insulinSensitivity !== ''
    );
  };

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Repas</Text>
          <InputField
            label="Glucides"
            value={carbs}
            onChangeText={setCarbs}
            placeholder="0"
            unit="g"
          />
          <InputField
            label="Coefficient repas (UI/10g)"
            value={mealCoefficient}
            onChangeText={setMealCoefficient}
            placeholder="0"
            unit="UI/10g"
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
          <InputField
            label="Glycémie cible"
            value={targetGlucose}
            onChangeText={setTargetGlucose}
            placeholder="0"
            unit="mg/dL"
          />
          <InputField
            label="Sensibilité à l'insuline"
            value={insulinSensitivity}
            onChangeText={setInsulinSensitivity}
            placeholder="0"
            unit="g/L/UI"
          />
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

        <StatusBar style="auto" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <Calculator />
    </ConvexProvider>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
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
