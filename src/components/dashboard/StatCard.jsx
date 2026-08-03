import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../common/Card';

const colorMap = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
};

export default function StatCard({ title, value, icon: Icon, color = 'blue', trend, alert = false }) {
  return (
    <Card hover className={`relative overflow-hidden ${alert ? 'ring-1 ring-red-200 dark:ring-red-800' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className={`mt-1 text-2xl font-bold ${alert ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
            {value}
          </p>
          {trend !== undefined && (
            <div className={`mt-1 flex items-center gap-1 text-xs ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(trend)}% vs last month
            </div>
          )}
        </div>
        <div className={`rounded-lg p-2.5 ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
