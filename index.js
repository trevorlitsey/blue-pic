const express = require('express');
const Twitter = require('twitter');
const fs = require('fs');
var Canvas = require('canvas')
  , Image = Canvas.Image
  , canvas = new Canvas(200, 200)
  , ctx = canvas.getContext('2d');


const app = express();

app.get('/', (req, res) => {
	res.send('you made it');
});

require('dotenv').load();
var twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

let blueCount = 0;

setInterval(makeNewSquare, 30000 * 60)

function getRandomBlue() {
	const blue = Math.round((Math.random() * 9) + 216);
	const hue = Math.round((Math.random() * 50) + 25);
	return `hsl(${blue}, 50%, ${hue}%)`;
}

function makeNewSquare() {
	ctx.rect(0,00,200,200);
	const blue = getRandomBlue();
	console.log(blue);
	
	ctx.fillStyle = blue;
	ctx.fill();
	
	var dataURL = canvas.toDataURL().replace(/^data:image\/png;base64,/, "");
	
	fs.writeFile('output.png', dataURL, 'base64', function(err){
		if (err) throw err
		console.log(dataURL);
		sendMedia()
	})
}

function sendMedia() {
	const picData = fs.readFileSync('output.png', 'base64');
	
	const media = {
		media_data: picData,
	}

	twitterClient.post('media/upload', media, sendTweet)
}

function sendTweet(err, data, res) {
	if (err) {
		console.error(err);
	}
	const id = data.media_id_string;
	const tweet = {
		status: `blue_${blueCount}`,
		media_ids: id
	}
	twitterClient.post('statuses/update', tweet, success)
}

function success(err, data, res) {
	if (err) {
		console.error(err);
	} else {
		console.log('tweet sent');
		blueCount++;
	}
}

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});