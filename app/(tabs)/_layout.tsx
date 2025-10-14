import { Colors } from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

type FontAwesomeName = React.ComponentProps<typeof FontAwesome>["name"];

/*
Los nombres de los íconos vienen dados por https://icons.expo.fyi/Index , usando el filtro FontAwesome. Se puede cambiar
*/

interface IndividualTab {
  fileName: string;
  title: string;
  iconName: FontAwesomeName;
}

const tabs = [
  { fileName: 'index', title: 'Inicio', iconName: 'home' },
  { fileName: 'calendar', title: 'Calendario', iconName: 'calendar' },
  { fileName: 'addTask', title: 'Agregar tarea', iconName: 'plus' },
  { fileName: 'health', title: 'Salud', iconName: 'file-text-o' },
  { fileName: 'profile', title: 'Perfil', iconName: 'user' },
] satisfies IndividualTab[];

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarShowLabel: false,
      headerShown: false,
      tabBarActiveTintColor: Colors.tabActive,
      tabBarInactiveTintColor: Colors.tabInactive,
    }}>
      {tabs.map(({ fileName, title, iconName }) => {
        if(fileName === "addTask"){

        }

        return(
          <Tabs.Screen
            key={fileName}
            name={fileName}
            options={{
              title,
              tabBarIcon: ({ color }) => (
                <FontAwesome name={iconName} color={color} size={28} />
              ),
            }}
          />
        )
      })}
    </Tabs>
  );
}