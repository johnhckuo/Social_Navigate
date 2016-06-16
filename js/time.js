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


drawCanvas();

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
});


function accessLocation(){
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  } 
  geocoder = new google.maps.Geocoder();
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
                color = 'purple';
              else if (temp>0.09)
                color = 'red';
              else if (temp>0.05)
                color = 'orange';
              else if (temp>0.01)
                color = 'yellow';
              else if (temp>0)
                color = 'green' ;
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





function dynamicDiagram(city){
  if (city == dynamicArray.length-1){
    if (month == 5){
      return;
    }else{
      month++;
      city = 0;
    }
 
  }

  var file = "data/travel/"+month+"/"+dynamicArray[city]+".json";
  
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

              chart1DataPoint
            sectorCount++;
            city++;
            sectorArticle(month, type);
            
          }
      }
  }
  
  rawFile.send(null);

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

    var chart1 = new CanvasJS.Chart("chartContainer",
    {
      zoomEnabled: true,
      animationEnabled: true,
      title:{
        text: "各地區關鍵字分布頻率",
        fontFamily: "微軟正黑體"         

      },
      axisX: {
        title:"地區",
        gridThickness: 1,
  tickThickness: 1,
        gridColor: "lightgrey",
        tickColor: "lightgrey",
        lineThickness: 0,
        fontFamily: "微軟正黑體" 
      },
      axisY:{
        title: "Rail Lines(total route-km)",              
        gridThickness: 1,
  tickThickness: 1,
        gridColor: "lightgrey",
        tickColor: "lightgrey",
        lineThickness: 0,
        valueFormatString:"#,##0k,.",
        maximum: 250000,
        interval: 50000,
        labelFontFamily: "微軟正黑體" 
        
      },
      backgroundColor: "transparent",
      data: [
      {        
        type: "bubble",     
        toolTipContent: "<span style='\"'color: {color};'\"'><strong>{label}</strong></span><br/> <strong>Land Area</strong> {x} mn sq. km <br/> <strong>Rail Road</strong> {y} km<br/> <strong>Population</strong> {z} mn",
        dataPoints: [
        { x: 9.14, y: 228513, z:309.34,  label:"US" },
        { x: 16.37, y: 85292, z:141.92,  label:"Russia" },
        { x: 9.327, y: 66239, z:1337,  label:"China" },
        { x: 9.09, y: 58345, z:34.12,  label:"Canada" },
        { x: 8.45, y: 29817, z:194.94,  label:"Brazil" },
        { x: 7.68, y: 8615, z:22.29,  label:"Australia" },
        { x: 2.97, y: 63974, z:1224.61,  label:"India" },
        { x: 2.73, y: 25023, z:40.41,  label:"Argentina" },
        { x: 1.94, y: 26704, z:113.42,  label:"Mexico" },
        { x: 1.21, y: 22051, z:49.99,  label:"SA" },
        { x: .547, y: 33608, z:65.07,  label:"France" },
        { x: .241, y: 31471, z:62.23,  label:"U.K" },
        { x: .348, y: 33708, z:81.77,  label:"Germany" },
        { x: .364, y: 20035, z:127.45,  label:"Japan" },
        { x: .995, y: 5195, z:81.12,  label:"Egypt" },
        { x: .743, y: 5352, z:17.11,  label:"Chile" }
        

        ]
      }
      ]
    });



    chart1.render();








