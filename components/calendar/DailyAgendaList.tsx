import Colors from "@/constants/Colors";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AgendaList } from "react-native-calendars";

export interface AgendaItem {
  title: string;
  data: { id: number; title: string; time: string; status: string; assignedTo?: string }[];
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

  function statusColor(status: string) {
    if (/done/i.test(status)) return styles.statusDone;
    if (/progress|in progress/i.test(status)) return styles.statusDoing;
    return styles.statusTodo;
  }

  return(
    <AgendaList
      sections={filteredAgenda}
      renderItem={({item}) => (
        <View style={styles.itemWrapper}>
          <View style={styles.leftAccent} />

          <View style={styles.itemBody}>
            <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.itemMeta}>{item.assignedTo ? `${item.assignedTo} · ` : ''}{item.time}</Text>
          </View>

          <View style={[styles.statusBadge, statusColor(item.status)]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      )}
      // small padding so list doesn't stick to edges
      contentContainerStyle={{ paddingVertical: 8 }}
    />
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingRight: 12,
    marginVertical: 8,
    marginHorizontal: 8,
    // sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  leftAccent: {
    width: 6,
    height: '80%',
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 12,
    marginRight: 12,
  },
  itemBody: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.primaryDark2,
    marginBottom: 4,
  },
  itemMeta: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.primaryDark2,
    opacity: 0.85,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.white,
  },
  statusDone: {
    backgroundColor: Colors.accent,
  },
  statusDoing: {
    backgroundColor: Colors.primary,
  },
  statusTodo: {
    backgroundColor: Colors.primaryDark2,
  },
});