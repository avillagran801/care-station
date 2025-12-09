import CustomSafeArea from '@/components/ui/CustomSafeArea';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Colors from '@/constants/Colors';
import { groupsApi, medicationApi, patientsApi } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';


export default function MedicationsScreen() {
  const router = useRouter();
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPatientId, setCurrentPatientId] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
        loadData();
    }, [])
  );

  const loadData = async () => {
    try {
        setLoading(true);
        const groupsRes = await groupsApi.getMyGroups();
        if (groupsRes.data.length > 0) {
            const groupId = groupsRes.data[0].id;
            
            const patRes = await patientsApi.getAll(); 
            
            const patient = patRes.data.find((p: any) => p.care_group_id == groupId);
            
            if (patient) {
                setCurrentPatientId(patient.patient_id);
                const medRes = await medicationApi.getAll(patient.patient_id);
                setMedications(medRes.data);
            }
        }
    }  catch (error) {
        console.error(error);
        Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudieron cargar los medicamentos.' });
    } finally {
        setLoading(false);
    }
  };

  const handleAddPress = () => {
    if (currentPatientId) {
        router.push({ pathname: '/add-medication', params: { patientId: currentPatientId } });
    } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'No se identificó al paciente.' });
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
        <View style={{ flex: 1 }}>
            <Text style={styles.medName}>{item.name}</Text>
            <Text style={styles.medDesc}>
                {item.description || 'Sin descripción'}
            </Text>
        </View>
        <TouchableOpacity 
            onPress={() => router.push({ pathname: '/edit-medication', params: { id: item.medication_id } })}
            style={styles.editButton}
        >
            <Ionicons name="create-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
    </View>
  );

  return (
    <CustomSafeArea>
      <ImageBackground 
                    source={require('../assets/images/background2.jpg')} 
                    resizeMode="cover"
                    style={styles.backgroundImage}
      >
        <ScreenHeader title="Medicamentos" />
        
        <View style={styles.container}>
          {loading ? (
              <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
          ) : (
              <FlatList
                  data={medications}
                  keyExtractor={(item) => item.medication_id.toString()}
                  renderItem={renderItem}
                  contentContainerStyle={{ paddingBottom: 100 }}
                  ListEmptyComponent={
                      <Text style={styles.emptyText}>No hay medicamentos registrados.</Text>
                  }
              />
          )}
        </View>

        <TouchableOpacity style={styles.fab} onPress={handleAddPress}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </ImageBackground>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  card: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
  },
  medName: { fontSize: 18, fontWeight: 'bold', color: Colors.text, fontFamily: 'Poppins-SemiBold' },
  medDesc: { fontSize: 14, color: Colors.grey, marginTop: 4, fontFamily: 'Poppins-Regular' },
  editButton: { padding: 5 },
  emptyText: { textAlign: 'center', color: Colors.grey, marginTop: 40, fontSize: 16 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4
  },
  container: {
      marginTop: 0, 
      padding: 30, 
      paddingBottom: 10 
  },
  row: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
  },
  
  label: { 
      color: Colors.text, 
      marginBottom: 8, 
      fontSize: 14, 
      fontWeight: '500' 
  },
  subLabel: { 
      color: Colors.grey, 
      marginBottom: 4, 
      fontSize: 12 
  },
  sectionTitle: { 
      color: Colors.text, 
      fontSize: 16, 
      fontWeight: 'bold', 
      marginTop: 10, 
      marginBottom: 5 
  },
  inputContainer: { 
      marginBottom: 15, 
      width: '100%' 
  },
  
  selectorButton: {
      backgroundColor: Colors.white,
      borderRadius: 15,
      paddingVertical: 12,
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 50,
  },
  selectorText: { fontSize: 14, color: Colors.text },
  
  dateInput: {
      backgroundColor: Colors.white,
      borderRadius: 15,
      paddingVertical: 12,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      height: 50,
  },
  webDateInputContainer: {
      backgroundColor: Colors.white,
      borderRadius: 15,
      paddingHorizontal: 10,
      justifyContent: 'center',
      height: 50,
      overflow: 'hidden',
  },
  modalOverlay: { 
      flex: 1, 
      justifyContent: 'flex-end', 
      backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalContent: { 
      backgroundColor: '#fff', 
      borderTopLeftRadius: 25, 
      borderTopRightRadius: 25, 
      padding: 25, 
      paddingBottom: 40 
  },
  modalTitle: { 
      fontSize: 18, 
      fontWeight: 'bold', 
      marginBottom: 10, 
      textAlign: 'center', 
      color: Colors.text 
  },
  modalOption: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      paddingVertical: 15, borderBottomWidth: 1, 
      borderBottomColor: '#f0f0f0' 
  },
  modalOptionText: { 
      fontSize: 16, 
      color: Colors.text 
  },
  backgroundImage: {
      flex: 1,
      width: '100%',
  },
});