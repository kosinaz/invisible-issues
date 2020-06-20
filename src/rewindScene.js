/**
 * Represent the rewind animation of the level scene.
 *
 * @export
 * @class RewindScene
 * @extends {Phaser.Scene}
 */
export default class RewindScene extends Phaser.Scene {
  /**
   * Creates an instance of RewindScene.
   * @memberof RewindScene
   */
  constructor() {
    super('RewindScene');
  }

  /**
   * Creates the content of the RewindScene.
   *
   * @param {*} data
   * @memberof RewindScene
   */
  create(data) {
    let x = 0;
    this.time.addEvent({
      delay: 150,
      callback: () => {
        if (x < data.snaps.length) {
          if (this.textures.exists('snap' + x)) {
            this.textures.remove('snap' + x);
          }
          this.textures.addImage('snap' + x, data.snaps[x]);
          x += 1;
        } else {
          this.scene.start('LevelScene', {
            level: data.level,
            map: data.map,
          });
          this.scene.stop();
        }
      },
      loop: true,
    });
    this.textures.on('addtexture', (snap) => {
      this.add.image(512, 288, snap);
    });
  }
}
