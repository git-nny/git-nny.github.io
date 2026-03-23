
import { select, selectAll, scaleLinear, scalePoint, axisBottom, axisLeft, easeBack, pointer } from "d3";
import {op, loadCSV} from 'arquero'

// Good variables
const FILE = "./song_data.csv"
let REM = window.getComputedStyle(document.querySelector('body')).fontSize.slice(0,2)
let MARGIN = 2* REM
let HEIGTH = window.innerHeight - document.querySelector('#head').clientHeight - MARGIN
let WIDTH = window.innerWidth - 2*MARGIN
let SVG = select('#datavis').attr('height', HEIGTH).attr('width', WIDTH)
let VISWIDTH = [0, WIDTH - 4*MARGIN]
let VISHEIGHT = [0, HEIGTH - 2.5*MARGIN ]


// magic numbers TODO fix!
const xAxisTranslate = 5*REM;
const yAxisTranslate = 2 *REM
const MaxX = 800; 
const MaxY = 550; 

let AllCountries = ['','Albania', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Belarus', 'Belgium','Bulgaria', 'Croatia',
'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Israel', 'Italy',
'Latvia', 'Lithuania', 'Malta', 'Moldova', 'Netherlands', 'N. Macedonia', 'Norway', 'Poland', 'Portugal', 'Romania',
'Russia', 'San Marino', 'Serbia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom', ' ']; 
let NumTeilnehmer = 179+2;
const NumTeilnehmerArray = [];
const jitterWidth = 3;
const jitterWidth2 = -3;
let MedianIsVisible = true

//load data as table and get relevant participants since 2016
let data = await loadCSV(FILE)
data = data.filter( d => d.year >= 2016 ).filter( d => d.final_total_points !== null ).reify()

data = data
  .derive({ controversy: d => op.abs(d.final_televote_points - d.final_jury_points)})
  .orderby( 'controversy')
  .derive({rank: d => `${op.row_number()}` })
data = data.groupby('country')
  .derive({median_country: d => `${op.median(d.final_jury_points)}` })
data = data.ungroup()
data = data
  .derive({topten: d => d.final_place <= 10? 'topten': ''})


// getting an array of numbers for the scale Point Scale
for (let i = 0; i<=NumTeilnehmer; i++){
    NumTeilnehmerArray.push(`${i}`);
}

// setting up X and Y scales for linear and point modes
let yScale = scaleLinear()
    .domain([MaxY,0])
    .range(VISHEIGHT);
let yScaleS = scaleLinear() 
    .domain([260,0])
    .range(VISHEIGHT);

let xScale = scaleLinear()
    .domain([0, MaxX]) 
    .range(VISWIDTH);
let yScaleO = scaleLinear()
    .domain([MaxY,0])
    .range([0, HEIGTH - 5*REM ]);

let xScaleO = scalePoint() 
    .domain(AllCountries)
    .range(VISWIDTH); 

let xScaleS = scalePoint() 
    .domain (NumTeilnehmerArray)
    .range(VISWIDTH); 


//setting up X and Y axis for linear and point modes
  let x_axis = axisBottom()
      .scale(xScale)
      .tickSize((VISHEIGHT[1]));
  let x_axisS = axisBottom()
      .scale(xScaleS)
      .tickSize((VISHEIGHT[1]));
  let x_axisO = axisBottom()
      .scale(xScaleO)
      .tickSize(- (VISHEIGHT[1]));

  //Axis Y
  let y_axis = axisLeft()
      .scale(yScale)
      .tickSize(-(VISWIDTH[1]));
      
  let y_axisO = axisLeft()
      .scale(yScaleO)
      .tickSize(-(VISWIDTH[1]));
  let y_axisS = axisLeft()
      .scale(yScaleS)
      .tickSize(-(VISWIDTH[1]));

function clearAxis(){
  SVG.selectAll('#xaxis').remove();
  SVG.selectAll('#yaxis').remove();
}
function drawLinearAxis(){
  clearAxis()
  SVG.append('g')
    .attr('transform', `translate(${xAxisTranslate}, ${yAxisTranslate})`)
    .call(x_axis).attr('id', 'xaxis')

  SVG.append('g')
    .attr('id', 'yaxis')
    .attr('transform', `translate(${xAxisTranslate}, ${yAxisTranslate})`)
    .call(y_axis);
}

function drawControversyAxis(){
  clearAxis()
  SVG.append('g')
    .attr('transform', `translate(${xAxisTranslate}, ${yAxisTranslate})`)
    .call(x_axisS).attr("id","xaxis") // TODO Fix me?
  SVG.append('g')
    .attr('transform', `translate(${xAxisTranslate}, ${yAxisTranslate})`)
    .call(y_axisS).attr('id', 'yaxis')
}

