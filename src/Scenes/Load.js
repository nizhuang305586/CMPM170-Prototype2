class Load extends Phaser.Scene {
    constructor() {
        super("Load")
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
            }
        }

        this.add.text(
            20, 20,
            "Museum Heist - Grid Prototype",
            {
                fontSize: "20px",
                color: "#ffffff"
            }
        );


        this.scene.launch("PlayerCount")
    }
}