var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Create a map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3
    //layers: lightmap
});

// Make light and dark layers
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});

// base layer object
var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap
};

// TODO overlay object
// var overlayMaps = {
//     Earthquakes: earthquakes
// }

// L.control.layers(baseMaps, {
//     collapsed: false
// }).addTo(myMap);

d3.json(url, function(data) {
    var earthquakes = data.features; 

    for (var i = 0; i < earthquakes.length; i++) {
        var lat = earthquakes[i].geometry.coordinates[0];
        var lng = earthquakes[i].geometry.coordinates[1];
        var depth = earthquakes[i].geometry.coordinates[2];
        var mag = earthquakes[i].properties.mag;
        var coords = [lng, lat];

        L.circle(coords, {
            fillOpacity: 0.75,
            color: "pink",
            fillColor: markerColor(depth),
            radius: markerSize(mag)
        }).bindPopup("<h1>" + earthquakes[i].properties.title + "</h1> <hr> <p>" + new Date(earthquakes[i].properties.time) + "</p> <h3>Magnitude: " + mag + "</h3> <h3>Depth: " + depth + "</h3>").addTo(myMap);
    }
    
});

// Marker functions
function markerSize(mag) {
    return mag * 10000;
}

function markerColor(depth) {
    var color = "";
    if (depth > 600) {
        color = "#8B0000";
    }
    else if (depth > 400) {
        color = "#B22222";
    }
    else if (depth > 200) {
        color = "#CD5C5C";
    }
    else if (depth > 150) {
        color = "#FF4500";
    }
    else if (depth > 100) {
        color = "#FF6347";
    }
    else if (depth > 50) {
        color = "#E9967A";
    }
    else {
        color = "#FFA07A";
    }
    return color;
}

// Add legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 50, 100, 50, 100, 150, 200, 400, 600],
        labels = [];

    // loop through our density intervals and generate a label with a colored square 
    //  for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);