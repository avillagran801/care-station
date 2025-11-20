import ActionSheetModal, { ActionOption } from '@/components/ui/ActionSheetModal'; // <--- Importar
import CustomSafeArea from '@/components/ui/CustomSafeArea';
import StyledButton from '@/components/ui/StyledButton';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

type Group = {
  id: string;
  patientName: string;
  role: 'admin' | 'member';
  photoUrl: string;
  membersCount: number;
};

const MOCK_GROUPS: Group[] = [
  { id: '1', patientName: 'Matías Medina', role: 'admin', photoUrl: 'https://i.pravatar.cc/100?u=ana', membersCount: 3 },
  { id: '2', patientName: 'Abuela Carmen', role: 'member', photoUrl: 'https://i.pravatar.cc/150?u=carmen', membersCount: 5 },
];

export default function SelectGroupScreen() {
  const router = useRouter();
  const { onLogout } = useAuth();
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);
  const [isGroupMenuVisible, setIsGroupMenuVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);


  const handleLogout = async () => {
    await onLogout();
    router.replace('/(auth)/login');
  };

  const handleDeleteGroup = (groupId: string) => {
    Toast.show({ type: 'success', text1: 'Grupo eliminado', text2: `ID: ${groupId}` });
  };

  const handleEditGroup = (groupId: string) => {
    Toast.show({ type: 'info', text1: 'Editar Grupo', text2: `ID: ${groupId}` });
  };


  const userMenuOptions: ActionOption[] = [
    { 
      label: 'Mi Cuenta', 
      icon: 'person-outline', 
      onPress: () => console.log("Ir a cuenta") 
    },
    { 
      label: 'Cerrar Sesión', 
      icon: 'log-out-outline', 
      isDestructive: true, 
      onPress: handleLogout 
    },
  ];

  const getGroupMenuOptions = (): ActionOption[] => [
    { 
      label: 'Editar Grupo', 
      icon: 'create-outline', 
      onPress: () => selectedGroup && handleEditGroup(selectedGroup.id) 
    },
    { 
      label: 'Eliminar Grupo', 
      icon: 'trash-outline', 
      isDestructive: true, 
      onPress: () => selectedGroup && handleDeleteGroup(selectedGroup.id) 
    },
  ];

  const handleGroupPress = (group: Group) => {
    console.log("Entrando a:", group.patientName);
    router.replace('/(tabs)');
  };

  const openGroupMenu = (group: Group) => {
    setSelectedGroup(group);
    setIsGroupMenuVisible(true);
  };

  
  const renderGroupItem = ({ item }: { item: Group }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => handleGroupPress(item)}
    >
      <Image source={{ uri: item.photoUrl }} style={styles.cardImage} />
      
      <View style={styles.cardContent}>
        <Text style={styles.patientName}>{item.patientName}</Text>
        <Text style={styles.memberCount}>
          {item.membersCount} cuidadores • {item.role === 'admin' ? 'Administrador' : 'Miembro'}
        </Text>
      </View>

      {item.role === 'admin' && (
        <TouchableOpacity 
            style={styles.optionsButton} 
            onPress={() => openGroupMenu(item)} 
        >
            <Ionicons name="ellipsis-vertical" size={24} color={Colors.grey} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <CustomSafeArea>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsUserMenuVisible(true)} style={styles.avatarContainer}>
            <Image 
                source={require('../assets/images/avatar.png')} 
                style={styles.userAvatar} 
            />
            <View style={styles.badge} /> 
          </TouchableOpacity>
          
          <View>
            <Text style={styles.greeting}>Hola, Usuario</Text>
            <Text style={styles.subGreeting}>Selecciona un grupo</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Tus Pacientes</Text>
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={renderGroupItem}
          contentContainerStyle={styles.listContainer}
        />

        <View style={styles.footer}>
            <StyledButton 
                title="Crear nuevo grupo" 
                onPress={() => Toast.show({ type: 'info', text1: 'Próximamente', text2: 'Pantalla de crear grupo' })}
                variant="secondary"
                style={{ borderWidth: 1, borderColor: Colors.primary }}
            />
        </View>

        
        <ActionSheetModal
            visible={isUserMenuVisible}
            onClose={() => setIsUserMenuVisible(false)}
            title="Configuración de Usuario"
            options={userMenuOptions}
        />

        <ActionSheetModal
            visible={isGroupMenuVisible}
            onClose={() => setIsGroupMenuVisible(false)}
            title={selectedGroup ? `Opciones para ${selectedGroup.patientName}` : 'Opciones de Grupo'}
            options={getGroupMenuOptions()}
        />

      </View>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 30,
      gap: 15,
    },
    avatarContainer: {
      position: 'relative',
    },
    userAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: Colors.primary,
    },
    badge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: '#22c55e', 
      borderWidth: 2,
      borderColor: Colors.light.background,
    },
    greeting: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.text,
    },
    subGreeting: {
      fontSize: 14,
      color: Colors.textLight,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.primaryDark,
      marginBottom: 15,
    },
    listContainer: {
      gap: 15,
      paddingBottom: 100,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.white,
      padding: 15,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2, 
    },
    cardImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#eee',
    },
    cardContent: {
      flex: 1,
      marginLeft: 15,
    },
    patientName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.text,
    },
    memberCount: {
      fontSize: 12,
      color: Colors.textLight,
      marginTop: 2,
    },
    optionsButton: {
      padding: 10,
    },
    footer: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
    }
  });