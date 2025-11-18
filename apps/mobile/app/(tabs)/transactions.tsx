import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggle } from '@/components/theme-toggle';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, JPCColors } from '@/constants/theme';
import {
  getTransactions,
  getStatistics,
  type Transaction,
  type Statistics,
} from '@/services/transactions-api.service';

export default function TransactionsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const data = await getStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  // Fetch transactions
  const fetchTransactions = async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNum > 1) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const data = await getTransactions({
        page: pageNum,
        limit: 20,
        ...(search && { search }),
      });

      if (isRefresh || pageNum === 1) {
        setTransactions(data);
      } else {
        setTransactions(prev => [...prev, ...data]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchStatistics();
    fetchTransactions();
  }, []);

  // Search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchTransactions(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Handle refresh
  const handleRefresh = () => {
    setPage(1);
    fetchStatistics();
    fetchTransactions(1, true);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!loadingMore && transactions.length >= page * 20) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTransactions(nextPage);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `S/ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Render transaction item
  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isReceived = item.transactionType.toUpperCase() === 'TE PAGÓ';

    return (
      <View
        style={[
          styles.transactionCard,
          {
            backgroundColor: theme.cardBackground,
            borderColor: isReceived ? JPCColors.emerald[500] : JPCColors.orange[400],
            borderLeftWidth: 4,
          },
        ]}
      >
        <View style={styles.transactionHeader}>
          <Text
            style={[
              styles.transactionType,
              { color: isReceived ? JPCColors.emerald[500] : JPCColors.orange[400] },
            ]}
          >
            {isReceived ? '↓' : '↑'} {item.transactionType}
          </Text>
          <Text style={[styles.transactionAmount, { color: isReceived ? JPCColors.emerald[500] : JPCColors.orange[400] }]}>
            {formatCurrency(item.amount)}
          </Text>
        </View>

        <View style={styles.transactionDetails}>
          <Text style={[styles.detailLabel, { color: theme.text }]}>From: {item.origin}</Text>
          <Text style={[styles.detailLabel, { color: theme.text }]}>To: {item.destination}</Text>
          {item.message && (
            <Text style={[styles.detailMessage, { color: theme.textSecondary }]}>
              "{item.message}"
            </Text>
          )}
          <Text style={[styles.detailDate, { color: theme.textSecondary }]}>
            {formatDate(item.operationDate)}
          </Text>
        </View>
      </View>
    );
  };

  // Render statistics header
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={[styles.title, { color: theme.text }]}>Transactions</Text>

      {/* Statistics Cards */}
      {statistics && (
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total</Text>
            <Text style={[styles.statValue, { color: theme.tint }]}>
              {statistics.totalTransactions}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Received</Text>
            <Text style={[styles.statValue, { color: JPCColors.emerald[500] }]}>
              {formatCurrency(statistics.totalReceivedAmount)}
            </Text>
            <Text style={[styles.statCount, { color: theme.textSecondary }]}>
              {statistics.totalReceived} payments
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Paid</Text>
            <Text style={[styles.statValue, { color: JPCColors.orange[400] }]}>
              {formatCurrency(statistics.totalPaidAmount)}
            </Text>
            <Text style={[styles.statCount, { color: theme.textSecondary }]}>
              {statistics.totalPaid} payments
            </Text>
          </View>

          <View style={[styles.statCardFull, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Balance</Text>
            <Text
              style={[
                styles.statValueLarge,
                { color: statistics.balance >= 0 ? JPCColors.emerald[500] : '#ef4444' },
              ]}
            >
              {formatCurrency(statistics.balance)}
            </Text>
          </View>
        </View>
      )}

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.cardBackground, color: theme.text }]}
          placeholder="Search transactions..."
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>
    </View>
  );

  // Render footer loading
  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={theme.tint} />
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.tint} />
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading transactions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {search ? 'No transactions found' : 'No transactions yet'}
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.tint}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  headerContainer: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardFull: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statValueLarge: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statCount: {
    fontSize: 12,
    marginTop: 4,
  },
  searchContainer: {
    marginBottom: 8,
  },
  searchInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionType: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  transactionDetails: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailMessage: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
  detailDate: {
    fontSize: 12,
    marginTop: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  loadingFooter: {
    padding: 20,
    alignItems: 'center',
  },
});
