import {csv} from "d3";
import { loadCSV } from 'arquero';

const file = "./song_data.csv"

// load data as table
let data = await loadCSV(file)
// separate off all countries that participated in the finale since 2016
data = data.filter( d => d.year >= 2016 ).filter( d => d.final_jury_points !== null ).reify()

console.log(data)

// Vis 1: full vis -> cleveland plot
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