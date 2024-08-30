(function () {
    let enableESP = true;
    let ESPArray = [];

    // Utility function to scramble function names
    const getScrambled = function () { 
        return Array.from({ length: 10 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    };

    // Set up a key listener to toggle ESP
    document.addEventListener('keydown', function (event) {
        if (event.key === 'v' || event.key === 'V') {
            enableESP = !enableESP;
            console.log(`ESP toggled: ${enableESP}`);
        }
    });

    // Main function to initialize ESP boxes
    function initESP() {
        if (!window.BABYLON || !window.ss || !window.ss.PLAYERS) {
            console.warn('ESP initialization failed: Required objects are not loaded yet.');
            return;
        }

        const timecode = Date.now();

        // Iterate over players to draw ESP boxes
        window.ss.PLAYERS.forEach(PLAYER => {
            if (PLAYER && PLAYER.hasOwnProperty("ws")) {
                // Mark the current player as MYPLAYER
                if (PLAYER === window.ss.MYPLAYER) {
                    window.ss.MYPLAYER = PLAYER;
                }

                // Only draw ESP for other players
                if (PLAYER !== window.ss.MYPLAYER && (window.ss.MYPLAYER.team === 0 || PLAYER.team !== window.ss.MYPLAYER.team)) {
                    // Check if ESP is already generated
                    if (!PLAYER.generatedESP) {
                        const boxSize = { width: 0.4, height: 0.65, depth: 0.4 };
                        const vertices = [
                            new BABYLON.Vector3(-boxSize.width / 2, 0, -boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, 0, -boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, boxSize.height, -boxSize.depth / 2),
                            new BABYLON.Vector3(-boxSize.width / 2, boxSize.height, -boxSize.depth / 2),
                            new BABYLON.Vector3(-boxSize.width / 2, 0, boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, 0, boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, boxSize.height, boxSize.depth / 2),
                            new BABYLON.Vector3(-boxSize.width / 2, boxSize.height, boxSize.depth / 2),
                        ];
                        const lines = [];
                        for (let i = 0; i < 4; i++) {
                            lines.push([vertices[i], vertices[(i + 1) % 4]]);
                            lines.push([vertices[i + 4], vertices[(i + 1) % 4 + 4]]);
                            lines.push([vertices[i], vertices[i + 4]]);
                        }
                        // Create a box using lines
                        const box = BABYLON.MeshBuilder.CreateLineSystem(getScrambled(), { lines }, PLAYER.actor.scene);
                        box.color = new BABYLON.Color3(1, 1, 1);
                        box.renderingGroupId = 1;
                        box.parent = PLAYER.actor.mesh;
                        PLAYER.box = box;
                        PLAYER.generatedESP = true;
                        ESPArray.push(box);
                    }
                    // Toggle visibility based on ESP state
                    if (PLAYER.box) {
                        PLAYER.box.visibility = enableESP;
                    }
                }
            }
        });

        // Clean up ESP for players that no longer exist
        ESPArray = ESPArray.filter(box => {
            if (!box || !box.parent || !box.parent.player || box.parent.player.timecode !== timecode) {
                box.dispose();
                return false;
            }
            return true;
        });
    }

    // Run ESP initialization periodically to keep it updated
    setInterval(initESP, 1000);

    console.log('ESP script initialized.');
})();