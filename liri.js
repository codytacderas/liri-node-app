var keys = require("./keys.js");
var requireTwitter = require('twitter');
var fs = require('file-system');
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
	id: keys.spotifyKeys.id,
	secret: keys.spotifyKeys.secret,
});
var request = require('request');
var songPick1 = process.argv[2];
var songPick2 = process.argv[3];

var getMyTweets = function() {

	var client = new requireTwitter(keys.twitterKeys);

	var params = {screen_name: 'pierrej13632087'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    for (var i = 0; i < tweets.length; i++){
	    	console.log(tweets[i].created_at);
	    	console.log(' ');
	    	console.log(tweets[i].text);
	    }
	  }
	});
}

var getArtistNames = function(artist) {
	return artist.name;
}
var getMeSpotify = function(songName) {
	spotify.search({ type: 'track', query: (songName || 'the+sign+ace+of+base')}, function(err, data) {
	  if (err) {
	    console.log('Error occurred: ' + err);
	    return
	  }
	 
	var songs = data.tracks.items;
	for (var i = 0; i < songs.length; i++) {
		console.log(i);
		console.log('Artist(s): ' + songs[i].artists.map(getArtistNames));
		console.log('Song Name: ' + songs[i].name);
		console.log('Preview Song: ' + songs[i].preview_url);
		console.log('Album: ' + songs[i].album.name);
		console.log('------------------------------');
	}
	});
}

var getMovie = function(movieName) {
	request('http://www.omdbapi.com/?t='+ (movieName || 'mr+nobody') + '&y=&plot=short&apikey=40e9cece', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var jsonData = JSON.parse(body);
			console.log('Title: ' + jsonData.Title);
			console.log('Year: ' + jsonData.Year);
			console.log('Rated: ' + jsonData.Rated);
			console.log('IMDB Rating: ' + jsonData.imdbRating);
			console.log('Country: ' + jsonData.County);
			console.log('Language: ' + jsonData.Language);
			console.log('Plot: ' + jsonData.Plot);
			console.log('Actors: ' + jsonData.Actors);
			console.log('RottenTomatoes URL: ' + jsonData.tomatoURL);
		}
	});
}

var doWhatItSays = function() {
	fs.readFile('random.txt', 'utf8', function(err, data) {
		if (err) {
			throw err;
		}
		var dataArr = data.split(',');

		if (dataArr.length == 2) {
			pick(dataArr[0], dataArr[1]);
		} else if (dataArr.length == 1) {
			pick(dataArr[0]);
		}
	});
}

var pick = function(caseData, functionData) {
	switch(caseData) {
		case 'my-tweets' :
			getMyTweets();
			break;
		case 'spotify-this-song':
			getMeSpotify(functionData);
			break;
		case 'movie-this':
			getMovie(functionData);
			break;
		case 'do-what-it-says':
			doWhatItSays();
			break;
		default:
		console.log('LIRI does not know this command.');
	}
}

var runThis = function(argOne, argTwo) {
	pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);