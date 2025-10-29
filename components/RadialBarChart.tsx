"use client"
import { calculateAngle } from "@/lib/utils";
import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';


const RadialBarChart= ({size} :{size :number }) => {
  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: `${calculateAngle(size).toString()}%`,
        },
      },
    },
    labels: ['Ocuped'],
  };

  const series = [calculateAngle(size) ]; // Your data value

  return (
    <div id="chart">
      <Chart options={options} series={series} type="radialBar" height={180} />
    </div>
  );
};

export default RadialBarChart;