---
title: Visual Analytics I
tags: 
  - casestudy
TLDR: Measuring controversy at the Eurovision Song Contest
time: Summerterm 2023
for: Visual Analytics by Kay Schroeder
field: ["Data Visualisation", "D3.js", "Frontend" ]
status: Read Now
layout: case_study.njk
---

## TLDR
- The Eurovision Song Contest is planned as an international, apolitical exchange and celebration of (mostly pop) music, bringing acts from selected members of the European Broadcasting Union (and Australia).
- The year is 2023, and rating artistic acts is inherently difficult. The split between a public and professional vote had just caused a small controversy. This project explores how often the national juries and televote think alike.
- The project is written in HTML, CSS and JavaScript (using d3.js), which I taught myself in a few weeks during the building process. 
- This page is currently under rework - a 2026 version is planned.
## Concept
The Eurovision Song Contest has a long history of bringing people together, both in the arena and at home in front of the TV screen. Just as long is the history of its controversies - and it regularly includes the voting system. Since the last rule change in 2016, the winner is decided by two sets between _null_ and _douze_ points by a jury of industry professionals and a televote by regular people at home. In 2023, the discussion de jour centred on this separation, as both votes diverged between front runners Loreen and Käärijä. I had not been personally involved before, so I wondered how regularly that happens and centred my visualisation on it.

## Data 
As the base for the project, the dataset  [Eurovision Song Contest Data](https://www.kaggle.com/datasets/diamondsnake/eurovision-song-contest-data) by Kaggle user ODI6S was used. To reduce the scope, I focused on continuous years with similar rules set, starting at the current year (2016 - 2023) to compare jury and televote that had happened under comparable systems.
As the original data set had not yet been updated to include the 2023 points, the set was augmented using a short Python script using Beautiful Soup.
{% image "../_assets/img/26_ESC_Design.png", "High Res prototype, made in Adobe XD", "Prototype for the Visualisation, using the ESC branding" %}

## Design and Mapping
The design is purposefully kept simple and minimal, staying close to the colours of the [eurovision.com](http://eurovision.com) site for the 2023 season. The interface includes toggle buttons to add and remove specific years and 3 modes to sort the data by: _Total Points_ presents an overview, mapping votes per set against the total number of votes, while _Controversy_ makes it very clear that the people at home and the jury often have different tastes. Finally, _Year_ presents the dots in comparison to other years for each country, giving some hints which countries (Sweden) know how to play the jury and which countries consistently rate so low the Vis needed dither on the X-axis so the nul points do not overlap.  
Both votes for each act are represented by a filled or unfilled circle, while the line encodes the difference between both values. Later, I would learn that this visualisation is called a Cleveland Chart, a subtype of the lollipop plot with two groups.
When hovered over, all acts of the active year are highlighted to make comparison easier.

{% image "../_assets/img/26_ESC_Total.png", "Cleveland Plot Chart of the Results of the ESC 2016-2023"  %}
{% image "../_assets/img/26_ESC_Controversy.png", "Cleveland Plot Chart, rating the Results of the ESC 2016-2023 by controversy from left to right"  %}
{% image "../_assets/img/26_ESC_Country.png", "Results of the ESC plotted by country"  %}

## Development Delights
It needs to be said that I had no real coding experience prior to this project, and teaching us how to code was not a key objective of the course. I was operating from the general understanding that this is not a thing that I could be any good at, but learning about data visualisation and perception was just interesting enough for me to give it a chance. Within a few weeks, I taught myself the foundations of HTML, CSS and enough JavaScript to build a project that not only works, but builds on the prrof of concept sketch. The visualisation part is carried by D3.js, a library that offers full freedom to create dynamic, interactive SVGs. Additionally, Beautiful Soup was used to add the missing 2023 data that was considered essential to the success of the project.  
I cannot understate how little I knew and how determined I was to make it work - I barely knew enough JavaScript to console.log my way through, and I had no idea what a pip was or that I had to install Python first back then. Still, after it was finished, it was clear that this was the thing I wanted to do.  
The original code was never uploaded anywhere and subjected to the information is beautiful awards for the category Arts, Entertainment and Culture with screenshots and videos (and it made the shortlist!).

*A 2026 rework is currently queued, improving on the original code, responsiveness, and bringing in new insights from my data science studies.*