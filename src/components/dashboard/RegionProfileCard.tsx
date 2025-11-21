import React from 'react';
import Card from '../../components/Card';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts';

const COLORS = ['#4F46E5', '#06B6D4', '#F59E0B', '#EF4444', '#10B981'];

const RegionProfileCard: React.FC<{ data: any }> = ({ data }) => {
  const regions = data?.regions || [];
  const pieData = regions.map((r: any) => ({ name: r.region, value: r.count }));

  return (
    <Card className="p-0" title="Perfil por Região">
      <div className="p-4 flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={28}
                outerRadius={48}
                paddingAngle={4}
              >
                {pieData.map((_: any, idx: number) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value: any) => [value, 'Registros']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 w-full">
          <ul className="space-y-2">
            {regions.map((r: any) => (
              <li key={r.region} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span
                    className="block w-3 h-3 rounded-full"
                    style={{ background: COLORS[regions.indexOf(r) % COLORS.length] }}
                  />
                  <span className="text-gray-800">{r.region}</span>
                </div>
                <div className="text-gray-700">{r.count} • {r.percent}%</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default RegionProfileCard;
