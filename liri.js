const result = require("dotenv").config();
const keys = require("./keys");
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const request = require("request");
const fs = require("fs");

let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);

//user input
let command = process.argv[2];
let input = process.argv[3];

//switch statements

switch (command) {
    case 'my-tweets':
        myTweets();
        break;
    case 'spotify-this-song':
        mySong();
        break;
    case 'movie-this':
        myMovie();
        break;
    case 'do-what-it-says':
        doIt()
        break;
    default:
        console.log("NOT RIGHT");
}

//my tweets function

function myTweets() {
    let params = {
        screen_name: 'enriquealopez',
        count: 20
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            console.log("error" + error);
        } else {
            tweets.forEach(function (tweets) {
                console.log(`Tweet: ${tweets.text}`)
                console.log(`Created on: ${tweets.created_at}`)
                //append to the log
                fs.appendFile("log.txt", JSON.stringify(tweets.text + tweets.created_at, null, 2), function (error) {
                    if (error) {
                        console.log(error);
                    }
                });
            });

        }
    });

}

//my song function

function mySong() {

    if (!input) {
        input = 'The Sign'
    }

    spotify.search({
        type: 'track',
        query: input
    }, function (err, data, response) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(`Artist: ${data.tracks.items[0].artists[0].name}`)
        console.log(`Song: ${data.tracks.items[0].name}`)
        console.log(`Preview: ${data.tracks.items[0].album.external_urls.spotify}`)
        console.log(`Album: ${data.tracks.items[0].album.name}`)
    });
}

//movie this function

function myMovie() {

    if (!input) {
        input = 'Mr. Nobody'
    }

    let queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        if (error) {
            return console.log('Error:' + error)
        }
        console.log('Title: ' + JSON.parse(body).Title)
        console.log('Year Released: ' + JSON.parse(body).Year)
        console.log('IMBD Rating: ' + JSON.parse(body).Ratings[0].Value)
        console.log('RT Rating: ' + JSON.parse(body).Ratings[1].Value)
        console.log('Country: ' + JSON.parse(body).Country)
        console.log('Language: ' + JSON.parse(body).Language)
        console.log('Plot: ' + JSON.parse(body).Plot)
        console.log('Actors: ' + JSON.parse(body).Actors)

    });
}


//do what it says

function doIt() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
            dataArr = data.split(",");
            //console.log(dataArr[0])
            //console.log(dataArr[1])

            mySong(dataArr[0], dataArr[1]);
            //myTweets(dataArr[0])
            //myMovie(dataArr[0],dataArr[1])

            //the function will work for each commmand when uncommented
                   
    })
}