var FoodGenerator = function()
{
	this.nutrientsMax = 800; //optimal

	this.nutrientsMaxProfiles = 
	[
		700,
		750,
		800,
		850,
		900,
		950,
		1000,
		1200
	];

	this.maxDeviation = .5;

	this.foodIndex = 0;

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
	this.uniqueRandoms = [];

	this.profiles = 
	[
		{
			type		: "junk",
			names		: ["Carbonara","Hamburger","Pizza","Kebab"],
			water 		: 25,	//water
			vitamins 	: 1,	//vitamins
			minerals 	: 1,	//minerals
			carbs 		: 15,	//carbs
			protein 	: 25,	//protein
			fat 		: 0	//fat
		},
		{
			type		: "drinks",
			names		: ["Water","Soda Drink","Tea","Fruit Juice","Beer","Wine"],
			water 		: 85,
			vitamins 	: 1,
			minerals 	: 3,
			carbs 		: 25,
			protein 	: 0,
			fat 		: 0
		},
		{
			type		: "sweets",
			names		: ["Brownies","Donuts","Chocolate","Tiramisu","KitKat","Baklava"],
			water 		: 10,
			vitamins 	: 0,
			minerals 	: 5,
			carbs 		: 80,
			protein 	: 0,
			fat 		: 10
		},
		{
			type		: "starchy",
			names		: ["Bread","Pasta","Cereals","Rice","Noodles"],
			water 		: 10,
			vitamins 	: 1,
			minerals 	: 1,
			carbs 		: 60,
			protein 	: 10,
			fat 		: 8
		},
		{
			type		: "fruit",
			names		: ["Apple","Banana","Orange","Berries","Kiwi","Pear"],
			water 		: 30,
			vitamins 	: 1,
			minerals 	: 3,
			carbs 		: 40,
			protein 	: 1,
			fat 		: 1
		},
		{
			type		: "dairy",
			names		: ["Yogurt","Cheese","Milk","Cream Cheese","Butter","Crème fraîche"],
			water 		: 45,
			vitamins 	: 2,
			minerals 	: 3,
			carbs 		: 10,
			protein 	: 20,
			fat 		: 10
		},
		{
			type		: "proteins",
			names		: ["Eggs","Nuts","Beans","Fish","Chicken","Beef","Bacon"],
			water 		: 20,
			vitamins 	: 0,
			minerals 	: 0,
			carbs 		: 0,
			protein 	: 25,
			fat 		: 12
		},
		{
			type		: "vegetables",
			names		: ["Potatoes","Tomatoes","Onions","Lettuce","Avocado","Corn"],
			water 		: 50,
			vitamins 	: 4,
			minerals 	: 0,
			carbs 		: 0,
			protein 	: 4,
			fat 		: 0
		}
	];
	
}

FoodGenerator.prototype.generate = function( index ) 
{
	var profile = this.profiles[ this.uniqueRandom() ];
	//var profile = this.profiles[ this.foodIndex ];

	this.itemTemplate.id = this.foodIndex++;
	this.itemTemplate.foodName = profile.names[ this.getRandomInt( 0, profile.names.length - 1 ) ];
	this.itemTemplate.price = 1;
	
	this.nutrientsMax = this.nutrientsMaxProfiles[ this.getRandomInt( 0, this.nutrientsMaxProfiles.length - 1 ) ]; 
	
	var nutrientsSum = 0;
	var nutrientsRandoms = [];
	var base;
	var gp;

	for (var i = 0; i < 6; i++) 
	{
		base = profile[ this.nutrientsIndexMap[ i ] ];
		gp = this.gp( base, this.maxDeviation );
		nutrientsRandoms[ i ] = this.getRandomInt( this.getRandomInt( base - gp, base ), this.getRandomInt( base, base + gp ) );
		nutrientsSum += nutrientsRandoms[ i ];
	};

	this.itemTemplate.water = Math.round( nutrientsRandoms[ 0 ] / nutrientsSum * this.nutrientsMax );
	this.itemTemplate.vitamins = Math.round( nutrientsRandoms[ 1 ] / nutrientsSum * this.nutrientsMax );
	this.itemTemplate.minerals = Math.round( nutrientsRandoms[ 2 ] / nutrientsSum * this.nutrientsMax );
	this.itemTemplate.carbs = Math.round( nutrientsRandoms[ 3 ] / nutrientsSum * this.nutrientsMax );
	this.itemTemplate.protein = Math.round( nutrientsRandoms[ 4 ] / nutrientsSum * this.nutrientsMax );
	this.itemTemplate.fat = Math.round( nutrientsRandoms[ 5 ] / nutrientsSum * this.nutrientsMax );
	
	
	return JSON.parse( JSON.stringify( this.itemTemplate ) );
}

FoodGenerator.prototype.uniqueRandom = function() 
{
    // refill the array if needed
    if (!this.uniqueRandoms.length) 
        for (var i = 0; i < this.profiles.length; i++) 
            this.uniqueRandoms.push(i);
    
    var index = Math.floor(Math.random() * this.uniqueRandoms.length);
    var val = this.uniqueRandoms[index];

    // now remove that value from the array
    this.uniqueRandoms.splice(index, 1);

    return val;
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

FoodGenerator.prototype.nutrientsIndexMap = 
[
	"water",
	"vitamins",
	"minerals",
	"carbs",
	"protein",
	"fat"
]