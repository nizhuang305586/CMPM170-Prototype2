class Player extends Phaser.Scene {
    constructor() {
        super("Player");
    }

    create() {
        this.gridSize = this.registry.get("gridSize");
        this.tileSize = this.registry.get("tileSize");
        this.offsetX = this.registry.get("offsetX");
        this.offsetY = this.registry.get("offsetY");

        this.currentPlayerIndex = 0;
        this.createPlayers();
    }

    createPlayers() {
        this.players = [
            {
                id: 1,
                name: "player 1",
                col: 0,
                row: 0,
                color: 0x3399ff,
                sprite: null
            },
            {
                id: 2,
                name: "player 2",
                col: 0,
                row: 0,
                color: 0xff6666,
                sprite: null
            }
        ];

        for (const player of this.players) {
            player.sprite = this.add.circle(
                this.tileCenterX(player.col),
                this.tileCenterY(player.row),
                this.tileSize * 0.32,
                player.color
            );
        }
    }

    moveCurrentPlayer(col, row) {
        const player = this.players[this.currentPlayerIndex];

        const distance =
            Math.abs(col - player.col) +
            Math.abs(row - player.row);

        if (distance !== 1) {
            return;
        }
    }
}