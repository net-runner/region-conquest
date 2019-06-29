# Region Conquest

A JavaScript 2-man multiplayer game about conquering zones. Created with tree.js, socket.io and mongo-db.

## Features

Real time communication and decision making. Supports large amount of 2 man lobbies simultaneously and player reconnection.  

If MongoDB is present and running on local machine enables user registration, login and storing game related statistics.

## How to play?

Just move around using [`W`][`A`][`S`][`D`] and every small amount of time you will generate points in region where you are standing. The rest of game mechanics is for you to discover.

## How to run?

1. Install node.js if you havent already.
2. Open command line inside game folder
3. Type node server.js
4. Have fun

## Config
[server_config.json](/config/server_config.json)
The configuration file stores some important `constants` and could be used to easy configure game experience.

`interval` - defines how often server computes and sends data [`ms`]  
`gameTime` - how long does one match lasts                    [`s`]   
`capacity` - defines maximum points in default region  
`globalExpansionDivider` - represents a number used in dividing expansion points    

## Authors
@net-runner && @tomec