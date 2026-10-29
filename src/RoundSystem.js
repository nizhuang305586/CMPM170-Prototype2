class RoundSystem extends Phaser.Scene {
    constructor() {
        super("RoundSystem");

        this.players = [];
        this.rounds = null;
        this.movesRemaining = null;
        this.currentPlayerIndex = 0;
        this.hasTreasure = false;
        this.selectedPiece = null;
        this.turnHasMoved = false;
        this.statues = [];
    }

    init(data) {
        this.playerCount = data.PlayerCount;
    }

    create() {
        this.keys = this.input.keyboard.addKeys("W,A,S,D,C,TAB");
        this.createGameBoard();

        this.coordDisplay = this.add.text(0, 0, "", {
            fontSize: "14px",
            color: "#ffffff",
            backgroundColor: "#222222",
            padding: { x: 8, y: 5 }
        })

        this.treasureHolder = this.add.text(775, 300, "Treasure: Nobody", 
            {
                fontSize: "16px",
                color: "#ffffff",
                backgroundColor: "#222222",
                padding: { x: 8, y: 8 }
            });

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

        this.selectedPieceDiff = this.add.text(
            775, 200,
            "Controlling: Player 1 (Original)",
            {
                fontSize: "14px",
                color: "#ffffff",
                backgroundColor: "#050505",
                padding: { x: 8, y: 6 }
            }
        );

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

        this.selectedPiece = this.players[this.currentPlayerIndex];

        this.createStatues();

        this.rounds = this.players.length - 1;

        this.RollButton = this.makeButton(835, 550, "Roll", () => {
            const rollNumber = Phaser.Math.Between(1, 6);
            this.movesRemaining = rollNumber;
            this.rollNumber.setText(`Moves: ${rollNumber}`);
        });

        this.makeButton(835, 100, "Clone (C)", () => {
            this.createClone();
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

        const player = this.players[this.currentPlayerIndex];

        if (Phaser.Input.Keyboard.JustDown(this.keys.C)) {
            this.createClone();
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.TAB)) {
                this.selectedPiece =
                    this.selectedPiece === player
                        ? player.clonePiece
                        : player;
            const pieceType = this.selectedPiece.isClone
                ? "Clone"
                : "Original";

            this.selectedPieceDiff.setText(
                `Controlling: Player ${player.id} (${pieceType})`
            );
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

        this.treasure = {
            col: 8, 
            row: 8,
            icon: this.add.text(
                offsetX + boardSize / 2 + 1.5,
                offsetY + boardSize / 2 + 5,
                "💎",
                { fontSize: "32px" }
            )
        };

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

        const player = this.selectedPiece || this.players[this.currentPlayerIndex]

        const newCol = player.col + x;
        const newRow = player.row + y;

        const tileSize = this.registry.get("tileSize");
        const offsetX = this.registry.get("offsetX");
        const offsetY = this.registry.get("offsetY");
        const gridSize = this.registry.get("gridSize");
        
        if (newCol < 0 || newCol >= gridSize || newRow < 0 || newRow >= gridSize) return;

        player.col = newCol;
        player.row = newRow;

        if(player.col == this.treasure.col && player.row === this.treasure.row){
            player.hasTreasure = true;
            this.treasure.icon.setVisible(false);
            this.treasure.col = null;
            this.treasure.row = null;
            this.treasureHolder.setText(
                `Treasure: Player ${this.currentPlayerIndex + 1}`
            );
        }

        player.setPosition(
            offsetX + newCol * tileSize + tileSize / 2,
            offsetY + newRow * tileSize + tileSize / 2,
        );

        for (const op of this.players) {
            if( op != player && op.hasTreasure && op.row == player.row && op.col == player.col)
            {
                op.hasTreasure = false;
                player.hasTreasure = true;
                this.treasureHolder.setText(
                    `Treasure: Player ${this.currentPlayerIndex + 1}`
                );
            }
        }    

        this.movesRemaining--;
        this.rollNumber.setText(`Moves: ${this.movesRemaining}`);

        if (this.movesRemaining === 0)
            this.nextTurn();
    }


    nextTurn() {
        const player = this.players[this.currentPlayerIndex];

        // Update clone lifespan
        if (player.clonePiece) {
            const clone = player.clonePiece;

            if (clone.cloneJustCreated) {
                clone.cloneJustCreated = false;
            } else {
                clone.cloneTurnsRemaining--;

                if (clone.cloneTurnsRemaining <= 0) {
                    clone.destroy();
                    player.clonePiece = null;

                    console.log(`Player ${player.id}'s clone expired.`);
                    
                    // Reset clone status for player
                    player.hasCloned = false;
                }
            }
        }

        this.currentPlayerIndex++;

        if (this.currentPlayerIndex >= this.players.length) {
            this.currentPlayerIndex = 0;
            this.StatuesMove();
        }

        this.movesRemaining = null;
        this.turnHasMoved = false;

        // OG piece selected
        this.selectedPiece = this.players[this.currentPlayerIndex];

        this.rollNumber.setText(
            `Player ${this.currentPlayerIndex + 1}: Roll to move`
        );
    }


    StatuesMove() {
        console.log("Statues moving");

        for (const statue of this.statues) {
            let randomInt = Phaser.Math.Between(1, 4); 
            statue.direction = (statue.direction + randomInt) % 4;

            this.drawStatueFOV(statue);
        }

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

    createClone() {
        const player = this.players[this.currentPlayerIndex];

        if (player.hasCloned) {
            console.log("You have already created your clone");
            return;
        }

        if (this.turnHasMoved) {
            console.log("You cannot clone after moving");
            return;
        }

        const gridSize = this.registry.get("gridSize");

        const directions = [
            { col: 0, row: -1 },
            { col: 1, row: 0 },
            { col: 0, row: 1 },
            { col: -1, row: 0 }
        ];

        // Randomize tile spawn
        Phaser.Utils.Array.Shuffle(directions);

        let spawnCol = null;
        let spawnRow = null;

        for (const direction of directions) {
            const col = player.col + direction.col;
            const row = player.row + direction.row;

            // Avoid outside spawning
            if (
                col < 0 || col >= gridSize ||
                row < 0 || row >= gridSize
            ) {
                continue;
            }

            const occupied = this.players.some(other => {
                if (other.col === col && other.row === row) {
                    return true;
                }

                const clone = other.clonePiece;

                return clone &&
                    clone.active &&
                    clone.col === col &&
                    clone.row === row;
            });

            if (occupied) {
                continue;
            }

            spawnCol = col;
            spawnRow = row;
            break;
        }

        // Make clone
        const clone = new Player(
            this,
            spawnCol,
            spawnRow,
            player.playerColor,
            player.id,
            true
        );

        player.clonePiece = clone;
        player.hasCloned = true;
        clone.cloneJustCreated = true;

        // Cloning ends the player's turn.
        this.nextTurn();
    }


    createStatues() {
        const positions = [
            { col: 4, row: 4, direction: 1 },
            { col: 11, row: 3, direction: 2 },
            { col: 10, row: 11, direction: 3 }
        ];

        for (const position of positions) {
            const statue = {
                col: position.col,
                row: position.row,
                direction: position.direction,
                range: 5,
                fovGraphics: this.add.graphics(),
                icon: this.add.text(0, 0, "😭", {
                    fontSize: "26px",
                }).setOrigin(0.5).setDepth(4)
            };

            this.statues.push(statue);
            this.drawStatueFOV(statue);
        }
    }

    drawStatueFOV(statue) {
        const tileSize = this.registry.get("tileSize");
        const offsetX = this.registry.get("offsetX");
        const offsetY = this.registry.get("offsetY");
        const gridSize = this.registry.get("gridSize");

        const directions = [
            { col: 0, row: -1 }, // Up
            { col: 1, row: 0 },  // Right
            { col: 0, row: 1 },  // Down
            { col: -1, row: 0 }  // Left
        ];

        const direction = directions[statue.direction];

        statue.fovGraphics.clear();
        statue.fovGraphics.setDepth(2);

        // Make visible
        statue.fovGraphics.fillStyle(0xff2222, 0.3);

        for (let distance = 1; distance <= statue.range; distance++) {
            const col = statue.col + direction.col * distance;
            const row = statue.row + direction.row * distance;

            if (
                col < 0 || col >= gridSize ||
                row < 0 || row >= gridSize
            ) {
                break;
            }

            statue.fovGraphics.fillRect(
                offsetX + col * tileSize,
                offsetY + row * tileSize,
                tileSize,
                tileSize
            );
        }

        statue.icon.setPosition(
            offsetX + statue.col * tileSize + tileSize / 2,
            offsetY + statue.row * tileSize + tileSize / 2
        );
    }

}

