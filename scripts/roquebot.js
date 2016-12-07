var WIKI_API_URL, WIKI_EN_URL, createURL, wikiRequest;
WIKI_API_URL = "https://en.wikipedia.org/w/api.php";
WIKI_EN_URL = "https://en.wikipedia.org/wiki";

var numTurns = 0;
var ranNum = 0;
var playingGame = 0;

module.exports = function(robot){

//returns what hubot is capable of
  robot.hear(/what can you do\s?\?/i, function(msg){
    msg.send("I can do a number of things, including:" + '\n' +
              "cmd: is class over?     result: how much time is left in class" + '\n' +
              "cmd: compliment me      result: will probably send a compliment" + '\n' +
              "cmd: wiki search ____   result: will return a wiki search" + '\n' +
              "cmd: wiki summary ____  result: will return a summary of a wiki article" + '\n' +
              "cmd: play game          result: starts a number guessing game"
            )
  })
//hubot guess the number game intro
  robot.hear(/play game/i, function(msg){
    numTurns = 0;
    playingGame = 1;
    ranNum = Math.ceil(Math.random()*10);
    msg.send("Welcome to my number guessing game! " + '\n' + '\n' +
            "See how long it takes you to guess my number between 1 and 10." + '\n' + '\n' +
            "Respond by saying 'I guess number (number)' and I'll tell you if you're correct." + '\n' + '\n' +
            "If you ever want to restart, just say 'Play Game'. Let's play!" + '\n' + '\n' +
            "Start with:  'I guess number ___' ");

  })
//hubot guess the number gameplay
  robot.hear(/I guess number (.*)/i, function(msg){
    numGuess = msg.match[1];
    var a = parseInt(numGuess);

    if(playingGame === 0){
      msg.send("You haven't started a game yet!");
    }
    else if(a > 10 || a < 1){
      msg.send("Guess a number between 1 and 10!");
      return numTurns += 1;
    }
    else if(a === ranNum){
      numTurns += 1;
      msg.send("You guessed it! It took you " + numTurns + " turns.");
      return playingGame = 0;
    }
    else{
      msg.send(a + " is WRONG! Guess again!");
      return numTurns += 1;
    }
  })

//Is class over hubot
  robot.hear(/is class over\s?\?/i, function(msg){
      var time = new Date();
      var hoursLeft = 22-time.getHours();
      var minutesLeft = 60-time.getMinutes();

      if(time.getDay() === 2 || time.getDay() === 4){           //if the day is tuesday or thursday
        if(time.getHours() < 19){                               //if it's before class time on the day of class
          msg.send("Class hasn't started yet!");
        }
        else if(time.getHours() >= 22){                          //if it's after class time on day of class
          msg.send("Class is over today!");
        }
        else {                                                  //if it's during class time
          msg.send("Nope, " + hoursLeft + " hours and " + minutesLeft + " minutes left.");
        }
      }
    else{                                                       //if it's not a class day
      msg.send("No class today!");
    }
})

//compliment hubot
robot.respond(/compliment me/i, function(msg){
  var compliments = [
    "You're looking great today!",
    "Hey there good-lookin'!",
    "You so fine you blow my mind!",
    "No.",
    "I wish I could."
  ];
  msg.send(msg.random(compliments));


})



//wiki hubot
  robot.respond(/wiki search (.+)/i, {
    id: "wikipedia.search"
  }, function(res) {
    var params, search;
    search = res.match[1].trim();
    params = {
      action: "opensearch",
      format: "json",
      limit: 5,
      search: search
    };
    return wikiRequest(res, params, function(object) {
      var article, _i, _len, _ref, _results;
      if (object[1].length === 0) {
        res.reply("No articles were found using search query: \"" + search + "\". Try a different query.");
        return;
      }
      _ref = object[1];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        article = _ref[_i];
        _results.push(res.send("" + article + ": " + (createURL(article))));
      }
      return _results;
    });
  });
  return robot.respond(/wiki summary (.+)/i, {
    id: "wikipedia.summary"
  }, function(res) {
    var params, target;
    target = res.match[1].trim();
    params = {
      action: "query",
      exintro: true,
      explaintext: true,
      format: "json",
      redirects: true,
      prop: "extracts",
      titles: target
    };
    return wikiRequest(res, params, function(object) {
      var article, id, summary, _ref;
      _ref = object.query.pages;
      for (id in _ref) {
        article = _ref[id];
        if (id === "-1") {
          res.reply("The article you have entered (\"" + target + "\") does not exist. Try a different article.");
          return;
        }
        if (article.extract === "") {
          summary = "No summary available";
        } else {
          summary = article.extract.split(". ").slice(0, 2).join(". ");
        }
        res.send("" + article.title + ": " + summary + ".");
        res.reply("Original article: " + (createURL(article.title)));
        return;
      }
    });
  });
};
createURL = function(title) {
  return "" + WIKI_EN_URL + "/" + (encodeURIComponent(title));
};
wikiRequest = function(res, params, handler) {
  if (params == null) {
    params = {};
  }
  return res.http(WIKI_API_URL).query(params).get()(function(err, httpRes, body) {
    if (err) {
      res.reply("An error occurred while attempting to process your request: " + err);
      return robot.logger.error(err);
    }
    return handler(JSON.parse(body));
  });

//must include a .respond

}
