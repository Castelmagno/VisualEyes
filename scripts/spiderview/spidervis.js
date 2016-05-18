/**
 * Created by Joren on 9/03/2016.
 */



function prepareCanvas(){

    var canvas = d3.select("#spider-view").append("svg")
        .attr("id","canvas")
        .attr("height", "100%")
        .attr("width", "100%");

    return canvas;
}

var animSpeed = 2000;
var disableSlider = false;

$( document ).ready( drawSlider )

function drawSlider(sliderCanvas){
    var sliderCanvas = d3.select("#anim-speed").append("svg")
        .attr("id","slider-canvas")
        .attr("height", "100%")
        .attr("width", "100%");

    var width = document.getElementById('slider-canvas').clientWidth;
    var height = document.getElementById('slider-canvas').clientHeight;
    var minspeed = 3000;
    var maxspeed = 500;

    sliderCanvas.append("text").attr("id", "speed-text").text("Animation speed: 50%").attr("x", width/3).attr("y", 15);

    var range = [50, width-50];

    var drag = d3.behavior.drag()
        .on("drag", dragmove);

    function dragmove() {
        if(disableSlider){
            return;
        }
        var x = d3.event.x;
        var newX = Math.max(range[0], Math.min(x, range[1]));
        var percent = Math.round((newX - range[0])/(range[1]-range[0]) * 100);
        animSpeed = Math.round((minspeed+maxspeed) - (minspeed * (percent/100)));
        d3.select("#speed-text").text("Animation speed: " + percent + "%")
        d3.select(this).attr("cx", newX);
    }

    sliderCanvas.append("rect").attr("x", range[0]).attr("y", height - height/4- 9).attr("width", range[1]-range[0]).attr("height", 6).attr("fill", "#A6A6A6");
    var g = sliderCanvas.append("g");
    g.append("circle").attr("id", "slider-ball").attr("cx",range[0] + (range[1]-range[0])/2).attr("cy", height - height/4 - 6).attr("r", 15).attr("fill", "#00BBFA").call(drag);
    //sliderCanvas.append("circle").attr("cx",10).attr("cy", 10).attr("r", 10).attr("fill", "black");

}

var timeOuts = [];

