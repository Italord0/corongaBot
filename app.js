const cliente = require("./config/twitter.js"); //Importa o arquivo twitter.js
var CronJob = require('cron').CronJob; //Importa o "node-cron"
var webservice = require('./config/api.js');
var app = require("./config/server.js");
//Configura a porta disponível ou a porta 3000
//var server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
//Configura o host disponível ou "0.0.0.0"
//var server_host = process.env.YOUR_HOST || '0.0.0.0';
var casos = 0, casosHoje, mortes = 0, mortesHoje, curados, doentes, criticos;

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
                        if (novoscasos == 1) {
                            tweet = novasmortes + " nova morte pelo coronavírus no Brasil :( Total: " + json.deaths + "\nNovos casos:" + novoscasos;
                        } else {
                            tweet = novasmortes + " novas mortes pelo coronavírus no Brasil :( Total :" + json.deaths + "\nNovos casos:" + novoscasos;
                        }
                        mortes = json.deaths;
                        casos = json.cases;
                    } else if (mortes < json.deaths) {
                        var novasmortes = (json.deaths - mortes)
                        tweet = novasmortes + " novas mortes pelo coronavírus no Brasil :( \nTotal : " + json.deaths;
                        mortes = json.deaths;
                    } else {
                        var novoscasos = (json.cases - casos)
                        tweet = (novoscasos + " novos casos de coronavírus no Brasil :(")
                        casos = json.cases
                    }
                    console.log(tweet);
                    cliente.tweetar(tweet);
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
    getCorona()

})
job.start();