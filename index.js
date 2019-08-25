const ch = require('cheerio');
const rp = require('request-promise');
// const Discord = require('discord.js');
// const client = Discord.Client();
const options = {
    url: `https://mangakakalot.com/page`,
    transform: function(body) {
        return ch.load(body);
    }
};

let mangas = [];

rp(options)
    .then((body) => {
        body('li').each((i, elem) => {
            mangas[i] = body(elem).text();
            console.log(mangas);
        });
    })
    .catch((err) => {
        console.log('HTTP Request encountered an error. This is likely due to a server maintenance. Here is the error code :' + err);
    });