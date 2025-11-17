import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomSafeAreaProps {
  children?: React.ReactNode;
  withTabBar?: boolean;
}

const TAB_BAR_HEIGHT = 40; 
const CONTENT_SPACING = 20;

export default function CustomSafeArea({ children, withTabBar = false }: CustomSafeAreaProps) {
  const insets = useSafeAreaInsets();

  const getPaddingBottom = () => {
    if (withTabBar) {
      return insets.bottom + TAB_BAR_HEIGHT + CONTENT_SPACING;
    }
    return insets.bottom + CONTENT_SPACING;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingBottom: getPaddingBottom(),
      }}
      edges={['top']}
    >
      {children}
    </SafeAreaView>
  );
}