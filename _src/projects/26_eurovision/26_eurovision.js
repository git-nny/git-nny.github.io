import * as d3 from "d3"; // TODO: Only import what we actually need at the end
import * as aq from 'arquero'; // TODO: Only import what we actually need at the end
import {op} from 'arquero'

// Good variables
const FILE = "./song_data.csv"
let REM = window.getComputedStyle(document.querySelector('body')).fontSize.slice(0,2)
const MARGIN = 2* REM
const HEIGTH = window.innerHeight - document.querySelector('#head').clientHeight - MARGIN
const WIDTH = window.innerWidth - 2*MARGIN
const SVG = d3.select('#datavis').attr('height', HEIGTH).attr('width', WIDTH)


// magic numbers TODO fix!
const xAxisTranslate = HEIGTH - 3*REM;
const yAxisTranslate = 3 *REM
const xAxisTranslateO = HEIGTH - 25;
const MaxX = 800; 
const MaxY = 550; 

let AllCountries = ['','Albania', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Belarus', 'Belgium','Bulgaria', 'Croatia',
'Cyprus', 'Czechia', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Israel', 'Italy',
'Latvia', 'Lithuania', 'Malta', 'Moldova', 'Netherlands', 'N. Macedonia', 'Norway', 'Poland', 'Portugal', 'Romania',
'Russia', 'San Marino', 'Serbia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom', ' ']; 
let NumTeilnehmer = 179+2;
const NumTeilnehmerArray = [];
const jitterWidth = 3;
const jitterWidth2 = -3;

//load data as table and get relevant participants since 2016
let data = await aq.loadCSV(FILE)
data = data.filter( d => d.year >= 2016 ).filter( d => d.final_jury_points !== null ).reify()

data = data
  .derive({ controversy: d => op.abs(d.final_televote_points - d.final_jury_points)})
  .orderby( 'controversy')
  .derive({rank: d => `${op.row_number()}` })

// getting an array of numbers for the scale Point Scale
for (let i = 0; i<=NumTeilnehmer; i++){
    NumTeilnehmerArray.push(`${i}`);
}

// setting up X and Y scales for linear and point modes
let yScale = d3.scaleLinear()
    .domain([MaxY,0])
    .range([0, HEIGTH ]);
let yScaleS = d3.scaleLinear()
    .domain([260,0])
    .range([0, HEIGTH ]);

let xScale = d3.scaleLinear()
    .domain([0, MaxX]) 
    .range([0, WIDTH -  MARGIN]);

let xScaleO = d3.scalePoint()
    .domain(AllCountries)
    .range([0, WIDTH]); 

let xScaleS = d3.scalePoint()
    .domain (NumTeilnehmerArray)
    .range([0, WIDTH]); 


//setting up X and Y axis for linear and point modes
  let x_axis = d3.axisBottom()
      .scale(xScale)
      .tickSize(-HEIGTH);
      
  let x_axisS = d3.axisBottom()
      .scale(xScaleS)
      .tickSize(-HEIGTH);
  let x_axisO = d3.axisBottom()
      .scale(xScaleO)
      .tickSize(-HEIGTH);

  //Axis Y
  let y_axis = d3.axisLeft()
      .scale(yScale)
      .tickSize(-WIDTH + 3* MARGIN);
      
  let y_axisO = d3.axisLeft()
      .scale(yScale)
      .tickSize(-WIDTH);
  let y_axisS = d3.axisLeft()
      .scale(yScaleS)
      .tickSize(-WIDTH);

function clearAxis(){
  SVG.selectAll('#xaxis').remove();
  SVG.selectAll('#yaxis').remove();
}
function drawLinearAxis(){
  clearAxis()
  SVG.append('g')
    .attr('transform', `translate(${3*REM}, ${xAxisTranslate})`)
    .call(x_axis).attr('id', 'xaxis')

  SVG.append('g')
    .attr('id', 'yaxis')
    .attr('transform', `translate(${yAxisTranslate}, ${REM})`)
    .call(y_axis);
}

//Text
SVG.append('text')
    .attr("class", "xlabel label h2")
        .attr("text-anchor", "end")
        .attr("x", WIDTH/2)
        .attr("y", HEIGTH-10 )
        .text("Total Points");       
