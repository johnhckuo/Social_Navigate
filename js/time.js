var currentMonth = 5;
var fill = d3.scale.category20();
var data;
var sectorArticleNumber = [];
var sectorArticleSector = [];
var fileArray = ["台東","台北","台中","台南","宜蘭","花蓮","南投","屏東","苗栗","桃園","馬祖","高雄","基隆","新北","連江","雲林","新竹","嘉義","彰化","澎湖"]
var dynamicArray=["台東", "高雄", "台中", "台東", "台北"]
var dynamicCount =0;
var sectorCount = 0;
var scale = 12500;
var totalMonth = 5;
var currentType = 0;
var typeArray = ['美食','旅遊']
var geocoder;
var currentCity;
var randomClickCount = 0;
var lastCity = '';
var chart1DataPoint = [];
var chart2DataPoint = [];
var chart3DataPoint = [];
var chart4DataPoint = [];
var chart5DataPoint = [];

var food1DataPoint = [];
var food2DataPoint = [];
var food3DataPoint = [];
var food4DataPoint = [];
var food5DataPoint = [];
$(document).ready(function(){

$(".footer_time").hover(function(){
    $(".panel").slideToggle("fast");
  });


drawTaiwan()
$("#monthText").html(currentMonth+"月份");
$("#typeText").html(typeArray[currentType]);
$("#bg").hide();
$("#sliderBG").hide();
var cloudFile = new XMLHttpRequest();
cloudFile.open("GET", "cloud/台北市.json", true);
cloudFile.onreadystatechange = function ()
{
    if(cloudFile.readyState === 4)
    {
        if(cloudFile.status === 200 || cloudFile.status == 0)
        {
            var allText = cloudFile.responseText;
            //console.log(allText);
            $("#LoadingImage").hide();

     
            data = JSON.parse(allText)

            d3.layout.cloud().size([500, 500])
            .words(data.map(function(d) {
              return {text: d.word, size: d.weight};
            }))
            .padding(5)
            .rotate(function() { return ~~(Math.random() * 2) * 90; })
            .font("Impact")
            .fontSize(function(d) { return d.size; })
            .on("end", draw)
            .start();


        }
    }
}
cloudFile.send(null);




sectorArticle(currentMonth, typeArray[currentType])
accessLocation();

var carousel = document.getElementById('carousel'),
    navButtons = document.querySelectorAll('#navigation button'),
    panelCount = carousel.children.length,
    transformProp = Modernizr.prefixed('transform'),
    theta = 0,

    onNavButtonClick = function( event ){
      var increment = parseInt( event.target.getAttribute('data-increment') );
      theta += ( 360 / panelCount ) * increment * -1;
      carousel.style[ transformProp ] = 'translateZ( -288px ) rotateY(' + theta + 'deg)';
    };

for (var i=0; i < 2; i++) {
  navButtons[i].addEventListener( 'click', onNavButtonClick, false);
}


dynamicDiagram(0, 1, "travel")
dynamicDiagram(0, 1, "food")
});


function accessLocation(){
  if (navigator.geolocation) {
      //navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  } 
  //geocoder = new google.maps.Geocoder();
}
  
//Get the latitude and the longitude;
function successFunction(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    codeLatLng(lat, lng)
}

function errorFunction(){
    alert("Geocoder failed");
}


function codeLatLng(lat, lng) {

  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
    //console.log(results)
      if (results[1]) {
       //formatted address
       //alert(results[0].formatted_address)
      //find country name
           for (var i=0; i<results[0].address_components.length; i++) {
          for (var b=0;b<results[0].address_components[i].types.length;b++) {

          //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
              if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                  //this is the object you are looking for
                  city= results[0].address_components[i];
                  break;
              }
          }
      }
      //city data
      //alert(city.short_name + " " + city.long_name)
      currentCity = city.short_name;
      $("#place").attr("value",currentCity);
      } else {
        alert("No results found");
      }
    } else {
      alert("Geocoder failed due to: " + status);
    }
  });
}
function showVal(value, type){
  if (type == "month"){
    switch(value){
      case "+":
        if (currentMonth == totalMonth-1)
          currentMonth = totalMonth;
        else
          currentMonth = (currentMonth+1)%totalMonth;
        break;
      case "-":
        if (currentMonth == 1)
          currentMonth = totalMonth;
        else
          currentMonth = (currentMonth-1)%totalMonth;

        break;
    }
    $("#monthText").html(currentMonth+"月份");
    
  }else{
    switch(value){
      case "+":
        if (currentType == 1)
          currentType = 0;
        else
          currentType = 1;
        break;
      case "-":
        if (currentType == 0)
          currentType = 1;
        else
          currentType = 0;

        break;
    }
    $("#typeText").html(typeArray[currentType]);
  }
  sectorArticle(currentMonth, typeArray[currentType]);
}


