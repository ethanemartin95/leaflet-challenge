// API Key
var API_KEY = "pk.eyJ1IjoiZXRoYW5tYXJ0aW45NSIsImEiOiJjazhqYzllcXIwZmUyM2dxaTR0dnBxcTdlIn0.tAWM1NaTW6Fw8zQBvgmakw";

// Define a map object
var map = L.map("map", {
    center: [40.7, -94.5],
    zoom: 3
  });

// Add Tile Layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
}).addTo(map);

// Get GeoJSON Data - All Earthquakes Last 7 Das (Recommended in README)
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

    // Function to dynamically change the radius of the marker depending on magnitude of Earthquake
    function determine_radius(magnitude) {
        return magnitude * 4;
    }

    // Function to dynamically change color of marker depending on the magnitude of Earthquake (Deeper Red = More Severe)
    function determine_color(magnitude) {
        if(magnitude > 5) {
            return "#bd0026";
        }
        else if(magnitude > 4) {
            return "#f03b20";
        }
        else if(magnitude > 3) {
            return "#fd8d3c";
        }
        else if (magnitude > 2) {
            return "#feb24c";
        }
        else if (magnitude > 1) {
            return "#fed976";
        }
        else {
            return "#ffffb2";
        }
    }


    // Function to dynamically change the style of each earthquake from the GeoJSON
    function marker_styling(feature) {
        return {
            radius: determine_radius(feature.properties.mag),
            fillColor: determine_color(feature.properties.mag),
            color: "white",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
    }

    // Add GeoJSON Layer
    L.geoJson(data, {
        // Give each earthquake a marker on the map
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, marker_styling(feature));
        },
        // style: marker_styling(feature), 
        // Add a info popup for each earthquake to supply basic information 
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(map);


    // LEGEND - Recommended code by Leaflet Tutorials
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0,1,2,3,4,5],
            colors = ["ffffb2", "#fed976", "feb24c", "fd8d3c", "f03b20", "bd0026"];
            
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);

});