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
    var startRow = $('<tr>',{
        text: "test"
    });
    var avgDailyVolumeName = $('<td>', {
        id: 'averageDailyVolume',
        name: 'averageDailyVolume',
        text: 'Average Daily Volume'
    });
    var avgDailyVolumeCell = $('<td>', {
        text: avgDailyVol
    });
    $('#quoteResults').append(startRow);
    $('#quoteResults').append(avgDailyVolumeName);
    $('#quoteResults').append(avgDailyVolumeCell);

    var changeName = $('<td>', {
        id: 'change',
        name: 'change',
        text: 'Change'
    });
    var changeCell = $('<td>', {
        text: change
    });
    $('#quoteResults').append(changeName);
    $('#quoteResults').append(changeCell);

    var daysLowName = $('<td>', {
        id: 'daysLow',
        name: 'daysLow',
        text: "Day's Low"
    });
    var daysLowCell = $('<td>', {
        text:daysLow
    });
    $('#quoteResults').append(daysLowName);
    $('#quoteResults').append(daysLowCell);

    var daysHighName = $('<td>', {
        id: 'daysHigh',
        name: 'daysHigh',
        text: "Day's High"
    });
    var daysHighCell = $('<td>', {
        text: daysHigh
    });
    $('#quoteResults').append(daysHighName);
    $('#quoteResults').append(daysHighCell);

    var yearLowName = $('<td>', {
        id: 'yearLow',
        name: 'yearLow',
        text: "Year Low"
    });
    var yearLowCell = $('<td>', {
        text: yearLow
    });
    $('#quoteResults').append(yearLowName);
    $('#quoteResults').append(yearLowCell);

    var yearHighName = $('<td>', {
        id: 'yearHigh',
        name: 'yearHigh',
        text: 'Year High'
    });
    var yearHighCell = $('<td>', {
        text: yearHigh
    });
    $('#quoteResults').append(yearHighName);
    $('#quoteResults').append(yearHighCell);

    var marketCapName = $('<td>', {
        id: 'marketCap',
        name: 'marketCap',
        text: 'Market Capitalization'
    });
    var marketCapCell = $('<td>', {
        text: marketCap
    });
    $('#quoteResults').append(marketCapName);
    $('#quoteResults').append(marketCapCell);

    var lastTradePriceName = $('<td>', {
        id: 'lastTradePrice',
        name: 'lastTradePrice',
        text: 'Last Trade Price'
    });
    var lastTradePriceCell = $('<td>', {
        text: lastTradePrice
    });
    $('#quoteResults').append(lastTradePriceName);
    $('#quoteResults').append(lastTradePriceCell);

    var daysRangeName = $('<td>', {
        id: 'daysRange',
        name: 'daysRange',
        text: "Day's Range"
    });
    var daysRangeCell = $('<td>', {
        text: daysRange
    });
    $('#quoteResults').append(daysRangeName);
    $('#quoteResults').append(daysRangeCell);

    var nameName = $('<td>', {
        id: 'name',
        name: 'name',
        text: 'Name'
    });
    var nameCell = $('<td>', {
        text: name
    });
    $('#quoteResults').append(nameName);
    $('#quoteResults').append(nameCell);

    var symbolName = $('<td>', {
        id: 'symbol',
        name: 'symbol',
        text: 'Symbol'
    });
    var symbolCell = $('<td>', {
        text: symbol
    });
    $('#quoteResults').append(symbolName);
    $('#quoteResults').append(symbolCell);

    var volumeName = $('<td>', {
        id: 'volume',
        name: 'volume',
        text: 'Volume'
    });
    var volumeCell = $('<td>', {
        text: volume
    });
    $('#quoteResults').append(volumeName);
    $('#quoteResults').append(volumeCell);

    var stockxchangeName = $('<td>', {
        id: 'stockExchange',
        name: 'stockExchange',
        text: 'Stock Exchange'
    });
    var stockxchangeCell = $('<td>', {
        text: stockxchange
    });
    $('#quoteResults').append(stockxchangeName);
    $('#quoteResults').append(stockxchangeCell);
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

        } else {
            //user hit cancel button
            console.log('User cancelled login or did not fully authorize.');

        }
    }, {
        scope: 'publish_actions,email'
    });
}
(function () {
    var e = document.createElement('script');
    e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
    e.async = true;
    document.getElementById('fb-root').appendChild(e);
}());
