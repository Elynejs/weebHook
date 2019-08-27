# weebHook

Discord bot that checks every hour the last release of mangakakalot.com and compare it to a list of followed mangas

## Installation

You first need to install Node.js and then [download](https://github.com/Elynejs/weebHook/archive/master.zip) the bot
Then go extract the zip in a folder and there create a token.json file with your token and preferred prefix like so :

```json
{
    "token": "your-token",
    "prefix": "your-prefix"
}
```

Once this is done you can edit the mangaList.json file to only include mangas you want to follow and launch the bot by typing
node index.js in powershell

### Usage

The bot will automatically check but you will have to call yourself the bot for it to display new releases (will probably change it in the future)
The available commands are :

> add "title of the manga to add"

`This adds a manga to mangaList.json`

> list

`Displays your list of mangas tracked`

> read

`Removes every chapters from the release array (after you have read them)`

> check

`Displays every new release that happenend since the last time you used the read command`
