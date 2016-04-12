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
		1100
	];

	this.nutrientsMaxProfiles = 
	[
		900
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
			names		: ["Carbonara","Hamburger","Pizza","Doner", "Fries"],
			water 		: 25,	//water
			vitamins 	: 1,	//vitamins
			minerals 	: 1,	//minerals
			carbs 		: 15,	//carbs
			protein 	: 25,	//protein
			fat 		: 10	//fat
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
			minerals 	: 2,
			carbs 		: 80,
			protein 	: 0,
			fat 		: 5
		},
		{
			type		: "starchy",
			names		: ["Bread","Pasta","Cereals","Rice","Noodles"],
			water 		: 10,
			vitamins 	: 1,
			minerals 	: 1,
			carbs 		: 60,
			protein 	: 10,
			fat 		: 5
		},
		{
			type		: "fruit",
			names		: ["Apple","Banana","Orange","Berries","Kiwi","Pear"],
			water 		: 30,
			vitamins 	: 1,
			minerals 	: 3,
			carbs 		: 40,
			protein 	: 1,
			fat 		: 0
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
			minerals 	: 2,
			carbs 		: 0,
			protein 	: 4,
			fat 		: 0
		}
	];

	this.profiles = 
	[
		{
			type		: "junk",
			names		: ["Carbonara","Hamburger","Pizza","Doner", "Fries"],
			water 		: 50,	//water
			vitamins 	: 10,	//vitamins
			minerals 	: 10,	//minerals
			carbs 		: 10,	//carbs
			protein 	: 10,	//protein
			fat 		: 10	//fat
		},
		{
			type		: "junk",
			names		: ["Carbonara","Hamburger","Pizza","Doner", "Fries"],
			water 		: 10,	//water
			vitamins 	: 50,	//vitamins
			minerals 	: 10,	//minerals
			carbs 		: 10,	//carbs
			protein 	: 10,	//protein
			fat 		: 10	//fat
		},
		{
			type		: "junk",
			names		: ["Carbonara","Hamburger","Pizza","Doner", "Fries"],
			water 		: 10,	//water
			vitamins 	: 10,	//vitamins
			minerals 	: 50,	//minerals
			carbs 		: 10,	//carbs
			protein 	: 10,	//protein
			fat 		: 10	//fat
		},
		{
			type		: "junk",
			names		: ["Carbonara","Hamburger","Pizza","Doner", "Fries"],
			water 		: 10,	//water
			vitamins 	: 10,	//vitamins
			minerals 	: 10,	//minerals
			carbs 		: 50,	//carbs
			protein 	: 10,	//protein
			fat 		: 10	//fat
		},
		{
			type		: "junk",
			names		: ["Carbonara","Hamburger","Pizza","Doner", "Fries"],
			water 		: 10,	//water
			vitamins 	: 10,	//vitamins
			minerals 	: 10,	//minerals
			carbs 		: 10,	//carbs
			protein 	: 50,	//protein
			fat 		: 10	//fat
		},
		{
			type		: "junk",
			names		: ["Carbonara","Hamburger","Pizza","Doner", "Fries"],
			water 		: 10,	//water
			vitamins 	: 10,	//vitamins
			minerals 	: 10,	//minerals
			carbs 		: 10,	//carbs
			protein 	: 10,	//protein
			fat 		: 50	//fat
		}
	];
	
}

FoodGenerator.prototype.generateProfile = function() 
{
	var tempProfile = this.profiles[ 0 ];
	
	var nutrientsMax = 100; 
	
	var nutrientsSum = 0;
	var nutrientsRandoms = [];
	var base;
	var gp;

	for (var i = 0; i < 6; i++) 
	{
		base = 17;
		gp = 17;
		if( Math.random() < 0.3 )
		{
			base = 0;
			gp = 0;
		}
		nutrientsRandoms[ i ] = this.getRandomInt( this.getRandomInt( base - gp, base ), this.getRandomInt( base, base + gp ) );
		nutrientsSum += nutrientsRandoms[ i ];
	};

	tempProfile.water = Math.round( nutrientsRandoms[ 0 ] / nutrientsSum * nutrientsMax );
	tempProfile.vitamins = Math.round( nutrientsRandoms[ 1 ] / nutrientsSum * nutrientsMax );
	tempProfile.minerals = Math.round( nutrientsRandoms[ 2 ] / nutrientsSum * nutrientsMax );
	tempProfile.carbs = Math.round( nutrientsRandoms[ 3 ] / nutrientsSum * nutrientsMax );
	tempProfile.protein = Math.round( nutrientsRandoms[ 4 ] / nutrientsSum * nutrientsMax );
	tempProfile.fat = Math.round( nutrientsRandoms[ 5 ] / nutrientsSum * nutrientsMax );

	return tempProfile;
};


FoodGenerator.prototype.generate = function( index ) 
{
	var profile = this.generateProfile();
	//var profile = this.profiles[ this.uniqueRandom( this.uniqueRandoms, this.profiles.length ) ];
	//var profile = this.profiles[ this.foodIndex ];

	this.itemTemplate.id = this.foodIndex++;
	this.itemTemplate.foodName = "";//profile.names[ this.getRandomInt( 0, profile.names.length - 1 ) ];
	this.itemTemplate.price = 1;
	
	this.nutrientsMax = this.nutrientsMaxProfiles[ this.getRandomInt( 0, this.nutrientsMaxProfiles.length - 1 ) ]; 
	
	var nutrientsSum = 0;
	var nutrientsRandoms = [];
	var base;
	var gp;

	for (var i = 0; i < 6; i++) 
	{
		base = profile[ this.nutrientsIndexMap[ i ] ];
		gp = Math.round( base * this.maxDeviation );
		nutrientsRandoms[ i ] = this.getRandomInt( this.getRandomInt( base - gp, base ), this.getRandomInt( base, base + gp ) );
		nutrientsSum += nutrientsRandoms[ i ];
	};

	this.itemTemplate.water = Math.round( nutrientsRandoms[ 0 ] / nutrientsSum * this.nutrientsMax );
	this.itemTemplate.vitamins = Math.round( nutrientsRandoms[ 1 ] / nutrientsSum * this.nutrientsMax );
	this.itemTemplate.minerals = Math.round( nutrientsRandoms[ 2 ] / nutrientsSum * this.nutrientsMax );
	this.itemTemplate.carbs = Math.round( nutrientsRandoms[ 3 ] / nutrientsSum * this.nutrientsMax );
	this.itemTemplate.protein = Math.round( nutrientsRandoms[ 4 ] / nutrientsSum * this.nutrientsMax );
	this.itemTemplate.fat = Math.round( nutrientsRandoms[ 5 ] / nutrientsSum * this.nutrientsMax );
	this.itemTemplate.special = this.nutrientsMax > 1000 ? true : false;
	
	
	return JSON.parse( JSON.stringify( this.itemTemplate ) );
}

FoodGenerator.prototype.uniqueRandom = function( poolArray, maxObjects ) 
{
    // refill the array if needed
    if (!poolArray.length) 
        for (var i = 0; i < maxObjects; i++) 
            poolArray.push(i);
    
    var index = Math.floor(Math.random() * poolArray.length);
    var val = poolArray[index];

    // now remove that value from the array
    poolArray.splice(index, 1);

    return val;
};

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