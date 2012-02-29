ig.module( 
	'game.rule-set' 
)
.requires(
	'impact.game'
)
.defines(function(){

	RuleSet = ig.Class.extend({
		
		step: function (data, cols, rows)
		{
		},

		// Helpers
		stateAt: function (col, row, data)
		{
			if (data[row])
				return data[row][col];
		},

		neighborsOf: function (col, row, data)
		{
			var neighbors = [];
			var state;

			// above
			state = this.stateAt (col-1, row-1, data); if (state != undefined) neighbors[neighbors.length] = state;
			state = this.stateAt (col, row-1, data); if (state != undefined) neighbors[neighbors.length] = state;
			state = this.stateAt (col+1, row-1, data); if (state != undefined) neighbors[neighbors.length] = state;

			// left and right of
			state = this.stateAt (col-1, row, data); if (state != undefined) neighbors[neighbors.length] = state;
			state = this.stateAt (col+1, row, data); if (state != undefined) neighbors[neighbors.length] = state;

			// below
			state = this.stateAt (col-1, row+1, data); if (state != undefined) neighbors[neighbors.length] = state;
			state = this.stateAt (col, row+1, data); if (state != undefined) neighbors[neighbors.length] = state;
			state = this.stateAt (col+1, row+1, data); if (state != undefined) neighbors[neighbors.length] = state;

			return neighbors;
		},
		
		foundWithState: function (state, states)
		{
			var found = 0;
			for (var i=0; i<states.length; i++)
			{
				var theState = states[i];
				if (theState & state)
				{
					found += 1;
				}
			}
			return found;
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

step: function (data, cols, rows)
{
	// make a working copy of population data
	var nextStates = ig.copy(data);
	
	// iterate
	for (var row=0; row<rows; row++)
	{
		for (var col=0; col<cols; col++)
		{
			var state = this.stateAt (col, row, data);
			var neighbors = this.neighborsOf (col, row, data);
			var liveNeighbors = this.foundWithState(ig.Entity.AWAKE, neighbors);
			
			// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
			if (state & ig.Entity.AWAKE && liveNeighbors < 2)
			{
				nextStates[row][col] = ig.Entity.DEAD;
			}

			// Any live cell with two or three live neighbours lives on to the next generation
			else if (state & ig.Entity.AWAKE && liveNeighbors >= 2 && liveNeighbors <= 3)
			{
				nextStates[row][col] = ig.Entity.AWAKE;
			}
				
			// Any live cell with more than three live neighbours dies, as if by overcrowding.
			else if (state & ig.Entity.AWAKE && liveNeighbors > 3)
			{
				nextStates[row][col] = ig.Entity.DEAD;
			}

			// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
			else if (state & ig.Entity.DEAD && liveNeighbors == 3)
			{
				nextStates[row][col] = ig.Entity.AWAKE;
			}
		}
	}

	return nextStates;
}
});
});
