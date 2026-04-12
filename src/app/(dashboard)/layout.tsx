import BottomNav from '@/components/common/BottomNav';
import GlobalReadPageButton from '@/components/common/GlobalReadPageButton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-20 md:pb-0">
      {children}
      <GlobalReadPageButton />
      <BottomNav />
    </div>
  );
}

