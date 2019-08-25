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

const junk = ['HOME','LATEST MANGA','HOT MANGA','NEW MANGA','COMPLETED MANGA','MANGAKAKALOT','Chapter'];
let rawStr;
let str = [];
let mangas = [];

rp(options)
    .then((body) => {
        body('li').each((i, elem) => {
            rawStr = body(elem).text();
            str[i] = rawStr.replace(/[\n\r]/g, ' ').trim();
            console.log(str[i]);
            }
        )}
        )
    .catch((err) => {
        console.log('HTTP Request encountered an error. This is likely due to a server maintenance.' + err);
    });

const filter = () => {
    let i;
    let j;
    for (i = 0; i <= str.length; i++) {
        for (j = 0; j <= junk.length; j++) {
            if (str[i].includes(junk[j])) {
                console.log('Removed a string because it contained a junk');
            } else {
                mangas[i] = str;
            }
        }
    }
};

filter();
console.log(mangas);