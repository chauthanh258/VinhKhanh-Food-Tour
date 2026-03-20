import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VinhKhanh System Admin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar - Admin Purple Theme */}
      <aside className="w-64 border-r border-white/5 p-6 hidden md:block">
        <h1 className="text-xl font-bold mb-8 text-purple-500 tracking-tighter uppercase">Admin Core</h1>
        <nav className="space-y-4 text-xs font-bold uppercase tracking-widest">
          <div className="text-white hover:text-purple-500 cursor-pointer transition-colors bg-purple-500/10 px-4 py-3 rounded-xl border border-purple-500/20">Overview</div>
          <div className="text-zinc-500 hover:text-white cursor-pointer transition-colors px-4 py-3">POIs Management</div>
          <div className="text-zinc-500 hover:text-white cursor-pointer transition-colors px-4 py-3">User Control</div>
          <div className="text-zinc-500 hover:text-white cursor-pointer transition-colors px-4 py-3">Audit Logs</div>
          <div className="text-zinc-500 hover:text-white cursor-pointer transition-colors px-4 py-3 pt-12 font-bold">Settings</div>
        </nav>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 bg-black">
        <header className="h-16 border-b border-white/5 flex items-center px-8 justify-between">
           <h2 className="font-bold text-zinc-500">System <span className="text-white">Administration</span></h2>
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/10 uppercase">System Online</span>
              <div className="w-8 h-8 rounded-full bg-purple-600 border border-white/10 flex items-center justify-center text-[10px] font-bold shadow-xl">SU</div>
           </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
           {children}
        </div>
      </main>
    </div>
  );
}
