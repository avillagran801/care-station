import Colors from '@/constants/Colors';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import StyledButton from '../ui/StyledButton';

interface PatientProps {
    patient: {
        patient_id: number;
        names: string;
        surnames?: string;
        care_group_id?: number;
        photo_url?: string;
    } | null;
    loading?: boolean;
}

export default function PatientCard({ patient, loading}: PatientProps) {

    if (loading) {
        return (
            <View style={[styles.card, { justifyContent: 'center' }]}>
                <ActivityIndicator color={Colors.white} />
            </View>
        )
    }

    if (!patient) {
        return (
            <View style={styles.card}>
                <Text style={{color: Colors.white, fontFamily: 'Poppins-Regular'}}>
                    No hay paciente seleccionado.
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.card}>
            <Image 
                source={
                    patient.photo_url
                    ? { uri: patient.photo_url }
                    : require('../../assets/images/avatar.png')
                }
                style={styles.avatar}
            />

            <View style={styles.info}>
                <Text style={styles.name}>{patient.names}</Text>
                <Text style={styles.surname}>{patient.surnames || ''}</Text>
                <Text style={styles.subtext}>Paciente Activo</Text>
                {/*Añadiremos edad?*/}
                {/*<Text style={styles.age}>82 Años</Text>*/}
            </View>
            <View style={styles.progressContainer}>
                {/* Esto simula el círculo de progreso */}
                <View style={styles.progressCircle}>
                    <Text style={styles.progressText}>85%</Text>
                </View>
                <StyledButton title="Ver tareas" onPress={() => {}} style={{ paddingVertical: 8, marginTop: 5, backgroundColor: Colors.primaryDark }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.primary3,
        borderRadius: 25,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        minHeight: 130,
    },
    avatar: { width: 90, height: 90, borderRadius: 35, borderWidth: 3, borderColor: Colors.white },
    info: { marginLeft: 15, flex: 1 },
    name: { color: Colors.white, fontSize: 25, fontWeight: 'bold',fontFamily: 'Poppins-Regular', },
    surname: { color: Colors.white, fontSize: 18, fontFamily: 'Poppins-Regular', lineHeight: 20 },
    subtext: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontFamily: 'Poppins-Regular', marginTop: 4 },
    age: { color: Colors.white, fontSize: 18, fontFamily: 'Poppins-Regular' },
    progressContainer: { alignItems: 'center' },
    progressCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 4,
        borderColor: Colors.primaryDark,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins-Regular',
        marginBottom: 5,
    },
    progressText: { color: Colors.white, fontWeight: 'bold', },
});