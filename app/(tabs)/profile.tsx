import CustomSafeArea from '@/components/ui/CustomSafeArea';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';


type ProfileLinkProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

const ProfileLink = ({ title, icon, onPress }: ProfileLinkProps) => (
  <TouchableOpacity style={styles.linkButton} onPress={onPress}>
    <Ionicons name={icon} size={24} color={Colors.primary} />
    <Text style={styles.linkText}>{title}</Text>
    <Ionicons name="chevron-forward" size={24} color={Colors.grey} />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  return (
    <CustomSafeArea withTabBar>
      <ScreenHeader title="Perfil del Paciente" showBackButton={false} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.placeholderText}>[Info del Paciente: Matias Medina, etc.]</Text>
        
        
        <ProfileLink title="Medicamentos" icon="medkit-outline" onPress={() => router.push('./medications')} />
        <ProfileLink title="Exámenes Médicos" icon="document-text-outline" onPress={() => { /*  */ }} />
        <ProfileLink title="Encargados / Contactos" icon="people-outline" onPress={() => router.push('./(tabs)/contacts')} />
      </ScrollView>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: { padding: 20, gap: 15 },
  placeholderText: { textAlign: 'center', color: Colors.text, paddingVertical: 40 },
  linkButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: 15, borderRadius: 10, gap: 15 },
  linkText: { flex: 1, fontSize: 16, fontWeight: '500' },
});