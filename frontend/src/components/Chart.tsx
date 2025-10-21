import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartProps {
  data: any;
  type: 'line' | 'bar' | 'doughnut';
  options?: any;
  className?: string;
}

export const Chart: React.FC<ChartProps> = ({ data, type, options, className }) => {
  const chartRef = useRef<ChartJS>(null);

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: type !== 'doughnut' ? {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    } : undefined,
  };

  const chartOptions = { ...defaultOptions, ...options };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line ref={chartRef} data={data} options={chartOptions} />;
      case 'bar':
        return <Bar ref={chartRef} data={data} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut ref={chartRef} data={data} options={chartOptions} />;
      default:
        return <Line ref={chartRef} data={data} options={chartOptions} />;
    }
  };

  return (
    <div className={`w-full h-full ${className || ''}`}>
      {renderChart()}
    </div>
  );
};

// Predefined chart configurations for common use cases
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

export default Chart;
