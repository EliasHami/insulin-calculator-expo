import { StyleSheet, Text, View } from 'react-native';
import InputField from '../../../components/InputField';

export default function InsulinSensitivityStep({ value, onChange, error }) {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        La sensibilité à l'insuline indique de combien votre glycémie baisse pour chaque unité d'insuline injectée.
      </Text>
      <Text style={styles.hint}>
        Cette valeur vous a été communiquée par votre médecin ou diabétologue.
      </Text>
      <View style={styles.inputWrapper}>
        <InputField
          label="Sensibilité à l'insuline"
          value={value}
          onChangeText={onChange}
          placeholder="0.5"
          unit="g/L/UI"
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
