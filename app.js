var express = require('./node_modules/express');
var https = require('https');
var app = express();
var loremIpsum   = require('lorem-ipsum'),
    output       = loremIpsum();

var photos       =    ["https://upload.wikimedia.org/wikipedia/commons/6/65/Kruse_CNDLS_Profile.png",
                       "http://iv1.lisimg.com/image/1812641/500full-dean-o'gorman.jpg",
                       "http://indiabright.com/wp-content/uploads/2015/11/profile_picture_by_kyo_tux-d4hrimy.png",
                       "http://www.google.com/intl/it_ALL/+/images/learnmore/hero/hero-profile.jpg",
                       "https://www.cheme.cornell.edu/engineering2/customcf/iws_ai_faculty_display/ai_images/caa238-profile.jpg",
                       "http://i2.cdn.turner.com/cnnnext/dam/assets/140926165711-john-sutter-profile-image-large-169.jpg",
                       "http://zblogged.com/wp-content/uploads/2015/11/5.png",
                       "http://zblogged.com/wp-content/uploads/2015/11/17.jpg"];

var firstNames   =    ["Dorla", "Carlyn", "Jude","Suk","Sherrill","Alycia","Shaquita","Luigi","Kennith","Sanora"];
var lastNames    =    ["Clark","Coleman","Hart","McGrath","Watson","Peters","McDonald","Hardacre","Terry","Duncan"];
var transports   =    ["bus", "plane", "ship", "car", "train"];
var cities       =    ["NYC, New York, NY, USA", "MOW, Moscow, Russia", "IEV, Kiev, Ukraine", "LAX, Los Angeles, CA, USA", "OPO, Porto, Portugal"];


var currency     =    ["dollar", "euro", "ruble", "pound"];
var phoneNumbers =   ["(811) 609-8411",
                      "(844) 181-9242",
                      "(855) 289-1617",
                      "(844) 282-5585",
                      "(855) 940-4628",
                      "(822) 197-3495",
                      "(822) 858-4768",
                      "(811) 414-0002",
                      "(811) 423-1419",
                      "(833) 169-6543"]

    
app.get("/login", function(req, res){
    var login = {"user": {}, "newsFeed": genNewsFeed()};
    res.send(login);
});

app.get("/feed", function(req, res){
    var feed = {"newsFeed" : genNewsFeed()};
    res.send(feed);
});

app.get("/profile", function (req, res) {
    var profile = {"profile" : genProfileWithReviews()};
    res.send(profile);
});


app.get("/getCountryInfo", function (req, res) {

    var options = {
        host :  'restcountries.eu',
        port : 443,
        path : '/rest/v1/name/' + req.query.country,
        method : 'GET'
    }

    getCall(options, function(response) {
        response.on('data', function (data) {
            var obj = {"countryInfo" : JSON.parse(data)[0]};
            console.log(obj)
            res.send(obj);
        });
    });
});

function getCall(opt, callback) {

    var getReq = https.request(opt, callback);

    getReq.end();
    getReq.on('error', function(err){
        console.log(err);
    });
}


function getRandomFloat(min, max){

  var floatNumber = (Math.random() * (max - min + 1) + min).toFixed(1);
  return ( floatNumber > 5) ? 5 : floatNumber;
}

function getRandomInt(min, max){

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genNewsFeed(){
  return {"feed": genFeed()};
}

function genFeed(){

  var feedArr = [];
  var count = getRandomInt(5, 15);
  for(var i = 0; i < count; i++){
      feedArr[i] = genFeedItem();
  }
  return feedArr;
}

function genFeedItem(){

  return {
          "id": genId(),
          "photo": genPhoto(),
          "fisrtName": genFirstName(),
          "lastName": genLastName(),
          "phoneNumber": genPhoneNumber(),
          "gender": getRandomInt(14,32),
          "transport": genTransport(),
          "trip": genTrip(),
          "rating": genRating(),
          "pack": genPack(),
          "requiredAmount": genRequiredAmount()
          }
}

function genId(){

  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 16; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function genPhoto(){
  return photos[getRandomInt(0,7)];
}

function genFirstName(){
  return firstNames[getRandomInt(0,9)];
}

function genLastName(){
  return lastNames[getRandomInt(0,9)];
}

function genPhoneNumber(){
  return phoneNumbers[getRandomInt(0,9)];
}

function genTransport(){
  return transports[getRandomInt(0,4)];
}

function genTrip(){

  var from = genLocationInfo();
  var to = genLocationInfo();
  var by = [];

  for (var i = 0; i < getRandomInt(0,2); i++){
        by[i] = genLocationInfo();
  }

  return {"from" : from, "by" : by, "to" : to};
}

function genLocationInfo(){

  return {"city": cities[getRandomInt(0,4)], "time": getCurrentDateInMill()};
}

function genRating(){
  return {"avg" : getRandomFloat(0,5), "rateCount" : getRandomInt(0, 100)};
}

function genPack(){
  return {"weight" : getRandomInt(0,30)};
}

function genRequiredAmount(){
  return {"amount": getRandomInt(20,60), "currency": currency[getRandomInt(0,3)]};
}

function getCurrentDateInMill(){
  return new Date().getTime();
}

function genProfileWithReviews(){
  return {
          "id" : genId(),
          "firstName" : genFirstName(),
          "lastName" : genLastName(),
          "photo" : genPhoto(),
          "rate" : getRandomFloat(0,5),
          "success" : getRandomInt(10,200),
          "fail" : getRandomInt(10,200),
          "reviews" : genReviews()
          }
}

function genReviews(){
  var count = getRandomInt(5,15);
  var reviews = [];

  for(var i = 0; i < count; i++){
      reviews[i] = genReview();
  }
  return reviews;
}

function genReview(){
  return {
          "id" : genId(),
          "firstName" : genFirstName(),
          "lastName" : genLastName(),
          "photo" : genPhoto(),
          "review" : genText(),
          "rate" : getRandomFloat(0,5),
          "date" : getCurrentDateInMill()
          }
}

function genText(){
  return loremIpsum({
                    count: 1,                        // Number of words, sentences, or paragraphs to generate.
                    units: 'sentences',            // Generate words, sentences, or paragraphs.
                    sentenceLowerBound: 5,         // Minimum words per sentence.
                    sentenceUpperBound: 15,        // Maximum words per sentence.
                    paragraphLowerBound: 3,        // Minimum sentences per paragraph.
                    paragraphUpperBound: 7,        // Maximum sentences per paragraph.
                    format: 'plain',               // Plain text or html
                    random: Math.random           // A PRNG function. Uses Math.random by default
                    });
}


app.listen(3000,function(){
  console.log("server is running");
});





