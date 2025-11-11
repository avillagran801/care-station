import ScreenHeader from '@/components/ui/ScreenHeader';
import type { TaskCardProps } from '@/components/ui/TaskCard';
import TaskCard from '@/components/ui/TaskCard';
import Colors from '@/constants/Colors';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const mockTasks: (TaskCardProps & { id: number })[] = [
  { id: 1, title: 'Compra de Ibuprofeno 200ml', time: '10:00 AM', status: 'Done', assignedTo: 'Ana' },
  { id: 2, title: 'Ejercicios de movilidad', time: '12:00 PM', status: 'In Progress', assignedTo: 'Bastian' },
  { id: 3, title: 'Administración de medicamentos', time: '07:00 PM', status: 'To-do', assignedTo: 'Cano' },
  { id: 4, title: 'Cita con el Dr. Breach', time: '09:00 PM', status: 'To-do', assignedTo: 'Fran' },
];

export default function DailyTasksScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Tareas Diarias" showBackButton={false} />
      
      <View style={styles.filtersContainer}>
        <Text style={{ color: Colors.text }}>[Acá deberían ir los componetens/selector de la fecha]</Text>
        <Text style={{ color: Colors.text }}>[Acá deberían ir los componentes/selector de la fecha ]</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {mockTasks.map(({ id, ...taskProps }) => (
          <TaskCard key={id} {...taskProps} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  filtersContainer: { padding: 20, gap: 15 },
  listContainer: { paddingHorizontal: 20, gap: 15, paddingBottom: 120 },
});