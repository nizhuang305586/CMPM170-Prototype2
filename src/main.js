const config = {
    type: Phaser.AUTO,
    parent: "phaser-game",
    width: 1260,
    height: 640,
    backgroundColor: "#333333",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Load, PlayerCount, RoundSystem]
};

const game = new Phaser.Game(config);