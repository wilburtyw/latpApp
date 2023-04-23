const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

function encodeGeoJSONAnalytic(options) {
    return new Promise((resolve, reject) => {
        const { selectedZipcodes } = options;
        const selectedZipcodesSet = new Set(selectedZipcodes);
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
                const riskLevel = parseFloat(record.risk_level);
                const accidentFrequency = parseFloat(record.accident_frequency);

                if (!data[currentZipcode]) {
                    data[currentZipcode] = {};
                }

                if (!data[currentZipcode][`year_${currentYear}`]) {
                    data[currentZipcode][`year_${currentYear}`] = {
                        riskLevel: 0,
                        accidentFrequency: 0,
                    };
                }

                data[currentZipcode][`year_${currentYear}`].riskLevel = riskLevel;
                data[currentZipcode][`year_${currentYear}`].accidentFrequency = accidentFrequency;
            }
        });

        parser.on('end', () => {
            geoJSON.features.forEach((feature) => {
                const zipcode = feature.properties.zipcode;
                feature.properties.selected = isAllZipcodesSelected || selectedZipcodesSet.has(zipcode);

                if (data[zipcode]) {
                    Object.keys(data[zipcode]).forEach((yearKey) => {
                        feature.properties[yearKey] = {
                            risk_level: data[zipcode][yearKey].riskLevel,
                            accident_frequency: data[zipcode][yearKey].accidentFrequency,
                        };
                    });
                } else {
                    feature.properties.risk_level = null;
                    feature.properties.accident_frequency = null;
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
                    const riskLevel = parseFloat(record.risk_level);
                if (!data[currentZipcode]) {
                    data[currentZipcode] = {
                        riskLevelSum: 0,
                        count: 0,
                    };
                    
                    data[currentZipcode].riskLevelSum += riskLevel;
                    data[currentZipcode].count++;
                }
            }
      });
  
      parser.on('end', () => {
        geoJSON.features.forEach((feature) => {
            const zipcode = feature.properties.zipcode;
            feature.properties.selected = isAllZipcodesSelected || selectedZipcodesSet.has(zipcode);

            if (data[zipcode]) {
                feature.properties.risk_level = data[zipcode].riskLevelSum / data[zipcode].count;
            } else {
                feature.properties.risk_level = null;
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