ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'impact.collision-map',
	'impact.background-map',
	'impact.entity',
	'plugins.symbols.symbols',
	'game.entities.cell',
	'game.rule-set'
	//'impact.debug.debug'
)
.defines(function(){

	// The Backdrop image for the game, subclassed from ig.Image
	// because it needs to be drawn in it's natural, unscaled size, 
	FullsizeBackdrop = ig.Image.extend({
		resize: function(){},
		draw: function() {
			if( !this.loaded ) { return; }
			ig.system.context.drawImage( this.data, 0, 0 );
		}
	});


	// A Custom Loader for the game, that, after all images have been
	// loaded, goes through them and "pixifies" them to create the LCD
	// effect.
	DropLoader = ig.Loader.extend({
		end: function() {
			for( i in ig.Image.cache ) {
				var img = ig.Image.cache[i];
				if( !(img instanceof FullsizeBackdrop) ) {
					this.pixify( img, ig.system.scale );
				}
			}
			this.parent();
		},


		// This essentially deletes the last row and collumn of pixels for each
		// upscaled pixel.
		pixify: function( img, s ) {
			var ctx = img.data.getContext('2d');
			var px = ctx.getImageData(0, 0, img.data.width, img.data.height);

			for( var y = 0; y < img.data.height; y++ ) {
				for( var x = 0; x < img.data.width; x++ ) {
					var index = (y * img.data.width + x) * 4;
					var alpha = (x % s == 0 || y % s == 0) ? 0 : 0.9;
					px.data[index + 3] = px.data[index + 3] * alpha;
				}
			}
			ctx.putImageData( px, 0, 0 );
		}
	});

GameOfLife = ig.Game.extend({

	state: null,
	COLS: 40,
	ROWS: 60,
	
	clearColor: null, // don't clear the screen
	ruleset: null,
	simulationTimer: null,
	stepDuration: 0.05,
	
	tiles: new ig.Image ('media/tiles-2.png'),
	backdrop: new FullsizeBackdrop ('media/backdrop.png'),
	font: new ig.Font ('media/04b03-red.font.png'),
	bg: null,
	ol: null,
	
	init: function()
	{
		// Setup app and cell states
		new ig.Symbols("PLAYING SLEEPING AWAKE DEAD");

		// Make BG
		var bgMap = this.makeMap (this.COLS, this.ROWS, 3);
		this.bg = new ig.BackgroundMap (8, bgMap, 'media/tiles-2.png');
		this.bg.preRender = true;
		this.backgroundMaps.push (this.bg);
		
		// The BG map is used as CollisionMap
		//this.collisionMap = new ig.CollisionMap (8, bgMap);

		// Make OL
		var olMap = this.makeMap(this.COLS, this.ROWS);
		this.ol = new ig.BackgroundMap (8, olMap, 'media/tiles-2.png');
		this.backgroundMaps.push (this.ol);
		// TEST
		// this.ol.setTile(100,200,2);
				
		// Maps
		this.ruleset = new RuleSetConway1 (EntityCell, this.ol);
		this.ruleset.populate (this.COLS *this.ROWS /6);
	
		// Handle mouse and keyboard events
		ig.input.bind(ig.KEY._1, '1');
		ig.input.bind(ig.KEY._2, '2');
		ig.input.bind(ig.KEY._3, '3');
		ig.input.bind(ig.KEY._4, '4');
		ig.input.bind(ig.KEY._5, '5');
		ig.input.bind(ig.KEY.MOUSE1, 'mouse1');
		
		// Timers
		this.simulationTimer = new ig.Timer();

		// Begin
		this.state = ig.Entity.PLAYING;
	},
	
	makeMap: function (cols, rows, tileIndex)
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
		if (this.state & ig.Entity.PLAYING)
			this.handlePlaying();

		this.handleKeys();

		this.parent ();
	},
	
	handlePlaying: function ()
	{
		if (this.simulationTimer.delta() > 0 && this.stepDuration > 0)
		{
			this.ruleset.step();
			this.simulationTimer.set (this.stepDuration);
		}

		if (ig.input.released("mouse1"))
		{
			this.ruleset.populate(this.COLS *this.ROWS /6);
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

	draw: function()
	{
		//this.backdrop.draw();
		ig.system.context.clearRect (0 ,0, ig.system.realWidth, ig.system.realHeight);
		this.parent();
	},
});


// Start the Game with 30fps, a resolution of 160x160, scaled up by a factor of 2
ig.main ('#canvas', GameOfLife, 30, 320, 480, 1);
//ig.main ('#canvas', GameOfLife, 2, 64, 64, 5, DropLoader);

});
