import CustomSafeArea from '@/components/ui/CustomSafeArea';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import Colors from '@/constants/Colors';
import { useSelectedGroup } from '@/context/SelectedGroupContext';
import { groupsApi, tasksApi } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { createElement, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const categories = ['Sin categoría','Salud', 'Higiene', 'Alimentación', 'Ejercicio', 'Trámites', 'Ocio'];
const frequencyOptions = [
  {
    text: 'No se repite',
    value: 0
  },
  {
    text: 'Todos los dias',
    value: 1
  },
  {
    text: 'Todas las semanas',
    value: 2
  },
  {
    text: 'Todos los meses',
    value: 3
  }
];

function addDays(d: Date, days: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

function addWeeks(d: Date, weeks: number) {
  return addDays(d, weeks * 7);
}

function addMonths(d: Date, months: number) {
  const r = new Date(d);
  const desiredMonth = r.getMonth() + months;
  r.setMonth(desiredMonth);
  return r;
}

const adjustEndDateForFrequency = (baseStart: Date, freqValue: number, currentEnd?: Date) => {
  if (freqValue === 0) {
    return currentEnd ?? new Date(baseStart);
  }

  let minEnd: Date;
  if (freqValue === 1) minEnd = addDays(baseStart, 1);
  else if (freqValue === 2) minEnd = addWeeks(baseStart, 1);
  else if (freqValue === 3) minEnd = addMonths(baseStart, 1);
  else minEnd = new Date(baseStart);

  if (!currentEnd || currentEnd < minEnd) return minEnd;
  return currentEnd;
};

// Los inputs HTML necesitan strings formato "YYYY-MM-DD" y "HH:MM"
const formatDateForWeb = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatTimeForWeb = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

const PlatformDatePicker = ({ 
  value, 
  onChange, 
  mode = 'date', 
}: { 
  value: Date; 
  onChange: (event: any, date?: Date) => void; 
  mode?: 'date' | 'time'; 
}) => {
  const [showMobilePicker, setShowMobilePicker] = useState(false);

  const handleMobileChange = (event: any, selectedDate?: Date) => {
    setShowMobilePicker(false);
    if (selectedDate) onChange(event, selectedDate);
  };

  const handleWebChange = (e: any) => {
    const stringVal = e.target.value; 
    if(!stringVal) return;

    const newDate = new Date(value); 

    if (mode === 'date') {
        // stringVal viene como "2025-11-20"
        const [y, m, d] = stringVal.split('-').map(Number);
        newDate.setFullYear(y);
        newDate.setMonth(m - 1); // Meses en rango 0-11
        newDate.setDate(d);
    } else {
        // stringVal viene como "14:30"
        const [h, m] = stringVal.split(':').map(Number);
        newDate.setHours(h);
        newDate.setMinutes(m);
    }
    onChange(e, newDate);
  };

  //La libreria datetimepicker no funciona en web, por lo que tendremos que usar otra libreria o bien usar esta solución
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webDateInputContainer}>
        {createElement('input', {
            type: mode === 'time' ? 'time' : 'date',
            value: mode === 'date' ? formatDateForWeb(value) : formatTimeForWeb(value),
            onChange: handleWebChange,
            style: {
                border: 'none',
                background: 'transparent',
                width: '100%',
                height: '100%',
                fontSize: 16,
                color: Colors.text,
                fontFamily: 'Poppins-Regular',
                outline: 'none' 
            }
        })}
      </View>
    );
  }

  return (
    <View>
      <TouchableOpacity 
        style={styles.dateInput} 
        onPress={() => setShowMobilePicker(true)}
      >
        <Ionicons 
          name={mode === 'time' ? "time-outline" : "calendar-outline"} 
          size={20} 
          color={Colors.primary} 
        />
        <Text style={{ marginLeft: 10, color: Colors.text }}>
          {mode === 'date' 
            ? value.toLocaleDateString() 
            : value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        </Text>
      </TouchableOpacity>

      {showMobilePicker && (
        <DateTimePicker
          value={value}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={handleMobileChange}
        />
      )}
    </View>
  );
};

interface GroupMember {
  user_id: string;
  names: string;
  surnames: string;
}

