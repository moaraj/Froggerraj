const companies= [
  {name: "Company One", category: "Finance", start: 1981, end: 2004},
  {name: "Company Two", category: "Retail", start: 1992, end: 2008},
  {name: "Company Three", category: "Auto", start: 1999, end: 2007},
  {name: "Company Four", category: "Retail", start: 1989, end: 2010},
  {name: "Company Five", category: "Technology", start: 2009, end: 2014},
  {name: "Company Six", category: "Finance", start: 1987, end: 2010},
  {name: "Company Seven", category: "Auto", start: 1986, end: 1996},
  {name: "Company Eight", category: "Technology", start: 2011, end: 2016},
  {name: "Company Nine", category: "Retail", start: 1981, end: 1989}
];

const ages = [33, 12, 20, 16, 5, 54, 21, 44, 61, 13, 15, 45, 25, 64, 32];

// forEach
// filter
// map
// sort
// reduce

// for (let index = 0; index < companies.length; index++) {
//     console.log(companies[index])
// };

// companies.forEach(function(company){
//   console.log(company)
// })

// let canDrink = [];
// for (let index = 0; index < ages.length; index++) {
//   if (ages[index] >= 21 ) {
//     canDrink.push(ages[index])
//   }
// }
// console.log(canDrink);


// const canDrink = ages.filter(function(age){
//   if(age>= 21) return true
// })

const canDrink = ages.filter(age => age >= 21);
console.log(canDrink);

// Filter retial companies

let retailCompanies = companies.filter(function(company) {
  if(company.category === 'Retail') return true
});

retailCompanies = companies.filter(company => company.category === 'Retail');
retailCompanies = companies.filter(company => company.category === 'Retail');
console.log(retailCompanies);

companies80 = companies.filter(company => company.start >= 1980 & company.start < 1990);
console.log(companies80);

companiesLastedDecade = companies.filter(company => (company.end - company.start) >= 10 );
console.log(companiesLastedDecade)

// map
// create arary of company names
let companyNames = companies.map(function(company){
  return `${company.name} [${company.start} - ${company.end}]`;
})

companyNames = companies.map(company =>
  `${company.name} [${company.start} - ${company.end}]`)

  console.log(companyNames);

const agesSquared = ages.map(age => Math.sqrt(age));
console.log(agesSquared);

const agesSquaredTimesTwo = ages
  .map(age => Math.sqrt(age))
  .map(age => age * 2)
  console.log(agesSquaredTimesTwo);


// const sortedCompanies = companies.sort(function(c1, c2){
//     if(c1.start > c2.start) {return 1
//     } else { return - 1 }
//   });

  
  //  Use a turnary operator
const sortedCompanies = companies.sort((a, b) => (a.start > b.start ? 1 : -1))
console.log(sortedCompanies);

// Sort Ages 
const sortedAges = ages.sort((a,b) => (b - a))
console.log(sortedAges);

// get total Age sum with reduc 

// const ageSum = ages.reduce(function(total, age){
//   return total + age;
// }, 0);

const ageSum = ages.reduce((total,age) => total + age)
console.log(ageSum);