function updateInput(ish){
    $("#place").attr("value", ish);
}

function randomQuery(type){

  var city = $("#place").attr("value").substring(0,2);
  if (city != lastCity){
    randomClickCount =0;
  }
  lastCity = city
 
  var d = new Date();
  var month = d.getMonth();

    var frequency = [];


    var file = "data/關鍵詞/"+city+".json";
    
    var rawFile = new XMLHttpRequest();
          
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {

            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                //console.log(allText);
                
                

                ajaxFile = JSON.parse(allText)
                for (var i = 0 ; i < 5 ; i ++){
                  $("figure:nth-child("+(i+1)+")").html(ajaxFile[i].word)  ;  
                }
                //alert(ajaxFile[randomClickCount++].word)
                randomClickCount++
                $("#sliderBG").fadeIn(1000);
              
            }
        }
    }
    
    rawFile.send(null);

}

function drawTaiwan(){
	var type='county';
	
	var Cname = 'C_Name';

	d3.json(type+".js", function(topodata) {
     // features = topojson.feature(topodata, topodata.objects.country).features;
      // 這裡要注意的是 topodata.objects["county"] 中的 "county" 為原本 shp 的檔名
  this.topodata = topodata;

  features = topojson.feature(topodata, topodata.objects[type]).features;
  
    path = d3.geo.path().projection( // 路徑產生器
    d3.geo.mercator().center([121,24]).scale(scale) // 座標變換函式
  );

    
  d3.select("#pathCanvas").selectAll("path").data(features).enter().append("path").attr({
    d: path,
    name: function(d){
      return d.properties[Cname];
    },
    fill:'rgba(0,0,0,.5)'
 });

  d3.select("#pathCanvas").append("path")         //縣市/行政區界線
    .datum(topojson.mesh(topodata, topodata.objects[type], function(a, b) { return a !== b ; }))
    .attr("d", path)
    .attr("id", "county-boundary");
var originalColor;
d3.select("svg").selectAll("path").on("mouseenter", function() {          //title div 顯示滑鼠所指向的縣市/行政區
	  $('#panel').css("display","inline");
      originalColor = $(this).attr("fill");
      $(this).attr("fill", 'rgba(255,255,255,.5)');
      $('#title').html($(this).attr( "name" ));
      $('#panel').css({"height": "40px","width": "70px"});
    }).on("mouseout", function() {
      $(this).attr("fill", originalColor);
    });   

d3.select("svg").selectAll("path").on("mousedown", function() { 
  var path = "data/"+typeArray[currentType]+"/"+currentMonth+"/"+$(this).attr( "name" ) +".json";

  readTextFile(path)
});

    $("path").mouseover(function(){                   //info 區塊跟隨滑鼠移動
    $("path").mousemove( function(e) {
     mouseX = e.pageX; 
     mouseY = e.pageY;
    });  
    $('#panel').css({'top':mouseY,'left':mouseX}).fadeIn('slow');
  });

});

}

