import { Text, View } from "react-native";

export default function Tab() {
  return (
    <View>
      <Text style={{
        padding: 20,
        fontSize: 20,
      }}>
        <Text>
          Juanito Pérez {'\n'}
        </Text>
        <Text>
          Celular: 9 123456
        </Text>
      </Text>
    </View>
  );
}