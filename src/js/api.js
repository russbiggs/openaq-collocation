class API {
    constructor(emitter) {
        this.emitter = emitter;
        this.location = []; // lng lat array

        this.createUrl = this.createUrl.bind(this);
        this.getSensors = this.getSensors.bind(this);

    }


    setLocation(location) {
        this.location = location;
        this.getSensors();
    }

    createUrl(location) {
        const lng = location[0];
        const lat = location[1];
        return `https://docs.openaq.org/v2/locations?limit=100&page=1&offset=0&sort=desc&coordinates=${lat}%2C${lng}&radius=10000&order_by=lastUpdated&dumpRaw=false`
    }

    createMeasurementsUrl(locationId) {
        return `https://docs.openaq.org/v2/measurements?date_from=2021-08-16T00%3A00%3A00%2B00%3A00&date_to=2021-08-18T23%3A59%3A00%2B00%3A00&limit=10000&page=1&offset=0&sort=desc&radius=1000&location_id=${locationId}&order_by=datetime`
    }

    getSensors() {
        if (this.location != "") {
            fetch(this.createUrl(this.location)).then(res => res.json()).then(data => {
                this.emitter.emit('sensors', data);
            })
        }
    }

    getMeasurements(locationId) {
        fetch(this.createMeasurementsUrl(locationId)).then(res => res.json()).then(data => {
            this.emitter.emit('measurements', data);
        })
    }

}

export default API;
