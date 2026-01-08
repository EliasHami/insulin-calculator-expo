import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import InputField from '../components/InputField';

export default function SettingsScreen() {
  const { settings, updateSettings, updateMealCoefficient } = useSettings();

  const mealLabels = {
    breakfast: 'Petit-déjeuner',
    lunch: 'Déjeuner',
    dinner: 'Dîner',
    snack: 'Collation',
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
        <Text style={styles.title}>Paramètres</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Glycémie</Text>
          <InputField
            label="Glycémie cible"
            value={settings.targetGlucose}
            onChangeText={(value) => updateSettings({ targetGlucose: value })}
            placeholder="100"
            unit="mg/dL"
          />
          <InputField
            label="Sensibilité à l'insuline"
            value={settings.insulinSensitivity}
            onChangeText={(value) => updateSettings({ insulinSensitivity: value })}
            placeholder="0.5"
            unit="g/L/UI"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coefficients par repas</Text>
          <Text style={styles.sectionDescription}>
            Unités d'insuline par 10g de glucides
          </Text>
          {Object.entries(mealLabels).map(([key, label]) => (
            <InputField
              key={key}
              label={label}
              value={settings.mealCoefficients[key]}
              onChangeText={(value) => updateMealCoefficient(key, value)}
              placeholder="0"
              unit="UI/10g"
            />
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Informations</Text>
          <Text style={styles.infoText}>
            Ces paramètres sont sauvegardés automatiquement et utilisés pour tous vos calculs.
          </Text>
          <Text style={styles.infoText}>
            Consultez votre médecin pour déterminer les valeurs appropriées.
          </Text>
        </View>
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
  sectionDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  infoSection: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1565c0',
  },
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 8,
    lineHeight: 20,
  },
});
