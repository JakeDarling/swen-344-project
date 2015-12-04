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
//= require jquery-ui
//= require jquery_ujs
//= require dataTables/jquery.dataTables
//= require dataTables/jquery.dataTables.foundation
//= require dataTables/jquery.dataTables
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
    var sArr = [];

    var nameS = 'Name: ' + '<strong>' + name + '</strong>';
    var symbolS = 'Symbol: ' + '<strong>' + symbol + '</strong>';
    var volS = 'Volume: ' + '<strong>' + volume + '</strong>';
    var sexS = 'Stock Exchange: ' + '<strong>' + stockxchange + '</strong>';
    var changeS = 'Change: ' + '<strong>' + change + '</strong>';
    var daysRangeS = "Day's Range: " + '<strong>' + daysRange + '</strong>';
    var daysLowS = "Day's Low: " + '<strong>' + daysLow + '</strong>';
    var daysHighS = "Day's High: " + '<strong>' + daysHigh + '</strong>';

    var yearLowS = "Year Low: " + '<strong>' + yearLow + '</strong>';
    var yearHighS = 'Year High: ' + '<strong>' + yearHigh + '</strong>';
    var mcS = 'Market Cap.: ' + '<strong>' + marketCap + '</strong>';
    var lastPriceS = 'Last Trade Price: ' + '<strong>' + lastTradePrice + '</strong>';

    sArr.push([nameS, changeS, yearLowS]);
    sArr.push([symbolS, daysRangeS, yearHighS]);
    sArr.push([volS, daysLowS, mcS]);
    sArr.push([lastPriceS, daysHighS, sexS]);
    dataTableQuote(sArr);
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
                $('#note-success-alert').hide();
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
        var note = value['note'];
        row = [
            name,
            symbol,
            lastTradePrice,
            changeStr,
            value['shares'],
            marketCap,
            gain,
            gain_pc,
            '<button id="' + symbol + ' ' + '" class="button tiny radius" data-reveal onClick="noteButtonClicked(\''+symbol+'\',\''+note+'\')">note</button>',
            '<button id="' + symbol +  '" class="button tiny radius" data-reveal onClick="sellButtonClicked(' + symbol + ',' + value['shares'] + ')">sell</button>',
        ];
        sArr.push(row);
    }

    //update totals
    window.totalChange = (parseFloat(window.totalChange) + parseFloat(change)).toFixed(2);
    window.totalMarketCap = (parseFloat(window.totalMarketCap) + parseFloat(marketCap)).toFixed(2);
    window.totalGain = (parseFloat(window.totalGain) + parseFloat(gain)).toFixed(2);
    window.totalGainPc = (parseFloat(window.totalGainPc) + parseFloat(gain_pc)).toFixed(2);

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

function noteButtonClicked(symbol, note){
    var sym = symbol;
    //alert(symbol.id + ' ' + shares);
    $('#note-modal').foundation('reveal', 'open');
    $(document).foundation('reveal', {
        opened: function(event){
            $(event.target).find('[autofocus]').first().focus();
        }
    });  
    $('#note-modal h2').html('Note for ' + sym);
    if (note == null || note == "" || note == 'null'){
        note = "edit note here...";
    }
    $('#note-editable').html('<p>' + unescapeHtml(note) + '</p>');
    $('#note-form-ticker').val($.trim(sym));
}

function sellButtonClicked(symbol, shares){
    var sym = symbol.id;
    //alert(symbol.id + ' ' + shares);
    $('#sell-modal').foundation('reveal', 'open');
    $(document).foundation('reveal', {
        opened: function(event){
            $(event.target).find('[autofocus]').first().focus();
        }
    });
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
                $('#note-success-alert').hide();
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
            { title: ""},
            { title: "" },
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
                    
                '</th>' +
                '<th>' +
                    
                '</th>' +
            '</tr>'
        );
    };

    options.aoColumnDefs = [

        { "bSortable": false, 'aTargets': [ -1 ]},
    ];

    options.lengthMenu = [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]];
    options.pageLength = 5;
    options.responsive = true;

    window.stockTable = $('#myTable').DataTable(options);
}

