# sokoban

Simple clone of sokoban game written in typescript

## Table of contents

- [sokoban](#sokoban)
  - [Table of contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Getting started](#getting-started)
  - [Modify levels](#modify-levels)
  - [Screenshot](#screenshot)

## Prerequisites

- [Typescript](https://www.typescriptlang.org/) installed
- A browser to run the game (Chrome/Firefox recommended)
- A simple Web Server, I use the python http module but you can use whatever you want! 
  - [Python/Python3](https://www.python.org/downloads/) 

## Getting started

In order to run the game, first clone the repository and enter the folder:

    git clone https://github.com/colobwoy/sokoban.git
    cd sokoban

Then run the Typescript compiler:

    tsc main.ts

And start a webserver in the folder!
  For example if you are using python like me:

    python -m SimpleHTTPServer 8080
    python3 -m http.server 8080 #if you have python3

Then head into the browser and type `localhost:8080#level_name` to play Sokoban! :tada:

## Modify levels

If you want to add, modify or delete some levels you need to edit the `levels.json` file.
The file is a list of `"level_name": "level_data"`, key value pair in json format.
The level data is encoded according to [this](http://www.sokobano.de/wiki/index.php?title=Level_format) encoding.

  Note: you need to put \n instead of the new line in the middle of level data cause the spec of json format doesn't support them ( [json format](https://www.json.org/))

## Screenshot

<center>
  <img src="https://raw.githubusercontent.com/colobwoy/sokoban/master/img/screen.PNG" />
</center>