function drawCountryAxis(){
  clearAxis()
  SVG.append('g')
    .call(x_axisO).attr("id","xaxis")
    .attr('transform', `translate(${xAxisTranslate}, ${VISHEIGHT[1] - yAxisTranslate})`)

  SVG.selectAll('#xaxis .tick text').attr("transform", 'translate(0,25)rotate(-45)');
  SVG.append('g')
    .attr('id', 'yaxis').call(y_axisO)
    .attr('transform', `translate(${xAxisTranslate}, ${yAxisTranslate - 4*REM})`)
}

//Text
SVG.append('text')
    .attr("class", "xlabel label")
        .attr("text-anchor", "end")
        .attr("x", WIDTH/2)
        .attr("y", HEIGTH-  REM )
        .text("Total Points");       
SVG.append("text")
        .attr("class", "ylabel label ")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", 2* REM)
        .attr("dy", "0")
        .attr('x', -HEIGTH/2)
        .text('Points per mode');

        
function resetModus(){
  selectAll('.connect')
    .attr('stroke-width', '2')
    .attr('visibility', 'visible')

  selectAll(".jury, .televote")
    .attr('opacity', 1)
    .attr('visibility', 'visible')

  document.getElementById('toggleMedian').classList.remove('active')
  exitMedian()
}
function drawInitialPlot(){
  drawLinearAxis()

  SVG.append('g')
  .attr('id', 'marks')
  .selectAll()
  .data(data)
  .enter()
  .append('line')
    .attr('class', (d) => {return 'y'+d.year + ' connect ' + d.topten })
    .attr('x1', function (d){return xScale(d.final_total_points);})
    .attr ('y1', function (d){return yScale(d.final_jury_points);})
    .attr('x2', function (d){return xScale(d.final_total_points);})
    .attr ('y2', function (d){return yScale(d.final_televote_points);})
    .attr('stroke-width', '2')

select('#marks')
  .selectAll()
  .data(data)
  .enter()
  .append('circle')
    .attr('class', (d) => {return 'y'+d.year + ' televote '+ d.topten})
    .attr("cx", function (d) { return xScale(d.final_total_points); } )
    .attr("cy", function (d) { return yScale(d.final_televote_points); } )
    .on('mouseover', (event, d) => startToolTip(d.year,d.country,d.artist_name, d.song_name))
    .on('mouseout', (event, d) => stopToolTip(d.country))

select('#marks')
  .selectAll()
  .data(data)
  .enter()
  .append('circle')
    .attr('class', (d) => {return 'y'+d.year + ' jury ' + d.topten })
    .attr("cx", function (d) { return xScale(d.final_total_points); } )
    .attr("cy", function (d) { return yScale(d.final_jury_points); } )
    .on('mouseover', (event, d) => startToolTip(d.year,d.country,d.artist_name, d.song_name))
    .on('mouseout', (event, d) => stopToolTip(d.country))

  select('#marks').attr('transform', `translate(${xAxisTranslate}, ${yAxisTranslate})`)
}
function plotTotalPoints (){
  drawLinearAxis()
  resetModus()
    
  SVG.selectAll('.jury').transition()
    .duration(800).ease(easeBack)
    .attr("cy", function (d) { return yScale(d.final_jury_points) } ) 
    .attr('cx', function(d) {return xScale(d.final_total_points)})
  
  SVG.selectAll('.televote').transition()
    .duration(800).ease(easeBack)
    .attr("cy", function (d) { return yScale(d.final_televote_points); } ) 
    .attr('cx', function(d) {return xScale(d.final_total_points)})

  SVG.selectAll('.connect').transition()
    .duration(800).ease(easeBack)
    .attr('visibility', 'visible')
    .attr('opacity', '1')
    .attr('x1', function (d) { return xScale( d.final_total_points)} )
    .attr('y1', function (d) {return yScale (d.final_jury_points)})
    .attr('x2', function (d) {return xScale( d.final_total_points)} )
    .attr('y2', (d) => yScale(d.final_televote_points))
    

  select('#marks').attr('transform', `translate(${xAxisTranslate}, ${yAxisTranslate})`)

  SVG.select('.xlabel').transition().text('Total Points');
  SVG.select('.ylabel').transition().text('Points per mode');
}
function plotDifference () {
  resetModus()
  drawControversyAxis()

  SVG.selectAll('.televote')
    .transition().duration(800).ease(easeBack)
    .attr('cy', yScaleS('0'))
    .attr('cx', function(d) {return xScaleS(d.rank)})
    .attr('visibility', 'hidden')

  SVG.selectAll('.jury')
    .transition().duration(800).ease(easeBack)
    .attr('cy', function (d) { return yScaleS( Math.abs(d.final_televote_points-d.final_jury_points))}) 
    .attr('cx', function(d) {return xScaleS ( d.rank)})
    .attr('visibility', 'hidden')

  SVG.selectAll('.connect')
    .transition().duration(800).ease(easeBack)
    .attr('visibility', 'visible')
    .attr('opacity', '1')
      .attr('x1', function (d) { return xScaleS(d.rank);} )
      .attr('y1', yScale('0'))
      .attr('x2', function (d) {return xScaleS( d.rank);} )
      .attr('y2', function(d) {return yScaleS( d.controversy)})
      .attr('stroke-width', '5')

    SVG.selectAll('.connect')
      .on('mouseover', (event, d) => startToolTip(d.year,d.country,d.artist_name, d.song_name))
      .on('mouseout', (event, d) => stopToolTip(d.country))

  select('#marks').attr('transform', `translate(${xAxisTranslate}, ${yAxisTranslate})`)

  SVG.selectAll('#xaxis .tick text').attr('opacity', '0');
  SVG.select('.xlabel').text('Controversy');
  SVG.select('.ylabel').text('Difference');

}
function plotCountry (){
  
  resetModus()
  document.getElementById('toggleMedian').classList.add('active')
  drawCountryAxis()
  showMedianPoints()
            
  SVG.selectAll('.connect').transition()
    .duration(800).ease(easeBack)
    .attr('opacity', '0').attr('visibility', 'hidden');

  SVG.selectAll('.jury')
    .transition().duration(800).ease(easeBack)
    .attr('cx', function(d){return xScaleO (d.country)+ xScaleO.bandwidth()/2 - Math.random()*jitterWidth})
    .attr('cy', function(d){return yScale (d.final_jury_points)})

  SVG.selectAll('.televote').transition().duration(800).ease(easeBack)
    .attr('cx', function(d){return xScaleO (d.country)+ xScaleO.bandwidth()/2 - Math.random()*jitterWidth2})
    .attr('cy', function(d){return yScale (d.final_televote_points)})

  select('#marks').attr('transform', `translate(${xAxisTranslate}, ${-2*REM})`)

  SVG.select('.xlabel').transition().text('Country');
  SVG.select('.ylabel').transition().text('Points per mode');
}
document.getElementById('toggleMedian').addEventListener('click', () => {
  if (document.querySelector('#rplotcountry:checked')){
    
    MedianIsVisible = !MedianIsVisible
    MedianIsVisible? showMedianPoints(): exitMedian()
  }
  
})
function showMedianPoints (){
  if (MedianIsVisible) {
    select('#marks')
    .selectAll()
    .data(data)
    .enter()
    .append('rect')
      .attr('class', 'median')
      .attr("x", function (d) { return (xScaleO(d.country) - REM*1.5/2); } )
      .attr("y", function (d) { return yScale(d.median_country); } )
      .attr('opacity', '1')
      .lower()
  }
  
}
function exitMedian(){
  selectAll('.median')
    .transition()
    .duration(200)
    .ease(easeBack)
    .attr('opacity', '0')
    .attr('display', 'none')
}

