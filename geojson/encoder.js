const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

function filterGeoJSON(options) {
  const { selectedZipcodes, selectedYears } = options;

  const geoJSONPath = path.resolve(__dirname, './zipcode.json');
  const geoJSON = JSON.parse(fs.readFileSync(geoJSONPath, 'utf8'));

  const csvFilePath = path.resolve(__dirname, './result.csv');
  const csvFile = fs.createReadStream(csvFilePath);

  const selectedZipcodesSet = new Set(selectedZipcodes);
  const selectedYearsSet = new Set(selectedYears);

  const parser = parse({ delimiter: ',', columns: true });

  const data = {};

  parser.on('readable', () => {
    let record;
    while ((record = parser.read())) {
      const currentZipcode = record.zipcode;
      const currentYear = record.year;
      if (selectedYearsSet.has(currentYear) && selectedZipcodesSet.has(currentZipcode)) {
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
        feature.properties.selected = selectedZipcodesSet.has(zipcode);
      } else {
        feature.properties.risk_level = null;
        feature.properties.accident_frequency = null;
        feature.properties.selected = false;
      }
    });

    console.log(JSON.stringify(geoJSON.features[0].properties, null, 2));
  });

  csvFile.pipe(parser);
}

module.exports = {
  filterGeoJSON,
};