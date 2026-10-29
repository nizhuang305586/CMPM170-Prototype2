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




//IN CASE THIS DOESNT WORK OUT OLD CODE IS HERE


// create() {
    //     this.gridSize = this.registry.get("gridSize");
    //     this.tileSize = this.registry.get("tileSize");
    //     this.offsetX = this.registry.get("offsetX");
    //     this.offsetY = this.registry.get("offsetY");

    //     this.currentPlayerIndex = 0;
    //     this.createPlayers();
    //     this.setupInput();
    // }

    // createPlayers() {
    //     this.players = [
    //         {
    //             id: 1,
    //             name: "player 1",
    //             col: 0,
    //             row: 0,
    //             color: 0x3399ff,
    //             sprite: null
    //         },
    //         {
    //             id: 2,
    //             name: "player 2",
    //             col: 0,
    //             row: 0,
    //             color: 0xff6666,
    //             sprite: null
    //         }
    //     ];

    //     for (const player of this.players) {
    //         player.sprite = this.add.circle(
    //             this.tileCenterX(player.col),
    //             this.tileCenterY(player.row),
    //             this.tileSize * 0.32,
    //             player.color
    //         );
    //     }
    // }

    // setupInput() {
    //     const tapArea = this.add.zone(
    //         this.offsetX,
    //         this.offsetY,
    //         this.boardSize,
    //         this.boardSize
    //     );

    //     tapArea.setOrigin(0, 0);
    //     tapArea.setInteractive();

    //     tapArea.on("pointerdown", (pointer) => {
    //         const col = Math.floor(
    //             (pointer.x - this.offsetX) / this.tileSize
    //         );

    //         const row = Math.floor(
    //             (pointer.y - this.offsetY) / this.tileSize
    //         );

    //         if (
    //             col < 0 || col >= this.gridSize ||
    //             row < 0 || row >= this.gridSize
    //         ) {
    //             return;
    //         }

    //         this.moveCurrentPlayer(col, row);
    //     });
    // }

    // moveCurrentPlayer(col, row) {
    //     const player = this.players[this.currentPlayerIndex];

    //     const distance =
    //         Math.abs(col - player.col) +
    //         Math.abs(row - player.row);

    //     if (distance !== 1) {
    //         return;
    //     }

    //     player.col = col;
    //     player.row = row;

    //     player.sprite.setPosition(
    //         this.tileCenterX(col),
    //         this.tileCenterY(row)
    //     );
    // }

    // tileCenterX(col) {
    //     return this.offsetX +
    //         col * this.tileSize +
    //         this.tileSize / 2;
    // }

    // tileCenterY(row) {
    //     return this.offsetY +
    //         row * this.tileSize +
    //         this.tileSize / 2;
    // }