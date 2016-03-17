/**
 * Created by Apache on 2016/3/16.
 */
var vip = require('./vip');
var program = require('commander');

program
    .version('0.0.1')
    .usage("[option]")
    .option('-y, --youku','search youku vip')
    .option('-t, --thunder','search thunder vip')
    .option('-l, --letv','search letv vip')
    .option('-i, --iqiyi','search iqiyi vip')
    .option('-a, --all','search all vip')
    .option('-n, --num [num]','select how many vip')
    .parse(process.argv);

var num = program.num;
var type;

if(program.youku) {
    type = "youku";
} else if(program.thunder) {
    type = "thunder";
} else if(program.iqiyi) {
    type = "iqiyi";
} else if(program.letv) {
    type = 'letv';
} else {
    type = 'all';
}

vip(type,num);