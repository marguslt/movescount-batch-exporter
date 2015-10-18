// ==UserScript==
// @name       Movescount Batch Exporter
// @namespace  http://alexbr.com
// @version    0.1
// @description  Batch export moves from Movescount. Based on http://userscripts-mirror.org/scripts/show/155662
// @match      http://*.movescount.com/summary
// @include    htt*://*.movescount.com/summary
// @copyright  2015, AlexR
// @require http://code.jquery.com/jquery-2.1.4.min.js
// @require https://raw.github.com/lodash/lodash/3.10.0/lodash.min.js
// ==/UserScript==


function getHashVar(key){
	var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.hash); 
	return result && unescape(result[1]) || ""; 
}

function s_decodeSub(e) {
    var t, i, n = 0, o = e.length;
    var p = JSON.parse('{"0":0,"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"a":10,"b":11,"c":12,"d":13,"e":14,"f":15,"g":16,"h":17,"i":18,"j":19,"k":20,"l":21,"m":22,"n":23,"o":24,"p":25,"q":26,"r":27,"t":28,"s":29,"u":30,"v":31,"w":32,"x":33,"y":34,"z":35,"_":36,"-":37,"A":38,"B":39,"C":40,"D":41,"E":42,"F":43,"G":44,"H":45,"I":46,"J":47,"K":48,"L":49,"M":50,"N":51,"O":52,"P":53,"Q":54,"R":55,"S":56,"T":57,"U":58,"V":59,"W":60,"X":61,"Y":62,"Z":63}'); 
    for (t = 0; o > t; t++)
        i = p[e.charAt(t)],
            n |= i << 6 * t;
    return n
}
            
function u_makestring(e) {
    var t, i, n, o = [], a = e.length, r = null , l = "";
        for (t = 0; a > t; t++)
        if (i = e.charAt(t),
            "(" === i)
            r = e.charAt(t - 1),
                l = "";
    else if (")" === i) {
        for (n = s_decodeSub(l); --n > 0; )
            o.push(r);
        r = null 
    } else
        null  !== r ? l += i : o.push(i);
    return o.join("")
}

function a_makearray(e) {
    var t, i, n, o = [], a = 0;
    var p = JSON.parse('{"0":0,"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"a":10,"b":11,"c":12,"d":13,"e":14,"f":15,"g":16,"h":17,"i":18,"j":19,"k":20,"l":21,"m":22,"n":23,"o":24,"p":25,"q":26,"r":27,"t":28,"s":29,"u":30,"v":31,"w":32,"x":33,"y":34,"z":35,"_":36,"-":37,"A":38,"B":39,"C":40,"D":41,"E":42,"F":43,"G":44,"H":45,"I":46,"J":47,"K":48,"L":49,"M":50,"N":51,"O":52,"P":53,"Q":54,"R":55,"S":56,"T":57,"U":58,"V":59,"W":60,"X":61,"Y":62,"Z":63}'); 
    for (t = 0; t < e.length; t++)
        for (n = p[e.charAt(t)],
             i = 0; 6 > i; i++)
            o[a++] = n & 1 << i;
    return o // o = Array[432],
}
function d_decode(e) {
            var t = u_makestring(e);
            return a_makearray(t)
        }

function parseIndices(e) {
            var t, i = [], n = d_decode(e);
            for (t = 0; t < n.length; t++)
                n[t] && i.push(t);
            return i // i = Array[238]
        }



