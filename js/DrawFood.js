var DrawFood = function()
{
	this.cellContainer = document.getElementById("food-container");
	this.nutrients = [];
    this.graphs = [];
}

DrawFood.prototype.drawHTML = function( maxFood )
{
    var nutrient;
    var output = "";
    for (var i = 0; i < maxFood; i++) 
    {
        output += this.getCellHTML( i, maxFood );
    };
    this.cellContainer.innerHTML = output;

    for (var j = 0; j < maxFood; j++) 
    {
        this.graphDataTemplate[ 0 ].value = 10;
        this.graphDataTemplate[ 1 ].value = 10;
        this.graphDataTemplate[ 2 ].value = 10;
        this.graphDataTemplate[ 3 ].value = 10;
        this.graphDataTemplate[ 4 ].value = 10;
        this.graphDataTemplate[ 5 ].value = 10;

        var ctx = document.getElementById( "nutrichart"+j ).getContext("2d");
        window[ "foodChart"+j ] = new Chart( ctx ).Doughnut( this.graphDataTemplate, this.graphOptions );
    };
};

DrawFood.prototype.makeFoodGraphs = function()
{
    var nutrient;
    var chart;
    for (var i = 0; i < this.nutrients.length; i++) 
    {
        nutrient = this.nutrients[ i ];
        chart = window[ "foodChart"+nutrient.id ];
        chart.segments[ 0 ].value = nutrient.carbs;
        chart.segments[ 1 ].value = nutrient.water;
        chart.segments[ 2 ].value = nutrient.protein;
        chart.segments[ 3 ].value = nutrient.fat;
        chart.segments[ 4 ].value = nutrient.vitamins;
        chart.segments[ 5 ].value = nutrient.minerals;
        chart.options.labelName = nutrient.foodName;
        chart.update();
    };
};

DrawFood.prototype.getCellHTML = function( nutrientId, maxFood ) 
{
	var paddingPercent = 0.04;
    var scrolledWidth = window.innerWidth * 0.97;
    var paddingTotal = scrolledWidth * paddingPercent;
    var singlePadding = paddingTotal / ( maxFood + 1 );
    var singleWidth = ( scrolledWidth / maxFood ) - ( 2 * singlePadding );
    var output = '<div onclick="game.BuyNutrient('+ nutrientId +')" class="nutrient-cell" style="padding: 0px '+ singlePadding +'px 0px '+ singlePadding +'px">'+
    '<canvas id="nutrichart' + nutrientId + '" width="'+ singleWidth  +'" height="'+ singleWidth  +'"></canvas>'+
'</div>';
	return output;
};

DrawFood.prototype.graphDataTemplate = 
[
    {
        value: 50,
        color:"#ee2024",
        label: "C"
    },
    {
        value: 50,
        color: "#2094ee",
        label: "W"
    },
    {
        value: 30,
        color: "#a856ed",
        label: "P"
    },
    {
        value: 20,
        color: "#ee9e20",
        label: "F"
    },
    {
        value: 35,
        color: "#64ee20",
        label: "V"
    },
    {
        value: 15,
        color: "#c7c7c7",
        label: "M"
    }
];

DrawFood.prototype.graphOptions = 
{
    tooltipTemplate: "<%if (label){%><%=value%> <%}%><%= label %>",

    onAnimationComplete: function()
    {
        /*
        this.showTooltip(this.segments, true);

        var ctx = this.chart.ctx;
        this.segments.forEach
        (
            function (segment) 
            {
                ctx.fillText(segment.value, segment.x, segment.y);
            }
        )
        */
    },

    tooltipEvents: [],
    tooltipFontSize:8,
    tooltipYPadding:5,
    tooltipXPadding:5,
    tooltipCaretSize:5,
    tooltipFontColor: "#FFF",
    tooltipFillColor: "rgba(0,0,0,0.7)",
    showTooltips: false,
    animation:true,
    percentageInnerCutout:0,
    animationEasing : "easeOutSine",
    animationSteps:30
};