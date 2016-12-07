————
To be able to use the wiki function:

1. Install the hubot-wikipedia module as a Hubot dependency by running:
    npm install --save hubot-wikipedia

2. Enable the module by adding the hubot-wikipedia entry to your external-scripts.json file:
  [
      "hubot-wikipedia"
  ]

(src: https://github.com/ClaudeBot/hubot-wikipedia)
—————

roquebot can respond to 6 different things:


command 1: “what can you do?”
response: replies with the various features of roquebot

command 2: “play game”
response: provides an intro to a game you can play with roquebot in slack and gives your the instructions for playing the game

command 3: “I guess number ___”
response: if you’ve initialized the game using the previous command, roquebot will say whether the guess is correct or not. It will also indicate if the guess is out of bounds OR if the game needs to be initialized.

command 4: “is class over?”
response: replies with the number of hours and minutes left in class. It will also indicate if the it’s not a class day, or if it’s after or before class.

command 5: “compliment me”
response: randomly replies with one of five different compliments (or non compliments)

command 6: “wiki search ___”
response: responds with all the wiki articles that include that particular word

command 7: “wiki summary _____”
response: responds with a summary of the article at  https://en.wikipedia.org/wiki/(insert chosen word)

	