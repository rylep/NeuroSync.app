// Firebase JS SDK v7.20.0 
// Your web app's Firebase configuration    
const firebaseConfig = {
        apiKey: "AIzaSyA1Y14FGC-LeR_KyHelvwIhpYGdHWcNSOw",
        authDomain: "neurosync-app-57bb5.firebaseapp.com",
        projectId: "neurosync-app-57bb5",
        storageBucket: "neurosync-app-57bb5.firebasestorage.app",
        messagingSenderId: "143414720111",
        appId: "1:143414720111:web:f061e97f2122da2a3dbf9a",
        measurementId: "G-GMCTZ87DH1"
    };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
// Dados Simulados (Substituir com dados reais do Firestore no futuro)
const meditations = [
        { id: 1,  title: 'Respiração para Alívio', duration: '5 min', category: 'ansiedade', icon: 'fas fa-shield-heart', locked: false, videoId: 'inpok4MKVLM' },
        { id: 2, title: 'Mindfulness Básico', duration: '10 min', category: 'ansiedade', icon: 'fas fa-person-praying', locked: false },
        { id: 3, title: 'Foco para o Trabalho', duration: '15 min', category: 'foco', icon: 'fas fa-crosshairs', locked: false, videoId: 'tZeXO8t7wN8' },
        { id: 4, title: 'Concentração Plena', duration: '10 min', category: 'foco', icon: 'fas fa-bullseye', locked: false },
        { id: 5, title: 'Relaxamento para Dormir', duration: '20 min', category: 'sono', icon: 'fas fa-moon', locked: false },
        { id: 6, title: 'Escaneamento Corporal', duration: '15 min', category: 'sono', icon: 'fas fa-bed', locked: false },
        { id: 7, title: 'Meditação Avançada de Foco', duration: '30 min', category: 'foco', icon: 'fas fa-brain', locked: true },
        { id: 8, title: 'Redução de Estresse Profundo', duration: '25 min', category: 'ansiedade', icon: 'fas fa-wave-square', locked: true },
    ];
    const communityTopics = [
        { title: 'Lidando com a Ansiedade Social', members: 32, icon: 'fas fa-comments', supervised: true },
        { title: 'Tópico de Gratidão Semanal', members: 158, icon: 'fas fa-hand-holding-heart', supervised: true },
        { title: 'Clube do Livro: Autocuidado', members: 45, icon: 'fas fa-book-open', supervised: false },
        { title: 'Comunidade Geral (WhatsApp)', members: 500, icon: 'fab fa-whatsapp', supervised: false, external: true },
        { title: 'Mães de Primeira Viagem', members: 78, icon: 'fas fa-child', supervised: false }
    ];
    const games = [
        { id: 'word-search', title: 'Caça-Palavras', description: 'Encontre palavras e se desestresse', icon: 'fas fa-search' },
        { id: 'termo', title: 'Termo Diário', description: 'Adivinhe a palavra do dia', icon: 'fas fa-font' },
    ];
    const videos = [
        { title: 'Entendendo a Ansiedade', duration: '8 min', author: 'Dr. Ana Silva' },
        { title: '5 Dicas para Dormir Melhor', duration: '12 min', author: 'Especialista do Sono' },
    ];
     const plans = [
        { name: 'Basic', price: 'Gratuito', popular: false, features: ['Comunidade no WhatsApp', 'Exercícios de respiração', '2 meditações por tipo', 'Jogos Mentais', 'Vídeos de apoio'] },
        { name: 'Plus', price: 'R$ --/mês', popular: true, features: ['Todos os benefícios do Basic', 'Acesso a todas as meditações', '3 consultas online por mês', 'Grupos de nicho supervisionados'] },
        { name: 'Ultra', price: 'R$ ---/mês', popular: false, features: ['Todos os benefícios do Plus', '7 consultas (online ou presencial)', 'Suporte prioritário', 'Encontros da comunidade'] },
    ];
    

