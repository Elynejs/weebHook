# weebHook

PROJECT IS DISCONTINUED

Discord bot that checks every hour the last release of mangakakalot.com and compare it to a list of followed mangas

## Installation

You first need to install Node.js and then [download](https://github.com/Elynejs/weebHook/archive/master.zip) the bot
then go extract the zip in a folder and there create a token.json file with your token and preferred prefix like so :

```json
{
    "token": "your-token",
    "prefix": "."
}
```

### Launch

Open cmd and type `node index.js`

#### Usage

The bot will automatically check but you will have to call yourself the bot for it to display new releases (will probably change it in the future)

The available commands are :

```discord.js
.add [title] => This adds a manga to your tracked list

.list => Displays your list of tracked mangas

.read => Removes every chapters from the release array

.check => Displays every new release that happenend since the last time you used the read command

.remove [title] => Removes a manga from your tracked list
```
