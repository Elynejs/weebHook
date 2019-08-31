// Initializing libs
const ch = require('cheerio');
const rp = require('request-promise');
const Discord = require('discord.js');
const fs = require('fs');
const token = require('./token.json');
const track = require('./mangaList.json');

// Initializing global vars
const client = new Discord.Client();
let checked = 0;
let rawStr;
const str = [];
let released = [];

client.on('ready', () => {
    client.user.setActivity('Checking mangakakalot.com');
    console.log('Bot has been launched without issues!');
});

const options = {
    url: 'https://mangakakalot.com/latest',
    transform: ((body) => {
        return ch.load(body);
    }),
};

const scrap = () => {
    console.log('scrapped');
    rp(options)
        .then((body) => {
            body('.list-truyen-item-wrap').children('h3').each((i, elem) => {
                rawStr = body(elem).text();
                str.push(rawStr.replace(/[\n\r,]/g, ' ').trim());
            }
            );
        }
        )
        .catch((err) => {
            console.log('HTTP Request encountered an error. This is likely due to a server maintenance. ' + err);
        });
};scrap();

const check = () => {
    checked++;
    let i;
    let j;
    for (i = 0; i < str.length; i++) {
        for (j = 0; j < track.length; j++) {
            if (str[i].includes(track[j])) {
                if (released.every(value => {
                    released[value] === str[i];
                })) {
                    released.push(str[i]);
                    console.log(`The manga ${str[i]} was added to the released list.`);
                } else {
                    console.log(`${str[i]} was already in the released array.`);
                }
            }
        }
    }
};

setInterval(scrap, 1000 * 60 * 30);
setInterval(check, 1000 * 60 * 30);

client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.content.indexOf(token.prefix) !== 0) return;
    const args = msg.content.slice(token.prefix.length).trim().split(/ /);
    const command = args.shift().toLowerCase();
    if (command === 'add') {
        if (args.length) {
            let name = String();
            args.forEach((word) => { name += `${word} `;});
            track.push(name.trim());
            fs.writeFile('mangaList.json', JSON.stringify(track, undefined, 2), (err) => {
                if (err) throw err;
                console.log('manga list has successfully been saved');
            });
            msg.channel.send(`Added ${name.trim()} to your list of tracked manga.`);
        } else {
            msg.channel.send('Please specify the name of the manga you want to add to your tracking.' +
            '\nNote that this is case sensitive so just copy/paste it from the site.');
        }
    } else if (command === 'list') {
        if (track.length) {
            let i;
            for (i = 0; i < track.length; i++) {
                msg.channel.send(`${track[i]} is in your list.`);
            }
        } else {
            msg.channel.send('Your tracking list is empty.');
        }
    } else if (command === 'check') {
        check();
        msg.channel.send(`The bot checked ${checked} times for new releases since last time.`);
        if (released.length) {
            let i;
            for (i = 0; i < released.length; i++) {
                msg.channel.send(`The manga ${released[i]} has a new chapter to check out.`);
            }
        } else {
            msg.channel.send('No manga you track was updated.');
        }
    } else if (command === 'read') {
        released = [];
        msg.channel.send('Marked every released chapter as read.');
    } else {
        msg.channel.send('You failed to type a recognized command');
    }
});

client.login(token.token);