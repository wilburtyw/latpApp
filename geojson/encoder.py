import json
import os

os.chdir("/Users/ty/Documents/dsci560/proj/application/geojson")

f = open('./zip_codes_old.json')

zipcodes = json.load(f)

for feature in zipcodes['features']:
    properties = feature['properties']
    feature['properties']['zipcode'] = feature['properties']['ZIPCODE']
    properties.pop('ZIPCODE', None)
    properties.pop('ZIP', None)
    properties.pop('TOOLTIP', None)
    properties.pop('NLA_URL', None)

# Save the modified JSON
with open('zipcode.json', 'w') as output_file:
    json.dump(zipcodes, output_file, indent=2)