import React, { createContext, useContext, useState } from 'react';

interface EditContextType {
  selectedItem: any;
  setSelectedItem: (item: any) => void;
}

const EditContext = createContext<EditContextType | undefined>(undefined);

export function EditProvider({ children }: { children: React.ReactNode }) {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <EditContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </EditContext.Provider>
  );
}

export function useEditItem() {
  const context = useContext(EditContext);
  if (!context) {
    throw new Error('useEditItem must be used within EditProvider');
  }
  return context;
}
