function trigerAi()
{
	game.ai.playNextMove();
}

function resetAi()
{
	game.reset();
	game.ai.playNextMove();
}

var Game = function()
{
	this.MAX_HEALTH_PR = 1.2;
	this.MAX_BUY_FOOD = 1;
	this.MAX_DRAWN_FOOD = 3;
	this.SURVIVE_DAYS = 30;
	this.timeoutID = 0;
	
	this.turn = 1;
	this.aiEnabled = false;

	this.dailyMoney = this.MAX_BUY_FOOD;
	this.dailyNutrients = [];
	this.currentMoney = 0;

	this.Pain 		= new NutrientLevelValues( "Pain",		 100000, 0.01,	 1,		 2,		 3,		 4,		 5 );
	this.Health 	= new NutrientLevelValues( "Health",	 3,		 1000,	 35,	 65,	 150,	 200,	 300 ); //5d
	this.Water 		= new NutrientLevelValues( "Water",		 4,		 500,	 50,	 80,	 120,	 150,	 200 ); //4d
	this.Vitamins 	= new NutrientLevelValues( "Vitamins",	 12,	 25,	 30,	 70,	 200,	 400,	 600 ); //12d
	this.Minerals 	= new NutrientLevelValues( "Minerals",	 24,	 25,	 10,	 50,	 150,	 200,	 350 ); //24d
	this.Carbs 		= new NutrientLevelValues( "Carbs",		 30,	 250,	 5,		 25,	 130,	 180,	 250 ); //30d
	this.Protein 	= new NutrientLevelValues( "Protein",	 7,		 150,	 50,	 90,	 150,	 250,	 300 ); //7d
	this.Fat 		= new NutrientLevelValues( "Fat",		 18,	 50,	 20,	 40,	 110,	 150,	 200 ); //18d
	this.setupRadarChart();

	this.Health.currentValue = this.Health.starting;

	this.totalWater = 0;
	this.totalVitamins = 0;
	this.totalMinerals = 0;
	this.totalCarbs = 0;
	this.totalProtein = 0;
	this.totalFat = 0;

	this.foodGenerator = new FoodGenerator();
	this.foodDrawer = new DrawFood();

	this.ai = new Ai( this );
	this.stats = new Stats();
};

Game.prototype.StartGame = function()
{
	this.megaTurn = this.getMegaTurn();
	$.php("php/SaveFile.php", 
		{ turn:"turn", 
		megaTurn: this.megaTurn, 
		nutrients : ["water","vitamins","minerals","carbs","protein","fat"],
		minTurn : "minTurn",
		maxTurn : "maxTurn",
		avgTurn : "avgTurn",
		totalRounds : "rounds"
	} );

	this.turnCountHTML = document.getElementById( "turn-count" );
	this.turnCountHTMLDefaultText = "You survived for ";

	this.moneyCountHTML = document.getElementById( "money-count" );
	this.moneyCountDefaultText = this.moneyCountHTML.innerHTML;
	this.currentMoney = this.dailyMoney;
	this.moneyCountHTML.innerHTML = this.moneyCountDefaultText + this.currentMoney;
	this.cartHTML = document.getElementById( "cart" );

	var ctx = document.getElementById("nutrient-levels-canvas").getContext("2d");
	this.setCTXSize( ctx, 0.85, 0.5 );
	this.radarChart = new Chart(ctx).Radar(this.radarChartData, this.optionsRadar);
	this.UpdateRadarChart();

	var ctx2 = document.getElementById("nutrients-line-levels-canvas").getContext("2d");
	this.setCTXSize( ctx2, 0.98, 0.5 );
	this.lineChart = new Chart(ctx2).Line(this.lineChartData, this.optionsLine);

	var ctx3 = document.getElementById("health-level-canvas").getContext("2d");
	this.setCTXSize( ctx3, 0.13, 0.5 );
	this.barChart = new Chart(ctx3).Bar(this.barChartData, this.optionsBar);

	this.foodDrawer.drawHTML( this.MAX_DRAWN_FOOD );
	this.UpdateGraphics();

	if( this.aiEnabled )
		this.timeoutID = setTimeout( trigerAi, 500 );
	else
		alert( "How to play:\n1 - Keep nutrients levels in the green area.\n2 - AVOID falling into the red zone!\n3 - Try to survive for "+ this.SURVIVE_DAYS + " days!" );
}

