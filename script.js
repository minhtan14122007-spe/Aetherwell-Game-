(function() {
    // --- CONSTANTS AND GAME DATA ---
    const MAX_HP = 20; 
    const MAX_MANA = 3; 
    const BASE_DAMAGE = 5;
    const RECOIL_DAMAGE = 5;
    const TOTAL_PLAYERS = 7; 
    const ANIMATION_DURATION = 500; // 0.5 giây cho hiệu ứng chiến đấu

    // MAPPING LOẠI RUNG MÀN HÌNH THEO TỘC
    const raceShakeTypes = {
        "Viking": "shake-heavy", 
        "Dragon": "shake-intense", 
        "Samurai": "shake-intense", 
        "Spartan": "shake-heavy", 
        "Amazon": "shake-intense", 
        "Pharaoh": "shake-subtle", 
        "Elf": "shake-subtle" 
    };

    // Dữ liệu Tộc (Race Data)
    const raceDataMap = new Map([
        ["Viking", { name: "Viking Kingdom", id: "Viking", image: "images/viking_kingdom.png.jpg", skill: "Style Mastery", color: "#6A5ACD", ultimate: { damage: 10, effect: 'SkipTurn', target: 'opponent', cost: 3, text: "Stun (Skip Next Turn) an opponent!" } }],
        ["Dragon", { name: "Dragon Temple Knights", id: "Dragon", image: "images/dragon_knights.png.jpg", skill: "Clean Care", color: "#FF4500", ultimate: { damage: 0, effect: 'Heal', value: 10, target: 'self', cost: 3, text: "Heal 10 HP for self." } }],
        ["Samurai", { name: "Samurai Clan", id: "Samurai", image: "images/samurai_clan.png.jpg", skill: "Much/Many Focus", color: "#B22222", ultimate: { damage: 20, effect: 'None', target: 'opponent', cost: 3, text: "Deal double damage (20 DMG) to an opponent!" } }],
        ["Spartan", { name: "Spartan Feast Legion", id: "Spartan", image: "images/spartan_legion.png.jpg", skill: "Someone/No one HIT", color: "#DAA520", ultimate: { damage: 0, effect: 'Block', value: 5, target: 'self', cost: 2, text: "Gain 5 HP Shield for the next turn." } }], 
        ["Amazon", { name: "Amazon Forest Tribe", id: "Amazon", image: "images/amazon_tribe.png.jpg", skill: "Food Type", color: "#228B22", ultimate: { damage: 0, effect: 'Immune', target: 'self', cost: 2, text: "Immune to damage for 1 turn." } }], 
        ["Pharaoh", { name: "Pharaoh Dynasty", id: "Pharaoh", image: "images/pharaoh_dynasty.png.jpg", skill: "Food Quality", color: "#FFD700", ultimate: { damage: 0, effect: 'SkillLock', target: 'opponent', cost: 2, text: "Lock opponent's Ultimate Skill next turn." } }], 
        ["Elf", { name: "Elf Light Kingdom", id: "Elf", image: "images/elf_kingdom.png.jpg", skill: "Used To Mastery", color: "#ADD8E6", ultimate: { damage: 0, effect: 'ExtraTurn', target: 'self', cost: 3, text: "Gain 1 extra turn (Immediate)." } }] 
    ]);
    const races = Array.from(raceDataMap.values());

    // Question Data (40 CÂU HỎI ĐÃ CẬP NHẬT)
    const questions = [
        // 1. VIKING KINGDOM (6 CÂU - Style Mastery: Personal Care & Appearance)
        { team: "VIKING KINGDOM", question: " What do people usually get when they want their nails cleaned and shaped?", correctAnswer: "A manicure / pedicure", skill: "Style Mastery" },
        { team: "VIKING KINGDOM", question: " What personal care product do you use to wash your hair?", correctAnswer: "Shampoo", skill: "Style Mastery" },
        { team: "VIKING KINGDOM", question: " Which service do you need if you want someone to wash, cut, and style your hair?", correctAnswer: "A haircut", skill: "Style Mastery" },
        { team: "VIKING KINGDOM", question: " What service do you get if you want your face cleaned and treated at a salon?", correctAnswer: "A facial", skill: "Style Mastery" },
        { team: "VIKING KINGDOM", question: " What personal care product helps keep your hair in place?", correctAnswer: "Hairspray / Hair gel", skill: "Style Mastery" },
        { team: "VIKING KINGDOM", question: " What product do you use to keep your skin from becoming dry?", correctAnswer: "Lotion", skill: "Style Mastery" },

        // 2. DRAGON TEMPLE KNIGHTS (6 CÂU - Clean Care: Personal Care & Hygiene)
        { team: "DRAGON TEMPLE KNIGHTS", question: " What product helps prevent body odor?", correctAnswer: "Deodorant", skill: "Clean Care" },
        { team: "DRAGON TEMPLE KNIGHTS", question: " What do people use to keep their breath fresh?", correctAnswer: "Mouthwash", skill: "Clean Care" },
        { team: "DRAGON TEMPLE KNIGHTS", question: " What item do you use to remove food stuck between your teeth?", correctAnswer: "Dental floss", skill: "Clean Care" },
        { team: "DRAGON TEMPLE KNIGHTS", question: " What do you call the service where someone gives you a relaxing body treatment?", correctAnswer: "A massage", skill: "Clean Care" },
        { team: "DRAGON TEMPLE KNIGHTS", question: " What product helps your skin retain moisture?", correctAnswer: "Moisturizer", skill: "Clean Care" },
        { team: "DRAGON TEMPLE KNIGHTS", question: " What word describes the way food tastes (sweet, salty, spicy)?", correctAnswer: "Flavor / Taste", skill: "Clean Care" },

        // 3. SAMURAI CLAN (6 CÂU - Much/Many Focus: Grammar Quantifiers)
        { team: "SAMURAI CLAN", question: " Fill in the blank: “I don’t have _______ shampoo.”", correctAnswer: "much", skill: "Much/Many Focus" },
        { team: "SAMURAI CLAN", question: " Fill in the blank: “There aren’t _______ towels left.”", correctAnswer: "many", skill: "Much/Many Focus" },
        { team: "SAMURAI CLAN", question: " Fill in the blank: “I need _______ hair gel. Do you have any?”", correctAnswer: "some", skill: "Much/Many Focus" },
        { team: "SAMURAI CLAN", question: " Correct sentence: “There is _______ of lotion.”", correctAnswer: "a lot", skill: "Much/Many Focus" },
        { team: "SAMURAI CLAN", question: " Fill in the blank: “Do you need _______ help?”", correctAnswer: "any", skill: "Much/Many Focus" },
        { team: "SAMURAI CLAN", question: " Correct sentence: “_______ you eat breakfast?”", correctAnswer: "Don’t", skill: "Much/Many Focus" },

        // 4. SPARTAN FEAST LEGION (5 CÂU - Someone/No one HIT: Grammar Indefinite Pronouns)
        { team: "SPARTAN FEAST LEGION", question: " Fill in the blank: “I saw _______ at the salon.", correctAnswer: "someone", skill: "Someone/No one HIT" },
        { team: "SPARTAN FEAST LEGION", question: " Fill in the blank: “I didn’t see _______ in the store.”", correctAnswer: "anyone", skill: "Someone/No one HIT" },
        { team: "SPARTAN FEAST LEGION", question: " Fill in the blank: “Is _______ going to the spa today?”", correctAnswer: "anyone", skill: "Someone/No one HIT" },
        { team: "SPARTAN FEAST LEGION", question: " Fill in the blank: “There’s _______ wrong with my haircut.”", correctAnswer: "something", skill: "Someone/No one HIT" },
        { team: "SPARTAN FEAST LEGION", question: " Correct sentence: “_______ wants a haircut today.”", correctAnswer: "No one", skill: "Someone/No one HIT" },

        // 5. AMAZON FOREST TRIBE (6 CÂU - Food Type: Eating Well Vocabulary)
        { team: "AMAZON FOREST TRIBE", question: " What is the term for a person who doesn’t eat meat?", correctAnswer: "Vegetarian", skill: "Food Type" },
        { team: "AMAZON FOREST TRIBE", question: " Which word describes food containing no animal products?", correctAnswer: "Vegan", skill: "Food Type" },
        { team: "AMAZON FOREST TRIBE", question: " What do you call food grown without chemicals?", correctAnswer: "Organic food", skill: "Food Type" },
        { team: "AMAZON FOREST TRIBE", question: " What word describes food that is high in sugar and fat and not healthy?", correctAnswer: "Junk food / Unhealthy food", skill: "Food Type" },
        { team: "AMAZON FOREST TRIBE", question: " What do you call food that is cooked using a lot of oil?", correctAnswer: "Fried food", skill: "Food Type" },
        { team: "AMAZON FOREST TRIBE", question: " What do you call easy but unhealthy food like pizza or hamburgers?", correctAnswer: "Fast food", skill: "Food Type" },

        // 6. PHARAOH DYNASTY (6 CÂU - Food Quality: Eating Well Vocabulary)
        { team: "PHARAOH DYNASTY", question: " What is the term for food that is fresh and not processed?", correctAnswer: "Organic / Natural / Fresh", skill: "Food Quality" },
        { team: "PHARAOH DYNASTY", question: " What word describes food with a lot of vitamins and minerals?", correctAnswer: "Nutritious", skill: "Food Quality" },
        { team: "PHARAOH DYNASTY", question: " What adjective describes food that is low in fat and good for your body?", correctAnswer: "Healthy / Low-fat", skill: "Food Quality" },
        { team: "PHARAOH DYNASTY", question: " What is the term for food that is fresh and not processed?", correctAnswer: "Fresh", skill: "Food Quality" },
        { team: "PHARAOH DYNASTY", question: " What do you call food that is natural and grown without chemicals?", correctAnswer: "Organic / Natural", skill: "Food Quality" },
        { team: "PHARAOH DYNASTY", question: " Fill in the blank: “He didn’t use to drink coffee, _______ he?”", correctAnswer: "did", skill: "Food Quality" },

        // 7. ELF LIGHT KINGDOM (5 CÂU - Used To Mastery: Grammar Used To)
        { team: "ELF LIGHT KINGDOM", question: " Fill in the blank: “She _______ exercise every day, but now she does.”", correctAnswer: "used to", skill: "Used To Mastery" },
        { team: "ELF LIGHT KINGDOM", question: " Fill in the blank: “I _______ eat vegetables, but now I do.”", correctAnswer: "didn’t use to", skill: "Used To Mastery" },
        { team: "ELF LIGHT KINGDOM", question: " Fill in the blank: “_______ you use to eat fast food?”", correctAnswer: "Did", skill: "Used To Mastery" },
        { team: "ELF LIGHT KINGDOM", question: " Fill in the blank: “I used to eat junk food, but now I _______.”", correctAnswer: "don’t", skill: "Used To Mastery" },
        { team: "ELF LIGHT KINGDOM", question: " Correct sentence: “_______ she use to be vegetarian?”", correctAnswer: "Didn’t", skill: "Used To Mastery" },
    ];
    
    const allPossibleAnswers = Array.from(new Set(questions.map(q => q.correctAnswer).flat()));
    

    // --- DOM ELEMENTS ---
    const DOM = {};

    function getDOM() {
        const ids = ["race-selection", "quiz-screen", "game-over-screen", "race-grid", "race-info", "battle-arena", "turn-display", "round-display", "question-text", "answer-buttons", "next-btn", "effect-result", "winner-display", "restart-btn"];
        
        ids.forEach(id => {
            const element = document.getElementById(id);
            DOM[id.replace(/-/g, '')] = element; 
        });

        DOM.gameContainer = document.querySelector('.game-container'); 
        DOM.quizBox = document.querySelector('.quiz-box');
        
        // AUDIO ELEMENTS - ĐÃ CẬP NHẬT
        DOM.bgm = document.getElementById('background-music');
        DOM.sfxCorrect = document.getElementById('sfx-correct');
        DOM.sfxIncorrect = document.getElementById('sfx-incorrect');
        DOM.sfxClick = document.getElementById('sfx-click');
        DOM.championMusic = document.getElementById('champion-music'); // NHẠC CHIẾN THẮNG

        DOM.raceSelectionScreen = DOM.raceselection;
        DOM.quizScreen = DOM.quizscreen;
        DOM.gameOverScreen = DOM.gameoverscreen;
        DOM.nextButton = DOM.nextbtn;
        DOM.effectResultBox = DOM.effectresult;
        DOM.restartButton = DOM.restartbtn; 
    }

    // --- GLOBAL STATE ---
    let players = []; 
    let currentPlayerIndex = 0;
    let round = 1;
    let currentQuestionIndex = 0;
    let chosenRaces = []; 
    let isAnswerSelected = false; 
    let isUltimateUsed = false;

    // --- AUDIO CONTROL FUNCTIONS ---
    function playBGM() {
        if (DOM.bgm) {
            DOM.bgm.volume = 0.3; 
            DOM.bgm.play().catch(e => {});
        }
    }

    function stopBGM() {
        if (DOM.bgm) {
            DOM.bgm.pause();
            DOM.bgm.currentTime = 0;
        }
    }
    
    function playChampionMusic() {
        if (DOM.championMusic) {
            DOM.championMusic.volume = 0.8; 
            DOM.championMusic.play().catch(e => {});
        }
    }

    function playSFX(audioElement) {
        if (audioElement) {
            audioElement.currentTime = 0; 
            audioElement.volume = 0.7;
            audioElement.play().catch(e => console.error("SFX playback failed:", e));
        }
    }

    // --- UI FEEDBACK & ANIMATION FUNCTIONS ---

    function screenShake(shakeType) {
        if (DOM.gameContainer) {
            DOM.gameContainer.classList.remove('shake-intense', 'shake-heavy', 'shake-subtle');
            DOM.gameContainer.classList.add(shakeType);
            
            const duration = shakeType === 'shake-subtle' ? 400 : 300;
            setTimeout(() => {
                DOM.gameContainer.classList.remove(shakeType);
            }, duration);
        }
    }
    
    function createFlyingText(playerIndex, text, type) {
        const playerContainer = DOM.battlearena.querySelector(`.player-hp-container[data-player-id="${players[playerIndex].id}"]`);
        if (!playerContainer) return;

        const flyingText = document.createElement('div');
        flyingText.classList.add('flying-text', type);
        flyingText.textContent = text;
        
        playerContainer.appendChild(flyingText);

        setTimeout(() => {
            if (playerContainer.contains(flyingText)) {
                playerContainer.removeChild(flyingText);
            }
        }, 1200);
    }
    
    // ÁP DỤNG HIỆU ỨNG CHIẾN ĐẤU (Attacker Thrust, Target Knockback/Recoil)
    function applyCombatEffects(attackerId, targetId, effectType) {
        const attackerContainer = DOM.battlearena.querySelector(`.player-hp-container[data-player-id="${attackerId}"]`);
        const targetContainer = DOM.battlearena.querySelector(`.player-hp-container[data-player-id="${targetId}"]`);
        
        if (attackerContainer) {
            attackerContainer.classList.add('attacker-thrust');
            setTimeout(() => attackerContainer.classList.remove('attacker-thrust'), ANIMATION_DURATION);
        }
        
        if (targetContainer) {
            if (effectType === 'knockback') {
                 targetContainer.classList.add('target-knockback');
                 setTimeout(() => targetContainer.classList.remove('target-knockback'), ANIMATION_DURATION);
            } else if (effectType === 'recoil') {
                 targetContainer.classList.add('target-recoil');
                 setTimeout(() => targetContainer.classList.remove('target-recoil'), ANIMATION_DURATION);
            }
        }
    }

    // --- HELPER FUNCTIONS ---

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    function generateAnswers(correctAnswer) {
        let answers = [{ text: correctAnswer, correct: true }];
        let incorrectCandidates = allPossibleAnswers.filter(ans => ans !== correctAnswer);
        
        shuffleArray(incorrectCandidates);
        for (let i = 0; i < 3 && i < incorrectCandidates.length; i++) {
            if (!answers.some(a => a.text === incorrectCandidates[i])) {
                answers.push({ text: incorrectCandidates[i], correct: false });
            }
        }
        
        while (answers.length < 4) {
            const defaultText = `Answer ${answers.length + 1}`;
            if (!answers.some(a => a.text === defaultText)) {
                 answers.push({ text: defaultText, correct: false });
            } else {
                 answers.push({ text: `Answer X${answers.length + 1}`, correct: false });
            }
        }

        shuffleArray(answers);
        return answers;
    }

    function createPlayers(chosenRaceIds) {
        players = chosenRaceIds.map(raceId => {
            const race = raceDataMap.get(raceId);
            return {
                ...race, 
                hp: MAX_HP,
                maxHp: MAX_HP,
                mana: 0, 
                maxMana: MAX_MANA,
                score: 0,
                isEliminated: false,
                status: null,
                blockValue: 0, 
            };
        });
        shuffleArray(players); 
        currentPlayerIndex = 0;
    }


    // --- UI & DRAWING FUNCTIONS ---

    function drawRaceSelection() {
        if (DOM.raceinfo) {
             DOM.raceinfo.innerHTML = `PLAYER ${chosenRaces.length + 1}: CHOOSE YOUR LEGION! (${chosenRaces.length} / ${TOTAL_PLAYERS})`;
        }
        
        DOM.racegrid.innerHTML = '';
        
        races.forEach(race => {
            const isChosen = chosenRaces.includes(race.id);
            const card = document.createElement('div');
            card.classList.add('race-btn'); 
            
            card.style.setProperty('--race-color', race.color);
            
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('race-btn-image-container');
            imageContainer.style.backgroundImage = `url('${race.image}')`; 
            imageContainer.style.borderColor = race.color; 
            
            const nameElement = document.createElement('span');
            nameElement.classList.add('race-btn-name');
            nameElement.style.color = race.color;
            nameElement.textContent = race.name;

            card.appendChild(imageContainer); 
            card.appendChild(nameElement);

            if (isChosen) {
                card.classList.add('disabled'); 
                const overlay = document.createElement('div');
                overlay.classList.add('chosen-overlay');
                overlay.style.backgroundColor = `${race.color}c0`; 
                overlay.textContent = 'LOCKED';
                card.appendChild(overlay);
            } else {
                card.onclick = () => selectRace(race.id); 
            }

            DOM.racegrid.appendChild(card);
        });
    }

    function selectRace(raceId) {
        if (chosenRaces.includes(raceId)) return; 
        
        playSFX(DOM.sfxClick); 
        chosenRaces.push(raceId);
        
        const selectedRace = raceDataMap.get(raceId);
        
        if (DOM.raceinfo) {
             DOM.raceinfo.innerHTML = `<i class="fas fa-check-circle"></i> <span style="color: ${selectedRace.color}; font-weight: bold;">[${selectedRace.name}] SELECTED!</span> Ready for Player ${chosenRaces.length + 1}'s choice...`;
        }

        if (chosenRaces.length < TOTAL_PLAYERS) {
            requestAnimationFrame(drawRaceSelection); 
            
        } else {
            createPlayers(chosenRaces); 
            
            DOM.raceSelectionScreen.classList.remove('active');
            DOM.raceSelectionScreen.classList.add('hidden');
            DOM.quizScreen.classList.remove('hidden');
            
            startBattle(); 
        }
    }
    
    function drawHpBars(targetPlayerId = null) {
        DOM.battlearena.innerHTML = '';

        const currentPlayer = players[currentPlayerIndex];
        let playersToDraw = [];

        if (targetPlayerId) {
            const targetPlayer = players.find(p => p.id === targetPlayerId);
            if (targetPlayer) {
                playersToDraw = [currentPlayer, targetPlayer];
            } else {
                playersToDraw = [currentPlayer]; 
            }
        } else {
            playersToDraw = [currentPlayer]; 
            const otherPlayers = players.filter(p => p.id !== currentPlayer.id && !p.isEliminated);
            playersToDraw = [currentPlayer, ...otherPlayers]; 
        }

        playersToDraw = playersToDraw.filter(p => p.id === currentPlayer.id || !p.isEliminated || p.id === targetPlayerId);
        playersToDraw = [currentPlayer, ...playersToDraw.filter(p => p.id !== currentPlayer.id)];
        
        const isFocusMode = targetPlayerId || playersToDraw.length === 2;
        
        DOM.battlearena.classList.toggle('focus-mode', isFocusMode);
        DOM.battlearena.classList.toggle('default-mode', !isFocusMode);


        playersToDraw.forEach((player) => {
            const container = document.createElement('div');
            container.classList.add('player-hp-container'); 
            container.dataset.playerId = player.id; 
            
            const isCurrentPlayer = player.id === currentPlayer.id;
            const isTargetPlayer = player.id === targetPlayerId;
            
            container.style.setProperty('--race-color', player.color);
            
            if (isCurrentPlayer) {
                container.classList.add('current-turn', 'main-focus');
            } else if (isTargetPlayer) {
                container.classList.add('target-focus');
            } else if (!isFocusMode) {
                container.classList.add('small-display'); 
            }

            if (player.hp <= 0) player.isEliminated = true;
            if (player.isEliminated) container.classList.add('eliminated');

            const hpPercentage = (player.hp / player.maxHp) * 100;
            const manaPercentage = (player.mana / player.maxMana) * 100;

            let statusIcon = '';
            let statusText = '';
            
            if (player.status === 'Immune') { statusIcon = '🛡️'; statusText = 'IMMUNE'; }
            if (player.status === 'SkipTurn') { statusIcon = '🛑'; statusText = 'STUNNED'; }
            if (player.status === 'SkillLock') { statusIcon = '🔇'; statusText = 'ULTIMATE LOCK'; }
            if (player.status === 'ExtraTurn') { statusIcon = '⏳'; statusText = 'EXTRA TURN'; }
            if (player.blockValue > 0) { statusIcon = '🧱'; statusText = `BLOCK: ${player.blockValue}`; }

            container.innerHTML = `
                <div class="player-portrait" style="background-image: url(${player.image});"></div>
                
                <div class="player-name-hp">
                    <span class="player-title" style="color: ${player.color};">${player.name.toUpperCase()}</span> 
                </div>

                <div class="hp-bar-outer">
                    <div class="hp-bar-inner" style="width: ${hpPercentage}%;"></div>
                    <span class="hp-text"><i class="fas fa-heart"></i> <span class="highlight-text">${Math.max(0, player.hp)}/${player.maxHp}</span> HP</span> 
                </div>
                
                <div class="mana-bar-outer">
                    <div class="mana-bar-inner" style="width: ${manaPercentage}%;"></div>
                    <span class="hp-text"><i class="fas fa-magic"></i> <span class="highlight-text">${player.mana}/${player.maxMana}</span> MANA</span> 
                </div>
                
                <span class="score-display"><i class="fas fa-star"></i> P: <span class="score-highlight">${player.score}</span></span>
                ${statusText ? `<span class="status-effect" style="color: ${player.color};">${statusIcon} ${statusText}</span>` : ''}
            `;
            
            if (isCurrentPlayer) {
                DOM.battlearena.prepend(container);
            } else {
                DOM.battlearena.appendChild(container);
            }
        });
    }

    // --- TURN & COMBAT LOGIC ---
    
    function applyTurnEffects() {
        const currentPlayer = players[currentPlayerIndex];
        let nextIndex = currentPlayerIndex; 

        if (currentPlayer.status === 'ExtraTurn') {
            currentPlayer.status = null; 
            return nextIndex; 
        }
        
        if (currentPlayer.status === 'SkipTurn') {
            currentPlayer.status = null; 
            DOM.turndisplay.innerHTML = `<i class="fas fa-user-circle"></i> TURN: <span style="color: ${currentPlayer.color};">SKIPPED! (${currentPlayer.name})</span>`;
            
            do {
                nextIndex = (nextIndex + 1) % players.length;
            } while (players[nextIndex].isEliminated);
            return nextIndex; 
        }
        
        currentPlayer.status = null;
        currentPlayer.blockValue = 0; 
        
        do {
            nextIndex = (nextIndex + 1) % players.length;
        } while (players[nextIndex].isEliminated);

        return nextIndex;
    }
    
    function startBattle() {
        shuffleArray(questions);
        DOM.nextButton.innerHTML = '<i class="fas fa-forward"></i> NEXT TURN'; 
        DOM.nextButton.disabled = true;
        
        drawHpBars(); 
        playBGM(); 
        nextTurn(true); 
    }

    function nextTurn(isFirstTurn = false) {
        const activePlayers = players.filter(p => !p.isEliminated);
        
        if (activePlayers.length <= 1) {
            endQuiz(activePlayers.length === 1 ? activePlayers[0] : null);
            return;
        }

        if (!isFirstTurn) {
            currentPlayerIndex = applyTurnEffects(); 
        }
        
        const currentPlayer = players[currentPlayerIndex];
        
        if (currentPlayer.isEliminated) {
            return nextTurn();
        }

        if (currentPlayerIndex === 0 && !isFirstTurn) { 
            round++;
        }
        
        isUltimateUsed = false;

        DOM.turndisplay.innerHTML = `<i class="fas fa-user-circle"></i> TURN: <span style="color: ${currentPlayer.color}; text-shadow: 0 0 5px ${currentPlayer.color}CC;">${currentPlayer.name}'s TURN</span>`;
        document.getElementById('round-display').innerHTML = `<i class="fas fa-redo"></i> Round: ${round}`;

        showQuestion();
        drawHpBars(); 
    }

    function showQuestion() {
        resetState();
        
        // Logic chọn câu hỏi đảm bảo mỗi tộc có câu hỏi riêng
        const currentPlayer = players[currentPlayerIndex];
        const currentPlayerColor = currentPlayer.color;
        
        // Lọc câu hỏi của tộc hiện tại
        const currentRaceQuestions = questions.filter(q => q.team === currentPlayer.name.toUpperCase());
        
        // Dùng chỉ mục câu hỏi hiện tại modulo số câu hỏi của tộc đó
        const questionForThisTurn = currentRaceQuestions[currentQuestionIndex % currentRaceQuestions.length];
        
        let current = questionForThisTurn;
        
        DOM.questiontext.innerHTML = `
            <div class="skill-card-header" style="background: linear-gradient(90deg, ${currentPlayerColor}AA, #0d1a26);">
                <span style="color: #ffffff;">**PASSIVE SKILL: ${current.skill.toUpperCase()}**</span> - **${current.team}**
            </div>
            <p class="question-body question-highlight">${current.question}</p>
            `;

        const currentAnswers = generateAnswers(current.correctAnswer);
        
        DOM.answerbuttons.innerHTML = ''; 
        
        currentAnswers.forEach((answer, index) => {
            const button = document.createElement("button");
            button.classList.add("btn", "answer-btn", "answer-btn-spaced"); 
            button.innerHTML = `<span class="answer-index">${index + 1}.</span> ${answer.text}`; 
            button.style.setProperty('--race-color', currentPlayerColor); 

            if (answer.correct) {
                button.dataset.correct = "true";
            }
            button.addEventListener("click", selectAnswer);
            
            DOM.answerbuttons.appendChild(button);
        });
        
        createUltimateButton(currentPlayer);
    }

    function useUltimateSkill(currentPlayer) {
        if (isUltimateUsed || currentPlayer.status === 'SkillLock') return;
        
        playSFX(DOM.sfxClick);
        isUltimateUsed = true;
        
        const ult = currentPlayer.ultimate;
        currentPlayer.mana -= ult.cost;
        createFlyingText(players.findIndex(p => p.id === currentPlayer.id), `-${ult.cost} MANA`, 'mana-loss');
        
        let targetPlayer = null;
        let effectMessage = `**${currentPlayer.name}** executes **ULTIMATE SKILL**! (${ult.text})`;
        
        switch (ult.effect) {
            case 'Heal':
                currentPlayer.hp = Math.min(currentPlayer.maxHp, currentPlayer.hp + ult.value);
                createFlyingText(players.findIndex(p => p.id === currentPlayer.id), `+${ult.value} HP`, 'hp-healed');
                break;
            case 'Immune':
                currentPlayer.status = 'Immune';
                break;
            case 'ExtraTurn':
                currentPlayer.status = 'ExtraTurn'; 
                break;
            case 'Block':
                currentPlayer.blockValue += ult.value;
                break;
            case 'SkipTurn':
            case 'SkillLock':
                targetPlayer = applyStatusToRandomOpponent(ult.effect, ult.target === 'opponent' ? ult.damage : 0, currentPlayer.id);
                if (targetPlayer) {
                    effectMessage += ` Target: **${targetPlayer.name}** now has status **${ult.effect}**!`;
                }
                break;
            case 'None': 
                targetPlayer = applyDamageToRandomOpponent(ult.damage, currentPlayer.id);
                if (targetPlayer) {
                    effectMessage += ` Hit **${targetPlayer.name}** for **${ult.damage} DMG**!`;
                }
                break;
        }
        
        if (ult.damage > 0 && ult.effect !== 'None') {
             targetPlayer = applyDamageToRandomOpponent(ult.damage, currentPlayer.id);
             if (targetPlayer) {
                effectMessage += ` Target: **${targetPlayer.name}** takes **${ult.damage} DMG**!`;
             }
        }
        
        const targetId = targetPlayer ? targetPlayer.id : currentPlayer.id; 
        const actionType = targetPlayer ? 'correct' : 'heal'; 
        
        displayResult('correct-effect', {skill: 'ULTIMATE'}, effectMessage, currentPlayer.color);
        if (targetPlayer) screenShake(raceShakeTypes[targetPlayer.id]); 

        isAnswerSelected = true; 
        finalizeTurn(currentPlayer, targetId, actionType); 
    }

    function selectAnswer(e) {
        if (isAnswerSelected || isUltimateUsed) return;

        let currentSelectedAnswer = e.target;
        if (!currentSelectedAnswer.classList.contains('answer-btn')) {
            currentSelectedAnswer = currentSelectedAnswer.closest('.answer-btn');
            if (!currentSelectedAnswer) return; 
        }

        const isCorrect = currentSelectedAnswer.dataset.correct === "true";
        isAnswerSelected = true; 

        Array.from(DOM.answerbuttons.children).forEach(button => button.disabled = true);
        
        const ultimateButton = document.getElementById('ultimate-btn');
        if (ultimateButton) ultimateButton.disabled = true;

        const currentPlayer = players[currentPlayerIndex];
        const currentQuestion = questions[currentQuestionIndex % questions.length];
        
        let targetId = null;

        if (isCorrect) {
            currentSelectedAnswer.classList.add("correct");
            playSFX(DOM.sfxCorrect);
            targetId = executeAttack(currentPlayer, currentQuestion); 
            finalizeTurn(currentPlayer, targetId, 'correct'); 
        } else {
             currentSelectedAnswer.classList.add("incorrect");
             playSFX(DOM.sfxIncorrect);
             targetId = executeFailure(currentPlayer); 
             finalizeTurn(currentPlayer, targetId, 'incorrect'); 
        }
    }


    function executeAttack(currentPlayer, currentQuestion) {
        let damageDealt = BASE_DAMAGE; 
        
        const oldMana = currentPlayer.mana;
        currentPlayer.mana = Math.min(currentPlayer.maxMana, currentPlayer.mana + 1);
        if (currentPlayer.mana > oldMana) {
            createFlyingText(players.findIndex(p => p.id === currentPlayer.id), '+1 MANA', 'mana-gain');
        }
        
        currentPlayer.score += 5;
        
        let targetPlayer = applyDamageToRandomOpponent(damageDealt, currentPlayer.id);
        
        const targetText = targetPlayer ? `Hit **${targetPlayer.name}**` : 'No valid target.';
        const effectText = `SUCCESS! Basic Hit (**${damageDealt} DMG**). **+1 MANA**! ${targetText}`;
        
        displayResult('correct-effect', currentQuestion, effectText, currentPlayer.color);
        
        if (targetPlayer) {
            screenShake(raceShakeTypes[targetPlayer.id]); 
            return targetPlayer.id;
        }
        
        return null;
    }

    function executeFailure(currentPlayer) {
        const hpBefore = currentPlayer.hp;
        currentPlayer.hp = Math.max(0, currentPlayer.hp - RECOIL_DAMAGE); 
        
        const oldMana = currentPlayer.mana;
        currentPlayer.mana = Math.max(0, currentPlayer.mana - 1); 
        
        const currentPlayerIndex = players.findIndex(p => p.id === currentPlayer.id);

        if (currentPlayer.hp < hpBefore) {
            createFlyingText(currentPlayerIndex, `-${RECOIL_DAMAGE} HP`, 'hp-dealt');
        }
        if (currentPlayer.mana < oldMana) {
            createFlyingText(currentPlayerIndex, `-1 MANA`, 'mana-loss');
        }
        
        const FAIL_COLOR = '#FF00FF'; 

        const effectText = `<span style="color: ${FAIL_COLOR}; font-weight: bold;">MISS!</span> ${currentPlayer.name} suffers **${RECOIL_DAMAGE} Recoil Damage**! **-1 MANA**!`;
        
        displayResult('incorrect-effect', questions[currentQuestionIndex % questions.length], effectText, FAIL_COLOR);
        
        screenShake(raceShakeTypes[currentPlayer.id]);
        
        return currentPlayer.id; 
    }
    
    function applyStatusToRandomOpponent(status, damage, attackerId) {
        const targets = players.filter(p => !p.isEliminated && p.id !== attackerId);
        if (targets.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * targets.length);
        const target = targets[randomIndex];
        const targetIndex = players.findIndex(p => p.id === target.id);
        
        target.status = status;
        
        if (damage > 0) {
            target.hp = Math.max(0, target.hp - damage);
            createFlyingText(targetIndex, `-${damage} HP`, 'hp-dealt');
        }
        
        return target;
    }

    function applyDamageToRandomOpponent(damage, attackerId) {
        const targets = players.filter(p => !p.isEliminated && p.id !== attackerId);
        if (targets.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * targets.length);
        const target = targets[randomIndex];
        const targetIndex = players.findIndex(p => p.id === target.id);
        let finalDamage = damage;
        
        if (target.status === 'Immune') {
            createFlyingText(targetIndex, 'IMMUNE', 'hp-healed');
            finalDamage = 0;
            return target; 
        }
        
        if (target.blockValue > 0) {
             const blocked = Math.min(finalDamage, target.blockValue);
             finalDamage -= blocked;
             target.blockValue -= blocked;
             
             createFlyingText(targetIndex, `BLOCKED ${blocked} DMG!`, 'mana-gain'); 
        }
        
        target.hp = Math.max(0, target.hp - finalDamage);
        
        if (finalDamage > 0) {
            createFlyingText(targetIndex, `-${finalDamage} HP`, 'hp-dealt');
        }
        
        if (target.hp <= 0) {
            target.isEliminated = true;
        }
        return target; 
    }

    function displayResult(resultClass, question, text, color) {
        DOM.effectResultBox.style.setProperty('--race-color', color); 
        DOM.effectResultBox.innerHTML = `
            <p class="${resultClass}">
            <i class="fas fa-bolt"></i> ${question.skill} - ${resultClass.includes('correct') ? 'SUCCESSFUL EXECUTION!' : 'FLAWED ACTION!'}
            </p>
            <p class="effect-details">${text}</p>
        `;
        DOM.effectResultBox.classList.remove('hidden');
    }

    function finalizeTurn(currentPlayer, targetPlayerId = null, actionType = 'idle') {
        if (currentPlayer.hp <= 0) currentPlayer.isEliminated = true;

        drawHpBars(targetPlayerId); 
        
        const currentPlayerId = currentPlayer.id;
        
        if (targetPlayerId && actionType !== 'idle') {
            let effect;
            
            if (actionType === 'incorrect') {
                effect = 'recoil'; 
            } else if (targetPlayerId === currentPlayerId) {
                effect = 'recoil'; 
            } else {
                effect = 'knockback'; 
            }
            
            applyCombatEffects(currentPlayerId, targetPlayerId, effect);
        }
        
        DOM.nextButton.style.display = "block";
        DOM.nextButton.disabled = false;
    }

    function handleNextButton() {
        playSFX(DOM.sfxClick); 
        // Chỉ tăng chỉ mục câu hỏi chung (để đảm bảo vòng lặp các câu hỏi của tộc)
        currentQuestionIndex++; 
        nextTurn();
    }

    // --- GAME OVER & INITIALIZATION ---

    function displayGameOver(winnerPlayer) {
        let titleText = `<i class="fas fa-trophy"></i> BATTLE COMPLETE <i class="fas fa-trophy"></i>`;
        let championText = `CHAMPION: ${winnerPlayer.name.toUpperCase()}`;
        
        DOM.winnerdisplay.innerHTML = `
            <h2 style="color: #FFD700; text-shadow: 0 0 10px #FFD700;">${titleText}</h2>
            
            <div class="champion-card" style="border: 4px solid ${winnerPlayer.color}; background-color: rgba(0,0,0,0.6);">
                <div class="player-portrait champion-portrait" 
                     style="background-image: url(${winnerPlayer.image}); border-color: ${winnerPlayer.color};">
                </div>
                
                <h3 style="color: ${winnerPlayer.color};">${championText}</h3>
                
                <p>🏆 SCORE CUỐI CÙNG: 
                    <span class="score-highlight" style="color: #FFD700;">${winnerPlayer.score}</span> điểm
                </p>
                <p>🔥 Kỹ năng Tộc: ${winnerPlayer.skill}</p>
            </div>
            
            <p style="margin-top: 20px; font-style: italic;">"Người chơi cuối cùng đứng vững đã giành chiến thắng vinh quang!"</p>
        `;
        
        DOM.restartButton.style.display = 'block';
    }


    function endQuiz(winnerPlayer) {
        // Dừng nhạc nền
        stopBGM();

        // KÍCH HOẠT NHẠC CHIẾN THẮNG
        if (winnerPlayer) {
            playChampionMusic(); 
        }

        // Ẩn màn hình quiz và hiển thị màn hình game over
        DOM.quizScreen.style.display = 'none';
        DOM.gameOverScreen.style.display = 'block';

        // Gọi hàm hiển thị kết quả
        displayGameOver(winnerPlayer);
    }

    function resetState() {
        DOM.nextButton.style.display = "none";
        DOM.effectResultBox.classList.add('hidden');
        DOM.effectResultBox.innerHTML = '';
        isAnswerSelected = false; 
        isUltimateUsed = false;

        while (DOM.answerbuttons.firstChild) {
            DOM.answerbuttons.removeChild(DOM.answerbuttons.firstChild);
        }
        const ultimateContainer = document.getElementById('ultimate-skill-container');
        if (ultimateContainer) {
            ultimateContainer.remove();
        }
    }
    
    function initializeGame() {
        getDOM(); 

        chosenRaces = [];
        currentQuestionIndex = 0;
        currentPlayerIndex = 0;
        round = 1;
        
        DOM.raceSelectionScreen.classList.add('active');
        DOM.raceSelectionScreen.classList.remove('hidden');
        DOM.quizScreen.classList.add('hidden');
        DOM.gameOverScreen.classList.add('hidden');
        
        if (DOM.restartButton) DOM.restartButton.style.display = 'none';

        drawRaceSelection(); 
        
        if (DOM.raceinfo) {
           DOM.raceinfo.innerHTML = '<i class="fas fa-info-circle"></i> Select your warrior to begin the Eternal Trial. Only the wise shall survive.';
        }
        
        if (DOM.restartButton) {
            DOM.restartButton.onclick = () => {
                playSFX(DOM.sfxClick);
                // Dùng reload để reset toàn bộ trạng thái audio và DOM
                window.location.reload(); 
            };
        }
        if (DOM.nextButton) DOM.nextButton.onclick = handleNextButton;
    }

    // Initialize Game
    document.addEventListener('DOMContentLoaded', initializeGame);
    
    // ... (Hàm createUltimateButton giữ nguyên) ...
    function createUltimateButton(currentPlayer) {
        const quizBox = document.querySelector('.quiz-box');
        const existingContainer = document.getElementById('ultimate-skill-container');
        if (existingContainer) {
            existingContainer.remove();
        }
        
        const container = document.createElement('div');
        container.id = 'ultimate-skill-container';
        container.classList.add('ultimate-skill-container');

        const ult = currentPlayer.ultimate;
        const button = document.createElement('button');
        button.id = 'ultimate-btn';
        button.classList.add('ultimate-btn');
        button.style.setProperty('--race-color', currentPlayer.color); 

        const isLocked = currentPlayer.status === 'SkillLock';
        const canAfford = currentPlayer.mana >= ult.cost && !isLocked;
        const isDisabled = !canAfford || isAnswerSelected || isUltimateUsed || isLocked;
        
        const manaText = `[${ult.cost} MANA]`;
        
        let mainText;
        if (isLocked) {
             mainText = `ULTIMATE LOCKED 🔇`;
        } else if (isUltimateUsed) {
             mainText = "ULTIMATE USED THIS TURN";
        } else if (!canAfford) {
             mainText = `NOT ENOUGH POWER! (NEED ${ult.cost} MANA)`;
        } else {
             mainText = `USE ULTIMATE SKILL: ${currentPlayer.name.toUpperCase()}`;
        }
        
        button.innerHTML = `
            <i class="fas fa-skull-crossbones"></i> 
            <span class="mana-cost">${manaText}</span> 
            ${mainText} 
            <span class="ult-effect-text">(${ult.text})</span>
        `;
        
        button.disabled = isDisabled;

        if (!canAfford && !isLocked || isUltimateUsed || isLocked) {
             button.classList.add('disabled-lock');
        }

        if (canAfford && !isLocked && !isUltimateUsed) {
            button.addEventListener('click', () => useUltimateSkill(currentPlayer));
        }

        container.appendChild(button);
        
        const questionFrame = DOM.questiontext.closest('.question-frame');
        quizBox.insertBefore(container, questionFrame.nextSibling); 
    }

})();