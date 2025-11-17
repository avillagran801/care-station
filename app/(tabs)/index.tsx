import PatientCard from '@/components/home/PatientCard';
import CustomSafeArea from '@/components/ui/CustomSafeArea';
import Colors from '@/constants/Colors';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const eventos = [
  { id: '1', title: 'Cita con el Dr. Carmelo Breach', time: '10:00 AM - 11:00 AM', icon: '👜' },
  { id: '2', title: 'Fisioterapia', time: '2:00 PM - 3:00 PM', icon: '👤' },
];

const tareas = [
  { id: '1', title: 'Administrar Medicamentos', subtitle: 'Todos los dias 5:00 PM', icon: '💊' },
  { id: '2', title: 'Preparar la comida', subtitle: 'Todos los dias 12:00 PM', icon: '👤' },
  { id: '3', title: 'Comprar Medicamentos', subtitle: '2 Tareas asociadas', icon: '📖' },
];

export default function HomeScreen() {
  return (
    <CustomSafeArea withTabBar>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require('../../assets/images/avatar.png')} style={styles.userAvatar} />
            <View>
              <Text style={styles.greeting}>¡Hola!</Text>
              <Text style={styles.userName}>Ana Banana</Text>
            </View>
          </View>
          <Text style={{ fontSize: 24 }}>🔔</Text>
        </View>

        <PatientCard />

        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos Eventos</Text>
            <Text style={styles.sectionDate}>14 Octubre 2025</Text>
        </View>
        {eventos.map(evento => (
            <View key={evento.id} style={styles.eventCard}>
                <Text style={styles.cardIcon}>{evento.icon}</Text>
                <View>
                    <Text style={styles.cardTitle}>{evento.title}</Text>
                    <Text style={styles.cardTime}>{evento.time}</Text>
                </View>
            </View>
        ))}

        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tareas Pendientes</Text>
        </View>
        {tareas.map(tarea => (
            <View key={tarea.id} style={styles.taskCard}>
                <Text style={styles.cardIcon}>{tarea.icon}</Text>
                <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{tarea.title}</Text>
                    <Text style={styles.cardTime}>{tarea.subtitle}</Text>
                </View>
                <Text style={{ fontSize: 24 }}>⋮</Text>
            </View>
        ))}

      </ScrollView>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
    userAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
    greeting: { fontSize: 16, color: Colors.textLight },
    userName: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 10 },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.text },
    sectionDate: { color: Colors.textLight },
    eventCard: {
        backgroundColor: Colors.secondary,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    taskCard: {
        backgroundColor: Colors.secondary,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardIcon: { fontSize: 24, marginRight: 15 },
    cardTitle: { fontSize: 16, fontWeight: '500', color: Colors.text },
    cardTime: { color: Colors.text, marginTop: 2 },
});
