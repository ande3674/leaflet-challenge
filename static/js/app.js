var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
console.log(url);
console.log(API_KEY);

// Create a map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

console.log(myMap);

d3.json(url, function(data) {
    var earthquakes = data.features;
    console.log(earthquakes);


    for (var i = 0; i < earthquakes.length; i++) {
        var lat = earthquakes[i].geometry.coordinates[0];
        var lng = earthquakes[i].geometry.coordinates[1];
        var coords = [lng, lat];
        L.circle(coords, {
            fillOpacity: 0.75,
            color: "blue",
            fillColor: "purple",
            radius: 100
        }).bindPopup("<h1>" + earthquakes[i].properties.title + "</h1> <hr> <h3>Magnitude: " + earthquakes[i].properties.mag + "</h3>").addTo(myMap);
    }
});