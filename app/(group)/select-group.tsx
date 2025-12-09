import ActionSheetModal, { ActionOption } from '@/components/ui/ActionSheetModal';
import CustomSafeArea from '@/components/ui/CustomSafeArea';
import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useSelectedGroup } from '@/context/SelectedGroupContext';
import { careGroupApi, groupsApi } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(''); 
  const [editImageUri, setEditImageUri] = useState<string | null>(null); 
  const [isSaving, setIsSaving] = useState(false);

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], 
      quality: 0.7,   
    });

    if (!result.canceled) {
      setEditImageUri(result.assets[0].uri);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedGroup) return;

    setIsSaving(true);
    try {
        const formData = new FormData();
        
        // Texto
        formData.append('patient_names', editName); 
        
        // Imagen (Solo si cambió)
        if (editImageUri && !editImageUri.startsWith('http')) {
            // Obtener nombre y extensión
            let fileName = editImageUri.split('/').pop();
            if (fileName && !fileName.includes('.')) {
                fileName += '.jpg'; // Fallback por si acaso
            }

            // Inferir tipo MIME (Crucial para Laravel/Android)
            const match = /\.(\w+)$/.exec(fileName || '');
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            // @ts-ignore
            formData.append('photo', {
                uri: editImageUri,
                name: fileName || 'photo.jpg',
                type: type, // Ej: 'image/jpeg'
            });
        }

        await careGroupApi.update(selectedGroup.id, formData);

        Toast.show({ type: 'success', text1: 'Grupo actualizado' });
        setIsEditModalVisible(false);
        loadGroups(); // Recargar para ver la nueva foto
    } catch (error: any) {
        console.error("Error update:", error);
        // Tip: Imprimir error.response.data ayuda mucho a ver qué dice el backend
        Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo actualizar el grupo' });
    } finally {
        setIsSaving(false);
    }
  };

  const handleGroupPress = (group: Group) => {
    console.log("Entrando a grupo ID:", group.id);
    setGroupId(group.id);
    router.replace('/(tabs)');
  };

  const handleDeleteGroup = (groupId: string) => {
    Toast.show({ type: 'success', text1: 'Grupo eliminado', text2: `ID: ${groupId}` });
  };

  const handleEditGroupPress = () => {
    if (selectedGroup) {
        setIsGroupMenuVisible(false); 
        setEditName(selectedGroup.patientName);
        setEditImageUri(selectedGroup.photoUrl);
        setIsEditModalVisible(true); 
    }
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
      onPress: () => handleEditGroupPress()
    },
    {
      label: 'Eliminar Grupo',
      icon: 'trash-outline',
      isDestructive: true,
      onPress: () => selectedGroup && handleDeleteGroup(selectedGroup.id)
    },
  ];

  const renderGroupItem = ({ item }: { item: Group }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => handleGroupPress(item)}>
      <Image
        style={styles.cardImage}
        source={ item.photoUrl ? { uri: item.photoUrl } : require('../../assets/images/avatar.png') }
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
            onPress={() => router.replace('/find-group' as any)}
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

        <Modal animationType="slide" transparent={true} visible={isEditModalVisible} onRequestClose={() => setIsEditModalVisible(false)}>
            <View style={styles.modalOverlay}>
                <View style={styles.editModalContent}>
                    <Text style={styles.editModalTitle}>Editar Grupo</Text>
                    
                    {/* Selector de Imagen */}
                    <TouchableOpacity onPress={pickImage} style={styles.imagePickerContainer}>
                        <Image 
                            source={ editImageUri ? { uri: editImageUri } : require('../../assets/images/avatar.png') } 
                            style={styles.editImagePreview} 
                        />
                        <View style={styles.editIconBadge}>
                            <Ionicons name="camera" size={16} color="white" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.changePhotoText}>Toca para cambiar foto</Text>

                    {/* Inputs */}
                    <StyledTextInput 
                        label="Nombre del Paciente" 
                        value={editName} 
                        onChangeText={setEditName} 
                        placeholder="Ej: Juan Pérez"
                    />

                    {/* Botones */}
                    <View style={{ gap: 10, marginTop: 20 }}>
                        {isSaving ? (
                            <ActivityIndicator color={Colors.primary} />
                        ) : (
                            <StyledButton title="Guardar Cambios" onPress={handleSaveEdit} />
                        )}
                        <StyledButton 
                            title="Cancelar" 
                            variant="secondary" 
                            onPress={() => setIsEditModalVisible(false)} 
                            style={{ backgroundColor: '#f3f4f6' }}
                        />
                    </View>
                </View>
            </View>
        </Modal>


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
    backgroundColor: '#f3f4f6',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
  editModalContent: { backgroundColor: 'white', borderRadius: 20, padding: 24, width: '100%', maxWidth: 340, elevation: 5 },
  editModalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: Colors.primaryDark, textAlign: 'center' },
  imagePickerContainer: { alignSelf: 'center', marginBottom: 10, position: 'relative' },
  editImagePreview: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#eee' },
  editIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.primary, padding: 8, borderRadius: 20, borderWidth: 2, borderColor: 'white' },
  changePhotoText: { textAlign: 'center', color: Colors.primary, marginBottom: 20, fontSize: 12 },
});