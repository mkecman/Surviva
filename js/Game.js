function trigerAi()
{
	game.ai.playNextMove();
}

var Game = function()
{
	this.MAX_HEALTH_PR = 1.2;
	
	this.turn = 1;

	this.dailyMoney = 3;
	this.dailyNutrients = [];
	this.currentMoney = 0;

	this.Pain 		= new NutrientLevelValues( "Pain",		 100000, 0.01,	 1,		 2,		 3,		 4,		 5 );
	this.Health 	= new NutrientLevelValues( "Health",	 5,		 1000,	 1,		 85,	 115,	 120,	 130 ); //5d
	this.Water 		= new NutrientLevelValues( "Water",		 4,		 500,	 50,	 80,	 120,	 150,	 200 ); //4d
	this.Vitamins 	= new NutrientLevelValues( "Vitamins",	 12,	 25,	 30,	 70,	 200,	 400,	 600 ); //12d
	this.Minerals 	= new NutrientLevelValues( "Minerals",	 24,	 25,	 10,	 50,	 150,	 200,	 350 ); //24d
	this.Carbs 		= new NutrientLevelValues( "Carbs",		 30,	 250,	 5,		 25,	 130,	 180,	 250 ); //30d
	this.Protein 	= new NutrientLevelValues( "Protein",	 7,		 150,	 50,	 90,	 150,	 250,	 300 ); //7d
	this.Fat 		= new NutrientLevelValues( "Fat",		 18,	 50,	 20,	 40,	 110,	 150,	 200 ); //18d

	this.totalWater = 0;
	this.totalVitamins = 0;
	this.totalMinerals = 0;
	this.totalCarbs = 0;
	this.totalProtein = 0;
	this.totalFat = 0;

	this.foodGenerator = new FoodGenerator();
	this.foodDrawer = new DrawFood();

	this.ai = new Ai( this );
};

Game.prototype.StartGame = function()
{
	this.turnCountHTML = document.getElementById( "turn-count" );
	this.turnCountHTMLDefaultText = this.turnCountHTML.innerHTML;
	this.moneyCountHTML = document.getElementById( "money-count" );
	this.moneyCountDefaultText = this.moneyCountHTML.innerHTML;
	this.currentMoney = this.dailyMoney;
	this.moneyCountHTML.innerHTML = this.moneyCountDefaultText + this.currentMoney;
	this.cartHTML = document.getElementById( "cart" );

	var ctx = document.getElementById("nutrients-bar-levels-canvas").getContext("2d");
	this.barChart = new Chart(ctx).Radar(this.radarChartData, this.optionsRadar);

	var ctx2 = document.getElementById("nutrients-line-levels-canvas").getContext("2d");
	this.lineChart = new Chart(ctx2).Line(this.lineChartData, this.optionsLine);

	this.drawFood();
}

Game.prototype.drawFood = function() 
{
	this.foodDrawer.nutrients = [];

	for (var i = 0; i < 8; i++) 
	{
		var nutrient = this.foodGenerator.generate( i );
		this.foodDrawer.nutrients.push( nutrient );
	};
	this.foodDrawer.drawHTML();
	this.foodDrawer.makeFoodGraphs();
};

