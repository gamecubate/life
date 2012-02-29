ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.background-map',
	'plugins.symbols.symbols',
	'game.rule-set'
)
.defines(function(){

	// The Backdrop image for the game, subclassed from ig.Image
	// because it needs to be drawn in it's natural, unscaled size, 
FullsizeBackdrop = ig.Image.extend({
	resize: function(){},
	draw: function()
	{
		if (! this.loaded)
		{
			return;
		}
		ig.system.context.drawImage( this.data, 0, 0 );
	}
});


GameOfLife = ig.Game.extend({

	// need this?
	//backdrop: new FullsizeBackdrop ('media/backdrop.png'),

	// don't clear the screen as we want to show the underlying CSS background
	clearColor: null,

	// game FSM
	state: null,

	// world dimensions
	COLS: 40,
	ROWS: 60,
	
	// an object that applies rules to a population of cells, or in our case,
	// a map representation of cell states
	ruleset: null,
	
	// a timer that fires at regular intervals and tells ruleset to do its job
	simulationTimer: null,
	stepDuration: 0.05,
	

	init: function()
	{
		// Setup app and cell state symbols
		new ig.Symbols("PLAYING SLEEPING AWAKE DEAD");

		// Make a BG, something against which our cells overlay will stand out
		var bgData = this.makeData (this.COLS, this.ROWS, 5);
		var bgMap = new ig.BackgroundMap (8, bgData, new ig.Image ('./media/states.png'));
		bgMap.preRender = true;	// render once and be done with it; will save cycles
		this.backgroundMaps.push (bgMap);
		
		// Make empty cells overlay (OL)
		var cellStates = this.makeData (this.COLS, this.ROWS);
		var cellsMap = new ig.BackgroundMap (8, cellStates, new ig.Image ('./media/states.png'));
		this.backgroundMaps.push (cellsMap);
		
		// Setup RuleSet object and tell it to dezombify a random subset of the population
		this.ruleset = new RuleSetConway1 (cellsMap);
		this.ruleset.dezombify (Math.round(this.COLS * this.ROWS /6));
	
		// Setup sim timer
		this.simulationTimer = new ig.Timer();

		// Handle mouse and keyboard events
		ig.input.bind(ig.KEY._1, '1');
		ig.input.bind(ig.KEY._2, '2');
		ig.input.bind(ig.KEY._3, '3');
		ig.input.bind(ig.KEY._4, '4');
		ig.input.bind(ig.KEY._5, '5');
		ig.input.bind(ig.KEY.MOUSE1, 'mouse1');
		
		// GO!
		this.state = ig.Entity.PLAYING;
	},
	
	makeData: function (cols, rows, tileIndex)
	{
		tileIndex = (tileIndex || 0);
		var aMap = [];
		for (var i=0; i<rows; i++)
		{
			aMap[i] = [];
			for (var j=0; j<cols; j++)
				aMap[i][j] = tileIndex;
		}
		return aMap;
	},

	update: function()
	{
		this.updateSimulation();
		this.handleKeys();
		this.handleMouse();
		this.parent ();
	},
	
	updateSimulation: function ()
	{
		if (this.state & ig.Entity.PLAYING)
		{
			if (this.simulationTimer.delta() > 0 && this.stepDuration > 0)
			{
				this.ruleset.step();
				this.simulationTimer.set (this.stepDuration);
			}
		}
	},

	handleKeys: function()
	{
		if (ig.input.pressed('1'))
			this.stepDuration = 1;
		else if (ig.input.pressed('2'))
			this.stepDuration = 0.5;
		else if (ig.input.pressed('3'))
			this.stepDuration = 0.25;
		else if (ig.input.pressed('4'))
			this.stepDuration = 0.1;
		else if (ig.input.pressed('5'))
			this.stepDuration = 0.05;
	},
	
	handleMouse: function ()
	{
		if (ig.input.released("mouse1"))
			this.ruleset.dezombify (this.COLS *this.ROWS /6);
	},

	draw: function()
	{
		//this.backdrop.draw();
		ig.system.context.clearRect (0 ,0, ig.system.realWidth, ig.system.realHeight);
		this.parent();
	},
});


// Start the Game with 30fps, a resolution of 160x160, scaled up by a factor of 2
ig.main ('#canvas', GameOfLife, 30, 320, 480, 1);

});
