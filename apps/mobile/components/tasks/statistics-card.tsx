import { View, Text } from 'react-native';
import { taskStyles } from '../../styles/tasks.styles';
import { useColorScheme } from '../../hooks/use-color-scheme';

interface StatisticsCardProps {
  label: string;
  value: string | number;
  color: string;
}

export function StatisticsCard({ label, value, color }: StatisticsCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      style={[
        taskStyles.statCard,
        {
          backgroundColor: isDark ? 'rgba(30, 30, 30, 1)' : 'rgba(255, 255, 255, 1)',
          borderColor: `${color}33`,
        },
      ]}
    >
      <Text
        style={[
          taskStyles.statLabel,
          { color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' },
        ]}
      >
        {label}
      </Text>
      <Text style={[taskStyles.statValue, { color }]}>{value}</Text>
    </View>
  );
}
