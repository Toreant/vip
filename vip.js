/**
 * Created by Apache on 2016/3/13.
 */
var cheerio = require('cheerio');
var request = require('request');
var colors = require('colors');
var baseUrl = 'http://www.aiqiyivip.com/';

function crawler(url,num,type) {
    request(url,function(err,res,body) {
        var $ = cheerio.load(body);
        var selector = "#threadlisttableid tbody",
            num = 0;

        // 查询器，查找会员分享账号链接的
        if(type === 'iqiyi') {
            num = 7;
        } else {
            num = 5;
        }
        var a = $(selector).eq(num).find(".sub-tit").children('a').eq(1);
        console.log(a.attr('href'));

        request(a.attr('href'),function(err,res,body) {
            $ = cheerio.load(body);

            var result = [];

            if(type === 'thunder') {
                result = getThunderData($,num);
                console.log("\n>迅雷会员vip".red + '\n');
            } else if(type === 'youku') {
                result = getYoukuData($,num);
                console.log("\n>优酷会员vip".red + '\n');
            } else if(type === 'letv') {
                result = getYoukuData($,num);
                console.log("\n>乐视会员vip".red + '\n');
            } else if(type == 'iqiyi') {
                result = getYoukuData($,num);
                console.log("\n>爱奇艺会员vip".red + '\n');
            }

            for(var i = 0, len = result.length; i < len; i++) {
                console.log(("账号："+result[i].count).green + "  --  " + result[i].password.gray);
            }
        });
    });
}

function getThunderData($,num) {
    var vip = $(".t_fsz .t_f").eq(0);
    var items = [];

    vip.each(function(index,item) {
        var children = $(this)[0].children;
        items = items.concat(getData(children));
    });
    return items;
}

function getYoukuData($,num) {
    var vip = $(".t_table td").slice(0);
    var items = [];

    vip.each(function(index,element) {
        var children = $(this)[0].children;
        items = items.concat(getData(children));
    });
    return items;
}

function getData(childrenData) {
    var items = [];

    for(var i = 0, num = childrenData.length; i < num; i++) {
        if(childrenData[i].type === 'text' || childrenData[i].data ) {
            var result = childrenData[i].data.toString().match(/[\w@\.\w\:]+/g);
            if(!result || result.length < 2) {
                continue;
            }
            var item = {};
            item.count = result[0];
            item.password = result[1];
            items.push(item);
        }
    }
    return items;
}


module.exports = function (type, num) {
    switch (type) {
        case "youku" :
            crawler(baseUrl + 'forum-40-1.html',num,type);
            break;
        case "thunder" :
            crawler(baseUrl + 'forum-38-1.html',num,type);
            break;
        case "letv" :
            crawler(baseUrl + 'forum-41-1.html',num,type);
            break;
        case "iqiyi" :
            crawler(baseUrl + 'forum-2-1.html',num,type);
            break;
        default :
            crawler(baseUrl + 'forum-40-1.html',num,"youku");
            crawler(baseUrl + 'forum-38-1.html',num,"thunder");
            crawler(baseUrl + 'forum-41-1.html',num,'letv');
            crawler(baseUrl + 'forum-2-1.html',num,'iqiyi');
            break;
    }
};