'use client';

import React, { useState } from 'react';
import { Users, MapPin, Route, Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, Button, Select, Badge } from '../components/shared-components';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
        const [timeRange, setTimeRange] = useState('week');
      
        const stats = [
          { label: 'Tổng POI', value: '24', icon: MapPin, change: '+2', trend: 'up', color: 'text-blue-500' },
          { label: 'Lượt khách hôm nay', value: '1,284', icon: Users, change: '+12%', trend: 'up', color: 'text-emerald-500' },
          { label: 'Tour đang chạy', value: '8', icon: Route, change: '-1', trend: 'down', color: 'text-orange-500' },
          { label: 'Thời gian TB', value: '42p', icon: Clock, change: '+5p', trend: 'up', color: 'text-purple-500' },
        ];
      
        const chartData = [
          { name: 'T2', value: 400 },
          { name: 'T3', value: 300 },
          { name: 'T4', value: 600 },
          { name: 'T5', value: 800 },
          { name: 'T6', value: 500 },
          { name: 'T7', value: 900 },
          { name: 'CN', value: 1100 },
        ];
      
        const pieData = [
          { name: 'Hải sản', value: 45, color: '#10b981' },
          { name: 'Ăn vặt', value: 25, color: '#3b82f6' },
          { name: 'Bánh', value: 20, color: '#f59e0b' },
          { name: 'Nước', value: 10, color: '#8b5cf6' },
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
              {stats.map((stat, i) => (
                <Card key={i} className="relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                      <h3 className="text-2xl font-bold mt-1 text-foreground">{stat.value}</h3>
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
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground">Lượng khách truy cập</h3>
                  <Select 
                    options={[
                      { label: 'Tuần này', value: 'week' }, 
                      { label: 'Tháng này', value: 'month' }
                    ]} 
                    value={timeRange} 
                    onChange={setTimeRange}
                    className="w-32 h-8 text-xs"
                  />
                </div>
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
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
      
            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground">Hoạt động gần đây</h3>
                  <Button variant="ghost" size="sm">Xem tất cả</Button>
                </div>
                <div className="space-y-4">
                  {[
                    { action: 'Thêm POI mới', time: '10 phút trước', status: 'success' },
                    { action: 'Cập nhật danh mục', time: '1 giờ trước', status: 'success' },
                    { action: 'Xoá tour cũ', time: '3 giờ trước', status: 'warning' },
                    { action: 'Reset hệ thống', time: '5 giờ trước', status: 'info' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-sm text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <Badge variant={activity.status === 'success' ? 'success' : 'warning'}>
                        {activity.status === 'success' ? '✓' : '!'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
      
              {/* Stats Summary */}
              <Card>
                <h3 className="text-lg font-bold text-foreground mb-6">Thống kê tổng hợp</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Tổng POI', value: '24', change: '+2' },
                    { label: 'Người dùng hoạt động', value: '1,284', change: '+150' },
                    { label: 'Tour đang chạy', value: '8', change: '-1' },
                    { label: 'Tỉ lệ hoạt động', value: '92.5%', change: '+5.2%' },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                      <div className="text-right">
                        <p className="font-bold text-sm text-foreground">{stat.value}</p>
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