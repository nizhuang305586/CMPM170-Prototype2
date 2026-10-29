class Player extends Phaser.GameObjects.Arc {
    constructor(scene, col, row, color, id, isClone = false) {
        const tileSize = scene.registry.get("tileSize");
        const offsetX = scene.registry.get("offsetX");
        const offsetY = scene.registry.get("offsetY");

        const x = offsetX + col * tileSize + tileSize / 2;
        const y = offsetY + row * tileSize + tileSize / 2;

        super(scene, x, y, tileSize * 0.3, 0, 360, false, color);

        scene.add.existing(this);

        this.setDepth(5);

        this.id = id;
        this.col = col;
        this.row = row;

        this.isClone = isClone;
        this.ownerId = id;
        this.playerColor = color;

        // OG properties
        this.clonePiece = null;
        this.hasCloned = false;

        // Clone properties
        this.cloneTurnsRemaining = isClone ? 3 : null;
        this.cloneJustCreated = false;

        this.hasTreasure = false;

    }

}
