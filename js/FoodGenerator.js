var FoodGenerator = function()
{
	this.nutrientsMax = 1000; //optimal

	this.maxDeviation = 100;

	this.water;
	this.protein;
	this.fat;
	this.carbs;
	this.vitamins;
	this.minerals;

	this.itemTemplate = 
	{
		"id":0,
		"foodName":"itemName",
		"type":"food",
		"price":1,
		"water":1,
		"vitamins":1,
		"minerals":1,
		"carbs":1,
		"protein":1,
		"fat":1
	};

	this.nutrients = [];

	this.profiles = 
	[
		{
			type		: "junk",
			names		: ["Carbonara","Hamburger","Pizza","Kebab"],
			nutrient0 	: 25,	//water
			nutrient1 	: 1,	//vitamins
			nutrient2 	: 1,	//minerals
			nutrient3 	: 10,	//carbs
			nutrient4 	: 25,	//protein
			nutrient5 	: 0	//fat
		},
		{
			type		: "drinks",
			names		: ["Water","Soda Drink","Tea","Fruit Juice","Beer","Wine"],
			nutrient0 : 80,
			nutrient1 : 1,
			nutrient2 : 3,
			nutrient3 : 30,
			nutrient4 : 0,
			nutrient5 : 0
		},
		{
			type		: "starchy",
			names		: ["Bread","Pasta","Cereals","Rice","Noodles"],
			nutrient0 : 10,
			nutrient1 : 1,
			nutrient2 : 1,
			nutrient3 : 60,
			nutrient4 : 10,
			nutrient5 : 8
		},
		{
			type		: "fruit",
			names		: ["Apple","Banana","Orange","Berries","Kiwi","Pear"],
			nutrient0 : 20,
			nutrient1 : 1,
			nutrient2 : 3,
			nutrient3 : 20,
			nutrient4 : 1,
			nutrient5 : 1
		},
		{
			type		: "dairy",
			names		: ["Yogurt","Cheese","Milk","Cream Cheese","Butter","Crème fraîche"],
			nutrient0 : 45,
			nutrient1 : 2,
			nutrient2 : 3,
			nutrient3 : 10,
			nutrient4 : 20,
			nutrient5 : 10
		},
		{
			type		: "proteins",
			names		: ["Eggs","Nuts","Beans","Fish","Chicken","Beef","Bacon"],
			nutrient0 : 20,
			nutrient1 : 0,
			nutrient2 : 0,
			nutrient3 : 0,
			nutrient4 : 25,
			nutrient5 : 12
		},
		{
			type		: "vegetables",
			names		: ["Potatoes","Tomatoes","Onions","Lettuce","Avocado","Corn"],
			nutrient0 : 50,
			nutrient1 : 4,
			nutrient2 : 0,
			nutrient3 : 2,
			nutrient4 : 4,
			nutrient5 : 0
		}
	];
	
}

FoodGenerator.prototype.generate = function( index ) 
{
	var profile = this.profiles[ this.getRandomInt( 0, this.profiles.length - 1 ) ];

	this.itemTemplate.id = index;
	this.itemTemplate.foodName = profile.names[ this.getRandomInt( 0, profile.names.length - 1 ) ];
	this.itemTemplate.price = 1;
	
	//this.nutrientsMax = this.getRandomInt( 900, 1100 ); 
	
	var nutrientsSum = 0;
	var nutrientsRandoms = [];
	var base;

	for (var i = 0; i < 6; i++) 
	{
		base = profile["nutrient" + i ];
		nutrientsRandoms[ i ] = this.getRandomInt( this.getRandomInt( base - this.gp( base, this.maxDeviation ), base ), this.getRandomInt( base, base + this.gp( base, this.maxDeviation ) ) );
		nutrientsSum += nutrientsRandoms[ i ];
	};

	this.itemTemplate.water = Math.round( nutrientsRandoms[ 0 ] / nutrientsSum * this.nutrientsMax );
	this.itemTemplate.vitamins = Math.round( nutrientsRandoms[ 1 ] / nutrientsSum * this.nutrientsMax );
	this.itemTemplate.minerals = Math.round( nutrientsRandoms[ 2 ] / nutrientsSum * this.nutrientsMax );
	this.itemTemplate.carbs = Math.round( nutrientsRandoms[ 3 ] / nutrientsSum * this.nutrientsMax );
	this.itemTemplate.protein = Math.round( nutrientsRandoms[ 4 ] / nutrientsSum * this.nutrientsMax );
	this.itemTemplate.fat = Math.round( nutrientsRandoms[ 5 ] / nutrientsSum * this.nutrientsMax );
	
	return JSON.parse( JSON.stringify( this.itemTemplate ) );
};

FoodGenerator.prototype.gp = function( base, percent )
{
	return Math.round( base * percent );
}

FoodGenerator.prototype.getRandomInt = function(min, max) 
{
  if ( min < 0 ) min = 0;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}