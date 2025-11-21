import React from 'react';
import Card from '../../components/Card';

const DepartmentCard: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <Card className="p-0" title="Departamentos">
      <div className="p-4 space-y-3">
        {data?.map((d: any) => (
          <div key={d.department} className="">
            <div className="flex justify-between items-center">
              <div className="font-medium text-gray-800">{d.department}</div>
              <div className="text-sm text-gray-700">{d.total}</div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {d.topAgencies?.map((a: any) => (
                <div key={a.agency} className="flex justify-between">
                  <span>{a.agency}</span>
                  <span className="text-gray-700">{a.count}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DepartmentCard;
