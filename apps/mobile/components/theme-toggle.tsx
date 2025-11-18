import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/theme-context';
import { Colors } from '@/constants/theme';

export function ThemeToggle() {
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();

  const options = [
    {
      mode: 'light' as const,
      label: 'Light',
      icon: 'sunny-outline' as const,
    },
    {
      mode: 'dark' as const,
      label: 'Dark',
      icon: 'moon-outline' as const,
    },
    {
      mode: 'auto' as const,
      label: 'Auto',
      icon: 'phone-portrait-outline' as const,
    },
  ];

  const activeColor = resolvedTheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: activeColor.text }]}>
        Theme
      </Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isActive = themeMode === option.mode;
          return (
            <Pressable
              key={option.mode}
              style={[
                styles.option,
                {
                  backgroundColor: isActive
                    ? activeColor.tint
                    : resolvedTheme === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                },
              ]}
              onPress={() => setThemeMode(option.mode)}
            >
              <Ionicons
                name={option.icon}
                size={20}
                color={
                  isActive
                    ? '#fff'
                    : activeColor.icon
                }
              />
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isActive ? '#fff' : activeColor.text,
                  },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