SVG.append("text")
        .attr("class", "ylabel label h2")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", 17)
        .attr("dy", "0")
        .attr('x', -HEIGTH/2)
        .text('Points per mode');

function drawInitialPlot(){
  drawLinearAxis()

  SVG.append('g')
  .attr('id', 'marks')
  .selectAll()
  .data(data)
  .enter()
  .append('line')
    .attr('class', (d) => {return 'y'+d.year + ' connect' })
    .attr('x1', function (d){return xScale(d.final_total_points);})
    .attr ('y1', function (d){return yScale(d.final_jury_points);})
    .attr('x2', function (d){return xScale(d.final_total_points);})
    .attr ('y2', function (d){return yScale(d.final_televote_points);})

d3.select('#marks')
  .selectAll()
  .data(data)
  .enter()
  .append('circle')
    .attr('class', (d) => {return 'y'+d.year + ' televote' })
    .attr("cx", function (d) { return xScale(d.final_total_points); } )
    .attr("cy", function (d) { return yScale(d.final_televote_points); } )

d3.select('#marks')
  .selectAll()
  .data(data)
  .enter()
  .append('circle')
    .attr('class', (d) => {return 'y'+d.year + ' jury' })
    .attr("cx", function (d) { return xScale(d.final_total_points); } )
    .attr("cy", function (d) { return yScale(d.final_jury_points); } )

  d3.select('#marks').attr('transform', `translate(${3*REM}, ${-yAxisTranslate})`)
}

drawInitialPlot()

function plotTotalPoints (){
  drawLinearAxis()
    
  SVG.selectAll('.jury').transition()
    .duration(800).ease(d3.easeBack)
    .attr("cy", function (d) { return yScale(d.final_jury_points) } ) 
    .attr('cx', function(d) {return xScale(d.final_total_points)})
  
  SVG.selectAll('.televote').transition()
    .duration(800).ease(d3.easeBack)
    .attr("cy", function (d) { return yScale(d.final_televote_points); } ) 
    .attr('cx', function(d) {return xScale(d.final_total_points)})

  SVG.selectAll('.connect').transition()
    .duration(800).ease(d3.easeBack)
    .attr('visibility', 'visible')
    .attr('opacity', '1')
    .attr('x1', function (d) { return xScale( d.final_total_points)} )
    .attr('y1', function (d) {return yScale (d.final_jury_points)})
    .attr('x2', function (d) {return xScale( d.final_total_points)} )
    .attr('y2', (d) => yScale(d.final_televote_points))


  SVG.select('.xlabel').transition().text('Total Points');
  SVG.select('.ylabel').transition().text('Points per mode');
}
function plotDifference () {
  clearAxis()
  SVG.append('g').attr("id","xaxis").attr('transform', 'translate(55,'+ xAxisTranslate +')').call(x_axisS); // TODO Fix me?
  SVG.append('g').attr('id', 'yaxis').attr('transform', 'translate(55,60)').call(y_axisS);

  SVG.selectAll('.televote')
    .transition().duration(800).ease(d3.easeBack)
    .attr('cy', yScaleS('0'))
    .attr('cx', function(d) {return xScaleS(d.rank)})

  SVG.selectAll('.jury')
    .transition().duration(800).ease(d3.easeBack)
    .attr('cy', function (d) { return yScaleS( Math.abs(d.final_televote_points-d.final_jury_points))}) 
    .attr('cx', function(d) {return xScaleS ( d.rank)})

  SVG.selectAll('.connect').transition().duration(800).ease(d3.easeBack)
    .attr('visibility', 'visible')
    .attr('opacity', '1')
      .attr('x1', function (d) { return xScaleS(d.rank);} )
      .attr('y1', yScale('0'))
      .attr('x2', function (d) {return xScaleS( d.rank);} )
      .attr('y2', function(d) {return yScaleS( d.controversy)})

  SVG.selectAll('.xaxis .tick text').attr('visibility', 'hidden');
  SVG.select('.xlabel').text('Controversy');
  SVG.select('.ylabel').text('Difference');

}
function plotCountry (){
  clearAxis()
  SVG.append('g').attr("id","xaxis").call(x_axisO);
  SVG.selectAll('#xaxis .tick text').attr("transform", 'translate(0,25)rotate(-45)');
  SVG.append('g').attr('id', 'yaxis').call(y_axisO);
            
  SVG.selectAll('.connect').transition()
    .duration(800).ease(d3.easeBack)
    .attr('opacity', '0').attr('visibility', 'hidden');

  SVG.selectAll('.jury')
    .transition().duration(800).ease(d3.easeBack)
    .attr('cx', function(d){return xScaleO (d.country)+ xScaleO.bandwidth()/2 - Math.random()*jitterWidth})
    .attr('cy', function(d){return yScale (d.final_jury_points)})

  SVG.selectAll('.televote').transition().duration(800).ease(d3.easeBack)
    .attr('cx', function(d){return xScaleO (d.country)+ xScaleO.bandwidth()/2 - Math.random()*jitterWidth2})
    .attr('cy', function(d){return yScale (d.final_televote_points)})

  SVG.select('.xlabel').transition().text('Country');
  SVG.select('.ylabel').transition().text('Points per mode');
}


