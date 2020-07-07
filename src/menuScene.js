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
    Profile.money = 0;
    const bg = this.add.image(512, 288, 'bg');
    bg.setDisplaySize(1024, 576);
    this.scene.get('MusicScene').play(0);
    this.scene.run('InfoScene');
    const windowbg = this.add.graphics();
    windowbg.fillStyle(0x000000);
    windowbg.fillRect(-256, -128, 512, 288);
    windowbg.setAlpha(0.95);
    const title = this.add.text(0, -184, 'Mission', {
      fontSize: '48px',
      fontFamily: 'font',
    });
    title.setOrigin(0.5);
    const content = this.add.text(0, 0, `Use your super power to sneak into
the hidden researh facility of the Asclepius Inc.
hack into their computers and steal every 
valuable information!

Contractual Amount: $150.000.000
Maximum Bonus: $250.000.000`, {
      fontSize: '16px',
      fontFamily: 'font2',
      align: 'center',
      lineSpacing: 14,
    });
    content.setOrigin(0.5);
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
        first: true,
      });
      this.scene.stop('InfoScene');
      this.scene.stop();
    });
    const buttons = this.add.container(0, 224, [play]);
    const windowcontent = [windowbg, title, content, buttons];
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
}
