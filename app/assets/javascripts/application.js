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
//= require dataTables/extras/dataTables.fixedHeader
//= require dataTables/extras/dataTables.tableTools
//= require dataTables/extras/dataTables.responsive
$(document).foundation();

$(function() {
    $(document).foundation();
});
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
    var invalid=false;
    var invalidFields = {
        ticker: false,
        shares: false,
        sharesMax: false,
    };

    //validate inputs
    if (ticker=='' || !tReg.test(ticker)) {
        invalid = true;
        invalidFields['ticker'] = true;
    }
    if (shares=='' || !sReg.test(shares)){
        invalid = true;
        invalidFields['shares'] = true;
    } else if (parseInt(shares) > 1000000) {
        invalid = true;
        invalidFields['sharesMax'] = true;
    }
    
    if(invalid){
        $('#invalid-buy-modal p:first').empty();
        $('#invalid-buy-modal').foundation('reveal', 'open');
        if(invalidFields['ticker']){
            $('#invalid-buy-modal p:first').append("<br>Invalid ticker");
        }
        if(invalidFields['shares']){
            $('#invalid-buy-modal p:first').append("<br>Invalid shares");
        }
        if(invalidFields['sharesMax']){
            $('#invalid-buy-modal p:first').append("<br>Shares cannot be greater than 1,000,000");
        }
    } else {
        $('#confirm-modal').foundation('reveal','open');
        $('#confirm-modal p:first').html("Are you sure you want to buy " + shares + " share(s) of " + ticker + "?");
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
                $('#sell-success-alert').hide();
                $('#buy-success-alert').show();
                //refresh the datatable and stock buy form
                clearChildren(document.getElementById('buy-form'));
                window.stockTable.destroy();
                $('#myTable tfoot tr').remove();
                $('#myTable tbody').remove();
                getUserStockData();
            }
        });
    } else {
        $('#ticker-not-exist-modal').foundation('reveal', 'open');
    }

    
}

function getStockPrice(ticker, shares, transType){
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
            if(transType == 'buy'){
                postBuyForm(ticker, shares, price);
            } else if(transType == 'sell'){
                postSellForm(ticker, shares, price);
            }
            
        }
    });
}

function buildStockTable(data){
    //$('#debug-output').html(JSON.stringify(data));
    var stocks = data['stocks'];
    var sArr = [];
    var row;
    var numStocks = Object.keys(stocks).length;
    var index = 0;

    if(stocks.length == 0){
        dataTable([]);
    } else {
        $.each(stocks, function(index, value){
            index ++;
            if(parseInt(value['shares']) > 0){
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
                        buildRows(data, value, sArr, index, numStocks, totalChange, false);
                    },
                });
            } else {
                buildRows(data, value, sArr, index, numStocks, totalChange, true);
            }
            
        });
    }
}

