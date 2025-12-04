import ActionSheetModal, { ActionOption } from '@/components/ui/ActionSheetModal';
import CustomSafeArea from '@/components/ui/CustomSafeArea';
import StyledButton from '@/components/ui/StyledButton';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { careGroupApi, groupsApi } from '@/services/api'; // <--- Importar API
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

type Group = {
  id: string;
  patientName: string;
  role: 'admin' | 'member';
  photoUrl: string;
  membersCount: number;
};

export default function SelectGroupScreen() {
  const router = useRouter();
  const { onLogout, authState } = useAuth(); // <--- Obtenemos authState para datos del usuario
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const userName = "Usuario"; 

  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);
  const [isGroupMenuVisible, setIsGroupMenuVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      const response = await groupsApi.getMyGroups();
      setGroups(response.data);
    } catch (error) {
      console.error("Error cargando grupos", error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudieron cargar los grupos' });
    } finally {
      setIsLoading(false);
    }
  };


  const handleLogout = async () => {
    setIsUserMenuVisible(false);
    await onLogout();
    router.replace('/(auth)/login');
  };

  const handleGroupPress = (group: Group) => {
    console.log("Entrando a grupo ID:", group.id);
    router.replace('/(tabs)');
  };

  const handleDeleteGroup = (groupId: string) => {
     Toast.show({ type: 'success', text1: 'Grupo eliminado', text2: `ID: ${groupId}` });
  };
  
  const handleEditGroup = (groupId: string) => {
     Toast.show({ type: 'info', text1: 'Editar Grupo', text2: `ID: ${groupId}` });
  };

  const openGroupMenu = (group: Group) => {
    setSelectedGroup(group);
    setIsGroupMenuVisible(true);
  };

  const handleCreateGroup = async () => {
  try {
    await careGroupApi.create({
      group_name: 'Grupo de prueba',
      photo_url: null,

      patient_names: 'Juan',
      patient_surnames: 'Pérez',
      patient_cellphone: '912345678',
      patient_telephone: null,
      patient_address: 'Santiago',
    });

    Toast.show({ type: 'success', text1: 'Grupo creado' });
    loadGroups();

  } catch (error) {
    console.error(error);
    Toast.show({ type: 'error', text1: 'Error al crear grupo' });
  }
};


  const userMenuOptions: ActionOption[] = [
    { label: 'Cerrar Sesión', icon: 'log-out-outline', isDestructive: true, onPress: handleLogout },
  ];

  const getGroupMenuOptions = (): ActionOption[] => [
    { label: 'Editar Grupo', icon: 'create-outline', onPress: () => selectedGroup && handleEditGroup(selectedGroup.id) },
    { label: 'Eliminar Grupo', icon: 'trash-outline', isDestructive: true, onPress: () => selectedGroup && handleDeleteGroup(selectedGroup.id) },
  ];

  const renderGroupItem = ({ item }: { item: Group }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => handleGroupPress(item)}>
      <Image 
        source={{ uri: item.photoUrl }} 
        style={styles.cardImage} 
        defaultSource={require('../../assets/images/avatar.png')} // Imagen por defecto si falla la URL
      />
      
      <View style={styles.cardContent}>
        <Text style={styles.patientName}>{item.patientName}</Text>
        <Text style={styles.memberCount}>
          {item.membersCount} cuidadores • {item.role === 'admin' ? 'Administrador' : 'Miembro'}
        </Text>
      </View>

      {item.role === 'admin' && (
        <TouchableOpacity style={styles.optionsButton} onPress={() => openGroupMenu(item)}>
            <Ionicons name="ellipsis-vertical" size={24} color={Colors.grey || '#999'} />
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
                source={require('../../assets/images/avatar.png')} // Podrías usar authState.user.photoUrl si lo tienes
                style={styles.userAvatar} 
            />
            <View style={styles.badge} /> 
          </TouchableOpacity>
          
          <View>
            <Text style={styles.greeting}>Hola!</Text>
            <Text style={styles.subGreeting}>Selecciona un grupo de cuidado</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Tus Grupos</Text>
        
        {isLoading ? (
            <View style={{ marginTop: 50 }}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        ) : (
            <FlatList
                data={groups}
                keyExtractor={(item) => item.id}
                renderItem={renderGroupItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 30 }}>
                        <Text style={{ color: '#666' }}>Aún no tienes grupos.</Text>
                        <Text style={{ color: '#666' }}>¡Crea uno abajo!</Text>
                    </View>
                }
            />
        )}

        <View style={styles.footer1}>
            <StyledButton 
                title="Unirse a nuevo grupo" 
                onPress={() => router.replace('/find-group')}
                //onPress={() => Toast.show({ type: 'info', text1: 'Pronto', text2: 'Unirse a grupo en construcción' })}
                variant="secondary"
                style={{ borderWidth: 1, borderColor: Colors.primary }}
            />
        </View>

        <View style={styles.footer2}>
            <StyledButton 
                title="Crear nuevo grupo" 
                onPress={() => router.replace('/create-group')}
                //onPress={() => Toast.show({ type: 'info', text1: 'Pronto', text2: 'Crear grupo en construcción' })}
                variant="secondary"
                style={{ borderWidth: 1, borderColor: Colors.primary }}
            />
        </View>

        <ActionSheetModal
            visible={isUserMenuVisible}
            onClose={() => setIsUserMenuVisible(false)}
            title="Mi Cuenta"
            options={userMenuOptions}
        />

        <ActionSheetModal
            visible={isGroupMenuVisible}
            onClose={() => setIsGroupMenuVisible(false)}
            title={selectedGroup ? selectedGroup.patientName : 'Opciones'}
            options={getGroupMenuOptions()}
        />

      </View>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    header: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 30, gap: 15 },
    avatarContainer: { position: 'relative' },
    userAvatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: Colors.primary },
    badge: { position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: '#22c55e', borderWidth: 2, borderColor: Colors.white },
    greeting: { fontSize: 18, fontWeight: 'bold', color: Colors.text || '#000' },
    subGreeting: { fontSize: 14, color: Colors.textLight || '#666' },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.primaryDark, marginBottom: 15 },
    listContainer: { gap: 15, paddingBottom: 100 },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: 15, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    cardImage: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#eee' },
    cardContent: { flex: 1, marginLeft: 15 },
    patientName: { fontSize: 16, fontWeight: 'bold', color: Colors.text || '#000' },
    memberCount: { fontSize: 12, color: Colors.textLight || '#666', marginTop: 2 },
    optionsButton: { padding: 10 },
    footer1: { position: 'absolute', bottom: 0, left: 20, right: 20 },
    footer2: { position: 'absolute', bottom: 70, left: 20, right: 20 }
});