import * as Plot from "@observablehq/plot";
import {scaleOrdinal} from 'd3-scale';
import {schemeTableau10} from 'd3-scale-chromatic';
class Chart {
    constructor(emitter) {
        this.emitter = emitter;
        this.parameter;
        this.data = [];
        this.plotContainer = document.querySelector('.js-chart-container');
        this.parameterSelect = document.querySelector('.js-parameter-select');
        this.placeholder = document.querySelector('.js-placeholder');
        this.updateChart = this.updateChart.bind(this);
        this.updateData = this.updateData.bind(this);
        this.setParameter = this.setParameter.bind(this);
        this.addEventListeners = this.addEventListeners.bind(this);

        this.addEventListeners();
    }

    addEventListeners() {
        this.parameterSelect.addEventListener('change', this.setParameter);
    }

    setParameter(e) {
        const target = e.currentTarget;
        this.parameter = target.value;
        this.updateChart();
    }

    updateData(data, action) {
        const measurements = data.results
        if (action == "add") {
            this.data.push(measurements)
        } else {
            const idx = this.data.indexOf(measurements);
            this.data.splice(idx, 1);            
        }
        this.emitter.emit('update-chart');
    }

    updateChart() {
        let measurements = this.data.reduce((a, b) => a.concat(b), []).map(o => {
            return {
                date: new Date(o.date.local),
                parameter: o.parameter,
                value: o.value,
                locationId: o.locationId
            }
        });
        measurements = measurements.filter(o => o.parameter == this.parameter)


        const options = {
            marginTop: 60,
            marginBottom: 60,
            color: {
                type: "categorical",
                scheme: "tableau10"
              },
            marks: [
                Plot.ruleY([0]),
                Plot.dot(measurements, { x: "date", y: "value", stroke: "locationId" })
            ]
          }
        while (this.plotContainer.firstChild) {
            this.plotContainer.removeChild(this.plotContainer.firstChild);
        }
        if (this.data.length > 0) {
            this.placeholder.classList.remove('placeholder--visible');
            this.plotContainer.appendChild(Plot.plot(options))
        } else {
            this.placeholder.classList.add('placeholder--visible');
        }

        const colorScale = scaleOrdinal(
            [...new Set(measurements.map((d) => d.locationId))],
            schemeTableau10
        )
        this.emitter.emit('chart-updated', colorScale);
    }
}



export default Chart;