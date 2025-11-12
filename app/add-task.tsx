import CustomSafeArea from '@/components/ui/CustomSafeArea';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StyledButton from '@/components/ui/StyledButton';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const repetitionOptions = ['No se repite', 'Todos los dias', 'Todas las semanas', 'Todos los meses', 'Todos los años'];

export default function AddTaskScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [repetition, setRepetition] = useState(repetitionOptions[0]);

  const handleSelectRepetition = (option: string) => {
    setRepetition(option);
    setModalVisible(false);
  };

  return (
    <CustomSafeArea>
      <ScreenHeader title="Agregar tarea" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.placeholderText}>[Formulario para Tarea, Asignado, Categoría, Descripción...]</Text>
        <Text style={styles.placeholderText}>[Formulario para Fecha y Hora de Inicio/Término]</Text>

        <TouchableOpacity style={styles.repetitionButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="refresh-outline" size={24} color={Colors.text} />
          <Text style={styles.repetitionText}>{repetition}</Text>
        </TouchableOpacity>

        <StyledButton title="Add Project" onPress={() => {}} style={{ marginTop: 'auto' }} />
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            {repetitionOptions.map((option, index) => (
              <TouchableOpacity key={index} style={styles.modalOption} onPress={() => handleSelectRepetition(option)}>
                <View style={styles.radioButtonOuter}>
                  {repetition === option && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </CustomSafeArea>
  );
}


const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  placeholderText: { color: Colors.text, marginVertical: 20, textAlign: 'center' },
  repetitionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, marginVertical: 20 },
  repetitionText: { marginLeft: 10, fontSize: 16, color: Colors.text },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: Colors.primaryLight, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 30, paddingBottom: 50 },
  modalOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  modalOptionText: { fontSize: 18, marginLeft: 15, color: Colors.text },
  radioButtonOuter: { height: 24, width: 24, borderRadius: 12, borderWidth: 2, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  radioButtonInner: { height: 12, width: 12, borderRadius: 6, backgroundColor: Colors.primary },
});