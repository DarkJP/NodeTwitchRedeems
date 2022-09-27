# NodeTwitchRedeems
A simple Node.js server that allows to link Twitch channel points redeems with a customisable chain of OBS actions.

# Why

This little tool has first been a personal project that ended up being used by a streamer friend.

The goal is to have a simple and lightweight tool that rely on as few online resources as possible. Everything runs on your machine (or any machine within your local network), so you have full control over everything.

### Donate

This tool is completely free, though you can give me a tip if you really want, thank you!

[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg?style=flat&logo=paypal)](https://www.paypal.com/paypalme/DarkJPFox)

# Prerequisites

Running this tool requires having <a href="https://nodejs.org/en/">Node.js</a> installed on the machine running the server.

You will need version <a href="https://nodejs.org/download/release/v16.14.2/">16.14.2</a> or above.

Tested on Windows 10 version 21H2.

You'll also need the OBS websocket plugin available <a target="_blank" href="https://github.com/obsproject/obs-websocket">here</a>

Make sure to download at least the version 5.

# Need help?

I created a dedicated Discord server. If you need help or got any problems, feel free to join it and I'll try my best to help you there.

[![Discord Server](https://img.shields.io/discord/1006502742107377704?color=blue&label=Discord&logo=Discord)](https://discord.gg/NaNdz8EAV6)

# How does it works?

Redeems and what they do are configured in a dashboard you access in a browser on http://localhost:621 by default. You can choose whatever suits you more (Make sure the port you choose isn't used anywhere else).

## What you find in the dashboard

### Dashboard

This is where you can see your created redeems and try them without having to go on Twitch.

### Edit Redeems

This is where you can create/edit/delete your redeems.

### Redeems Leaderboard

Here you can see a table of every user that redeemed something, and how many times.
You can sort each column by number of redeems. Please mind that the table sorting can take some time if the table is big (a few hundreds rows and more).

### Settings

Here you can link this app and your Twitch account.

### Help

Here are useful info on how to use the commands to create the custom redeems.

## How to create redeems

Breakdown of an action:
- Action name: the name of the action. It has to be THE SAME name as the associated redeem on Twitch.
- Action description: [Optional] description of the action. Doesn't really have a purpose but it's there...

- Action Target Sources: name(s) of the OBS source(s) on which the action will have effect on. You can leave it blank if you don't need that. If you set multiple, simply separate each with a comma `,`.

- Target source has to be visible: if set to yes, the action won't trigger if the specified target source(s) is/are not visible at the time. You can only adjust this setting if at least a target source is specified.

- Action Incompatibilties: [Optional] specify one or multiple other action names that are not compatible with this one. If another of the specified incompatible actions is running, this one won't trigger. This can be useful if you have say multiple actions that messes up with the scale or position of a source.

- Commands: list of the commands for this action. You can add as many as you want, they will be executed in order. See below for the list of available commands.

### the commands

- **createAudioSource**

Creates an OBS audio source from any audio file you want

- **createColorFilter**

Creates a color adjustement filter on any compatible source

- **createFreezeFilter**

Creates a new freeze filter. Requires this plugin: <a target="_blank" href="https://obsproject.com/forum/resources/freeze-filter.950/">OBS Freeze Filter</a>

- **deleteFilter**

Deletes a filter by name on any source.

- **createScrollFilter**

Creates a scroll filter on any compatible source. You can choose the speed.

- **createSharpenFilter**

Creates a sharpen filter on any compatible source. 

- **deleteSource**

Deletes a source by name

- **displayFilter**

Toggles a filter (Display on/off).

- **displaySource**

Toggles a source (Display on/off).

- **displaySourceEvery**

Display a source every X seconds for Y seconds.

- **saveScreenshot**

Saves a .png screenshot of a source at the desired location and eventually post it on a Discord if set up.

- **setFilterDelay**

Sets the time warp scan filter delay. Requires this plugin: <a target="_blank" href="https://obsproject.com/forum/resources/time-warp-scan.1167/">OBS Time Warp Scan</a>

- **setFilterRotation**

Sets the time warp scan filter rotation. Requires this plugin: <a target="_blank" href="https://obsproject.com/forum/resources/time-warp-scan.1167/">OBS Time Warp Scan</a>

- **setSourcePosition**

Sets the X and Y position of a source.

- **setSourceScale**

Sets the X and Y scale of a source.

- **wait**

Waits any amount of time in milliseconds.

### The keywords

Keywords are used inside the commands to make some things more easier and customizable.

- **'$obsSceneName'**

Fetches the name of the current OBS scene at the moment the action is triggered

- **$obsXScale**

Fetches the X scale of the specified source. Relevant commands: 'setSourceScale', 'setSourcePosition'

- **$obsYScale**

Fetches the Y scale of the specified source. Relevant commands: 'setSourceScale', 'setSourcePosition'

- **$obsXPosition**

Fetches the X position of the specified source. Relevant commands: 'setSourcePosition', 'setSourceScale'

- **$obsYPosition**

Fetches the Y position of the specified source. Relevant commands: 'setSourcePosition', 'setSourceScale'

- **$obsWidth**

Fetches the obs source width. Relevant commands: 'setSourceScale', 'setSourcePosition',

- **$obsHeight**

Fetches the obs source height. Relevant commands: 'setSourceScale', 'setSourcePosition'

- **$obsCanvasWidth**

Fetches the obs canvas width. Relevant commands: 'setSourcePosition', 'setSourceScale'

- **$obsCanvasHeight**

Fetches the obs canvas height. Relevant commands: 'setSourcePosition', 'setSourceScale'

- **$varRandom**

Returns a random value following the Javascript <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random">Math.random()</a> function (gives a value between 0 and 1, you'll need some additional operations for your desired use case).

#### Note

Be aware that some keywords like ``$obsWidth``, ``$obsHeight``, ``obsXScale``, ``obsYScale``, ``obsXPosition`` and ``obsYPosition`` requires to have at least 1 source specified in the ``Target Sources`` field.

### Tips

You can use and combine Math functions and operators. Say ``Math.floor($varRandom) * 360``, ``$obsXScale / 2 + 15`` or whatever.

### Examples

- **Horizontal Squish**

Let's say you want to horizontally squish a source by a factor of 4. You would use the ``setSourceScale`` command, with the following in ``scaleX`` field: ``$obsXScale / 4``.

Then to put it back to where it was, wait any given number of seconds using the ``wait`` command, and then add a ``setSourceScale`` command again, but this time just set ``$obsXScale`` in the ``scaleX``, which corresponds to the value it was right at the begining of the action.

- **Random position**

You have a source present is OBS and you want to display it at a random position each time the action is triggered.

Using the ``setSourcePosition`` command:

PositionX : ``Math.floor($varRandom * ($obsCanvasWidth - $obsWidth))``

PositionY : ``Math.floor($varRandom * ($obsCanvasHeight - $obsHeight))``

# Installation

### 1- Install Node.js

Again you can get it <a href="https://nodejs.org/en/">here</a>.

You can make sure it's installed correctly by typing ``node -v`` in a command line (that will display the verison you installed).

### 2- Clone the repo

Either use git to clone the repository or download the .zip and extract it anywhere you want.

### 3- Open a command line in the folder

I'm usually using git bash, but the standard Windows command line works just fine. You can quickly open a command line at the right place by typing ``cmd`` in the Windows file explorer address bar.

### 4- Run ``npm install``

This command will download all the required packages that the tool uses.

### 5- Create your Twitch application

Head on over to the <a href="https://dev.twitch.tv/console/apps">Twitch developper console</a> to register a new app.

- You can name it however you want.

- Set the redirect OAuth URL to ``http://localhost:621`` (or whatever port you want, more on that at step 7).

- Select the category (I used ``other``, I actually don't know if this has any impact whatsoever).

Once the application is created, create a new secret key and copy it (either in your clipboard, or anywhere so you don't lose it). Note: Keep it somwhere safe, **NEVER** expose your application secret key!

### 6- Run ``node server.js``

This will start the server and create all the required file for the next steps.

You can also use ``npm start``.

### 7- Fill in the ``.env`` file

Open the ``.env`` file that just got created at the root of the directory.

Fill it in with the required information:

- DASHBOARD_PORT: This is the port on which the server runs. You can put whatever you want, though make sure it is not used anywhere else. It also has to match the redirect OAuth URL from step 5.

- REDEEMS\_LEADERBOARD_PORT: Same story here, make sure it's not already used by something else.

- CHANNEL_ID: Your Twitch channel ID. You have multiple ways to find your channel ID, here are two simple tools (I'm not associated with those tools in any way).

<a href="https://chrome.google.com/webstore/detail/twitch-username-and-user/laonpoebfalkjijglbjbnkfndibbcoon">https://chrome.google.com/webstore/detail/twitch-username-and-user/laonpoebfalkjijglbjbnkfndibbcoon</a>

<a href="https://www.streamweasels.com/tools/convert-twitch-username-to-user-id/">https://www.streamweasels.com/tools/convert-twitch-username-to-user-id/</a>

- CHANNEL_NAME: Your Twitch channel name.

- REDIRECT_URL: The redirect URL you set up at step 5.

- CLIENT_ID: The client ID of the Twitch application you just created.

- CLIENT_SECRET: The secret ID of the Twitch application you just created.

- OBS_ADDRESS: The obs websocket address, you can find it in the obs plugin settings. It will likely be ``http://localhost:4455``

- OBS_PWD: The obs websocket password, you can find it in the obs plugin settings. You can use the one generated by the plugin.

- DISCORD_WEBHOOK_URL: Discord webhook URL for the ``saveScreenshot`` command. Leave blank if you don't want that.

### 8- Authorize your Twitch application

Run ``node server.js`` to start the server again and head on over the dashboard on <a href="http://localhost:621/">http://localhost:621/</a> (Or again whatever port you chose at step 7).

Go to the ``Settings`` tab and click the ``Authorize`` button. This will open Twitch in a new tab. Authorize your application, and you will automatically get back to the dashboard. You can close it, the server should have saved the login information.

If the server doesn't stop automatically (I'm having no problems with the git bash console, however the Windows one sometimes acts weird and doesn't shut the server), you can shut it by pressing ``ctrl + C``).

### 9- Restart the server

Run the server again with ``node server.js`` and everything you start correctly.

![NodeTwitchRedeems - Server connected](https://cdn.discordapp.com/attachments/990297958782226562/1024339797680066630/ServerConnected.png)

### 10- Some handy stuff

You can create a shortcut to launch the console and the server.

- Create a new file anywhere you want with a ``.bat`` extension. Let's say ``startServer.bat``.

- Open it using any text editor.

- Paste and edit the following:
```
cd C:\Users\<John Doe>\Desktop\NodeTwitchRedeems
node server.js
```
Make sure the path is correct and leads to the correct folder.

All done, you can now just double click on the .bat file to start the server.