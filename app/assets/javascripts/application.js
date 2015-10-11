// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require d3.v3
//= require nv.d3
//= require foundation
//= require moment
//= require fullcalendar
$(document).foundation();

/*****************************************************************************/
/* STOCKS*/
/*****************************************************************************/
Date.prototype.yyyymmdd = function () {

    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();

    return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);
};

function buildChartData(data, name, symbol, lst) {
    var valuesArray = [];
    $(data).find('quote').each(function () {
        var date = new Date($(this).find('Date').text());
        var price = parseFloat($(this).find('Adj_Close').text()).toFixed(2);
        valuesArray.push({x: date, y: price});
    });
    valuesArray.sort(function (a, b) {
        return a.x - b.x;
    });

    return {
        values: valuesArray,
        key: name + ' ("' + symbol + '")',
        color: '#0000FF',
    };

}

function genChart(data, days, divId) {
    var end = (new Date);
    var start = new Date;
    var name = $(data).find('Name').text();
    var symbol = $(data).find('Symbol').text();
    start.setDate(end.getDate() - days);
    $.ajax({
        method: "GET",
        url: 'https://query.yahooapis.com/v1/public/yql/derekleung/getHistory?',
        data: {
            diagnostics: 'true',
            env: 'store://datatables.org/alltableswithkeys',
            symbol: symbol,
            startDate: start.yyyymmdd(),
            endDate: end.yyyymmdd(),
        },
        success: function (data) {
            window.chartData.push(buildChartData(data, name, symbol));
            drawChart(divId);
        }
    });
}

function drawChart(divId) {
    nv.addGraph(function () {
        var chart = nv.models.lineChart()
                .useInteractiveGuideline(true)
            ;

        chart.xAxis
            .axisLabel('Date')
            .tickFormat(function (d) {
                return d3.time.format('%x')(new Date(d))
            });

        chart.xAxis.rotateLabels(-45);

        chart.yAxis
            .axisLabel('Price ($)')
            .tickFormat(d3.format('.02f'))
        ;

        d3.select('#' + divId + ' svg')
            .datum(window.chartData)
            .transition().duration(500)
            .call(chart)
        ;

        nv.utils.windowResize(chart.update);

        return chart;
    });
}

function printTicker(data, divId) {
    var lastTradePrice = parseFloat($(data).find('LastTradePriceOnly').text()).toFixed(2);
    var change = $(data).find('Change').text();
    var op = change[0];
    change = parseFloat(change.slice(1)).toFixed(2);

    $('#' + divId + '>' + '[name=price]').html(lastTradePrice);
    $('#' + divId + '>' + '[name=change]').html(op + change);

}

function printQuote(data) {
    var avgDailyVol = $(data).find('AverageDailyVolume').text();
    var change = $(data).find('Change').text();
    var daysLow = $(data).find('DaysLow').text();
    var daysHigh = $(data).find('DaysHigh').text();
    var yearLow = $(data).find('YearLow').text();
    var yearHigh = $(data).find('YearHigh').text();
    var marketCap = $(data).find('MarketCapitalization').text();
    var lastTradePrice = $(data).find('LastTradePriceOnly').text();
    var daysRange = $(data).find('DaysRange').text();
    var name = $(data).find('Name').text();
    var symbol = $(data).find('Symbol').text();
    var volume = $(data).find('Volume').text();
    var stockxchange = $(data).find('StockExchange').text();

    $('#quoteResults').empty();

    var avgDailyVolumeDiv = $('<div>', {
        id: 'averageDailyVolume',
        name: 'averageDailyVolume',
        text: 'Average Daily Volume: ' + avgDailyVol,
    });
    $('#quoteResults').append(avgDailyVolumeDiv);

    var changeDiv = $('<div>', {
        id: 'change',
        name: 'change',
        text: 'Change: ' + change,
    });
    $('#quoteResults').append(changeDiv);
    var daysLowDiv = $('<div>', {
        id: 'daysLow',
        name: 'daysLow',
        text: "Day's Low: " + daysLow,
    });
    $('#quoteResults').append(daysLowDiv);
    var daysHighDiv = $('<div>', {
        id: 'daysHigh',
        name: 'daysHigh',
        text: "Day's High: " + daysHigh,
    });
    $('#quoteResults').append(daysHighDiv);
    var yearLowDiv = $('<div>', {
        id: 'yearLow',
        name: 'yearLow',
        text: "Year Low: " + yearLow,
    });
    $('#quoteResults').append(yearLowDiv);
    var yearHighDiv = $('<div>', {
        id: 'yearHigh',
        name: 'yearHigh',
        text: 'Year High: ' + yearHigh,
    });
    $('#quoteResults').append(yearHighDiv);
    var marketCapDiv = $('<div>', {
        id: 'marketCap',
        name: 'marketCap',
        text: 'Market Capitalization: ' + marketCap,
    });
    $('#quoteResults').append(marketCapDiv);
    var lastTradePriceDiv = $('<div>', {
        id: 'lastTradePrice',
        name: 'lastTradePrice',
        text: 'Last Trade Price: ' + lastTradePrice,
    });
    $('#quoteResults').append(lastTradePriceDiv);
    var daysRangeDiv = $('<div>', {
        id: 'daysRange',
        name: 'daysRange',
        text: "Day's Range: " + daysRange,
    });
    $('#quoteResults').append(daysRangeDiv);
    var nameDiv = $('<div>', {
        id: 'name',
        name: 'name',
        text: 'Name: ' + name,
    });
    $('#quoteResults').append(nameDiv);
    var symbolDiv = $('<div>', {
        id: 'symbol',
        name: 'symbol',
        text: 'Symbol: ' + symbol,
    });
    $('#quoteResults').append(symbolDiv);
    var volumeDiv = $('<div>', {
        id: 'volume',
        name: 'volume',
        text: 'Volume: ' + volume,
    });
    $('#quoteResults').append(volumeDiv);
    var stockxchangeDiv = $('<div>', {
        id: 'stockExchange',
        name: 'stockExchange',
        text: 'Stock Exchange: ' + stockxchange,
    });
    $('#quoteResults').append(stockxchangeDiv);
}
/*****************************************************************************/
/* END STOCKS*/
/*****************************************************************************/
$(function () {
    $(document).foundation();
});

/*****************************************************************************/
/* FACEBOOK*/
/*****************************************************************************/
function fb_login() {
    FB.login(function (response) {

        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            //console.log(response); // dump complete info
            access_token = response.authResponse.accessToken; //get access token
            user_id = response.authResponse.userID; //get FB UID

            FB.api('/me', function (response) {
                user_email = response.email; //get user email
                // you can store this data into your database
            });
            window.location.reload();
            //associate user in our database
            $.ajax({
                type:'POST',
                url:'/associate-user',
                data:{'idString': response.authResponse.userID},
                success: function(){
                    alert("Successfully associated user with FB ID: " + user_id);
                }
            });

        } else {
            //user hit cancel button
            console.log('User cancelled login or did not fully authorize.');

        }
    }, {
        scope: 'publish_actions,email,public_profile,user_posts'
    });
}
(function () {
    var e = document.createElement('script');
    e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
    e.async = true;
    document.getElementById('fb-root').appendChild(e);
}());
