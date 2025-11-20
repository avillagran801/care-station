import DailyAgendaList, { AgendaItem } from '@/components/calendar/DailyAgendaList';
import ExpandableCalendarSelector from '@/components/calendar/ExpandableCalendarSelector';
import CustomSafeArea from '@/components/ui/CustomSafeArea';
import Colors from '@/constants/Colors';
import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CalendarProvider } from 'react-native-calendars';

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
];

export default function DailyTasksScreen() {
  const today = (new Date()).toISOString().slice(0, 10);
  const [selectedDay, setSelectedDay] = React.useState(today);

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
                agenda={agendaListTest}
                today={today}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
              />

              <View style={styles.divider} />

              <DailyAgendaList
                agenda={agendaListTest}
                selectedDay={selectedDay}
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
    fontSize: 20,
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