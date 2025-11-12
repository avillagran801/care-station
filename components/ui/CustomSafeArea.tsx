import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomSafeAreaProps {
  children?: React.ReactNode;
}

export default function CustomSafeArea({children}: CustomSafeAreaProps) {
  const insets = useSafeAreaInsets();

  return(
    <SafeAreaView
      style={{
        flex: 1,
        paddingBottom: insets.bottom + 20
      }}
      edges={["top", "bottom"]}
    >
      {children}
    </SafeAreaView>
  )
}