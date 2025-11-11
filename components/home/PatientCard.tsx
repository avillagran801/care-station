import Colors from '@/constants/Colors';
import { Image, StyleSheet, Text, View } from 'react-native';
import StyledButton from '../ui/StyledButton';

{/* Aqui simulamos traer los datos del paciente :P */}

export default function PatientCard() {
    return (
        <View style={styles.card}>
            <Image source={{ uri: 'https://i.pravatar.cc/100?u=ana' }} style={styles.avatar} />
            <View style={styles.info}>
                <Text style={styles.name}>Matías Medina</Text>
                <Text style={styles.age}>82 Años</Text>
            </View>
            <View style={styles.progressContainer}>
                {/* Esto simula el círculo de progreso */}
                <View style={styles.progressCircle}>
                    <Text style={styles.progressText}>85%</Text>
                </View>
                <StyledButton title="View Task" onPress={() => {}} style={{ paddingVertical: 8, marginTop: 5, backgroundColor: Colors.accent }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.primary,
        borderRadius: 25,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    avatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 3, borderColor: Colors.white },
    info: { marginLeft: 15, flex: 1 },
    name: { color: Colors.white, fontSize: 20, fontWeight: 'bold' },
    age: { color: Colors.white, fontSize: 14 },
    progressContainer: { alignItems: 'center' },
    progressCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 4,
        borderColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressText: { color: Colors.white, fontWeight: 'bold' },
});