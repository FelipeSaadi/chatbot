"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ServiceRankingChart: React.FC<{ data: Array<{ service: string; count: number; percent: number }> }> = ({ data }) => {
  const max = data && data.length ? Math.max(...data.map(d => d.count)) : 1;

  // dynamic height so all labels can be shown; cap to avoid huge charts
  const rowHeight = 30; // px per bar
  const padding = 40;
  const height = Math.min(Math.max(200, data.length * rowHeight + padding), 800);

  // choose tick step adaptively to avoid crowded x-axis
  function chooseStep(n: number) {
    if (n <= 20) return 1;
    if (n <= 100) return 10;
    if (n <= 500) return 50;
    if (n <= 2000) return 100;
    return Math.ceil(n / 10 / 100) * 100; // fallback large step rounding
  }

  const step = chooseStep(max);
  const tickCount = Math.floor(max / step) + 1;
  const ticks = Array.from({ length: tickCount }, (_, i) => i * step);
  const domainMax = Math.ceil(max / step) * step || max;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          barCategoryGap="20%"
        >
          <XAxis
            type="number"
            domain={[0, domainMax]}
            ticks={ticks}
            tickFormatter={(v) => String(Math.round(Number(v)))}
          />
          <YAxis dataKey="service" type="category" width={180} interval={0} tick={{ fontSize: 14, fill: '#1f2937' }} />
          <Tooltip formatter={(value: any) => [value, 'Quantidade:']} contentStyle={{ borderRadius: 6 }} itemStyle={{ color: '#000' }} labelStyle={{ color: '#000' }} />
          <Bar dataKey="count" fill="#3182ce" barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServiceRankingChart;
