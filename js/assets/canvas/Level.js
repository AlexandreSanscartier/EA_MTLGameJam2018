// -- user code here --
import Hud from '../../Hud';
import TileMap from '../../Map/TileMap';
import Player from '../sprites/player';
import Gem from '../sprites/gem';
import Transporter from '../sprites/transporter';
import { IntroductionText } from '../../Text'

import tiles from '../tiles_x.png';
import gems from '../gems.png';
import transporter from '../transporter.png';
import Characters from '../characters';

/* --- start generated code --- */

// Generated by  1.4.4 (Phaser v2.6.2)


class Level extends Phaser.State {

	/**
	 * Level.
	 */
	constructor() {

		super();


		this.cursors = null;

	}

	init() {

		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

	}

	preload() {

		this.preloadImages();
		this.preloadSounds();

	}

	create() {
		this.customCreate();

	}

	/* state-methods-begin */
	render() {
		// this.game.debug.body(this.player);
		// this.game.debug.body(this.transporter);
		// this.game.debug.spriteInfo(this.player, 32, 32);
	}

	update() {
		this.game.physics.arcade.collide(this.player, this.layer);
		this.game.physics.arcade.collide(this.player, this.transporter);
		this.Hud.update();

		if(this.xKey.isDown) {
			this.gameover();
		}

		if(this.spaceKey.isDown && !this.isRemovingGem) {
			this.isRemovingGem = true;
			let gemCollide = undefined;
			let i = 0;
			for(; i < this.gems.length; i += 1) {
				 if(this.player.x >= this.gems[i].x - 20 && this.player.x <= this.gems[i].x + 20 &&
					this.player.y >= this.gems[i].y - 20 && this.player.y <= this.gems[i].y + 20) {
					 gemCollide = this.gems[i];
					 break;
				 }
			}
			if(gemCollide !== undefined && !this.Hud.isBagFull()) {
				this.Hud.addToBag(gemCollide);
				this.gems.splice(i, 1);
				this.onPickupSound.play();
			}
			this.isRemovingGem = false;
		}
	}

	preloadImages() {
		this.game.load.image('tiles', tiles);
		this.game.load.image('transporter', transporter);
		this.game.load.spritesheet('gems', gems, 32, 32);
		this.game.load.spritesheet('help', 'js/assets/help.png', 40, 20)
		this.game.load.spritesheet('warrior_m', Characters.WarriorM, 32, 32, 12);
	}

	preloadSounds() {
		this.game.load.audio('pickUpItem', ['js/assets/162476__kastenfrosch__gotitem.mp3']);
		this.game.load.audio('bgmusic', ['js/assets/shadows.mp3']);
	}

	customCreate() {
		const backgroundMusic = game.add.audio('bgmusic');
		backgroundMusic.loop = true;
		backgroundMusic.play();

		this.isRemovingGem = false;

		this.onPickupSound = game.add.audio('pickUpItem');
		this.onPickupSound.allowMultiple = true;

		this.mapData = new TileMap(128, 128, 20);
		// console.log(mapData.getCSV());
		this.cache.addTilemap('dynamicMap', null, this.mapData.getCSV(), Phaser.Tilemap.CSV);
		const map = this.add.tilemap('dynamicMap', 32, 32);
		map.addTilesetImage('tiles', 'tiles', 32, 32);
		this.layer = map.createLayer(0);
		this.layer.resizeWorld();
		map.setCollisionBetween(1, 1);

		this.gems = [];

		// Add Gems
		this.mapData.gems.forEach((gem) => {
			const gemLoc = gem.location.getPixelLocation();
			const gemSprite = new Gem({ game: this.game, x: gemLoc.x, y: gemLoc.y, gemType: gem.gemType });
			this.gems.push(gemSprite);
			this.game.add.existing(gemSprite);
		});

		// Add player
		const playerLoc = this.mapData.playerStartLocation.getPixelLocation();
		this.player = new Player({ game: this.game, x: playerLoc.x, y: playerLoc.y });
		this.game.camera.follow(this.player);
		this.game.add.existing(this.player);

		// Add Transporter
		const transporterLoc = this.mapData.transporterLocation.getPixelLocation();
		this.transporter = new Transporter({ game: game, x: transporterLoc.x, y: transporterLoc.y });
		this.game.add.existing(this.transporter);

		this.Hud = new Hud(this.game);
		for (let i = 0; i < IntroductionText.length; i += 1) {
			this.Hud.addMessageToQueue(IntroductionText[i]);
		}

		this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.xKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
	}

	gameover() {
		this.game.state.start('gameover');
	}
	/* state-methods-end */

}
/* --- end generated code --- */
export default Level
