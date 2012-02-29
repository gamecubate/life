ig.module(
	'game.entities.cell'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityCell = ig.Entity.extend({
	
	// The player's (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 8, y:8},
	offset: {x:0, y:0},
	animSheet: new ig.AnimationSheet ('media/cell.png', 8, 8),
	state: ig.Entity.DEAD,

	init: function (x, y, settings)
	{
		this.parent (x, y, settings);
		
		// Setup the animations
		this.addAnim ('sleeping', 1, [0]);
		this.addAnim ('awake', 1, [1]);
		this.addAnim ('dead', 1, [2]);
		this.addAnim ('selected', 1, [3]);
		this.currentAnim = this.anims.dead;
	},
	
	update: function ()
	{
		this.parent ();

		if (this.state & ig.Entity.SELECTED)
		{
			this.currentAnim = this.anims.selected;
		}
		else
		{
			switch (this.state)
			{
				case ig.Entity.SLEEPING:
				this.currentAnim = this.anims.sleeping;
					break;

				case ig.Entity.AWAKE:
					this.currentAnim = this.anims.awake;
					break;

				case ig.Entity.DEAD:
					this.currentAnim = this.anims.dead;
					break;

				default:
					break;
			}
		}
	}
});

});