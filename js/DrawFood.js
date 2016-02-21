var DrawFood = function()
{
	this.cellContainer = document.getElementById("cell-container");
	this.nutrients = [];
    this.graphs = [];
}

DrawFood.prototype.drawHTML = function()
{
    var nutrient;
    var output = "";
    for (var i = 0; i < this.nutrients.length; i++) 
    {
        nutrient = this.nutrients[i];
        output += this.getCellHTML( nutrient );
    };
    this.cellContainer.innerHTML = output;
};

DrawFood.prototype.makeFoodGraphs = function()
{
	var nutrient;
    for (var i = 0; i < this.nutrients.length; i++) 
    {
        nutrient = this.nutrients[ i ];
        this.graphDataTemplate[ 0 ].value = nutrient.carbs;
        this.graphDataTemplate[ 1 ].value = nutrient.water;
        this.graphDataTemplate[ 2 ].value = nutrient.protein;
        this.graphDataTemplate[ 3 ].value = nutrient.fat;
        this.graphDataTemplate[ 4 ].value = nutrient.vitamins;
        this.graphDataTemplate[ 5 ].value = nutrient.minerals;

        this.graphOptions.labelName = nutrient.foodName;

        var ctx = document.getElementById( "nutrichart"+nutrient.id ).getContext("2d");
        window[ "foodChart"+nutrient.id ] = new Chart( ctx ).Doughnut( this.graphDataTemplate, this.graphOptions );
    };
};

DrawFood.prototype.getCellHTML = function( nutrient ) 
{
	var output = '<div onclick="game.BuyNutrient('+ nutrient.id +')" class="nutrient-cell">'+
    '<canvas id="nutrichart' + nutrient.id + '" width="120" height="120"></canvas>'+
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
    animation:false,
    percentageInnerCutout:0,
    animationEasing : "easeOutSine",
    animationSteps:30
};