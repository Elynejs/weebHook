const ch = require('cheerio');
const rp = require('request-promise');
const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('./token.json');

client.on('ready', () => {
    client.user.setActivity('Checking mangakakalot.com');
    console.log('Bot has been launched without issues!');
});

const options = {
    url: `https://mangakakalot.com/latest`,
    transform: ((body) => {
        return ch.load(body);
    })
};

let rawStr;
let str = [];
let track = [];
let released = [];

const scrap = () => {
    rawStr = '';
    str = [];
    rp(options)
        .then((body) => {
            body('.list-truyen-item-wrap').children('h3').each((i, elem) => {
                rawStr = body(elem).text();
                str.push(rawStr.replace(/[\n\r,]/g, ' ').trim());
                }
            )}
            )
        .catch((err) => {
            console.log('HTTP Request encountered an error. This is likely due to a server maintenance.' + err);
        });
    };

scrap();

const check = () => {
    let i;
    for (i = 0; i <= str.length; i++) {
        if (str[i] in track) {
            released.push(str);
        }
    }
}

check();

setInterval(scrap, 1000 * 60 * 60);
setInterval(check, 1000 * 60 * 60);

client.on('Message', msg => {
    if (msg.author.bot) return;
    if (msg.content.indexOf(token.prefix) !== 0) return;
    const args = msg.content.slice(token.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === 'add') {
        if (args.length) {
            track.push(args.replace(/,+/g, ' '));
            msg.channel.send('Added ' + args.replace(/,+/g, ' ') + ' to your list of tracked manga.');
        } else {
            msg.channel.send('Please specify the name of the manga you want to add to your tracking.'+
            '\nNote that this is case sensitive so just copy/paste it from the site.');
        }
    } else if (command === 'list') {
        let i;
        for (i = 0; i <= track.length; i++) {
            msg.channel.send(track[i]);
        }
    } else if (command === 'check') {
        if (released) {
            let i;
            for (i = 0; i <= released.length; i++) {
                msg.channel.send('The manga ' + released[i] + ' has a new chapter to check out.');
            }
        } else {
            msg.channel.send('No manga you track was updated.');
        }
    } else if (command === 'read') {
        released = [];
        msg.channel.send('Reset the released array.');
    } else {
        msg.channel.send('You failed to type a recognized command');
    }
})

client.login(token.token);