Game.prototype.Update = function() 
{
	this.turn++;
	this.turnCountHTML.innerHTML = this.turnCountHTMLDefaultText + this.turn;

	var nutrient;
	var totalWater		= 0;
	var totalVitamins	= 0;
	var totalMinerals	= 0;
	var totalCarbs		= 0;
	var totalProtein	= 0;
	var totalFat		= 0;
	var total = 0;

	for ( var i = 0; i < this.dailyNutrients.length; i++ ) 
	{
		nutrient = this.foodDrawer.nutrients[ this.dailyNutrients[ i ] ];
		totalWater		 += nutrient.water;
		totalVitamins	 += nutrient.vitamins;
		totalMinerals	 += nutrient.minerals;
		totalCarbs		 += nutrient.carbs;
		totalProtein	 += nutrient.protein;
		totalFat		 += nutrient.fat;

		total			 += nutrient.water;
		total			 += nutrient.vitamins;
		total			 += nutrient.minerals;
		total			 += nutrient.carbs;
		total			 += nutrient.protein;
		total			 += nutrient.fat;
	};
	
	this.Health.update( total );
	this.updateNutrientAndHealth( this.Water, totalWater );
	this.updateNutrientAndHealth( this.Vitamins, totalVitamins );
	this.updateNutrientAndHealth( this.Minerals, totalMinerals );
	this.updateNutrientAndHealth( this.Carbs, totalCarbs );
	this.updateNutrientAndHealth( this.Protein, totalProtein );
	this.updateNutrientAndHealth( this.Fat, totalFat );

	this.currentMoney = this.dailyMoney;
	this.dailyNutrients = [];
	this.UpdateCart();
	
	if( this.Health.currentValue <= 0 )
	{
		var results = { turn : this.turn };
		results.nutrients = 
		[
			this.Water.getFillPercentage(),
			this.Vitamins.getFillPercentage(),
			this.Minerals.getFillPercentage(),
			this.Carbs.getFillPercentage(),
			this.Protein.getFillPercentage(),
			this.Fat.getFillPercentage()
		];

		$.php("php/SaveFile.php", results );

		//alert( "YOU SURVIVED FOR "+ this.turn + " DAYS!" );

		for (var i = 0; i < this.turn; i++) 
		{
			this.lineChart.removeData();
		};
		
		this.turn = 1;
		this.Pain.currentValue = this.Pain.starting;
		this.Health.currentValue = this.Health.starting;
		this.Water.currentValue = this.Water.starting;
		this.Vitamins.currentValue = this.Vitamins.starting;
		this.Minerals.currentValue = this.Minerals.starting;
		this.Carbs.currentValue = this.Carbs.starting;
		this.Protein.currentValue = this.Protein.starting;
		this.Fat.currentValue = this.Fat.starting;

		setTimeout( trigerAi, 1000 );
	}
	else
	{
		setTimeout( trigerAi, 50 );
	}

	//this.barChart.datasets[ 0 ].points[ 0 ].value = this.Health.getFillPercentage();
	//this.barChart.datasets[ 0 ].points[ 1 ].value = this.Pain.getFillPercentage();
	this.barChart.datasets[ 5 ].points[ 0 ].value = this.Water.getFillPercentage();
	this.barChart.datasets[ 5 ].points[ 5 ].value = this.Vitamins.getFillPercentage();
	this.barChart.datasets[ 5 ].points[ 1 ].value = this.Minerals.getFillPercentage();
	this.barChart.datasets[ 5 ].points[ 3 ].value = this.Carbs.getFillPercentage();
	this.barChart.datasets[ 5 ].points[ 4 ].value = this.Protein.getFillPercentage();
	this.barChart.datasets[ 5 ].points[ 2 ].value = this.Fat.getFillPercentage();

	this.barChart.update();

	this.drawFood();
};

Game.prototype.updateNutrientAndHealth = function( nutrient, delta ) 
{
	var efficiency = nutrient.update( delta );
	var positive = efficiency * ( ( this.Health.starting * this.MAX_HEALTH_PR ) - this.Health.currentValue ) / 3 * nutrient.delta / this.Health.delta;
	//console.log( nutrient.name + " : " + efficiency * delta );

	if( efficiency >= 0 )
		this.Health.addDelta( positive ); //max increase is 20%
	else
		this.Health.addDelta( efficiency * delta * 2 ); //max decrease is 200%
};

Game.prototype.BuyNutrient = function( nutrientId ) 
{
	if( this.dailyNutrients.indexOf( nutrientId ) == -1 )
	{
		if( this.currentMoney >= this.foodDrawer.nutrients[ nutrientId ].price )
		{
			window[ "foodChart" + nutrientId ].switchState( true );
			this.dailyNutrients.push( nutrientId );
			this.currentMoney -= this.foodDrawer.nutrients[ nutrientId ].price;
			this.UpdateCart();
		}
		else
		{
			alert("You don't have more money! End your turn to get more.");
		}
	}
	else
	{
		window[ "foodChart" + nutrientId ].switchState( false );
		this.currentMoney += this.foodDrawer.nutrients[ nutrientId ].price;
		this.dailyNutrients.splice( this.dailyNutrients.indexOf( nutrientId ), 1 );
		this.UpdateCart();
	}
	if( this.dailyNutrients.length == 3 )
		this.DrawLineChart(1);
};