function dataTableTrans(sArr){
    window.transTable = $('#trans-table').DataTable( {

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
        "lengthMenu": [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]],
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

function dataTableQuote(sArr){
    if (window.quoteTable!=undefined){
        window.quoteTable.destroy();
    }
    window.quoteTable = $('#quote-table').DataTable({
        "columns": [
            {title: ""},
            {title: ""},
            {title: ""},
        ],
        "data": sArr,
        "responsive": true,
        "bFilter": false,
        "paging": false,
        "bSort" : false,
    });
    document.getElementById("quote-table").deleteTHead();
    document.getElementById("quote-table").deleteTFoot();
    $('#quote-table_info').hide();
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

function deleteUserTransactions(){
    $.ajax({
        type:'POST',
        url:'/delete-transactions',
        success: function(data){
            $('#upload-alert').hide();
            $('#ts-delete-alert').show();           
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
        $('#delete-ts').click(function () {return false;});
        $('#delete-ts').css("background-color", "grey");
        dataTableTrans([]);
    } else {
        $('#delete-ts').unbind('click', false);
        $('#delete-ts').css("background-color", "rgb(240, 65, 36)");
        $('#delete-ts').replaceWith('<a href="javascript:void(0);" id="delete-ts" data-reveal-id="confirm-modal" class="radius button small alert">Delete Transaction History</a>');
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

function getTopStocks(){
    $.ajax({
        type:'GET',
        url:'/get-top-stocks',
        dataType:'json',

        success: function(data){
            if (Object.keys(data['stocks']).length > 0){
                buildTopStockTable(data);
            } else {
                //user has no stocks so use default
                df = JSON.parse('{"stocks":[{"id":4,"ticker_symbol":"GOOGL","shares":10,"note":null,"created_at":"2015-11-20T00:14:58.237Z","updated_at":"2015-11-20T00:14:58.237Z","user_id":1,"base_cost":"7599.4","last_price":"759.9400000000001"},{"id":5,"ticker_symbol":"NDAQ","shares":1,"note":null,"created_at":"2015-11-20T00:16:04.227Z","updated_at":"2015-11-20T00:16:04.227Z","user_id":1,"base_cost":"661.27","last_price":"661.27"},{"id":1,"ticker_symbol":"DOW","shares":1,"note":null,"created_at":"2015-11-20T00:06:59.309Z","updated_at":"2015-11-20T00:07:57.474Z","user_id":1,"base_cost":"118.78","last_price":"118.78"},{"id":7,"ticker_symbol":"XRX","shares":1,"note":null,"created_at":"2015-11-20T00:17:04.823Z","updated_at":"2015-11-20T00:17:04.823Z","user_id":1,"base_cost":"118.71","last_price":"118.71"},{"id":6,"ticker_symbol":"XOM","shares":1,"note":null,"created_at":"2015-11-20T00:16:24.032Z","updated_at":"2015-11-20T00:16:24.032Z","user_id":1,"base_cost":"67.66","last_price":"67.66"}]}');
                buildTopStockTable(df);
            }
        }
    });
}

function buildTopStockTable(data){
    var ts = data['stocks'];
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
                    var change = $(data).find('Change').text();
                    price = parseFloat($(data).find('LastTradePriceOnly').text()).toFixed(2);
                    sArr.push([value['ticker_symbol'], price, change])
                },
            });
            
        });
        dataTableTopStocks(sArr);
    }
}

function dataTableTopStocks(sArr){
    window.topStockTable = $('#top-stock-table').DataTable( {

        "columns": [
            {title: "Symbol"},
            {title: "Price"},
            {title: "Day's Change"},
        ],
        "data": sArr,
        "responsive": true,
        "bFilter": false,
        "paging": false,
        "order": [[ 1, "desc" ]]
    });
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

function postNote(){
    var ticker = $('#note-form-ticker').val().toUpperCase();
    var note = escapeHtml($('#note-editable p').html());
    $.ajax({
        type:'POST',
        url:'/edit-stock-note',
        data:{
            'ticker_symbol': ticker,
            'note': note,
        },
        success: function(){
            $('#buy-success-alert').hide();
            $('#sell-success-alert').hide();
            $('#note-modal').foundation('reveal', 'close');
            $('#note-success-alert').show();
            //refresh the datatable and stock buy form
            clearChildren(document.getElementById('buy-form'));
            window.stockTable.destroy();
            $('#myTable tfoot tr').remove();
            $('#myTable tbody').remove();
            getUserStockData();
        }
    });
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
    $('#upload-alert').hide();
    $('#ts-delete-alert').hide();
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
                        $('#upload-alert').show();
                        //refresh the transaction datatable
                        window.transTable.destroy();
                        getUserTransactions();
                        resetFormElement($('#txtFileUpload'));
                        
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

function validateAddEvent() {
  // var tReg = new RegExp('^.{0,100}$');
  // var sReg = new RegExp('^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$');
  // var eReg = new RegExp('^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$');

  var title = $('#titleField').val();
  var startDate = $('#startDateField').val();
  var startTime = $('#startTimeField').val();
  var endDate = $('#endDateField').val();
  var endTime = $('#endTimeField').val();

  var invalid=false;
  var invalidFields = {
      title: false,
      startDate: false,
      startTime: false,
      endDate: false,
      endTime: false
  };

  //validate inputs
  if (title == '') {
    invalid = true;
    invalidFields['title'] = true;
  } else if (title.length > 100) {
    invalid = true;
    invalidFields['titleLength'] = true;
  }
  if (startDate == ''){
    invalid = true;
    invalidFields['startDate'] = true;
  }
  if (startTime == ''){
    invalid = true;
    invalidFields['startTime'] = true;
  }
  if (endDate == ''){
    invalid = true;
    invalidFields['endDate'] = true;
  }
  if (endTime == ''){
    invalid = true;
    invalidFields['endTime'] = true;
  }
  
  // Set error message
  if(invalid){
    $('#invalid-event-input-modal p:first').empty();
    $('#invalid-event-input-modal').foundation('reveal', 'open');

    if(invalidFields['title']){
      $('#invalid-event-input-modal p:first').append("<br>Please enter a title");
    }
    if(invalidFields['titleLength']){
      $('#invalid-event-input-modal p:first').append("<br>Title must be less than 100 characters");
    }
    if(invalidFields['startDate']){
      $('#invalid-event-input-modal p:first').append("<br>Please select a Start Date");
    }
    if(invalidFields['startTime']){
      $('#invalid-event-input-modal p:first').append("<br>Please enter a Start Time");
    }
    if(invalidFields['endDate']){
      $('#invalid-event-input-modal p:first').append("<br>Please select an End Date");
    }
    if(invalidFields['endTime']){
      $('#invalid-event-input-modal p:first').append("<br>Please enter an End Time");
    }
  } else {
    // Create eventData to render FullCalendar event
    var eventData;
    eventData = {
      title: $('#titleField').val(),
      start: moment(new Date($('#startDateField').val() + ' ' +  $('#startTimeField').val())).format(),
      end: moment(new Date($('#endDateField').val() + ' ' + $('#endTimeField').val())).format()
    };

    // Store event in database
    if (eventData.title && eventData.start && eventData.end) {
      $.ajax({
        type:'POST',
        url:'/store-event',
        data:{
          'title': eventData.title,
          'start': eventData.start,
          'end1': eventData.end,
        },
        success: function(){
          $('#calendar').fullCalendar('renderEvent', eventData, true);
          $('#myModal').foundation('reveal', 'close');
        }
      });
    }
  }
}

function renderCalendar() {
    var selectedEvent;
    var eventTitle;
    var eventStartDate;
    var eventStartTime;
    var eventEndDate;
    var eventEndTime;

    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        defaultView: 'agendaWeek',
        timezone: 'local',
        selectable: true,
        selectHelper: true,
        editable: true,

        // Adding an event
        select: function(start, end) {
            eventStartDate = start.format('MMM DD, YYYY');
            eventStartTime = start.format('hh:mm A');
            eventEndDate = end.format('MMM DD, YYYY');
            eventEndTime = end.format('hh:mm A');

            // Open Modal
            $(document).on('open.fndtn.reveal', '[data-reveal]', function () {
              var modal = $(this);
              $("#modalTitle").html("Add Event");
              $('#startDateField').val(eventStartDate);
              $('#startTimeField').val(eventStartTime);
              $('#endDateField').val(eventEndDate);
              $('#endTimeField').val(eventEndTime);
              $("#eventId").val("");
            });
            $('#myModal').foundation('reveal', 'open');
        },

        unselect: function() {
            $('#eventButtons').hide();
            selectedEvent = null;
        },

        eventResize: function(event) {
          $.ajax({
            type: 'POST',
            url: '/modify-event',
            data: {
              'id': event._id.replace(/\D/g,''),
              'title': event.title,
              'start': event.start.format(),
              'end1': event.end.format(),
            },
            success: function() {
                console.log('Event resized');
            },
            error: function() {
                alert('Error modifying event in database');
            }
          });
        },

        eventDrop: function(event) {
          $.ajax({
            type: 'POST',
            url: '/modify-event',
            data: {
              'id': event._id.replace(/\D/g,''),
              'title': event.title,
              'start': event.start.format(),
              'end1': event.end.format(),
            },
            success: function() {
                console.log('Event dropped');
            },
            error: function() {
                alert('Error modifying event in database');
            }
          });
        },
        
        // Show event info
        eventClick: function(calEvent, jsEvent, view) {
            var obj = {title: calEvent.title, start: calEvent.start, end: calEvent.end};
            var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
            $('#downloadBtn').wrap('<a href="data:' + data + '" download="data.json"></a>');
            selectedEvent = calEvent;
            
            $('#eventButtons').show();
            $("#modalTitle").html("Edit Event");
            $('#myModal').foundation('reveal', 'open');
            $("#titleField").val(selectedEvent.title);
            $("#startDateField").val(selectedEvent.start.format('MMM DD, YYYY'));
            $("#startTimeField").val(selectedEvent.start.format('hh:mm A'));
            $("#endDateField").val(selectedEvent.end.format('MMM DD, YYYY'));
            $("#endTimeField").val(selectedEvent.end.format('hh:mm A'));
            $("#eventId").val(selectedEvent._id.replace(/\D/g,''));
        }
    });
}

function loadEvents() {
    var events = [];
    $.ajax({
        type:'GET',
        url:'/load-events',
        dataType:'json',
        success: function(data){
          for (var z = 0; z < data.events.length; z++) {
            var event = {};
            event.title = data.events[z].title;
            event.start = data.events[z].start;
            event.end = data.events[z].end1;
            events.push(event);
          }
          $('#calendar').fullCalendar('addEventSource', events);
        }
    });
}

function storeEvent() {
    // If All fields are filled...
    if ($('#titleField').val() != '' &&
            $('#startDateField').val() != '' &&
            $('#startTimeField').val() != '' &&
            $('#endDateField').val() != '' &&
            $('#endTimeField').val() != '') {
        
        // Create eventData to render FullCalendar event
        var eventData;
            eventData = {
            title: $('#titleField').val(),
            start: moment(new Date($('#startDateField').val() + ' ' +  $('#startTimeField').val())).format(),
            end: moment(new Date($('#endDateField').val() + ' ' + $('#endTimeField').val())).format()
        };

        // Store event in database
        if (eventData.title && eventData.start && eventData.end) {
            $.ajax({
              type:'POST',
              url:'/store-event',
              data:{
                'title': eventData.title,
                'start': eventData.start,
                'end1': eventData.end,
              },
              success: function(){
                console.log('Event stored');
                $('#calendar').fullCalendar('renderEvent', eventData, true);
                $('#myModal').foundation('reveal', 'close');
              },
              error: function() {
                console.log('Error adding event to database');
              }
            });
        }
    } else {
        alert('Please fill in all fields');
    }
}

function modifyEvent() {
    var eventData;
    eventData = {
        id: $("#eventId").val(),
    	title: $('#titleField').val(),
    	start: moment(new Date($('#startDateField').val() + ' ' +  $('#startTimeField').val())).format(),
    	end: moment(new Date($('#endDateField').val() + ' ' + $('#endTimeField').val())).format()
    };

    if (eventData.title && eventData.start && eventData.end) {
    	$.ajax({
            type: 'POST',
    	    url: '/modify-event',
    	    data: {
                'id': eventData.id,
    	        'title': eventData.title,
    	        'start': eventData.start,
    	        'end1': eventData.end,
    	    },
    	    success: function() {
    	        console.log('Event modified');
                $("#calendar").fullCalendar( 'removeEvents');
                loadEvents();
    			$('#myModal').foundation('reveal', 'close');
    	    },
    	    error: function() {
    	        alert('Error modifying event in database');
    	    }
        });
    }
}

function resetAddEventForm() {
    $('#titleField').val('');
    $('#startDateField').val('');
    $('#startTimeField').val('');
    $('#endDateField').val('');
    $('#endTimeField').val('');
}

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


// Use the browser's built-in functionality to quickly and safely escape the
// string
// Use the browser's built-in functionality to quickly and safely escape the
// string
function escapeHtml(str) {
    if(str == null){
        str="";
    }
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str.replace(/"/g, '&quot;')));

    return div.innerHTML;
};

// UNSAFE with unsafe strings; only use on previously-escaped ones!
function unescapeHtml(escapedStr) {
    var div = document.createElement('div');
    div.innerHTML = escapedStr;
    var child = div.childNodes[0];
    return child ? child.nodeValue : '';
};

function resetFormElement(e) {
  e.wrap('<form>').closest('form').get(0).reset();
  e.unwrap();

  // Prevent form submission
  e.stopPropagation();
  e.preventDefault();
}
