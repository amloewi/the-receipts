import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';

ChartJS.register(ChartDataLabels, CategoryScale, LinearScale, BarElement);

type Props = {
  labels: Array<string>;
  dataSetData: Array<number>;
  backgroundColor: string;
  chartLabel: string;
};

export default function Chart(props: Props) {
  const data = {
    labels: props.labels,
    datasets: [
      {
        label: '',
        data: props.dataSetData,
        backgroundColor: [props.backgroundColor],
        categoryPercentage: 1.0,
        barPercentage: 1.0,
        borderColor: '#000',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    events: [],
    layout: {
      padding: 25,
    },
    legend: {
      display: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
      },
    },
    tooltips: {
      enabled: false,
      showTooltips: false,
    },

    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',
        color: ['#000'],
      } as any,
      legend: {
        display: false,
      },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="chart-wrapper">
      <div className="chart">
        <Bar data={data} width={200} height={300} options={options} />
      </div>
      <div className="label">{props.chartLabel}</div>
    </div>
  );
}
