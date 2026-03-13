import * as d3 from "d3";
//import {select, selectAll} from "d3";
import { loadCSV, op } from 'arquero';
//import {scroller} from './scroller.js';

const FILE = "./song_data.csv"
const HEIGTH = window.innerHeight
const WIDTH = window.innerWidth

const xAxisTranslate = 10

// load data as table
let data = await loadCSV(FILE)
// separate off all countries that participated in the finale since 2016
data = data.filter( d => d.year >= 2016 ).filter( d => d.final_jury_points !== null ).reify()


// console.log(data)
const svg = d3.select('#datavis').attr('height', HEIGTH).attr('width', WIDTH)


// all scales and stuff
let xScale = d3.scaleLinear()
    .domain([0, 800]) 
    .range([0, WIDTH/2]);
let yScale = d3.scaleLinear()
    .domain([500,0])
    .range([0, 500]);

let x_axis = d3.axisBottom()
    .scale(xScale)
svg.append('g')
    .attr('transform', 'translate(55,'+ xAxisTranslate + ')')
    .call(x_axis).attr('class', 'xaxis')

let y_axis = d3.axisLeft()
    .scale(yScale)
    svg.append('g')
    .attr('id', 'yaxis')
    .attr('transform', 'translate(55,'+ xAxisTranslate + ')')
    .call(y_axis);

// 
function drawClevelandPlot(){
  svg.append('g')
  .attr('id', 'marks')
  .selectAll()
  .data(data)
  .enter()
  .append('line')
  .attr('x1', function (d){return xScale(d.final_total_points);})
  .attr ('y1', function (d){return yScale(d.final_jury_points);})
  .attr('x2', function (d){return xScale(d.final_total_points);})
  .attr ('y2', function (d){return yScale(d.final_televote_points);})
  .style('stroke-width', 1.5);
  

d3.select('#marks')
  .selectAll()
  .data(data)
  .enter()
  .append('circle')
    .attr('class', 'televote')
    .attr("cx", function (d) { return xScale(d.final_total_points); } )
    .attr("cy", function (d) { return yScale(d.final_televote_points); } )
    .attr("r", 4)

d3.select('#marks')
  .selectAll()
  .data(data)
  .enter()
  .append('circle')
    .attr('class', 'jury')
    .attr("cx", function (d) { return xScale(d.final_total_points); } )
    .attr("cy", function (d) { return yScale(d.final_jury_points); } )
    .attr("r", 4)
}
function controversy (){
  console.log(data.columnNames())
  //get max value of column
  
}


drawClevelandPlot()
controversy()





// Vis 2: controversy + check separate quartiles
// Vis 3: Check Country/Genre/prequalified vs. qualifier





/* So--- what changed?
full data set!
using arquero (I miss u, pandas) for data manipulation instead of some of the stuff I did in 2023 with d3 and a dream
this could be object oriented? maybe?
collections of sins:
  - actually, <300 lines is not too bad - still, a lot of redundancy
  - hardcoded all country names
*/