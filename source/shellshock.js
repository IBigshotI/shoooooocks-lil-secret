
(function () {
    let originalReplace = String.prototype.replace;

    String.prototype.originalReplace = function() {
        return originalReplace.apply(this, arguments);
    };

    let enableESP = true;
    document.addEventListener('keydown', function(event) {
        if (event.key === 'v' || event.key === 'V') {
            enableESP = !enableESP;
            // Communicate with Python server to toggle ESP visibility
            fetch(`http://localhost:8080/${enableESP ? 'show_esp' : 'hide_esp'}`)
                .then(response => response.text())
                .then(data => console.log(data))
                .catch(error => console.error('Error:', error));
        }
    });

    // Credit for script injection code: AI. ChatGPT prompt: "tampermonkey script. how can i make it grab a javascript file as it's loaded. if it detects the javascript file, make it apply modifications to it via regex? using XMLHttpRequest"
    // Credit for idea to use XMLHttpRequest: A3+++
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRGetResponse = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response');
    let shellshockjs;
    XMLHttpRequest.prototype.open = function(...args) {
        const url = args[1];
        if (url && url.includes("js/shellshock.js")) {
            shellshockjs = this;
        }
        originalXHROpen.apply(this, args);
    };
    Object.defineProperty(XMLHttpRequest.prototype, 'response', {
        get: function() {
            if (this === shellshockjs) {
                return applyLibertyMutual(originalXHRGetResponse.get.call(this));
            }
            return originalXHRGetResponse.get.call(this);
        }
    });

    // VAR STUFF
    let F = [];
    let H = {};
    let functionNames = [];
    let ESPArray = [];

    // scrambled... geddit????
    const getScrambled = function() { return Array.from({length: 10}, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('') }
    const createAnonFunction = function(name, func) {
        const funcName = getScrambled();
        window[funcName] = func;
        F[name] = window[funcName];
        functionNames[name] = funcName;
    };
    const findKeyWithProperty = function(obj, propertyToFind) {
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
    const fetchTextContent = function(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false); // Make the request synchronous
        xhr.send();
        if (xhr.status === 200) {
            return xhr.responseText;
        } else {
            console.error("Error fetching text content. Status:", xhr.status);
            return null;
        }
    };

    const applyLibertyMutual = function(js) {

        let hash = CryptoJS.SHA256(js).toString(CryptoJS.enc.Hex);
        let clientKeys;
        let onlineClientKeys = fetchTextContent("https://raw.githubusercontent.com/StateFarmNetwork/client-keys/main/libertymutual_" + hash + ".json"); // credit: me :D
        clientKeys = JSON.parse(onlineClientKeys);

        H = clientKeys.vars;

        let injectionString = "";

        const modifyJS = function(find, replace) {
            let oldJS = js;
            js = js.originalReplace(find, replace);
            if (oldJS !== js) {
                console.log("%cReplacement successful! Injected code: " + replace, 'color: green; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
            } else {
                console.log("%cReplacement failed! Attempted to replace " + find + " with: " + replace, 'color: red; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
            }
        };
        const variableNameRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
        for (let name in H) {
            let deobf = H[name];
            if (variableNameRegex.test(deobf)) {
                injectionString = `${injectionString}${name}: (() => { try { return ${deobf}; } catch (error) { return "value_undefined"; } })(),`;
            } else {
                alert("Message from the LibertyMutual Devs: WARNING! The keys inputted contain non-variable characters! There is a possibility that this could run code unintended by the LibertyMutual team, although possibly there is also a mistake. Do NOT proceed with using this, and report to the LibertyMutual developers what is printed in the console.");
                console.log("REPORT THIS IN THE DISCORD SERVER:", clientKeys);
                const crashplease = "balls";
                crashplease = "balls2";
            }
        }
        console.log(injectionString);
        modifyJS(H.SCENE + '.render', `window["${functionNames.retrieveFunctions}"]({${injectionString}},true)||${H.SCENE}.render`);
        modifyJS(`{if(${H.CULL})`, `{if(true)`);
        modifyJS("Not playing in iframe", "LIBERTYMUTUAL ACTIVE!");
        // console.log(js);
        console.log(H);
        return js;
    };

    createAnonFunction("retrieveFunctions", function(vars) { ss = vars; F.LIBERTYMUTUAL() });

    createAnonFunction("LIBERTYMUTUAL", function() {
        // globalSS = ss;

        ss.PLAYERS.forEach(PLAYER => {
            if (PLAYER.hasOwnProperty("ws")) {
                ss.MYPLAYER = PLAYER;
            }
        });

        H.actor = findKeyWithProperty(ss.MYPLAYER, H.mesh);

        const timecode = Date.now();
        let minValue = 99999;
        let playerData = [];  // Array to store ESP line positions

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