Game.prototype.drawFood = function() 
{
	this.foodDrawer.nutrients = [];

	this.foodGenerator.foodIndex = 0;
	this.foodGenerator.uniqueRandoms = [];
	for (var i = 0; i < this.MAX_DRAWN_FOOD; i++) 
	{
		var nutrient = this.foodGenerator.generate();
		this.foodDrawer.nutrients.push( nutrient );
	};
	
	if( !this.aiEnabled )
	{
		this.foodDrawer.makeFoodGraphs();
	}
};

Game.prototype.startAi = function() 
{
	ENABLE_ANIMATIONS = false;
	this.aiEnabled = true;
	this.ai.playNextMove();
};

Game.prototype.stopAi = function() 
{
	ENABLE_ANIMATIONS = true;
	this.aiEnabled = false;
	clearTimeout(this.timeoutID);
};

Game.prototype.Update = function() 
{
	this.turn++;

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

	this.UpdateGraphics();

	if( this.turn == this.SURVIVE_DAYS )
	{
		this.winRound();
		return;
	}

	if( this.Health.currentValue <= 0 )
		this.loseRound();
	else
		if( this.aiEnabled )
			this.timeoutID = setTimeout( trigerAi, 30 );
};

Game.prototype.UpdateGraphics = function() 
{
	var plural = this.turn > 1 ? "s" : ""; 
	this.turnCountHTML.innerHTML = this.turnCountHTMLDefaultText + this.turn + " day" + plural + " out of " + this.SURVIVE_DAYS + " days!";

	this.UpdateCart();
	this.UpdateRadarChart();
	this.barChart.datasets[ 0 ].bars[ 0 ].value = this.Health.getFillPercentage();
	this.setHealthBarColor();
	this.barChart.update();
	this.drawFood();
};

Game.prototype.setHealthBarColor = function() 
{
	var fill = this.Health.getFillPercentage();
	var health = this.Health;
	
	if( fill < health.minimum ) 
		this.barChart.datasets[ 0 ].bars[ 0 ].fillColor = this.healtBarColors[ 0 ];

	if( fill >= health.minimum && fill < health.minOptimum )
		this.barChart.datasets[ 0 ].bars[ 0 ].fillColor = this.healtBarColors[ 1 ];

	if( fill >= health.minOptimum && fill < health.maxOptimum )
		this.barChart.datasets[ 0 ].bars[ 0 ].fillColor = this.healtBarColors[ 2 ];

	if( fill >= health.maxOptimum && fill < health.resisted )
		this.barChart.datasets[ 0 ].bars[ 0 ].fillColor = this.healtBarColors[ 1 ];

	if( fill >= health.resisted && fill < health.overdose )
		this.barChart.datasets[ 0 ].bars[ 0 ].fillColor = this.healtBarColors[ 0 ];
};

Game.prototype.winRound = function() 
{
	this.trackResult();

	if( !this.aiEnabled )
	{
		var anotherGame = confirm( "Woooohoooo! The rescue team found you!\n\nOK - Play another round?\nCancel - Continue playing until you DIE!" );
		if ( anotherGame ) 
		{
			this.reset();
			this.UpdateGraphics();
		}
	}
	else
		this.timeoutID = setTimeout( trigerAi, 30 );
};

Game.prototype.loseRound = function() 
{
	this.trackResult();

	if( !this.aiEnabled )
	{
		var anotherGame = confirm( "Oh noooo, you died :(\nYou survived for "+ this.turn + " days!\nBetter luck next time!\n\nPlay another round?" );
		if ( anotherGame == false ) 
			alert( "Well, we'll give you an option to play anyway :)" );

		this.reset();
		this.UpdateGraphics();
	}
	else
		this.timeoutID = setTimeout( resetAi, 1000 );
};

