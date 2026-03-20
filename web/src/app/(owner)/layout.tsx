import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VinhKhanh Owner Dashboard",
};

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 p-6 hidden md:block">
        <h1 className="text-xl font-bold mb-8 text-orange-500">Owner Panel</h1>
        <nav className="space-y-4 text-sm font-medium">
          <div className="text-white hover:text-orange-500 cursor-pointer transition-colors">Dashboard</div>
          <div className="text-zinc-500 hover:text-white cursor-pointer transition-colors">Manage Menu</div>
          <div className="text-zinc-500 hover:text-white cursor-pointer transition-colors">Orders</div>
          <div className="text-zinc-500 hover:text-white cursor-pointer transition-colors">Analytics</div>
          <div className="text-zinc-500 hover:text-white cursor-pointer transition-colors pt-8 font-bold">Account</div>
          <div className="text-zinc-500 hover:text-white cursor-pointer transition-colors">Settings</div>
        </nav>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 bg-black">
        <header className="h-16 border-b border-white/5 flex items-center px-8 justify-between">
           <h2 className="font-bold text-zinc-400">Restaurant <span className="text-white">Dashboard</span></h2>
           <div className="w-8 h-8 rounded-full bg-orange-500 border border-white/10 flex items-center justify-center text-[10px] font-bold">OWNER</div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
           {children}
        </div>
      </main>
    </div>
  );
}
