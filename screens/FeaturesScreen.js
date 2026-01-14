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
  Alert,
} from 'react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useSettings } from '../contexts/SettingsContext';

const FEATURES = [
  {
    id: 1,
    title: 'Feature 1: Tracking Daily Insulin Intake',
    description: 'Allows Tracking of daily insulin intake.',
  },
  {
    id: 2,
    title: 'Feature 2: Detailed Analytics',
    description: 'Provides detailed analytics of insulin usage over time.',
  },
  {
    id: 3,
    title: 'Feature 3: Wearable Integration',
    description: 'Integrates with wearable devices for real-time tracking.',
  },
  {
    id: 4,
    title: 'Feature 4: Medication Reminders',
    description: 'Offers medication and insulin reminders.',
  },
  {
    id: 5,
    title: 'Feature 5: Doctor Summaries',
    description: 'Generates easy-to-read summaries for doctors.',
  },
];

export default function FeaturesScreen() {
  const { clientId, isLoaded } = useSettings();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const saveEmail = useMutation(api.featureEmails.save);
  const existingEmail = useQuery(
    api.featureEmails.getByClient,
    clientId ? { clientId } : "skip"
  );

  useEffect(() => {
    if (existingEmail && existingEmail.email) {
      setEmail(existingEmail.email);
    }
  }, [existingEmail]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
      return;
    }

    if (!clientId) {
      Alert.alert('Erreur', 'Client ID non disponible');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveEmail({ email: email.trim(), clientId });
      Alert.alert(
        'Succès',
        'Votre adresse email a été enregistrée avec succès!'
      );
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de l\'enregistrement de votre email'
      );
      console.error('Error saving email:', error);
    } finally {
      setIsSubmitting(false);
    }
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
        <Text style={styles.title}>Fonctionnalités à Venir</Text>
        <Text style={styles.subtitle}>
          Découvrez les nouvelles fonctionnalités qui seront bientôt disponibles
        </Text>

        <View style={styles.featuresSection}>
          {FEATURES.map((feature) => (
            <View key={feature.id} style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <Text style={styles.featureIcon}>✨</Text>
                <Text style={styles.featureTitle}>{feature.title}</Text>
              </View>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.emailSection}>
          <Text style={styles.emailSectionTitle}>
            Restez informé des nouvelles fonctionnalités
          </Text>
          <Text style={styles.emailSectionSubtitle}>
            Entrez votre adresse email pour recevoir des mises à jour
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="votre@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Enregistrement...' : 'S\'inscrire'}
            </Text>
          </TouchableOpacity>
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
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
    lineHeight: 20,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 36,
  },
  emailSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emailSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  emailSectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