// Buttons + Functions
drawInitialPlot()
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
  selectAll('.y'+name)
    .style('display', 'none');
}

let showYear = function(name){
  selectAll('.y'+name)
  .style('display', 'block');
}


function toggleCheckbox (name, id) {
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

function startToolTip(year, country, artist_name, song_name){
  select("#tooltip").style('display', 'block');
  select("#country").html(country + ' ' + year );
  select('#artist').html(artist_name);
  select('#song').html(song_name); 
  selectAll('circle').transition().attr('r', '3').style('opacity', '.1');
  selectAll('.connect').transition().style('opacity', '.05');
  selectAll('.median').transition().style('opacity', '.05');
  selectAll('.y'+ year).transition().attr('r', '6').style('opacity', '1');
    //  select('#EV-flag-spez').attr('src', 'flags/1x1/' + country + '.SVG')
    
}  
function stopToolTip (year){
  select("#tooltip").style('display', 'none');
  selectAll('circle').transition().attr('r', '4').style('opacity','1');
  selectAll('.connect').transition().attr('r', '4').style('opacity','1');
  selectAll('.median').transition().style('opacity', '1');   
} 

stopToolTip(); 
let tooltip = select('#datavis')
    .on('mousemove', function(event){
        let coords = pointer(event);
        select("#tooltip").style('top', 50+coords[1]+"px")
                             .style('left', 45+ coords[0]+"px");
            })
