/**;
 * Created by Aragderp on 4/16/2016.
 */
/* GLOBALS */

var width  = 1680;           // width of svg image
var height = 320;           // height of svg image
var margin = 20;            // amount of margin around plot area
var pad = margin / 2;       // actual padding amount
var radius = 4;             // fixed node radius
var yfixed = height - pad - radius - 20;  // y position for all nodes
var fap;
/* HELPER FUNCTIONS */

var contColahs = {};
    contColahs["Africa"] = "#1b9e77";
    contColahs["Oceania"] = "#d95f02";
    contColahs["Americas"] = "#7570b3";
    contColahs["Asia"] = "#e7298a";
    contColahs["Europe"] = "#66a61e";
    contColahs["Organization"] = "#e6ab02";
var minY = 1945;
var maxY = 1990;
var cc = 490;
var cc2 = -1;
var continentO = "Africa";
var mouseOutD = false;
var changego = false;

      
d3.csv("countrycodes.csv", function(error, countryNames) {
    d3.csv("conflicts.csv", function(error, data) {
        d3.csv("list2.csv", function(error, countryCodes) {
            d3.csv("continent.csv", function(error, continent) {
      var clicked = false;
      var clickedVars = [];

$( document ).ready(function() {
   
  $("#hiddenfield").change(function() {

          
    // Check input( $( this ).val() ) for validity here
        d3.select("#plot").selectAll(".node")
                .each(function(d,i){
                
                if(!mouseOutD){
                 
                    if(d.CountryCode == $("#hiddenfield").val()){
                            clicked = false;

                            mouseColor(d,i, this);
                        }
                     }
                     else{
                         if(d.CountryCode == $("#hiddenfield").val()){
                            mouseOut(d,i);
                         }
                     }
                });
            
            
    });
    
    
      $("#hiddenfield2").change(function() {

          $("#hiddenfield2").val("0");
                    d3.select("#ArcTooltip").remove();
                            d3.selectAll("[f=tool]").remove();
                            
                             d3.select("#plot").selectAll("ellipse")
                                .attr("class", function(da,ia){
                                    var bounds = $("#slider").rangeSlider("option", "bounds");
                                    clicked = false;
                                     clickedVars = [];
                                     d3.selectAll("[f=tool]").remove();
                                     
                                    var result = "notHighlight";
                                    
                                    if(da.start.slice(0,4) > minY && da.end.slice(0,4) < maxY){
                                        
                                       // result = "notHighlight";
                                       result = "link";
                                    }
                                    else{
                                        result = "hiddenLink";
                                    }
                                    
                                    return result;
                                });
                            
    });
    
 
});

     
      
    $("#slider").bind("valuesChanged", function(e, data){
        minY =  Math.floor(data.values.min);
        maxY = Math.ceil(data.values.max);

        updateLi();
		 drawParCoo(cc, continentO);
    /*    
       d3.select("#plot").selectAll("ellipse")
                                .attr("class", function(da,ia){
                                     clicked = false;
                                     clickedVars = [];
                                     d3.selectAll("[f=tool]").remove();
                                     
                                    var result = "notHighlight";
                                    
                                    
                                 
                                    
                                    if(da.start.slice(0,4) >=  Math.floor(data.values.min) && da.end.slice(0,4) <= Math.ceil(data.values.max)){
                                       
                                        result = "link";
                                        
                                        
                                    }
                                    else{
                                        result = "hiddenLink";
                                    }
                                    
                                    return result;
                                });
                                drawParCoo(cc, continentO);
                          d3.select("#plot").selectAll(".node")
                        .each(function(d,i){
                            if(d.CountryCode == cc2 && cc2 != -1){
                                mouseColor(d,i, this);
                                clicked = true;
                                clickedVars = [];
                                clickedVars.push(d);
                                clickedVars.push(i);
                                clickedVars.push(this);

                            }
                          }); 
        */
           
       });
       
       function updateLi(){
                  d3.select("#plot").selectAll("ellipse")
                                .attr("class", function(da,ia){
                                     clicked = false;
                                     clickedVars = [];
                                     d3.selectAll("[f=tool]").remove();
                                     
                                    var result = "notHighlight";
                                    
                                    
                                 
                                    
                                    if(da.start.slice(0,4) >=  minY && da.end.slice(0,4) <= maxY){
                                       
                                        result = "link";
                                        
                                        
                                    }
                                    else{
                                        result = "hiddenLink";
                                    }
                                    
                                    return result;
                                });
                               
                          d3.select("#plot").selectAll(".node")
                        .each(function(d,i){
                            if(d.CountryCode == cc2 && cc2 != -1){
                                mouseColor(d,i, this);
                                clicked = true;
                                clickedVars = [];
                                clickedVars.push(d);
                                clickedVars.push(i);
                                clickedVars.push(this);

                            }
                          }); 
       }
       
       
                
                
                function findCountryNameByCode(code){
                    var name = "empty";
                    countryNames.forEach(function(data){
                        if(data.CCode == code){
                            name = data.StateNme;
                        }

                    });

                    if(name == "empty"){
                        console.log("code", code);
                    }

                    return name;
                }

                function addTooltipCount(circle, i){
                    var x = parseFloat(circle.attr("cx"));
                    var y = parseFloat(circle.attr("cy"));
                    var r = parseFloat(circle.attr("r"));
                    var text = circle.attr("id");

                    var ArcTooltip = d3.select("#plot")
                        .append("text")
                        .text(text)
                        .attr("x", x)
                        .attr("y", y)
                        .attr("transform", "rotate(-90,"+(x - 5 )+","+283+")" )
                        // .attr("dy", -r * 2)
                        .attr("id", "ArcTooltip")
                        .attr("f","tool");
             
                }

// Generates a ArcTooltip for a SVG circle element based on its ID
                function addTooltip(circle) {
                    var x = parseFloat(circle.attr("cx"));
                    var y = parseFloat(circle.attr("cy"));
                    var r = parseFloat(circle.attr("r"));
                    var text = circle.attr("id");

                    var ArcTooltip = d3.select("#plot")
                        .append("text")
                        .text(text)
                        .attr("x", x)
                        .attr("y", y + 30)
                        .attr("dy", -r * 2)
                        .attr("id", "ArcTooltip")
                        .attr("f","tool");

                    var offset = ArcTooltip.node().getBBox().width / 2;

                    if ((x - offset) < 0) {
                        ArcTooltip.attr("text-anchor", "start");
                        ArcTooltip.attr("dx", -r);
                    }
                    else if ((x + offset) > (width - margin)) {
                        ArcTooltip.attr("text-anchor", "end");
                        ArcTooltip.attr("dx", r);
                    }
                    else {
                        ArcTooltip.attr("text-anchor", "middle");
                        ArcTooltip.attr("dx", 0);
                    }
                }

                /* MAIN DRAW METHOD */

// Draws an arc diagram for the provided undirected graph
                function arcDiagram() {
                    // create svg image
                    var svg  = d3.select("#arc")
                        .append("svg")
                        .attr("id", "arcS")
                        .attr("width", width)
                        .attr("height", height );

                    // create plot area within svg image
                    var plot = svg.append("g")
                        .attr("id", "plot")
                        .attr("transform", "translate(" + pad + ", " + pad + ")");

                    var nodes = countryCodes;
                    var links = data;

                    //add continent info
                    nodes.forEach(function(d,i){
                        continent.forEach(function(c, j){

                            if(c.name == findCountryNameByCode(d.CountryCode)){

                                d.continent = c.region;
                                d.subregion = c.subregion;
                                d.regioncode = c.regioncode;

                            }
                        });
                        if(d.continent == undefined){

                            d.continent = "Organization";
                            d.subregion = "Organization";
                            d.regioncode = 560;

                        }
                    });

                    // fix graph links to map to objects instead of indices
                    links.forEach(function(d, i) {
                        nodes.forEach(function(da,ia){
                            if(da.CountryCode == d.intervener){
                                d.source = nodes[ia];
                            }
                        });
                        nodes.forEach(function(da,ia){
                            if(da.CountryCode == d.target){
                                d.target = nodes[ia];
                            }
                        });
                    });

                    links.forEach(function(d,i) {
                        var pathCount = 0;
                        for (var j = 0; j < i; j++) {
                            var otherPath = links[j];
                            if (otherPath.source === d.source && otherPath.target === d.target) {
                                pathCount++;
                            }
                        }

                        d.pathCount = pathCount;
                    });

                    // must be done AFTER links are fixed
                    linearLayout(nodes);

                    // draw links first, so nodes appear on top
                    drawLinks(links);

                    // draw nodes last
                    drawNodes(nodes, links);
                    
                    
                    
                }

// Layout nodes linearly, sorted by group
                function linearLayout(nodes) {
                    // sort nodes by group


                    nodes.sort(function(a, b) {
                        return a.regioncode - b.regioncode;
                    })


                    // used to scale node index to x position
                    var xscale = d3.scale.linear()
                        .domain([0, nodes.length - 1])
                        .range([radius, width - margin - radius]);

                    // calculate pixel location for each node
                    nodes.forEach(function(d, i) {
                        d.x = xscale(i);
                        d.y = yfixed;
                    });
                }


                function filter(a){
                    var found = false;
                    var result = [];
                    a.forEach(function(d,i){
                        found = false;
                        a.forEach(function(da,ia){
                            if(ia > i){
                                if(da[0][0].id == d[0][0].id){
                                    found = true;
                                }
                            }
                        });
                        if(!found){
                            result.push(d);
                        }
                    });


                    return result;
                }
                
                

                function drawNodes(nodes, links) {


                    var gnodes = d3.select("#plot").selectAll("g.node")
                        .data(nodes)
                        .enter()
                        .append('g');

                    var nodes = gnodes.append("circle")
                        .attr("class", "node")
                        .attr("cc", function(d,i){return "c" + d.CountryCode;})
                        .attr("id", function(d, i) { return findCountryNameByCode(d.CountryCode); })
                        .attr("cx", function(d, i) { return d.x; })
                        .attr("cy", function(d, i) { return d.y; })
                        .attr("r", 5)
                        .style("fill",   function(d, i) { return contColahs[d.continent]; })
                        .on("mouseover", function(d, i) {
                          
                           clicked = false;
                           
                           mouseColor(d,i, this);


                        })
                        .on("mouseout",  function(d, i) {
                           
                           mouseOut(d,i);
                           updateLi();
                        })
                        .on('click',function(d,i){
                           
                            clicked = true;
                            clickedVars = [];
                            clickedVars.push(d);
                            clickedVars.push(i);
                            clickedVars.push(this);
                            cc = +d.CountryCode;
                            cc2 = +d.CountryCode;
                            continentO = d.continent;
                            drawParCoo(+d.CountryCode,d.continent);
                        });


                    nodes.append("text")
                        .attr("dx", function(d) { return 20; })
                        .attr("cy", ".35em")
                        .text(function(d) { return findCountryNameByCode(d.CountryCode);  });

                }
                
                function mouseOut(d,i){
                     if(clickedVars.length != 0){
                                mouseColor(clickedVars[0], clickedVars[1], clickedVars[2]);
                            }
                            else if(!clicked){
                            
                            d3.select("#ArcTooltip").remove();
                            d3.selectAll("[f=tool]").remove();
                            
                             d3.select("#plot").selectAll("ellipse")
                                .attr("class", function(da,ia){
                                    var bounds = $("#slider").rangeSlider("option", "bounds");
                                    clicked = false;
                                     clickedVars = [];
                                     d3.selectAll("[f=tool]").remove();
                                     
                                    var result = "notHighlight";
                                    
                                    if(da.start.slice(0,4) > minY && da.end.slice(0,4) < maxY){
                                        
                                       // result = "notHighlight";
                                       result = "link";
                                    }
                                    else{
                                        result = "hiddenLink";
                                    }
                                    
                                    return result;
                                });
                            }
                }
                
      
                
                //Provide the selected circle d,i and this var for it
                function mouseColor(d,i, vthis){
                            d3.selectAll("[f=tool]").remove(); //needed for clicking bug
                             var toolTips = [];
                     
                            addTooltip(d3.select(vthis));
                            var pushAttacker = [];
                            var pushDefender = [];
                            d3.select("#plot").selectAll("ellipse")
                                .attr("class", function(da,ia){
                                    var result = "link";
                                    var bool = 0;
                                    if( d3.select(this).attr("class") == "hiddenLink"){
                                     result = "hiddenLink";
                                    }
                                    else if(da.target == d){ 
                                        result = "highlightDefender";
                                        bool = 1;
                                    }
                                    else if(da.source == d){
                                        pushDefender.push(da);
                                        result = "highlightAttacker";
                                        bool = 2;                                        
                                    }
                                    else{
                                        result = "notHighlight";
                                    }
                                    
                                    if(bool != 0){

                                        if(bool == 1){
                                            toolTips.push(d3.select("[cc=c"+da.source.CountryCode+"]"));
                                        }
                                        else{
                                            toolTips.push(d3.select("[cc=c"+da.target.CountryCode+"]"));
                                        }

                                    }
                                    //red color
                                    return result;
                                });

                            toolTips = filter(toolTips);

                            toolTips.forEach(function(d, i){
                                addTooltipCount(d,i);
                            });
                }

                function drawLinks(links) {

                    var radians = d3.scale.linear()
                        .range([Math.PI / 2, 3 * Math.PI / 2]);

                    var arc = d3.svg.line.radial()
                        .interpolate("basis")
                        .tension(0)
                        .angle(function(d) { return radians(d); });
           


                    d3.select("#plot").selectAll(".ellipse-link")
                        .data(links)
                        .enter().append("ellipse")
                        .attr("class", "link")
                        .attr("id", function(d,i){ return i; })
                        .attr("cx", function(d) {

                            return (d.target.x - d.source.x) / 2 + radius;
                        })
                        .attr("cy", pad)
                        .attr("rx", function(d) {
                            return Math.abs(d.target.x - d.source.x) / 2;
                        })
                        .attr("ry", function(d) {
                            return 250 + d.pathCount * 5;
                        })
                        .attr("clip-path", "url(#clip)")
                        .attr("transform", function(d,i) {
                            var xshift = d.source.x - radius;
                            var yshift = yfixed;
                            return "translate(" + xshift + ", " + yshift + ")";
                        });


                    d3.select("#plot")
                        .append("clipPath")
                        .attr("id", "clip")
                        .append("rect")
                        .attr("x",-10000)
                        .attr("y",-height )
                        .attr("width", 1000000)
                        .attr("height", height);

                }


                arcDiagram();
            });
        });
    });
});