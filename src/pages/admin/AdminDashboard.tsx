import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShoppingCart, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ todayOrders: 0, todayRevenue: 0 });
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const today = new Date().toISOString().split('T')[0];
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [ordersRes, productsRes, recentRes, monthlyRes] = await Promise.all([
      supabase.from('orders').select('id, total').gte('created_at', today),
      // FIX: use correct DB column names — 'stock' not 'stock_quantity', 'name_zh' is correct
      supabase.from('products').select('id, name_zh, stock, price_nzd').lt('stock', 5).eq('is_active', true),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
      // FIX: separate query for monthly trend — not limited to 10 rows
      supabase.from('orders').select('created_at, total').gte('created_at', startOfMonth.toISOString()),
    ]);

    const todayOrders = ordersRes.data ?? [];
    setStats({
      todayOrders: todayOrders.length,
      // FIX: use 'total' not 'total_nzd' — matches DB schema (orders.total)
      todayRevenue: todayOrders.reduce((sum, o) => sum + Number(o.total || 0), 0),
    });
    setLowStock(productsRes.data ?? []);
    setRecentOrders(recentRes.data ?? []);

    // FIX: build monthly trend from full-month query, grouped by day
    const allMonthOrders = monthlyRes.data ?? [];
    const monthly: Record<string, number> = {};
    allMonthOrders.forEach(o => {
      const day = new Date(o.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
      monthly[day] = (monthly[day] || 0) + Number(o.total || 0);
    });
    setMonthlyData(Object.entries(monthly).map(([name, revenue]) => ({ name, revenue })));
  };

  const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-green-100 text-green-800',
    delivered: 'bg-green-200 text-green-900',
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl">仪表盘</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-accent" />
            <div><p className="text-xs text-muted-foreground">今日订单</p><p className="text-xl font-bold">{stats.todayOrders}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-accent" />
            <div><p className="text-xs text-muted-foreground">今日销售额</p><p className="text-xl font-bold">NZ${stats.todayRevenue.toFixed(0)}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <div><p className="text-xs text-muted-foreground">库存预警</p><p className="text-xl font-bold">{lowStock.length}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-accent" />
            <div><p className="text-xs text-muted-foreground">本月订单</p><p className="text-xl font-bold">{monthlyData.length}</p></div>
          </CardContent>
        </Card>
      </div>

      {monthlyData.length > 0 && (
        <Card>
          <CardHeader><CardTitle>本月销售趋势</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v: number) => `NZ$${Number(v).toFixed(0)}`} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(43, 85%, 38%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {lowStock.length > 0 && (
        <Card className="border-destructive/50">
          <CardHeader><CardTitle className="text-destructive">库存预警</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStock.map(p => (
                <div key={p.id} className="flex justify-between items-center py-1 text-sm">
                  <span>{p.name_zh}</span>
                  <Badge variant="destructive">{p.stock} 件</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>最新订单</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>日期</TableHead>
                <TableHead>客户</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map(o => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.order_number}</TableCell>
                  <TableCell>{new Date(o.created_at).toLocaleDateString('zh-CN')}</TableCell>
                  {/* FIX: shipping_name/shipping_email match DB schema */}
                  <TableCell>{o.shipping_name || o.shipping_email}</TableCell>
                  <TableCell>NZ${Number(o.total || 0).toFixed(0)}</TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[o.status || 'pending']}>{o.status || 'pending'}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
