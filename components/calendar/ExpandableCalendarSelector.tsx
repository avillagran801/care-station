// ...existing code...
import Colors from "@/constants/Colors";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

// Componente día personalizado (ahora dibuja también los "dots")
function CalendarDay({ date, marking, onPress }: any) {
  // marking puede ser true/false u objeto; normalizamos
  const marks = marking && typeof marking === "object" ? marking : {};
  const isSelected = !!marks.selected || !!marks.selectedColor;
  const dots: any[] = Array.isArray(marks.dots) ? marks.dots : (marks.marked ? [{ color: Colors.accent }] : []);

  return (
    <TouchableOpacity
      onPress={() => onPress?.({ dateString: date?.dateString })}
      activeOpacity={0.7}
      style={[
        styles.dayWrapper,
        isSelected && { backgroundColor: marks?.selectedColor ?? Colors.primaryDark2 },
      ]}
    >
      <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
        {date?.day}
      </Text>

      {/* puntos que indican actividades */}
      <View style={styles.dotsContainer}>
        {dots.slice(0, 3).map((d, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: (d && d.color) ? d.color : Colors.accent }
            ]}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
}

export default function ExpandableCalendarSelector({ agenda, today, selectedDay, setSelectedDay }: CalendarSelectorProps){  
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    // 1) Mark days that have events with a dot (keep any existing decoration)
    for (const section of agenda) {
      // section.title is "YYYY-MM-DD"
      marks[section.title] = {
        ...(marks[section.title] || {}),
        marked: true,
        dots: [{ color: Colors.primaryDark2}],
      };
    }

    if (selectedDay) {
      marks[selectedDay] = {
        ...(marks[selectedDay] || {}),
        selected: true,
        selectedColor: Colors.primary
      };
    }

    return marks;
  }, [agenda, selectedDay]);
  
  return(
     <View style={styles.card}>
      <ExpandableCalendar
        current={today}
        firstDay={1}
        onDayPress={day => {
          setSelectedDay(day.dateString);
        }}
        markedDates={markedDates}
        hideKnob={false}
        disablePan={false}
        // se añade dayComponent para usar el CalendarDay personalizado
        dayComponent={CalendarDay}
        theme={{
          // fondo y colores generales
          calendarBackground: "transparent",
          dayTextColor: Colors.primaryDark2,
          monthTextColor: Colors.primaryDark2,
          textSectionTitleColor: Colors.primary,
          textSectionTitleDisabledColor: Colors.primary,
          // selección / hoy (estos siguen vigentes para otras partes)
          selectedDayBackgroundColor: Colors.primaryDark2,
          selectedDayTextColor: Colors.white,
          todayTextColor: Colors.accent,
          // flechas / indicadores
          arrowColor: Colors.primary,
          indicatorColor: Colors.primary,
          // tipografía (asegúrate de haber cargado Poppins en el layout)
          textDayFontFamily: "Poppins-Regular",
          textMonthFontFamily: "Poppins-SemiBold",
          textDayHeaderFontFamily: "Poppins-Medium",
          // tamaños (estos aplican cuando no usas dayComponent)
          textDayFontSize: 18,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 16,
          // dots
          dotColor: Colors.accent,
          selectedDotColor: Colors.white,
          // pesos
          textDayFontWeight: "400",
          textMonthFontWeight: "600",
        }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 14,
    padding: 8,
    marginVertical: 8,
    // sombra iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    // sombra Android
    elevation: 6,
  },

  // estilos para el día personalizado: aumenta el tamaño del círculo aquí
  dayWrapper: {
    width: 44,              // aumentar para círculo más grande
    height: 50,             // algo más de espacio para los dots
    borderRadius: 22,       // mitad de width/height para que sea círculo (ajusta si cambias height)
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 6,
  },
  dayText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.primaryDark2,
  },
  dayTextSelected: {
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },

  // container para los puntos debajo del número
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
    height: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
});