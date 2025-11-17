import DailyAgendaList, { AgendaItem } from '@/components/calendar/DailyAgendaList';
import ExpandableCalendarSelector from '@/components/calendar/ExpandableCalendarSelector';
import CustomSafeArea from '@/components/ui/CustomSafeArea';
import ScreenHeader from '@/components/ui/ScreenHeader';
import moment from 'moment';
import React from 'react';
import { View } from 'react-native';
import { CalendarProvider } from 'react-native-calendars';
/*import { SafeAreaView } from 'react-native-safe-area-context';*/

const agendaListTest: AgendaItem[] = [
  {
    title: "2025-11-11",
    data: [
      { id: 1, title: 'Compra de Ibuprofeno 200ml', time: '10:00 AM', status: 'Done', assignedTo: 'Ana' },
      { id: 2, title: 'Ejercicios de movilidad', time: '12:00 PM', status: 'In Progress', assignedTo: 'Bastian' },
      { id: 3, title: 'Preparar sopa', time: '07:00 PM', status: 'To-do', assignedTo: 'Jorge' },
    ]
  },
  {
    title: "2025-11-12",
    data: [
      { id: 4, title: 'Administración de medicamentos', time: '07:00 PM', status: 'To-do', assignedTo: 'Cano' },
      { id: 5, title: 'Cita con el Dr. Breach', time: '09:00 PM', status: 'To-do', assignedTo: 'Fran' },
    ]
  }
]

export default function DailyTasksScreen() {
  const today = moment().format('YYYY-MM-DD');
  const [selectedDay, setSelectedDay] = React.useState(today);
  
  return (
    <CustomSafeArea withTabBar>
      <ScreenHeader title="Tareas Diarias" showBackButton={false} />

      <View style={{ flex: 1 }}>
        <CalendarProvider date={today}>
          <ExpandableCalendarSelector
            agenda={agendaListTest}
            today={today}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
          <DailyAgendaList
            agenda={agendaListTest}
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