Game.prototype.trackResult = function() 
{
	var results = { turn : this.turn };
	results.megaTurn = this.megaTurn;
	results.nutrients = 
	[
		this.Water.getFillPercentage(),
		this.Vitamins.getFillPercentage(),
		this.Minerals.getFillPercentage(),
		this.Carbs.getFillPercentage(),
		this.Protein.getFillPercentage(),
		this.Fat.getFillPercentage()
	];

	this.stats.update( results );

	results.minTurn = this.stats.minTurn;
	results.maxTurn = this.stats.maxTurn;
	results.avgTurn = this.stats.avgTurn;
	results.totalRounds = this.stats.rounds.length;

	$.php("php/SaveFile.php", results );

	$.php("php/SavePNG.php", { image: this.lineChart.toBase64Image(), megaTurn: this.megaTurn, rounds: results.totalRounds } );
};

Game.prototype.reset = function() 
{
	this.lineChart.removeData();
	this.turn = 1;
	this.Pain.currentValue = this.Pain.starting;
	this.Health.currentValue = this.Health.starting;
	this.Water.resetCurrentValue();
	this.Vitamins.resetCurrentValue();
	this.Minerals.resetCurrentValue();
	this.Carbs.resetCurrentValue();
	this.Protein.resetCurrentValue();
	this.Fat.resetCurrentValue();
};

Game.prototype.UpdateRadarChart = function() 
{
	/*
	this.radarChart.segments[ 0 ].value = this.Water.getFillPercentage();
	this.radarChart.segments[ 1 ].value = this.Vitamins.getFillPercentage();
	this.radarChart.segments[ 2 ].value = this.Minerals.getFillPercentage();
	this.radarChart.segments[ 5 ].value = this.Carbs.getFillPercentage();
	this.radarChart.segments[ 4 ].value = this.Protein.getFillPercentage();
	this.radarChart.segments[ 3 ].value = this.Fat.getFillPercentage();
	this.radarChart.update();
	*/
	
	this.radarChart.datasets[ 5 ].points[ 0 ].value = this.Water.getFillPercentage();
	this.radarChart.datasets[ 5 ].points[ 5 ].value = this.Vitamins.getFillPercentage();
	this.radarChart.datasets[ 5 ].points[ 1 ].value = this.Minerals.getFillPercentage();
	this.radarChart.datasets[ 5 ].points[ 3 ].value = this.Carbs.getFillPercentage();
	this.radarChart.datasets[ 5 ].points[ 4 ].value = this.Protein.getFillPercentage();
	this.radarChart.datasets[ 5 ].points[ 2 ].value = this.Fat.getFillPercentage();
	
	var maxScaleStep = this.optionsRadar.scaleSteps;
	for (var i = 0; i < this.radarChart.datasets[5].points.length; i++) 
	{
		var point = this.radarChart.datasets[5].points[i];
		var nutrientScaleStep = point.value / this.optionsRadar.scaleStepWidth;
		if( nutrientScaleStep > maxScaleStep )
			maxScaleStep = nutrientScaleStep;
	};
	if( maxScaleStep > 12 )
		maxScaleStep = 12;
	this.radarChart.options.scaleSteps = maxScaleStep;
	this.radarChart.update();

};

Game.prototype.updateNutrientAndHealth = function( nutrient, delta ) 
{
	var efficiency = nutrient.update( delta );
	var positive = efficiency * ( ( this.Health.starting * this.MAX_HEALTH_PR ) - this.Health.currentValue ) / 3 * nutrient.delta / this.Health.delta;

	if( efficiency >= 0 )
		this.Health.addDelta( positive ); //max increase is 20%
	else
		this.Health.addDelta( efficiency * nutrient.delta ); //max decrease is 200%
};

