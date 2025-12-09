import CustomSafeArea from '@/components/ui/CustomSafeArea';
import Colors from '@/constants/Colors';
import { groupsApi, patientsApi } from '@/services/api'; // <--- Importamos las APIs
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

// --- COMPONENTES AUXILIARES ---

type ProfileLinkProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

const ProfileLink = ({ title, icon, onPress }: ProfileLinkProps) => (
  <TouchableOpacity style={styles.linkButton} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.linkLeft}>
      <Ionicons name={icon} size={22} color={Colors.white} />
    </View>
    <View style={styles.linkCenter}>
      <Text style={styles.linkTitle}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={Colors.grey} />
  </TouchableOpacity>
);

// Modificamos el ProfileCard para recibir datos
function ProfileCard({ patient, loading }: { patient: any, loading: boolean }) {
  if (loading) {
    return (
        <View style={[styles.profileCard, { justifyContent: 'center', height: 120 }]}>
            <ActivityIndicator color={Colors.primaryDark} />
        </View>
    );
  }

  if (!patient) {
      return (
        <View style={styles.profileCard}>
            <Text>No se encontró información del paciente.</Text>
        </View>
      );
  }

  return (
    <View style={styles.profileCard}>
      <Image
        source={require('../../assets/images/avatar2.png')} // Podrías poner una foto dinámica si existiera
        style={styles.avatar}
      />
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>
            {patient.names} {patient.surnames}
        </Text>
        
        {/* Como no tenemos edad en la BD, mostramos el celular o dirección */}
        <Text style={styles.profileMeta}>
            {patient.cellphone || patient.address || 'Sin información de contacto'}
        </Text>

        {/* Estos datos siguen siendo estáticos (Mocks) por ahora */}
        <View style={styles.statsRow}>
          
        </View>
      </View>
    </View>
  );
}

// --- PANTALLA PRINCIPAL ---

export default function ProfileScreen() {
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos cada vez que la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      fetchPatientData();
    }, [])
  );

  const fetchPatientData = async () => {
    try {
        setLoading(true);
        // 1. Obtener grupos para saber cual es el activo (Usamos el primero por defecto)
        const groupsRes = await groupsApi.getMyGroups();
        
        if (groupsRes.data && groupsRes.data.length > 0) {
            const activeGroupId = groupsRes.data[0].id; // Ojo: Aquí deberías usar el ID seleccionado globalmente si lo tuvieras

            // 2. Obtener todos los pacientes y filtrar
            const patientsRes = await patientsApi.getAll();
            const foundPatient = patientsRes.data.find((p: any) => p.care_group_id == activeGroupId);

            if (foundPatient) {
                setPatient(foundPatient);
            }
        }
    } catch (error) {
        console.error("Error fetching patient profile:", error);
        Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudieron cargar los datos del paciente.' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <CustomSafeArea withTabBar>
      <ImageBackground
        source={require('../../assets/images/background2.jpg')}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />
        
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* Tarjeta con datos reales */}
          <ProfileCard patient={patient} loading={loading} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información</Text>
            <Text style={styles.sectionSubtitle}>
              Datos básicos, contacto y notas rápidas del paciente.
            </Text>
          </View>

          <View style={styles.links}>
            {/* ENLACE FUNCIONAL A MEDICAMENTOS */}
            <ProfileLink
              title="Medicamentos"
              icon="medkit-outline"
              onPress={() => router.push('/medications')} 
            />
            
            <ProfileLink
              title="Exámenes Médicos"
              icon="document-text-outline"
              onPress={() => Toast.show({ type: 'info', text1: 'Próximamente', text2: 'Función en desarrollo' })}
            />
            
            <ProfileLink
              title="Encargados / Contactos"
              icon="people-outline"
              onPress={() => router.push('/(tabs)/contacts')} // Si ya tienes esta ruta en tabs
            />
            
            <ProfileLink
              title="Historial de Notas"
              icon="time-outline"
              onPress={() => Toast.show({ type: 'info', text1: 'Próximamente', text2: 'Función en desarrollo' })}
            />
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      </ImageBackground>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  container: {
    padding: 20,
    paddingTop: 8,
  },

  profileCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 248, 210, 0.34)',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 16,
    marginTop: 20,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },
  profileName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22, // Ajustado un poco por si el nombre es largo
    color: Colors.primaryDark2,
    flexWrap: 'wrap',
  },
  profileMeta: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.primaryDark2,
    opacity: 0.8,
    marginTop: 4,
  },

  statsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  stat: {
    backgroundColor: 'rgba(228, 131, 19, 0.45)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: Colors.white,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 1)',
  },

  section: {
    marginTop: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.white,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    textAlign: 'center'
  },

  links: {
    marginTop: 12,
    gap: 10,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  linkLeft: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(210, 151, 79, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  linkCenter: {
    flex: 1,
  },
  linkTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: Colors.primaryDark2,
  },
});