Game.prototype.UpdateCart = function() 
{
	this.totalWater = 0;
	this.totalVitamins = 0;
	this.totalMinerals = 0;
	this.totalCarbs = 0;
	this.totalProtein = 0;
	this.totalFat = 0;

	var nutrientId;
	var nutrient;

	this.cartHTML.innerHTML = "";
	var cartHTMLStore = "";
	
	for (var i = 0; i < this.dailyNutrients.length; i++ ) 
	{
		nutrientId = this.dailyNutrients[ i ];
		nutrient = this.foodDrawer.nutrients[ nutrientId ];
		cartHTMLStore += '<p>' + nutrient.foodName + ' : ' + nutrient.price + ' <button onclick="game.RemoveNutrient('+ nutrientId +')">X</button></p>';

		this.totalWater += nutrient.water;
		this.totalVitamins += nutrient.vitamins;
		this.totalMinerals += nutrient.minerals;
		this.totalCarbs += nutrient.carbs;
		this.totalProtein += nutrient.protein;
		this.totalFat += nutrient.fat;
	};

	/*
	this.generateNutritientTotals( "Water" );
	this.generateNutritientTotals( "Vitamins" );
	this.generateNutritientTotals( "Minerals" );
	this.generateNutritientTotals( "Carbs" );
	this.generateNutritientTotals( "Protein" );
	this.generateNutritientTotals( "Fat" );
	*/
	
	//this.cartHTML.innerHTML += cartHTMLStore;

	this.moneyCountHTML.innerHTML = this.moneyCountDefaultText + this.currentMoney;
};

Game.prototype.generateNutritientTotals = function( nutrientName ) 
{
	var total = this[ "total" + nutrientName ] - this[ nutrientName ].delta;
	var color = "redNumber";
	if( total > 0 ) color = "greenNumber";

	this.cartHTML.innerHTML += '<p>'+ nutrientName +': ' + this[ "total" + nutrientName ] + ' - ' + this[ nutrientName ].delta + ' = <span class="'+ color +'">' + total +'</span></p>';
};

Game.prototype.optionsRadar = 
{
	datasetFill : true,
	scaleShowLabels : true,
	showTooltips: false,
    animation:false,
    scaleFontColor : "#000",
    scaleOverride : true,
    scaleSteps : 12,
    scaleStepWidth : 20,
    scaleStartValue : -20 
};

Game.prototype.optionsBar = 
{
    tooltipTemplate: "<%if (label){%><%=value%> <%}%><%= label %>",

    onAnimationComplete: function()
    {
        var ctx = this.chart.ctx;
        ctx.font = this.scale.font;
        ctx.fillStyle = this.scale.textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        /*
        this.datasets.forEach(function (dataset) {
            dataset.bars.forEach(function (bar) {
            	ctx.fillText(bar.value, bar.x, 220);
            	/*
            	if( bar.value < 10 )
                	ctx.fillText(bar.value, bar.x, bar.y - 5);
                else
                	ctx.fillText(bar.value, bar.x, bar.y + 20);
                
            });
        })
		*/
    },
    showTooltips: true,
    animation:false,
    scaleFontColor : "black",
    scaleOverride : false,
    scaleSteps : 7,
    scaleStepWidth : 20,
    scaleStartValue : 0 
};

Game.prototype.optionsLine = 
{
    tooltipTemplate: "<%if (label){%><%=value%> <%}%><%= label %>",
    showTooltips: true,
    animation:false,
    scaleFontColor : "black",
    scaleOverride : true,
    scaleSteps : 7,
    scaleStepWidth : 20,
    scaleStartValue : 0 
};

