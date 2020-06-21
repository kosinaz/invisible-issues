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
    this.scene.run('MoneyScene');
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
    this.safex = this.agent.x;
    this.safey = this.agent.y;
    this.guards = this.physics.add.group();
    props.forEachTile((tile) => {
      if (tile.index === 36) {
        this.guards.create(
            tile.getCenterX(),
            tile.getCenterY(),
            'sprites',
            'guard',
        );
      }
      if (tile.index === 37) {
        this.guards.create(
            tile.getCenterX(),
            tile.getCenterY(),
            'sprites',
            'guard',
        ).angle = 90;
      }
      if (tile.index === 38) {
        this.guards.create(
            tile.getCenterX(),
            tile.getCenterY(),
            'sprites',
            'guard',
        ).angle = 180;
      }
      if (tile.index === 39) {
        this.guards.create(
            tile.getCenterX(),
            tile.getCenterY(),
            'sprites',
            'guard',
        ).angle = -90;
      }
    });
    this.money = this.physics.add.group();
    props.forEachTile((tile) => {
      if (tile.index > 45 && tile.index < 50) {
        const xd = tile.index === 49 ? 96 : tile.index === 47 ? -96 : 0;
        const yd = tile.index === 46 ? 96 : tile.index === 48 ? -96 : 0;
        const sign = this.money.create(
            tile.getCenterX() + xd,
            tile.getCenterY() + yd,
            'sprites',
            'money',
        );
        this.tweens.add({
          targets: sign,
          scaleX: -1,
          // ease: 'Circ.easeIn',
          duration: 1000,
          yoyo: true,
          repeat: -1,
        });
      }
      if (tile.index === 53) {
        this.gold = this.physics.add.image(
            tile.getCenterX(),
            tile.getCenterY() - 96,
            'sprites',
            'goldmoney',
        );
        this.tweens.add({
          targets: this.gold,
          scaleX: -1,
          // ease: 'Circ.easeIn',
          duration: 1000,
          yoyo: true,
          repeat: -1,
        });
      }
    });
    this.physics.add.collider(this.agent, terrain);
    this.physics.add.overlap(this.agent, this.money, (agent, sign) => {
      sign.disableBody(true, true);
      Profile.money += 10000000;
      if (Profile.money >= 150000000 && !this.exit) {
        this.exit = true;
        terrain.forEachTile((tile) => {
          if (tile.index === 40) {
            this.exitsign = this.physics.add.image(
                tile.getCenterX() + 40,
                tile.getCenterY() + 40,
                'sprites',
                'exit',
            );
            this.exitsign.setOrigin(0.5);
            this.tweens.add({
              targets: this.exitsign,
              scaleX: -1,
              // ease: 'Circ.easeIn',
              duration: 1000,
              yoyo: true,
              repeat: -1,
            });
          }
        });
      }
      const text = this.add.text(sign.x, sign.y, '$10.000.000', {
        fontSize: '24px',
        fontFamily: 'font',
      });
      text.setOrigin(0.5);
      this.tweens.add({
        targets: text,
        ease: 'Quad',
        y: '-= 100',
        duration: 1000,
        alpha: 0,
      });
    });
    this.physics.add.overlap(this.agent, this.gold, (agent, sign) => {
      sign.disableBody(true, true);
      Profile.money += 150000000;
      if (!this.exit) {
        this.exit = true;
        terrain.forEachTile((tile) => {
          if (tile.index === 40) {
            this.exitsign = this.physics.add.image(
                tile.getCenterX() + 40,
                tile.getCenterY() + 40,
                'sprites',
                'exit',
            );
            this.tweens.add({
              targets: this.exitsign,
              scaleX: -1,
              // ease: 'Circ.easeIn',
              duration: 1000,
              yoyo: true,
              repeat: -1,
            });
          }
        });
      }
      const text = this.add.text(sign.x, sign.y, '$150.000.000', {
        fontSize: '24px',
        fontFamily: 'font',
      });
      text.setOrigin(0.5);
      this.tweens.add({
        targets: text,
        ease: 'Quad',
        y: '-= 100',
        duration: 1000,
        alpha: 0,
      });
    });
    this.physics.add.overlap(this.agent, this.exitsign, (agent, sign) => {
      const text = this.add.text(sign.x, sign.y, 'Misson Accomplished', {
        fontSize: '24px',
        fontFamily: 'font',
      });
      text.setOrigin(0.5);
    });
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
    this.steps = this.sound.add('steps', {
      loop: true,
      volume: 0,
    });
    this.steps.play();
    this.time.addEvent({
      loop: true,
      delay: 1000, callback: () => {
        if (!this.map.getTileAtWorldXY(
            this.agent.x,
            this.agent.y,
            false,
            this.cameras.main,
            'danger',
        )) {
          this.safex = this.agent.x;
          this.safey = this.agent.y;
        }
      },
    });
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
    if (this.wasted) {
      this.agent.x = this.safex;
      this.agent.y = this.safey;
      this.wasted = false;
    }
    this.agent.setVelocity(0);
    if (!this.invisible && this.map.getTileAtWorldXY(
        this.agent.x,
        this.agent.y,
        false,
        this.cameras.main,
        'danger',
    )) {
      this.steps.volume = 0;
      this.scene.run('PauseScene', {
        wasted: true,
      });
      this.scene.pause();
      this.wasted = true;
      this.keys.W.isDown = false;
      this.keys.UP.isDown = false;
      this.keys.A.isDown = false;
      this.keys.LEFT.isDown = false;
      this.keys.S.isDown = false;
      this.keys.DOWN.isDown = false;
      this.keys.D.isDown = false;
      this.keys.RIGHT.isDown = false;
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
