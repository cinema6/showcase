import 'core-js/fn/promise';
import 'isomorphic-fetch';
import ChartistGraph from 'react-chartist';

{
    const updateChart = ChartistGraph.prototype.updateChart;

    ChartistGraph.prototype.updateChart = function updateChartPatch(config) {
        if (this.chartist) {
            this.chartist.responsiveOptions = config.responsiveOptions || [];
        }

        return updateChart.call(this, config);
    };
}
