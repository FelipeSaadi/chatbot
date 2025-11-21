import React from 'react';
import Card from '../../components/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';

function formatDuration(ms: number) {
  // Portuguese localization with pluralization
  if (!ms && ms !== 0) return 'N/A';
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  const plural = (n: number, singular: string, pluralForm: string) => (n === 1 ? `${n} ${singular}` : `${n} ${pluralForm}`);

  if (ms < hour) {
    const mins = Math.round(ms / minute);
    return plural(mins, 'minuto', 'minutos');
  }
  if (ms < day) {
    const hrsRaw = ms / hour;
    const hrs = Math.round(hrsRaw * 10) / 10; // one decimal
    return hrs === 1 ? '1 hora' : `${hrs} horas`;
  }
  if (ms < month) {
    const days = Math.round(ms / day);
    return plural(days, 'dia', 'dias');
  }
  if (ms < year) {
    const monthsRaw = ms / month;
    const months = Math.round(monthsRaw * 10) / 10;
    return months === 1 ? '1 mês' : `${months} meses`;
  }
  const yrsRaw = ms / year;
  const yrs = Math.round(yrsRaw * 10) / 10;
  return yrs === 1 ? '1 ano' : `${yrs} anos`;
}

const ResponseTimeCard: React.FC<{ data: any }> = ({ data }) => {
  // Build chart data by combining fastest and slowest services and deduping by service name
  const list: any[] = [];
  (data?.fastestServices || []).forEach((s: any) => list.push({ service: s.service, avgMs: s.avgMs }));
  (data?.slowestServices || []).forEach((s: any) => list.push({ service: s.service, avgMs: s.avgMs }));

  // dedupe by service (keep avgMs from first found), then sort by avgMs desc
  const map = new Map<string, number>();
  list.forEach((i) => {
    if (!map.has(i.service)) map.set(i.service, i.avgMs);
  });
  const chartData = Array.from(map.entries()).map(([service, avgMs]) => ({ service, avgMs })).sort((a, b) => b.avgMs - a.avgMs);

  // dynamic height similar to service ranking so labels fit; cap at 800px
  const rowHeight = 40;
  const padding = 20;
  const height = Math.min(Math.max(200, chartData.length * rowHeight + padding), 800);

  return (
    <Card className="p-0" title="Tempos de Resposta">
      <div className="p-4">
        <div className="text-sm text-black">Média geral: {data?.overall ? formatDuration(data.overall.avgResponseMs) : 'N/A'}</div>

        <div className="mt-3">
          <div className="font-medium text-black">Distribuição (ms médios por serviço)</div>
          <div className="mt-2">
            {chartData.length > 0 ? (
              <div style={{ width: '100%', height }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={chartData}>
                    {/* X axis: show days instead of ms */}
                    <XAxis
                      type="number"
                      tick={{ fill: '#000' }}
                      tickFormatter={(v) => {
                        const days = Math.round(Number(v) / (1000 * 60 * 60 * 24));
                        return `${days}d`;
                      }}
                    />
                    <YAxis dataKey="service" type="category" width={220} tick={{ fill: '#000', fontSize: 14 }} interval={0} />
                    <RechartsTooltip
                      formatter={(value: any) => [formatDuration(Number(value)), 'Tempo médio']}
                      contentStyle={{ borderRadius: 6, backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                      labelStyle={{ color: '#000', fontWeight: 600 }}
                      itemStyle={{ color: '#ef4444' }}
                    />
                    <Bar dataKey="avgMs" fill="#EF4444" barSize={14} radius={[4,4,4,4]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-sm text-black">Dados insuficientes</div>
            )}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <div className="font-medium text-black">Mais rápidas</div>
            <ul className="text-sm text-black mt-1">
              {data?.fastestServices?.map((s: any) => (
                <li key={s.service} className="flex justify-between"><span>{s.service}</span><span className="text-black">{formatDuration(s.avgMs)}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-medium text-black">Mais lentas</div>
            <ul className="text-sm text-black mt-1">
              {data?.slowestServices?.map((s: any) => (
                <li key={s.service} className="flex justify-between"><span>{s.service}</span><span className="text-black">{formatDuration(s.avgMs)}</span></li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </Card>
  );
};

export default ResponseTimeCard;
