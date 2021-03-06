/**
 * Created by Apache on 2016/3/13.
 */
var cheerio = require('cheerio');
var request = require('request');
var colors = require('colors');
var co = require('co');
var thunkify = require('thunkify');
var get = thunkify(request.get);
var baseUrl = 'http://www.aiqiyivip.com/';

function crawler(url,num,type) {
    co(function *() {
            try {
                var firstPage = yield get(url);
            } catch(ex) {
                console.log(ex.message.red);
                return;
            }

            var $ = cheerio.load(firstPage[0].body);
            var selector = "#threadlisttableid tbody",
                _num = 0;

            // 查询器，查找会员分享账号链接的
            if(type === 'iqiyi') {
                _num = 7;
            } else {
                _num = 3;
            }

            var a = $(selector).eq(_num).children("tr").children("th").children("a").eq(1);

            if(!a.attr('href')) {
                console.log('抓不了数据'.red);
                return;
            }

            var mainBody = yield get(a.attr('href'));
		//console.log(mainBody[0].body);
            $ = cheerio.load(mainBody[0].body);
            return Promise.resolve($);
        }
    ).then(function(data) {
            if(!data) {
                throw new Error('no data');
            }
            getVip(data,type,num);
    }).catch((ex) => {
            console.log(ex.message.red);
    });
}

function getVip($,type,num) {
    var result = getBaseData($,type);
    num = num || result.length;

    if(type === 'thunder') {
        console.log("\n>迅雷会员vip".cyan + '\n');
    } else if(type === 'youku') {
        console.log("\n>优酷会员vip".cyan + '\n');
    } else if(type === 'letv') {
        console.log("\n>乐视会员vip".cyan + '\n');
    } else if(type == 'iqiyi') {
        console.log("\n>爱奇艺会员vip".cyan + '\n');
    }

    for(var i = 0; i < num; i++) {
        if(result.length === 0) {
            console.log('No Data'.grey);
            break;
        }
        console.log(("账号："+result[i].count).green + "  --  " + result[i].password.gray);
    }
}

function getBaseData($,type) {
    var vip;

    if(type === 'thunder') {
        vip = $(".t_f").eq(0);
    } else {
        vip = $(".t_table td").slice(0);
    }
    //console.log(vip);

    var items = [];

    vip.each(function(index,element) {
	//console.log($(this));
        var children = $(this)[0].children;
        items = items.concat(getData(children));
    });
    return items;
}

function getData(childrenData) {
    var items = [];

    for(var i = 0, num = childrenData.length; i < num; i++) {

        var item = {};
        if(childrenData[i].type === 'text' || childrenData[i].data ) {
            var result = childrenData[i].data.toString().match(/[\w@\.\w\:]+/g);
            if(!result || result.length < 2) {
                continue;
            }

            item.count = result[0];
            item.password = result[1];
            items.push(item);
        } else if(childrenData[i].type === 'tag' && childrenData[i].name === 'a') {

            item.count = childrenData[i].children[0].data;
            item.password = childrenData[i].next.data.match(/[\w@\.\w\:]+/g)[0];
            items.push(item);
            i++;
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
