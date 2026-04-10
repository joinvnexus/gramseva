import BottomNav from '@/components/common/BottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-20 md:pb-0">
      {children}
      <BottomNav />
    </div>
  );
}

