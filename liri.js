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

var command = process.argv[2];
var userInput = process.argv[3]

//switch-case that will direct which function runs
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
    spotify.search({ type: 'track', query: userInput || "The Sign Ace of Base" }, function(err, data) {
        var songData = data.tracks.items;

        //just in case of an error
        if (err) {
            console.log(err);
        };

        //for searches with more than one result
        if (songData.length > 0) {
            var firstResult = songData[0];
            console.log("----------");
            console.log("YOU SEARCHED FOR " + userInput);
            console.log("Artist: " + firstResult.artists[0].name);
            console.log("Song Name: " + firstResult.name);
            console.log("Preview Link of Song: " + firstResult.preview_url);
            console.log("Album: " + firstResult.album.name);
            console.log("----------");
        } else {
            console.log("No songs found! Try another song.");
        }
    });
};

function movieThis() {
    request('http://www.omdbapi.com/?t=' + (userInput || "Mr. Nobody") + "&tomatoes=true", function(error, response, body) {
        if (!error) {
            //parses through the data received
            var movieData = JSON.parse(body);

            //logs all the needed info to terminal
            console.log("-----MOVIE INFO-----")
            console.log("Title: " + movieData.Title);
            console.log("Year: " + movieData.Year);
            console.log("IMDB Rating: " + movieData.imdbRating);
            console.log("Country: " + movieData.Country);
            console.log("Language: " + movieData.Language);
            console.log("Plot: " + movieData.Plot);
            console.log("Actors: " + movieData.Actors);
            console.log("Rotten Tomatoes Rating: " + movieData.tomatoRating);
            console.log("Rotten Tomatoes URL: " + movieData.tomatoURL);
            console.log("---------------------");
        } else {
            console.log("Error occurred: ", error);
        };
    });
};
