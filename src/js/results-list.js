class ResultsList {
    constructor(emitter) {
        this.emitter = emitter;
        this.listElem = document.querySelector('.js-sensor-list');
        this.listInfo = document.querySelector('.js-sensor-list-info');
        this.data = [];
        this.setData = this.setData.bind(this);
        this.clearList = this.clearList.bind(this);
        this.buildList = this.buildList.bind(this);
        this.addEventListeners = this.addEventListeners.bind(this);
        this.clearEventListeners = this.clearEventListeners.bind(this);
        this.setActive = this.setActive.bind(this);
    }

    addEventListeners() {
        const sensorItems = document.querySelectorAll('.js-sensor-item');
        for (const sensorItem of sensorItems) {
            sensorItem.addEventListener('click', this.setActive, false);
        }
    }


    clearEventListeners() {
        const sensorItems = document.querySelectorAll('.js-sensor-item');
        for (const sensorItem of sensorItems) {
            sensorItem.removeEventListener('click', this.setActive);
        }
    }

    setActive(e) {
        const target = e.currentTarget;
        if (target.getAttribute('active') == 'true') {
            target.setAttribute('active', 'false')
            this.emitter.emit('remove-location', target.getAttribute('location-id'))
            target.classList.remove('sensor-item--active')
        } else {
            target.setAttribute('active', 'true');
            target.classList.add('sensor-item--active')
            this.emitter.emit('add-location', target.getAttribute('location-id'));
        }
    }


    clearList() {
        this.clearEventListeners();
        this.data = [];
        while (this.listInfo.firstChild) {
            this.listInfo.removeChild(this.listInfo.firstChild)
        }
        while (this.listElem.firstChild) {
            this.listElem.removeChild(this.listElem.firstChild);
        }
    }

    buildList() {
        const frag = document.createDocumentFragment();
        const listInfoElem = `<h4>${this.data.length} sensors in search radius</h4>`
        this.listInfo.innerHTML = listInfoElem;
        for (const item of this.data) {
            const li = document.createElement('li');
            li.classList.add('sensor-item');
            li.classList.add('js-sensor-item');
            li.setAttribute('location-id', item.id);
            li.setAttribute('active', 'false');
            const parameters = item.parameters.map(o => o.displayName)
            const chips = parameters.map(o => `<div class="chip">${o}</div>`)
            li.innerHTML = `<div class="sensor-item__body">
                <div class="sensor-title">
                    <div class="sensor-name">${item.name}</div>
                    <div class="sensor-type">${item.sensorType}</div>
                </div>
                <div class="sensor-data">
                    ${chips.join('')}
                </div>
            </div>`
            frag.appendChild(li);
        }
        this.listElem.appendChild(frag);
        this.addEventListeners();
    }


    setData(data) {
        this.clearList()
        this.data = data
        this.buildList();
    }
}


export default ResultsList;