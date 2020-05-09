var random_util = require("./util/random_util");


console.log(random_util.randomInt(10));

var xxx = [0,1,2,3,4,5,6,7,8,9]

for (let i = 10 - 1; i > 0; i--) {
    let lastIdx = i;
    let changeIdx = Math.floor(Math.random()*lastIdx);
    let t = xxx[lastIdx];
    xxx[lastIdx] = xxx[changeIdx];
    xxx[changeIdx] = t;
}

console.log(xxx);