function buildRows(data, value, sArr, index, numStocks, totalChange, noShares){
    var change;
    var marketCap;
    var gain;
    var gain_pc;
    if(noShares){
        change = 0;
        marketCap = 0;
        gain = value['base_cost'] * -1;
        gain_pc = (gain/value['base_cost'] * 100).toFixed(2);
    } else {
        var avgDailyVol = $(data).find('AverageDailyVolume').text();
        change = $(data).find('Change').text();
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
        marketCap = parseFloat($(data).find('MarketCapitalization').text()).toFixed(2);
        var lastTradePrice = parseFloat($(data).find('LastTradePriceOnly').text()).toFixed(2);
        var daysRange = $(data).find('DaysRange').text();
        var name = $(data).find('Name').text();
        var symbol = $(data).find('Symbol').text();
        var volume = $(data).find('Volume').text();
        var stockxchange = $(data).find('StockExchange').text();

        gain = ((lastTradePrice * value['shares']) - value['base_cost']).toFixed(2);
        gain_pc = ((gain/value['base_cost']) * 100).toFixed(2);
        days_gain = 'TBD'//change * value['shares'];
        
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
            '<button id="' + symbol +  '" class="button small radius" data-reveal onClick="sellButtonClicked(' + symbol + ',' + value['shares'] + ')">sell</button>'
        ];
        sArr.push(row);
    }

    //update totals
    window.totalChange = (parseFloat(window.totalChange) + parseFloat(change)).toFixed(2);
    window.totalMarketCap = (parseFloat(window.totalMarketCap) + parseFloat(marketCap)).toFixed(2);
    window.totalGain = (parseFloat(window.totalGain) + parseFloat(gain)).toFixed(2);
    window.totalGainPc = (parseFloat(window.totalGainPc) + parseFloat(gain_pc)).toFixed(2);
    window.totalDaysGain = "TBD";

    if(index==numStocks){
        dataTable(sArr);
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

function sellButtonClicked(symbol, shares){
    var sym = symbol.id;
    //alert(symbol.id + ' ' + shares);
    $('#sell-modal').foundation('reveal', 'open');
    $('#sell-modal h2').html('Sell ' + sym);
    $('#sell-form-ticker').val(sym);
    $('#sell-form-held').val(parseInt(shares));
}

function validateSellForm(){
    var ticker = $('#sell-form-ticker').val().toUpperCase();
    var shares = $('#sell-form-shares').val();
    var sHeld = $('#sell-form-held').val();
    var sReg = new RegExp('^[0-9]*$');
    var invalid = false;
    var invalidFields = {
        shares: false,
        sharesMax: false,
        moreSharesThanHeld: false,
        sharesNone: false,
    };

    if (shares=='' || !sReg.test(shares)){
        invalid = true;
        invalidFields['shares'] = true;
    } else {
        if(parseInt(shares) > 1000000) {
            invalid = true;
            invalidFields['sharesMax'] = true;
        }
        if(parseInt(shares) > parseInt($('#sell-form-held').val())){
            invalid = true;
            invalidFields['moreSharesThanHeld'] = true;
        }
        if(parseInt(shares) < 1){
            invalid = true;
            invalidFields['sharesNone'] = true;
        }
    }

    if(invalid){
        $('#invalid-sell-modal p:first').empty();
        $('#invalid-sell-modal').foundation('reveal', 'open');
        if(invalidFields['shares']){
            $('#invalid-sell-modal p:first').append("<br>Invalid shares");
        }
        if(invalidFields['sharesMax']){
            $('#invalid-sell-modal p:first').append("<br>Shares cannot be greater than 1,000,000");
        }
        if(invalidFields['moreSharesThanHeld']){
            $('#invalid-sell-modal p:first').append("<br>Shares cannot be greater than the number of shares you hold.");
        }
        if(invalidFields['sharesNone']){
            $('#invalid-sell-modal p:first').append("<br>Shares must be greater than 0");
        }    
    } else {
        $('#confirm-sell-modal').foundation('reveal','open');
        $('#confirm-sell-modal p:first').html("Are you sure you want to sell " + shares + " share(s) of " + ticker + "?");
    }

}

function postSellForm(ticker, shares, price){
    var pReg = new RegExp("^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$");

    if(pReg.test(price)) {
        $.ajax({
            type:'POST',
            url:'/sell-stock',
            data:{
                'ticker_symbol': ticker,
                'shares': shares,
                'price': price,
            },
            success: function(){
                $('#buy-success-alert').hide();
                $('#sell-success-alert').show();
                //refresh the datatable and stock buy form
                clearChildren(document.getElementById('buy-form'));
                clearChildren(document.getElementById('sell-modal'));
                window.stockTable.destroy();
                $('#myTable tfoot tr').remove();
                $('#myTable tbody').remove();
                getUserStockData();
            }
        });
    } else {
        $('#ticker-not-exist-modal').foundation('reveal', 'open');
    }
}

function dataTable(sArr){
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
    options.responsive = true;

    window.stockTable = $('#myTable').DataTable(options);
}

function dataTableTrans(sArr){
    $('#trans-table').DataTable( {

        "columns": [
            {title: "Symbol"},
            {title: "Price"},
            {title: "Shares"},
            {title: "Buy/Sell"},
            {title: "Date"},
        ],
        "data": sArr,
        "order": [[ 4, "desc" ]],
        "fixedHeader": true,
        "responsive": true,
        "aoColumnDefs": [
            {
                "aTargets":[3],
                "fnCreatedCell": function(nTd, sData, oData, iRow, iCol)
                {
                    if(sData == 'sell' ) {
                         $(nTd).css('color', 'red');
                    } else if(sData == 'buy'){
                        $(nTd).css('color', 'green');
                    }
                }
            }
        ],
        /*"oTableTools": {
            "sSwfPath": "dataTables/extras/TableTools/media/swf/copy_csv_xls_pdf.swf",
            "aButtons": ["copy", "print", {
                 "sExtends": "collection",
                 "sButtonText": "Save <span class=\"caret\" />",
                 "aButtons": ["csv", "xls", "pdf"]
            }]
        },*/
        "dom": 'T<"clear">lfrtip',
        "tableTools": {
            "sSwfPath": "http://cdn.datatables.net/tabletools/2.2.2/swf/copy_csv_xls_pdf.swf"
        },
        aButtons: [
            { sExtends: "csv",
              sFileName: 'download.csv',
              sFieldSeperator: "," //<--- example of how to set the delimiter
            },
            { sExtends: "xls",
              sFileName: 'download.xls'
            },
            { sExtends: "pdf",
              sFileName: 'download.pdf'
            }   
        ], 
    } );
}

function getUserTransactions(){
    $.ajax({
        type:'GET',
        url:'/get-my-transactions',
        dataType:'json',

        success: function(data){
            buildTransTable(data);
        }
    });
}

function buildTransTable(data){
        //$('#debug-output').html(JSON.stringify(data));
    var ts = data['transactions'];
    var sArr = [];
    var row;
    var numTrans = Object.keys(ts).length;
    var index = 0;
    var price;
    var tType;
    var datetime;

    if(ts.length == 0){
        dataTableTrans([]);
    } else {
        $.each(ts, function(index, value){
            price = parseFloat(value['price']);
            shares = parseInt(value['shares']);
            tType = 'buy'
            datetime = new Date(value['timestamp']);
            index ++;
            if(shares < 0.0){
                tType = 'sell';
                shares *= -1;
            }
            sArr.push([value['ticker_symbol'], price, shares, tType, formatDate(datetime)])
            
        });
        dataTableTrans(sArr);
    }
}

function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  seconds = seconds < 10 ? '0'+seconds : seconds;
  var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
  return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}
/*****************************************************************************/
/* END STOCKS*/
/*****************************************************************************/
/*****************************************************************************/
/* FILE UPLOAD */
/*****************************************************************************/
// Method that checks that the browser supports the HTML5 File API
function browserSupportFileUpload() {
    var isCompatible = false;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
    isCompatible = true;
    }
    return isCompatible;
}

// Method that reads and processes the selected file
function upload(evt) {
    if (!browserSupportFileUpload()) {
        alert('The File APIs are not fully supported in this browser!');
    } else {
        var data = null;
        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event) {
            var csvData = event.target.result;
            data = $.csv.toArrays(csvData);
            if (data && data.length > 0) {
                //alert('Imported -' + data.length + '- rows successfully!');
                $.ajax({
                    type:'POST',
                    url:'/upload-transactions',
                    dataType: 'json',
                    data:{
                        'data': JSON.stringify(data),
                    },
                    success: function(){
                        alert('adsfadsflk');
                    },
                });
            } else {
                alert('No data to import!');
            }
        };
        reader.onerror = function() {
            alert('Unable to read ' + file.fileName);
        };
    }
}
/*****************************************************************************/
/* END FILE UPLOAD*/
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

/*********************************************************/
/* CALENDAR */
/*********************************************************/

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
