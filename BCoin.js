var positions = [];
var data = [70];
var cash = 1000;
var dailystart;
var endme = 180;
var overallprice;
var ticker = window.setInterval(determineNewPrice , 1000);
function determineNewPrice(){
    if (data.length!=endme){
var price = Number(document.getElementById("current-price").innerHTML.replace("£",""));
var newPriceMultiplier = Math.random()*11;
var upordown = Math.floor(Math.random()*101);
if (upordown<46){
    var newPrice = (price*(1-(newPriceMultiplier/100))).toFixed(2);
};
if (upordown>45){
   var newPrice = (price/(1-(newPriceMultiplier/100))).toFixed(2);
}
    overallprice=newPrice;
document.getElementById("current-price").innerHTML="£"+newPrice;
document.getElementById("current-cash").innerHTML="£"+cash.toFixed(2);
var newblock = {};
    if(dailystart==undefined){
        dailystart=price;
    }
if (dailystart!=undefined){
    document.getElementById("current-percent").innerHTML = (((newPrice - dailystart)/dailystart)*100).toFixed(2) + "%";
    if((((newPrice - dailystart)/dailystart)*100)>0){document.getElementById("current-percent").style.color="green"};
     if((((newPrice - dailystart)/dailystart)*100)<0){document.getElementById("current-percent").style.color="red"};
}
    var dataobject = {};
    dataobject[new Date()] = newPrice;
    data.push(Number(newPrice));
newblock["date"] = new Date();
newblock["oldprice"] = price;
newblock["currentprice"] = newPrice;
    generateOrderSummary();
    calculateProfits();
    generateGraph();  
}

if(data.length==endme){
    gameOver();
    window.clearInterval(ticker);
}
}
function generateOrderSummary(){
    var amountofcoin = document.getElementById("order-number").value;
    var priceoforder = amountofcoin*overallprice;
    document.getElementById("order-summary").innerHTML ="<h3>"+ amountofcoin +" KanwarCoin will cost you £" + priceoforder.toFixed(2); 
    if (amountofcoin=="0"||amountofcoin==""){ document.getElementById("order-summary").innerHTML=""};
}
function buyCoin(){
    var position = {};
    var amountofcoins = document.getElementById("order-number").value;
if((amountofcoins*overallprice)<cash&&positions.length<5&&amountofcoins!=""&&amountofcoins!=null){
position["coins"] = amountofcoins;
position["price"] = overallprice;
    document.getElementById("portfolio").innerHTML+="<div class='portfolio-bit'><h5 class='position-amount'>"+amountofcoins+ " @ £" + overallprice + "</h5><h5 class='profit'></h5><h5 class='profit-percent'></h5><div class='sell-button' onclick='sellCoin("+(positions.length)+")'>Sell</div></div>";
    positions.push(position);
   cash = cash-(amountofcoins*overallprice);
    document.getElementById("current-cash").innerHTML = "£"+cash.toFixed(2);
}
}
function calculateProfits(){
    var i;
    var profitnumbers = document.getElementsByClassName("profit");
    var profitpercents = document.getElementsByClassName("profit-percent");
    for (i=0;i<positions.length;i++){
        var profit = (positions[i].coins * overallprice) - (positions[i].coins * positions[i].price);
        profitnumbers[i].innerHTML = "£" + profit.toFixed(2);
        profitpercents[i].innerHTML = ((((positions[i].coins * overallprice) - (positions[i].coins * positions[i].price))/ (positions[i].coins * positions[i].price))*100).toFixed(2) + "%";
        if (((((positions[i].coins * overallprice) - (positions[i].coins * positions[i].price))/ (positions[i].coins * positions[i].price))*100).toFixed(2)>0){profitpercents[i].style.color="green"};
        if (((((positions[i].coins * overallprice) - (positions[i].coins * positions[i].price))/ (positions[i].coins * positions[i].price))*100).toFixed(2)<0){profitpercents[i].style.color="red"};
    }
}
function sellCoin(posofpos){
     var moneymade  = 0;
    if (posofpos=="all"){
    var i;
    for (i=0;i<positions.length;i++){
        moneymade += (positions[i].coins*overallprice);
    }
               positions = [];
    document.getElementById("portfolio").innerHTML="";
    }
    if(posofpos!="all"){
        moneymade = positions[posofpos].coins*overallprice;
        positions.splice(posofpos,1);
        var bits = document.getElementsByClassName("portfolio-bit");
        var i;
        var newcode= "";
        for(i=0;i<bits.length;i++){
            if (i!=posofpos){
                newcode+=bits[i].outerHTML;
            }
        }
         document.getElementById("portfolio").innerHTML=newcode;
    }
    cash = cash + moneymade;
    document.getElementById("current-cash").innerHTML = "£" +cash.toFixed(2);
    calculateProfits();
}
function generateGraph(){
    var topvalue = (Math.max(...data)*1.4);
    var graphheightbit = (document.getElementById("graph").clientHeight/100);
    var graphwidthbit = (document.getElementById("graph").clientWidth/endme);
    var svgcode="";
    var i;
    for (i=1;i<data.length;i++){
        var verticalpercent = 1-(data[i]/topvalue);
        var oldverticalpercent = 1-(data[i-1]/topvalue);
        var color;
        if (verticalpercent<oldverticalpercent){color="green"};
         if (verticalpercent>oldverticalpercent){color="orangered"};
        var oldverticalplacement = document.getElementById("graph").clientHeight * oldverticalpercent;
        var verticalplacement = document.getElementById("graph").clientHeight * verticalpercent;
        var horizontalplacement = (i+1) * graphwidthbit;
        var oldhorizontalplacement = (i) * graphwidthbit;
        var linecode = "<line x1='"+oldhorizontalplacement+"' y1='"+oldverticalplacement+"' x2='"+horizontalplacement+"' y2='"+verticalplacement+"' style='stroke:"+color+";stroke-width:1.5' />"
        svgcode+=linecode;
    }
    document.getElementById("graph").innerHTML=svgcode;
}
function gameOver(){
    document.getElementById("top-stats").style.display="none";
     document.getElementById("visuals").style.display="none";
    document.getElementById("game-over").style.display="block";
    document.getElementById("game-over").innerHTML="You ended up with £"+cash.toFixed(2);
}