import Colors from "@/constants/Colors";
import { useMemo } from "react";
import { ExpandableCalendar, LocaleConfig } from "react-native-calendars";
import { AgendaItem } from "./DailyAgendaList";

interface CalendarSelectorProps {
  agenda: AgendaItem[];
  today: string;
  selectedDay: string;
  setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
}

LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ],
  monthNamesShort: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic"
  ],
  dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
  dayNamesShort: ["Dom", "Lun", "Mar", "Miérc", "Juev", "Vier", "Sáb"],
  today: "Hoy"
};

LocaleConfig.defaultLocale = "es";

export default function ExpandableCalendarSelector({ agenda, today, selectedDay, setSelectedDay }: CalendarSelectorProps){  
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    // 1) Mark days that have events with a dot (keep any existing decoration)
    for (const section of agenda) {
      // section.title is "YYYY-MM-DD"
      marks[section.title] = {
        ...(marks[section.title] || {}),
        marked: true,
        dots: [{ color: Colors.accent }],
      };
    }

    if (selectedDay) {
      marks[selectedDay] = {
        ...(marks[selectedDay] || {}),
        selected: true,
      };
    }

    return marks;
  }, [agenda, selectedDay]);
  
  return(
    <ExpandableCalendar
      current={today}
      firstDay={1}
      onDayPress={day => {
        setSelectedDay(day.dateString);
      }}
      markedDates={markedDates}
      hideKnob={false}
      disablePan={false}
      theme={{
        todayTextColor: Colors.accent,
        selectedDayBackgroundColor: Colors.iconFocused,
        arrowColor: Colors.primary,
        textDayFontWeight: "400",
        textMonthFontWeight: "400",
      }}
    />
  );
}