import StyledButton from '@/components/ui/StyledButton';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React, { ComponentProps, useState } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
 


// ------------------------------------------------------------------
// 🎨 PALETA DE COLORES Y TIPADO
// ------------------------------------------------------------------
const CUSTOM_COLORS = {
  Primary: Colors.light.tint || '#007AFF', // Azul primario
  Secondary: '#4CAF50', // Verde de confirmación/salud
  BackgroundLight: 'rgba(255, 255, 255, 0.95)', 
  TextPrimary: '#1F2937', 
  TextSecondary: '#9CA3AF', 
  BorderSubtle: '#D1D5DB', 
  Shadow: 'rgba(0, 0, 0, 0.15)',
  // Colores para el encabezado customizado
  HeaderBackground: '#a8d4c376', 
  HeaderTitle: '#1F2937',
  HeaderIcon: '#1F2937',
};

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

// ------------------------------------------------------------------
// 🧩 COMPONENTE PLACEHOLDER (Simulación del Campo)
// ------------------------------------------------------------------

const PlaceholderInput = ({ 
    label, 
    placeholder, 
    iconName, 
    isMultiline = false 
}: {
    label: string;
    placeholder: string;
    iconName: IoniconsName;
    isMultiline?: boolean;
}) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={[styles.inputContainer, isMultiline && styles.textAreaContainer]}>
      <Text style={[styles.inputValue, isMultiline && styles.textAreaValue]}>
        {placeholder}
      </Text>
      <Ionicons 
        name={iconName} 
        size={22} 
        color={CUSTOM_COLORS.Primary} 
        style={styles.inputIcon}
      />
    </View>
  </View>
);


// ------------------------------------------------------------------
// 🖥️ PANTALLA PRINCIPAL
// ------------------------------------------------------------------

export default function EditMedicalTestScreen() {
  const router = useRouter();
  const [name, setName] = useState(''); 
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [url, setUrl] = useState('');
  
  const create_medical_test = () => {
    console.log('Intento de guardar con placeholders');
    router.back();  
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={require('../assets/images/background2.jpg')} 
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        
        {/* 💡 REEMPLAZO DEL HEADER POR UN CONTAINER VIEW ESTILIZADO */}
        <View style={styles.customHeaderContainer}>
            <Ionicons 
                name="chevron-back-outline" 
                size={28} 
                color={CUSTOM_COLORS.HeaderIcon} 
                onPress={() => router.back()}
            />
            <Text style={styles.customHeaderTitle}>Crear Examen Médico</Text>
            {/* Espaciador para centrar el título (opcional, dependiendo del diseño) */}
            <View style={{ width: 28 }} /> 
        </View>

        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false} 
        >
          
          <View style={styles.formContainer}>
          
            <View style={styles.inputGroup}>
              
              <PlaceholderInput 
                label="Nombre del examen médico" 
                placeholder="Ejemplo: Chequeo general de sangre" 
                iconName="document-text-outline" 
              />

              <PlaceholderInput 
                label="Descripción" 
                placeholder="Lugar, motivo o detalles relevantes." 
                iconName="clipboard-outline" 
                isMultiline={true}
              />

              <PlaceholderInput 
                label="Fecha de emisión" 
                placeholder="DD/MM/AAAA" 
                iconName="calendar-outline" 
              />

              <PlaceholderInput 
                label="URL del Documento/Resultados" 
                placeholder="https://www.URLdelDocumento.com" 
                iconName="link-outline" 
              />
            </View>
            
            <StyledButton 
              title="Guardar Examen Médico" 
              onPress={create_medical_test} 
              style={{ 
                ...styles.button,
                backgroundColor: CUSTOM_COLORS.Secondary 
              }}
            />
            
          </View>
        </ScrollView>
        
      </ImageBackground>
    </SafeAreaView>
  );
}

// ------------------------------------------------------------------
// 🎨 ESTILOS (Asegurando la elegancia y los colores definidos)
// ------------------------------------------------------------------

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F3F4F6' 
  },
  backgroundImage: { 
    flex: 1, 
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
  },
  
  // 💡 NUEVOS ESTILOS PARA EL ENCABEZADO CUSTOMIZADO
  customHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: CUSTOM_COLORS.HeaderBackground, // Fondo blanco/semitransparente
    // 💡 Sombra sutil para separar del contenido
    borderBottomWidth: 1,
    borderBottomColor: CUSTOM_COLORS.BorderSubtle, 
  },
  customHeaderTitle: {
    fontSize: 18,
    color: CUSTOM_COLORS.HeaderTitle,
    fontWeight: '700', // Poppins Bold/Semibold
    letterSpacing: 0.5,
    flex: 1, // Permite que ocupe el espacio central
    textAlign: 'center',
  },
  
  scrollContent: {
    padding: 25,
  },
  
  formContainer: {
    backgroundColor: CUSTOM_COLORS.BackgroundLight, 
    borderRadius: 20, 
    padding: 25, 
    shadowColor: CUSTOM_COLORS.Shadow,
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 12,
    gap: 30,
  },

  inputGroup: {
    gap: 20,
  },

  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 15,
    color: CUSTOM_COLORS.TextPrimary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: CUSTOM_COLORS.BorderSubtle,
    justifyContent: 'space-between',
    minHeight: 55,
  },
  inputValue: {
    flex: 1,
    fontSize: 16,
    color: CUSTOM_COLORS.TextSecondary,
    fontWeight: '400',
  },
  inputIcon: {
    marginLeft: 12,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    minHeight: 140,
    paddingVertical: 18,
  },
  textAreaValue: {
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  
  button: {
    marginTop: 5,
  }
});