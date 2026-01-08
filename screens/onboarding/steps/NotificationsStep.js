import { StyleSheet, Text, View } from 'react-native';

export default function NotificationsStep() {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Les notifications vous permettront de recevoir des rappels utiles, comme les alertes de fin de minuteur après une injection.
      </Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          Les notifications seront configurées automatiquement lors de l'installation de la version finale de l'application.
        </Text>
      </View>

      <Text style={styles.hint}>
        Vous pourrez gérer les notifications dans les paramètres de votre téléphone.
      </Text>
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
    marginBottom: 32,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1565c0',
    lineHeight: 20,
  },
  hint: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
