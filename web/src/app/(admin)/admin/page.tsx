'use client';

import React, { useState, useEffect } from 'react';
import { Users, MapPin, Route, Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, Button, Badge } from '../components/shared-components';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { poiApi } from '@/lib/api/poi';
import { useCategoryStore, useAuditStore } from '@/store';

const getActionLabel = (action: string) => {
  const actionMap: Record<string, string> = {
    CREATE_CATEGORY: 'Tạo danh mục',
    UPDATE_CATEGORY: 'Sửa danh mục',
    DELETE_CATEGORY: 'Xóa danh mục',
    RESTORE_CATEGORY: 'Khôi phục danh mục',
    CREATE_POI: 'Tạo POI',
    UPDATE_POI: 'Sửa POI',
    DELETE_POI: 'Xóa POI',
    UPDATE_POI_STATUS: 'Đổi trạng thái POI',
    UPDATE_USER_STATUS: 'Đổi trạng thái user',
    SOFT_DELETE_USER: 'Xóa user',
  };
  return actionMap[action] || action;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { categories, fetchCategories } = useCategoryStore();
  const { logs, fetchLogs } = useAuditStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statsRes = await poiApi.getStats();
        await fetchCategories();
        await fetchLogs({ skip: 0, take: 5, force: true });
        setStats(statsRes);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = [
    { name: 'T2', value: 400 },
    { name: 'T3', value: 300 },
    { name: 'T4', value: 600 },
    { name: 'T5', value: 800 },
    { name: 'T6', value: 500 },
    { name: 'T7', value: 900 },
    { name: 'CN', value: 1100 },
  ];

  const categoryData = categories.map((cat, idx) => {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
    const translation = cat.translations?.find((t) => t.language === 'vi') || cat.translations?.[0];
    return {
      name: translation?.name || 'Unknown',
      value: cat._count?.pois || 0,
      color: colors[idx % colors.length],
    };
  }).filter(c => c.value > 0);

  const statCards = [
    { 
      label: 'Tổng POI', 
      value: stats?.pois?.total?.toString() || '0', 
      icon: MapPin, 
      change: '+2', 
      trend: 'up', 
      color: 'text-blue-500' 
    },
    { 
      label: 'Tổng người dùng', 
      value: stats?.users?.total?.toString() || '0', 
      icon: Users, 
      change: '+12%', 
      trend: 'up', 
      color: 'text-emerald-500' 
    },
    { 
      label: 'POI đang hoạt động', 
      value: stats?.pois?.active?.toString() || '0', 
      icon: Route, 
      change: '-1', 
      trend: 'down', 
      color: 'text-orange-500' 
    },
    { 
      label: 'Danh mục', 
      value: stats?.categories?.total?.toString() || '0', 
      icon: Clock, 
      change: '+5', 
      trend: 'up', 
      color: 'text-purple-500' 
    },
  ];
      
        return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
           <h1 className="text-4xl font-black tracking-tighter text-foreground">HỆ THỐNG QUẢN TRỊ</h1>
           <p className="text-muted-foreground font-medium">Điều hành toàn bộ hệ sinh thái VinhKhanh Food Tour.</p>
        </div>
        <div className="text-[10px] font-bold text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border border-border uppercase tracking-widest">
           Last Sync: Just Now
        </div>
      </div>

          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, i) => (
                <Card key={i} className="relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                      <h3 className="text-2xl font-bold mt-1 text-foreground">{loading ? '...' : stat.value}</h3>
                    </div>
                    <div className={`p-2 rounded-lg bg-muted/30 ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className={`text-xs font-bold flex items-center ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">so với tuần trước</span>
                  </div>
                </Card>
              ))}
            </div>
      
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Line Chart */}
              <Card className="lg:col-span-2">
                <h3 className="text-lg font-bold text-foreground mb-6">Lượng khách truy cập</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#f8fafc'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10b981" 
                      dot={{ fill: '#10b981', r: 5 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
      
              {/* Pie Chart */}
              <Card>
                <h3 className="text-lg font-bold text-foreground mb-6">Phân loại danh mục</h3>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Chưa có dữ liệu danh mục
                  </div>
                )}
              </Card>
            </div>
      
            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-bold text-foreground mb-6">Hoạt động gần đây</h3>
                <div className="space-y-4">
                  {logs && logs.length > 0 ? (
                    logs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            {log.admin?.fullName || 'Admin'} {getActionLabel(log.action)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.createdAt).toLocaleString('vi-VN')}
                          </p>
                        </div>
                        <Badge variant="success">✓</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">Chưa có hoạt động</p>
                  )}
                </div>
              </Card>
      
              {/* Stats Summary */}
              <Card>
                <h3 className="text-lg font-bold text-foreground mb-6">Thống kê tổng hợp</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Tổng POI', value: stats?.pois?.total?.toString() || '0', change: '+2' },
                    { label: 'Người dùng hoạt động', value: stats?.users?.total?.toString() || '0', change: '+150' },
                    { label: 'POI đang hoạt động', value: stats?.pois?.active?.toString() || '0', change: '-1' },
                    { label: 'Danh mục', value: stats?.categories?.total?.toString() || '0', change: '+5' },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                      <div className="text-right">
                        <p className="font-bold text-sm text-foreground">{loading ? '...' : stat.value}</p>
                        <p className="text-xs text-primary">{stat.change}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
      
    </div>
  );
};
export default AdminDashboard;