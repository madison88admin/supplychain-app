import React from 'react';
import {
  Truck
} from 'lucide-react';

interface ReportCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ icon: Icon, title, description, onClick, color }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300 group"
    >
      <div className="p-6 text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const Reports: React.FC = () => {
  const reports = [
    {
      icon: Truck,
      title: 'Logistics PK Report Generator',
      description: 'Generate comprehensive logistics and packaging reports',
      color: 'bg-blue-600',
      onClick: () => {
        window.open('https://m88logisticsgenerator.netlify.app/', '_blank');
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports Dashboard</h1>
          <p className="text-gray-600">Generate and view comprehensive reports for your supply chain operations</p>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reports.map((report, index) => (
            <ReportCard
              key={index}
              icon={report.icon}
              title={report.title}
              description={report.description}
              onClick={report.onClick}
              color={report.color}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Generate All Reports
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
              Schedule Reports
            </button>
            <button className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
              Report Templates
            </button>
            <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
              Report History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 