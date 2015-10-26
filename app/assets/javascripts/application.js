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
//= require dataTables/jquery.dataTables
//= require dataTables/jquery.dataTables.foundation
//= require dataTables/jquery.dataTables
//= require turbolinks
//= require_tree .
//= require d3.v3
//= require nv.d3
//= require foundation
//= require moment
//= require fullcalendar
//= require dataTables/jquery.dataTables
//= require dataTables/jquery.dataTables.foundation
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
    var end = (new Date());
    var start = new Date();
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

function validateBuyForm(){
    var ticker = $('#buy-ticker').val().toUpperCase();
    var shares = $('#buy-shares').val();
    var sReg = new RegExp('^[0-9]*$');
    var tReg = new RegExp('^[a-zA-Z]+$');

    //validate inputs
    if (ticker=='' || shares=='' || !sReg.test(shares) || !tReg.test(ticker)) {
        alert("invalid field(s)");
    } else {
        getStockPrice(ticker, shares);
        //alert("purchased");
    }
}

function postBuyForm(ticker, shares, price){
    var pReg = new RegExp("^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$");

    if(pReg.test(price)) {
        $.ajax({
            type:'POST',
            url:'/buy-stock',
            data:{
                'ticker_symbol': ticker,
                'shares': shares,
                'price': price,
            },
            success: function(){
                alert("Successfully purchased");

                //refresh the datatable and stock buy form
                clearChildren(document.getElementById('buy-form'));
                window.stockTable.destroy();
                $('#myTable tfoot tr').remove();
                $('#myTable tbody').remove();
                getUserStockData();
            }
        });
    } else {
        alert("No such stock ticker");
    }

    
}

function getStockPrice(ticker, shares){
    var price;
    $.ajax({
        dataType: "xml",
        type: 'GET',
        url: 'https://query.yahooapis.com/v1/public/yql/derekleung/getQuote',
        data: {
            diagnostics: 'true',
            env: 'store://datatables.org/alltableswithkeys',
            symbol: ticker,
        },
        success: function (data) {
            //printTicker(data, 'ndaq');
            price = parseFloat($(data).find('LastTradePriceOnly').text()).toFixed(2);
            postBuyForm(ticker, shares, price);
        }
    });
}

function buildStockTable(data){
    //$('#debug-output').html(JSON.stringify(data));
    var stocks = data['stocks'];
    var sArr = [];
    var row;
    var numStocks = Object.keys(stocks).length
    var index = 0;

    $.each(stocks, function(index, value){
        index ++;
        $.ajax({
            async: false,
            dataType: "xml",
            type: 'GET',
            url: 'https://query.yahooapis.com/v1/public/yql/derekleung/getQuote',
            data: {
                diagnostics: 'true',
                env: 'store://datatables.org/alltableswithkeys',
                symbol: value['ticker_symbol'],
            },
            success: function (data) {
                buildRows(data, value, sArr, index, numStocks, totalChange);
            },
        });
        
    });
}

function buildRows(data, value, sArr, index, numStocks, totalChange){
    var avgDailyVol = $(data).find('AverageDailyVolume').text();
    var change = $(data).find('Change').text();
    var sign = change.substring(0, 1);
    change = change.substring(1);
    var changeStr = sign + change;
    if(sign=="-"){
        change *= -1;
    }
    var daysLow = $(data).find('DaysLow').text();
    var daysHigh = $(data).find('DaysHigh').text();
    var yearLow = $(data).find('YearLow').text();
    var yearHigh = $(data).find('YearHigh').text();
    var marketCap = parseFloat($(data).find('MarketCapitalization').text()).toFixed(2);
    var lastTradePrice = parseFloat($(data).find('LastTradePriceOnly').text()).toFixed(2);
    var daysRange = $(data).find('DaysRange').text();
    var name = $(data).find('Name').text();
    var symbol = $(data).find('Symbol').text();
    var volume = $(data).find('Volume').text();
    var stockxchange = $(data).find('StockExchange').text();
    
    var gain = ((lastTradePrice * value['shares']) - value['base_cost']).toFixed(2);
    var gain_pc = ((gain/value['base_cost']) * 100).toFixed(2);
    var days_gain = 'TBD'//change * value['shares'];

    //update totals

    window.totalChange = (parseFloat(window.totalChange) + parseFloat(change)).toFixed(2);
    window.totalMarketCap = (parseFloat(window.totalMarketCap) + parseFloat(marketCap)).toFixed(2);
    window.totalGain = (parseFloat(window.totalGain) + parseFloat(gain)).toFixed(2);
    window.totalGainPc = (parseFloat(window.totalGainPc) + parseFloat(gain_pc)).toFixed(2);
    window.totalDaysGain = "TBD";
    row = [
        name,
        symbol,
        lastTradePrice,
        changeStr,
        value['shares'],
        marketCap,
        gain,
        gain_pc,
        days_gain,
        '<button id="' + symbol +  '" class="button small radius" data-reveal-id="myModal">sell</button>'
    ];
    sArr.push(row);
    if(index==numStocks){
        var options = {}
        options.data = sArr;
        options.columns = [
                { title: "Name" },
                { title: "Symbol" },
                { title: "Last Trade Price" },
                { title: "Change" },
                { title: "Shares" },
                { title: "Market Cap." },
                { title: "Gain" },
                { title: "Gain %" },
                { title: "Day's Gain" },
                { title: "" }
            ];
        options.fnInitComplete = function(){
            $('#myTable tfoot').prepend(                
                '<tr>' +
                    '<th>' +
                        'Portfolio Value' +
                    '</th>' +
                    '<th></th><th></th>' + 
                    '<th>' +
                        window.totalChange +
                    '</th>' +
                    '<th>' +
                    '</th>' +
                    '<th>' +
                        window.totalMarketCap +
                    '</th>' +
                    '<th>' +
                        window.totalGain +
                    '</th>' +
                    '<th>' +
                        window.totalGainPc +
                    '</th>' +
                    '<th>' +
                        window.totalDaysGain +
                    '</th>' +
                '</tr>'
            );
        };

        options.aoColumnDefs = [

            { "bSortable": false, 'aTargets': [ -1 ]},
        ];

        options.lengthMenu = [[5, 10, 25, 50, 100], [5, 10, 25, 50, 100]];
        options.pageLength = 5;

        window.stockTable = $('#myTable').DataTable(options);
    }
}

function getUserStockData(){
    $.ajax({
        type:'GET',
        url:'/get-my-stocks',
        dataType:'json',

        success: function(data){
            buildStockTable(data);
        }
    });
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

/*****************************************************************************/
/* HELPER*/
/*****************************************************************************/
/*
    clears the children of an element.
    use to clear forms
*/
function clearChildren(element) {
   for (var i = 0; i < element.childNodes.length; i++) {
      var e = element.childNodes[i];
      if (e.tagName) switch (e.tagName.toLowerCase()) {
         case 'input':
            switch (e.type) {
               case "radio":
               case "checkbox": e.checked = false; break;
               case "button":
               case "submit":
               case "image": break;
               default: e.value = ''; break;
            }
            break;
         case 'select': e.selectedIndex = 0; break;
         case 'textarea': e.innerHTML = ''; break;
         default: clearChildren(e);
      }
   }
}