import { useMemo } from "react";
import { View } from "react-native";
import { AgendaList } from "react-native-calendars";
import TaskCard, { TaskCardProps } from "../ui/TaskCard";

export interface AgendaItem {
  title: string;
  data: (TaskCardProps & { id: number })[];
}

interface DailyAgendaListProps {
  agenda: AgendaItem[];
  selectedDay: string;
}

export default function DailyAgendaList({ agenda, selectedDay }: DailyAgendaListProps){
  const filteredAgenda = useMemo(() => {
    const day = agenda.find(item => item.title === selectedDay);
    return day ? [day] : [];
  }, [agenda, selectedDay]);

  return(
    <AgendaList
      sections={filteredAgenda}
      renderItem={({item}) => (
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <TaskCard
            title={item.title}
            assignedTo={item.assignedTo}
            time={item.time}
            status={item.status}          
          />
        </View>
      )}
    />
  );
}