// Firebase JS SDK v7.20.0 
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
            const bestTimeEl = document.getElementById('word-search-best-time');
            if (bestTimeEl) {
                bestTimeEl.textContent = '--:--';
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // --- DADOS DE EXEMPLO ---
    const meditations = [
        { title: 'Respiração para Alívio', duration: '5 min', category: 'ansiedade', icon: 'fas fa-shield-heart', locked: false },
        { title: 'Mindfulness Básico', duration: '10 min', category: 'ansiedade', icon: 'fas fa-person-praying', locked: false },
        { title: 'Foco para o Trabalho', duration: '15 min', category: 'foco', icon: 'fas fa-crosshairs', locked: false },
        { title: 'Concentração Plena', duration: '10 min', category: 'foco', icon: 'fas fa-bullseye', locked: false },
        { title: 'Relaxamento para Dormir', duration: '20 min', category: 'sono', icon: 'fas fa-moon', locked: false },
        { title: 'Escaneamento Corporal', duration: '15 min', category: 'sono', icon: 'fas fa-bed', locked: false },
        { title: 'Meditação Avançada de Foco', duration: '30 min', category: 'foco', icon: 'fas fa-brain', locked: true },
        { title: 'Redução de Estresse Profundo', duration: '25 min', category: 'ansiedade', icon: 'fas fa-wave-square', locked: true },
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

    // --- INICIALIZAÇÃO ---
    initNavigation();
    initMobileMenu();
    initModal();
    initDailyGoal();
    renderAllContent('all');
    initMeditationFilters();
    initBreathingExercise();
    initAuthForms();
    initWordSearchGame();
    setupAuthObserver(auth, db); // Observador de autenticação

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
        meditations.filter(m => meditationFilter === 'all' || m.category === m.category)
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

        // Jogos
        const gamesContainer = document.getElementById('games-list');
        gamesContainer.innerHTML = '';
        games.forEach(game => {
            gamesContainer.innerHTML += `
                <div class="card">
                    <h4><i class="${game.icon}"></i> ${game.title}</h4>
                    <p class="text-muted">${game.description}</p>
                    <button class="btn btn-secondary" data-game-id="${game.id || ''}">Jogar</button>
                </div>`;
        });
        

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

    // --- EXERCÍCIO DE RESPIRAÇÃO ---
    function initBreathingExercise() {
        const circle = document.querySelector('.breathing-circle');
        const instruction = document.querySelector('.breathing-instruction');
        const timerDisplay = document.querySelector('.timer-display');
        const durationBtns = document.querySelectorAll('.btn-duration');
        let timerInterval = null;

        durationBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if(timerInterval) clearInterval(timerInterval);
                durationBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                startExercise(parseInt(btn.dataset.duration));
            });
        });

        function startExercise(totalTime) {
            let remainingTime = totalTime;
            circle.classList.add('animate');
            instruction.textContent = 'Acompanhe o círculo...';
            updateTimerDisplay(remainingTime);
            timerInterval = setInterval(() => {
                remainingTime--;
                updateTimerDisplay(remainingTime);
                if (remainingTime < 0) finishExercise();
            }, 1000);
        }

        function finishExercise() {
            clearInterval(timerInterval);
            timerInterval = null;
            circle.classList.remove('animate');
            instruction.textContent = 'Exercício Completo!';
            timerDisplay.textContent = "00:00";
            durationBtns.forEach(b => b.classList.remove('active'));
        }
        
        function updateTimerDisplay(time) {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }
    function initWordSearchGame() {
        const gameModal = document.getElementById('word-search-modal');
        const gamesContainer = document.getElementById('games-list');
    }
    
    // Navega para a home page ao carregar
    navigateTo('#home');
});



