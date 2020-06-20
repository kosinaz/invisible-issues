import Button from './button.js';
import Profile from './profile.js';

/**
 * Represent the level introduction modal of the level scene.
 *
 * @export
 * @class MenuScene
 * @extends {Phaser.Scene}
 */
export default class MenuScene extends Phaser.Scene {
  /**
   * Creates an instance of MenuScene.
   * @memberof MenuScene
   */
  constructor() {
    super('MenuScene');
  }

  /**
   * Creates the content of the MenuScene.
   *
   * @param {*} data
   * @memberof MenuScene
   */
  create(data) {
    const bg = this.add.image(512, 288, 'bg');
    bg.setDisplaySize(1024, 576);
    const levels = this.cache.json.get('levels');
    this.scene.get('MusicScene').play(0);
    this.scene.run('InfoScene');
    const windowbg = this.add.graphics();
    windowbg.fillStyle(0x000000);
    windowbg.fillRect(256, 0, 512, 576);
    windowbg.setAlpha(0.75);
    const title = this.add.text(0, -184, 'Mission ' + (data.level + 1), {
      fontSize: '48px',
      fontFamily: 'font',
    });
    title.setOrigin(0.5);
    const star1border = this.add.image(0, 0, 'sprites', 'star');
    const star1 = this.add.image(0, 0, 'sprites', 'staron');
    star1.setScale(Profile.level[data.level] > 0 ? 1 : 0);
    const star2border = this.add.image(-96, 0, 'sprites', 'star');
    star2border.setScale(0.75);
    const star2 = this.add.image(-96, 0, 'sprites', 'staron');
    star2.setScale(Profile.level[data.level] > 1 ? 0.75 : 0);
    const star3border = this.add.image(96, 0, 'sprites', 'star');
    star3border.setScale(0.75);
    const star3 = this.add.image(96, 0, 'sprites', 'staron');
    star3.setScale(Profile.level[data.level] > 2 ? 0.75 : 0);
    const stars = this.add.container(0, -80, [
      star1border,
      star1,
      star2border,
      star2,
      star3border,
      star3,
    ]);
    const play = new Button(this, 0, 0, 'sprites', 'playon');
    play.once('click', () => {
      this.cameras.main.fadeOut(300);
    });
    this.input.keyboard.on('keydown-ENTER', (event) => {
      event.preventDefault();
      this.cameras.main.fadeOut(300);
    });
    this.input.keyboard.on('keydown-SPACE', (event) => {
      event.preventDefault();
      this.cameras.main.fadeOut(300);
    });
    this.cameras.main.on('camerafadeoutcomplete', () => {
      Profile.timeleft = Profile.time * 60000;
      this.scene.start('LevelScene', {
        level: data.level,
        map: new AsteroidMap(levels[data.level]),
      });
      this.scene.stop('SelectScene');
      this.scene.stop('UpgradeScene');
      this.scene.stop('InfoScene');
      this.scene.stop();
    });
    if (data.science) {
      if (data.science >= levels[data.level].target &&
        (!Profile.level[data.level] ||
          Profile.level[data.level] < 1)) {
        Profile.star += 1;
        Profile.level[data.level] = 1;
        this.tweens.add({
          delay: 500,
          targets: star1,
          duration: 150,
          scale: 1,
          ease: 'Back',
        });
        if (Profile.progress < data.level + 1) {
          Profile.progress += 1;
        }
      }
      if (data.science >= levels[data.level].target * 1.5 &&
        Profile.level[data.level] < 2) {
        Profile.star += 1;
        Profile.level[data.level] = 2;
        this.tweens.add({
          delay: 750,
          targets: star2,
          duration: 150,
          scale: 0.75,
          ease: 'Back',
        });
      }
      if (data.science >= levels[data.level].target * 1.75 &&
        Profile.level[data.level] < 3) {
        Profile.star += 1;
        Profile.level[data.level] = 3;
        this.tweens.add({
          delay: 1000,
          targets: star3,
          duration: 150,
          scale: 0.75,
          ease: 'Back',
        });
      }
      localStorage.setItem('progress', Profile.progress);
      localStorage.setItem('star', Profile.star);
      localStorage.setItem('level' + data.level, Profile.level[data.level]);
    }
    const buttons = this.add.container(0, 224, [play]);
    if (data.level > 0) {
      const left = new Button(this, -96, 0, 'sprites', 'left');
      left.once('click', () => {
        this.previousLevel(data);
      });
      buttons.add(left);
      this.input.keyboard.once('keydown-LEFT', (event) => {
        event.preventDefault();
        this.previousLevel(data);
      });
    }
    if (data.level < levels.length - 1) {
      const right = new Button(this, 96, 0, 'sprites', 'right');
      right.once('click', () => {
        this.nextLevel(data);
      });
      buttons.add(right);
      if (Profile.progress <= data.level) {
        right.lock();
      } else {
        this.input.keyboard.once('keydown-RIGHT', (event) => {
          event.preventDefault();
          this.nextLevel(data);
        });
      }
    }
    const windowcontent = [windowbg, title, stars, target, warnings, buttons];
    this.window = this.add.container(512, 304, windowcontent);
    if (!data.from) {
      this.cameras.main.fadeIn(100);
    } else if (data.from === 'left') {
      this.tweens.add({
        targets: this.window,
        duration: 150,
        x: {
          from: -276,
          to: 512,
        },
      });
    } else if (data.from === 'right') {
      this.tweens.add({
        targets: this.window,
        duration: 150,
        x: {
          from: 1300,
          to: 512,
        },
      });
    }
  }

  /**
   *
   *
   * @param {*} level
   * @param {*} data
   * @memberof MenuScene
   */
  setLevel(level, data) {
    this.tweens.add({
      targets: this.window,
      duration: 150,
      x: {
        from: 512,
        to: data.level > level ? 1300 : -276,
      },
      onComplete: () => {
        this.scene.start('MenuScene', {
          level: level,
          from: data.level > level ? 'left' : 'right',
        });
      },
    });
  }
  /**
   *
   *
   * @param {*} data
   * @memberof MenuScene
   */
  nextLevel(data) {
    this.tweens.add({
      targets: this.window,
      duration: 150,
      x: {
        from: 512,
        to: -276,
      },
      onComplete: () => {
        this.scene.start('MenuScene', {
          level: data.level + 1,
          from: 'right',
        });
      },
    });
  }

  /**
   *
   *
   * @param {*} data
   * @memberof MenuScene
   */
  previousLevel(data) {
    this.tweens.add({
      targets: this.window,
      duration: 150,
      x: {
        from: 512,
        to: 1300,
      },
      onComplete: () => {
        this.scene.start('MenuScene', {
          level: data.level - 1,
          from: 'left',
        });
      },
    });
  }
}
