import distance from '@turf/distance';

class DistanceTable {
    constructor() {
        this.container = document.querySelector('.js-distance-table')

        this.elem = document.querySelector('.js-distance-table-body')
        this.data = [];

        this.updateData = this.updateData.bind(this);
        this.clearTable = this.clearTable.bind(this);
        this.buildTable = this.buildTable.bind(this);
    }

    updateData(location, action) {
        if (action == "add") {
            this.data.push(location.results[0])
        } else {
            const idx = this.data.indexOf(location[0]);
            this.data.splice(idx, 1);            
        }
        if (this.data.length > 1) {
            this.buildTable();
            this.container.classList.add('distance-table--visible')
        } else {
            this.container.classList.remove('distance-table--visible')
            this.clearTable();
        }
        console.log(this.data)
    }

    clearTable() {
        while (this.elem.firstChild) {
            this.elem.removeChild(this.elem.firstChild)
        }
    }


    


    buildTable() {
        this.clearTable();
        const locations = [...this.data];
        const frag = document.createDocumentFragment();
        for (let i = 0; i < locations.length; i++) {
            const l = locations.splice(i, 1)[0];
            for (const item of locations) {
                const tr = document.createElement('tr');
                const fromCell = document.createElement('td');
                fromCell.innerText = l.location
                const toCell = document.createElement('td');
                toCell.innerText = item.location
                const distanceCell = document.createElement('td');
                const dist = distance(coordinatesToLatLngPair(l.coordinates), coordinatesToLatLngPair(item.coordinates))
                distanceCell.innerText = `${dist.toFixed(2)}km`
                tr.appendChild(fromCell)
                tr.appendChild(toCell)
                tr.appendChild(distanceCell)
                frag.appendChild(tr)
            }
        }
        this.elem.appendChild(frag);
    }
}

function coordinatesToLatLngPair(coords) {
    return [coords.longitude, coords.latitude];
}

export default DistanceTable;