var Stats = function()
{
	this.reset();
}

Stats.prototype.reset = function() 
{
	this.minTurn = 1000;
	this.maxTurn = 0;
	this.avgTurn = 0;
	this.rounds = [];
};

Stats.prototype.update = function( results ) 
{
	if( results.turn < this.minTurn && results.turn > 0 )
		this.minTurn = results.turn;
	if( results.turn > this.maxTurn )
		this.maxTurn = results.turn;

	this.rounds.push( results );
	
	this.calculateAvgTurn();
};

Stats.prototype.calculateAvgTurn = function() 
{
	var totalTurn = 0;
	for (var i = 0; i < this.rounds.length; i++) 
	{
		totalTurn += this.rounds[ i ].turn;
	};

	this.avgTurn = Math.round( totalTurn / this.rounds.length );
};