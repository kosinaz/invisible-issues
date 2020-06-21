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
    this.map = this.make.tilemap({
      key: 'map',
    });
    const tileset = this.map.addTilesetImage('tileset', 'tileset');
    const terrain = this.map.createStaticLayer('terrain', tileset, 0, 0);
    const props = this.map.createStaticLayer('props', tileset, 0, 0);
    terrain.setCollisionBetween(6, 18);
    terrain.setCollisionBetween(21, 32);
    terrain.forEachTile((tile) => {
      if (tile.index === 40) {
        this.agent = this.physics.add.image(
            tile.getCenterX(),
            tile.getCenterY(),
            'sprites',
            'agent',
        );
      }
    });
    this.agent.body.setCircle(24, 24, 24);
    this.agent.speed = 200;
    this.guards = this.physics.add.group();
    props.forEachTile((tile) => {
      if (tile.index > 35 && tile.index < 40) {
        this.guards.create(
            tile.getCenterX(),
            tile.getCenterY(),
            'sprites',
            'guard',
        );
      }
    });
    this.physics.add.collider(this.agent, terrain);
    this.cameras.main.startFollow(this.agent);
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
    this.steps = this.sound.add('steps', {
      loop: true,
      volume: 0,
    });
    this.steps.play();
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
    if (this.failed) {
      return;
    }
    if (this.map.getTileAtWorldXY(
        this.agent.x,
        this.agent.y,
        false,
        this.cameras.main,
        'danger',
    )) {
      //this.failed = true;
      console.log('ja');
    }
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
    if (this.agent.body.blocked.none && (
      this.agent.body.velocity.x || this.agent.body.velocity.y)
    ) {
      this.steps.volume = 0.25;
    } else {
      this.steps.volume = 0;
    }
    this.agent.body.velocity.normalize().scale(this.agent.speed);
  }

  /**
   *
   *
   * @memberof LevelScene
   */
  turnInvisible() {
    if (!this.invisible) {
      this.invisible = true;
      this.cameras.main.fadeOut(1000);
      this.tweens.add({
        targets: this.agent,
        alpha: 0,
        ease: 'Quad',
        duration: 750,
      });
      this.time.addEvent({
        delay: 4000, callback: () => {
          this.cameras.main.fadeIn(1000);
          this.tweens.add({
            targets: this.agent,
            delay: 250,
            alpha: 1,
            ease: 'Quad',
            duration: 750,
            onComplete: () => {
              this.invisible = false;
            },
          });
        },
      });
    }
  }
}