function exportMoves(format) {
    var moveIds = [];
    var movesIndices = [];
    var wins = [];
    
    var movesTmp = "";
    var movesIndicesTmp = "";
    var username = ""
    
    
    movesTmp = getHashVar("moves");
    movesIndicesTmp = getHashVar("move-indices");
    
    if (movesTmp != ""){
        moveIds = movesTmp.split("+");
        console.log("moves::> " + movesTmp);        
    }else if (movesIndicesTmp != "" ){
        console.log("move-indices::> " + movesIndicesTmp);
        movesIndices = parseIndices(movesIndicesTmp);
        username = $('.username span').text().split(" ")[1];

        $.ajaxSetup({async: false});
        $.get("/Move/MoveList?username="+username, function(AllMoves){
            console.log(AllMoves);
            movesIndices.forEach(function(selInd){
                console.log(AllMoves.Data[selInd][0]);
                moveIds.push(AllMoves.Data[selInd][0]);
            })
            
            
        
        })
        
    }else {
        $('a[data-id^="move-"] i.active').each(function() {
            moveIds.push($(this).parent().attr('data-id').substring(5));
        });
    }

    if (confirm("This will export " + moveIds.length + " in format: " + format + ". Press Ok to export or Cancel to abort.")) {
        _.each(moveIds, function(moveId) {
            var urlstring = 'http://www.movescount.com/move/export?id=' + moveId + '&format=';
            if (format === 'all') {                              
                _.forOwn(formats, function(f) {
                    if (f !== 'all') {
                        try {                    
                            wins.push(window.open(urlstring + f));
                        } catch (err) {
                            window.alert("Error: " + err.toString );
                        }
                    }
                });
            } else {     
                try {
                    wins.push(window.open(urlstring + format));
                } catch (err) {
                    window.alert("Error: " + err.toString);
                }
            }
        });
    } else {
        window.alert("Cancelled!");
    }
}

function deleteMoves() {
    var moveIds = [];
    var movesIndices = [];
    var wins = [];
    
    var movesTmp = "";
    var movesIndicesTmp = "";
    var username = "";
    
    
    movesTmp = getHashVar("moves");
    movesIndicesTmp = getHashVar("move-indices");
    
    if (movesTmp != ""){
        moveIds = movesTmp.split("+");
        console.log("moves::> " + movesTmp);        
    }else if (movesIndicesTmp != "" ){
        console.log("move-indices::> " + movesIndicesTmp);
        movesIndices = parseIndices(movesIndicesTmp);
        username = $('.username span').text().split(" ")[1];

        $.ajaxSetup({async: false});
        $.get("/Move/MoveList?username="+username, function(AllMoves){
            console.log(AllMoves);
            movesIndices.forEach(function(selInd){
                console.log(AllMoves.Data[selInd][0]);
                moveIds.push(AllMoves.Data[selInd][0]);
            });
            
            
        
        });
        
    }else {
        $('a[data-id^="move-"] i.active').each(function() {
            moveIds.push($(this).parent().attr('data-id').substring(5));
        });
    }

    if (confirm("This will delete " + moveIds.length + " moves! Forever! No way to undo!")) {
        _.each(moveIds, function(moveId) {
            var urlstring = 'http://www.movescount.com/move/export?id=' + moveId + '&format=';
            try {
                $.post( "/move/delete", { id: moveId } );
            } catch (err) {
                window.alert("Error: " + err.toString);
            }
        });
        // location.reload(true);
    } else {
        window.alert("Cancelled!");
    }    
}


var formats = {
    GPX: 'gpx',
    KML: 'kml',
    XLSX: 'xlsx',
    FIT: 'fit',
    TCX: 'tcx',
    'All Formats': 'all',
};

setInterval(function() {    
    var toolsItem = $('a[data-action="toggleShowPastPlannedMoves"]');
    var sentinel = toolsItem.closest('ul').children('li.batchExporter');
    if (!sentinel || sentinel.length === 0) {
        _.forOwn(formats, function(format, name) {    
            var li = $('<li class="batchExporter"></li>');
            var link = $('<a style="text-align: left;">Export selected as ' + name + '.</a>');
            link.click(function() {
                exportMoves(format);
                return false; 
            });
            li.append(link);
            toolsItem.closest('li').before(li);
        });

        var li = $('<li class="batchDelete"></li>');
        var link = $('<a style="text-align: left;">Delete selected</a>');
        link.click(function() {
            deleteMoves();
            return false; 
        });
        li.append(link);
        toolsItem.closest('li').before(li);
        
    }
}, 1000);
