class GridScene extends Phaser.Scene {
    constructor() {
        super("GridScene");
    }

    create() {
        const gridSize = 16;
        const tileSize = 36;

        const boardSize = gridSize * tileSize;
        const offsetX = (960 - boardSize) / 2;
        const offsetY = (640 - boardSize) / 2;

        const graphics = this.add.graphics();

        // Draw the 16 x 16 board.
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const x = offsetX + col * tileSize;
                const y = offsetY + row * tileSize;

                const color =
                    (row + col) % 2 === 0
                        ? 0xd8d0b8
                        : 0xb8ae96;

                graphics.fillStyle(color, 1);
                graphics.fillRect(
                    x, y, tileSize, tileSize
                );

                graphics.lineStyle(1, 0x554f43, 1);
                graphics.strokeRect(
                    x, y, tileSize, tileSize
                );
            }
        }

        // Temporary player token.
        this.add.circle(
            offsetX + tileSize / 2,
            offsetY + tileSize / 2,
            tileSize * 0.32,
            0x3399ff
        );

        this.add.text(
            20, 20,
            "Museum Heist - Grid Prototype",
            {
                fontSize: "20px",
                color: "#ffffff"
            }
        );
    }
}