// Buttons + Functions
function changePlot (id){
  if (id === 'rplottot'  ){
    plotTotalPoints()
  } else if  (id === 'rplotdif') {
    plotDifference()
  } else if (id == 'rplotcountry') {
    plotCountry()
  }
  
}

let hideYear = function(name){
  d3.selectAll('.y'+name)
    .style('display', 'none');
}

let showYear = function(name){
  d3.selectAll('.y'+name)
  .style('display', 'block');
}


function toggleCheckbox (name, id) {
  console.log(id)
  let checkBox = document.getElementById(id);
  if (checkBox.checked === true){
    showYear(name);
  } else {
    hideYear(name);
  }
} 

// add Button functionalities
for (let radio of document.querySelectorAll("input[type=radio]")) {
  radio.addEventListener('click', () => {changePlot(radio.id)})
}
for (let checkbox of document.querySelectorAll("input[type=checkbox]")) {
  checkbox.addEventListener('change', () => { toggleCheckbox(checkbox.name, checkbox.id) })
}




// function startToolTip(year, country, artist_name, song_name){
//      d3.select("#tooltip").style('display', 'block');
//      d3.select("#country").html(country + ' ' + year );
//      d3.select('#artist').html(artist_name);
//      d3.select('#song').html(song_name); 
//      d3.selectAll('circle').transition().attr('r', '3').style('opacity', '.1');
//      d3.selectAll('.connect').transition().style('opacity', '.05');
//      d3.selectAll('.y'+ year).transition().attr('r', '6').style('opacity', '1');
//     //  d3.select('#EV-flag-spez').attr('src', 'flags/1x1/' + country + '.SVG')
    
// }
    
    
// function stopToolTip (year){
//     d3.select("#tooltip").style('display', 'none');
//     d3.selectAll('circle').transition().attr('r', '4').style('opacity','1');
//     d3.selectAll('.connect').transition().attr('r', '4').style('opacity','1');
        
 
//      } 
        
// stopToolTip(); 
  
//     let tooltip = d3.select('#datavis')
//     .on('mousemove', function(event){
//         let coords = d3.pointer(event);
//         d3.select("#tooltip").style('top', 50+coords[1]+"px")
//                              .style('left', 45+ coords[0]+"px");
//             })

  


  


// all scales and stuff
// let xScale = d3.scaleLinear()
//     .domain([0, 800]) 
//     .range([0, WIDTH/2]);
// let yScale = d3.scaleLinear()
//     .domain([500,0])
//     .range([0, 500]);

// let x_axis = d3.axisBottom()
//     .scale(xScale)
// SVG.append('g')
//     .attr('transform', 'translate(55,'+ xAxisTranslate + ')')
//     .call(x_axis).attr('class', 'xaxis')

// let y_axis = d3.axisLeft()
//     .scale(yScale)
//     SVG.append('g')
//     .attr('id', 'yaxis')
//     .attr('transform', 'translate(55,'+ xAxisTranslate + ')')
//     .call(y_axis);

// // 

// function controversy (){
//   console.log(data.columnNames())
//   //get max value of column
  
// }