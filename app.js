const cliente = require("./config/twitter.js"); //Importa o arquivo twitter.js
var CronJob = require('cron').CronJob; //Importa o "node-cron"
var webservice = require('./config/api.js');
var app = require("./config/server.js");
var server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
var casos = 4685, casosHoje, mortes = 168, mortesHoje, curados, doentes, criticos;
const fs = require('fs');

app.listen(server_port, server_host, function () {
    console.log("Aplicação online.");

    if (fs.existsSync('data.json')) {
    } else {
        var zerado = "{\"casos\":0,\"mortes\":0}"
        fs.writeFileSync('data.json', zerado);
    }
});

function getCorona() {
    var rawdata = fs.readFileSync('data.json');
    var dados = JSON.parse(rawdata);
    //get
    loadCorona = async () => {
        var tweet;
        const response = webservice.get('brazil')
            .then(response => {
                const json = response.data;

                if (dados.casos < json.cases || dados.mortes < json.deaths) {
                    if ((dados.mortes < json.deaths) && (dados.casos < json.cases)) {
                        var novasmortes = (json.deaths - dados.mortes)
                        var novoscasos = (json.cases - dados.casos)
                        if (novasmortes == 1) {
                            tweet = novasmortes + " nova morte pelo coronavírus no Brasil :(\nTotal de mortes: " + json.deaths + " 💀\nNovos casos: " + novoscasos + "\nTotal de casos: " + json.cases + " 😷";
                        } else {
                            tweet = novasmortes + " novas mortes pelo coronavírus no Brasil :(\nTotal de mortes:" + json.deaths + " 💀\nNovos casos: " + novoscasos + "\nTotal de casos: " + json.cases + " 😷";
                        }

                    } else if (dados.mortes < json.deaths) {
                        var novasmortes = (json.deaths - dados.mortes)
                        tweet = novasmortes + " novas mortes pelo coronavírus no Brasil :(\nTotal de mortes : " + json.deaths + " 💀\nTotal de casos: " + json.cases + " 😷";
                    } else {
                        var novoscasos = (json.cases - dados.casos)
                        tweet = (novoscasos + " novos casos de coronavírus no Brasil :(" + "\nTotal de casos : " + json.cases + " 😷 \nTotal de mortes : " + json.deaths + " 💀")
                    }
                    console.log(tweet);
                    cliente.tweetar(tweet);
                    dados.mortes = json.deaths;
                    dados.casos = json.cases;
                    var dadosString = JSON.stringify(dados);
                    fs.writeFileSync('data.json', dadosString);
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