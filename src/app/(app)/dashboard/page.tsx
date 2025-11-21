"use client";
import React, { useEffect, useState } from 'react';
import Card from '../../../components/Card';
import Typography from '../../../components/Typography';
import { fetchTotalByService, fetchServiceRanking, fetchDepartmentStats, fetchRegionProfiles, fetchResponseTime } from '../../../lib/services/dashboard';
import ServiceRankingChart from '../../../components/dashboard/ServiceRankingChart';
import Header from '../../../components/dashboard/Header';
import ServiceTotalsCard from '../../../components/dashboard/ServiceTotalsCard';
import DepartmentCard from '../../../components/dashboard/DepartmentCard';
import RegionProfileCard from '../../../components/dashboard/RegionProfileCard';
import ResponseTimeCard from '../../../components/dashboard/ResponseTimeCard';

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [serviceTotals, setServiceTotals] = useState<any>(null);
  const [ranking, setRanking] = useState<any>(null);
  const [departments, setDepartments] = useState<any>(null);
  const [regions, setRegions] = useState<any>(null);
  const [responseTime, setResponseTime] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'totais'|'ranking'|'regiao'|'depart'|'response'>('totais');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [totals, rank, depts, regs, resp] = await Promise.all([
          fetchTotalByService(),
          fetchServiceRanking({ limit: 10 }),
          fetchDepartmentStats(),
          fetchRegionProfiles(),
          fetchResponseTime({ limit: 10 })
        ]);
        setServiceTotals(totals);
        setRanking(rank);
        setDepartments(depts);
        setRegions(regs);
        setResponseTime(resp);
      } catch (err) {
        console.error('Dashboard load error', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6 space-y-6">

        <div className="bg-white rounded-md shadow-sm p-4">
          <div role="tablist" aria-label="Dashboard tabs" className="flex gap-2 flex-wrap">
            <button role="tab" aria-selected={activeTab === 'totais'} onClick={() => setActiveTab('totais')} className={`px-3 py-1 rounded ${activeTab === 'totais' ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Totais</button>
            <button role="tab" aria-selected={activeTab === 'ranking'} onClick={() => setActiveTab('ranking')} className={`px-3 py-1 rounded ${activeTab === 'ranking' ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Ranking de Serviços</button>
            <button role="tab" aria-selected={activeTab === 'regiao'} onClick={() => setActiveTab('regiao')} className={`px-3 py-1 rounded ${activeTab === 'regiao' ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Perfil por Região</button>
            <button role="tab" aria-selected={activeTab === 'depart'} onClick={() => setActiveTab('depart')} className={`px-3 py-1 rounded ${activeTab === 'depart' ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Departamentos</button>
            <button role="tab" aria-selected={activeTab === 'response'} onClick={() => setActiveTab('response')} className={`px-3 py-1 rounded ${activeTab === 'response' ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Tempos de Resposta</button>
          </div>
        </div>

        <div className="bg-white rounded-md shadow-sm p-4">
          {activeTab === 'totais' && (
            <div>
              <ServiceTotalsCard data={serviceTotals} />
            </div>
          )}

          {activeTab === 'ranking' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Ranking de Serviços</h2>
              {ranking && ranking.ranking ? <ServiceRankingChart data={ranking.ranking} /> : <div>Nenhum dado</div>}
            </div>
          )}

          {activeTab === 'regiao' && (
            <div>
              <RegionProfileCard data={regions} />
            </div>
          )}

          {activeTab === 'depart' && (
            <div>
              <DepartmentCard data={departments} />
            </div>
          )}

          {activeTab === 'response' && (
            <div>
              <ResponseTimeCard data={responseTime} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