//Função para fazer Logout
function logoutUser(auth) {
    auth.signOut().then(() => {
        console.log('Usuário deslogado.');
        // O setupAuthObserver (Item 4) vai cuidar de atualizar a UI
    }).catch((error) => {
        console.error('Erro ao fazer logout:', error);
    });
}
// Observador de Autenticação
function setupAuthObserver(auth, db) {
    const welcomeTitle = document.getElementById('user-welcome-title');
    const authControls = document.getElementById('user-auth-controls');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');

    auth.onAuthStateChanged((user) => {
        if (user) {
            // --- USUÁRIO ESTÁ LOGADO ---
            // Busca o nome no Firestore
            db.collection('users').doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    const nome = doc.data().nome || 'Usuário'; // Pega o nome ou usa 'Usuário'
                    welcomeTitle.textContent = `Olá, ${nome.split(' ')[0]}!`; // Mostra só o primeiro nome
                } else {
                    welcomeTitle.textContent = 'Olá, bem-vindo(a)!';
                }
            }).catch(() => {
                welcomeTitle.textContent = 'Olá, bem-vindo(a)!';
            });

            // Atualiza o botão para "Sair"
            authControls.innerHTML = '<button id="logout-btn" class="btn btn-secondary">Sair</button>';
            
            // Adiciona o evento de clique ao novo botão "Sair" 
            document.getElementById('logout-btn').addEventListener('click', () => {
                logoutUser(auth); // Chama a função de logout
            });

            // Fecha os modais (caso estivessem abertos)
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';

        } else {
            // --- USUÁRIO ESTÁ DESLOGADO ---
            
            // Reseta o título
            welcomeTitle.textContent = 'Olá, bem-vindo(a)!';

            //Atualiza o botão para "Login"
            authControls.innerHTML = '<button id="login-trigger-btn" class="btn btn-secondary">Login</button>';
            
            //Adiciona o evento de clique ao novo botão "Login"
            document.getElementById('login-trigger-btn').addEventListener('click', () => {
                loginModal.style.display = 'flex';
            });
        }
    });
}
function renderAllContent(meditationFilter) {
    const medContainer = document.getElementById('meditation-list');
    if(medContainer){
        medContainer.innerHTML = '';
        const filteredMeds = meditations.filter(m => meditationFilter === 'all' || m.category === meditationFilter);

        filteredMeds.forEach(med => {
            medContainer.innerHTML += `
            <div class="card ${med.locked ? 'locked' : ''}" style="position: relative;">
                ${med.locked ? '<i class="fas fa-lock card-lock-icon"></i>' : ''}
                <h4><i class="${med.icon}"></i> ${med.title}</h4>
                <p class="text-muted">${med.displayDuration}</p> 
                <button class="btn btn-secondary btn-start-meditation" 
                    ${med.locked ? 'disabled' : ''} 
                    data-id="${med.id}">
                    ▶ Iniciar
                </button> 
            </div>`;
        });
    }
    const communityContainer = document.getElementById('community-list');
    if(communityContainer){
        communityContainer.innerHTML = '';
        communityTopics.forEach(topic => {
            communityContainer.innerHTML += `
                <div class="card">
                    <h4><i class="${topic.icon}"></i> ${topic.title}</h4>
                    <p class="text-muted">${topic.members} membros</p>
                    ${topic.supervised ? '<span class="tag supervised">Supervisionado</span>' : '<span class="tag">Aberto</span>'}
                    <button class="btn btn-secondary">${topic.external ? 'WhatsApp' : 'Entrar'}</button>
                </div>`;
        });
    }
    const gamesContainer = document.getElementById('games-list');
    if(gamesContainer){
        gamesContainer.innerHTML = '';
        games.forEach(game => {
            gamesContainer.innerHTML += `
                <div class="card">
                    <h4><i class="${game.icon}"></i> ${game.title}</h4>
                    <p class="text-muted">${game.description}</p>
                    <button class="btn btn-secondary btn-play-game" data-game-id="${game.id}">Jogar</button>
                </div>`;
        });
    }
    const videosContainer = document.getElementById('videos-list');
    if(videosContainer){
        videosContainer.innerHTML = '';
        videos.forEach(video => {
            videosContainer.innerHTML += `
                <div class="card">
                    <h4>${video.title}</h4>
                    <p class="text-muted">${video.author} - ${video.duration}</p>
                    <button class="btn btn-secondary">Assistir</button>
                </div>`;
        });
    }
    const plansContainer = document.querySelector('.plans-container');
    if(plansContainer){
        plansContainer.innerHTML = '';
        plans.forEach(plan => {
            plansContainer.innerHTML += `
                <div class="card plan-card ${plan.popular ? 'popular' : ''}">
                    <h4>${plan.name}</h4>
                    <h3>${plan.price}</h3>
                    <ul>
                        ${plan.features.map(f => `<li><i class="fas fa-check-circle"></i> ${f}</li>`).join('')}
                    </ul>
                    <button class="btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}">
                        ${plan.price === 'Gratuito' ? 'Começar Agora' : 'Assinar'}
                    </button>
                </div>
            `;
        });
    }
    attachDynamicEventListeners();
}
function attachDynamicEventListeners() {
    // Botões de iniciar meditação
    document.querySelectorAll('.btn-start-meditation').forEach(btn => {
        btn.addEventListener('click', () => {
            const medId = parseInt(btn.dataset.id);
            const medData = meditations.find(m => m.id === medId);
            if(medData) openMeditationPlayer(medData);
        });
    });
    // Listeners de jogar
    document.querySelectorAll('.btn-play-game').forEach(btn => {
        btn.addEventListener('click', () => {
            const gameId = btn.dataset.gameId;
            if(gameId === 'word-search') {
                document.getElementById('word-search-modal').style.display = 'flex';
                alert('Iniciando o jogo de Caça-Palavras! (Funcionalidade em desenvolvimento)');
            }
        });
    });
}
function openMeditationPlayer(medData) {
    const modal = document.getElementById('meditation-player-modal');
    const videoContainer = document.getElementById('player-video-container');
    const visualizer = document.querySelector('.player-visualizer');
    const controls = document.querySelector('.player-controls');

    document.getElementById('player-title').textContent = medData.title;
    document.getElementById('player-category-tag').textContent = medData.category.toUpperCase();

    modal.style.display = 'flex';

    if (medData.videoId) {
        // MODO VÍDEO
        videoContainer.style.display = 'block';
        if(visualizer) visualizer.style.display = 'none';
        if(controls) controls.style.display = 'none';

        videoContainer.innerHTML = `
            <div class="video-wrap
            per">
                <iframe src="https://www.youtube.com/embed/${medData.videoId}?autoplay=1"
                        title="YouTube video player" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
            </div>`;
        document.getElementById('player-status').textContent = "Reproduzindo Vídeo...";
    } else {
        // MODO VISUALIZADOR
        videoContainer.style.display = 'none';
        videoContainer.innerHTML = '';
        if(visualizer) visualizer.style.display = 'flex';
        if(controls) controls.style.display = 'flex';

        remainingTime = medData.duration * 60; // Converte minutos para segundos
        updateTimerDisplay(remainingTime);
        pauseMeditation();
        document.getElementById('player-status').textContent = "Pronto para começar";
    }
}
function closeMeditationPlayer() {
    pauseMeditation();
    const modal = document.getElementById('meditation-player-modal');
    modal.style.display = 'none';
    const videoContainer = document.getElementById('player-video-container');
    if(videoContainer) videoContainer.innerHTML = '';
}
function playMeditation() {
    isPlaying = true;
    const btn = document.getElementById('player-play-pause-btn');
    if(btn) btn.innerHTML = '<i class="fas fa-pause"></i>';

    document.getElementById('player-visual-circle');
    if (circle) circle.classList.add('playing');

    const playerStatus = document.getElementById('player-status');
    if(playerStatus) playerStatus.textContent = "Em andamento...";

    medInterval = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime--;
            updatePlayerTimerDisplay(remainingTime);
        } else {
            finishMeditation();
        }
    }, 1000);
}
function pauseMeditation() {
    isPlaying = false;
    clearInterval(medInterval);
    const btn = document.getElementById('player-play-pause-btn');
    if(btn) btn.innerHTML = '<i class="fas fa-play"></i>';

    const circle = document.getElementById('player-visual-circle');
    if (circle) circle.classList.remove('playing');

    const playerStatus = document.getElementById('player-status');
    if(playerStatus) playerStatus.textContent = "Pausado";
}
function finishMeditation() {
    pauseMeditation();
    document.getElementById('player-status').textContent = "Gratidão. Sessão concluída.";
    updateTimerDisplay(0);
}
function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timerEl = document.getElementById('player-timer');
    if(timerEl) timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

 //WIDGET DE RESPIRAÇÃO (MAIN)
 function initBreathingExercise() {
            const circle = document.querySelector('.breathing-circle');
            const instruction = document.querySelector('.breathing-instruction');
            const timerDisplay = document.getElementById('widget-timer-display');
            const durationBtns = document.querySelectorAll('.btn-duration');
            const stopBtn = document.getElementById('stop-breathing-btn');

            const recommendBtn = document.getElementById('btn-recommend-time');
            const recommendDisplay = document.getElementById('recommendation-display');
            
            let breatheInterval = null;
            let textInterval = null;
            let timeLeft = 0;

            function stopBreathing() {
                clearInterval(breatheInterval);
                clearInterval(textInterval);
                circle.classList.remove('animate');
                circle.style.transform = 'scale(1)'; // Reset
                instruction.textContent = 'Escolha uma duração para começar';
                timerDisplay.textContent = '00:00';
                stopBtn.style.display = 'none';
                durationBtns.forEach(b => b.classList.remove('active'));
            }

            // Função que inicia o ciclo
            function startBreathingCycle(seconds) {
                // Limpa anteriores
                stopBreathing();
                
                timeLeft = seconds;
                stopBtn.style.display = 'inline-block';
                
                // Formata tempo inicial
                const updateDisplay = () => {
                    const m = Math.floor(timeLeft / 60);
                    const s = timeLeft % 60;
                    timerDisplay.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
                };
                updateDisplay();

                // 1. Inicia Animação Visual
                circle.classList.add('animate');
                
                // 2. Inicia Ciclo de Texto (Sincronizado com CSS: 8s total)
                // 0s-4s: Inspire (Expandir)
                // 4s-8s: Expire (Contrair)
                instruction.textContent = "Inspire profundamente...";
                
                // Função auxiliar para alternar texto
                const textCycle = () => {
                    instruction.textContent = "Inspire profundamente...";
                    setTimeout(() => {
                        if(timeLeft > 0) instruction.textContent = "Expire lentamente...";
                    }, 4000); // Muda na metade do ciclo (4s)
                };
                
                // Chama a primeira vez
                setTimeout(() => {
                    if(timeLeft > 0) instruction.textContent = "Expire lentamente...";
                }, 4000);

                // Configura intervalo do texto (a cada 8s)
                textInterval = setInterval(textCycle, 8000);

                // 3. Inicia Timer Regressivo
                breatheInterval = setInterval(() => {
                    timeLeft--;
                    updateDisplay();
                    
                    if (timeLeft <= 0) {
                        clearInterval(breatheInterval);
                        clearInterval(textInterval);
                        circle.classList.remove('animate');
                        instruction.textContent = "Sessão concluída. Muito bem!";
                        stopBtn.style.display = 'none';
                        durationBtns.forEach(b => b.classList.remove('active'));
                    }
                }, 1000);
            }

            durationBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const duration = parseInt(btn.dataset.duration);
                    durationBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    startBreathingCycle(duration);
                });
            });

            stopBtn.addEventListener('click', stopBreathing);

            recommendBtn.addEventListener('click', () => {
                recommendDisplay.style.display = 'block';
                
                // Simulação: Escolhe aleatoriamente ou baseado em lógica simples
                const options = [
                    { time: 1, text: "Para alívio rápido de estresse (1 min)" },
                    { time: 3, text: "Para retomar o foco no trabalho (3 min)" },
                    { time: 5, text: "Para relaxamento profundo (5 min)" }
                ];
                
                // Escolhe um aleatório para simular personalização
                const recommended = options[Math.floor(Math.random() * options.length)];
                
                recommendDisplay.textContent = `Recomendação para hoje: ${recommended.text}`;
                
                // Opcional: Efeito visual no botão correspondente
                // durationBtns.forEach(b => b.style.borderColor = "#ddd");
                // const btn = document.querySelector(`[data-duration="${recommended.time * 60}"]`);
                // if(btn) btn.style.borderColor = "var(--neuro-blue)";
            });
        }
