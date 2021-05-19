Prerequisite :
1. Node.js & NPM (https://nodejs.org/en/)
2. git installed (not necessarily)
3. Open ports
4. A twilio account (Free Works)
5. A discord account.
*Note : You can also use Google Cloud which has everything installed*

Installing the API :
1. Extract the Files
2. Go to our API folder : “cd /midori/api/”
3. Install the dependencies : “npm i”
4. Start the api, wait 15s, and then, stop it : “npm start”
5. Modify the config.js file
• Add your twilio AccountSid & AuthToken
• Your twilio caller id
6. Open the port 1337 To check if everything works fine, I did a full test
system. If your Twilio account is not upgrade, before the test, go to the
/test/call.js file and modify the phone number line 122 with your phone
numer. : “npm test”
Your private API now works !
Be carefull, you also need to change the TTS Language, go to
https://www.twilio.com/console/voice/twiml/text-to-speech and change the TTS
Language from English to French with the Lea voice.

Install the Discord Bot :

Take your API Password from you config.js file in your api folder we are gonna use it

cd ../bots/discord

Modify the config.js file
• Add API Url & Api Password
• Your discord bot token
• Your actual IP to run the web server
• Change the secret password

Create two discord roles, one "Admin" with Administrator permissions, and the other
one "Bot User" with any permission.
Add the bot to the discord server

Initialize the discord bot
npm i
You can now start the discord bot
node bot.js
You can get all the informations needed on discord doing !help

*Disclaimer*
I TAKE NO RESPONSIBILITY FOR THE USE OF THIS.
Do not use it illegally.
Only use it with your phone numbers or people who accept to test this.
