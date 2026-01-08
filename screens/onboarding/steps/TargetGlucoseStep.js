import { StyleSheet, Text, View } from 'react-native';
import InputField from '../../../components/InputField';

export default function TargetGlucoseStep({ value, onChange, error }) {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        La glycémie cible est le niveau de sucre dans le sang que vous souhaitez atteindre après un repas.
      </Text>
      <Text style={styles.hint}>
        Une valeur typique se situe entre 100 et 120 mg/dL. Consultez votre médecin pour votre objectif personnel.
      </Text>
      <View style={styles.inputWrapper}>
        <InputField
          label="Glycémie cible"
          value={value}
          onChangeText={onChange}
          placeholder="100"
          unit="mg/dL"
          error={error}
        />
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
});
