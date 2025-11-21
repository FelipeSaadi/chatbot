import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Paleta de cores vibrantes para os departamentos
const COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // green-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
];

const DepartmentCard: React.FC<{ data: any[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Nenhum dado de departamento disponível
      </div>
    );
  }

  // Preparar dados para o gráfico
  const chartData = data.map((d: any) => ({
    department: d.department,
    total: d.total,
    topAgencies: d.topAgencies || []
  }));

  // Calcular o total máximo para escala
  const maxTotal = Math.max(...chartData.map(d => d.total));

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Solicitações por Departamento</h2>
        <p className="text-sm text-gray-600 mt-1">Distribuição de atendimentos entre departamentos</p>
      </div>

      {/* Gráfico de Barras Horizontal */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" />
            <YAxis 
              dataKey="department" 
              type="category" 
              stroke="#6b7280"
              width={110}
              tick={{ fontSize: 13 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: any) => [`${value} solicitações`, 'Total']}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={() => 'Total de Solicitações'}
            />
            <Bar 
              dataKey="total" 
              radius={[0, 8, 8, 0]}
              label={{ position: 'right', fill: '#374151', fontSize: 12, fontWeight: 600 }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cards de Detalhes por Departamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chartData.map((dept: any, index: number) => (
          <div 
            key={dept.department} 
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            {/* Header do Card */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <h3 className="font-semibold text-gray-900">{dept.department}</h3>
              </div>
              <span className="text-2xl font-bold text-gray-900">{dept.total}</span>
            </div>

            {/* Barra de Progresso */}
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(dept.total / maxTotal) * 100}%`,
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                />
              </div>
            </div>

            {/* Top Agências */}
            {dept.topAgencies && dept.topAgencies.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Principais Órgãos
                </p>
                {dept.topAgencies.slice(0, 3).map((agency: any) => (
                  <div 
                    key={agency.agency} 
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-700 truncate">{agency.agency}</span>
                    <span className="font-medium text-gray-900 ml-2">{agency.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentCard;