export default function AddTaskScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const { groupId, hydrated } = useSelectedGroup();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);

  const [assignedTo, setAssignedTo] = useState<GroupMember | undefined>(undefined);
  const [category, setCategory] = useState(categories[0]);
  const [frequency, setfrequency] = useState(frequencyOptions[0]);

  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date()); 
  const [endTime, setEndTime] = useState(new Date(new Date().setHours(new Date().getHours() + 1))); 
  const [endDate, setEndDate] = useState(new Date());

  const [activeModal, setActiveModal] = useState<'none' | 'assign' | 'category' | 'frequency'>('none');

  const handleGroupMembers = async () => {
    if(!groupId){
      Toast.show({ type: 'error', text1: 'Error', text2: 'Hubo un problema al recuperar las credenciales del grupo.' });

      setLoading(false);
      return;  
    }

    setLoading(true);
    try {
      const response = await groupsApi.getMembers(Number(groupId));
      setGroupMembers(response.data);
      console.log("Miembros del grupo recuperados");
    }
    catch (error: any){
      console.error("Error al intentar recuperar los miembros del grupo:", error.response?.data || error.message);
      Alert.alert("Error al intentar recuperar los miembros del grupo", error.response?.data || error.message)
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
      handleGroupMembers();
    }
  }, [hydrated, groupId]);

  useEffect(() => {
    if(!hydrated){
      return;
    }
    const newEnd = adjustEndDateForFrequency(startDate, frequency.value, endDate);
    if(newEnd.getTime() !== endDate.getTime()){
      setEndDate(newEnd);
    }
  }, [frequency, startDate, hydrated]);

  const handleCreateTask = async () => {
    if(!groupId){
      Toast.show({ type: 'error', text1: 'Error', text2: 'Hubo un problema al recuperar las credenciales del grupo.' });
      return;
    }

    if (!title.trim()) {
        Toast.show({ type: 'error', text1: 'Falta información', text2: 'Debes escribir un título para la tarea.' });
        return;
    }

    const finalStart = new Date(startDate);
    finalStart.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

    const finalEnd = new Date(startDate);
    finalEnd.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

    if (finalEnd < finalStart) {
        Toast.show({ type: 'info', text1: 'Cuidado', text2: 'La fecha de término es anterior al inicio.' });
        return;
    }

    const loopEndDateISO = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      0, 0, 0, 0
    ).toISOString(); // e.g. "2025-12-15T00:00:00.000Z"

    const payload = {
      care_group_id: Number(groupId),
      title,
      description,
      assigned_to: assignedTo?.user_id ?? null,
      category,
      frequency: frequency.value.toString(),
      begin_time: finalStart.toISOString(),
      end_time: finalEnd.toISOString(),
      loop_end_date: loopEndDateISO
    };

    console.log("Payload: ", payload);

    try {
      const response = await tasksApi.create(payload);
      console.log("Response: ", response.data);

      console.log("Tarea creada exitosamente");
      Toast.show({ type: 'success', text1: 'Tarea creada', text2: 'Se ha agendado correctamente.' });
      router.replace('/(tabs)/calendar');
    }
    catch (error: any){
      Toast.show({ type: 'error', text1: 'Error al intentar crear la tarea', text2: error.response?.data || error.message });
      console.error("Error al intentar crear la tarea:", error.response?.data || error.message);
    }
  };

  const renderSelector = (label: string, value: string, icon: keyof typeof Ionicons.glyphMap, onPress: () => void) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity style={styles.selectorButton} onPress={onPress}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name={icon} size={20} color={Colors.primary} />
                <Text style={styles.selectorText}>{value}</Text>
            </View>
            <Ionicons name="chevron-down" size={20} color={Colors.grey} />
        </TouchableOpacity>
    </View>
  );

  if (loading || !hydrated){
    return (
      <CustomSafeArea>
        <ImageBackground source={require('../assets/images/background2.jpg')} style={styles.backgroundImage}>
          <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={Colors.primaryDark} />
          </View>
        </ImageBackground>
      </CustomSafeArea>
    )
  }

  return (
    <CustomSafeArea>
        <ScreenHeader title="Nueva Tarea" />
        
        <ScrollView contentContainerStyle={styles.container}>
          
          <StyledTextInput 
              label="Tarea" 
              placeholder="Ej: Tomar pastilla..." 
              value={title}
              onChangeText={setTitle}
          />

          <StyledTextInput 
              label="Descripción" 
              placeholder="Detalles adicionales..." 
              value={description}
              onChangeText={setDescription}
              multiline
          />

        <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
                {renderSelector("Asignado a",
                  assignedTo? `${assignedTo.names.split(' ')[0]} ${assignedTo.surnames.split(' ')[0]}` : "Sin asignar", 
                  "person-outline", () => setActiveModal('assign'))}
            </View>
            <View style={{ flex: 1 }}>
                {renderSelector("Categoría", category, "pricetag-outline", () => setActiveModal('category'))}
            </View>
        </View>

        <Text style={styles.sectionTitle}>Fecha y rango horario</Text>
        <View style={styles.row}>
            <View style={{ flex: 1.5, marginRight: 10 }}>
                <Text style={styles.subLabel}>Fecha</Text>
                <PlatformDatePicker value={startDate} mode="date" onChange={(e, d) => d && setStartDate(d)} />
            </View>
            <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.subLabel}>Hora de inicio</Text>
                <PlatformDatePicker value={startTime} mode="time" onChange={(e, d) => d && setStartTime(d)} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.subLabel}>Hora de término</Text>
                <PlatformDatePicker value={endTime} mode="time" onChange={(e, d) => d && setEndTime(d)} />
            </View>
        </View>

        <View style={{ marginTop: 10 }}>
            {renderSelector("Frecuencia", frequency.text, "repeat-outline", () => setActiveModal('frequency'))}
        </View>

        {frequency.value !== 0 &&
        (<>
          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Repetir hasta</Text>
          <View style={styles.row}>
              <View style={{ flex: 1.5, marginRight: 10 }}>
                  <PlatformDatePicker value={endDate} mode="date" onChange={(e, d) => d && setEndDate(d)} />
              </View>
          </View>
        </>)}

        <View style={{ marginTop: 10 }}>
            <StyledButton title="Agregar tarea" onPress={handleCreateTask} />
        </View>

        </ScrollView>

      {/* MODALES */}
      <Modal animationType="fade" transparent={true} visible={activeModal !== 'none'} onRequestClose={() => setActiveModal('none')}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setActiveModal('none')}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
                {activeModal === 'assign' ? 'Seleccionar Responsable' : activeModal === 'category' ? 'Seleccionar Categoría' : 'Frecuencia'}
            </Text>
            
            <ScrollView style={{ maxHeight: 300 }}>
              {activeModal === 'assign' && (
                <>
                  {/* Opción: Sin asignar */}
                  <TouchableOpacity 
                      style={styles.modalOption} 
                      onPress={() => { setAssignedTo(undefined); setActiveModal('none'); }}
                  >
                      <Text style={styles.modalOptionText}>Sin asignar</Text>
                      {!assignedTo && <Ionicons name="checkmark" size={20} color={Colors.primary} />}
                  </TouchableOpacity>

                  {/* Miembros */}
                  {groupMembers.map((m) => (
                      <TouchableOpacity 
                          key={m.user_id} 
                          style={styles.modalOption} 
                          onPress={() => { setAssignedTo(m); setActiveModal('none'); }}
                      >
                          <Text style={styles.modalOptionText}>{m.names} {m.surnames}</Text>
                          {assignedTo?.user_id === m.user_id && (
                              <Ionicons name="checkmark" size={20} color={Colors.primary} />
                          )}
                      </TouchableOpacity>
                  ))}
                </>
              )}

                {activeModal === 'category' && categories.map((c, i) => (
                    <TouchableOpacity key={i} style={styles.modalOption} onPress={() => { setCategory(c); setActiveModal('none'); }}>
                        <Text style={styles.modalOptionText}>{c}</Text>
                        {category === c && <Ionicons name="checkmark" size={20} color={Colors.primary} />}
                    </TouchableOpacity>
                ))}
                {activeModal === 'frequency' && frequencyOptions.map((r) => (
                    <TouchableOpacity key={r.value} style={styles.modalOption} onPress={() => { setfrequency(r); setActiveModal('none'); }}>
                        <Text style={styles.modalOptionText}>{r.text}</Text>
                        {frequency === r && <Ionicons name="checkmark" size={20} color={Colors.primary} />}
                    </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
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