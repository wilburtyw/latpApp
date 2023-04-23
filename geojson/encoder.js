const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

function encodeGeoJSONAnalytic(options) {
    return new Promise((resolve, reject) => {
        const { selectedZipcodes, selectedYears } = options;
        const selectedZipcodesSet = new Set(selectedZipcodes);
        const selectedYearsSet = new Set(selectedYears);
        const isAllZipcodesSelected = selectedZipcodesSet.size === 0;

        const geoJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, './zipcode.json'), 'utf8'));
        const csvFile = fs.createReadStream(path.resolve(__dirname, './history.csv'));

        const parser = parse({ delimiter: ',', columns: true });
        const data = {};
  
      parser.on('readable', () => {
        let record;
        while ((record = parser.read())) {
            const currentZipcode = record.zipcode;
            const currentYear = record.year;
            if ((isAllZipcodesSelected || selectedZipcodesSet.has(currentZipcode)) && selectedYearsSet.has(currentYear)) {
                const riskLevel = parseFloat(record.risk_level);
                const accidentFrequency = parseFloat(record.accident_frequency);

            if (!data[currentZipcode]) {
              data[currentZipcode] = {
                riskLevelSum: 0,
                accidentFrequencySum: 0,
                count: 0,
              };
            }
  
            data[currentZipcode].riskLevelSum += riskLevel;
            data[currentZipcode].accidentFrequencySum += accidentFrequency;
            data[currentZipcode].count++;
          }
        }
      });
  
      parser.on('end', () => {
        geoJSON.features.forEach((feature) => {
          const zipcode = feature.properties.zipcode;
          if (data[zipcode]) {
            feature.properties.risk_level = data[zipcode].riskLevelSum / data[zipcode].count;
            feature.properties.accident_frequency = data[zipcode].accidentFrequencySum / data[zipcode].count;
            feature.properties.selected = isAllZipcodesSelected || selectedZipcodesSet.has(zipcode);
          } else {
            feature.properties.risk_level = null;
            feature.properties.accident_frequency = null;
            feature.properties.selected = false;
          }
        });
  
        resolve(geoJSON); // Resolve the Promise with the filtered geoJSON
      });
  
      parser.on('error', (error) => {
        reject(error); // Reject the Promise if there's an error
      });
  
      csvFile.pipe(parser);
    });
}

function encodeGeoJSONPrediction(options) {
    return new Promise((resolve, reject) => {
        const { selectedZipcodes } = options;
        const selectedZipcodesSet = new Set(selectedZipcodes);
        const isAllZipcodesSelected = selectedZipcodesSet.size === 0;

        const geoJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, './zipcode.json'), 'utf8'));
        const csvFile = fs.createReadStream(path.resolve(__dirname, './prediction.csv'));
        
        const parser = parse({ delimiter: ',', columns: true });
        const data = {};
  
        parser.on('readable', () => {
            let record;
            while ((record = parser.read())) {
                const currentZipcode = record.zipcode;
                if (isAllZipcodesSelected || selectedZipcodesSet.has(currentZipcode)) {
                    const riskLevel = parseFloat(record.risk_level);
                if (!data[currentZipcode]) {
                    data[currentZipcode] = {
                    riskLevelSum: 0,
                    count: 0,
                    };
                }
            
            data[currentZipcode].riskLevelSum += riskLevel;
            data[currentZipcode].count++;
          }
        }
      });
  
      parser.on('end', () => {
        geoJSON.features.forEach((feature) => {
          const zipcode = feature.properties.zipcode;
          if (data[zipcode]) {
            feature.properties.risk_level = data[zipcode].riskLevelSum / data[zipcode].count;
            feature.properties.selected = isAllZipcodesSelected || selectedZipcodesSet.has(zipcode);
          } else {
            feature.properties.risk_level = null;
            feature.properties.selected = false;
          }
        });
  
        resolve(geoJSON); // Resolve the Promise with the filtered geoJSON
      });
  
      parser.on('error', (error) => {
        reject(error); // Reject the Promise if there's an error
      });
  
      csvFile.pipe(parser);
    });
  }

module.exports = {
    encodeGeoJSONAnalytic,
    encodeGeoJSONPrediction,
};