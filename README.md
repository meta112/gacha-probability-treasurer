# Gacha Probability Treasurer - genshin

> Discord Bot tool for tracking in-game currency and running simulations to determine statistical odds
of rolling your desired characters in Genshin Impact. Also known as GPT-g (not to be confused with OpenAI's GPT-9, which will probably render humans irrelevant by 2030)



## Introduction

As a free-to-play player who wants to get all my favourite characters without having to pay absurd amounts of money for more primogems, I have to manage what few resources I have available. This bot was designed to help plan ahead, tracking future goals and savings, to estimate probability of rolling desired limited 5-Stars. <br>
While other softwares exist for calculating probability rates given a number of rolls as an input, they lack personalization (storing and tracking the user's specific wish list) and do not consider planning for characters releasing on different dates. As an arbitrary example, if one were to expect the Pyro Archon to release in Version 5.2 and Ayaka to rerun in Version 5.3, GPT-g can factor in the expected number of wishes gained between versions, combined with your current resources, to predict success rate in rolling both targets. <br>
In the future, may add more automation to the general setup process/checking versions and include support for weapon banners. <br>
Implemented using the Node.js module discord.js and SQLite through the ORM sequelize.

## Installation and Setup (WIP)

## How to use
After getting the bot set up on your server, use the following slash commands:
- `/setwishes`: Input the number of wishes you have from various sources of in-game currency, as well as pity build up. <br>
![Entering number of wishes](/images/setwishes.png)
- `/defineversion`: Set the release date for each version that you plan to roll in.
- `/addchar`: Add characters that you plan to roll for (note that a "version change" would be the beginning of a new version e.g. if it is currently 4.0, then 4.2 is 2 versions away). <br>
![Entering a new character](/images/addchar.png)
- `/calculate`: Run simulations to predict success rates. <br>
![Probabilities](/images/calculate.png)

## Other commands
- `/viewme`: Show current wish amount.
- `/versionlist`: Show all version release dates defined.
- `/setprofile`: Choose a different wishlist between 1 - 3 to edit.
- `/copylist`: Copy one wishlist into another.
- `/editchar`: Edit the details of a character planned to wish for.
- `/removeversion`: Delete a version definition.
- `/removechar`: Delete a character from the wishlist.

