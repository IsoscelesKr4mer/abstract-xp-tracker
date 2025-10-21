import React from 'react';

interface SimpleChartProps {
  data: any;
  type: 'line' | 'bar' | 'doughnut';
  options?: any;
  className?: string;
}

export const SimpleChart: React.FC<SimpleChartProps> = ({ data, type, options, className }) => {
  // For now, return a placeholder until Chart.js issues are resolved
  return (
    <div className={`w-full h-full ${className || ''}`}>
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-gray-600">Chart: {type}</p>
          <p className="text-sm text-gray-500">Data points: {data?.datasets?.[0]?.data?.length || 0}</p>
        </div>
      </div>
    </div>
  );
};

export const chartConfigs = {
  xpTrend: {
    type: 'line' as const,
    options: {
      plugins: {
        title: {
          display: true,
          text: 'XP Growth Over Time',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'XP Earned',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Date',
          },
        },
      },
    },
  },
  
  appComparison: {
    type: 'bar' as const,
    options: {
      plugins: {
        title: {
          display: true,
          text: 'XP by Application',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Total XP',
          },
        },
      },
    },
  },
  
  xpDistribution: {
    type: 'doughnut' as const,
    options: {
      plugins: {
        title: {
          display: true,
          text: 'XP Distribution',
        },
      },
    },
  },
};

export default SimpleChart;
