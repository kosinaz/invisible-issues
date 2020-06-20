import Profile from './profile.js';
import AsteroidMap from './asteroidMap.js';

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
    const bg = this.add.image(512, 288, 'bg');
    bg.setDepth(-3);
    this.scene.get('MusicScene').play(1);
    this.scene.run('PauseScene', data);
    this.scene.pause();
    const offscreen = new Phaser.Geom.Rectangle(1024, 0, 1, 576);
    const onscreen = new Phaser.Geom.Rectangle(0, 0, 1025, 576);
    const dustGraphics = this.make.graphics();
    dustGraphics.fillStyle(0xffffff);
    dustGraphics.fillPoint(0, 0, 2);
    dustGraphics.generateTexture('dust', 2, 2);
    this.add.particles('dust', [{
      emitZone: {
        source: offscreen,
      },
      deathZone: {
        source: onscreen,
        type: 'onLeave',
      },
      frequency: 25,
      speedX: {
        min: -200,
        max: -1000,
      },
      lifespan: 5000,
    }]);
    this.newhorizons =
      this.physics.add.image(512, 288, 'sprites', 'newhorizons');
    this.newhorizons.body.setCircle(16, 8, 10);
    this.newhorizons.setScale(2);
    this.newhorizons.setOrigin(0.5);
    this.newhorizons.setCollideWorldBounds(true);
    this.newhorizons.speed = 200;
    this.focus = this.add.graphics({
      x: 512,
      y: 288,
    });
    this.focus.lineStyle(4, 0xffff00, 0.5);
    this.focus.beginPath();
    this.focus.moveTo(-120 - Profile.range * 24, -104 - Profile.range * 24);
    this.focus.lineTo(-120 - Profile.range * 24, -120 - Profile.range * 24);
    this.focus.lineTo(-104 - Profile.range * 24, -120 - Profile.range * 24);
    this.focus.moveTo(-120 - Profile.range * 24, 104 + Profile.range * 24);
    this.focus.lineTo(-120 - Profile.range * 24, 120 + Profile.range * 24);
    this.focus.lineTo(-104 - Profile.range * 24, 120 + Profile.range * 24);
    this.focus.moveTo(120 + Profile.range * 24, -104 - Profile.range * 24);
    this.focus.lineTo(120 + Profile.range * 24, -120 - Profile.range * 24);
    this.focus.lineTo(104 + Profile.range * 24, -120 - Profile.range * 24);
    this.focus.moveTo(120 + Profile.range * 24, 104 + Profile.range * 24);
    this.focus.lineTo(120 + Profile.range * 24, 120 + Profile.range * 24);
    this.focus.lineTo(104 + Profile.range * 24, 120 + Profile.range * 24);
    this.focus.strokePath();
    this.physics.world.enable(this.focus);
    this.focus.body.setSize(240 + Profile.range * 48, 240 + Profile.range * 48);
    this.focus.body.setOffset(-120 - Profile.range * 24);
    const zone1 = this.add.image(320, 96, 'sprites', 'zone');
    zone1.setInteractive();
    zone1.on('pointerdown', () => {
      this.physics.moveToObject(this.newhorizons, zone1, 200);
    });
    const zone2 = this.add.image(320, 288, 'sprites', 'zone');
    zone2.setInteractive();
    zone2.on('pointerdown', () => {
      this.physics.moveToObject(this.newhorizons, zone2, 200);
    });
    const zone3 = this.add.image(320, 480, 'sprites', 'zone');
    zone3.setInteractive();
    zone3.on('pointerdown', () => {
      this.physics.moveToObject(this.newhorizons, zone3, 200);
    });
    const zone4 = this.add.image(512, 96, 'sprites', 'zone');
    zone4.setInteractive();
    zone4.on('pointerdown', () => {
      this.physics.moveToObject(this.newhorizons, zone4, 200);
    });
    const zone5 = this.add.image(512, 288, 'sprites', 'zone');
    zone5.setInteractive();
    zone5.on('pointerdown', () => {
      this.physics.moveToObject(this.newhorizons, zone5, 200);
    });
    const zone6 = this.add.image(512, 480, 'sprites', 'zone');
    zone6.setInteractive();
    zone6.on('pointerdown', () => {
      this.physics.moveToObject(this.newhorizons, zone6, 200);
    });
    const zone7 = this.add.image(704, 96, 'sprites', 'zone');
    zone7.setInteractive();
    zone7.on('pointerdown', () => {
      this.physics.moveToObject(this.newhorizons, zone7, 200);
    });
    const zone8 = this.add.image(704, 288, 'sprites', 'zone');
    zone8.setInteractive();
    zone8.on('pointerdown', () => {
      this.physics.moveToObject(this.newhorizons, zone8, 200);
    });
    const zone9 = this.add.image(704, 480, 'sprites', 'zone');
    zone9.setInteractive();
    zone9.on('pointerdown', () => {
      this.physics.moveToObject(this.newhorizons, zone9, 200);
    });
    this.asteroids = this.physics.add.group();
    this.physics.add.overlap(this.newhorizons, this.asteroids, () => {
      if (!Profile.invincible) {
        if (Profile.timeleft < 100) {
          const levels = this.cache.json.get('levels');
          Profile.timeleft = Profile.time * 60000;
          this.scene.stop('PauseScene');
          this.scene.start('LevelScene', {
            level: data.level,
            map: new AsteroidMap(levels[data.level]),
          });
        } else {
          this.scene.stop('PauseScene');
          this.scene.restart();
        }
      }
    });
    this.physics.add.overlap(this.focus, this.asteroids, (focus, asteroid) => {
      if (!asteroid.shot) {
        asteroid.infocus.visible = true;
      }
      asteroid.outoffocus.visible = false;
    });
    this.keys =
      this.input.keyboard.addKeys('W,A,S,D,UP,LEFT,DOWN,RIGHT,SPACE,ENTER');
    this.input.keyboard.on('keydown', (event) => {
      event.preventDefault();
    });
    for (const asteroid of data.map.right) {
      this.addasteroid(0, asteroid.x, asteroid.y);
    }
    for (const asteroid of data.map.down) {
      this.addasteroid(1, asteroid.x, asteroid.y);
    }
    for (const asteroid of data.map.left) {
      this.addasteroid(2, asteroid.x, asteroid.y);
    }
    for (const asteroid of data.map.up) {
      this.addasteroid(3, asteroid.x, asteroid.y);
    }
    this.time.addEvent({
      delay: 32000,
      callback: () => {
        this.cameras.main.fadeOut(300);
      },
    });
    this.time.addEvent({
      delay: 100,
      loop: -1,
      callback: () => {
        if (Profile.timeleft < 100) {
          return;
        }
        Profile.timeleft -= 100,
        this.timebar.x =
          ~~(--Profile.timeleft / (60000 * Profile.time) * 206 - 206);
        const minutes = ~~(Profile.timeleft / 60000);
        const seconds = ~~((Profile.timeleft % 60000) / 1000);
        this.timecounter.text =
          minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
      },
    });
    this.input.keyboard.on('keydown-ENTER', (event) => {
      event.preventDefault();
      if (this.photos < Profile.photo * 3) {
        this.takePicture();
      }
    });
    this.input.keyboard.on('keydown-SPACE', (event) => {
      event.preventDefault();
      if (this.photos < Profile.photo * 3) {
        this.takePicture();
      }
    });
    this.cameras.main.on('camerafadeoutcomplete', () => {
      if (data.level === levels.length - 1) {
        this.scene.stop('PauseScene');
        this.scene.start('WinScene', {
          level: data.level,
          science: this.science,
        });
        this.scene.stop('LevelScene');
      } else {
        this.scene.stop('PauseScene');
        this.scene.start('MenuScene', {
          level: data.level,
          science: this.science,
        });
        this.scene.stop('LevelScene');
      }
    });
    this.photos = 0;
    this.add.image(76, 512, 'sprites', 'frame').setDepth(-1);
    this.add.image(40, 536, 'sprites', 'photocounter');
    this.photocounter =
      this.add.text(40, 536, Profile.photo * 3 - this.photos, {
        fontSize: '24px',
        fontFamily: 'font',
      });
    this.photocounter.setOrigin(0.5);
    this.textures.on('addtexture', (photo) => {
      this.cameras.main.flash(50, 64, 64, 64);
      this.add.image(76 + (this.photos - 1) * 16, 512, photo)
          .setDisplaySize(72, 72).setDepth(-1);
      this.add.image(76 + (this.photos - 1) * 16, 512, 'sprites', 'frame')
          .setDepth(-1);
    });
    this.science = 0;
    const progressborder = this.add.image(0, 0, 'sprites', 'progressborder');
    this.progressbar = this.add.image(0, 160, 'sprites', 'progressbar');
    const progressoverlay = this.add.image(0, 0, 'sprites', 'progressoverlay');
    this.progresscounter = this.add.text(56, -60, this.science + '⚛', {
      fontSize: '24px',
      fontFamily: 'font',
    });
    this.add.container(96, 164, [
      progressborder,
      this.progressbar,
      this.progresscounter,
      progressoverlay,
    ]);
    this.progressmask = this.add.image(96, 164, 'sprites', 'progressbar');
    this.progressmask.visible = false;
    this.progressbar.mask =
      new Phaser.Display.Masks.BitmapMask(this, this.progressmask);
    this.progresscounter.setOrigin(1, 0.5);
    const timeborder = this.add.image(0, 0, 'sprites', 'timeborder');
    this.timebar = this.add.image(
        Profile.timeleft / (Profile.time * 60000) * 206 - 206,
        0,
        'sprites',
        'timebar',
    );
    this.timecounter = this.add.text(0, 12, '', {
      fontSize: '24px',
      fontFamily: 'font',
    });
    const minutes = ~~(Profile.timeleft / 60000);
    const seconds = ~~((Profile.timeleft % 60000) / 1000);
    this.timecounter.text = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    this.timecounter.setOrigin(0.5);
    this.add.container(512, 48, [
      timeborder,
      this.timebar,
      this.timecounter,
    ]);
    this.timemask = this.add.image(512, 48, 'sprites', 'timebar');
    this.timemask.visible = false;
    this.timebar.mask =
      new Phaser.Display.Masks.BitmapMask(this, this.timemask);
  }

  /**
   *
   *
   * @memberof LevelScene
   */
  takePicture() {
    const focus = this.focus.body.getBounds({});
    this.game.renderer.snapshotArea(
        focus.x,
        focus.y,
        240 + Profile.range * 48,
        240 + Profile.range * 48,
        (image) => {
          this.photos += 1;
          this.textures.addImage('photo' + Phaser.Math.RND.uuid(), image);
          this.photocounter.text = Profile.photo * 3 - this.photos;
          this.physics.overlapRect(
              focus.x,
              focus.y,
              240 + Profile.range * 48,
              240 + Profile.range * 48,
          ).forEach((body) => {
            if (this.asteroids.contains(body.gameObject) &&
              !body.gameObject.shot) {
              body.gameObject.shot = true;
              body.gameObject.infocus.visible = false;
              this.science += 1;
              this.progresscounter.text = this.science + '⚛';
              let y = 160 - ~~((this.science / this.target) * 92);
              // eslint-disable-next-line new-cap
              y = Phaser.Math.Clamp(y, 0, 160);
              this.tweens.add({
                targets: this.progressbar,
                y: y,
                ease: 'Quad',
                duration: 300,
              });
            }
          });
        },
    );
  }

  /**
   *
   *
   * @memberof LevelScene
   */
  update() {
    if (!this.newhorizons.body) {
      return;
    }
    //this.newhorizons.setVelocity(0);
    if (this.keys.W.isDown || this.keys.UP.isDown) {
      this.newhorizons.setVelocityY(-this.newhorizons.speed);
    }
    if (this.keys.A.isDown || this.keys.LEFT.isDown) {
      this.newhorizons.setVelocityX(-this.newhorizons.speed);
    }
    if (this.keys.S.isDown || this.keys.DOWN.isDown) {
      this.newhorizons.setVelocityY(this.newhorizons.speed);
    }
    if (this.keys.D.isDown || this.keys.RIGHT.isDown) {
      this.newhorizons.setVelocityX(this.newhorizons.speed);
    }
    // eslint-disable-next-line new-cap
    const focusx = Phaser.Math.Clamp(
        this.newhorizons.x + 22,
        120 + Profile.range * 24,
        904 - Profile.range * 24,
    );
    // eslint-disable-next-line new-cap
    const focusy = Phaser.Math.Clamp(
        this.newhorizons.y + 26,
        120 + Profile.range * 24,
        456 - Profile.range * 24,
    );
    this.focus.setPosition(focusx, focusy);
    this.asteroids.getChildren().forEach((asteroid) => {
      if (asteroid.body.touching.none) {
        asteroid.infocus.visible = false;
      }
      asteroid.outoffocus.visible = false;
    });
    this.physics.overlapRect(0, 0, 1024, 576).forEach((body) => {
      if (this.asteroids.contains(body.gameObject) &&
        !body.gameObject.infocus.visible &&
        !body.gameObject.shot) {
        body.gameObject.outoffocus.visible = true;
      }
    });
  }

  /**
   *
   *
   * @param {*} d
   * @param {*} x
   * @param {*} y
   * @memberof LevelScene
   */
  addasteroid(d, x, y) {
    const frame =
      ['asteroidright', 'asteroiddown', 'asteroidleft', 'asteroidup'][d];
    const asteroid = this.add.image(0, 0, 'sprites', frame);
    asteroid.setScale(2);
    const infocus = this.add.image(0, 0, 'sprites', 'infocus');
    infocus.setScale(2);
    const outoffocus = this.add.image(0, 0, 'sprites', 'outoffocus');
    outoffocus.setScale(2);
    // infocus.lineStyle(3, 0xffff00, 0.5);
    // infocus.beginPath();
    // infocus.moveTo(0, -16);
    // infocus.lineTo(0, -24);
    // infocus.moveTo(0, 16);
    // infocus.lineTo(0, 24);
    // infocus.moveTo(-16, 0);
    // infocus.lineTo(-24, 0);
    // infocus.moveTo(16, 0);
    // infocus.lineTo(24, 0);
    // infocus.closePath();
    // infocus.strokePath();
    // infocus.strokeCircle(0, 0, 20);
    // const outoffocus = this.add.graphics();
    // outoffocus.lineStyle(3, 0xffffff, 0.5);
    // outoffocus.beginPath();
    // outoffocus.arc(
    //     // eslint-disable-next-line new-cap
    //     0, 0, 40, Phaser.Math.DegToRad(30), Phaser.Math.DegToRad(60),
    // );
    // outoffocus.strokePath();
    // outoffocus.beginPath();
    // // eslint-disable-next-line new-cap
    // outoffocus.arc(
    //     // eslint-disable-next-line new-cap
    //     0, 0, 40, Phaser.Math.DegToRad(120), Phaser.Math.DegToRad(150),
    // );
    // outoffocus.strokePath();
    // outoffocus.beginPath();
    // // eslint-disable-next-line new-cap
    // outoffocus.arc(
    //     // eslint-disable-next-line new-cap
    //     0, 0, 40, Phaser.Math.DegToRad(210), Phaser.Math.DegToRad(240),
    // );
    // outoffocus.strokePath();
    // outoffocus.beginPath();
    // // eslint-disable-next-line new-cap
    // outoffocus.arc(
    //     // eslint-disable-next-line new-cap
    //     0, 0, 40, Phaser.Math.DegToRad(300), Phaser.Math.DegToRad(330),
    // );
    // outoffocus.strokePath();
    this.tweens.add({
      targets: [outoffocus, infocus],
      angle: 90,
      loop: -1,
    });
    infocus.visible = false;
    outoffocus.visible = false;
    const asteroidcontainer =
      this.add.container(x, y, [asteroid, infocus, outoffocus]);
    this.physics.world.enable(asteroidcontainer);
    asteroidcontainer.body.setCircle(64, -64, -64);
    this.asteroids.add(asteroidcontainer);
    asteroidcontainer.body.setVelocity(
        [200, 0, -200, 0][d],
        [0, 200, 0, -200][d],
    );
    asteroidcontainer.setDepth(-2);
    asteroidcontainer.infocus = infocus;
    asteroidcontainer.outoffocus = outoffocus;
  }
}
