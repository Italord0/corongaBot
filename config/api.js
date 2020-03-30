var axios = require ('axios');

const webservice = axios.create({
    baseURL: 'https://coronavirus-19-api.herokuapp.com/countries/'
});

module.exports = webservice;