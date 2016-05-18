/**
 * Created by Wander on 11/03/2016.
 */

 /**
 * Based on code from:
 * http://bl.ocks.org/jasondavies/1341281
 **/
 
y = {};
var foreground;
function drawParCoo(CountryCode,continent){
    selected="none";
    foreground=null;
    d3.select("#conflict-list").selectAll("*").remove();
    d3.select("#parcoo-overview").selectAll("*").remove();

    var divX = d3.select("#parcoo-overview");
    //padding en canvasgrootte
    var m = [30, 40, 30, 5],
        w = window.innerWidth*0.53 - m[1] - m[3],
        h = window.innerHeight*0.52 - m[0] - m[2];
    //var color = d3.scale.category20();


    var x = d3.scale.ordinal().rangePoints([0, w], 1),

        dragging = {};

    var line = d3.svg.line().defined(function(d) { return d[1] != null; }),
        axis = d3.svg.axis().orient("left"),
        background;

    tooltip = d3.select("body")
        .append("div")
        .attr("class","tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background-color","white")
        .style("padding","10px")
        .text("a simple tooltip");

    var svg = divX.append("svg:svg")
        .attr("class", "parcoordSVG")
        .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
//resources/parcoo/parcoo.csv
    //resources/testCSV.csv
    d3.csv("countrycodes.csv", function(countryNames) {


        d3.csv("conflicts.csv", function(parcoo2) {

            var landNaam = findCountryNameByCode(CountryCode);

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

            function findShortCountryByCode(code){
                var name = "empty";
                countryNames.forEach(function(data){
                    if(data.CCode == code){
                        name = data.StateAbb;
                    }


                });

                if(name == "empty"){
                    console.log("code", code);
                }

                return name;
            }


            $("#parcooHeading").html("Invasion Overview: "+landNaam);
            //document.getElementById("parcooHeading").innerHTML= document.getElementById("parcooHeading").innerHTML + " " + landNaam;


            var l = parcoo2.length;
            for (i = 0; i < l; i++) {


                try {
                    parseInt(parcoo2[i]["target"]);
                    if ((parseInt(parcoo2[i]["target"]) != CountryCode) && (parseInt(parcoo2[i].intervener) != CountryCode)) {
                        parcoo2.splice(i, 1);
                        i--;
                    } else {
                        var Star = getText(parcoo2[i]["start"], "start");
                        var einde = getText(parcoo2[i]["end"], "end");

                        if (minY > Star || maxY < einde) {
                            parcoo2.splice(i, 1);
                            i--;
                        }
                    }
                }catch(err){

                }


            }
            

            createDescriptions(parcoo2,countryNames);
            d3.csv("conflicts.csv", function (parcoo) {

                var l = parcoo.length;
                for (i = 0; i < l; i++) {

                    try {

                        parseInt(parcoo[i]["target"]);
                        if ((parseInt(parcoo[i]["target"]) != CountryCode) && (parseInt(parcoo[i].intervener) != CountryCode)) {
                            parcoo.splice(i, 1);
                            i--;
                        }else{
                            var Star = getText(parcoo[i]["start"],"start");
                            var einde = getText(parcoo[i]["end"],"end");
                            if(minY>Star || maxY<einde){
                                parcoo.splice(i, 1);
                                i--;
                            }
                        }

                    } catch (err) {

                    }

                }

                //  Data,intervener,target,start,end,intervention,conflict,source,direction,type,amount,air,naval,size_naval,firing_outside,intervener_casualties,target casualties,colonial,pevious_int,alliance ,domestic_dispute,affect_policies,social_protective,pursuit_border,economic,strategic,humanitarian,territorial,military/diplomatic,contiguity,int_contig,alignment,power_inter,power_target,description

                /*    Data
                 :
                 "mint"
                 air
                 :
                 "4"
                 alignment
                 :
                 "3"
                 alliance
                 :
                 "0"
                 amount
                 :
                 "3"
                 colonial
                 :
                 "1"
                 conflict
                 :
                 "145"
                 domestic_dispute
                 :
                 "1"
                 economic
                 :
                 "1"
                 intervener
                 :
                 "211"
                 intervener_casualties
                 :
                 "56"
                 intervention
                 :
                 "381"
                 pevious_int
                 :
                 "0"
                 power_inter
                 :
                 "3"
                 power_target
                 :
                 "1"
                 target
                 :
                 "490"
                 target casualties
                 :
                 "999"*/



                for (i = 0; i < parcoo.length; i++) {
                    delete parcoo[i][""];
                    delete parcoo[i]["affect_policies"];
                    delete parcoo[i]["contiguity"];
                    delete parcoo[i]["direction"];
                    delete parcoo[i]["domestic_dispute:"];
                    delete parcoo[i]["firing_outside"];
                    delete parcoo[i]["humanitarian"];
                    delete parcoo[i]["int_contig"];
                    delete parcoo[i]["military/diplomatic"];
                    delete parcoo[i]["naval"];
                    delete parcoo[i]["pursuit_border"];
                    delete parcoo[i]["size_naval"];
                    delete parcoo[i]["social_protective"];
                    delete parcoo[i]["source"];
                    delete parcoo[i]["strategic"];
                    delete parcoo[i]["type"];
                    delete parcoo[i]["territorial"];
                    delete parcoo[i]["description"];
                    delete parcoo[i]["amount"];
                    delete parcoo[i]["air"];
                    delete parcoo[i]["Data"];
                    delete parcoo[i]["alignment"];
                    delete parcoo[i]["alliance"];
                    delete parcoo[i]["intervention"];
                    delete parcoo[i]["colonial"];
                    delete parcoo[i]["conflict"];
                    delete parcoo[i]["economic"];
                    delete parcoo[i]["domestic_dispute"];
                    delete parcoo[i]["previous_int"];


                    /*"": ""
                     affect_policies: "0"
                     air: "0"
                     amount: "1"
                     contiguity: "0"
                     description: "S. Africa aids Unita opposition in Angola (GM"
                     direction: "4"
                     domestic_dispute: "1"
                     economic: "0"
                     end: "19890210"
                     firing_outside: "0"
                     humanitarian: "0"
                     int_contig: "1"
                     intervener: "560"
                     intervener_casualties: "40"
                     military/diplomatic: "0"
                     naval: "0"
                     pursuit_border: "0"
                     size_naval: "9"
                     social_protective: "0"
                     source: "1"
                     start: "19890208"
                     strategic: "1"
                     target: "540"
                     target casualties: "23"
                     territorial: "0"
                     type: "5"*/

                }





                // Extract the list of dimensions and create a scale for each.
                x.domain(dimensions = d3.keys(parcoo[0]).filter(function (d) {
                    if (d == "intervener" || d == "target" || d == "start" || d == "end" || d == "intervener_casualties" || d == "target_casualties" || d == "power_inter" || d == "power_target") {
                        if(d=="power_inter" || d=="power_target"){
                            y[d] = d3.scale.ordinal()
                                .domain(["Not Applicable","Smallest","Small","Middle","Large","Super"])
                                .rangePoints([h, 0]);
                        }else if(d=="intervener_casualties" || d== "target_casualties"){
                            y[d] = d3.scale.ordinal()
                                .domain(["Unknown","None"].concat(superSort(parcoo.map(function (p) {
                                    return getText(p[d],d);
                                }))).concat(["More than 998"]))
                                .rangePoints([h, 0]);
                        }else{
                            y[d] = d3.scale.ordinal()
                                .domain(parcoo.map(function (p) {
                                    return getText(p[d],d);
                                }).sort())
                                .rangePoints([h, 0]);
                        }


                    }
                    else {
                        (y[d] = d3.scale.linear()
                            .domain(d3.extent(parcoo, function (p) {
                                return parseFloat(p[d]);
                            }))
                            .range([h, 0]));
                    }

                    return true;
                }));


                function superSort(ray){
                    var returnList = [];
                    ray.forEach(function(d,i){
                        if(d=="More than 998" || d== "None" || d== "Unknown"){

                        }else{

                            returnList.push(parseInt(d));
                        }
                    });
                    return returnList.sort(function(a, b){return a-b});

                }



                // Add grey background lines for context.
                background = svg.append("svg:g")
                    .attr("class", "background")
                    .selectAll("path")
                    .data(parcoo)
                    .enter().append("svg:path")
                    .attr("d", path)
                    .attr("id", function (d, i) {
                        return "background" + i;
                    })
                    .on("click", function (d) {
                        return mouseClick(d3.select(this))
                    });

                // Add blue foreground lines for focus.


                foreground = svg.append("svg:g")
                    .attr("class", "foreground")
                    .selectAll("path")
                    .data(parcoo)
                    .enter().append("svg:path")
                    .attr("d", path)
                    .attr("stroke",contColahs[continent])
                    .style("display",function(d,i){

                    })
                    .attr("id", function (d, i) {
                        return "foreground" + i;
                    })
                    .on("mouseover", function (d) {
                        return mouseHover(d3.select(this))
                    })
                    .on("mousemove", function (d, i) {
                        return showTableInfo(d, i, (event.pageX + 20), (event.pageY - 45));
                    })
                    .on("mouseout", function () {
                        return mouseLeave(d3.select(this))
                    })
                    .on("click", function (d) {
                        return mouseClick(d3.select(this))
                    });


                function mouseClick(path) {
                    var succes = false;
                    var index = -1;


                    foreground.style("display", function (d, i) {
                        if (path.attr("id") == "foreground" + i || path.attr("id") == "background" + i) {
                            succes = true;
                            index = i;
                            return null;
                        } else {
                            return "none";
                        }
                    });
                    if (succes == false) {
                        foreground.style("display", function (d, i) {
                            drawConflicts(parcoo2,[]);
                            return null;
                        })
                    }
                    if (index != -1) {
                        drawConflicts(parcoo2,[index]);

                    }

                }


                // Add a group element for each dimension.
                var g = svg.selectAll(".dimension")
                    .data(dimensions)
                    .enter().append("svg:g")
                    .attr("class", "dimension")
                    .attr("transform", function (d) {
                        return "translate(" + x(d) + ")";
                    })
                    .call(d3.behavior.drag()
                        .on("dragstart", function (d) {
                            dragging[d] = this.__origin__ = x(d);
                            // background.attr("visibility", "hidden");
                        })
                        .on("drag", function (d) {
                            dragging[d] = Math.min(w, Math.max(0, this.__origin__ += d3.event.dx));
                            foreground.attr("d", path);
                            background.attr("d", path);
                            dimensions.sort(function (a, b) {
                                return position(a) - position(b);
                            });
                            x.domain(dimensions);
                            g.attr("transform", function (d) {
                                return "translate(" + position(d) + ")";
                            })
                        })
                        .on("dragend", function (d) {
                            delete this.__origin__;
                            delete dragging[d];
                            transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                            transition(foreground)
                                .attr("d", path);
                            background
                                .attr("d", path)
                                .transition()
                                .delay(500)
                                .duration(0);
                            //.attr("visibility", null);
                        }));

                // Add an axis and title.
                g.append("svg:g")
                    .attr("class", "axis")
                    .each(function (d) {
                        d3.select(this).call(axis.scale(y[d]));
                    })
                    .append("svg:text")
                    .attr("text-anchor", "middle")
                    .attr("y", -17)
                    .style("font-size","12px")
                    .text(function(d){return nameSwap(d);});


                function nameSwap(data){
                    var returnString="";

                    switch (data) {
                        case "intervener":
                            returnString = "Intervener";
                            break;
                        case "target":
                            returnString = "Target";
                            break;
                        case "start":
                            returnString = "Start";
                            break;
                        case "end":
                            returnString = "End";
                            break;
                        case "intervener_casualties":
                            returnString = "Intervener Casualties";
                            break;

                        case "target_casualties":
                            returnString = "Target Casualties";
                            break;
                        case "power_inter":
                            returnString = "Power Intervener";
                            break;
                        case "power_target":
                            returnString = "Power Target";
                            break;
                        default:
                            returnString = "";
                            break;
                    }
                    return returnString;
                }

                // Add and store a brush for each axis.
                g.append("svg:g")
                    .attr("class", "brush")
                    .each(function (d) {
                        d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush));
                    })
                    .selectAll("rect")
                    .attr("x", -8)
                    .attr("width", 16);




                function mouseHover(obj){
                    obj.style("background-color","#68A8E5");
                    tooltip.style("visibility", "visible")
                        .style("width","auto")
                        .style("height","auto");

                }
                function mouseLeave(obj){
                    obj.style("background-color","white");
                    tooltip.style("visibility", "hidden");

                }
                function showTableInfo(data, index, x,y){

                    tooltip.style("top", y+"px")
                        .style("left",x+"px")
                        .text("Target:" +findCountryNameByCode(parcoo2[index]["target"])+ "\n\r"+ "Intervener:"+ findCountryNameByCode(parcoo2[index]["intervener"])+"");
                }
                var indexList=[];
                for(i=0;i<parcoo2.length;i++){
                    indexList[i] = i;
                }

                //if(d3.select(".dimension")[0][0]==null){
                //    parcoo2 ={};
                //    indexlist=[];
                //}
                d3.selectAll(".brush").each(function(d){ d3.select(this).call(y[d].brush.clear());y[d].brush.on("brush").call(this) ;});
                drawConflicts(parcoo2,indexList);
                d3.selectAll(".brush").each(function(d){ d3.select(this).call(y[d].brush.clear());y[d].brush.on("brush").call(this) ;});
            });


            // Handles a brush event, toggling the display of foreground lines.
            function brush() {


                var actives = dimensions.filter(function (p) {
                        return !y[p].brush.empty();
                    }),
                    extents = actives.map(function (p) {
                        var ext;
                        var ex1;
                        var ex2;
                        try{
                            ext = y[p].brush.y().rangeExtent()[1]-y[p].brush.y().rangeExtent()[0];
                            ex1 = y[p].brush.y().rangeExtent()[1];
                            ex2= y[p].brush.y().rangeExtent()[0];
                        }catch(err){
                            ext = y[p].brush.y().domain()[1]- y[p].brush.y().domain()[0];
                            ex1 = y[p].brush.y().domain()[1];
                            ex2= y[p].brush.y().domain()[0]
                        }
                        if(y[p].brush.extent()[1]-y[p].brush.extent()[0]>= ext*0.03)
                            return y[p].brush.extent();
                        else
                            return [ex2,ex1];
                    });
                //console.log(actives);
                var objectContainer = [];
                foreground.style("display", function (d) {

                    if( actives.every(function (p, i) {
                            if(actives[i] == "intervener" || actives[i] == "target" ||actives[i]== "start" || actives[i]== "end" || actives[i] == "intervener_casualties" || actives[i]== "target_casualties" || actives[i] == "power_inter" || actives[i] == "power_target"){
                                return extents[i][0] <= y[actives[i]](getText(d[p],p)) && y[actives[i]](getText(d[p],p)) <= extents[i][1];
                            }else{
                                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                            }
                            // console.log(y[selectedString](d[p]));
                            //   console.log("extend: "+extents[i][0] )
                            // return extents[i][0] <= y[actives[i]](d[p]) && y[actives[i]](d[p]) <= extents[i][1];
                        })){

                        objectContainer = objectContainer.concat(d3.select(this)[0]);
                        return null;
                    }else {
                        return "none";
                    }
                });
                var indexList=[];
                for(i= 0;i<objectContainer.length;i++){
                    indexList[i]=parseInt(objectContainer[i].id.slice(10,12));
                }


                drawConflicts(parcoo2,indexList);




            }


        });

        function findShortCountryByCode(code){
            var name = "empty";
            countryNames.forEach(function(data){
                if(data.CCode == code){
                    name = data.StateAbb;
                }


            });

            if(name == "empty"){
                console.log("code", code);
            }

            return name;
        }

        function getText(data,dataContext){
            var returnString="";
            switch (dataContext) {
                case "intervener":
                    returnString = findShortCountryByCode(data);
                    break;
                case "target":
                    returnString = findShortCountryByCode(data);
                    break;
                case "start":
                    returnString = ""+data.substring(0,4);
                    break;
                case "end":
                    returnString = ""+data.substring(0,4);
                    break;
                case "intervener_casualties":
                    if(data == "0"){
                        returnString = "None"
                    }else if(data=="999"){
                        returnString = "Unknown";
                    }else if(data == "998"){
                        returnString = "More than 998"
                    }else{
                        returnString = data;
                    }
                    break;
                case "target_casualties":
                    if(data == "0"){
                        returnString = "None"
                    }else if(data=="999"){
                        returnString = "Unknown";
                    }else if(data == "998"){
                        returnString = "More than 998"
                    }else{
                        returnString = data;
                    }
                    break;
                case "power_inter":

                    if(data == "1"){
                        returnString = "Smallest"
                    }else if(data=="2"){
                        returnString = "Small";
                    }else if(data == "3"){
                        returnString = "Middle"
                    }else if(data == "4"){
                        returnString = "Large"
                    }else if(data == "5"){
                        returnString = "Super"
                    }else{
                        returnString = "Not Applicable"
                    }
                    break;
                case "power_target":
                    if(data == "1"){
                        returnString = "Smallest"
                    }else if(data=="2"){
                        returnString = "Small";
                    }else if(data == "3"){
                        returnString = "Middle"
                    }else if(data == "4"){
                        returnString = "Large"
                    }else if(data == "5"){
                        returnString = "Super"
                    }else{
                        returnString = "Not Applicable"
                    }
                    break;
                default:
                    desc = desc + " (cause not ascertained).";
                    break;
            }
            return returnString;

        }

        function path(d) {
            return line(dimensions.map(function(p) {
                // check for undefined values
                if (d[p] == " "||d[p]=="NULL"||d[p]==null) return [x(p), null];

                return [x(p), y[p](getText(d[p],p))];
            }));
        }

        function position(d) {
            var v = dragging[d];
            return v == null ? x(d) : v;
        }

        function transition(g) {
            return g.transition().duration(500);
        }

        // Returns the path for a given data point.
        //function path(d) {
        //    return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
        //}


        function drawConflicts(conflictList,indexList){

            var divX = document.getElementById("conflict-list");
            divX.innerHTML="";
            var title = document.createElement("h1");
            title.align = "center";
            title.id = "scrolltitle";
            title.width = "100%";
            title.innerHTML = "<span style='color: black;'>"+"Invasion list" +"</span>";

            divX.appendChild(title);
            var innerdiv = document.createElement("div");

            innerdiv.id="scrolldiv";




            var Table = document.createElement("table");
            Table.id = 'voedingsdagboek';
            var x;
            var y;
            var trID;
            // var innertr = document.createElement("tr");
            //innertr.id = "trtest"+trID;

            for(i=0;i<indexList.length;i++){
                trID = indexList[i];

                var clickHandler = function(myrow,n,mip){
                    return function(){
                        jorenMethod(myrow,n,mip);};
                };



                var tr = document.createElement("tr");

                var td = document.createElement("td");
                //td.colSpan = "2";
                td.id = "trtest"+trID;

                tr.onclick = clickHandler(tr,i,"trtest"+trID);

                try {
                    td.innerHTML = conflictList[indexList[i]]["new_description"];
                }catch(err)
                {
                    break;
                }
                tr.appendChild(td);
                Table.appendChild(tr);
                innerdiv.appendChild(Table);
                divX.appendChild(innerdiv);
                d3.select("#trtest"+trID).on("click",function(d){return mouseClick(d3.select(this),indexList)})
            }




        }

        function mouseClick(row,indexList){

            if(selected != "none"){
                d3.select("#"+selected).style("background-color","white");
                d3.select("#"+selected).style("color","black")
            }
            var prev = selected;


            row.style("background-color","black");
            row.style("color","white")
            selected =""+row.attr("id");
            foreground.style("display", function (d,i) {
                if(parseInt(selected.slice(6,9))==i){
                    return null;
                }else{
                    return "none";
                }

            });
            if(selected == prev){
                d3.select("#"+selected).style("background-color","white");
                d3.select("#"+selected).style("color","black")
                foreground.style("display", function (d,i) {
                    var ret="none";
                    for(k=0;k<indexList.length;k++){
                        if(indexList[k]==i){
                            ret=null;
                        }
                    }
                    return ret;


                });
                selected="none";
            }

        }

    });

}





