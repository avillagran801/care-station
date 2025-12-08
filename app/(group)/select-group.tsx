import GradientButton from '@/components/GradientButton';
import ActionSheetModal, { ActionOption } from '@/components/ui/ActionSheetModal';
import CustomSafeArea from '@/components/ui/CustomSafeArea';
import StyledButton from '@/components/ui/StyledButton';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useSelectedGroup } from '@/context/SelectedGroupContext';
import { careGroupApi, groupsApi } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [invitationCode, setInvitationCode] = useState('');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  // Allows to save the selected group in global context
  const { setGroupId } = useSelectedGroup();

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
    setGroupId(group.id);
    router.replace('/(tabs)');
  };

  const handleDeleteGroup = (groupId: string) => {
    Toast.show({ type: 'success', text1: 'Grupo eliminado', text2: `ID: ${groupId}` });
  };

  const handleEditGroup = (groupId: string) => {
    Toast.show({ type: 'info', text1: 'Editar Grupo', text2: `ID: ${groupId}` });
  };

  const handleInvitePress = async (groupId: string) => {
    // Cerramos el menú de opciones
    setIsGroupMenuVisible(false);
    setIsGeneratingCode(true);

    // Abrimos el modal de invitación (mostrando carga)
    setIsInviteModalVisible(true);

    try {
      const response = await groupsApi.generateInvitation(groupId);
      setInvitationCode(response.data.code);
    } catch (error) {
      setIsInviteModalVisible(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo generar el código de invitación.'
      });
      console.error(error);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(invitationCode);
    Toast.show({
      type: 'success',
      text1: 'Copiado',
      text2: 'Código copiado al portapapeles 📋'
    });
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
    {
      label: 'Invitar miembro',
      icon: 'person-add-outline',
      onPress: () => selectedGroup && handleInvitePress(selectedGroup.id)
    },
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

  const renderGroupItem = ({ item }: { item: Group }) => (
  <TouchableOpacity 
    style={styles.card} 
    activeOpacity={0.7} 
    onPress={() => handleGroupPress(item)}
  >
    
    {/* Lógica condicional para el Avatar/Icono */}
    {item.photoUrl ? (
      // Opción A: Mostrar Imagen real si existe la URL
      <Image
        source={{ uri: item.photoUrl }}
        style={styles.cardImage}
      />
    ) : (
      // Opción B: Mostrar Icono de Grupo/Persona si no hay URL
      <View style={styles.cardImage}>
        <Ionicons 
          name="people" // Icono de grupo genérico
          size={30} 
          color={Colors.primary || '#007AFF'} 
        />
      </View>
    )}
    
    {/* Contenido principal del grupo */}
    <View style={styles.cardContent}>
      <Text style={styles.patientName}>{item.patientName}</Text>
      <Text style={styles.memberCount}>
        {item.membersCount} cuidadores • {item.role === 'admin' ? 'Administrador' : 'Miembro'}
      </Text>
    </View>

    {/* Botón de Opciones (solo visible para administradores) */}
    {item.role === 'admin' && (
      <TouchableOpacity 
        style={styles.optionsButton} 
        onPress={() => openGroupMenu(item)}
      >
        <Ionicons name="ellipsis-vertical" size={24} color={Colors.grey || '#999'} />
      </TouchableOpacity>
    )}
  </TouchableOpacity>
);

  return (
    <CustomSafeArea>
      <ImageBackground 
              source={require('../../assets/images/background2.jpg')} 
              resizeMode="cover"
              style={styles.backgroundImage}
      >
      <View style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsUserMenuVisible(true)} style={styles.avatarContainer}>
            <Ionicons
              name="person-circle" // Icono de usuario / persona
              size={styles.userAvatar.width || 48} // Usa el tamaño que tenías en el estilo
              color={Colors.primary || 'white'} // Usa el color que necesites
            />
            <View style={styles.badge} />
          </TouchableOpacity>

          <View> 
            <Text style={styles.greeting}>¡Hola! User Name</Text>
            
            {/* Nuevo Contenedor con Diseño Elegante */}
            <View style={styles.subGreetingContainer}>
              <Text style={styles.subGreeting}>Selecciona un grupo de cuidado  </Text>
              <Ionicons 
                name="search-outline" // Icono de lupa
                size={14} 
                color='#666' // Usamos el color principal de acento
              />
            </View>
          </View>
        </View>

        <View style={styles.sectionTitleContainer}>
          {/* Icono de Equipo */}
          
          {/* Texto del Título */}
          <Text style={styles.sectionTitle}>Tus grupos actuales son:</Text>
        </View>

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
          {/* Botón SUPERIOR (Crear nuevo grupo) usando bottom: 70 */}
          <GradientButton
            title="Crear nuevo grupo"
            onPress={() => router.replace('/create-group')}
            // Ya no necesitas style={{ marginBottom: 10 }} aquí si footer2 ya tiene el espaciado
          />
        </View>

        <View style={styles.footer2}>
          {/* Botón INFERIOR (Unirse a nuevo grupo) usando bottom: 0 */}
          <GradientButton
            title="Unirse a nuevo grupo"
            onPress={() => router.replace('/find-group' as any)}
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

        <Modal
          animationType="fade"
          transparent={true}
          visible={isInviteModalVisible}
          onRequestClose={() => setIsInviteModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.inviteModalContent}>
              <Text style={styles.inviteTitle}>Invitar Cuidador</Text>
              <Text style={styles.inviteDescription}>
                Comparte este código con la persona que quieres que se una al grupo.
              </Text>

              {isGeneratingCode ? (
                <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }} />
              ) : (
                <TouchableOpacity style={styles.codeContainer} onPress={copyToClipboard}>
                  <Text style={styles.codeText}>{invitationCode}</Text>
                  <Ionicons name="copy-outline" size={20} color={Colors.grey} style={{ marginLeft: 10 }} />
                </TouchableOpacity>
              )}

              <Text style={styles.expirationText}>
                El código expira en 48 horas.
              </Text>

              <StyledButton
                title="Cerrar"
                onPress={() => setIsInviteModalVisible(false)}
                style={{ marginTop: 20, width: '100%' }}
              />
            </View>
          </View>
        </Modal>

      </View>
      </ImageBackground>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { 
    flex: 1, 
    width: '100%' 
  },
  
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 30, gap: 15 },
  avatarContainer: {
    width: 50,           
    height: 49,          
    borderRadius: 25,    
    borderWidth: 2,      
    borderColor: Colors.white, 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'relative', 
  },
  subGreetingContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Centra el texto y el icono verticalmente
    
    backgroundColor: '#f0f0f0ca', // Fondo muy suave
    borderRadius: 15, // Bordes redondeados para la forma de cápsula
    paddingVertical: 5,   // Relleno vertical
    paddingHorizontal: 10, // Relleno horizontal
  
    borderWidth: 1,
    borderColor: '#e0e0e03c', 
    
    // Sombra sutil (solo si el fondo no es blanco puro)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2, 
  },

  sectionTitleContainer: {
    // Diseño Cápsula
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    
    // Estilos de Apariencia
    backgroundColor: '#f9d07284', // Un fondo de acento claro (ej. azul claro)
    borderRadius: 15, // Bordes redondeados
    paddingVertical: 6,
    paddingHorizontal: 12,
    
    // Espaciado dentro de la pantalla
    marginTop: 5,
    marginBottom: 15,
  },
  userAvatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: Colors.primary },
  badge: { position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: '#22c55e', borderWidth: 2, borderColor: Colors.white },
  greeting: { fontFamily: 'Poppins-Bold', fontSize: 18, fontWeight: 'bold', color: Colors.text || '#000',  },
  subGreeting: { fontFamily: 'Poppins-Bold', fontSize: 12, color: Colors.text || '#666',},
  sectionTitle: { 
    fontFamily: 'Poppins-Bold', 
    fontSize: 15, // Ligeramente más pequeño para que encaje bien en la cápsula
    color: Colors.text, // Un color oscuro para contraste
    
    // Separación del icono
    marginLeft: 8, 
    marginRight: 0, 
    // Aseguramos que no tenga márgenes innecesarios que rompan el padding del contenedor
    marginBottom: 0, 
  },
  listContainer: { gap: 15, paddingBottom: 100 },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#ffffffbe' , 
    padding: 15, 
    borderRadius: 15, // Más redondeado (ej. 15 o 20)
    
    // Sombra más pronunciada y elegante
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, // Sombra más vertical
    shadowOpacity: 0.08, // Sombra sutil
    shadowRadius: 8, 
    elevation: 4, 
  },
  cardImage: { 
    width: 55, 
    height: 55, 
    borderRadius: 28, // Hace el círculo perfecto
    backgroundColor: '#EFEFEF', // Fondo por defecto
    borderWidth: 1, 
    borderColor: '#E0E0E0',
    marginRight: 15,
    
    // Centra el Ionicons cuando se usa como fallback
    justifyContent: 'center', 
    alignItems: 'center',
  },
  
  cardContent: { 
    flex: 1, // Esto es CRUCIAL para que ocupe todo el espacio restante 
    // (empujando el botón de opciones a la derecha)
    marginLeft: 0, // Ya no necesitamos margin-left aquí si lo pusimos en cardImage
  },
  patientName: { 
    fontSize: 17, 
    fontFamily: 'Poppins-SemiBold', // Usar una variante elegante y legible
    color: '#333' 
  },
  memberCount: { 
    fontSize: 13, 
    color: Colors.textLight || '#666', 
    marginTop: 2, 
    fontFamily: 'Poppins-Regular',
  },

  optionsButton: { 
    padding: 5, // Más pequeño y limpio
    marginLeft: 10,
    // Aseguramos que esté alineado verticalmente
    alignSelf: 'center', 
  },
  
  footer1: { position: 'absolute', bottom: 0, left: 20, right: 20 },
  footer2: { position: 'absolute', bottom: 70, left: 20, right: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inviteModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inviteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.primaryDark,
    fontFamily: 'Poppins-Bold',
  },
  inviteDescription: {
    textAlign: 'center',
    color: Colors.textLight || '#666',
    marginBottom: 20,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  codeContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f648',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#573bb4ff',
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 2,
    fontFamily: 'Poppins-Bold',
  },
  expirationText: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Poppins-Regular',
  },
});