function readTextFile(file)
{

    $("#bg").fadeOut(1000);

    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                //console.log(allText);
                $("#LoadingImage").hide();
                $("#bg").fadeIn(1000);
         
                parseJSON(allText)

            }
        }
    }
    rawFile.send(null);
}




function sectorArticle(month, type){

    if (sectorCount == fileArray.length-1){
      console.log(month)
      var total = 0;
      for (var i = 0 ; i < sectorArticleNumber.length ; i++){
        total += sectorArticleNumber[i];
      }
      //console.log(sectorArticleNumber)
      
     // var color = d3.scale.linear().domain([0,10]).range(["#CCEEFF","#770077"]);
      var path = d3.geo.path().projection( // 路徑產生器
        d3.geo.mercator().center([121,24]).scale(scale) // 座標變換函式
      );
      for (var i = 0 ; i < sectorArticleNumber.length; i++){
        $('path').each(function() {
              var color;
              
              var temp = sectorArticleNumber[i]/parseFloat(total);
              if (temp>0.13)
                color = '#F26419';
              else if (temp>0.09)
                color = '#F6AE2D';
              else if (temp>0.05)
                color = '#55DDE0';
              else if (temp>0.01)
                color = '#33658A';
              else if (temp>0)
                color = '#2F4858' ;
              //   color = '#B2BD7E';
              // else if (temp>0.09)
              //   color = '#F6FEAA';
              // else if (temp>0.05)
              //   color = '#ECFEE8';
              // else if (temp>0.01)
              //   color = '#B9FAF8';
              // else if (temp>0)
              //   color = '#93E1D8' ;

              $('[name="'+sectorArticleSector[i]+'"]').attr("fill", color);

          })
      }
      $("#LoadingImage").hide();
    sectorCount = 0;
    sectorArticleNumber = []
    return;

    }
    //$("#LoadingImage").show();
 

    var file = "data/"+type+"/"+month+"/"+fileArray[sectorCount]+".json";
    
    var rawFile = new XMLHttpRequest();
          
    rawFile.open("GET", file, true);

    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {

            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                //console.log(allText);
                
                

                ajaxFile = JSON.parse(allText)
                //console.log(ajaxFile[0])
                //console.log(ajaxFile.length)
                sectorArticleSector.push(fileArray[sectorCount]);
                sectorArticleNumber.push(ajaxFile.length);

              sectorCount++;
              sectorArticle(month, type);
              
            }
        }
    }
    
    rawFile.send(null);


}


function switchMonth(month){
  currentMonth = month;

}

function hide(){
  $("#bg").fadeOut(1000);

}
function sliderHide(){

  $("#sliderBG").fadeOut(1000);
}
function parseCSV(inputFile) {
  var isInputANSI = true;
  var fileReader = new FileReader();
  fileReader.onload = function(e) {
    result = fileReader.result;

  };
  if (isInputANSI === true) {
    fileReader.readAsText(inputFile, 'big5');
  } else {
    fileReader.readAsText(inputFile);
  }
  $("#articleContent").html(result);
}

function parseJSON(ajaxFile) {
  var author = [];
  var link = [];
  var title = [];
  var tempAuthor;
  var tempLink;
  var tempTitle;
  ajaxFile = JSON.parse(ajaxFile)
  for(var i = 0 ; i < ajaxFile.length; i ++){

  
    tempAuthor = ajaxFile[i].作者;
    tempTitle = ajaxFile[i].文章標題;
    tempLink = ajaxFile[i].連結;

    author.push(tempAuthor)
    title.push(tempTitle)
    link.push(tempLink);
  }
  var table = $('<table></table>').addClass('table table-inverse table-hover');
  var thead = $('<thead></thead>')
  var tbody = $('<tbody></tbody>')
  var headRow = $('<tr></tr>');
  var headContent = $("<th>作者</th><th>文章標題</th>");
  headRow.append(headContent);
  thead.append(headRow);
  for( var i = 0 ; i < author.length; i++){
    var row = $('<tr></tr>');
    var innerContent = $('<td>'+author[i]+'</td><td><a href='+link[i]+'>'+title[i]+'</a></td>');
    row.append(innerContent);
    tbody.append(row);
  }

table.append(thead);
table.append(tbody);
$("#articleContent").append(table);
  
}

