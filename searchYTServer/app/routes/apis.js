const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const bodyParser = require('body-parser');
const l = require('cheerio');
const puppeteer = require('puppeteer');
const file = require('fs')
module.exports = function(app, db) {
	app.use(bodyParser.json());
	app.post("/word", async (req, res) => {
		const numbers = [1,2,3,4,5,6,7,8,9,10];
		var reg = new RegExp(/(number)/g);
		const wordNums = ["one","two","three","four","five","six","seven","eight","nine","ten"];
		var reqBod = req.body.num.toLowerCase();
		if(reqBod.match(reg).length > 0){
			reg = new RegExp(/([^number])\B\w+/g);
			reqBod = reqBod.match(reg);
		}
		console.log("User Numbered: "+reqBod);
		var sent = false;
		for(var i=0; i<wordNums.length; i++){
			if(!isNaN(Number(reqBod))){
				res.send(""+Number(reqBod)+"");
				return;
			}
			if(reqBod == wordNums[i] || reqBod == "too" && i == 2 || reqBod == "for" && i == 4 || reqBod == "fur" && i == 4 || reqBod == "to" && i == 2){
				res.send(""+numbers[i]+"");
				sent = true;
			}
		}
		if(!sent){
			res.send(req.body.num);
		}
	});
	//supports the old versioning system, where it doesn't give a desc of the update to the shortcut
	app.post("/version",async (req, res) => {
		if(req.body.num < 2.02){
			res.json({"true":"https://www.icloud.com/shortcuts/a22db84cd1e344709a0573ac843a4f43"});
		}else{
			res.send("false");
		}
	});
	app.post('/links', async (req, res) => {
		//make sure the request url is not empty
		if(req.body.url == undefined ||req.body.url == "" || req.body.url.length < 2){res.send([{"error":"url not specified"}]); return;}
		var videos = [];//saves the list of videos scraped
		const launched = await puppeteer.launch().catch(console.error);//launches a browser
		var newPage = await launched.newPage().catch(console.error);//opens a new tab
		await newPage.goto("https://www.youtube.com/results?search_query="+req.body.url+"&app=desktop", {//navigates page to youtube site
			waitUntil: ['networkidle0','networkidle2','domcontentloaded','load']//make sure the site is loaded before doing anything else
		  }).catch(console.error);
		var htmlcontent = await newPage.content();//Get the HTML from the site
		var tst = undefined;
		var channelName;
		if(req.body.IsChannel == true){//if the user said the search querie is a channel, find the channel element
			const channelLink = l("a.yt-simple-endpoint.style-scope.ytd-channel-renderer",htmlcontent);//this is where it looks for the element
			const channelHref = l(channelLink.first(),htmlcontent).attr("href");//the the channels url
			if(channelHref !== undefined){//if it found a url navigate the page to that url
				channelName = channelHref;
				await newPage.goto("https://www.youtube.com"+channelHref+"/videos",{
					waitUntil: ['networkidle0','networkidle2','domcontentloaded','load']//waits until the page is loaded
					}).catch(console.error);
				htmlcontent = await newPage.content();//sets the htmlcontent variable to the HTML from the channels site
			}else{
				tst = 1;
			}
		}
		var isChan = false;
		if(req.body.IsChannel == true && tst == undefined){
			isChan = true;
			//Getting the videos from the channel
			tst = l('a#video-title.yt-simple-endpoint.style-scope.ytd-grid-video-renderer',htmlcontent);
		}else{
			//Getting the videos from the Seach results page
			tst = l('a#video-title.yt-simple-endpoint.style-scope.ytd-video-renderer',htmlcontent);
		}
		tst.each(function() {//loops through the video elemts found on the page
			var videoName = l(this,htmlcontent).attr("title");//gets the title from the video element
			var linkToVid = l(this,htmlcontent).attr("href");//gets the url from the video element
			var newDict = {};
			if (videoName == undefined && linkToVid == undefined || videoName == null && linkToVid == null){
				newDict["error"] = "error in item";
			}else{
				newDict[videoName] = linkToVid;
				//console.log("found one!");
			}
			videos.push(newDict);
		});
		//outputs to the console what a user searched, usually when there's multiple search of the same items it means there is an issue.
		console.log("A User Searched: "+req.body.url);
		launched.close();
		console.log("req isChannel: "+req.body.IsChannel);//outputs to console if what the user searched is a channel, to debug.
		if(isChan && req.body.IsChannel == true){
			//channelName would something like this "/Pewdiepie", the regex extracts "Pewdiepie"
			const chan = channelName.match(new RegExp(/([A-Z])\w+/g));
			console.log("chan:"+chan);
			const test = {"videos":videos,"channel":chan};
			res.json(JSON.stringify(test));
		}else{
			const test = {"videos":videos,"channel":""};
			res.json(JSON.stringify(test));
		}
	  });
	app.post("/version1",async (req, res) => {
		if(req.body.num < 2.02){//checks if the version that was sent, to reply with url to update shortcut
			res.json({
				"update":"https://www.icloud.com/shortcuts/a22db84cd1e344709a0573ac843a4f43",//update url
				"shortdesc":"🛠url, +🐛report",
				"longdesc":"Fixed a url issue which prevented users from contacting the server with their query, added a bug report where if the server returns no data, the user will be able to send a report that allows me to reconstruct what caused it to send nothing (it should always send back videos)",
			});
		}else{
			res.send("false");
		}
	});
	app.post("/bug",async (req,res) =>{//saves a report of the bug to a file incase the server is shutdown (has happened)
		const fs = require('fs');
		console.log(req.body.data);
		fs.appendFile("./bugs.txt",req.body.data,function(err){
			console.log(err);
		});
		res.send("okay");
	});
};
