class PlayerCount extends Phaser.Scene {
    constructor() {
        super("PlayerCount")
    }

    create() {
        this.buildPlayerCountButtons()
    }

    buildPlayerCountButtons() {
        const {width, height} = this.scale

        this.onePlayer = this.makeButton(width * 0.5, height * 0.44, '1 Player', () => this.startGame(1))
        this.twoPlayer = this.makeButton(width * 0.5, height * 0.54, '2 Players', () => this.startGame(2))
    }


    makeButton(x, y, label, onClick) {
        const btn = this.add.text(x, y, label, {
            fontFamily: 'Arial',
            fontSize: '26px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { left: 18, right: 18, top: 10, bottom: 10 }
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

    startGame(playerCount) {
        this.scene.start("RoundSystem", {PlayerCount: playerCount})
    }
}




