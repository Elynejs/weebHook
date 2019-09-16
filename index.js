// Initializing libs
const ch = require('cheerio');
const rp = require('request-promise');
const Discord = require('discord.js');
const fs = require('fs');
const token = require('./token.json');
let track;
const userIDs = require('./userIDs.json');

// Initializing global vars
const client = new Discord.Client();
let checked = 0;
let rawStr;
let str = [];
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
            body('.list-truyen-item-wrap').children('h3').each((_i, elem) => {
                rawStr = body(elem).text();
                str.push(rawStr.replace(/[\n\r,]/g, ' ').trim());
            });
        })
        .catch((err) => {
            console.log('HTTP Request encountered an error. This is likely due to a server maintenance. ' + err);
        });
};scrap();

const chooseList = id => {
    if (userIDs.includes(id)) {
        track = require(`./lists/${id}_list.json`);
        console.log(`loaded ${id}_list.json as the tracked manga list`);
    } else {
        userIDs.push(id);
        console.log(`pushed ${id} to the userIDs list, creating manga list`);
        fs.writeFile('./userIDs.json', JSON.stringify(userIDs, undefined, 2), (err) => {
            if (err) console.log(err);
            console.log('ID list has successfully been updated');
        });
        track = [];
        fs.writeFile(`./lists/${id}_list.json`, JSON.stringify(track, undefined, 2), (err) => {
            if (err) console.log(err);
            console.log('manga list has successfully been created');
        });
    }
};

const check = id => {
    chooseList(id);
    checked++;
    for (let i = 0; i < str.length; i++) {
        for (let j = 0; j < track.length; j++) {
            if (str[i].includes(track[j])) {
                while (!released.includes(str[i])) {
                    released.push(str[i]);
                    console.log(`The manga ${str[i]} was added to the released list.`);
                    break;
                }
                console.log(`${str[i]} was updated`);
            }
        }
    }
    str = [];
};

setInterval(scrap, 1000 * 60 * 30);

client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.content.indexOf(token.prefix) !== 0) return;
    const args = msg.content.slice(token.prefix.length).trim().split(/ /);
    const command = args.shift().toLowerCase();
    if (command === 'add') {
        if (args.length) {
            chooseList(msg.author.id);
            let name = String();
            args.forEach((word) => { name += `${word} `;});
            if (!track.includes(name.trim())) {
                track.push(name.trim());
                fs.writeFile(`./lists/${msg.author.id}_list.json`, JSON.stringify(track, undefined, 2), (err) => {
                    if (err) console.log(err);
                    console.log('manga list has successfully been saved');
                });
                msg.channel.send(`Added ${name.trim()} to your list of tracked manga.`);
            } else {
                msg.channel.send(`${name.trim()} was already in your list.`);
            }
        } else {
            msg.channel.send('Please specify the name of the manga you want to add to your tracking.' +
            '\nNote that this is case sensitive so just copy/paste it from the site.');
        }
    } else if (command === 'scrap') {
        scrap();
        msg.channel.send('Scrapped mangakakalot.com');
    } else if (command === 'list') {
        chooseList(msg.author.id);
        if (track.length > 0 && track.length < 10) {
            let i;
            for (i = 0; i < track.length; i++) {
                msg.channel.send(`${track[i]} is in the list.\n${track.length - (i + 1)}/${track.length} mangas remaining in the list.`);
            }
        } else if (track.length === 0) {
            msg.channel.send(`Your tracking list is empty.\n
            To see it go to ./lists/${msg.author.id}_list.json`);
        } else if (track.length >= 10) {
            msg.channel.send(`Your tracking list contains ${track.length} mangas. If you have more than 10 the list won't display.\n
            To see it go to ./lists/${msg.author.id}_list.json`);
        }
    } else if (command === 'check') {
        check(msg.author.id);
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
    } else if (command === 'help') {
        msg.channel.send({
            embed: {
                color: 16286691,
                title: '__**List of all commands**__',
                fields: [{
                    name: '**Adding a manga**',
                    value: '```.add [name] => Adds a manga to your tracking list```',
                },
                {
                    name: '**List**',
                    value: '```.list => Lists every tracked manga in your list```',
                },
                {
                    name: '**Read the chapter**',
                    value: '```.read => Removes every manga from the released list, to use after youu have read them```',
                },
                {
                    name: '**Checking recently released manga**',
                    value: '```.check => Check mangakakalot for recently released manga and check if they are in your track list```',
                },
                {
                    name: '**Scrapping the site**',
                    value: '```.scrap => Manualy scrap mangakakalot for new release```',
                }],
            },
        });
    } else {
        msg.channel.send('This is not a recognized command. Please refer to .help to see available commands.');
    }
});

client.login(token.token);