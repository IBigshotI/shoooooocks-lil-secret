(function () {
    let enableESP = true;
    document.addEventListener('keydown', function (event) {
        if (event.key === 'v' || event.key === 'V') {
            enableESP = !enableESP;
        }
    });
    let F = [];
    let H = {
        "PLAYERS": "Nn",
        "playing": "WY",
        "mesh": "k",
        "yaw": "lY",
        "pitch": "hY",
        "x": "xY",
        "y": "$Y",
        "z": "jY",
        "SCENE": "An",
        "CULL": "Ee"
    };
    let functionNames = [];
    let ESPArray = [];

    const getScrambled = function () { return Array.from({ length: 10 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('') }
    const createAnonFunction = function (name, func) {
        const funcName = getScrambled();
        window[funcName] = func;
        F[name] = window[funcName];
        functionNames[name] = funcName;
    };
    const findKeyWithProperty = function (obj, propertyToFind) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (key === propertyToFind) {
                    return [key];
                } else if (
                    typeof obj[key] === 'object' &&
                    obj[key] !== null &&
                    obj[key].hasOwnProperty(propertyToFind)
                ) {
                    return key;
                }
            }
        }
        // Property not found
        return null;
    };
    window.zlffufiisj = function (vars) { ss = vars; F.LIBERTYMUTUAL() };
    window.sremlhxwxu = function () {
        // globalSS = ss;

        ss.PLAYERS.forEach(PLAYER => {
            if (PLAYER.hasOwnProperty("ws")) {
                ss.MYPLAYER = PLAYER;
            }
        });

        H.actor = findKeyWithProperty(ss.MYPLAYER, H.mesh);

        const timecode = Date.now();
        let minValue = 99999;
        let playerData = []; // Array to store ESP line positions

        ss.PLAYERS.forEach(PLAYER => {
            if (PLAYER) {
                PLAYER.timecode = timecode;
                // Partial credit for enemy player filtering: PacyTense. Also just common sense.
                if ((PLAYER !== ss.MYPLAYER) && ((ss.MYPLAYER.team == 0) || (PLAYER.team !== ss.MYPLAYER.team))) {
                    // ESP CODE
                    if ((!PLAYER.generatedESP)) {
                        // Credit for box from lines code: AI. ChatGPT prompt: "how can I create a box out of lines in babylon.js?"
                        // ESP BOXES
                        const boxSize = { width: 0.4, height: 0.65, depth: 0.4 };
                        const vertices = [
                            new BABYLON.Vector3(-boxSize.width / 2, 0, -boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, 0, -boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, 0 + boxSize.height, -boxSize.depth / 2),
                            new BABYLON.Vector3(-boxSize.width / 2, 0 + boxSize.height, -boxSize.depth / 2),
                            new BABYLON.Vector3(-boxSize.width / 2, 0, boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, 0, boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, 0 + boxSize.height, boxSize.depth / 2),
                            new BABYLON.Vector3(-boxSize.width / 2, 0 + boxSize.height, boxSize.depth / 2),
                        ];
                        const lines = [];
                        for (let i = 0; i < 4; i++) {
                            lines.push([vertices[i], vertices[(i + 1) % 4]]);
                            lines.push([vertices[i + 4], vertices[(i + 1) % 4 + 4]]);
                            lines.push([vertices[i], vertices[i + 4]]);
                        }
                        const box = BABYLON.MeshBuilder.CreateLineSystem(getScrambled(), { lines }, PLAYER[H.actor].scene);
                        // ChatGPT prompt: "how can I make an object anchored to another object, change its color, and have it render on top of everything else? babylon.js"
                        box.color = new BABYLON.Color3(1, 1, 1);
                        box.renderingGroupId = 1;
                        box.parent = PLAYER[H.actor][H.mesh];

                        PLAYER.box = box;
                        PLAYER.generatedESP = true;
                        ESPArray.push([box, , PLAYER]);

                        // Collect ESP line data
                        playerData.push({
                            id: PLAYER.id,
                            lines: lines.map(line => ({
                                start: { x: line[0].x, y: line[0].y, z: line[0].z },
                                end: { x: line[1].x, y: line[1].y, z: line[1].z }
                            }))
                        });
                    }
                    // Update the lines
                    PLAYER.box.visibility = enableESP;
                }
            }
        });

        for (let i = 0; i < ESPArray.length; i++) {
            if (ESPArray[i][2] && ESPArray[i][2].timecode == timecode) { // still exists
            } else {
                // Credit for info: AI. ChatGPT prompt: "how can I delete an object in babylon.js?"
                ESPArray[i][0].dispose();
                if (ESPArray[i][1]) {
                    ESPArray[i][1].dispose();
                }
                ESPArray.splice(i, 1);
            }
        }
    };
    createAnonFunction("retrieveFunctions", function (vars) { ss = vars; window.ovkuyuymzk() });

    createAnonFunction("LIBERTYMUTUAL", function () {
        // globalSS = ss;

        ss.PLAYERS.forEach(PLAYER => {
            if (PLAYER.hasOwnProperty("ws")) {
                ss.MYPLAYER = PLAYER;
            }
        });

        H.actor = findKeyWithProperty(ss.MYPLAYER, H.mesh);

        const timecode = Date.now();
        let minValue = 99999;
        let playerData = []; // Array to store ESP line positions

        ss.PLAYERS.forEach(PLAYER => {
            if (PLAYER) {
                PLAYER.timecode = timecode;
                // Partial credit for enemy player filtering: PacyTense. Also just common sense.
                if ((PLAYER !== ss.MYPLAYER) && ((ss.MYPLAYER.team == 0) || (PLAYER.team !== ss.MYPLAYER.team))) {
                    // ESP CODE
                    if ((!PLAYER.generatedESP)) {
                        // Credit for box from lines code: AI. ChatGPT prompt: "how can I create a box out of lines in babylon.js?"
                        // ESP BOXES
                        const boxSize = { width: 0.4, height: 0.65, depth: 0.4 };
                        const vertices = [
                            new BABYLON.Vector3(-boxSize.width / 2, 0, -boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, 0, -boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, 0 + boxSize.height, -boxSize.depth / 2),
                            new BABYLON.Vector3(-boxSize.width / 2, 0 + boxSize.height, -boxSize.depth / 2),
                            new BABYLON.Vector3(-boxSize.width / 2, 0, boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, 0, boxSize.depth / 2),
                            new BABYLON.Vector3(boxSize.width / 2, 0 + boxSize.height, boxSize.depth / 2),
                            new BABYLON.Vector3(-boxSize.width / 2, 0 + boxSize.height, boxSize.depth / 2),
                        ];
                        const lines = [];
                        for (let i = 0; i < 4; i++) {
                            lines.push([vertices[i], vertices[(i + 1) % 4]]);
                            lines.push([vertices[i + 4], vertices[(i + 1) % 4 + 4]]);
                            lines.push([vertices[i], vertices[i + 4]]);
                        }
                        const box = BABYLON.MeshBuilder.CreateLineSystem(getScrambled(), { lines }, PLAYER[H.actor].scene);
                        // ChatGPT prompt: "how can I make an object anchored to another object, change its color, and have it render on top of everything else? babylon.js"
                        box.color = new BABYLON.Color3(1, 1, 1);
                        box.renderingGroupId = 1;
                        box.parent = PLAYER[H.actor][H.mesh];

                        PLAYER.box = box;
                        PLAYER.generatedESP = true;
                        ESPArray.push([box, , PLAYER]);

                        // Collect ESP line data
                        playerData.push({
                            id: PLAYER.id,
                            lines: lines.map(line => ({
                                start: { x: line[0].x, y: line[0].y, z: line[0].z },
                                end: { x: line[1].x, y: line[1].y, z: line[1].z }
                            }))
                        });
                    }
                    // Update the lines
                    PLAYER.box.visibility = enableESP;
                }
            }
        });

        for (let i = 0; i < ESPArray.length; i++) {
            if (ESPArray[i][2] && ESPArray[i][2].timecode == timecode) { // still exists
            } else {
                // Credit for info: AI. ChatGPT prompt: "how can I delete an object in babylon.js?"
                ESPArray[i][0].dispose();
                if (ESPArray[i][1]) {
                    ESPArray[i][1].dispose();
                }
                ESPArray.splice(i, 1);
            }
        }
    });
})();