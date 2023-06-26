'use strict';

const fs = require('node:fs');
const readline = require('node:readline');

const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs });

const popuMap = new Map();
rl.on('line', lineString =>{
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);

    let value = {}
    if (year === 2016 || year === 2021) {
        if (popuMap.has(prefecture)) {
            value = popuMap.get(prefecture);
        } else {
            value = {
                before: null,
                after: null,
                change: null,
            }
        }
        if (year === 2016) {
            value.before = popu;
        } else {
            value.after = popu;
        }
        popuMap.set(prefecture, value);
    }
});

rl.on('close', () => {
    for (const [k, v] of popuMap) {
        v.change = v.after / v.before;
    }
    const popuRankArray = Array.from(popuMap).sort((prefe1, prefe2) => {
        return prefe2[1].change - prefe1[1].change;
    });
    const popuRankStr = popuRankArray.map(([k, v], i) => {
        return `第${i + 1}位 ${k}: ${v.before}=>${v.after} 変化率: ${v.change}`;
    });
    console.log(popuRankStr);
});