//JOGO DE CAÇA-PALAVRAS
const wordListDictionary = [
    'MEDITAÇÃO', 'RESPIRAÇÃO', 'FOCO', 'CALMA', 'SERENIDADE', 'MINDFULNESS',
    'TRANQUILO', 'CONCENTRAÇÃO', 'PAZ', 'EQUILÍBRIO','abacaxi', 'abelha', 'abraço',
    'abrigo', 'amigo', 'amor', 'arroz', 'bola', 'banco', 'paciência', 'barco', 'tucunaré', 'Satisfação',
    "gentileza", "apaziguar", "compaixão", "aquèm", "harmonia", "zelo",
    'banana', 'batata', 'boi', 'borboleta', 'bravo', 'cachorro', 'caderno', 'café', 'caju',
    'caminhão', 'caneta', 'capivara', 'cela', 'cigarro', 'cimento', 'cinto', 'cobertor',
    'coqueiro', 'carro', 'dado', 'dança', 'dedo', 'dente', 'dinheiro', 'doce', 'dormir',
    'dragão', 'ducha', 'duende', 'elefante', 'escola', 'esfera', 'esmalte', 'espelho',
    'esponja', 'estação', 'estrela', 'exercício', 'faca', 'fada', 'falar', 'família',
    'fantasma', 'festa', 'figo', 'flauta', 'flor', 'frança', 'fruta', 'gato', 'galo',
    'gaúcho', 'geladeira', 'geleia', 'gema', 'girassol', 'girafa', 'goiaba', 'gorro',
    'histórico', 'horta', 'hotel', 'humano', 'hiena', 'igreja', 'ilha', 'imitar',
    'impacto', 'inverno', 'irmão', 'jabuti', 'jacaré', 'jardim', 'jarra', 'jaula',
    'jiboia', 'joelho', 'jogador', 'joia', 'juiz', 'lagarto', 'lago', 'lâmpada',
    'laranja', 'lata', 'lavar', 'leão', 'leite', 'livro', 'macaco', 'mala',
    'mamadeira', 'manga', 'mapa', 'marfim', 'martelo', 'melancia', 'navio', 'nadar',
    'neve', 'noite', 'nuvem', 'ninho', 'natal', 'oceano', 'óculos', 'olho', 'omelete',
    'onda', 'ônibus', 'oração', 'ostra', 'pato', 'paz', 'pavão', 'pedra', 'peixe',
    'pente', 'pipoca', 'pipa', 'planta', 'pneu', 'porta', 'quadro', 'queijo', 'querer',
    'quieto', 'química', 'rato', 'raiz', 'rede', 'remédio', 'roda', 'rosa', 'ruga',
    'sapo', 'sabão', 'sacola', 'salada', 'samba', 'sapato', 'serra', 'sino', 'sofá', 'sol',
    'taco', 'tatu', 'tampa', 'tartaruga', 'tecido', 'telefone', 'templo', 'tênis', 'terra',
    'tigre', 'urso', 'uva', 'unha', 'união', 'urubu', 'urna', 'vaca', 'vagalume', 'valsa',
    'vassoura', 'vento', 'verão', 'verde', 'vila', 'violeta', 'xadrez', 'xarope', 'xaveco',
    'xerife', 'xícara', 'zebra', 'zero', 'zoológico', 'zumbido'
    ].map(w => w.toUpperCase());

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÇÁÀÃÂÉÊÍÓÔÕÚÜ';
    const specialCharacters = 'ÇÁÀÃÂÉÊÍÓÔÕÚÜ';
    const rowsCount = 12;
    const columnsCount = 12;
    const orientations = ['HORIZONTAL', 'VERTICAL', 'DIAGONAL'];
    const diagonalOrientations = ['RIGHT_TOP', 'RIGHT_BOTTOM', 'LEFT_BOTTOM', 'LEFT_TOP'];

    // Variaveis Globais do Jogo
    let gameTimerInterval = null;
    let remainingTime = 0;
    let medInterval = null;
    let isPlaying = false;
    //Variaveis de estado do player
   
    let currentMeditation = null; 
    let gameWords = [];
    let wordRowsMap = new Map();
    let wordLetters = [];
    let isMouseDown = false;
    let lineRoot = {};
    let wordsFound = 0;
    let currentMiddleTile = null;
    let currentWord = null;
    let currentLetters = [];
    let correctLines = new Set();

    // Função para Fechar o Jogo
         // Função para Fechar o Jogo (Global)
        function closeWordSearchGame() {
            const modal = document.getElementById('word-search-modal');
            if(modal) modal.style.display = 'none';
            
            if(gameTimerInterval) clearInterval(gameTimerInterval);
            document.removeEventListener('mouseup', handlePointerUp);
            document.removeEventListener('touchend', handlePointerUp);
        }

        // Inicializa o Jogo
        function initWordSearchGame() {
            const board = document.querySelector('.board');
            if(!board) return;

            // 1. Limpa o Modal e Variáveis
            board.innerHTML = '';
            document.querySelector('.row-1').innerHTML = '';
            document.querySelector('.row-2').innerHTML = '';
            document.querySelector('.row-3').innerHTML = '';
            document.getElementById('word-search-win-message').textContent = '';
            
            gameWords = [];
            wordRowsMap = new Map();
            wordLetters = [];
            wordsFound = 0;
            correctLines = new Set();
            isMouseDown = false;

            // 2. Popula o Tabuleiro
            const gameTiles = populateBoard(board);
            addWords(gameTiles); 
            addLetters(board.children); 
            addWordRows(); 
            
            // 3. Adiciona Listeners de Interação (Event Delegation no Board)
            board.addEventListener('mousedown', handlePointerDown);
            board.addEventListener('mousemove', handlePointerMove);
            board.addEventListener('touchstart', handlePointerDown, {passive: false});
            board.addEventListener('touchmove', handlePointerMove, {passive: false});

            // Listeners globais para soltar o clique
            document.addEventListener('mouseup', handlePointerUp);
            document.addEventListener('touchend', handlePointerUp);
            
            // Inicia Timer
            startWordSearchTimer(document.getElementById('word-search-timer'));

            // Exibe o modal
            document.getElementById('word-search-modal').style.display = 'flex';
        }

        function resetWordSearchGame() {
            initWordSearchGame();
        }

        function startWordSearchTimer(el) {
            if(gameTimerInterval) clearInterval(gameTimerInterval);
            let s = 0;
            el.textContent = "00:00";
            gameTimerInterval = setInterval(() => {
                s++;
                const m = Math.floor(s/60);
                const sec = s%60;
                el.textContent = `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
            }, 1000);
        }

        // --- CONFIGURAÇÃO DO TABULEIRO ---
        function populateBoard(board) {
            let tiles = [];
            for (let i = 0; i < rowsCount; i++) {
                tiles[i] = [];
                for (let j = 0; j < columnsCount; j++) {
                    let tile = document.createElement('div');
                    tile.classList.add('tile');
                    tile.id = `${i}-${j}`;
                    board.appendChild(tile);
                    tiles[i][j] = tile;
                }
            }
            return tiles;
        }

        function addWords(tiles) {
            let wordsToAdd = 12; 
            let safeGuard = 0;
            while (wordsToAdd > 0 && safeGuard < 1000) {
                safeGuard++;
                let wordAdded = false;
                let word = wordListDictionary[Math.floor(Math.random() * wordListDictionary.length)].toUpperCase();

                if (gameWords.includes(word)) continue;
                
                let orientation = orientations[Math.floor(Math.random() * orientations.length)];
                switch (orientation) {
                    case 'VERTICAL': wordAdded = setStraightWord(word, tiles, orientation); break;
                    case 'HORIZONTAL': wordAdded = setStraightWord(word, tiles, orientation); break;
                    case 'DIAGONAL': wordAdded = setDiagonalWord(word, tiles); break;
                }
                if (wordAdded) {
                    gameWords.push(word);
                    wordsToAdd--;
                }
            }
        }

        function setStraightWord(word, tiles, orientation) {
            const isVertical = orientation === 'VERTICAL';
            const wordSize = word.length;
            let wasWordAdded = false;
            let attempts = 10;

            while (!wasWordAdded && attempts > 0) {
                attempts--;
                let row = Math.floor(Math.random() * rowsCount);
                let column = Math.floor(Math.random() * columnsCount);
                word = (Math.random() > 0.5) ? word.split('').reverse().join('') : word; 

                if ((isVertical && wordSize > rowsCount - row) || (!isVertical && wordSize > columnsCount - column)) continue;

                let wordFits = true;
                for (let i = 0; i < wordSize; i++) {
                    let tile = (isVertical) ? tiles[row + i][column] : tiles[row][column + i];
                    if(!checkLetterToFitTile(word.charAt(i), tile)) { wordFits = false; break; }
                }

                if (wordFits) {
                    word.split('').forEach((letter, i) => {
                        let tile = (isVertical) ? tiles[row + i][column] : tiles[row][column + i];
                        addLetterToTile(letter, tile);
                    });
                    wasWordAdded = true;
                }
            }
            return wasWordAdded;
        }

        function setDiagonalWord(word, tiles) {
            const wordSize = word.length;
            let wasWordAdded = false;
            let attempts = 10;

            while (!wasWordAdded && attempts > 0) {
                attempts--;
                let orientation = diagonalOrientations[Math.floor(Math.random() * diagonalOrientations.length)];
                let targetCoords = getDiagonalCoordinates(orientation, wordSize);
                word = (Math.random() > 0.5) ? word.split('').reverse().join('') : word;

                if (targetCoords.length !== wordSize) continue;
                let wordFits = true;

                for (let i = 0; i < wordSize; i++) {
                    let tile = tiles[targetCoords[i].row][targetCoords[i].column];
                    if(!checkLetterToFitTile(word.charAt(i), tile)) { wordFits = false; break; }
                }

                if (wordFits) {
                    word.split('').forEach((letter, i) => {
                        let tile = tiles[targetCoords[i].row][targetCoords[i].column];
                        addLetterToTile(letter, tile);
                    });
                    wasWordAdded = true;
                }
            }
            return wasWordAdded;
        }

        function getDiagonalCoordinates(orientation, wordSize) {
            let row = Math.floor(Math.random() * rowsCount);
            let column = Math.floor(Math.random() * columnsCount);
            let coords = [];
            for (let i = 0; i < wordSize; i++) {
                let coord = {};
                switch (orientation) {
                    case 'RIGHT_TOP': coord = { row: row - i, column: column + i }; break;
                    case 'RIGHT_BOTTOM': coord = { row: row + i, column: column + i }; break;
                    case 'LEFT_BOTTOM': coord = { row: row + i, column: column - i }; break;
                    case 'LEFT_TOP': coord = { row: row - i, column: column - i }; break;
                }
                if (coord.row < 0 || coord.row >= rowsCount || coord.column < 0 || coord.column >= columnsCount) break;
                coords.push(coord);
            }
            return coords;
        }

        function addLetters(tiles) {
            for (let tile of tiles) {
                if (wordLetters.includes(tile)) continue;
                let letter = letters.charAt(Math.floor(Math.random() * letters.length));
                if (specialCharacters.includes(letter)) letter = letters.charAt(Math.floor(Math.random() * letters.length));
                
                let span = tile.querySelector('span');
                if (span) span.innerHTML = letter;
                else {
                    span = document.createElement('span');
                    span.innerHTML = letter;
                    tile.appendChild(span);
                }
            }
        }

        function addWordRows() {
            const row1 = document.querySelector('.row-1');
            const row2 = document.querySelector('.row-2');
            const row3 = document.querySelector('.row-3');

            gameWords.forEach((word, i) => {
                let span = document.createElement('span');
                span.id = `span-${i}`;
                span.innerHTML = word;
                wordRowsMap.set(word, span.id);

                if (i <= 3) row1.appendChild(span);
                else if (i <= 7) row2.appendChild(span);
                else row3.appendChild(span);
            });
        }

        function checkLetterToFitTile(letter, tile) {
            let span = tile.querySelector('span');
            if (wordLetters.includes(tile) && span && span.innerHTML !== letter) return false;
            return true;
        }

        function addLetterToTile(letter, tile) {
            if (!wordLetters.includes(tile)) wordLetters.push(tile);
            let span = tile.querySelector('span');
            if(!span) {
                span = document.createElement('span');
                tile.appendChild(span);
            }
            span.innerHTML = letter;
        }

        // --- INTERAÇÕES DO JOGO (Pointer Events) ---
        function handlePointerDown(event) {
            if (event.cancelable) event.preventDefault(); 
            const tile = event.target.closest('.tile');
            if(!tile) return;

            const [row, column] = tile.id.split('-').map(Number);
            addLine(tile);
            isMouseDown = true;
            currentMiddleTile = tile;
            lineRoot = { row: row, column: column };
            document.querySelector('.board').classList.add('drawing');
        }

        function handlePointerMove(event) {
            if (!isMouseDown) return;
            if (event.cancelable) event.preventDefault();

            const tile = getTileFromEvent(event);
            if (tile && tile !== currentMiddleTile && tile.classList.contains('tile')) {
                drawLine(tile);
            }
        }

        function handlePointerUp() {
            isMouseDown = false;
            const board = document.querySelector('.board');
            if(board) board.classList.remove('drawing');

            if (currentMiddleTile) {
                let line = currentMiddleTile.querySelector('.draw-line#current');
                if (line && checkWord() && !correctLines.has(line)) {
                    wordsFound++;
                    line.id = `correct-${currentMiddleTile.id}`;
                    line.classList.remove('draw-line');
                    line.classList.add('correct-line');
                    line.style.backgroundColor = `var(--color-${(wordsFound % 12) + 1})`;
                    line.style.zIndex = wordsFound; 
                    correctLines.add(line);
                    updateWordContainer();
                    
                    if(wordsFound === gameWords.length) {
                        clearInterval(gameTimerInterval);
                        document.getElementById('word-search-win-message').textContent = "Parabéns! Você encontrou todas as palavras!";
                    }
                } else if (line) {
                    currentMiddleTile.removeChild(line);
                }
                currentMiddleTile = null;
                currentLetters = [];
            }
        }

        function getTileFromEvent(event) {
            if (event.type === 'touchmove') {
                const touch = event.touches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                return element ? element.closest('.tile') : null;
            }
            return event.target.closest('.tile');
        }

        function addLine(tile) {
            const line = document.createElement('div');
            line.classList.add('draw-line');
            line.id = 'current';
            tile.appendChild(line);
            return line;
        }

        function checkWord() {
            let w = currentLetters.join('');
            for (let word of gameWords) {
                if (word === w || word === w.split('').reverse().join('')) {
                    currentWord = word;
                    return true;
                }
            }
            return false;
        }

        function updateWordContainer() {
            const spanId = wordRowsMap.get(currentWord);
            if(spanId) {
                const span = document.querySelector(`#${spanId}`);
                if(span) span.classList.add('word-found');
            }
        }

        function drawLine(tile) {
            const [row, column] = tile.id.split('-').map(Number);
            const rootRow = lineRoot.row;
            const rootColumn = lineRoot.column;
            if (rootRow === row && rootColumn === column) return;

            let lineIds = [];
            let orientation = '';

            if (rootRow > row && rootColumn === column) { lineIds = getStraightLineIds(row, rootRow, rootColumn, 'VERTICAL'); orientation = 'VERTICAL'; }
            else if (rootRow === row && rootColumn < column) { lineIds = getStraightLineIds(rootColumn, column, rootRow, 'HORIZONTAL'); orientation = 'HORIZONTAL'; }
            else if (rootRow < row && rootColumn === column) { lineIds = getStraightLineIds(rootRow, row, rootColumn, 'VERTICAL'); orientation = 'VERTICAL'; }
            else if (rootRow === row && rootColumn > column) { lineIds = getStraightLineIds(column, rootColumn, rootRow, 'HORIZONTAL'); orientation = 'HORIZONTAL'; }
            else if (Math.abs(rootRow - row) === Math.abs(rootColumn - column)) {
                if (rootRow > row && rootColumn < column) orientation = 'RIGHT_TOP';
                else if (rootRow < row && rootColumn < column) orientation = 'RIGHT_BOTTOM';
                else if (rootRow < row && rootColumn > column) orientation = 'LEFT_BOTTOM';
                else if (rootRow > row && rootColumn > column) orientation = 'LEFT_TOP';
                lineIds = getDiagonalLineIdsInternal(rootRow, rootColumn, Math.abs(rootRow - row), orientation);
            }

            if (lineIds.length === 0) return;
            calcLinePosition(lineIds, orientation);
            
            currentLetters = lineIds.map(id => {
                const t = document.getElementById(`${id.row}-${id.column}`);
                return t ? t.querySelector('span').innerHTML : '';
            });
        }

        function getStraightLineIds(start, end, freeze, type) {
            let ids = [];
            for (let i = start; i <= end; i++) {
                ids.push(type === 'VERTICAL' ? { row: i, column: freeze } : { row: freeze, column: i });
            }
            return ids;
        }

        function getDiagonalLineIdsInternal(rootRow, rootColumn, gap, direction) {
            let ids = [];
            for (let i = 0; i <= gap; i++) {
                switch (direction) {
                    case 'RIGHT_TOP': ids.push({ row: rootRow - i, column: rootColumn + i }); break;
                    case 'RIGHT_BOTTOM': ids.push({ row: rootRow + i, column: rootColumn + i }); break;
                    case 'LEFT_BOTTOM': ids.push({ row: rootRow + i, column: rootColumn - i }); break;
                    case 'LEFT_TOP': ids.push({ row: rootRow - i, column: rootColumn - i }); break;
                }
            }
            return ids;
        }

        function calcLinePosition(lineIds, orientation) {
            const size = lineIds.length;
            const middleId = lineIds[Math.floor((size - 1) / 2)];
            
            let line = currentMiddleTile.querySelector('.draw-line#current');
            if (line) currentMiddleTile.removeChild(line);

            currentMiddleTile = document.getElementById(`${middleId.row}-${middleId.column}`);
            if (!currentMiddleTile) return;

            line = addLine(currentMiddleTile);
            calcLineSize(line, size, orientation);
        }

        function calcLineSize(line, tilesCount, orientation) {
            const verticalLength = `calc(var(--tile-height) / 5 * (5 * ${tilesCount} - var(--line-discount)))`;
            const horizonalLength = `calc(var(--tile-width) / 5 * (5 * ${tilesCount} - var(--line-discount)))`;
            const diagonalLength = `calc(var(--tile-width) / 5 * (5 * ${Math.sqrt(2) * tilesCount} - var(--diagonal-line-discount)))`;

            let isEven = tilesCount % 2 === 0;

            switch (orientation) {
                case 'VERTICAL':
                    line.style.height = verticalLength;
                    if (isEven) line.style.top = 'var(--tile-height)';
                    break;
                case 'HORIZONTAL':
                    line.style.width = horizonalLength;
                    if (isEven) line.style.left = 'var(--tile-width)';
                    break;
                case 'RIGHT_TOP':
                case 'RIGHT_BOTTOM':
                case 'LEFT_BOTTOM':
                case 'LEFT_TOP':
                    line.style.width = `calc(${diagonalLength} - 1rem)`;
                    line.style.transform = `translate(-50%, -50%) rotate(${getRotationAngle(orientation)}deg)`;
                    if (isEven) adjustEvenDiagonal(line, orientation);
                    break;
            }
        }

        function getRotationAngle(orientation) {
            switch (orientation) {
                case 'RIGHT_TOP': return -45;
                case 'RIGHT_BOTTOM': return 45;
                case 'LEFT_BOTTOM': return 135;
                case 'LEFT_TOP': return -135;
            }
        }

        function adjustEvenDiagonal(line, orientation) {
            if(orientation === 'RIGHT_TOP') { line.style.left = 'calc(50% + var(--tile-width) / 2)'; line.style.top = 'calc(50% - var(--tile-height) / 2)'; }
            if(orientation === 'RIGHT_BOTTOM') { line.style.left = 'calc(50% + var(--tile-width) / 2)'; line.style.top = 'calc(50% + var(--tile-height) / 2)'; }
            if(orientation === 'LEFT_BOTTOM') { line.style.left = 'calc(50% - var(--tile-width) / 2)'; line.style.top = 'calc(50% + var(--tile-height) / 2)'; }
            if(orientation === 'LEFT_TOP') { line.style.left = 'calc(50% - var(--tile-width) / 2)'; line.style.top = 'calc(50% - var(--tile-height) / 2)'; }
        }
        function closeWordSearchGame() {

        }

        // Jogos
        const gamesContainer = document.getElementById('games-list');
            if(gamesContainer){
                gamesContainer.innerHTML = '';
                games.forEach(game => {
                    gamesContainer.innerHTML += `
                        <div class="card">
                            <h4><i class="${game.icon}"></i> ${game.title}</h4>
                            <p class="text-muted">${game.description}</p>
                            <button class="btn btn-secondary btn-play-game" data-game-id="${game.id}">Jogar</button>
                        </div>`;
                });
            }
// --- CÓDIGO PRINCIPAL ---
document.addEventListener('DOMContentLoaded', () => {
    window.navigateTo = (targetId) => {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.querySelector(targetId);
        if(target) target.classList.add('active');

        document.querySelectorAll('.nav-links a').forEach(l => {
            l.classList.remove('active');
            if(l.getAttribute('href') === targetId) l.classList.add('active');
        });
        const navLinksMenu = document.querySelector('.nav-links');
        const navbar = document.querySelector('.navbar');
        if (navLinksMenu) navLinksMenu.classList.remove('active');
        if (navbar) navbar.classList.remove('menu-open');
        window.scrollTo(0, 0);
    };
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.getAttribute('href'));
        });
    });
    //Menu Mobile
    const menuToggle = document.querySelectorAll('.mobile-menu-toggle');
    menuToggle.forEach(toggle => {
        toggle.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('active');
            document.querySelector('.navbar').classList.toggle('menu-open');
        });
    });
    //Modais
    const closeBtns = document.getElementById('meditation-player-modal').querySelectorAll('.close-btn');
    closeBtns.forEach(btn => {
        btn.onclick = () => {
            document.getElementById('login-modal').style.display = 'none';
            //Para o player em caso de estar aberto
            pauseMeditation();
            document.getElementById('meditation-player-modal').style.display = 'none';
        };
    });
    renderAllContent('all');

    //Filtros de meditação
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderAllContent(btn.dataset.filter);
        });
    });
    //Meta diaria
    const circle = document.getElementById('daily-goal-circle');
    if(circle){
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
            const goal = 15;
            let currentProgress = 0;

            document.getElementById('add-progress-btn').addEventListener('click', () => {
                currentProgress = Math.min(goal, currentProgress + 5);
                const offset = circumference - (currentProgress / goal) * circumference;
                circle.style.strokeDashoffset = offset;
                document.getElementById('daily-goal-text').textContent = `${currentProgress}/${goal} min`;
            });
    }
    
    //Config o player de meditação
    const playBtn = document.getElementById('player-play-pause-btn');
    const stopBtn = document.getElementById('player-stop-btn');
    if(playBtn) playBtn.addEventListener('click', () => {
        if (isPlaying) pauseMeditation();
        else playMeditation();
    });
    if(stopBtn) stopBtn.addEventListener('click', (closeMeditationPlayer));

    setupAuthObserver(auth, db); // Observador de autenticação
    initBreathingExercise(); // Inicializa o exercício de respiração


    // --- INICIALIZAÇÃO ---
    initNavigation();
    initMobileMenu();
    initModal();
    initDailyGoal();
    renderAllContent('all');
    initMeditationFilters();
    initAuthForms(); 
    formatTime();
    initMeditationPlayer(); // Inicializa o player de meditação

    // --- NAVEGAÇÃO E CONTROLES GERAIS ---
    function initNavigation() {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo(link.getAttribute('href'));
            });
        });
    }
    window.navigateTo = (targetId) => {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelector(targetId).classList.add('active');
        document.querySelectorAll('.nav-links a').forEach(l => {
            l.classList.remove('active');
            if(l.getAttribute('href') === targetId) l.classList.add('active');
        });
        const navLinksMenu = document.querySelector('.nav-links');
        if (navLinksMenu) navLinksMenu.classList.remove('active');
        window.scrollTo(0, 0);
    };
    function initMobileMenu() {
        const menuToggle = document.querySelectorAll('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        const navbar = document.querySelector('.navbar');

        menuToggle.forEach(toggle => { // Adiciona evento em ambos
            toggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                navbar.classList.toggle('menu-open');
            });
        });
    }
    function initModal() {
        // Seleciona os elementos
        const loginModal = document.getElementById('login-modal');
        const registerModal = document.getElementById('register-modal');
        
        // Botões de fechar ( dois)
        const closeBtns = document.querySelectorAll('.close-btn');
        
        // Links de troca
        const showRegisterLink = document.getElementById('show-register-link');
        const showLoginLink = document.getElementById('show-login-link');

        // Fecha QUALQUER modal ao clicar no 'X'
        closeBtns.forEach(btn => {
            btn.onclick = () => {
                loginModal.style.display = 'none';
                registerModal.style.display = 'none';
            };
        });

        // Fecha QUALQUER modal ao clicar fora
        window.onclick = (event) => {
            if (event.target == loginModal) loginModal.style.display = 'none';
            if (event.target == registerModal) registerModal.style.display = 'none';
        };
        
        // Troca: do modal de Login -> para o de Cadastro
        showRegisterLink.onclick = (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'flex';
        };
        
        // Troca: do modal de Cadastro -> para o de Login
        showLoginLink.onclick = (e) => {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'flex';
        };
    }
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
//Função para cuidar dos formulários de login e cadastro
function initAuthForms() {
    const registerForm = document.getElementById('register-form');
    const registerError = document.getElementById('register-error-message');
    const registerModal = document.getElementById('register-modal');
    
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error-message');
    const loginModal = document.getElementById('login-modal');
    // --- LÓGICA DE CADASTRO  ---
    if(registerForm){
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento da página
    
        // Pega os valores dos campos
        const name = registerForm['register-name'].value;
        const email = registerForm['register-email'].value;
        const password = registerForm['register-password'].value;
        const confirmPassword = registerForm['register-confirm-password'].value;
    
        // Valida (senhas batem)
        if (password !== confirmPassword) {
            registerError.textContent = 'As senhas não conferem.';
            return; // Para a execução
        }
     
        registerError.textContent = ''; // Limpa erros antigos
    
        // Chama o Firebase Auth 
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Usuário foi criado com sucesso!
                const user = userCredential.user;

                //Salva dados extras no Firestore
                //Usamos o user.uid (ID único) como ID do documento
                return db.collection('users').doc(user.uid).set({
                    nome: name,
                    email: email,
                    dataCadastro: firebase.firestore.FieldValue.serverTimestamp() // Bônus: salva a data
                });
            })
        
            .then(() => {
                // Sucesso ao salvar no Firestore
                console.log('Usuário cadastrado e dados salvos!');
                
                // Fecha o modal
                registerModal.style.display = 'none';
                
                // (O Item 4 cuidará de atualizar a UI para "logado")
            })
            .catch((error) => {
                // Deu erro
                console.error("Erro no cadastro: ", error.code, error.message);
                if (error.code === 'auth/email-already-in-use') {
                    registerError.textContent = 'Este e-mail já está em uso.';
                } else if (error.code === 'auth/weak-password') {
                    registerError.textContent = 'A senha deve ter no mínimo 6 caracteres.';
                } else {
                    registerError.textContent = 'Ocorreu um erro ao cadastrar. Tente novamente.';
                }
            });
        });
    }


    // --- LÓGICA DE LOGIN ---
    if(loginForm){
        
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm['email'].value;
            const password = loginForm['password'].value;
            
            loginError.textContent = ''; // Limpa erros

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Login com sucesso
                    console.log('Usuário logado:', userCredential.user.uid);
                    loginModal.style.display = 'none';
                    // O setupAuthObserver cuidará de atualizar a UI
                })
                .catch((error) => {
                    console.error("Erro no login: ", error.code, error.message);
                    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                        loginError.textContent = 'E-mail ou senha inválidos.';
                    } else {
                        loginError.textContent = 'Ocorreu um erro ao fazer login.';
                    }
                });
        });
    }
    }   

       

    // --- META DIÁRIA (HOME) ---
    function initDailyGoal() {
        const goal = 15; // 15 minutos
        let currentProgress = 0;
        const circle = document.getElementById('daily-goal-circle');
        const text = document.getElementById('daily-goal-text');
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;

        function updateProgress(minutes) {
            currentProgress = Math.min(goal, currentProgress + minutes);
            const offset = circumference - (currentProgress / goal) * circumference;
            circle.style.strokeDashoffset = offset;
            text.textContent = `${currentProgress}/${goal} min`;
        }

        document.getElementById('add-progress-btn').addEventListener('click', () => updateProgress(5));
        updateProgress(0); // Inicia com 0
    }

    // --- RENDERIZAÇÃO DE CONTEÚDO DINÂMICO ---
    function renderAllContent(meditationFilter) {
        // Meditações
        const medContainer = document.getElementById('meditation-list');
        medContainer.innerHTML = '';
        meditations.filter(m => meditationFilter === 'all' || m.category === meditationFilter)
        .forEach(med => {
            medContainer.innerHTML += `
                <div class="card ${med.locked ? 'locked' : ''}" style="position: relative;">
                    ${med.locked ? '<i class="fas fa-lock card-lock-icon"></i>' : ''}
                    <h4><i class="${med.icon}"></i> ${med.title}</h4>
                    <p class="text-muted">${med.duration}</p>
                    <button class="btn btn-secondary" ${med.locked ? 'disabled' : ''}>▶ Iniciar</button>
                </div>`;
        });

        
        // Comunidade
        const communityContainer = document.getElementById('community-list');
        communityContainer.innerHTML = '';
        communityTopics.forEach(topic => {
            communityContainer.innerHTML += `
                <div class="card">
                    <h4><i class="${topic.icon}"></i> ${topic.title}</h4>
                    <p class="text-muted">${topic.members} membros</p>
                    ${topic.supervised ? '<span class="tag supervised">Supervisionado</span>' : '<span class="tag">Aberto</span>'}
                    <button class="btn btn-secondary">${topic.external ? 'Acessar WhatsApp' : 'Entrar'}</button>
                </div>`;
        });

         
        document.body.addEventListener('click', (e) => {
            const playBtn = e.target.closest('.btn-play-game');
            if (playBtn) {
                const gameId = playBtn.dataset.gameId;
                if (gameId === 'word-search') initWordSearchGame(); // Inicializa o jogo de caça-palavras;
                else alert('Jogo não implementado ainda.');
            }

            const metBtn = e.target.closest('.btn-start-meditation');
            if (metBtn) {
                const id = parseInt(metBtn.dataset.id);
                const med = meditations.find(m => m.id === id);
                if (med) openMeditationPlayer(med);
            }

            if (e.target.classList.contains('close-btn')) {
                document.querySelectorAll('.modal').forEach(modal => m.style.display = 'none');
                pauseMeditation();
                document.removeEventListener('mouseup', handlePointerUp);
                document.removeEventListener('touchend', handlePointerUp);
                if (gameTimerInterval) clearInterval(gameTimerInterval);
            }

        });
         const ppBtn = document.getElementById('player-play-pause-btn');
        if(ppBtn) ppBtn.addEventListener('click', () => isPlaying ? pauseMeditation() : playMeditation());

                
        

        // Vídeos
        const videosContainer = document.getElementById('videos-list');
        videosContainer.innerHTML = '';
        videos.forEach(video => {
            videosContainer.innerHTML += `
                <div class="card">
                    <h4>${video.title}</h4>
                    <p class="text-muted">${video.author} - ${video.duration}</p>
                    <button class="btn btn-secondary">Assistir</button>
                </div>`;
        });
        
        // Planos
        const plansContainer = document.querySelector('.plans-container');
        plansContainer.innerHTML = '';
        plans.forEach(plan => {
            plansContainer.innerHTML += `
                <div class="card plan-card ${plan.popular ? 'popular' : ''}">
                    <h4>${plan.name}</h4>
                    <h3>${plan.price}</h3>
                    <ul>
                        ${plan.features.map(f => `<li><i class="fas fa-check-circle"></i> ${f}</li>`).join('')}
                    </ul>
                    <button class="btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}">
                        ${plan.price === 'Gratuito' ? 'Começar Agora' : 'Assinar'}
                    </button>
                </div>
            `;
        });
    }

    function initMeditationFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderAllContent(btn.dataset.filter);
            });
        });
    }

    setupAuthObserver(); // Observador de autenticação
    renderAllContent();
    initBreathingExercise(); // Inicializa o exercício de respiração
    // Navega para a home page ao carregar
    navigateTo('#home');
});
