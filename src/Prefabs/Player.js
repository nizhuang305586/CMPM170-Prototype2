class Player extends Phaser.GameObjects.Arc {
    constructor(scene, col, row, color, id) {
        const tileSize = scene.registry.get("tileSize");
        const offsetX = scene.registry.get("offsetX");
        const offsetY = scene.registry.get("offsetY");

        const x = offsetX + col * tileSize + tileSize / 2;
        const y = offsetY + row * tileSize + tileSize / 2;

        super(scene, x, y, tileSize * 0.3, 0, 360, false, color);

        scene.add.existing(this);

        this.id = id;
        this.col = col;
        this.row = row;
    }

}