function parseWEIGHTJSON(ajaxFile) {
  var word = [];
  var weight = [];
  var tempWord;
  var tempWeight;
  ajaxFile = JSON.parse(ajaxFile)
  for(var i = 0 ; i < ajaxFile.length; i ++){

  
    tempWord = ajaxFile[i].FIELD1;
    tempWeight = ajaxFile[i].FIELD2;

    word.push(tempWord)
    weight.push(tempWeight)
  }
  var table = $('<table></table>').addClass('table table-inverse table-hover');
  var thead = $('<thead></thead>')
  var tbody = $('<tbody></tbody>')
  var headRow = $('<tr></tr>');
  var headContent = $("<th>關鍵字</th><th>出現次數</th>");
  headRow.append(headContent);
  thead.append(headRow);
  for( var i = 0 ; i < word.length; i++){
    var row = $('<tr></tr>');
    var innerContent = $('<td>'+word[i]+'</td><td>'+weight[i]+'</td>');
    row.append(innerContent);
    tbody.append(row);
  }

table.append(thead);
table.append(tbody);
$("#articleContent").append(table);
  
}





function dynamicDiagram(city, month, type){


if (type == "travel"){
  if (month == 6){
    if (city == dynamicArray.length-1){
      drawCanvas()
      return;
    }else{

      city++;
      month = 1;
     
    }
 
  }
  var file = "data/旅遊/"+month+"/"+dynamicArray[city]+".json";
  var rawFile = new XMLHttpRequest();
      
rawFile.open("GET", file, true);

rawFile.onreadystatechange = function ()
{
    if(rawFile.readyState === 4)
    {

        if(rawFile.status === 200 || rawFile.status == 0)
        {
            var allText = rawFile.responseText;
            //console.log(allText);
            
            

            ajaxFile = JSON.parse(allText)
            //console.log(ajaxFile[0])
            //console.log(ajaxFile.length)
        
          //              {x: new Date(2012, 7), y: 21000},
          // {x: new Date(2012, 8), y: 22000},
          // {x: new Date(2012, 9), y: 25000},
          // {x: new Date(2012, 10), y: 23000},
          // {x: new Date(2012, 11), y: 25000},
          // {x: new Date(2013, 0), y: 26000},
          // {x: new Date(2013, 1), y: 25000}
          if (city == 0){

            chart1DataPoint.push({x:month, y: ajaxFile.length})
          }else if (city == 1){
            chart2DataPoint.push({x:month, y: ajaxFile.length})

          }else if (city == 2){
            chart3DataPoint.push({x:month, y: ajaxFile.length})
          }else if (city == 3){
            chart4DataPoint.push({x:month, y: ajaxFile.length})
          }else if (city == 4){
            chart5DataPoint.push({x:month, y: ajaxFile.length})
          }         
          month++;
          dynamicDiagram(city, month, type);
 
          
        }
    }
}

rawFile.send(null);

}else{

  if (month == 6){
    if (city == dynamicArray.length-1){
      drawFoodCanvas()
      return;
    }else{

      city++;
      month = 1;
     
    }
 
  }
  var file = "data/美食/"+month+"/"+dynamicArray[city]+".json";
  var rawFile = new XMLHttpRequest();
      
rawFile.open("GET", file, true);

rawFile.onreadystatechange = function ()
{
    if(rawFile.readyState === 4)
    {

        if(rawFile.status === 200 || rawFile.status == 0)
        {
            var allText = rawFile.responseText;
            //console.log(allText);
            
            

            ajaxFile = JSON.parse(allText)
            //console.log(ajaxFile[0])
            //console.log(ajaxFile.length)
        
          //              {x: new Date(2012, 7), y: 21000},
          // {x: new Date(2012, 8), y: 22000},
          // {x: new Date(2012, 9), y: 25000},
          // {x: new Date(2012, 10), y: 23000},
          // {x: new Date(2012, 11), y: 25000},
          // {x: new Date(2013, 0), y: 26000},
          // {x: new Date(2013, 1), y: 25000}
          if (city == 0){

            food1DataPoint.push({x:month, y: ajaxFile.length})
          }else if (city == 1){
            food2DataPoint.push({x:month, y: ajaxFile.length})

          }else if (city == 2){
            food3DataPoint.push({x:month, y: ajaxFile.length})
          }else if (city == 3){
            food4DataPoint.push({x:month, y: ajaxFile.length})
          }else if (city == 4){
            food5DataPoint.push({x:month, y: ajaxFile.length})
          }         
          month++;
          dynamicDiagram(city, month, type);
 
          
        }
    }
}

rawFile.send(null);

}


}



