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
    this.lights.enable().setAmbientColor(0x000066);
    this.map = this.make.tilemap({
      key: 'map',
    });
    const tileset = this.map.addTilesetImage('tileset', 'tileset');
    const terrain = this.map.createDynamicLayer('terrain', tileset, 0, 0);
    terrain.setPipeline('Light2D');
    const props = this.map.createDynamicLayer('props', tileset, 0, 0);
    props.setPipeline('Light2D');
    const lights = this.map.createDynamicLayer('lights', tileset, 0, 0);
    lights.setPipeline('Light2D');
    terrain.setCollisionBetween(6, 18);
    terrain.setCollisionBetween(21, 32);
    terrain.forEachTile((tile) => {
      if (tile.index === 40) {
        this.agent = this.physics.add.image(
            tile.getCenterX(),
            tile.getCenterY(),
            'sprites',
            'agent',
        ).setPipeline('Light2D');
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
        ).setPipeline('Light2D');
      }
      if (tile.index === 37) {
        this.guards.create(
            tile.getCenterX(),
            tile.getCenterY(),
            'sprites',
            'guard',
        ).setPipeline('Light2D').angle = 90;
      }
      if (tile.index === 38) {
        this.guards.create(
            tile.getCenterX(),
            tile.getCenterY(),
            'sprites',
            'guard',
        ).setPipeline('Light2D').angle = 180;
      }
      if (tile.index === 39) {
        this.guards.create(
            tile.getCenterX(),
            tile.getCenterY(),
            'sprites',
            'guard',
        ).setPipeline('Light2D').angle = -90;
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
        this.lights.addLight(tile.getCenterX(), tile.getCenterY(), 200, 0x8888ff);
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
    this.flickers = [];
    lights.forEachTile((tile) => {
      if (tile.index === 50) {
        tile.visible = false;
        const light = this.lights.addLight(tile.getCenterX(), tile.getCenterY(), 400, 0x888888);
        if (Math.random() < 0.1) {
          this.flickers.push(light);
        }
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
    const cursors = this.input.keyboard.createCursorKeys();

    this.camcontrols = new Phaser.Cameras.Controls.FixedKeyControl({
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5,
    });

    this.cameras.main.setBounds(0, 0, terrain.x + terrain.width, terrain.y + terrain.height);
  }

  /**
   *
   *
   * @param {*} t
   * @param {*} d
   * @returns
   * @memberof LevelScene
   */
  update(t, d) {
    this.camcontrols.update(d);
    if (!this.agent || !this.agent.body) {
      return;
    }
    this.cameras.main.stopFollow();
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
    const exittile = this.map.getTileAtWorldXY(
        this.agent.x,
        this.agent.y,
        false,
        this.cameras.main,
        'terrain',
    );
    if (!this.invisible && exittile.index === 40 &&
      Profile.money >= 150000000) {
      this.scene.start('WinScene');
    }
    if (this.keys.W.isDown) {
      this.agent.setVelocityY(-this.agent.speed);
      this.agent.angle = 180;
      this.cameras.main.startFollow(this.agent);
    }
    if (this.keys.A.isDown) {
      this.agent.setVelocityX(-this.agent.speed);
      this.agent.angle = 90;
      this.cameras.main.startFollow(this.agent);
    }
    if (this.keys.S.isDown) {
      this.agent.setVelocityY(this.agent.speed);
      this.agent.angle = 0;
      this.cameras.main.startFollow(this.agent);
    }
    if (this.keys.D.isDown) {
      this.agent.setVelocityX(this.agent.speed);
      this.agent.angle = -90;
      this.cameras.main.startFollow(this.agent);
    }
    if (this.agent.body.blocked.none && (
      this.agent.body.velocity.x || this.agent.body.velocity.y)
    ) {
      this.steps.volume = 0.25;
    } else {
      this.steps.volume = 0;
    }
    this.agent.body.velocity.normalize().scale(this.agent.speed);
    this.flickers.forEach((light) => {
      if (Math.random() < 0.03) {
        light.intensity = !light.intensity;
      }
    });
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