var chart2 = new CanvasJS.Chart("chartContainer2",
    {      
        title:{
            text: "各縣市討論聲量曲線圖",
          fontFamily: "微軟正黑體" 
        },
        animationEnabled: true,
        axisY :{
            includeZero: false,
            prefix: "$ ",
          labelFontFamily: "微軟正黑體" 
        },
        toolTip: {
            shared: true,
            content: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span> <span style='\"'color: dimgrey;'\"'>${y}</span> ",
          labelFontFamily: "微軟正黑體" 
        },
        legend: {
            fontSize: 13
        },
        backgroundColor: "transparent",
        data: [
        {        
            type: "splineArea", 
            showInLegend: true,
            name: "Salaries",
            color: "rgba(54,158,173,.6)",
            dataPoints: [
            {x: new Date(2012, 2), y: 30000},
            {x: new Date(2012, 3), y: 35000},
            {x: new Date(2012, 4), y: 30000},
            {x: new Date(2012, 5), y: 30400},
            {x: new Date(2012, 6), y: 20900},
            {x: new Date(2012, 7), y: 31000},
            {x: new Date(2012, 8), y: 30200},
            {x: new Date(2012, 9), y: 30000},
            {x: new Date(2012, 10), y: 33000},
            {x: new Date(2012, 11), y: 38000},
            {x: new Date(2013, 0),  y: 38900},
            {x: new Date(2013, 1),  y: 39000}

            ]
        },
        {        
            type: "splineArea", 
            showInLegend: true,
            name: "Office Cost",        
            color: "rgba(134,180,2,.7)",
            dataPoints: [
            {x: new Date(2012, 2), y: 20100},
            {x: new Date(2012, 3), y: 16000},
            {x: new Date(2012, 4), y: 14000},
            {x: new Date(2012, 5), y: 18000},
            {x: new Date(2012, 6), y: 18000},
            {x: new Date(2012, 7), y: 21000},
            {x: new Date(2012, 8), y: 22000},
            {x: new Date(2012, 9), y: 25000},
            {x: new Date(2012, 10), y: 23000},
            {x: new Date(2012, 11), y: 25000},
            {x: new Date(2013, 0), y: 26000},
            {x: new Date(2013, 1), y: 25000}

            ]
        },
        {        
            type: "splineArea", 
            showInLegend: true,
            name: "Entertainment",
            color: "rgba(194,70,66,.6)",        
            dataPoints: [
            {x: new Date(2012, 2), y: 10100},
            {x: new Date(2012, 3), y: 6000},
            {x: new Date(2012, 4), y: 3400},
            {x: new Date(2012, 5), y: 4000},
            {x: new Date(2012, 6), y: 9000},
            {x: new Date(2012, 7), y: 3900},
            {x: new Date(2012, 8), y: 4200},
            {x: new Date(2012, 9), y: 5000},
            {x: new Date(2012, 10), y: 14300},
            {x: new Date(2012, 11), y: 12300},
            {x: new Date(2013, 0), y: 8300},
            {x: new Date(2013, 1), y: 6300}

            ]
        },
        {        
            type: "splineArea", 
            showInLegend: true,
            color: "rgba(127,96,132,.6)",        
            name: "Maintenance",
            dataPoints: [
            {x: new Date(2012, 2), y: 1700},
            {x: new Date(2012, 3), y: 2600},
            {x: new Date(2012, 4), y: 1000},
            {x: new Date(2012, 5), y: 1400},
            {x: new Date(2012, 6), y: 900},
            {x: new Date(2012, 7), y: 1000},
            {x: new Date(2012, 8), y: 1200},
            {x: new Date(2012, 9), y: 5000},
            {x: new Date(2012, 10), y: 1300},
            {x: new Date(2012, 11), y: 2300},
            {x: new Date(2013, 0), y: 2800},
            {x: new Date(2013, 1), y: 1300}

            ]
        }      

        ]
    });

  chart2.render();





var chart3 = new CanvasJS.Chart("chartContainer3",
  {
    title:{
      text: "各地區討論聲量比例",
      verticalAlign: 'top',
      horizontalAlign: 'left',
      fontFamily: "微軟正黑體" 
    },
    animationEnabled: true,
    backgroundColor: "transparent",
    data: [
    {        
      type: "doughnut",
      startAngle:20,
      toolTipContent: "{label}: {y} - <strong>#percent%</strong>",
      indexLabel: "{label} #percent%",

      dataPoints: [
        {  y: 67, label: "Inbox" },
        {  y: 28, label: "Archives" },
        {  y: 10, label: "Labels" },
        {  y: 7,  label: "Drafts"},
        {  y: 4,  label: "Trash"}
      ]
    }
    ]
  });
  chart3.render();

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