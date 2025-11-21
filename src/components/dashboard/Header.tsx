import React from 'react';
import Typography from '../../components/Typography';

const Header: React.FC<{ title?: string; subtitle?: string }> = ({ title = 'Painel de Solicitações', subtitle }) => {
  return (
    <header className="px-8 py-6 bg-transparent">
      <div className="flex items-start justify-between">
        <div>
          <Typography as="h1" className="text-3xl font-bold text-gray-800">{title}</Typography>
          {subtitle && <Typography as="p" className="text-sm text-gray-600">{subtitle}</Typography>}
        </div>
      </div>
    </header>
  );
};

export default Header;
