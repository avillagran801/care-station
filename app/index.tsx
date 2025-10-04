import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem"
      }}
    >
      <Text style={{fontSize: 30, fontWeight: "bold"}}>MI PRIMERA APLICACIÓN MÓVIL</Text>
      <Text>HOLA ESTA ES MI APLICACIÓN MÓVIL LOS QUIERO MUCHO</Text>
      <Text style={{fontSize: 24, fontWeight: "bold"}}>NOELIA</Text>
      <Text>ESTOY HACIENDO MI APLICACIÓN MÓVIL QUÉ EMOCIÓN</Text>
      <Text style={{fontSize: 18, fontWeight: "bold"}}>BUENO Y AHORA QUÉ HAGO</Text>
      <Text style={{fontSize: 18, fontWeight: "bold"}}>SÍ</Text>
      <Text>© Todos los derechos reservados 2025</Text>
    </View>
  );
}
