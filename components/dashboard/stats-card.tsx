'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/design';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  urgent?: boolean;
}

export function StatsCard({ title, value, icon: Icon, trend, urgent }: StatsCardProps) {
  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${urgent ? 'border-red-300 bg-red-50' : ''}`}>
      <CardContent className="pt-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-3xl font-bold ${urgent ? 'text-red-600' : 'text-gray-900'}`}>
              {value}
            </p>
            {trend && (
              <p className={`text-xs ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {trend} vs. período anterior
              </p>
            )}
          </div>
          <div className={`p-4 rounded-full ${urgent ? 'bg-red-200' : 'bg-[hsl(195_100%_8%)]/10'}`}>
            <Icon className={`w-6 h-6 ${urgent ? 'text-red-600' : 'text-[hsl(195_100%_8%)]'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