Game.prototype.radarChartData = 
{
	labels : [ "Water","Minerals","Fat","Carbs","Protein","Vitamins"],
	datasets : [
		{
			label: "overdose",
			fillColor : "rgba(243,176,165,0.2)",
			strokeColor : "rgba(220,220,220,0.8)",
			highlightFill: "rgba(220,220,220,0)",
			highlightStroke: "rgba(220,220,220,1)",
			data : [200,350,200,250,300,600]
		},
		{
			label: "resisted",
			fillColor : "rgba(246,230,140,0.2)",
			strokeColor : "rgba(220,220,220,0.8)",
			highlightFill: "rgba(220,220,220,0)",
			highlightStroke: "rgba(220,220,220,1)",
			data : [150,200,150,180,250,400]
		},
		{
			label: "maxOptimum",
			fillColor : "rgba(195,232,188,0.2)",
			strokeColor : "rgba(220,220,220,0.8)",
			highlightFill: "rgba(220,220,220,0)",
			highlightStroke: "rgba(220,220,220,1)",
			data : [120,150,110,130,150,200]
		},
		{
			label: "minOptimum",
			fillColor : "rgba(246,230,140,0.2)",
			strokeColor : "rgba(220,220,220,0.8)",
			highlightFill: "rgba(220,220,220,0)",
			highlightStroke: "rgba(220,220,220,1)",
			data : [80,50,40,25,90,70]
		},
		{
			label: "minimum",
			fillColor : "rgba(243,176,165,0.2)",
			strokeColor : "rgba(220,220,220,0.8)",
			highlightFill: "rgba(220,220,220,0)",
			highlightStroke: "rgba(220,220,220,1)",
			data : [50,10,20,5,50,30]
		},
		{
			label: "current",
			fillColor : "rgba(255,255,255,0)",
			strokeColor : "rgba(0,0,0,0.8)",
			highlightFill: "rgba(220,220,220,0)",
			highlightStroke: "rgba(220,220,220,1)",
			data : [100,100,100,100,100,100]
		}
	]
};

Game.prototype.barChartData = 
{
	labels : [ "Water","Vitamins","Minerals","Carbs","Protein","Fat"],
	datasets : [
		{
			fillColor : [ "#13ef80", "#ef139f", "#2094ee", "#64ee20", "#c7c7c7", "#ee2024", "#a856ed", "#ee9e20" ],
			strokeColor : "rgba(220,220,220,0.8)",
			highlightFill: "rgba(220,220,220,0)",
			highlightStroke: "rgba(220,220,220,1)",
			data : [100,100,100,100,100,100]
		}
	]
};

Game.prototype.lineChartData = 
{
	labels : [ "1" ],
	datasets : [
		{
            fillColor: "rgba(19,239,128,0.3)",
            strokeColor: "#000000",
            pointColor: "#000000",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [ 100 ]
        },
        {
            fillColor: "rgba(220,220,220,0)",
            strokeColor: "#ef139f",
            pointColor: "#ef139f",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [ 100 ]
        },
        {
            fillColor: "rgba(220,220,220,0)",
            strokeColor: "#2094ee",
            pointColor: "#2094ee",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [ 100 ]
        },
        {
            fillColor: "rgba(220,220,220,0)",
            strokeColor: "#64ee20",
            pointColor: "#64ee20",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [ 100 ]
        },
        {
            fillColor: "rgba(220,220,220,0)",
            strokeColor: "#c7c7c7",
            pointColor: "#c7c7c7",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [ 100 ]
        },
        {
            fillColor: "rgba(220,220,220,0)",
            strokeColor: "#ee2024",
            pointColor: "#ee2024",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [ 100 ]
        },
        {
            fillColor: "rgba(220,220,220,0)",
            strokeColor: "#a856ed",
            pointColor: "#a856ed",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [ 100 ]
        },
        {
            fillColor: "rgba(220,220,220,0)",
            strokeColor: "#ee9e20",
            pointColor: "#ee9e20",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [ 100 ]
        }
	]
};

Game.prototype.DrawLineChart = function( steps ) 
{
	for (var i = 0; i < steps; i++) 
	{
		this.Update();
		this.addDataToLineChart();
	};
	this.lineChart.update();
};

Game.prototype.addDataToLineChart = function() 
{
	var data = [];
	data.push( this.Health.getFillPercentage() );
	data.push( this.Pain.getFillPercentage() );
	data.push( this.Water.getFillPercentage() );
	data.push( this.Vitamins.getFillPercentage() );
	data.push( this.Minerals.getFillPercentage() );
	data.push( this.Carbs.getFillPercentage() );
	data.push( this.Protein.getFillPercentage() );
	data.push( this.Fat.getFillPercentage() );

	this.lineChart.addData( data, this.turn );
};

