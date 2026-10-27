const config = {
    type: Phaser.AUTO,
    parent: "phaser-game",
    width: 960,
    height: 640,
    backgroundColor: "#333333",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [GridScene]
};

const game = new Phaser.Game(config);