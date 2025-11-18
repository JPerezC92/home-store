'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, Eye, TrendingUp } from 'lucide-react';

export function Transactions() {
  const stats = [
    {
      label: 'TOTAL TRANSACTIONS',
      value: '3,339',
      icon: TrendingUp,
      color: 'primary',
      subtext: '',
    },
    {
      label: 'TOTAL RECEIVED',
      value: '$/ 22,124.08',
      color: 'success',
      subtext: '3160 payments',
    },
    {
      label: 'TOTAL PAID',
      value: '$/ 16,075.26',
      color: 'warning',
      subtext: '179 payments',
    },
  ];

  const transactions = [
    { id: 0, type: 'PAGASTE', from: 'PHILIP JUNIOR PEREZ CASTRO', to: 'Pagaste el servicio de Castro Montalvo, Lilia', amount: '-$/ 51.30', date: 'Aug 13, 2025, 11:03 AM', message: 'Backus - Cliente Cervecero', typeColor: 'warning', isIncome: false },
    { id: 1, type: 'TE PAGÓ', from: 'Nora M. Soto A.', to: 'Philip J. Perez C.', amount: '+$/ 4.50', date: 'Aug 13, 2025, 06:29 AM', typeColor: 'success', isIncome: true },
    { id: 2, type: 'TE PAGÓ', from: 'Ysabella M. Del-rio R.', to: 'Philip J. Perez C.', amount: '+$/ 2.00', date: 'Aug 13, 2025, 06:50 AM', typeColor: 'success', isIncome: true },
    { id: 3, type: 'TE PAGÓ', from: 'Lilibeth P. Avila G.', to: 'Philip J. Perez C.', amount: '+$/ 2.00', date: 'Aug 13, 2025, 06:56 AM', typeColor: 'success', isIncome: true },
    { id: 4, type: 'TE PAGÓ', from: 'Sonia Silva E.', to: 'Philip J. Perez C.', amount: '+$/ 13.00', date: 'Aug 13, 2025, 07:14 AM', typeColor: 'success', isIncome: true },
    { id: 5, type: 'TE PAGÓ', from: 'Leonidas Becerra S.', to: 'Philip J. Perez C.', amount: '+$/ 7.00', date: 'Aug 13, 2025, 09:19 AM', typeColor: 'success', isIncome: true },
    { id: 6, type: 'TE PAGÓ', from: 'Adan A. Ferrer C.', to: 'Philip J. Perez C.', amount: '+$/ 10.00', date: 'Aug 13, 2025, 09:36 AM', typeColor: 'success', isIncome: true },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      primary: { bg: 'bg-primary/5', text: 'text-primary', border: 'border-primary/20' },
      success: { bg: 'bg-success/5', text: 'text-success', border: 'border-success/20' },
      warning: { bg: 'bg-warning/5', text: 'text-warning', border: 'border-warning/20' },
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="p-8 space-y-8 bg-background">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-5xl font-bold text-foreground">Transactions</h1>
        <p className="text-base text-muted-foreground">Upload and manage your Yape transaction reports</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const colors = getColorClasses(stat.color);
          return (
            <Card key={stat.label} className={`${colors.bg} border ${colors.border} hover:shadow-lg transition-all duration-300 group cursor-pointer h-full`}>
              <div className="p-6 space-y-3 flex flex-col h-full justify-between">
                <div>
                  {stat.icon && (
                    <div className={`${colors.text} w-10 h-10 rounded-lg bg-background flex items-center justify-center group-hover:scale-110 transition-transform mb-4`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                  )}
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
                <div>
                  <p className={`text-3xl font-bold ${colors.text}`}>
                    {stat.value}
                  </p>
                  {stat.subtext && <p className="text-xs text-muted-foreground mt-2">{stat.subtext}</p>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Current Balance */}
      <Card className="border-success/20 bg-linear-to-br from-success/8 to-success/4 hover:shadow-md transition-shadow">
        <div className="p-8">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">CURRENT BALANCE</p>
          <p className="text-5xl font-bold text-success mb-3">$/ 6,048.82</p>
          <p className="text-sm text-muted-foreground">Received - Paid = Balance</p>
        </div>
      </Card>

      {/* Upload Section */}
      <Card className="hover:shadow-md transition-all duration-300">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Upload Excel File</h2>
          <div className="border-2 border-dashed border-primary/30 rounded-xl p-12 text-center hover:bg-primary/5 hover:border-primary/50 transition-all duration-200 cursor-pointer">
            <div className="inline-block mb-4 text-5xl">📊</div>
            <p className="font-semibold text-foreground mb-2 text-lg">Drag & drop your Excel file here</p>
            <p className="text-muted-foreground text-sm mb-4">or click to browse</p>
            <p className="text-xs text-muted-foreground">Accepts .xlsx files only</p>
          </div>
        </div>
      </Card>

      {/* Transaction History */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">Transaction History</h2>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all">
            <Eye className="w-4 h-4" />
            Show Filters
          </Button>
        </div>

        <div className="space-y-3">
          {transactions.map((tx) => (
            <Card key={tx.id} className={`border-${tx.typeColor}/20 bg-${tx.typeColor}/5 hover:bg-${tx.typeColor}/8 hover:shadow-md transition-all duration-200`}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.isIncome ? 'bg-success/10' : 'bg-warning/10'}`}>
                        {tx.isIncome ? (
                          <ArrowUpRight className={`w-5 h-5 ${tx.isIncome ? 'text-success' : 'text-warning'}`} />
                        ) : (
                          <ArrowDownLeft className={`w-5 h-5 text-warning`} />
                        )}
                      </div>
                      <Badge className={`bg-${tx.typeColor}/10 text-${tx.typeColor} border border-${tx.typeColor}/20`}>
                        {tx.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{tx.date}</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-muted-foreground">
                        From: <span className="font-semibold text-foreground">{tx.from}</span>
                      </p>
                      <p className="text-muted-foreground">
                        To: <span className="font-semibold text-foreground">{tx.to}</span>
                      </p>
                      {tx.message && (
                        <p className="text-muted-foreground italic">
                          Message: <span className="text-foreground">{tx.message}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-lg font-bold whitespace-nowrap ${tx.isIncome ? 'text-success' : 'text-warning'}`}>{tx.amount}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
