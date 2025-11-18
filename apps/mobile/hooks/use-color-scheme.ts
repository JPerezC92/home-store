import { useTheme } from '@/contexts/theme-context';

export function useColorScheme() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme;
}
