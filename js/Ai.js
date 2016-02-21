var Ai = function( game )
{
	this.game = game;
	this.nutrients = [];
	this.foods = [];
	this.output = "";
	this.isSmart = true;
}

Ai.prototype.playNextMove = function() 
{
	/*
	if( game.Health.getFillPercentage() < 50 )
		this.isSmart = true;

	if( game.Health.getFillPercentage() > 115 )
		this.isSmart = false;
	*/

	this.output = "Needed: ";
	this.collectNutrientLevels();
	this.sortNutrientLevels();
	this.collectFoodValues();
	this.findBestFood();
	this.playThreeBestFood();
};

Ai.prototype.collectNutrientLevels = function() 
{
	this.nutrients = [];
	this.collectSingleNutrient( game.Water );
	this.collectSingleNutrient( game.Vitamins );
	this.collectSingleNutrient( game.Minerals );
	this.collectSingleNutrient( game.Carbs );
	this.collectSingleNutrient( game.Protein );
	this.collectSingleNutrient( game.Fat );
};

Ai.prototype.collectSingleNutrient = function( nutrient ) 
{
	var positive = true;
	if( nutrient.currentValue <= 0 )
		positive = false;
	
	this.nutrients.push
	( 
		{ 
			"name" : nutrient.name,
			"efficiency" : nutrient.getEfficientyValue(), 
			"positive" : positive, 
			"fillPercent" : nutrient.getFillPercentage(), 
			"zone" : nutrient.getZoneValue() 
		} 
	);
};

Ai.prototype.sortNutrientLevels = function() 
{
	this.nutrients.sort( this.sortByFill );
	this.nutrients.sort( this.sortByZone );
};

Ai.prototype.sortByFill = function( a, b ) 
{
	return a.fillPercent - b.fillPercent;
};

Ai.prototype.sortByZone = function( a, b ) 
{
	return a.zone - b.zone;
};

Ai.prototype.collectFoodValues = function() 
{
	this.foods = [];
	for (var i = 0; i < game.foodDrawer.nutrients.length; i++) 
	{
		var food = game.foodDrawer.nutrients[i];
		this.foods.push( food );
	};
};

Ai.prototype.findBestFood = function() 
{
	var nutrientName;
	if( this.isSmart )
	{
		nutrientName = this.nutrients[ 0 ].name.toLowerCase();
		this.foods.sort( this.sortFoodByNeededNutrient( nutrientName ) );
	}
	/*else
	{
		nutrientName = this.nutrients[ 0 ].name.toLowerCase();
		this.foods.sort( this.sortFoodByLeastNeededNutrient( nutrientName ) );
	}*/
	
	this.output += nutrientName + ", " + this.nutrients[ 1 ].name.toLowerCase() + ", " + this.nutrients[ 2 ].name.toLowerCase() + " | Food: ";
};

Ai.prototype.sortFoodByNeededNutrient = function( nutrientName ) 
{
	return function( a, b )
	{
		return b[ nutrientName ] - a[ nutrientName ];
	}
};

Ai.prototype.sortFoodByLeastNeededNutrient = function( nutrientName ) 
{
	return function( a, b )
	{
		return a[ nutrientName ] - b[ nutrientName ];
	}
};

Ai.prototype.playThreeBestFood = function() 
{
	for (var i = 0; i < game.MAX_BUY_FOOD; i++) 
	{
		this.game.BuyNutrient( this.foods[ i ].id );
	};
	
	this.output += this.foods[ 0 ].foodName + ", " + this.foods[ 1 ].foodName + ", " + this.foods[ 2 ].foodName;
	//console.log( this.output );
};