function resetDiary(){
    //d3.selectAll(".brush").each(function(d){ d3.select(this).call(y[d].brush.clear());console.log(y[d].brush.on("brush")) ;});
    cc2 = -1;
    $("#hiddenfield2").val("1");
    $("#hiddenfield2").trigger("change");

    selected = "none";
    d3.selectAll(".brush").each(function(d){ d3.select(this).call(y[d].brush.clear());y[d].brush.on("brush").call(this) ;});

}
var selected = "none";
function jorenMethod(row,n,mip){



    d3.csv("countrycodes.csv", function(countryNames) {
        d3.csv("conflicts.csv", function(parcoo3) {
            createDescriptions(parcoo3,countryNames);
            for(k =0;k<parcoo3.length;k++){
                if(""+parcoo3[k]["new_description"] ==""+row.firstChild.innerHTML){
                    //console.log("GREAT SUCCESS "+ parcoo3[k].conflict);
                    visualiseConflict(canvas, parcoo3[k].conflict);
                }
            }
        });
    });
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
         0. Non-supportive or neutral intervention
         1. Support government (including immediate restoration to abort coup)
         2. Oppose rebels or opposition groups
         3. Oppose government
         4. Support rebel or opposition groups
         5. Support or oppose 3rd party government
         6. Support or oppose rebel groups in sanctuary
         9. Not ascertained.
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
function findCountryNameByCode(countryNames,code){
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