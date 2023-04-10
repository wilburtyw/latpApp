import json
import os

os.chdir("/Users/ty/Documents/dsci560/proj/application/geojson")

f = open('./zip_codes.json')

zipcodes = json.load(f)

for i in zipcodes["features"]:
    zipcode = i["properties"]['ZIP']
    print(f"<option>{zipcode}</option>")