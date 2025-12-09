import PatientCard from '@/components/home/PatientCard';
import CustomSafeArea from '@/components/ui/CustomSafeArea';
import Colors from '@/constants/Colors';
import { useSelectedGroup } from '@/context/SelectedGroupContext';
import { healthApi, patientsApi, tasksApi } from '@/services/api';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ImageBackground, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

// Interfaces
interface User {
  user_id: number;
  names: string;
  surnames: string;
  photo_url?: string;
}

interface Patient {
  patient_id: number;
  care_group_id: number;
  names: string;
  surnames: string;
}

interface Task {
  task_id: number;
  title: string;
  description?: string;
  due_date?: string;
  status: string;
}

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Task[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState('');

  const { groupId } = useSelectedGroup();

  const fetchDashboardData = async() => {
    if(!groupId){
      Alert.alert('Error', 'Hubo un problema al recuperar las credenciales del grupo.');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await tasksApi.listUpcomingByGroup(Number(groupId));
      setUpcomingEvents(response.data);
      console.log("Tareas del grupo recuperadas.");

      const response2 = await patientsApi.getByGroup(Number(groupId));
      setPatient(response2.data);
      console.log("Información del paciente recuperada");
    }
    catch (error: any){
      console.error('Error cargando dashboard:', error);
      Toast.show({ type: 'error', text1: 'Error de conexión', text2: 'No se pudieron cargar los datos.' });
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const checkBackendStatus = async () => {
      console.log('Intentando conectar con el backend...');
      try {
        const response = await healthApi.check();
        console.log('✅ CONEXIÓN EXITOSA:', response.data);
      } catch (error: any) {
        console.error('❌ ERROR DE CONEXIÓN:', error.message);
        if (error.response) {
          console.error('   -> Datos del error:', error.response.data);
          console.error('   -> Status del error:', error.response.status);
        }
      }
    };

    checkBackendStatus();
    fetchDashboardData();
  }, []); 

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, []);

  if (loading && !refreshing){
    return (
      <CustomSafeArea>
        <ImageBackground source={require('../../assets/images/background2.jpg')} style={styles.backgroundImage}>
          <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={Colors.primaryDark} />
          </View>
        </ImageBackground>
      </CustomSafeArea>
    )
  }

  return (
    <CustomSafeArea withTabBar>
      <ImageBackground
        source={require('../../assets/images/background2.jpg')}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
      <ScrollView 
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require('../../assets/images/avatar.png')} style={styles.userAvatar} />
            <View>
              {editing?(
                <TextInput
                  value={tempName}
                  onChangeText={setTempName}
                  onBlur={() => setEditing(false)}
                  style={styles.userNameInput}
                  autoFocus
                  returnKeyType="done"
                  />
              ):(
                <Pressable onPress={() => setEditing(true)}>
                  <Text style={styles.greeting}>¡Hola!</Text>
                  <Text style={styles.userName}>
                    {user ? `${user.names}` : 'Usuario'}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
          <Text style={{ fontSize: 24 }}>🔔</Text>
        </View>

        <PatientCard patient={patient} loading={loading} />

        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos Eventos</Text>
            <Text style={styles.sectionDate}>
              {new Date().toLocaleDateString('es-ES', {day: 'numeric', month: 'long'})}
            </Text>
        </View>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(evento => (
              <View key={evento.task_id} style={styles.eventCard}>
                  {/*emoji porque no hay icono*/}
                  <Text style={styles.cardIcon}>📅</Text>
                  <View>
                      <Text style={styles.cardTitle}>{evento.title}</Text>
                      <Text style={styles.cardTime}>{evento.due_date ? new Date(evento.due_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Todo el día'}</Text>
                  </View>
              </View>
          ))
        ) : (
          <View style={[styles.eventCard, { justifyContent: 'center', opacity: 0.8}]}>
            <Text style={{fontFamily: 'Poppins-Regular', color:Colors.text}}>
              No hay eventos próximos
            </Text>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Tareas Pendientes
          </Text>
        </View>
        
        {pendingTasks.length > 0 ? (
          pendingTasks.map(tarea => (
              <View key={tarea.task_id} style={styles.taskCard}>
                  {/*Emoji porque no hay icono*/}
                  <Text style={styles.cardIcon}>💊</Text>
                  <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{tarea.title}</Text>
                      <Text style={styles.cardSubtitle}>{tarea.description || 'Sin detalles'}</Text>
                  </View>
                  <Text style={{ fontSize: 24 }}>⋮</Text>
              </View>
          ))
        ) : (
          <View style={[styles.taskCard, { justifyContent: 'center', opacity: 0.8 }]}>
            <Text style={{fontFamily: 'Poppins-Regular', color: Colors.text}}>
              No hay tareas pendientes.
            </Text>
          </View>
        )}

        <View style={{height: 100}} />

      </ScrollView>
      </ImageBackground>
    </CustomSafeArea>
  );
}

// ...existing code...
const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: '100%',
    },
    container: { flex: 1, paddingHorizontal: 20, fontFamily: 'Poppins-Regular' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20,  fontFamily: 'Poppins-Regular'  },
    userAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
    greeting: { fontSize: 16, color: Colors.black, fontFamily: 'Poppins-SemiBold' },
    userName: { fontSize: 20, fontWeight: 'bold', color: Colors.text,  fontFamily: 'Poppins-Regular'  },
    userNameInput: {
      fontSize: 20,
      color: Colors.text,
      fontWeight: '700',
      paddingVertical: 4,
      minWidth: 140,
      fontFamily: 'Poppins-SemiBold',
    },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 10,  fontFamily: 'Poppins-Regular'  },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.primaryDark2, fontFamily: 'Poppins-Regular'  },
    sectionDate: { color: Colors.primaryDark2, fontFamily: 'Poppins-Regular', fontSize: 18 },
    eventCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.43)',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        fontFamily: 'Poppins-Regular' ,
        marginBottom: 10,
    },
    taskCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.43)',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        fontFamily: 'Poppins-Regular' 
    },
    cardIcon: { fontSize: 24, marginRight: 15 },
    cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.text,
    fontFamily: 'Poppins-SemiBold', // <- aplica Poppins semi-bold
    },
    cardTime: {
      color: Colors.text,
      marginTop: 2,
      fontFamily: 'Poppins-Regular', // <- aplica Poppins regular
      fontSize: 15,
      opacity: 0.9,
    },
    cardSubtitle: {
      color: Colors.text,
      marginTop: 4,
      fontFamily: 'Poppins-Regular', // <- aplica Poppins regular
      fontSize: 13,
      opacity: 0.9,
    },
});