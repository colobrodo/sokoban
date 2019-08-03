# sokoban

Simple clone of sokoban game written in typescript

## Table of contents

- [sokoban](#sokoban)
  - [Table of contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Getting started](#getting-started)
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

Then head into the browser and type `localhost:8080` to play Sokoban! :tada:

## Screenshot

<center>
  <img src="https://raw.githubusercontent.com/colobwoy/sokoban/master/img/screen.PNG" />
</center>
