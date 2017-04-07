//npm packages
var fs = require("fs");
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");

//grabs the keys from keys.js and stores it into a var
var keys = require("./keys.js")

var client = new twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});
// console.log("new client: ", client);

var command = process.argv[2];
var songTitle = process.argv[3]

//switch-case that will direct which function gets run
switch (command) {
    case "my-tweets":
        myTweets();
        break;

    case "spotify-this-song":
        spotifySong();
        break;

    case "movie-this":
        movieThis();
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;
};

function myTweets() {
    client.get("statuses/user_timeline", function(error, tweets, response) {
        if (!error) {
            // console.log("twitter: ", tweets);
            console.log("----------");
            tweets.forEach(function(content) {
                console.log("My Tweets: " + content.text);
                console.log("Time tweet was created: " + content.created_at);
                console.log("----------");
            });
        } else {
            console.log(error);
        }
    });
};

function spotifySong() {
	//search tracks using spotify & if there's no user input, it automatically shows the search results for "The Sign" by Ace of Base
    spotify.search({ type: 'track', query: songTitle || "The Sign Ace of Base"}, function(err, data) {
        var songData = data.tracks.items;

 		//just in case of an error
        if (err) {
            console.log(err);
        };

        //for searches with more than one result
        if (songData.length > 0) {
            var firstResult = songData[0];
            console.log("----------");
            console.log("YOU SEARCHED FOR " + songTitle);
            console.log("Artist: " + firstResult.artists[0].name);
            console.log("Song Name: " + firstResult.name);
            console.log("Preview Link of Song: " + firstResult.preview_url);
            console.log("Album: " + firstResult.album.name);
            console.log("----------");
        } else {
            console.log("No songs found! Try another song.");
        }
    });
}
