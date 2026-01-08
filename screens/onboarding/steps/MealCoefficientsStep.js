import { StyleSheet, Text, View } from 'react-native';
import InputField from '../../../components/InputField';

const mealLabels = {
  breakfast: 'Petit-déjeuner',
  lunch: 'Déjeuner',
  dinner: 'Dîner',
  snack: 'Collation',
};

export default function MealCoefficientsStep({ values, onChange, error }) {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Les coefficients indiquent le nombre d'unités d'insuline nécessaires pour 10 grammes de glucides, selon le repas.
      </Text>
      <Text style={styles.hint}>
        Ces valeurs peuvent varier d'un repas à l'autre. Renseignez au moins un coefficient.
      </Text>
      <View style={styles.inputWrapper}>
        {Object.entries(mealLabels).map(([key, label]) => (
          <InputField
            key={key}
            label={label}
            value={values[key]}
            onChangeText={(value) => onChange(key, value)}
            placeholder="0"
            unit="UI/10g"
          />
        ))}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 16,
  },
  hint: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorText: {
    fontSize: 12,
    color: '#f44336',
    marginTop: 8,
  },
});
