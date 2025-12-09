import DailyAgendaList, { AgendaItem } from '@/components/calendar/DailyAgendaList';
import ExpandableCalendarSelector from '@/components/calendar/ExpandableCalendarSelector';
import CustomSafeArea from '@/components/ui/CustomSafeArea';
import { TaskStatus } from '@/components/ui/TaskCard';
import Colors from '@/constants/Colors';
import { useSelectedGroup } from '@/context/SelectedGroupContext';
import { DatabaseTask } from '@/lib/databaseInterface';
import { tasksApi } from '@/services/api';
import { router } from 'expo-router';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CalendarProvider } from 'react-native-calendars';
import Toast from 'react-native-toast-message';

export default function DailyTasksScreen() {
  const today = (new Date()).toISOString().slice(0, 10);
  const [selectedDay, setSelectedDay] = React.useState(today);
  
  const [rawTasks, setRawTasks] = useState<DatabaseTask[]>([]);
  const [loading, setLoading] = useState(false);

  const { groupId, hydrated } = useSelectedGroup();

  const handleTasks = async () => {
    if(!groupId){
      Alert.alert('Error', 'Hubo un problema al recuperar las credenciales del grupo.');
      Toast.show({ type: 'error', text1: 'Error', text2: 'Hubo un problema al recuperar las credenciales del grupo.' });

      setLoading(false);
      return;  
    }

    setLoading(true);
    try {
      const response = await tasksApi.listByGroup(Number(groupId));
      setRawTasks(response.data);
      console.log("Tareas del grupo recuperadas.");
      console.log(response.data);
    }
    catch (error: any){
      console.error("Error al intentar recuperar las tareas del grupo:", error.response?.data || error.message);
      Alert.alert("Error al intentar recuperar las tareas del grupo", error.response?.data || error.message)
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(hydrated && !groupId){
      router.replace("/select-group");
    }

    if (hydrated && groupId){
      handleTasks();
    }
  }, [hydrated, groupId]);

  const transformRawDataToAgenda = (tasks: DatabaseTask[]): AgendaItem[] => {
    const grouped: { [key: string]: AgendaItem } = {};

    tasks.forEach((task) => {
      const dateKey = moment(task.begin_time).format('YYYY-MM-DD');
      const timeString = moment(task.begin_time).format('hh:mm A');

      // CHANGE LATER
      const statusLabel: TaskStatus = task.done ? 'Done' : 'To-do';

      const formattedItem = {
        id: task.task_id,
        title: task.title,
        time: timeString,
        status: statusLabel,
        assignedTo: task.assigned_to
      }

      // Create AgendaItem object grouped by the date
      if(!grouped[dateKey]) {
        grouped[dateKey] = {
          title: dateKey,
          data: []
        }
      }

      grouped[dateKey].data.push(formattedItem);
    });

    // Convert object to array and sort by date
    const results = Object.values(grouped).sort((a, b) => {
      return moment(a.title).diff(moment(b.title));
    });

    // Sort by hour inside each grouped date
    results.forEach(day => {
      day.data.sort((a, b) => 
        moment(a.time, 'hh:mm A').diff(moment(b.time, 'hh:mm A'))
      );
    });

    return Object.values(grouped);
  }

  const agendaItems = useMemo (() => {
    return transformRawDataToAgenda(rawTasks);
  }, [rawTasks]);

  const handleDeleteTask = async (taskId: number) => {
    try {
      await tasksApi.delete(taskId);
      Toast.show({ type: 'success', text1: 'Tarea eliminada' });
      handleTasks(); // Reload the list immediately
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo eliminar la tarea.");
    }
  };

  const handleEditTask = (taskId: number) => {
    // Navigate to the add-task screen, but passing the ID and mode
    router.push({
      pathname: '/(tabs)/addTask',
      params: { taskId: taskId, mode: 'edit' }
    });
  };


  if (loading){
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
        {/* ligera capa para mejorar legibilidad sobre la imagen */}
        <View style={styles.overlay} />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Tareas Diarias</Text>
            <Text style={styles.pageSubtitle}>Resumen y Actividades Programadas</Text>
          </View>

          <View style={styles.card}>
            <CalendarProvider date={today}>
              <ExpandableCalendarSelector
                agenda={agendaItems}
                today={today}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
              />

              <View style={styles.divider} />

              <DailyAgendaList
                agenda={agendaItems}
                selectedDay={selectedDay}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
              />
            </CalendarProvider>
          </View>

        </ScrollView>
      </ImageBackground>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
    fontFamily: 'Poppins-Regular',
  },
  pageHeader: {
    marginTop: 18,
    marginBottom: 12,
    alignItems: 'center',
    fontFamily: 'Poppins-Regular',
  },
  pageTitle: {
    color: Colors.white,
    fontSize: 35,
    fontFamily: 'Poppins-SemiBold',
   
    
  },
  pageSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    marginBottom: 15,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 18,
    padding: 14,
    // sombra ligera para ios/android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  divider: {
    height: 12,
  },

  /* estilos para cuando quieras personalizar items internos */
  itemTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.primaryDark2,
  },
  itemSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.primaryDark2,
    opacity: 0.9,
  },
});