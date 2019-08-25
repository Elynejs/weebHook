const ch = require('cheerio');
const rp = require('request-promise');
const Discord = require('discord.js');
const client = Discord.Client();
const token = require('token.json');
const options = {
    url: `https://mangakakalot.com/latest`,
    transform: function(body) {
        return ch.load(body);
    }
};

let rawStr;
let str = [];
let track = [];
let released = [];

const scrap = () => {
    rp(options)
        .then((body) => {
            body('.list-truyen-item-wrap').children('h3').each((i, elem) => {
                rawStr = body(elem).text();
                str.push(rawStr.replace(/[\n\r]/g, ' ').trim());
                }
            )}
            )
        .catch((err) => {
            console.log('HTTP Request encountered an error. This is likely due to a server maintenance.' + err);
        });
    };

const check = () => {
    let i;
    for (i = 0; i <= str.length; i++) {
        if (str[i] in track) {
            released.push(str);
        }
    }
}

setInterval(scrap, 1000 * 60 * 60);
setInterval(check, 1000 * 60 * 60);

client.on('Message', msg => {
    if (msg.author.bot) return;
    if (msg.content.indexOf(token.prefix) !== 0) return;
    const args = msg.content.slice(token.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === 'add') {
        if (args[0]) {
            track.push(args[0]);
        } else {
            msg.channel.send('Please specify the name of the manga you want to add to your tracking.'+
            '\nNote that this is case sensitive so just copy/paste it from the site.');
        }
    } else if (command === 'list') {
        let i;
        for (i = 0; i <= track.length; i++) {
            msg.channel.send(track[i]);
        }
    } else {
        msg.channel.send('You failed to type a recognized command');
    }
})


client.login(token);