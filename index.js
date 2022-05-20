const express = require('express');
const data = require('./turkiye.json');

const server = express();

server.get('/', (req, res) => {
  res.send('Hello World!');
});

server.get('/api/cities', (req, res) => {
    res.status(200).json(data);
});

server.get('/api/cities/:name', (req, res) => {
    const city = data.data.find(city => city.il_adi === req.params.name);
    res.status(200).json(city);    
   
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});