Game.prototype.BuyNutrient = function( nutrientId ) 
{
	if( this.dailyNutrients.indexOf( nutrientId ) == -1 )
	{
		if( this.currentMoney >= this.foodDrawer.nutrients[ nutrientId ].price )
		{
			//window[ "foodChart" + nutrientId ].switchState( true );
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
	if( this.dailyNutrients.length == this.MAX_BUY_FOOD )
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
	animation: ENABLE_ANIMATIONS,
	scaleFontColor : "#888",
	scaleOverride : true,
	scaleSteps : 6,
	scaleStepWidth : 20,
	scaleStartValue : -20,
	pointDotRadius : 4,
	pointDotStrokeWidth : 2,
};

Game.prototype.optionsBar = 
{
    tooltipTemplate: "<%if (label){%><%=value%> <%}%><%= label %>",
    showTooltips: false,
    animation: ENABLE_ANIMATIONS,
    scaleGridLineColor : "rgba(0,0,0,.05)",
    scaleFontColor : "rgba(0,0,0,.5)",
    scaleShowVerticalLines: false,
    scaleOverride : true,
    scaleSteps : 12,
    scaleStepWidth : 10,
    scaleStartValue : 0 
};

Game.prototype.optionsLine = 
{
    tooltipTemplate: "<%if (label){%><%=value%> <%}%><%= label %>",
    showTooltips: false,
    animation:false,
    scaleFontColor : "black",
    scaleOverride : true,
    scaleSteps : 7,
    scaleStepWidth : 20,
    scaleStartValue : 0 
};

Game.prototype.polarChartData = 
[
	{
		value: 50,
        color: "#2094ee",
        highlight: "#2094ee",
        label: "Water"
	},
	{
		value: 50,
        color: "#64ee20",
        highlight: "#64ee20",
        label: "Vitamins"
	},
	{
		value: 50,
        color: "#c7c7c7",
        highlight: "#c7c7c7",
        label: "Minerals"
	},
	{
		value: 50,
        color: "#ee9e20",
        highlight: "#ee9e20",
        label: "Fat"
	},
	{
		value: 50,
        color: "#a856ed",
        highlight: "#a856ed",
        label: "Protein"
	},
	{
		value: 50,
        color: "#ee2024",
        highlight: "#ee2024",
        label: "Carbs"
	}
];

Game.prototype.radarChartData = 
{
	labels : [ "Water","Minerals","Fat","Carbs","Protein","Vitamins"],
	labelColors: [ "#2094ee", "#c7c7c7", "#ee9e20", "#ee2024", "#a856ed", "#64ee20" ],
	datasets : [
		{
			label: "overdose",
			fillColor : "rgba(243,176,165,1)",
			strokeColor : "rgba(220,220,220,0)",
			highlightFill: "rgba(220,220,220,0)",
			highlightStroke: "rgba(220,220,220,1)",
			pointDotRadius : 0,
			pointDotStrokeWidth : 0,
			strokeWidth : 0,
			data : [200,350,200,250,300,600]
		},
		{
			label: "resisted",
			fillColor : "rgba(246,230,140,1)",
			strokeColor : "rgba(220,220,220,0)",
			highlightFill: "rgba(220,220,220,0)",
			highlightStroke: "rgba(220,220,220,1)",
			pointDotRadius : 0,
			pointDotStrokeWidth : 0,
			strokeWidth : 0,
			data : [150,200,150,180,250,400]
		},
		{
			label: "maxOptimum",
			fillColor : "rgba(195,232,188,1)",
			strokeColor : "rgba(220,220,220,0)",
			highlightFill: "rgba(220,220,220,0)",
			highlightStroke: "rgba(220,220,220,1)",
			pointDotRadius : 0,
			pointDotStrokeWidth : 0,
			strokeWidth : 0,
			data : [120,150,110,130,150,200]
		},
		{
			label: "minOptimum",
			fillColor : "rgba(246,230,140,1)",
			strokeColor : "rgba(220,220,220,0)",
			highlightFill: "rgba(220,220,220,0)",
			highlightStroke: "rgba(220,220,220,1)",
			pointDotRadius : 0,
			pointDotStrokeWidth : 0,
			strokeWidth : 0,
			data : [80,50,40,25,90,70]
		},
		{
			label: "minimum",
			fillColor : "rgba(243,176,165,1)",
			strokeColor : "rgba(220,220,220,0)",
			highlightFill: "rgba(220,220,220,0)",
			highlightStroke: "rgba(220,220,220,1)",
			pointDotRadius : 0,
			pointDotStrokeWidth : 0,
			strokeWidth : 0,
			data : [50,10,20,5,50,30]
		},
		{
			label: "current",
			fillColor : "rgba(255,255,255,0)",
			strokeColor : "rgba(0,0,0,1)",
			highlightFill: "rgba(220,220,220,0)",
			highlightStroke: "rgba(220,220,220,1)",
			pointDotRadius : 6,
			pointDotStrokeWidth : 1,
			strokeWidth : 1,
			isLastSet : true,
			data : [100,100,100,100,100,100]
		}
	]
};

Game.prototype.barChartData = 
{
	labels : [ "Health" ],
	datasets : [
		{
			fillColor : [ "#13ef80", "#ef139f", "#2094ee", "#64ee20", "#c7c7c7", "#ee2024", "#a856ed", "#ee9e20" ],
			strokeColor : "rgba(0,0,0,1)",
			highlightFill: "rgba(220,220,220,0)",
			highlightStroke: "rgba(220,220,220,1)",
			data : [100]
		}
	]
};

Game.prototype.healtBarColors = [ "rgba(243,176,165,1)", "rgba(246,230,140,1)", "rgba(195,232,188,1)" ];

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
        /*{
            fillColor: "rgba(220,220,220,0)",
            strokeColor: "#ef139f",
            pointColor: "#ef139f",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [ 100 ]
        },*/
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
	/*
	data.push( this.Pain.getFillPercentage() );
	*/
	data.push( this.Water.getFillPercentage() );
	data.push( this.Vitamins.getFillPercentage() );
	data.push( this.Minerals.getFillPercentage() );
	data.push( this.Carbs.getFillPercentage() );
	data.push( this.Protein.getFillPercentage() );
	data.push( this.Fat.getFillPercentage() );
	

	this.lineChart.addData( data, this.turn );
};

Game.prototype.getMegaTurn = function() 
{
	var date = new Date();
	var month = date.getMonth() + 1;

	return date.getFullYear() + "-" + this.getFullNumber( month ) + "-" + this.getFullNumber( date.getDate() ) + "+" + this.getFullNumber( date.getHours() ) + "-" + this.getFullNumber( date.getMinutes() ) + "-" + this.getFullNumber( date.getSeconds() );
};

Game.prototype.getFullNumber = function( number ) 
{
	if( number < 10 )
		return "0" + number;
	else
		return number;
};

Game.prototype.setCTXSize = function( ctx, widthScale, heightScale ) 
{
	var newWidth = window.innerWidth * widthScale;
	var newHeight = window.innerHeight * heightScale;
	ctx.width  = newWidth;
	ctx.height = newHeight;
	ctx.canvas.width  = newWidth;
	ctx.canvas.height = newHeight;
};

Game.prototype.setupRadarChart = function() 
{
	this.setRadarChartNutrientLevel( this.radarChartData.datasets[ 0 ], "overdose" );
	this.setRadarChartNutrientLevel( this.radarChartData.datasets[ 1 ], "resisted" );
	this.setRadarChartNutrientLevel( this.radarChartData.datasets[ 2 ], "maxOptimum" );
	this.setRadarChartNutrientLevel( this.radarChartData.datasets[ 3 ], "minOptimum" );
	this.setRadarChartNutrientLevel( this.radarChartData.datasets[ 4 ], "minimum" );
};

Game.prototype.setRadarChartNutrientLevel = function( dataset, level ) 
{
	dataset.data = [];
	dataset.data.push( this.Water[ level ] );
	dataset.data.push( this.Minerals[ level ] );
	dataset.data.push( this.Fat[ level ] );
	dataset.data.push( this.Carbs[ level ] );
	dataset.data.push( this.Protein[ level ] );
	dataset.data.push( this.Vitamins[ level ] );
};