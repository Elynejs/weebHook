const ch = require('cheerio');
const rp = require('request-promise');
// const Discord = require('discord.js');
// const client = Discord.Client();
const options = {
    url: `https://mangakakalot.com/latest`,
    transform: function(body) {
        return ch.load(body);
    }
};

let rawStr;
let str = [];
// let mangas = [];

rp(options)
    .then((body) => {
        body('.list-truyen-item-wrap').children('h3').each((i, elem) => {
            rawStr = body(elem).text();
            str.push(rawStr.replace(/[\n\r]/g, ' ').trim());
            console.log(str[i]);
            }
        )}
        )
    .catch((err) => {
        console.log('HTTP Request encountered an error. This is likely due to a server maintenance.' + err);
    });