export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white w-full max-w-lg mx-auto relative overflow-hidden px-6 py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-100px] left-[-50px] w-80 h-80 bg-orange-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-50px] w-80 h-80 bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
