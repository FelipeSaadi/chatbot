import React from 'react';
import Card from '../../components/Card';

const ServiceTotalsCard: React.FC<{ data: any }> = ({ data }) => {
  const services = data?.services || [];

  return (
    <Card className="p-0" title={`Totais por Serviço (${data?.total || 0})`}>
      <div className="space-y-2 max-h-72 overflow-auto p-4">
        {services.map((s: any) => (
          <div key={s.service} className="flex items-center justify-between gap-4 py-2 border-b last:border-b-0">
            <div className="flex-1">
              <div className="font-medium text-sm text-black">{s.service}</div>
              <div className="text-xs text-black">
                Total: {s.total} • Recebidas: {s.received ?? 0} • Em andamento: {s.processed ?? 0} • Recusadas: {s.refused ?? 0} • Concluídas: {s.concluded ?? 0}
              </div>
            </div>

            <div className="text-right w-16">
              <div className="text-lg font-semibold text-black">{s.total}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ServiceTotalsCard;
