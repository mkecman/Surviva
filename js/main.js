var game;

window.onload = function()
{
    game = new Game();
	game.StartGame();
};


/*Dynamic loading example
window.onload = function()
{
    $.getScript("js/nutrients.js", onNutrientsJSLoad );
};

function onNutrientsJSLoad()
{
	$.getJSON("data/nutrients.json", onNutrientsLoad );
}

function onNutrientsLoad( json )
{
	processJson( json );
	$.getScript("js/game.js", onGameJSLoad );
}

function onGameJSLoad()
{
	game = new Game( nutrients );
	game.StartGame();
	game.DrawLineChart( 0 );
}
*/