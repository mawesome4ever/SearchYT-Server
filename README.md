# SearchYT-Server
A server that allows communication between the `SearchYT` SiriShortcut and the server to web scrape YouTube for videos.

# Requirements
- Nodejs
- npm

# Setup
After downloading, open terminal and navigate to the project folder. Assuming you have npm/node set up already:
```bash
  npm install .
```
then run `node server.js` to run the server, you'll see a message saying "You are live on port 8000", you then just put the ip of the device in the Shortcut as a url like so:
<p align="center">
  <img src="https://github.com/mawesome4ever/Dependancies/blob/master/ipShortcuts.jpeg" width="350" title="Set Ip In Shortcuts">
</p>
to run on the Raspberrypi refer to https://github.com/GoogleChrome/puppeteer/issues/550 for fixes.