function visualiseConflict(canvas, conflictNumber){
    d3.csv("conflicts.csv", function(error, data){
        d3.csv("countrycodes.csv", function(error, countryNames) {
            d3.csv("continent.csv", function(error, continent) {

                disableSlider = false;
                d3.select("#slider-ball").attr("fill", "#00BBFA");
                timeOuts.forEach(function(d){
                    clearTimeout(d);
                });

                d3.selection.prototype.moveToFront = function() {
                    return this.each(function(){
                        this.parentNode.appendChild(this);
                    });
                };

                canvas.selectAll("*").remove();

                canvas.append("svg:defs").selectAll("marker")
                    .data(["end1"])      // Different link/path types can be defined here
                    .enter().append("svg:marker")    // This section adds in the arrows
                    .attr("id", String)
                    .attr("viewBox", "0 -5 10 10")
                    .attr("refX",10)
                    .attr("refY", 0)
                    .attr("markerWidth", 5)
                    .attr("markerHeight", 5)
                    .attr("orient", "auto")
                    .append("svg:path")
                    .attr("d", "M0,-5L10,0L0,5");


                var width = document.getElementById('canvas').clientWidth;
                var height = document.getElementById('canvas').clientHeight;

                var linkdata = extractData(data);
                var nodedata = extractNodes(linkdata);

                var eventQueue = parseEvents(linkdata, countryNames);

                canvas.append("rect")
                    .attr("rx", 6)
                    .attr("ry", 6)
                    .attr("x", 75)
                    .attr("y", 20)
                    .attr("width", width-90)
                    .attr("height", 30)
                    .style("fill", "white")
                    .style("stroke", "black")
                    .style("stroke-width", "4");

                var timeBarGroup = canvas.append("g");



                canvas.append("image")
                    .attr("id", "playbutton")
                    .attr("x",10)
                    .attr("y",10)
                    .attr("width", 50)
                    .attr("height", 50)
                    .attr("xlink:href","images/play.png")
                    .on("click", togglePlay);

                var playing = false;
                var xCoords = drawTimeBar();
                function togglePlay() {
                    d = d3.select("#playbutton");
                    if(playing){
                        d.attr("xlink:href","images/play.png");
                        resetTimeBar();
                        xCoords = drawTimeBar();
                    }
                    else{
                        d.attr("xlink:href","images/stop.png");
                        animateTimeBar(xCoords);
                    }
                    playing = !playing;
                }

                function resetTimeBar(){
                    timeBarGroup.selectAll("*").remove();
                    disableSlider = false;
                    d3.select("#slider-ball").attr("fill", "#00BBFA");
                    timeOuts.forEach(function(d){
                       clearTimeout(d);
                    });
                    timeOuts = [];
                    canvas.selectAll(".spiderlink").attr('opacity', 1);
                }

                function drawTimeBar(){
                    var nbEvents = eventQueue.length;
                    var timeBarWidth = width-90;
                    var time = timeBarGroup.append("rect")
                        .attr("rx", 6)
                        .attr("ry", 6)
                        .attr("x", 75)
                        .attr("y", 20)
                        .attr("id", "timebar")
                        .attr("width", 0)
                        .attr("height", 30)
                        .style("fill", "#C9C9C9")
                        .style("stroke", "black")
                        .style("stroke-width", "4");


                    var firstDate = "" + eventQueue[0].day + "/" + eventQueue[0].month + "/" + eventQueue[0].year;
                    var lastDate = "" + eventQueue[nbEvents-1].day + "/" + eventQueue[nbEvents-1].month + "/" + eventQueue[nbEvents-1].year;
                    timeBarGroup.append("text").attr("class", "date-text").text(firstDate).attr("y", 75).attr("x", 75);
                    timeBarGroup.append("text").attr("class", "date-text").text(lastDate).attr("y", 75).attr("x", timeBarWidth+10);
                    timeBarGroup.append("text").attr("class", "date-text").attr("id", "datetext").text("").attr("y", height-30).attr("x", width/2).style("text-anchor", "middle");


                    var dots = timeBarGroup.append("g").attr("id", "dots-group");
                    var dayWidth = timeBarWidth/(calculateDayDifference(eventQueue[0], eventQueue[nbEvents-1]));

                    var xCoords = [75];
                    var xCoord = 75;
                    dots.append("circle")
                        .attr("id", "dot-0")
                        .attr("cx", xCoord)
                        .attr("cy", 35)
                        .attr("r", 5)
                        .style("fill", function(){
                            if(eventQueue[0].type == "start"){
                                return "black";
                            }
                            return "white";
                        })
                        .style("stroke", "black")
                        .style("stroke-width", "4");

                    for(var i = 1; i < nbEvents; i++){
                        xCoord = xCoord + (calculateDayDifference(eventQueue[i-1], eventQueue[i]) * dayWidth);
                        xCoords.push(xCoord);
                        dots.append("circle")
                            .attr("id", "dot-"+i)
                            .attr("cx", xCoord)
                            .attr("cy", 35)
                            .attr("r", 5)
                            .style("fill", function(){
                                if(eventQueue[i].type == "start"){
                                    return "black";
                                }
                                return "white";
                            })
                            .style("stroke", "black")
                            .style("stroke-width", "2");
                    }

                    return xCoords;
                }


                function animateTimeBar(xCoords){
                    var nbEvents = eventQueue.length;
                    var timeBarWidth = width-90;
                    disableSlider = true;
                    d3.select("#slider-ball").attr("fill", "#ADADAD");

                    canvas.selectAll(".spiderlink").attr('opacity', 0);

                    var eventDuration = animSpeed;
                    var times = []
                    var totalTime = 0;
                    for(var i = 0; i < nbEvents; i++){
                        totalTime = totalTime + eventDuration;
                        times.push(totalTime);
                    }
                    for(var i = 0; i < times.length; i++){
                       performSetTimeout(i);
                    }

                    function performSetTimeout(i){
                        timeOuts.push(setTimeout(function(){
                            eventTick(i, eventDuration, xCoords[i]);
                        }, times[i]+1000));
                    }

                    timeOuts.push(setTimeout(function(){
                        togglePlay();
                    }, times[times.length-1]+3000));

                }

                nodedata.forEach(function(d,i){
                    continent.forEach(function(c, j){

                        if(c.name == findCountryNameByCode(countryNames, d.CCode)){

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

                linkdata.forEach(function(d){
                    d.target_data = d.target;
                    d.source_data = d.source;
                    nodedata.forEach(function(n, i){
                        if(n.CCode == d.target_data){
                            d.target = i;
                        }
                        if(n.CCode == d.intervener){
                            d.source = i;
                        }
                    });
                });

                var force = d3.layout.force()
                    .charge(-1000)
                    .linkDistance(100)
                    .size([width, height]);

                var links;
                var nodes;

                var linkQueue = [];

                function eventTick(index, time, xCoord){
                    var event = eventQueue[index];
                    var bar = d3.select("#timebar");
                    bar.transition()
                        .duration(time)
                        .attr("width", xCoord-75);

                    var date = "" + event.day + "/" + event.month + "/" + event.year;
                    d3.select("#datetext").text(event.desc);

                    var dots = d3.select("#dots-group");
                    var dot = dots.select("#dot-"+index);
                    dot.transition().duration(500).attr("r", 20);
                    dot.moveToFront();
                    if(index > 0){
                        var oldDot = dots.select("#dot-"+(index-1));
                        oldDot.transition().duration(500).attr("r", 5);
                    }
                    if(event.type == "start"){
                        canvas.select("#link" + event.index).transition().duration(800).attr('opacity', 1);
                    }
                    else if(event.type == "end"){
                        canvas.select("#link" + event.index).transition().duration(800).attr('opacity', 0);
                    }
                }

                drawLinks(linkdata);
                drawNodes(nodedata);

                force
                    .nodes(nodedata)
                    .links(linkdata)
                    .start();

                force.on("tick", function() {
                    links.attr("d", function(d) {
                        var targetRad = 25;
                        var sourceRad = 25;
                        if(d3.select("#spidernode-" + d.target.CCode)[0][0] != null){
                            targetRad = d3.select("#spidernode-" + d.target.CCode)[0][0].r.baseVal.value;
                        }
                        if(d3.select("#spidernode-" + d.source.CCode)[0][0] != null){
                            sourceRad = d3.select("#spidernode-" + d.source.CCode)[0][0].r.baseVal.value;
                        }
                        var dx = d.target.x - d.source.x,
                            dy = d.target.y - d.source.y,
                            dr = Math.sqrt(dx * dx + dy * dy)/2;

                        var dx2 = Math.abs(d.target.x - d.source.x);
                        var dy2 = Math.abs(d.target.y - d.source.y);

                        var alfa = Math.atan(dy2/dx2);
                        var beta = (Math.PI/2)-alfa;

                        if(d.target.x < d.source.x){
                            if(d.target.y < d.source.y){
                                alfa = alfa - Math.PI;
                                beta = -beta + (Math.PI/2);
                            }
                            else{
                                alfa = -alfa + Math.PI;
                                beta = beta - (Math.PI/2);
                            }
                        }
                        else{
                            if(d.target.y < d.source.y){
                                alfa = -alfa;
                                beta = beta + (Math.PI/2);

                            }
                            else{
                                beta = -beta - (Math.PI/2);
                            }
                        }

                        var sx = Math.cos(alfa)*sourceRad + d.source.x;
                        var sy = Math.sin(alfa)*sourceRad + d.source.y;
                        var tx = Math.cos(beta)*targetRad + d.target.x;
                        var ty = Math.sin(beta)*targetRad + d.target.y;
                        return "M" +
                            sx + "," +
                            sy + "A" +
                            dr + "," + dr + " 0 0,1 " +
                            tx + "," +
                            ty;
                    });

                    nodes.attr("transform", function(d) {return "translate("+ d.x + "," + d.y + ")";});
                });

                var safety = 0;
                while(force.alpha() > 0.05) { // You'll want to try out different, "small" values for this
                    force.tick();
                    if(safety++ > 500) {
                        break;// Avoids infinite looping in case this solution was a bad idea
                    }
                }

                //animateTimeBar(eventQueue);


                //temporary function to get some data
                function extractData(data){
                    var conflictNb = conflictNumber;
                    var result = [];
                    data.forEach(function (d) {
                        if(d.conflict == conflictNb){
                            result.push(d);
                        }
                    })
                    return result;
                }

                function extractNodes(linkdata){
                    var result = [];
                    linkdata.forEach(function(d){
                        var target = getObjectWithCountryCode(countryNames, d.target);
                        target.power = d.power_target;
                        if(result.indexOf(target) == -1){
                            result.push(target);
                        }
                        var intervener = getObjectWithCountryCode(countryNames, d.intervener);
                        intervener.power = d.power_inter;
                        if(result.indexOf(intervener) == -1){
                            result.push(intervener);
                        }
                    });
                    return result;
                }

                function drawLinks(linkdata){
                    links = canvas.selectAll(".spiderlink")
                        .data(linkdata)
                        .enter().append("path")
                        .attr("id", function(d, i){
                            return "link" + i
                        })
                        .attr("class", "spiderlink")
                        .style("stroke", "black")
                        .style("fill", "none")
                        .style("stroke-width", function(d) {
                            return 3;
                        })
                        .attr("marker-end", function(d){
                            return "url(#end1)";
                        })
                        .on("click", function(d){
                            console.log(d);
                        });
                }

                function drawNodes(nodedata){

                    var drag = force.drag()
                        .on("dragstart", dragstart);

                    function dragstart(d) {
                        d3.select(this).select(".node-circle")
                            .classed("fixed", d.fixed = true)
                            .style("stroke-width", "3")
                            .style("stroke", "#73DCFF");
                    }

                    function dblclick(d) {
                        d3.select(this).select(".node-circle")
                            .classed("fixed", d.fixed = false)
                            .style("stroke-width", "0")
                            .style("stroke", "#000000");
                    }


                    nodes = canvas.selectAll(".bubblenode")
                        .data(nodedata)
                        .enter()
                        .append("g")
                        .attr("class", "bubblenode")
                        .on("dblclick", dblclick)
                        .call(drag);

                    nodes.append("circle")
                        .attr("id", function(d) {return "spidernode-"+ d.CCode })
                        .attr("class", "node-circle")
                        .attr("r",  function(d) {
                            switch(d.power){
                                case("1"):
                                    return 25;
                                case("2"):
                                    return 30;
                                case("3"):
                                    return 35;
                                case("4"):
                                    return 40;
                                case("5"):
                                    return 45;
                                default:
                                    return 25;
                            }
                            return 20;
                        })
                        .style("fill",   function(d, i) {
                            return contColahs[d.continent];
                        })
                        .attr('fill-opacity', 1)
                        .on("mouseover", function(d, i) { addTooltip(d3.select(this)); })
                        .on("mouseout",  function(d, i) {
                            mouseOutD = true;
                            $("#hiddenfield").trigger("change");
                            d3.select("#tooltip").remove();
                        });

                    nodes.append("text")
                        .attr("text-anchor", "middle")
                        .attr("class", "bubbletext")
                        .attr("id", function(d) {return "spidertext-"+ d.CCode })
                        .style("background-color", "white")
                        .attr("dy", 5)
                        .attr('fill-opacity', 1)
                        .text(function(d) {return d.StateAbb})
                        .on("mouseover", function(d, i) { addTooltip(d3.select(this)); })
                        .on("mouseout",  function(d, i) { d3.select("#tooltip").remove(); });



                    var temp = [];
                    var continents = [];
                    nodedata.forEach(function(n){
                        if(temp.indexOf(n.continent) == -1){
                            temp.push(n.continent);
                            continents.push({name: n.continent, color: contColahs[n.continent]});
                        }
                    });
                }

                function addTooltip(elem) {
                    var x = 20;
                    var y = height - 10;
                    var CCode = elem.attr("id").split("-")[1];
                    var text = findCountryNameByCode(countryNames, CCode);

                    document.getElementById("hiddenfield").value = CCode;
                    mouseOutD = false;
                    $("#hiddenfield").trigger("change");
                    var tooltip = canvas
                        .append("text")
                        .text(text)
                        .attr("x", x)
                        .attr("y", y)
                        .attr("id", "tooltip");

                }
            });
        });
    });
}

function findCountryNameByCode(countryNames, code){
    var name = "empty";
    countryNames.forEach(function(data){
        if(data.CCode == code){
            name = data.StateNme;
        }
    });

    if(name == "empty"){
        console.log("EMPTY CODE:", code);
    }

    return name;
}

function getObjectWithCountryCode(countryNames, code){
    var result = null;
    countryNames.forEach(function (data){
        if(data.CCode == code){
            result = data;
        }
    });
    return result;
}

function compareEvents(event1, event2){
    if(event1.year > event2.year){
        return 1;
    }
    if(event1.year < event2.year){
        return -1;
    }
    if(event1.month > event2.month){
        return 1;
    }
    if(event1.month < event2.month){
        return -1;
    }
    if(event1.day > event2.day){
        return 1;
    }
    if(event1.day < event2.day){
        return -1;
    }
    return 0;
}

function calculateDayDifference(event1, event2){
    var totalEvent2days = event2.year * 365 + event2.month * 30 + event2.day;
    var totalEvent1days = event1.year * 365 + event1.month * 30 + event1.day;
    return totalEvent2days - totalEvent1days;
}

function createDescriptions(data, countryNames){
    data.forEach(function(d, i){
        var date = d.start;
        var start = date.substring(6,8) + "/"  + date.substring(4,6) + "/" + date.substring(0,4);
        date = d.end;
        var end = date.substring(6,8) + "/"  + date.substring(4,6) + "/" + date.substring(0,4);
        var intervener = findCountryNameByCode(countryNames, d.intervener);
        var target = findCountryNameByCode(countryNames, d.target);
        var desc = "[" + start + " - " + end + "]: " + intervener + " invades " + target;
        /*
         Direction:
         0.	Non-supportive or neutral intervention
         1.	Support government (including immediate restoration to abort coup)
         2.	Oppose rebels or opposition groups
         3.	Oppose government
         4.	Support rebel or opposition groups
         5.	Support or oppose 3rd party government
         6.	Support or oppose rebel groups in sanctuary
         9.	Not ascertained.
         */
        switch (d.direction){
            case "0":
                desc = desc + " (neutral intervention).";
                break;
            case "1":
                desc = desc + " (in order to support the government).";
                break;
            case "2":
                desc = desc + " (in order to oppose rebels or opposition groups).";
                break;
            case "3":
                desc = desc + " (in order to oppose the government).";
                break;
            case "4":
                desc = desc + " (in order to support rebel or opposition groups).";
                break;
            case "5":
                desc = desc + " (in order to support or oppose 3rd party government).";
                break;
            case "6":
                desc = desc + " (in order to support or oppose rebel groups in sanctuary).";
                break;
            case "9":
                desc = desc + " (cause not ascertained).";
                break;
            default:
                desc = desc + " (cause not ascertained).";
                break;
        }

        d["new_description"] = desc;
    });
}

function parseEvents(data, countryNames){
    var result = [];
    data.forEach(function(d, i){
        var start = d.start;
        var year = parseInt(start.substring(0,4));
        var month = parseInt(start.substring(4,6));
        var day = parseInt(start.substring(6,8));
        var intervener = findCountryNameByCode(countryNames, d.intervener);
        var target = findCountryNameByCode(countryNames, d.target);
        var desc = "[" + day + "/" + month + "/" + year + "] " + intervener + " invades " + target + "."
        if(year < 2000)
            result.push({type: "start", index: i, day: day, month: month, year: year, desc: desc});
        var end = d.end;
        year = parseInt(end.substring(0,4));
        month = parseInt(end.substring(4,6));
        day = parseInt(end.substring(6,8));
        var desc = "[" + day + "/" + month + "/" + year + "] " + intervener + "'s invasion of " + target + " ends."
        if(year < 2000)
            result.push({type: "end", index: i, day: day, month: month, year: year, desc: desc});
    });
    result.sort(compareEvents);
    return result;
}