ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	
	// The player's (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 2, y:2},
	offset: {x:0, y:0},
	
	// How fast can player move (points per second) and how fast does he slow down
	accel: {x:0, y:0},
	acceleration: 80,
	maxVel: {x:40, y:40},
	friction: {x:50, y:50},
	
	// This will be used to test collisions with other things, in later levels
	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	// All the drawings for this character are in one file
	animSheet: new ig.AnimationSheet ('media/car2.png', 2, 2),
	
	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	// ...
	
	// State
	fuel: 100,
	maxFuel: 100,
	cash: 10,
	fuelConsumptionTimer: null,
	consumptionRate: 1,
	wordBalloon: null,
	state: ig.Entity.IDLE,

	// Graphics
	flip: false,
	
	init: function (x, y, settings)
	{
		this.parent (x, y, settings);
		
		
		// Setup the animations
		this.addAnim ('EW', 1, [0]);
		this.addAnim ('NS', 1, [1]);
		this.currentAnim = this.anims.EW;
		
		// Setup timers
		this.fuelConsumptionTimer = new ig.Timer ();
		this.fuelConsumptionTimer.set (2);

		// for debugging
		//this._wmDrawBox = true;
	},
	
	update: function ()
	{
		// move
		if (this.fuel <= 0)
		{
			this.accel.x = 0;
			this.accel.y = 0;
		}
		else
		{
			if (ig.input.state ('right'))
			{
				this.accel.x = this.acceleration;
				this.accel.y = 0;
				this.currentAnim = this.anims.EW;
			}
			else if (ig.input.state ('left'))
			{
				this.accel.x = -this.acceleration;
				this.accel.y = 0;
				this.currentAnim = this.anims.EW;
			}
			else if (ig.input.state ('up'))
			{
				this.accel.x = 0;
				this.accel.y = -this.acceleration;
				this.currentAnim = this.anims.NS;
			}
			else if (ig.input.state ('down'))
			{
				this.accel.x = 0;
				this.accel.y = this.acceleration;
				this.currentAnim = this.anims.NS;
			}
			else
			{
				this.accel.x = 0;
				this.accel.y = 0;
			}
		}
		
		// Orientation
		if (this.vel.x > 0)
		{
			this.currentAnim.flip.x = false;
		}
		else if (this.vel.x < 0)
		{
			this.currentAnim.flip.x = true;
		}
		else if (this.vel.y > 0)
		{
			this.currentAnim.flip.y = false;
		}
		else if (this.vel.y < 0)
		{
			this.currentAnim.flip.y = true;
		}

		// Fuel
		this.consumptionRate = 1 + Math.round ((Math.abs (this.vel.x) + Math.abs (this.vel.y)) / (this.maxVel.x + this.maxVel.y) * 3);
		
		if (this.fuelConsumptionTimer.delta() > 0 && this.fuel > 0)
		{
			this.fuel = (this.fuel - this.consumptionRate).limit (0, this.maxFuel);
			this.fuelConsumptionTimer.set(2);
		}
		
		if (this.fuel == 0 && this.wordBalloon == null)
		{
			ig.log ("out of fuel");
			
			this.wordBalloon = ig.game.noteManager.spawnWordBalloon (
				this,
				new ig.Font ('media/04b03.font.png'),
				'OUT OF GAS',
				this.pos.x, this.pos.y,
				{vel: {x:0, y:0}, alpha: 1, lifetime: 5.0, fadetime: 1.0});
		}
		
		// move!
		this.parent ();
	}
});

});