import Profile from './profile.js';

/**
 * Represent the home screen of the game.
 *
 * @export
 * @class LevelScene
 * @extends {Phaser.Scene}
 */
export default class LevelScene extends Phaser.Scene {
  /**
   * Creates an instance of LevelScene.
   * @memberof LevelScene
   */
  constructor() {
    super('LevelScene');
  }

  /**
   *
   *
   * @memberof LevelScene
   */
  preload() {
    this.load.tilemapTiledJSON('map', 'data/map.json');
    this.load.image('tileset', 'image/tileset.png');
  }

  /**
   * Creates the content of the LevelScene.
   *
   * @param {*} data
   * @memberof LevelScene
   */
  create(data) {
    const levels = this.cache.json.get('levels');
    this.target = levels[data.level].target;
    this.scene.get('MusicScene').play(1);
    this.scene.run('PauseScene', data);
    this.scene.pause();
    const map = this.make.tilemap({
      key: 'map',
    });
    const tileset = map.addTilesetImage('tileset', 'tileset');
    const terrain = map.createStaticLayer('terrain', tileset, 0, 0);
    const props = map.createStaticLayer('props', tileset, 0, 0);
    // const danger = map.createStaticLayer('danger', tileset, 0, 0);
    terrain.setCollisionBetween(6, 18);
    terrain.setCollisionBetween(21, 32);
    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // terrain.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });
    this.agent = this.physics.add.image(512, 256, 'sprites', 'guard');
    // this.agent.setOrigin(0.5);
    this.agent.body.setCircle(24, 24, 24);
    this.agent.speed = 200;
    this.physics.add.collider(this.agent, terrain);
    this.cameras.main.startFollow(this.agent);
    // this.focus = this.add.graphics({
    //   x: 512,
    //   y: 288,
    // });
    // this.dangers = this.physics.add.group();
    // this.physics.add.overlap(this.agent, this.dangers, () => {
    //   if (!Profile.invincible) {
    //   }
    // });
    this.keys =
      this.input.keyboard.addKeys('W,A,S,D,UP,LEFT,DOWN,RIGHT,SPACE,ENTER');
    this.input.keyboard.on('keydown', (event) => {
      event.preventDefault();
    });
    this.input.keyboard.on('keydown-ENTER', (event) => {
      event.preventDefault();
      this.turnInvisible();
    });
    this.input.keyboard.on('keydown-SPACE', (event) => {
      event.preventDefault();
      this.turnInvisible();
    });
    // this.cameras.main.on('camerafadeoutcomplete', () => {
    //   if (data.level === levels.length - 1) {
    //     this.scene.stop('PauseScene');
    //     this.scene.start('WinScene', {
    //       level: data.level,
    //       science: this.science,
    //     });
    //     this.scene.stop('LevelScene');
    //   } else {
    //     this.scene.stop('PauseScene');
    //     this.scene.start('MenuScene', {
    //       level: data.level,
    //       science: this.science,
    //     });
    //     this.scene.stop('LevelScene');
    //   }
    // });
  }

  /**
   *
   *
   * @memberof LevelScene
   */
  update() {
    if (!this.agent || !this.agent.body) {
      return;
    }
    this.agent.setVelocity(0);
    if (this.keys.W.isDown || this.keys.UP.isDown) {
      this.agent.setVelocityY(-this.agent.speed);
      this.agent.angle = 180;
    }
    if (this.keys.A.isDown || this.keys.LEFT.isDown) {
      this.agent.setVelocityX(-this.agent.speed);
      this.agent.angle = 90;
    }
    if (this.keys.S.isDown || this.keys.DOWN.isDown) {
      this.agent.setVelocityY(this.agent.speed);
      this.agent.angle = 0;
    }
    if (this.keys.D.isDown || this.keys.RIGHT.isDown) {
      this.agent.setVelocityX(this.agent.speed);
      this.agent.angle = -90;
    }
    this.agent.body.velocity.normalize().scale(this.agent.speed);
  }
}
