import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Imensiah Report',
  description: 'Your comprehensive name analysis report',
};

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf9f7] relative">
      {/* Paper texture overlay */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
