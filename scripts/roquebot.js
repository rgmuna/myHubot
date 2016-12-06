var WIKI_API_URL, WIKI_EN_URL, createURL, wikiRequest;
WIKI_API_URL = "https://en.wikipedia.org/w/api.php";
WIKI_EN_URL = "https://en.wikipedia.org/wiki";

module.exports = function(robot){

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
robot.hear(/compliment me/i, function(msg){
  var compliments = [
    "You're looking great today!",
    "Hey there good-lookin'!",
    "You so fine you blow my mind!",
    "No.",
    "I wish I could."
  ];
  var complNum = Math.floor(Math.random()*compliments.length);
  msg.send(compliments[complNum]);
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
