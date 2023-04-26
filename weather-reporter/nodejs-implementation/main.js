const fs = require('fs');
const axios = require('axios');
const requestURL = 'https://api.weatherstack.com/current';
const access_key = '';

let cities = [];
const data = fs.readFileSync('./cities.txt', 'utf8');
cities = data.toString().split('\n');

for (let i = 0; i < cities.length; i += 1) {
  const params = {
    'access_key': access_key,
    'query': cities[i]
  };
  
  axios.get(requestURL, {params})
    .then(response => {
      const locationName = response.data.location.name;
      const temperature = response.data.current.temperature;
      const content = locationName + ', ' + temperature;
      fs.writeFileSync(`./${cities[i]}.txt`, content);
    }).catch(error => {
      console.log(error);
  });
};


