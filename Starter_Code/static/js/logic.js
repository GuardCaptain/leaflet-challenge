// Url for data
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"


// Creating the map object

let myMap = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 4.5
  });
  
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Gathering data using d3

d3.json(url).then(function(data) {
     // Set limit to 1000 to allow for faster loading
    let markerLimit = 1000

    // Defining variables we will use
    for (i = 0; i < markerLimit; i++) {
        let location = data.features[i].geometry.coordinates;
        let sizeMagnitude = data.features[i].properties.mag;
        let depth = data.features[i].geometry.coordinates[2];
        let place = data.features[i].properties.place
        let colors = '';

        // If statement to filter depth by color
        if (depth <= 10) {
             colors = 'lightgreen';
        }
        else if (depth <= 30) {
             colors = 'green';
        }
        else if (depth <= 50) {
             colors = 'yellow';
        }
        else if ( depth <= 70) {
             colors = 'orange';
        }
        else if (depth <= 90) {
             colors = 'red';
        }
        else {
             colors = 'darkred';
        }
        
        // Creating radius of circle based on magnitude of earthquake
        L.circle([location[1],location[0]], {
            fillOpacity: 0.75,
            color: colors,
            fillColor: colors,
            radius: sizeMagnitude * 20000})
            .bindPopup(`<h1>${place}</h1>Magnitude: ${sizeMagnitude}<br>Depth: ${depth}`)
        .addTo(myMap); 

}

// Set up the legend.
let legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");
  let depths = [0, 10, 30, 50, 70, 90];
  let colors = ['lightgreen', 'green', 'yellow', 'orange', 'red', 'darkred']; // Define corresponding colors
  let labels = [];

  // Add the legend title
  div.innerHTML = "<h1>Earthquake Depth</h1>";

  // Loop through the depth ranges and generate a label with a colored square for each range
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML +=
      '<li style="background:' + colors[i] + '"></li> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
  }

  return div;
};

// Adding the legend to the map
legend.addTo(myMap);

});