;(async function() {
    let y = new Map();
    Array.prototype.push = new Proxy(Array.prototype.push, {
        apply(func, that, args) {
            if (typeof args[0]?.player?.id !== 'undefined') {
                const player = args[0].player
                y.set(player.uniqueId, player)
            }
            return Reflect.apply(...arguments)
        },
    })
    let teamColors = {
        0: '#FFFFFF',
        1: '#00AEEF',
        2: '#FF3B3F'
    };
    let gamemode = {
        0: 'Free for all',
        1: 'Teams',
        2: 'Capture the Spatula',
        3: 'King of the Coop',
    };
    async function downloadStatsImage() {
        let canvas = document.createElement('canvas');
        canvas.id = "statsImage"
        canvas.width = 1920;
        canvas.height = 1080 + (y.size*20);
        let context = canvas.getContext('2d');
        let gamemode_name = gamemode[extern.gameType]
        let date = new Date();
        let background = new Image();
        background.crossOrigin = "anonymous";
        const mapNameElement = document.querySelector("#serverAndMapInfo > p:nth-child(2)");
        const mapName = mapNameElement.innerHTML.trim();
        const formattedMapName = mapName.replace(/\s+/g, '');
        const mapNameCorrect = formattedMapName.charAt(0).toLowerCase() + formattedMapName.slice(1);
        const backgroundUrl = "https://raw.githubusercontent.com/IBigshotI/shoooooocks-lil-secret/main/statsmod/imges/mapImages/" + mapNameCorrect + ".png";
        background.src = backgroundUrl;
        ;
        await new Promise((resolve) => {
            context.filter = "blur(10px)";
            background.onload = function() {
                context.drawImage(background, 0, 0, 2560, 1440);
                resolve();
            };
        });
        context.filter = "none";
        context.font = 'bold 40px Arial';
        let header = new Image();
        header.crossOrigin = "anonymous";
        const headerUrl = "https://cdn.discordapp.com/attachments/1089992699295301642/1102933225023741983/heading.png";
        header.src = headerUrl;
        await new Promise((resolve) => {
            header.onload = function() {
                context.drawImage(header, 38, 10);
                resolve();
            };
        });
        let sortedPlayers = getSortedPlayers();
        let index = 1;
        let imgindex = 0;
        let currentTeam = null;
        let imgPromises = [];
        let bIndex = 0;
        for (const player of sortedPlayers) {
            if (player.team !== currentTeam) {
                currentTeam = player.team;
                imgindex++;
            }
            if (player.team === 1) {
                let blueBg = new Image();
                blueBg.crossOrigin = "anonymous";
                const blueUrl = "https://cdn.discordapp.com/attachments/1089992699295301642/1102933149681463397/blue_player_bg.png";
                blueBg.src = blueUrl;
                await new Promise((resolve) => {
                    blueBg.onload = function() {
                        context.drawImage(blueBg, 17, 80 + (bIndex * 80));
                        resolve();
                    };
                });
                bIndex++
            }else if (player.team === 2){
                let redBg = new Image();
                redBg.crossOrigin = "anonymous";
                const redUrl = "https://cdn.discordapp.com/attachments/1089992699295301642/1102933129217454130/red_player_bg.png";
                redBg.src = redUrl;
                await new Promise((resolve) => {
                    redBg.onload = function() {
                        context.drawImage(redBg, 17, 80 + (bIndex * 80));
                        resolve();
                    };
                });
                bIndex++
            }
            imgindex++;
        }
        for (const player of sortedPlayers) {
            if (player.team !== currentTeam) {
                currentTeam = player.team;
            }
            let img = new Image();
            img.crossOrigin = "anonymous";
            const url = "https://raw.githubusercontent.com/IBigshotI/shoooooocks-lil-secret/main/weapons/" + player.primaryWeaponItem.category_name + "/" + player.primaryWeaponItem.name + ".png";
            const formattedUrl = url.replace(/ /g, "%20");
            img.src = formattedUrl
            await new Promise((resolve) => {
                img.onload = function() {
                    context.drawImage(img, 1000, 0 + (index * 80), 80, 80);
                    resolve();
                };
            });
            context.fillStyle = '#FFFFFF';
            context.fillText(player.name, 50, 50 + (index * 80));
            context.fillText(player.totalKills, 500, 50 + (index * 80));
            context.fillText(player.totalDeaths, 700, 50 + (index * 80));
            context.fillText((player.totalKills / Math.max(player.totalDeaths, 1)).toFixed(2), 850, 50 + (index * 80));
            index++;
        }
        let lines = new Image();
        lines.crossOrigin = "anonymous";
        lines.src = "https://cdn.discordapp.com/attachments/1089992699295301642/1103318529962426419/lines.png";
        await new Promise((resolve) => {
            lines.onload = function() {
                context.drawImage(lines, 610, 80, 190, 0 + (index * 74));
                resolve();
            };
        });
        if (gamemode_name === "King of the Coop") {
            let red_score = document.getElementById("captureScoreRed").innerHTML;
            let blue_score = document.getElementById("captureScoreBlue").innerHTML;
            context.font = 'bold 50px LEMONMILK';
            let kotcImg = new Image();
            kotcImg.crossOrigin = "anonymous";
            kotcImg.src = "https://cdn.discordapp.com/attachments/1089992699295301642/1104407080036732978/kotcScore.png";
            await new Promise((resolve) => {
                kotcImg.onload = function() {
                    context.drawImage(kotcImg, 1200, 50 + (index * 30));
                    resolve();
                };
            });
            context.fillText(blue_score, 1380, 145 + (index * 30));
            context.fillText(red_score, 1550, 145 + (index * 30));
        }
        context.fillStyle = '#FFFF00';
        context.font = 'bold 20px Arial';
        context.fillText('This mod was created by IBigshotI and credits to Pana and Hazard', 10, 70 + (index * 80));
        const delay = ms => new Promise(res => setTimeout(res, 1000));
        document.body.appendChild(canvas)
    }
    function resetStats() {
        y.forEach((player, playerId) => {
            player.totalKills = 0;
            player.totalDeaths = 0;
        });
    }
    function updateSortMethod(sortMethod) {
        localStorage.setItem("sortMethod", sortMethod.value)
    }
    function getSortedPlayers() {
        let sortMethod = document.querySelector("body > select");
        let sortedPlayers = [...y.values()];
        let playersByTeam = new Map();
        sortedPlayers.forEach(player => {
            if (!playersByTeam.has(player.team)) {
                playersByTeam.set(player.team, []);
            }
            playersByTeam.get(player.team).push(player);
        });
        playersByTeam.forEach(teamPlayers => {
            switch (sortMethod.value) {
                case 'name':
                    teamPlayers.sort((player1, player2) => player1.name.localeCompare(player2.name));
                    break;
                case 'kills':
                    teamPlayers.sort((player1, player2) => player2.totalKills - player1.totalKills);
                    break;
                case 'kdr':
                    teamPlayers.sort((player1, player2) => (player2.totalKills / Math.max(player2.totalDeaths, 1)) - (player1.totalKills / Math.max(player1.totalDeaths, 1)));
                    break;
                case 'impact':
                    console.log('to be done (impact)')
                    alert('doesnt sort yet! we are on it...')
            }
        });
        sortedPlayers = [];
        playersByTeam.forEach(teamPlayers => {
            sortedPlayers.push(...teamPlayers);
        });
        return sortedPlayers;
    }
    let downloadButton = document.createElement('button');
    downloadButton.innerHTML = 'Download Stats Image';
    downloadButton.id = "DownloadButton"
    downloadButton.className = 'ss_button btn_med btn_green bevel_green';
    downloadButton.style.position = 'absolute';
    downloadButton.style.top = '52vh';
    downloadButton.style.left = '10px';
    downloadButton.style.zIndex = '5';
    downloadButton.addEventListener('click', downloadStatsImage);
    document.body.appendChild(downloadButton);
    let resetButton = document.createElement('button');
    resetButton.innerHTML = 'Reset Stats';
    resetButton.style.position = 'absolute';
    resetButton.style.top = '57vh';
    resetButton.style.left = '10px';
    resetButton.style.zIndex = '5';
    resetButton.classList.add('ss_button', 'btn_red', 'bevel_red');
    resetButton.addEventListener('click', resetStats);
    document.body.appendChild(resetButton);
    let sortMethodSelect = document.createElement('select');
    sortMethodSelect.style.position = 'absolute';
    sortMethodSelect.style.top = '62vh';
    sortMethodSelect.style.left = '10px';
    sortMethodSelect.classList.add('ss_select', 'ss_marginright_sm');
    sortMethodSelect.style.zIndex = '5';
    let sortMethodNames = ['Sort by name', 'Sort by kills', 'Sort by KDR', 'Sort by Impact'];
    let sortMethodValues = ['name', 'kills', 'kdr', 'impact'];

    for (let i = 0; i < sortMethodNames.length; i++) {
        let option = document.createElement('option');
        option.value = sortMethodValues[i];
        option.text = sortMethodNames[i];
        if (option.value === localStorage.getItem("sortMethod")) {
            option.selected = true;
        }
        sortMethodSelect.appendChild(option);
    }
    sortMethodSelect.addEventListener('change', function() {
        let sortMethod = document.querySelector("body > select");
        updateSortMethod(sortMethod)
    });
    const storedSortMethod = localStorage.getItem('sortMethod');
    document.body.appendChild(sortMethodSelect);
    document.addEventListener("keydown", function (e) {
        if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
            var button1 = document.querySelector("body > button.ss_button.btn_med.btn_green.bevel_green");
            var button2 = document.querySelector("body > button.ss_button.btn_red.bevel_red");
            var selector = document.querySelector("body > select");
            if (button1.style.display !== "none") {
                button1.style.display = "none";
            } else {
                button1.style.display = "block";
            }
            if (button2.style.display !== "none") {
                button2.style.display = "none";
            } else {
                button2.style.display = "block";
            }
            if (selector.style.display !== "none") {
                selector.style.display = "none";
            } else {
                selector.style.display = "block";
            }
        }
    });
    const checkIfInGame = setInterval(function(){
        if (extern.inGame === false){
            y.clear()
        }
    }, 1000);
})();
