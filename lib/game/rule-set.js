ig.module( 
	'game.rule-set' 
)
.requires(
	'impact.game'
)
.defines(function(){

	RuleSet = ig.Class.extend({

		cellType: null,
			rows: 0,
			cols: 0,
			cells:[],
			map: null,

		init: function (cellType, map)
		{
			this.cellType = cellType;
			this.map = map;
			//this.createCells();
			//this.mapCellNeighbors();
		},

		createCells: function()
		{
			for (var row=0; row<this.rows; row++)
			{
				this.cells[row] = [];
				for (var col=0; col<this.cols; col++)
				{
					var cell = ig.game.spawnEntity (this.cellType, 0, 0);
					cell.pos = {x:col*cell.size.x, y:row*cell.size.y};
					cell.state = ig.Entity.DEAD;
					this.cells[row][col] = cell;
				}
			}
		},

		mapCellNeighbors: function()
		{
			var cells = ig.game.getEntitiesByType(this.cellType);
			for (var i=0; i<cells.length; i++)
			{
				var cell = cells[i];
				cell.liveNeighbors = this.neighborsOf(cell);
			}
		},

		reset: function()
		{
			for (var row=0; row<this.map.height; row++)
				for (var col=0; col<this.map.width; col++)
					this.map.setTile (col*this.map.tilesize, row*this.map.tilesize, 0);
		},

		setFromMap: function(map)
		{
			this.killall();

			for (var i=0; i<map.length; i++)
				for (var j=0; j<row.length; j++)
				this.cellAt (j,i).state = map[i][j];

			this.mapCellNeighbors();
		},

		populate: function (livecount)
		{
			this.reset();

			var count = 0;
			do
			{
				var col = Math.floor(Math.random() * this.map.width);
				var x = col * this.map.tilesize;

				var row = Math.floor(Math.random() * this.map.height);
				var y = row * this.map.tilesize;
				
				if (this.map.getTile(x,y) == 0)//ig.Entity.DEAD)
				{
					this.map.setTile(x, y, 2);//ig.Entity.AWAKE);
					count += 1;
				}
			} while (count < livecount);

			//this.mapCellNeighbors();
		},

		step: function()
		{
		},

			// Helpers
		locationAtXY: function (x, y)
		{
			var cell = this.cellAt (0,0);
			return {col:Math.floor(x / cell.size.x), row:Math.floor(y / cell.size.y)};
		},

		cellAtXY: function (x, y)
		{
			return this.cellAt (x, y);
		},

		locationOf: function (cell)
		{
			return {col:Math.round(cell.pos.x / cell.size.x), row:Math.round(cell.pos.y / cell.size.y)};
		},

		cellAt: function (col, row)
		{
			if (col >= 0 && col < this.cols && row >= 0 && row < this.rows)
				return this.cells[row][col];
		},

		neighborsOf: function (cell)
		{
			var loc = this.locationOf (cell);
			var cell;
			var neighbors = [];

			// above
			cell = this.cellAt (loc.col-1, loc.row-1); if (cell) neighbors[neighbors.length] = cell;
			cell = this.cellAt (loc.col, loc.row-1); if (cell) neighbors[neighbors.length] = cell;
			cell = this.cellAt (loc.col+1, loc.row-1); if (cell) neighbors[neighbors.length] = cell;

			// left and right of
			cell = this.cellAt (loc.col-1, loc.row); if (cell) neighbors[neighbors.length] = cell;
			cell = this.cellAt (loc.col+1, loc.row); if (cell) neighbors[neighbors.length] = cell;

			// below
			cell = this.cellAt (loc.col-1, loc.row+1); if (cell) neighbors[neighbors.length] = cell;
			cell = this.cellAt (loc.col, loc.row+1); if (cell) neighbors[neighbors.length] = cell;
			cell = this.cellAt (loc.col+1, loc.row+1); if (cell) neighbors[neighbors.length] = cell;

			return neighbors;
		}
	});

RuleSetConway1 = RuleSet.extend({

	/*
	Rules
	=====
	The universe of the Game of Life is an infinite two-dimensional orthogonal
	grid of square cells, each of which is in one of two possible states, alive
	or dead.

Every cell interacts with its eight neighbours, which are the cells that are
horizontally, vertically, or diagonally adjacent.

At each step in time, the following transitions occur:

- Any live cell with fewer than two live neighbours dies, as if caused by
under-population.

- Any live cell with two or three live neighbours lives on to the next
generation.

- Any live cell with more than three live neighbours dies, as if by
overcrowding.

- Any dead cell with exactly three live neighbours becomes a live cell, as if
by reproduction.

The initial pattern constitutes the seed of the system. The first generation
is created by applying the above rules simultaneously to every cell in the
seed—births and deaths occur simultaneously, and the discrete moment at which
this happens is sometimes called a tick (in other words, each generation is a
pure function of the preceding one). The rules continue to be applied
repeatedly to create further generations.
*/

//WIP
//TODO

step: function ()
{
	/*
	//ig.log ("step conway1: there are " + ig.game.getEntitiesByType(this.cellType).length + " cells.");

	// go through rules for each element in cells
	var cells = [];
	
	for (var i=0; i<map.length; i++)
		for (var j=0; j<row.length; j++)
		this.cellAt (j,i).state = map[i][j];



	var cells = ig.game.getEntitiesByType(this.cellType);
	this.mapCellNeighbors();

	// apply rules
	for (var i=0; i<cells.length; i++)
	{
		var cell = cells[i];
		cell.nextState = cell.state;

		// Any live cell with fewer than two live neighbours dies, as if caused by
		// under-population.
		if (cell.state & ig.Entity.AWAKE && cell.liveNeighbors.length < 2)
		{
			//ig.log ("case 1: cell will die");
			//cell.nextState = ig.Entity.DEAD;
			cell.state = ig.Entity.DEAD;
		}

		// Any live cell with two or three live neighbours lives on to the next generation
		else if (cell.state & ig.Entity.AWAKE && cell.liveNeighbors.length >= 2 && cell.liveNeighbors.length <= 3)
		{
			//ig.log ("case 2: skip to next generation");
			// go to next generation
		}

		// Any live cell with more than three live neighbours dies, as if by overcrowding.
		else if (cell.state & ig.Entity.AWAKE && cell.liveNeighbors.length > 3)
		{
			//ig.log ("case 3: cell will die");
			//cell.nextState = ig.Entity.DEAD;
			cell.state = ig.Entity.DEAD;
		}

		// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
		else if (cell.state & ig.Entity.DEAD && cell.liveNeighbors.length == 3)
		{
			//ig.log ("case 4: cell will rise");
			//cell.nextState = ig.Entity.AWAKE;
			cell.state = ig.Entity.AWAKE;
		}
	}

	// apply
	//cells.forEach(function(el){el.state = el.nextState;});

	// update neighbors for each cell
	//this.mapCellNeighbors();
	//for (var i=0; i<cells.length; i++)
	//{
	//	var cell = cells[i];
	//	cell.liveNeighbors = this.neighborsOf(cell).filter(function(c){return c.state & ig.Entity.AWAKE});
	//}
*/
	// call super's step()
	this.parent();
},

OLDstep: function ()
{
	
	//ig.log ("step conway1: there are " + ig.game.getEntitiesByType(this.cellType).length + " cells.");

	// go through rules for each element in cells
	var cells = ig.game.getEntitiesByType(this.cellType);

	// apply rules
	for (var i=0; i<cells.length; i++)
	{
		var cell = cells[i];
		cell.nextState = cell.state;

		// Any live cell with fewer than two live neighbours dies, as if caused by
		// under-population.
		if (cell.state & ig.Entity.AWAKE && cell.liveNeighbors.length < 2)
		{
			//ig.log ("case 1: cell will die");
			//cell.nextState = ig.Entity.DEAD;
			cell.state = ig.Entity.DEAD;
		}

		// Any live cell with two or three live neighbours lives on to the next generation
		else if (cell.state & ig.Entity.AWAKE && cell.liveNeighbors.length >= 2 && cell.liveNeighbors.length <= 3)
		{
			//ig.log ("case 2: skip to next generation");
			// go to next generation
		}

		// Any live cell with more than three live neighbours dies, as if by overcrowding.
		else if (cell.state & ig.Entity.AWAKE && cell.liveNeighbors.length > 3)
		{
			//ig.log ("case 3: cell will die");
			//cell.nextState = ig.Entity.DEAD;
			cell.state = ig.Entity.DEAD;
		}

		// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
		else if (cell.state & ig.Entity.DEAD && cell.liveNeighbors.length == 3)
		{
			//ig.log ("case 4: cell will rise");
			//cell.nextState = ig.Entity.AWAKE;
			cell.state = ig.Entity.AWAKE;
		}
	}

	// apply
	//cells.forEach(function(el){el.state = el.nextState;});

	// update neighbors for each cell
	this.mapCellNeighbors();
	//for (var i=0; i<cells.length; i++)
	//{
	//	var cell = cells[i];
	//	cell.liveNeighbors = this.neighborsOf(cell).filter(function(c){return c.state & ig.Entity.AWAKE});
	//}

	// call super's step()
	this.parent();
}
});
});
