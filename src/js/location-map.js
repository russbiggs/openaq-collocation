import {default as turfCircle} from "@turf/circle";



class LocationMap {
	constructor(emitter) {
        this.emitter = emitter;
		this.map = this.initMap();
		this.initMap = this.initMap.bind(this);
        this.addPoint = this.addPoint.bind(this);
        this.sensors;

        this.updateLocations = this.updateLocations.bind(this);
		this.addSensors = this.addSensors.bind(this);
        this.setSensorColors = this.setSensorColors.bind(this);
		this.createFeatures = this.createFeatures.bind(this);
        this.updateBounds = this.updateBounds.bind(this);
	}


    addPoint(coordinates) {
        const center = coordinates
        const radius = 10;
        const circle = turfCircle(center, radius, {steps: 50, units: 'kilometers'});
        this.map.getSource('centroid').setData(circle);
    }

	addSensors(data) {
        this.sensors = data;
        const coordinates = data.map(o => {
            return {
                coords: [o.coordinates.longitude, o.coordinates.latitude]
            } 
        });
        this.map.getSource('sensors').setData(this.createFeatures(coordinates))
	}

    setSensorColors(colorScale) {
        const coordinates = this.sensors.map(o => {
            return {
                color: colorScale(o.id),
                coords: [o.coordinates.longitude, o.coordinates.latitude]
            } 
        });
        this.map.getSource('sensors').setData(this.createFeatures(coordinates))
    }


    createFeatures(coordinates) {
        const features = coordinates.map(o => {
            return {
                "type": "Feature",
                "properties": {
                    "color": o.color
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": o.coords
                }
            }
        })
        return {
            type: 'FeatureCollection',
            features: features
          }
    }

	initMap() {
		const center = [  -105.87, 34.52 ];
		mapboxgl.accessToken = 'pk.eyJ1IjoicnVzc2JpZ2dzIiwiYSI6ImNrc2J6b3VqbDBidTYyb3VmN2MyanhsMXQifQ.FuXMRcy6J11zT0bOTtrmrQ';
		let map = new mapboxgl.Map({
			preserveDrawingBuffer: true,
			container: 'map',
			style: 'mapbox://styles/mapbox/outdoors-v11',
			center: center,
			zoom: 8,
            maxZoom: 10,
            minZoom: 8,
            hash: true
		});

        map.addControl(
            new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
            })
        );

        map.addControl(new mapboxgl.NavigationControl());


        map.on('load', () => {
            map.addSource('centroid', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [],
              },
            });
          
            map.addLayer({
                'id': 'centroid',
                'type': 'fill',
                'source': 'centroid', 
                'layout': {},
                'paint': {
                'fill-color': '#0080ff', 
                'fill-opacity': 0.5
                }
                });
                map.addSource('sensors', {
                    type: 'geojson',
                    data: {
                      type: 'FeatureCollection',
                      features: [],
                    },
                });
                
 
                map.addLayer({
                    'id': 'sensors',
                    'type': 'circle',
                    'source': 'sensors',
                    'paint': {
                        "circle-stroke-width": 1,
                        "circle-color":{
                            type: 'identity',
                            property: 'color',
                        },
                        "circle-stroke-color": "#000"
                    }
                });

            map.on('moveend', this.updateBounds);


            map.panTo([-106.6504, 35.0844])
        });
		return map;
	}


    updateLocations() {
        
    }

    updateBounds() {
        const {lng, lat} = this.map.getCenter();
        this.addPoint([lng,lat])
        this.emitter.emit('filter-map', [lng.toFixed(5),lat.toFixed(5)]);
	}
}

export default LocationMap;