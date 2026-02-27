'use client';

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

interface ActivityData {
  type: string;
  points: number;
  timestamp: string;
}

interface UserProgressGraphProps {
  activities: ActivityData[];
  className?: string;
}

const UserProgressGraph: React.FC<UserProgressGraphProps> = ({ activities, className = '' }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || activities.length === 0) return;

    // Clean up previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Process data for the chart
    const processedData = processActivitiesData(activities);

    // Create the chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: processedData.labels,
        datasets: [
          {
            label: 'Points Earned',
            data: processedData.pointsData,
            backgroundColor: 'rgba(129, 140, 248, 0.2)',
            borderColor: 'rgba(129, 140, 248, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 14,
              },
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Points',
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
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [activities]);

  // Process activities data for the chart
  const processActivitiesData = (activities: ActivityData[]) => {
    // Sort activities by timestamp
    const sortedActivities = [...activities].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Group activities by date
    const groupedByDate: Record<string, number> = {};
    
    sortedActivities.forEach((activity) => {
      const date = new Date(activity.timestamp).toLocaleDateString();
      if (!groupedByDate[date]) {
        groupedByDate[date] = 0;
      }
      groupedByDate[date] += activity.points;
    });

    // Extract labels and data
    const labels = Object.keys(groupedByDate);
    const pointsData = Object.values(groupedByDate);

    return { labels, pointsData };
  };

  // Process activities by type for the pie chart
  const getActivityTypeData = () => {
    const typeCount: Record<string, number> = {};
    
    activities.forEach((activity) => {
      if (!typeCount[activity.type]) {
        typeCount[activity.type] = 0;
      }
      typeCount[activity.type] += activity.points;
    });

    return {
      labels: Object.keys(typeCount),
      data: Object.values(typeCount),
    };
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Progress Over Time</h3>
      <div className="h-64">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default UserProgressGraph; 