class RoundSystem extends Phaser.Scene {
    constructor() {
        super("RoundSystem");

        this.players = [];
        this.rounds = null;
    }

    init(data) {
        this.playerCount = data.PlayerCount;
    }

    create() {
        this.createGameBoard();

        this.coordDisplay = this.add.text(0, 0, "", {
            fontSize: "14px",
            color: "#ffffff",
            backgroundColor: "#222222",
            padding: { x: 8, y: 5 }
        })

        this.rollNumber = this.add.text(795, 500, "", {
            fontSize: "14px",
            color: "#050505",
            backgroundColor: "#fdfdfd",
            padding: { x: 8, y: 8 }
        })

        this.input.on("pointermove", (pointer) => {
            const tileSize = this.registry.get("tileSize");
            const offsetX = this.registry.get("offsetX");
            const offsetY = this.registry.get("offsetY");
            const gridSize = this.registry.get("gridSize");

            const col = Math.floor((pointer.x - offsetX) / tileSize);
            const row = Math.floor((pointer.y - offsetY) / tileSize);

            this.coordDisplay.setPosition(
                pointer.x + 15,
                pointer.y + 15
            );

            if (col >= 0 && col < gridSize && row >= 0 && row < gridSize) {
                this.coordDisplay.setText(`Col: ${col}\nRow: ${row}`);
            } else {
                this.coordDisplay.setText("Outside Grid");
            }
        })


        const colors = [0x3399ff, 0xff6666]

        for (let i = 0; i < this.playerCount; i++) {
            this.players[i] = new Player(this, i, 0, colors[i], i + 1);
        }

        this.rounds = this.players.length - 1;

        this.RollButton = this.makeButton(805, 550, "Roll", () => {
            const rollNumber = Phaser.Math.Between(1, 6);
            this.rollNumber.setText(rollNumber)
        });
    }

    update() {

    }


    createGameBoard() {
        const gridSize = 16;
        const tileSize = 36;

        const boardSize = gridSize * tileSize;
        const offsetX = (960 - boardSize) / 2;
        const offsetY = (640 - boardSize) / 2;

        this.registry.set("gridSize", gridSize);
        this.registry.set("tileSize", tileSize);
        this.registry.set("offsetX", offsetX);
        this.registry.set("offsetY", offsetY);

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
    }

    makeButton(x, y, label, onClick) {
        const btn = this.add.text(x, y, label, {
            fontFamily: 'Arial',
            fontSize: '26px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { left: 4, right: 4, top: 4, bottom: 4 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(20)

        btn.setInteractive({ useHandCursor: true })

        btn.on('pointerover', () => {
            btn.setStyle({ backgroundColor: '#1b255a' })
            btn.setScale(1.03)
        })

        btn.on('pointerout', () => {
            btn.setStyle({ backgroundColor: '#000000' })
            btn.setScale(1.0)
        })

        btn.on('pointerdown', () => {
            onClick()
        })

        return btn
    }

    
}

