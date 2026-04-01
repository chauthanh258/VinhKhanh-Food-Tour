'use client';

import { useState } from 'react';
import { Users, Activity, Plus, Clock, Route, Eye, Search, Play } from 'lucide-react';
import { Card, Button, Input, Badge, Dialog, cn } from '../../components/shared-components';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Types
interface UserSession {
  session_id: string;
  device_id: string;
  user_id: string;
  language: string;
  start_time: string;
  end_time: string | null;
  current_poi: string;
  current_poi_duration: string;
  journey: Array<{
    poi: string;
    time: string;
    action: string;
    audio_played?: boolean;
  }>;
}

// Mock data
const initialSessions: UserSession[] = [
  {
    session_id: 'session_001',
    device_id: 'IPHONE_12345',
    user_id: 'user_001',
    language: 'vi',
    start_time: '2024-01-20 08:30:00',
    end_time: null,
    current_poi: 'Chùa Một Cột',
    current_poi_duration: '5 phút',
    journey: [
      { poi: 'Hồ Hoàn Kiếm', time: '08:30', action: 'Vào khu vực', audio_played: true },
      { poi: 'Chùa Một Cột', time: '09:15', action: 'Di chuyển tới', audio_played: true },
      { poi: 'Chùa Một Cột', time: '09:32', action: 'Đang ở', audio_played: false },
    ]
  },
  {
    session_id: 'session_002',
    device_id: 'ANDROID_67890',
    user_id: 'user_002',
    language: 'en',
    start_time: '2024-01-20 09:00:00',
    end_time: null,
    current_poi: 'Hồ Hoàn Kiếm',
    current_poi_duration: '12 phút',
    journey: [
      { poi: 'Hồ Hoàn Kiếm', time: '09:00', action: 'Vào khu vực', audio_played: true },
    ]
  },
  {
    session_id: 'session_003',
    device_id: 'IPAD_11111',
    user_id: 'user_003',
    language: 'vi',
    start_time: '2024-01-19 14:20:00',
    end_time: '2024-01-19 16:45:00',
    current_poi: 'Bảo tàng Lịch sử',
    current_poi_duration: '30 phút',
    journey: [
      { poi: 'Trung tâm thành phố', time: '14:20', action: 'Bắt đầu tour', audio_played: true },
      { poi: 'Bảo tàng Lịch sử', time: '14:50', action: 'Di chuyển tới', audio_played: true },
      { poi: 'Bảo tàng Lịch sử', time: '15:20', action: 'Đang tham quan', audio_played: false },
    ]
  },
];

const hourlyData = [
  { hour: '08:00', users: 12 },
  { hour: '10:00', users: 25 },
  { hour: '12:00', users: 45 },
  { hour: '14:00', users: 38 },
  { hour: '16:00', users: 52 },
  { hour: '18:00', users: 65 },
  { hour: '20:00', users: 48 },
  { hour: '22:00', users: 20 },
];

const UserManager = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);
  const [isJourneyOpen, setIsJourneyOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeSessions = initialSessions.filter(s => s.end_time === null);
  const historySessions = initialSessions.filter(s => s.end_time !== null).filter(s => s.device_id.toLowerCase().includes(searchQuery.toLowerCase()));

  const stats = [
    { label: 'Tổng người dùng hôm nay', value: '128', icon: Users, color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Đang hoạt động', value: activeSessions.length.toString(), icon: Activity, color: 'bg-emerald-500/10 text-emerald-500' },
    { label: 'Người dùng mới (24h)', value: '42', icon: Plus, color: 'bg-orange-500/10 text-orange-500' },
    { label: 'Thời gian tour trung bình', value: '45p', icon: Clock, color: 'bg-purple-500/10 text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý Người dùng</h2>
      </div>

      <div className="flex gap-2 border-b border-border -mx-6 px-6">
        {['active', 'stats', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab === 'active' ? 'Đang hoạt động' : tab === 'stats' ? 'Thống kê' : 'Lịch sử Tour'}
          </button>
        ))}
      </div>

      {activeTab === 'active' && (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Device ID</th>
                <th className="px-6 py-4">Ngôn ngữ</th>
                <th className="px-6 py-4">Bắt đầu</th>
                <th className="px-6 py-4">POI hiện tại</th>
                <th className="px-6 py-4">Thời gian ở POI</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activeSessions.map(session => (
                <tr key={session.session_id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-primary">{session.device_id}</td>
                  <td className="px-6 py-4 uppercase font-bold text-xs">{session.language}</td>
                  <td className="px-6 py-4 text-muted-foreground">{session.start_time.split(' ')[1]}</td>
                  <td className="px-6 py-4">
                    <Badge variant="success">{session.current_poi}</Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{session.current_poi_duration}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => { setSelectedSession(session); setIsJourneyOpen(true); }}>
                      <Route size={14} className="mr-2" /> Xem lộ trình
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Card key={i} className="flex items-center gap-4">
                <div className={cn("p-3 rounded-lg", stat.color)}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <h3 className="text-lg font-semibold mb-6">Lượng người dùng theo giờ</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#10b981' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Bar dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Tìm kiếm theo Device ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary text-muted-foreground uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Device ID</th>
                  <th className="px-6 py-4">Ngôn ngữ</th>
                  <th className="px-6 py-4">Bắt đầu</th>
                  <th className="px-6 py-4">Kết thúc</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {historySessions.map(session => (
                  <tr key={session.session_id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-primary">{session.device_id}</td>
                    <td className="px-6 py-4 uppercase font-bold text-xs">{session.language}</td>
                    <td className="px-6 py-4 text-muted-foreground">{session.start_time}</td>
                    <td className="px-6 py-4 text-muted-foreground">{session.end_time}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => { setSelectedSession(session); setIsJourneyOpen(true); }}>
                        <Eye size={14} className="mr-2" /> Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      <Dialog
        isOpen={isJourneyOpen}
        onClose={() => setIsJourneyOpen(false)}
        title={`Lộ trình di chuyển: ${selectedSession?.device_id}`}
      >
        <div className="space-y-6">
          <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {selectedSession?.journey.map((step, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-secondary border-2 border-primary flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm">{step.poi}</h4>
                    <span className="text-xs font-mono text-muted-foreground">{step.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{step.action}</p>
                  {step.audio_played && (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-medium mt-1">
                      <Play size={10} /> Đã phát Audio
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full" onClick={() => setIsJourneyOpen(false)}>Đóng</Button>
        </div>
      </Dialog>
    </div>
  );
};
export default UserManager;