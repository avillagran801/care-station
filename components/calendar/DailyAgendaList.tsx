import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AgendaList } from "react-native-calendars";

export interface AgendaItem {
  title: string;
  data: { id: number; title: string; time: string; status: string; assignedTo?: string }[];
}

interface DailyAgendaListProps {
  agenda: AgendaItem[];
  selectedDay: string;
  // Callback for the parent to handle the API call
  onDeleteTask: (id: number) => void;
  // We'll keep this for later when we do Editing
  onEditTask: (id: number) => void;
}

export default function DailyAgendaList({ agenda, selectedDay, onDeleteTask, onEditTask }: DailyAgendaListProps){
  const filteredAgenda = useMemo(() => {
    const day = agenda.find(item => item.title === selectedDay);
    return day ? [day] : [];
  }, [agenda, selectedDay]);

  function statusColor(status: string) {
    if (/done/i.test(status)) return styles.statusDone;
    if (/progress|in progress/i.test(status)) return styles.statusDoing;
    return styles.statusTodo;
  }

 const confirmDelete = (id: number) => {
    // 1. Debug log to prove the button was clicked
    console.log("Botón de borrar presionado para ID:", id); 

    // 2. Web Handling
    if (Platform.OS === 'web') {
      const confirmed = window.confirm("¿Estás seguro de que quieres eliminar esta tarea? Se borrará permanentemente.");
      if (confirmed) {
        onDeleteTask(id);
      }
    } 
    // 3. Mobile Handling (Android/iOS)
    else {
      Alert.alert(
        "Eliminar Tarea",
        "¿Estás seguro? Se borrará permanentemente.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Eliminar", style: "destructive", onPress: () => onDeleteTask(id) }
        ]
      );
    }
  };

  return(
    <AgendaList
      sections={filteredAgenda}
      renderItem={({item}) => (
        <View style={styles.itemWrapper}>
          <View style={styles.leftAccent} />

          {/* Main Body: Title & Time */}
          <TouchableOpacity 
            style={styles.itemBody} 
            onPress={() => onEditTask(item.id)} // Press text to Edit
            activeOpacity={0.7}
          >
            <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.itemMeta}>{item.assignedTo ? `${item.assignedTo} · ` : ''}{item.time}</Text>
          </TouchableOpacity>

          {/* Status Badge */}
          <View style={[styles.statusBadge, statusColor(item.status)]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>

          {/* NEW: Trash Button directly on the card */}
          <TouchableOpacity 
            style={styles.deleteIconButton} 
            onPress={() => confirmDelete(item.id)}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} // Easier to tap
          >
             <Ionicons name="trash-outline" size={20} color="#FF4444" />
          </TouchableOpacity>
        </View>
      )}
      contentContainerStyle={{ paddingVertical: 8 }}
    />
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12, // Changed to horizontal padding for better spacing
    marginVertical: 8,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  leftAccent: {
    width: 6,
    height: '80%',
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 12,
  },
  itemBody: {
    flex: 1, // Takes up remaining space
  },
  itemTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.primaryDark2,
    marginBottom: 4,
  },
  itemMeta: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.primaryDark2,
    opacity: 0.85,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12, // Space between badge and trash can
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: Colors.white,
  },
  statusDone: { backgroundColor: Colors.accent },
  statusDoing: { backgroundColor: Colors.primary },
  statusTodo: { backgroundColor: Colors.primaryDark2 },

  // NEW STYLE
  deleteIconButton: {
    padding: 6,
    borderRadius: 50,
    backgroundColor: '#FFE5E5', // Light red background
  }
});