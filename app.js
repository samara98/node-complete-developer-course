// const request = require("request");
const geocode = require("./utils/geocode");

/* const url =
  // "https://api.darksky.net/forecast/9d1465c6f3bb7a6c71944bdd8548d026/37.8267,-122.4233";
  "http://api.weatherstack.com/current?access_key=17522fcc4e88343d792ab6a5a3ad7e01&query=Sukabumi&units=m"; */

/* request({ url: url, json: true }, (error, response) => {
  console.log(
    response.body.current.weather_descriptions[0] +
      ". It is currently " +
      response.body.current.temperature +
      " degress out. There is a " +
      response.body.current.precip +
      "% chance of rain."
  );
}); */

// Geocoding
// Address -> Lat/Long -> Weather

// const geocodeURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=pk.eyJ1IjoiYW5kcmV3bWVhZDEiLCJhIjoiY2pvOG8ybW90MDFhazNxcnJ4OTYydzJlOSJ9.njY7HvaalLEVhEOIghPTlw&limit=1'
/* const geocodeURL =
  "https://api.mapbox.com/geocoding/v5/mapbox.places/Sukabumi.json?access_token=pk.eyJ1Ijoic2FtYXJhOTgiLCJhIjoiY2s5YWQ3dmtnMDBwaDNobWwwcHJmcm1yMCJ9.BlNICiMLKRYONg4QQvpThw&limit=1"; */

/* request({ url: geocodeURL, json: true }, (error, response) => {
  if (error) {
    console.log("Unable to connect to location services!");
  } else if (response.body.features.length === 0) {
    console.log("Unable to find location. Try another search.");
  } else {
    const latitude = response.body.features[0].center[1];
    const longitude = response.body.features[0].center[0];
    console.log(latitude, longitude);
  }
}); */

geocode("Boston", (error, data) => {
  console.log("Error", error);
  console.log("Data", data);
});
