import Button from './button.js';

/**
 * Represent the description and credits scene.
 *
 * @export
 * @class InfoScene
 * @extends {Phaser.Scene}
 */
export default class InfoScene extends Phaser.Scene {
  /**
   * Creates an instance of InfoScene.
   * @memberof InfoScene
   */
  constructor() {
    super('InfoScene');
  }

  /**
   * Creates the content of the InfoScene.
   *
   * @memberof InfoScene
   */
  create() {
    let opened = false;
    const info = new Button(this, 40, 40, 'sprites', 'info');
    info.on('click', () => {
      if (!opened) {
        window.visible = true;
        opened = true;
        this.tweens.add({
          duration: 150,
          targets: window,
          y: 328,
        });
      } else {
        opened = false;
        this.tweens.add({
          duration: 150,
          targets: window,
          y: 904,
          onComplete: () => {
            window.visible = false;
          },
        });
      }
    });
    const bg = this.add.graphics();
    bg.fillStyle(0x000000);
    bg.fillRect(-256, -128, 512, 256);
    bg.setAlpha(0.95);
    const div1 = this.add.text(0, 0,
        `Art by Zoltan Kosina
based on PK01 by Philip Klevestav
and on top-down-sci-fi-shooter-characters 
by tatermand
Fonts by Typodermic Fonts
Audio by Zapsplat www.zapsplat.com
and Tabletop Audio tabletopaudio.com`, {
          fontSize: '14px',
          fontFamily: 'font2',
          color: 'lightgray',
          lineSpacing: 14,
          align: 'center',
        }).setOrigin(0.5);
    const window = this.add.container(512, 904, [bg, div1]);
    window.visible = false;
  }
}
