import DailyAgendaList, { AgendaItem } from '@/components/calendar/DailyAgendaList';
import ExpandableCalendarSelector from '@/components/calendar/ExpandableCalendarSelector';
import CustomSafeArea from '@/components/ui/CustomSafeArea';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { TaskStatus } from '@/components/ui/TaskCard';
import { DatabaseTask } from '@/lib/databaseInterface';
import apiClient from '@/services/api';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import { CalendarProvider } from 'react-native-calendars';
/*import { SafeAreaView } from 'react-native-safe-area-context';*/


export default function DailyTasksScreen() {
  const today = moment().format('YYYY-MM-DD');
  const [selectedDay, setSelectedDay] = React.useState(today);
  
  const [rawTasks, setRawTasks] = useState<DatabaseTask[]>([]);
  const [loading, setLoading] = useState(false);

  // CHANGE LATER
  const care_group_id = 1;

  const handleTasks = async () => {
    if(!care_group_id){
      Alert.alert('Error', 'Hubo un problema al recuperar las credenciales del grupo.');
      return;  
    }

    setLoading(true);
    try {
      // CHANGE LATER
      const response = await apiClient.post("/readTasks", { care_group_id: care_group_id });
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
    handleTasks();
  }, []);

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
  
  return (
    <CustomSafeArea withTabBar>
      <ScreenHeader title="Tareas Diarias" showBackButton={false} />

      <View style={{ flex: 1 }}>
        <CalendarProvider date={today}>
          <ExpandableCalendarSelector
            agenda={agendaItems}
            today={today}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
          <DailyAgendaList
            agenda={agendaItems}
            selectedDay={selectedDay}
          />
        </CalendarProvider>
      </View>
    
    </CustomSafeArea>
  );
}

/*
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  // filtersContainer: { padding: 20, gap: 15 },
  // listContainer: { paddingHorizontal: 20, gap: 15, paddingBottom: 120 },
});
*/