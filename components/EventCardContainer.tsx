import { View } from "react-native";

interface EventCardContainerProps {
  children?: React.ReactNode;
}

export default function EventCardContainer({children}: EventCardContainerProps) {
  return(
    <View style={{
      flex: 1,
      flexDirection: "column",
      gap: 20,
    }}>
      {children}
    </View>
  )
}