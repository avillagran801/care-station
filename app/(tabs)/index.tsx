import EventCard from "@/components/EventCard";
import EventCardContainer from "@/components/EventCardContainer";
import ScreenContainer from "@/components/ScreenContainer";
import { Text, View } from "react-native";

const tasks = [
  {
    title: "Este es un título de prueba",
    subtitle: "10:00 am - 11:00 am",
    iconName: "pill"
  },
  {
    title: "Omg, este es otro título de prueba",
    subtitle: "12:00 pm - 13:00 pm"
  }
]

export default function Tab() {
  return (
    <ScreenContainer>
      <View style={{
        flex: 1,
        flexDirection: "column",
        gap: 20,
      }}>
        <View>
          <Text style={{
            fontSize: 20,
            fontWeight: "bold"
          }}>
            Próximos eventos
          </Text>
        </View>
        <EventCardContainer>
          {tasks && tasks.map((task) => (
            <EventCard
              title={task.title}
              subtitle={task.subtitle}
              iconName={task.iconName}
            />
          ))}
        </EventCardContainer>
      </View>
    </ScreenContainer>
  );
}