let map;
var optionsSelect = document.getElementById('color-options');
var zoomRange = document.getElementById('zoom-options')
function initMap() {
    var zoomlevel = zoomRange.value*2 + 10;
    console.log(zoomlevel)
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: zoomlevel,
        center: { lat: 34.0224, lng: -118.2851 },
    });
    // NOTE: This uses cross-domain XHR, and may not work on older browsers.
    var geojsonLayer = new google.maps.Data();
    geojsonLayer.loadGeoJson('./geojson/zipcode.json');

    // Step 3: create geojson layer
    geojsonLayer.setStyle((feature) => {
        var color = optionsSelect.value;
        let opacity = 0.1
        if (feature.getProperty("isHighlight")) {
            color = '#00337C'
            opacity = 0.3
        }
        return /** @type {!google.maps.Data.StyleOptions} */ {
            fillColor: color,
            fillOpacity: opacity,
            strokeColor: 'white',
            strokeWeight: 1,
        };
    });
    geojsonLayer.setMap(map);
    
    // Step 4: define options
    var options = [
        { label: 'Red', value: 'red' },
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' }
    ];
        
    // // Step 5: add event listener to options
    optionsSelect.addEventListener('change', (event) => {
        var selectedValue = optionsSelect.value;
        localStorage.setItem('selectedOption', selectedValue); // store selected option in local storage
        // geojsonLayer.setStyle(function(feature) {
        //     return {
        //     fillColor: selectedValue,
        //     fillOpacity: 0.1,
        //     strokeColor: 'white',
        //     strokeWeight: 1,
        //     };
        // });
    });

    zoomRange.addEventListener('change', (event) => {
        var zoomValue = optionsSelect.value;
        localStorage.setItem('zoomOption', zoomValue); // store selected option in local storage
    });
        
    // // Load selected option from local storage (if available)
    var savedOption = localStorage.getItem('selectedOption');
    if (savedOption) {
        optionsSelect.value = savedOption;
        // trigger change event to update map style
        var changeEvent = new Event('change');
        optionsSelect.dispatchEvent(changeEvent);
    }

    var savedZoomOption = localStorage.getItem('zoomOption');
    if (savedZoomOption) {
        zoomRange.value = savedZoomOption;
        // trigger change event to update map style
        var changeEvent = new Event('change');
        zoomRange.dispatchEvent(changeEvent);
    }
        
    // // Step 6: add button click event
    var applyButton = document.getElementById('apply');
    applyButton.addEventListener('click', function() {
        location.reload();
    });

    var zipcodes = []
    geojsonLayer.addListener("click", (event) => {
        var isHighlight = event.feature.getProperty("isHighlight");
        if (isHighlight) {
          event.feature.setProperty("isHighlight", false);
          zipcodes.pop(event.feature.getProperty("ZIPCODE"))
          console.log(zipcodes)
        } else {
          event.feature.setProperty("isHighlight", true);
          zipcodes.push(event.feature.getProperty("ZIPCODE"))
          console.log(zipcodes)
        }
    });
    geojsonLayer.addListener("mouseover", (event) => {
        geojsonLayer.revertStyle();
        geojsonLayer.overrideStyle(event.feature, { strokeWeight: 3 });
    });
    geojsonLayer.addListener("mouseout", (event) => {
        geojsonLayer.revertStyle();
    });
}

window.initMap = initMap;
