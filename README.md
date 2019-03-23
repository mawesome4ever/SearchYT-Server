# SearchYT-Server
A server that allows communication between the `SearchYT` SiriShortcut and the server to web scrape YouTube for videos.

# Requirements
- Nodejs
- npm

# Setup
After downloading, open terminal and navigate to `/searchYTServer` project folder. Assuming you have npm/node set up already:
```bash
  npm install .
```
then run `node server.js` to run the server, you'll see a message saying "You are live on port 8000", you then just put the ip of the device in the Shortcut as a url like so:
<p align="center">
  <img src="https://github.com/mawesome4ever/Dependancies/blob/master/ipShortcuts.jpeg" width="350" title="Set Ip In Shortcuts">
</p>

# Running On Pi

To run on the Raspberrypi refer to https://github.com/GoogleChrome/puppeteer/issues/550 for fixes.

But what i did was first in the `/searchYTServer/app/routes/apis.js`file scroll down to where it uses the pupeteer variable, where it launches shoudld look something like `pup.launch()` and inside the paranthesis place `{headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox'],executablePath: '/usr/bin/chromium-browser'}`, now exit and save. After that, make sure to enter be super user by entering `super su` then run
```bash
sudo apt-get update && apt-get install chromium-browser
```
once it finishes downloading the armv version of chrome for the Pi, you can exit from super user so you don't accidentally destroy your pi by typing `exit` and then running the server with `node server.js`. Enjoy!
