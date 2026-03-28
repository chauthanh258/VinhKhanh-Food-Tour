// 'use client';

// import { Navigation, Accessibility, Info } from 'lucide-react';

// interface BottomNavProps {
//   activeView: 'map' | 'list' | 'info';
//   onViewChange: (view: 'map' | 'list' | 'info') => void;
// }

// export default function BottomNav({ activeView, onViewChange }: BottomNavProps) {
//   return (
//     <nav className="p-4 bg-zinc-950 border-t border-white/5 flex items-center justify-around z-50">
//       <button 
//         onClick={() => onViewChange('map')}
//         className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'map' ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
//       >
//         <Navigation className="w-5 h-5" />
//         <span className="text-[10px] font-bold uppercase tracking-wider">Bản đồ</span>
//       </button>
      
//       <button 
//         onClick={() => onViewChange('list')}
//         className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'list' ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
//       >
//         <Accessibility className="w-5 h-5" />
//         <span className="text-[10px] font-bold uppercase tracking-wider">Danh sách</span>
//       </button>
      
//       <button 
//         onClick={() => onViewChange('info')}
//         className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'info' ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
//       >
//         <Info className="w-5 h-5" />
//         <span className="text-[10px] font-bold uppercase tracking-wider">Trợ giúp</span>
//       </button>
//     </nav>
//   );
// }
