const { encodeGeoJSONAnalytic, encodeGeoJSONPrediction } = require('./geojson/encoder.js');

async function testFilterGeoJSON() {
    const options = {
      selectedZipcodes: ['90001', '90002'],
      selectedYears: ['2019', '2018'],
    };
  
    try {
      const filteredGeoJSON = await encodeGeoJSONAnalytic(options);
  
      // Log the results
      console.log('Filtered geoJSON:', JSON.stringify(filteredGeoJSON, null, 2));
  
      // Perform additional assertions or checks here, if necessary
  
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  async function testencodeGeoJSONPrediction() {
    const options = {
      selectedZipcodes: ['90001', '90002'],
      selectedYears: ['2019', '2018'],
    };
  
    try {
      const filteredGeoJSON = await encodeGeoJSONPrediction(options);
  
      // Log the results
      console.log('Filtered geoJSON:', JSON.stringify(filteredGeoJSON, null, 2));
  
      // Perform additional assertions or checks here, if necessary
  
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Run the test
  testFilterGeoJSON();
  testencodeGeoJSONPrediction();