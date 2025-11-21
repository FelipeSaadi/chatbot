"use client";
import { useEffect, useState } from "react";
import RequestCard from "@/components/RequestCard";
import StatusColumn from "@/components/StatusColumn";
import Header from "@/components/HeaderSolicitation";

interface Request {
  _id: string;
  title: string;
  name: string;
  phone: string;
  address: string;
  note: string;
  // normalized to Portuguese union used by RequestCard
  priority: 'alta' | 'media' | 'baixa';
  status: string;
}

export default function RequestPage() {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    // Usar URL relativa em produção, absoluta em desenvolvimento
    const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
    const apiUrl = isProduction ? '/api/requests' : 'http://localhost:8000/api/requests';
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        // normalize priority values to Portuguese: alta/media/baixa
        const normalizePriority = (p: any) => {
          if (!p) return 'baixa';
          const s = String(p).toLowerCase();
          if (s === 'high' || s === 'alta' || s === 'high_priority' || s === 'high-priority') return 'alta';
          if (s === 'medium' || s === 'media' || s === 'med') return 'media';
          if (s === 'low' || s === 'baixa') return 'baixa';
          return 'baixa'; // fallback to lowest priority for safety
        };

        const normalized = (data || []).map((r: any) => ({ ...r, priority: normalizePriority(r.priority) }));
        setRequests(normalized);
      })
      .catch(console.error);
  }, []);

  const novos = requests.filter((r) => r.status === "novo");
  const andamento = requests.filter((r) => r.status === "em_andamento");
  const recusados = requests.filter((r) => r.status === "recusado");

  return (
    <div className="min-h-screen p-4 md:p-2 lg:p-4 w-full mx-auto flex flex-col h-full">
      <header className="mb-6 pl-8 ">
        <h1 className="text-3xl font-bold text-gray-800">Solicitações</h1>
        <p className="text-gray-600">Histórico de conversas com cidadãos</p>
      </header>

      <div className="flex justify-between px-8 py-6 space-x-6">
    <StatusColumn 
        status="A Fazer" 
        count={novos.length} 
        content={recusados.map((r) => <RequestCard key={r._id} {...r} />)}
    />
    <StatusColumn 
        status="Em Andamento" 
        count={andamento.length} 
        content={novos.map((r) => <RequestCard key={r._id} {...r} />)}
    />
    <StatusColumn 
        status="Recusados" 
        count={recusados.length} 
        content={andamento.map((r) => <RequestCard key={r._id} {...r} />)}
    />
</div>
    </div>
  );
}
