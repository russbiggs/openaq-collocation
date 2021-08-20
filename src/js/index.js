import mitt from 'mitt';
import API from './api';
import ResultsList from './results-list';
import Chart from './chart';
import LocationMap from './location-map';
import DistanceTable from './distance-table';

{
    const emitter = mitt();   
    const map = new LocationMap(emitter);
    const chart = new Chart(emitter);
    chart.parameter = "pm25";
    const checkList = new ResultsList(emitter);
    const api = new API(emitter);
    const distanceTable = new DistanceTable();

    emitter.on('sensors', (data) => checkList.setData(data.results))
    emitter.on('sensors', (data) => map.addSensors(data.results))
    emitter.on('set-location', (location) => map.addPoint(location))
    emitter.on('set-location', (location) => api.setLocation(location))

    emitter.on('add-location', (locationId) => api.getMeasurements(locationId))
    emitter.on('remove-location', (data) => chart.updateData(data, 'remove'))
    emitter.on('measurements', (data) => chart.updateData(data, 'add'))
    emitter.on('update-chart', () => chart.updateChart());
    emitter.on('measurements', (data) => distanceTable.updateData(data, 'add'))
    emitter.on('remove-location', (data) => distanceTable.updateData(data, 'remove'))
    emitter.on('filter-map', (location) => api.setLocation(location))
    emitter.on('chart-updated', (colorScale) => map.setSensorColors(colorScale));

}