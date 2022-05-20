fetch('../turkiye.json')
    .then(response => response.json())
    .then(data => {
        /* console.log(data.data); */
        /* const cities = data.data;
        const cityNames = cities.map(city => city.il_adi);
        console.log(cityNames);
        const cityName = cityNames.find(city => city === 'İstanbul');
        console.log(cityName);  */

        const city = data.data.find(city => city.il_adi === 'İstanbul');
        console.log(city)
    });