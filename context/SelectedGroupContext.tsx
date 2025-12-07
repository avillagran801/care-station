import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

type SelectedGroupContextType = {
  groupId: string | null;
  setGroupId: (value: string | null) => Promise<void>;
};

const SelectedGroupContext = createContext<SelectedGroupContextType | null>(null);

export function SelectedGroupProvider({ children } : { children: React.ReactNode }) {
  const [groupId, _setGroupId] = useState<string | null>(null);

  // Load previous groupId from AsyncStorage if available
  const setGroupId = async (value: string | null) => {
    _setGroupId(value);
    if (value === null) {
      await AsyncStorage.removeItem("selectedGroup");
    } else {
      await AsyncStorage.setItem("selectedGroup", value);
    }
  };

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("selectedGroup");
      if (stored) {
        _setGroupId(stored);
      }
    })();
  }, []);

  return (
    <SelectedGroupContext.Provider value={{ groupId, setGroupId }}>
      {children}
    </SelectedGroupContext.Provider>
  );
}

export function useSelectedGroup() {
  const context = useContext(SelectedGroupContext);
  if (!context) {
    throw new Error("useSelectedGroup must be used inside SelectedGroupProvider");
  }
  return context;
}