const mapConfig = {
    map: null,
    geojsonLayer: null,
    selectedZipcodes: [],
    colorOption: 'blue',
    zoomOption: 0,
    opacityOption: 80,
};

const mapUtils = {
    getColorByRiskLevel(colorOption, riskLevel) {
        const colorSets = {
            blue: ['#b3e5fc', '#318fd7', '#0d47a1'],
            red: ['#ffe0b2', '#fd8c1a', '#e53935'],
            green: ['#c8e6c9', '#7cb342', '#33691e'],
        };

        if (colorSets.hasOwnProperty(colorOption)) {
            return colorSets[colorOption][riskLevel] || '#FFFFFF';
        } else {
            return '#FFFFFF';
        }
    },
  
    getFeatureByZipcode(zipcode) {
        let foundFeature = null;
        mapConfig.geojsonLayer.forEach((feature) => {
            if (feature.getProperty("zipcode") === zipcode) {
                foundFeature = feature;
            }
        });
        return foundFeature;
    },
};

function initMap() {
    mapConfig.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: 34.0224, lng: -118.2851 },
        styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
              featureType: "administrative.locality",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#263c3f" }],
            },
            {
              featureType: "poi.park",
              elementType: "labels.text.fill",
              stylers: [{ color: "#6b9a76" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#38414e" }],
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#212a37" }],
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9ca5b3" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#746855" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#1f2835" }],
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [{ color: "#f3d19c" }],
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#2f3948" }],
            },
            {
              featureType: "transit.station",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#515c6d" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#17263c" }],
            },
        ],
    });

    mapConfig.geojsonLayer = new google.maps.Data();
    mapConfig.geojsonLayer.setStyle((feature) => {
        const riskLevel = feature.getProperty("risk_level");
        const fillColor = mapUtils.getColorByRiskLevel(mapConfig.colorOption, riskLevel);
        const isHighlighted = feature.getProperty("isHighlighted")
      return {
        fillColor: fillColor,
        fillOpacity: isHighlighted ? 0.8 : 0.6,
        strokeColor: 'white',
        strokeWeight: 1,
      };
    });
  
    mapConfig.geojsonLayer.setMap(mapConfig.map);

    function updateSelectedZipcodesInfo() {
        const selectedZipcodesInfo = document.getElementById("selected-zipcodes-info");
    
        // Remove existing info elements
        while (selectedZipcodesInfo.firstChild) {
            selectedZipcodesInfo.removeChild(selectedZipcodesInfo.firstChild);
        }
    
        // Create a table element and set its attributes
        const table = document.createElement("table");
        table.setAttribute("id", "selected-zipcodes-table");
        selectedZipcodesInfo.appendChild(table);
    
        // Add table headers
        const headerRow = document.createElement("tr");
        const headerZipcode = document.createElement("th");
        headerZipcode.textContent = "Zipcode";
        headerRow.appendChild(headerZipcode);
    
        const headerRiskLevel = document.createElement("th");
        headerRiskLevel.textContent = "Risk Level";
        headerRow.appendChild(headerRiskLevel);
    
        table.appendChild(headerRow);
    
        // Add table rows for each selected zipcode
        mapConfig.selectedZipcodes.sort().forEach((zipcode) => {
            const feature = mapUtils.getFeatureByZipcode(zipcode);
            if (feature) {
                const riskLevel = feature.getProperty("risk_level");
                const riskLevelText = riskLevel === null ? "N/A" : riskLevel;
    
                const row = document.createElement("tr");
                table.appendChild(row);
    
                const cellZipcode = document.createElement("td");
                cellZipcode.textContent = zipcode;
                row.appendChild(cellZipcode);
    
                const cellRiskLevel = document.createElement("td");
                cellRiskLevel.textContent = riskLevelText;
                row.appendChild(cellRiskLevel);
            }
        });
    }
    
    mapConfig.geojsonLayer.addListener("click", (event) => {
        const zipcode = event.feature.getProperty("zipcode");
        const isHighlighted = event.feature.getProperty("isHighlighted");
        const selectElement = document.querySelector(`#multi-select option[value="${zipcode}"]`);
        if (isHighlighted) {
            event.feature.setProperty("isHighlighted", false);
            mapConfig.selectedZipcodes = mapConfig.selectedZipcodes.filter(item => item !== zipcode);
            console.log(mapConfig.selectedZipcodes);
            selectElement.selected = false;
        } else {
            event.feature.setProperty("isHighlighted", true);
            mapConfig.selectedZipcodes.push(zipcode);
            console.log(mapConfig.selectedZipcodes);
            selectElement.selected = true;
        }
        updateSelectedZipcodesInfo()
    });

    function selectZipcode(zipcode) {
        mapConfig.geojsonLayer.forEach((feature) => {
          if (feature.getProperty("zipcode") === zipcode) {
            feature.setProperty("isHighlighted", true);
          }
        });
      }
      
    function deselectZipcode(zipcode) {
        mapConfig.geojsonLayer.forEach((feature) => {
            if (feature.getProperty("zipcode") === zipcode) {
            feature.setProperty("isHighlighted", false);
            }
        });
    }    

    const selectElement = document.getElementById('multi-select');

    selectElement.addEventListener('mousedown', (event) => {
        event.preventDefault(); // Prevent the default behavior
        const optionElement = event.target;
        if (optionElement.tagName.toLowerCase() === 'option') {
          const zipcode = optionElement.value;
          const scrollTop = selectElement.scrollTop; // Save the current scroll position
    
          if (optionElement.selected) {
            optionElement.selected = false;
            mapConfig.selectedZipcodes = mapConfig.selectedZipcodes.filter(item => item !== zipcode);
            deselectZipcode(zipcode);
          } else {
            optionElement.selected = true;
            mapConfig.selectedZipcodes.push(zipcode)
            selectZipcode(zipcode);
          }
          selectElement.scrollTop = scrollTop; // Restore the scroll position
        }
        updateSelectedZipcodesInfo()
      });

    mapConfig.geojsonLayer.addListener("mouseover", (event) => {
        mapConfig.geojsonLayer.revertStyle();
        mapConfig.geojsonLayer.overrideStyle(event.feature, { strokeWeight: 3 });
    });
    mapConfig.geojsonLayer.addListener("mouseout", (event) => {
        mapConfig.geojsonLayer.revertStyle();
    });

    fetch('/api/encoded-pred')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((encodedData) => {
        mapConfig.geojsonLayer.addGeoJson(encodedData);
    })
    .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
    });

    function applyFilters() {
        // Get values from HTML elements
        mapConfig.colorOption = document.getElementById('color-options').value;
        mapConfig.opacityOption = parseInt(document.getElementById('opacity-option').value) / 100;
        mapConfig.zoomOption = parseInt(document.getElementById('zoom-option').value);
        mapConfig.map.setZoom(mapConfig.zoomOption+10);

        // Update map styling
        mapConfig.geojsonLayer.setStyle((feature) => {
            const riskLevel = feature.getProperty("risk_level");
            const fillColor = mapUtils.getColorByRiskLevel(mapConfig.colorOption, riskLevel);
            const fillOpacity = feature.getProperty("isHighlighted") ? 1 * mapConfig.opacityOption : (feature.getProperty("isSelected") ? 0.75 * mapConfig.opacityOption : 0.4 * mapConfig.opacityOption);
            
            return {
                fillColor: fillColor,
                fillOpacity: fillOpacity,
                strokeColor: 'white',
                strokeWeight: 1,
            };
        });
        }

    // Add event listener to Apply Filter button
    document.getElementById('apply').addEventListener('click', () => {
        applyFilters();
    });
    
    function clearAllSelections() {
        mapConfig.geojsonLayer.forEach(function (feature) {
            feature.setProperty("isHighlighted", false);
            feature.setProperty("isSelected", false);
        });
        mapConfig.selectedZipcodes = []
        updateSelectedZipcodesInfo()
        const selectElement = document.getElementById('multi-select');
        for (let option of selectElement.options) {
            option.selected = false;
        }
        mapConfig.geojsonLayer.revertStyle();
    }

    document.getElementById("clear").addEventListener("click", function () {
        clearAllSelections();
        document.getElementById("color-options").value = "blue";
        document.getElementById("opValue").innerText = "20%";
        document.getElementById("zoValue").innerText = "Lvl0";
        document.getElementById("zoom-option").value = 0;
        document.getElementById("opacity-option").value = 80;
        document
            .querySelectorAll(".select--multiple option:checked")
            .forEach((option) => (option.selected = false));
        applyFilters();
    });
}

window.initMap = initMap