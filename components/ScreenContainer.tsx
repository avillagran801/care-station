import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenContainerProps {
  children?: React.ReactNode;
}

export default function ScreenContainer({children}: ScreenContainerProps) {
  return(
    <SafeAreaView style={{
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 20,
    }}>
      {children}
    </SafeAreaView>
  )
}