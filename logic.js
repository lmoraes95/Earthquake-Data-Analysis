platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

d3.json(platesURL, function(plateData) {
  console.log(plateData);});



var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

const link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(link, function(data) {
  Features(data.features);
});

  

function Features(earthquakefeatures) {
 
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3> Location: " + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<br><h2> Magnitude: " + feature.properties.mag + "</h2>");
  }

 
  function createCircleMarker(feature,latlng){
    var color;
    var r = 255;
    var g = Math.floor(255-50*feature.properties.mag);
    var b = Math.floor(255-50*feature.properties.mag);
    color= "rgb("+r+" ,"+g+","+ b+")"



    var options = {
        radius:feature.properties.mag*5,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }
    return L.circleMarker(latlng, options);
}
  
  let markers = L.geoJSON(earthquakefeatures, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });

  

  baseMap(markers);
}



function markerColor(magnitude)  {
  if (magnitude <= 1) {
    return "rgb(255,255,255)"
  }
  else if (magnitude <=2)  {
    return "rgb(255,225,225)"
  }
  else if (magnitude <=3) {
    return "rgb(255,195,195)"
  }
  else if (magnitude <=4) {
    return "rgb(255,165,165)"
  }
  else {
    return "rgb(255,135,135)"
  }
};

let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend'),
        mags = [0, 1, 3, 5, 7, 9],
        labels = ['<strong>Depth</strong>'];


        for (var i = 0; i < mags.length; i++) {
          div.innerHTML +=
              labels.push('<i style="background:' + markerColor(mags[i] + 1) + '"></i> ' +
              mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+'));
      }
      div.innerHTML = labels.join('<br>');
  
      return div;

      
};


function baseMap(markers) {

  let baseMaps = {
    "Street Map": basemap,
  };

  let overlayMap1 = {
    "Earthquakes": markers
  };

  let overlayMap2 = {
    "Tectonic Plates": markers
  };

  let myMap = L.map("map", {
    center: [
      39.8282, -98.5795
    ],
    zoom: 5,
    layers: [basemap, markers]
  });

  L.control.layers(baseMaps, overlayMap1, overlayMap2, {
    collapsed: true
  }).addTo(myMap);
  legend.addTo(myMap);
}