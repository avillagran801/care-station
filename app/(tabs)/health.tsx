import CustomSafeArea from "@/components/ui/CustomSafeArea";
import { Text, View } from "react-native";

export default function Tab() {
  return (
    <CustomSafeArea withTabBar>
      <View>
        <Text>No sé qué más poner</Text>
      </View>
    </CustomSafeArea>
  );
}