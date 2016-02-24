/**********************************
/*******NutrientLevelValues********
/*********************************/

var NutrientLevelValues = function( name, maxDays, delta, minimum, minOptimum, maxOptimum, resisted, overdose )
{
	this.MAX_NEGATIVE_PR = -20;
	this.MAX_POSITIVE_PR = 1.1;

	this.name = name;
	this.starting = delta * maxDays; //hard number value
	
	this.delta = delta; //hard number value of how much the level value drops per time unit
	this.minimum = minimum; //minimum percentage below which you get negative amount
	this.minOptimum = minOptimum; //minimum optimal percentage from where you get maximum positive amount
	this.maxOptimum = maxOptimum; //maximum optimal percentage till where you get maximum positive amount
	this.resisted = resisted; //maximum percent till which your amount drops to 0
	this.overdose = overdose; //overdose percentage when you get negative amount
	this.resetCurrentValue();
}

NutrientLevelValues.prototype.resetCurrentValue = function() 
{
	this.currentValue = this.starting * this.minOptimum / 100;
};

NutrientLevelValues.prototype.getEfficientyValue = function() 
{
	var percentageValue = Math.round( this.currentValue / this.starting * 100 );

	if( percentageValue < 0 ) 
		return -1;

	if( percentageValue < this.minimum ) 
		return ( percentageValue / this.minimum ) - 1;

	if( percentageValue >= this.minimum && percentageValue < this.minOptimum )
		return ( percentageValue - this.minimum ) / ( this.minOptimum - this.minimum );

	if( percentageValue >= this.minOptimum && percentageValue < this.maxOptimum )
		return 1;

	if( percentageValue >= this.maxOptimum && percentageValue < this.resisted )
		return 1 - ( percentageValue - this.maxOptimum ) / ( this.resisted - this.maxOptimum );

	if( percentageValue >= this.resisted && percentageValue < this.overdose )
		return ( percentageValue - this.resisted ) / ( this.overdose - this.resisted ) * -1;

	if( percentageValue >= this.overdose )
		return -1;

	return 0;
};

NutrientLevelValues.prototype.getFillPercentage = function() 
{
	return Math.round( this.currentValue / this.starting * 100 );
};

NutrientLevelValues.prototype.update = function( inputGrams ) 
{
	var newValue = this.currentValue + inputGrams - this.delta;
	var newPercentage = Math.round( newValue / this.starting * 100);
	var maxOverdose = Math.round( this.overdose * this.MAX_POSITIVE_PR );
	
	if( newPercentage > this.MAX_NEGATIVE_PR )
		if( newPercentage < maxOverdose )
			this.currentValue = newValue;
		else
			this.currentValue = ( maxOverdose * this.starting / 100 );
	else
		this.currentValue = this.starting * this.MAX_NEGATIVE_PR / 100;

	return this.getEfficientyValue();
};

NutrientLevelValues.prototype.addDelta = function( delta ) 
{
	//console.log( "        " + delta );
	this.currentValue += delta;
};

NutrientLevelValues.prototype.getZoneValue = function() 
{
	var percentageValue = Math.round( this.currentValue / this.starting * 100 );

	if( percentageValue < 0 ) 
		return 0;

	if( percentageValue < this.minimum ) 
		return 1;

	if( percentageValue >= this.minimum && percentageValue < this.minOptimum )
		return 2;

	if( percentageValue >= this.minOptimum && percentageValue < this.maxOptimum )
		return 3;

	if( percentageValue >= this.maxOptimum && percentageValue < this.resisted )
		return 4;

	if( percentageValue >= this.resisted && percentageValue < this.overdose )
		return 5;

	if( percentageValue >= this.overdose )
		return 6;

	return 0;
};