function draw(words) {
    var randomColor = "#"+Math.floor(Math.random()*16777215).toString(16);
    d3.select(".p03").append("svg")
      .attr("width", '100vw')
      .attr("height", '100vh')
    .append("g")
      .attr("transform", "translate(700,300)")
    .selectAll("text")

      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "微軟正黑體")
      .style("fill", function(d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {

        return "translate(" + [d.x*2, d.y] + ")rotate(" + d.rotate + ")";
      })
      .append("a")
      .attr("href", "#")
      .text(function(d) { return d.text; });
}

function isScrolledIntoView(elem)
{
    var $elem = $(elem);
    var $window = $(window);

    var docViewTop = $window.scrollTop();
    var docViewBottom = docViewTop + $window.height();

    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function sliderBTN(type){
  alert("g")
    var carousel = new Carousel3D( document.getElementById('carousel') );
    
    if (type == "previous"){

      var increment = -1;
      carousel.rotation += carousel.theta * increment * -1;
      carousel.transform();
    }else{
        var increment = 1;
        carousel.rotation += carousel.theta * increment * -1;
        carousel.transform();
    }

}

function drawCanvas(){

 



var chart2 = new CanvasJS.Chart("chartContainer2",
    {      
        title:{
            text: "各縣市「旅遊」貼文討論曲線圖",
          fontFamily: "微軟正黑體" 
        },
        animationEnabled: true,
        axisY :{
            includeZero: false,
          labelFontFamily: "微軟正黑體",
          labelFontColor: "black"
        },
        toolTip: {
            shared: true,
            content: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span> <span style='\"'color: dimgrey;'\"'>{y}篇</span> ",
          labelFontFamily: "微軟正黑體" 
        },
        axisX:{
          interval: 1,
          suffix: " 月份",
          labelFontColor: "black"
        },
        legend: {
            fontSize: 13
        },
        backgroundColor: "transparent",
        data: [
        {        
            type: "stackedArea", 
            showInLegend: true,
            name: dynamicArray[0],
            color: "rgba(54,158,173,.6)",
            dataPoints: chart1DataPoint
        },
        {        
            type: "stackedArea", 
            showInLegend: true,
            name: dynamicArray[1],        
            color: "rgba(134,180,2,.7)",
            dataPoints: chart2DataPoint
        },
        {        
            type: "stackedArea", 
            showInLegend: true,
            name: dynamicArray[2],
            color: "rgba(194,70,66,.6)",        
            dataPoints: chart3DataPoint
        },
        {        
            type: "stackedArea", 
            showInLegend: true,
            color: "rgba(127,96,132,.6)",        
            name: dynamicArray[3],
            dataPoints: chart4DataPoint
        },
        {        
            type: "stackedArea", 
            showInLegend: true,
            color: "rgba(255,0,0,.6)",        
            name: dynamicArray[4],
            dataPoints: chart5DataPoint
        }  

        ]
    });

  chart2.render();





  }


function drawFoodCanvas(){
  var chart1 = new CanvasJS.Chart("chartContainer",
    {      
        title:{
            text: "各縣市「美食」貼文討論曲線圖",
          fontFamily: "微軟正黑體" 
        },
        animationEnabled: true,
        axisY :{
            includeZero: false,
          labelFontFamily: "微軟正黑體",
          labelFontColor: "black"
        },
        toolTip: {
            shared: true,
            content: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span> <span style='\"'color: dimgrey;'\"'>{y}篇</span> ",
          labelFontFamily: "微軟正黑體" 
        },
        axisX:{
          interval: 1,
          suffix: " 月份",
          labelFontColor: "black"
        },
        legend: {
            fontSize: 13
        },
        backgroundColor: "transparent",
        data: [
        {        
            type: "stackedArea", 
            showInLegend: true,
            name: dynamicArray[0],
            color: "rgba(54,158,173,.6)",
            dataPoints: food1DataPoint
        },
        {        
            type: "stackedArea", 
            showInLegend: true,
            name: dynamicArray[1],        
            color: "rgba(134,180,2,.7)",
            dataPoints: food2DataPoint
        },
        {        
            type: "stackedArea", 
            showInLegend: true,
            name: dynamicArray[2],
            color: "rgba(194,70,66,.6)",        
            dataPoints: food3DataPoint
        },
        {        
            type: "stackedArea", 
            showInLegend: true,
            color: "rgba(127,96,132,.6)",        
            name: dynamicArray[3],
            dataPoints: food4DataPoint
        },
        {        
            type: "stackedArea", 
            showInLegend: true,
            color: "rgba(255,0,0,.6)",        
            name: dynamicArray[4],
            dataPoints: food5DataPoint
        }  

        ]
    });

  chart1.render();
}




  var transformProp = Modernizr.prefixed('transform');

  function Carousel3D ( element ) {
    this.element = element;

    this.rotation = 0;
    this.panelCount = 0;
    this.totalPanelCount = this.element.children.length;
    this.theta = 0;

    this.isHorizontal = true;

  }

  Carousel3D.prototype.modify = function() {

    var panel, angle, i;

    this.panelSize = this.element[ this.isHorizontal ? 'offsetWidth' : 'offsetHeight' ];
    this.rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
    this.theta = 360 / this.panelCount;

    // 計算整體大小

    this.radius = Math.round( ( this.panelSize / 2) / Math.tan( Math.PI / this.panelCount ) ) +500;

    for ( i = 0; i < this.panelCount; i++ ) {
      panel = this.element.children[i];
      angle = this.theta * i;
      panel.style.opacity = 1;
      panel.style.backgroundColor = 'rgba(0,0,0, 0.8)';
      // 旋轉

      panel.style[ transformProp ] = this.rotateFn + '(' + angle + 'deg) translateZ(' + this.radius + 'px)';
    }

    // 隱藏其他圖片
    for (  ; i < this.totalPanelCount; i++ ) {
      panel = this.element.children[i];
      panel.style.opacity = 0;
      panel.style[ transformProp ] = 'none';
    }

    // adjust rotation so panels are always flat
    this.rotation = Math.round( this.rotation / this.theta ) * this.theta;

    this.transform();

  };

  Carousel3D.prototype.transform = function() {
    // 旋轉
    this.element.style[ transformProp ] = 'translateZ(-' + this.radius + 'px) ' + this.rotateFn + '(' + this.rotation + 'deg)';
  };



var sliderInit = function() {


      var carousel = new Carousel3D( document.getElementById('carousel') );
          //panelCountInput = document.getElementById('panel-count'),
          //axisButton = document.getElementById('toggle-axis'),
          //navButtons = document.querySelectorAll('#navigation button'),



      setTimeout( function(){
        document.body.addClassName('ready');
      }, 0);

      carousel.panelCount = 5;
      carousel.modify();
      

};



window.addEventListener( 'DOMContentLoaded', sliderInit, false);