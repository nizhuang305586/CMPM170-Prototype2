class RoundSystem extends Phaser.Scene {
    constructor() {
        super("RoundSystem");

        this.players = [];
        this.rounds = null;
        this.movesRemaining = null;
        this.currentPlayerIndex = 0;
    }

    init(data) {
        this.playerCount = data.PlayerCount;
    }

    create() {
        this.keys = this.input.keyboard.addKeys("W,A,S,D");
        this.createGameBoard();

        this.coordDisplay = this.add.text(0, 0, "", {
            fontSize: "14px",
            color: "#ffffff",
            backgroundColor: "#222222",
            padding: { x: 8, y: 5 }
        })

        this.coinResult = this.add.text(795, 400, "", {
            fontSize: "14px",
            color: "#050505",
            backgroundColor: "#fdfdfd",
            padding: { x: 8, y: 8 }
        })

        this.makeButton(840, 450, "Flip Coin", () =>{
            const result = Phaser.Math.Between(0, 1) === 0
                ? "Heads"
                : "Tails";
            this.coinResult.setText(result);
        });

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

        const startingPositions = [
            { col: 0, row: 0 },    // Player 1 starting position
            { col: 15, row: 15 }   // Player 2 starting position
        ];

        for (let i = 0; i < this.playerCount; i++) {
            const start = startingPositions[i];
            this.players[i] = new Player(this, start.col, start.row, colors[i], i + 1);
        }

        this.rounds = this.players.length - 1;

        this.RollButton = this.makeButton(835, 550, "Roll", () => {
            const rollNumber = Phaser.Math.Between(1, 6);
            this.movesRemaining = rollNumber;
            this.rollNumber.setText(`Moves: ${rollNumber}`);
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keys.W)) {
            this.movePlayer(0, -1);
        } else if (Phaser.Input.Keyboard.JustDown(this.keys.A)) {
            this.movePlayer(-1, 0);
        } else if (Phaser.Input.Keyboard.JustDown(this.keys.S)) {
            this.movePlayer(0, 1);
        } else if (Phaser.Input.Keyboard.JustDown(this.keys.D)) {
            this.movePlayer(1, 0);
        }
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

    movePlayer(x, y) {
        if (this.movesRemaining <= 0) return;

        const player = this.players[this.currentPlayerIndex]

        const newCol = player.col + x;
        const newRow = player.row + y;

        const tileSize = this.registry.get("tileSize");
        const offsetX = this.registry.get("offsetX");
        const offsetY = this.registry.get("offsetY");
        const gridSize = this.registry.get("gridSize");
        
        if (newCol < 0 || newCol >= gridSize || newRow < 0 || newRow >= gridSize) return;

        player.col = newCol;
        player.row = newRow;

        player.setPosition(
            offsetX + newCol * tileSize + tileSize / 2,
            offsetY + newRow * tileSize + tileSize / 2
        );

        this.movesRemaining--;
        this.rollNumber.setText(`Moves: ${this.movesRemaining}`);

        if (this.movesRemaining === 0)
            this.nextTurn();
    }

    nextTurn() {
        this.currentPlayerIndex++;

        if (this.currentPlayerIndex >= this.players.length) {
            this.currentPlayerIndex = 0;
            this.StatuesMove();
        }
    }

    StatuesMove() {
        console.log("Statues moving");
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

