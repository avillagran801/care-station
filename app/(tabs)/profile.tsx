import CustomSafeArea from '@/components/ui/CustomSafeArea';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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

function ProfileCard() {
  return (
    <View style={styles.profileCard}>
      <Image
        source={require('../../assets/images/avatar2.png')}
        style={styles.avatar}
      />
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>Matías Medina</Text>
        <Text style={styles.profileMeta}>82 años</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Bienestar</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Tareas</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Med</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <CustomSafeArea withTabBar>
      <ImageBackground
        source={require('../../assets/images/background2.jpg')}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />
        {/*
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Perfil del Paciente</Text>
        </View>
        */}
        
        <ScrollView contentContainerStyle={styles.container}>
          <ProfileCard />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información</Text>
            <Text style={styles.sectionSubtitle}>
              Datos básicos, contacto y notas rápidas del paciente.
            </Text>
          </View>

          <View style={styles.links}>
            <ProfileLink
              title="Medicamentos"
              icon="medkit-outline"
              onPress={() => router.push('./medications')}
            />
            <ProfileLink
              title="Exámenes Médicos"
              icon="document-text-outline"
              onPress={() => router.push('./medical-tests')}
            />
            <ProfileLink
              title="Encargados / Contactos"
              icon="people-outline"
              onPress={() => router.push('./contacts')}
            />
            <ProfileLink
              title="Historial de Notas"
              icon="time-outline"
              onPress={() => router.push('./notes')}
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

  headerContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  /*headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.primaryDark2,
    textAlign: 'center',
  },
  */

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
    fontSize: 26,
    color: Colors.primaryDark2,
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
    minWidth: 70,
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.white,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
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