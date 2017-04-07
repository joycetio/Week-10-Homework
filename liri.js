//npm packages
var fs = require("fs");
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var command = process.argv[2];
var userInput = process.argv.splice(3);

//grabs the keys from keys.js and stores it into a var
var keys = require("./keys.js")

var client = new twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});


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

//twitter npm package
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

        log();
    });
};

//spotify npm package 
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
            var firstResult = data.tracks.items[0];
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

        log();
    });
};

//request npm package 
function movieThis() {
    request('http://www.omdbapi.com/?t=' + (userInput || "Mr. Nobody") + "&tomatoes=true", function(error, response, body) {
        if (!error && response.statusCode === 200) {
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

        log();
    });
};

function doWhatItSays() {
    //access random.txt and reads data inside the file
    fs.readFile("random.txt", "utf8", function(error, data) {

        //in case of an error
        if (error) throw error;

        var dataArr = data.split(",");
        // console.log("data array: ", dataArr);

        userInput = dataArr[1];
        // console.log(userInput);

        //decides which function to run based on text file
        switch (dataArr[0].trim()) {
            case "my-tweets":
                myTweets();
                break;

            case "spotify-this-song":
                spotifySong(userInput);
                break;

            case "movie-this":
                movieThis(userInput);
                break;
        };

        log();
    });
};

//appends every node command in log.txt
function log(data) {
	fs.appendFile("log.txt", command + " " + userInput + "" + '\n', function(err) {
		//in case of an error: 
		if (err) {
			console.log("Error occured", err); 
		} else {
			// console.log("content added to file");
		}
	});
};
