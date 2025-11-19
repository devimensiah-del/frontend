'use client';

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  FileText,
  CheckCircle,
  DollarSign,
  UserPlus,
  Share2,
  AlertCircle
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'submission' | 'payment' | 'user' | 'delivery' | 'share' | 'error';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const activityConfig = {
  submission: { icon: FileText, color: 'text-[hsl(195_100%_8%)]', bgColor: 'bg-[hsl(195_100%_8%)]/10' },
  payment: { icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },
  user: { icon: UserPlus, color: 'text-[hsl(195_100%_8%)]', bgColor: 'bg-[hsl(195_100%_8%)]/10' },
  delivery: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
  share: { icon: Share2, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  error: { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma atividade recente
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const config = activityConfig[activity.type];
        const Icon = config.icon;

        return (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`p-2 rounded-full ${config.bgColor} flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(activity.timestamp), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
