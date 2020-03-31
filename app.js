const cliente = require("./config/twitter.js"); //Importa o arquivo twitter.js
var CronJob = require('cron').CronJob; //Importa o "node-cron"
var webservice = require('./config/api.js');
var app = require("./config/server.js");
var server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
var casos = 4685, casosHoje, mortes = 168, mortesHoje, curados, doentes, criticos;

app.listen(server_port, server_host, function () {
    console.log("Aplicação online.");
});

function getCorona() {

    //get
    loadCorona = async () => {
        var tweet;
        const response = webservice.get('https://coronavirus-19-api.herokuapp.com/countries/brazil')
            .then(response => {
                const json = response.data;

                if (casos < json.cases || mortes < json.deaths) {
                    if ((mortes < json.deaths) && (casos < json.cases)) {
                        var novasmortes = (json.deaths - mortes)
                        var novoscasos = (json.cases - casos)
                        if (novasmortes == 1) {
                            tweet = novasmortes + " nova morte pelo coronavírus no Brasil :(\nTotal de mortes: " + json.deaths + "\nNovos casos: " + novoscasos + "\nTotal de casos: " + json.cases;
                        } else {
                            tweet = novasmortes + " novas mortes pelo coronavírus no Brasil :(\nTotal de mortes:" + json.deaths + "\nNovos casos: " + novoscasos + "\nTotal de casos: " + json.cases;
                        }

                    } else if (mortes < json.deaths) {
                        var novasmortes = (json.deaths - mortes)
                        tweet = novasmortes + " novas mortes pelo coronavírus no Brasil :(\nTotal de mortes : " + json.deaths + "\nTotal de casos: " + json.cases;
                    } else {
                        var novoscasos = (json.cases - casos)
                        tweet = (novoscasos + " novos casos de coronavírus no Brasil :(" + "\nTotal de casos : " + json.cases)
                    }
                    console.log(tweet);
                    cliente.tweetar(tweet);
                    mortes = json.deaths;
                    casos = json.cases;
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    loadCorona();
}

const job = new CronJob('* * * * *', () => {
    //Roda toda hora
    console.log("Rodando cron")
    getCorona()

})
job.start();