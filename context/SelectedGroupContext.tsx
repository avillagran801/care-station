import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

type SelectedGroupContextType = {
  groupId: string | null;
  setGroupId: (id: string | null) => Promise<void>;
  hydrated: boolean;
};

const SelectedGroupContext = createContext<SelectedGroupContextType | null>(null);

export function SelectedGroupProvider({ children }: { children: React.ReactNode }) {
  const [groupId, setGroupIdState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem("selected_group");
      if (saved) setGroupIdState(saved);
      setHydrated(true);
    };
    load();
  }, []);

  const setGroupId = async (id: string | null) => {
    setGroupIdState(id);
    if (id) await AsyncStorage.setItem("selected_group", id);
    else await AsyncStorage.removeItem("selected_group");
  };

  return (
    <SelectedGroupContext.Provider value={{ groupId, setGroupId, hydrated }}>
      {children}
    </SelectedGroupContext.Provider>
  );
}

export function useSelectedGroup() {
  const ctx = useContext(SelectedGroupContext);
  if (!ctx) throw new Error("useSelectedGroup must be inside provider");
  return ctx;
}
