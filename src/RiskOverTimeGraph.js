import React, { useState, useEffect } from 'react';
import { Chart } from 'chart.js/auto';


function RiskOverTimeGraph(props) {
    const [chart, setChart] = useState(null);

    // This function creates a new Chart instance with the given data and options,
    // or updates an existing Chart instance with new data.
    const createOrUpdateChart = (data, options) => {
        if (!chart) {
            setChart(new Chart('risk-over-time-chart', {
                type: 'line',
                data: data,
                options: options
            }));
        } else {
            chart.data = data;
            chart.options = options;
            chart.update();
        }
    };

    // This effect hook updates the Chart instance whenever the data or options prop changes.
    useEffect(() => {
        const { data, options } = props;
        createOrUpdateChart(data, options);
    }, [props.data, props.options]);

    return (
        <div>
            <canvas id="risk-over-time-chart" />
        </div>
    );
}

export default RiskOverTimeGraph;
