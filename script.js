let currentTask = 0;
let score = 0;
let gameTimer = null;
let heartGameActive = false;
let hearts = [];
let clickCount = 0;
let clickTimer = null;

const bgMusic = document.getElementById('bgMusic');
const tensionMusic = document.getElementById('tensionMusic');
const victoryMusic = document.getElementById('victoryMusic');

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSuccessSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function triggerEasterEgg() {
    const title = document.querySelector('.title');
    if (!title) return;
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = ['💕', '💖', '💗', '💝', '✨'][Math.floor(Math.random() * 5)];
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = '-50px';
            heart.style.fontSize = '30px';
            heart.style.zIndex = '9999';
            heart.style.pointerEvents = 'none';
            document.body.appendChild(heart);
            
            let pos = -50;
            const interval = setInterval(() => {
                pos += 5;
                heart.style.top = pos + 'px';
                if (pos > window.innerHeight) {
                    clearInterval(interval);
                    heart.remove();
                }
            }, 20);
        }, i * 100);
    }
    playSuccessSound();
}

const tasks = [
    'welcomeScreen',
    'task1Screen',
    'task2Screen',
    'task3Screen',
    'task4Screen',
    'task5Screen',
    'task6Screen',
    'countdownScreen',
    'finalScreen'
];

const photoHearts = [
    'attached_assets/Screenshot_20251030-193854_1761926122443.jpg',
    'attached_assets/Gemini_Generated_Image_e7b25ne7b25ne7b2_1761926181773.png',
    'attached_assets/Gemini_Generated_Image_2zzpqr2zzpqr2zzp_1761926181856.png',
    'attached_assets/IMG_20250926_192151_343_1761926181911.jpg',
    'attached_assets/IMG_20250926_192723_654_1761926181894.jpg'
];

function initParticles() {
    const particles = document.getElementById('particles');
    const particleEmojis = ['💕', '💖', '💗', '💓', '💝', '✨', '⭐', '🌸'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particles.appendChild(particle);
    }
}

function startQuest() {
    bgMusic.play().catch(e => console.log('Audio play failed:', e));
    showScreen(1);
    initTask1();
}

function showScreen(index) {
    tasks.forEach((task, i) => {
        document.getElementById(task).classList.toggle('active', i === index);
    });
    currentTask = index;
}

function showSuccess(callback) {
    const overlay = document.getElementById('successOverlay');
    overlay.classList.add('show');
    
    setTimeout(() => {
        overlay.classList.remove('show');
        if (callback) callback();
    }, 2000);
}

function initTask1() {
    const words = ['Пашуля', 'лучший', 'в', 'мире', '💞'];
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const container = document.getElementById('wordContainer');
    const result = document.getElementById('phraseResult');
    
    container.innerHTML = '';
    result.textContent = 'Нажми на слова в правильном порядке';
    
    let selected = [];
    
    shuffled.forEach(word => {
        const wordEl = document.createElement('div');
        wordEl.className = 'word';
        wordEl.textContent = word;
        wordEl.onclick = () => {
            if (selected.includes(word)) return;
            selected.push(word);
            wordEl.classList.add('selected');
            result.textContent = selected.join(' ');
        };
        container.appendChild(wordEl);
    });
    
    window.checkPhrase = () => {
        if (selected.join(' ') === words.join(' ')) {
            showSuccess(() => {
                showScreen(2);
                initTask2();
            });
        } else {
            result.textContent = 'Попробуй снова! 💭';
            selected = [];
            container.querySelectorAll('.word').forEach(w => w.classList.remove('selected'));
        }
    };
}

function initTask2() {
    const emojis = [
        { emoji: '💕', options: ['Романтика', 'Грусть', 'Злость', 'Веселье'], correct: 'Романтика' },
        { emoji: '😊', options: ['Счастье', 'Печаль', 'Страх', 'Удивление'], correct: 'Счастье' },
        { emoji: '🥰', options: ['Любовь', 'Гнев', 'Обида', 'Скука'], correct: 'Любовь' }
    ];
    
    const current = emojis[Math.floor(Math.random() * emojis.length)];
    document.getElementById('emojiDisplay').textContent = current.emoji;
    
    const optionsContainer = document.getElementById('emojiOptions');
    optionsContainer.innerHTML = '';
    
    current.options.forEach(option => {
        const btn = document.createElement('div');
        btn.className = 'emoji-option';
        btn.textContent = option;
        btn.onclick = () => {
            if (option === current.correct) {
                showSuccess(() => {
                    showScreen(3);
                });
            } else {
                btn.style.background = 'rgba(255, 0, 0, 0.3)';
                setTimeout(() => {
                    btn.style.background = '';
                }, 500);
            }
        };
        optionsContainer.appendChild(btn);
    });
}

function startHeartGame() {
    const canvas = document.getElementById('heartCanvas');
    const ctx = canvas.getContext('2d');
    canvas.style.display = 'block';
    
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;
    
    score = 0;
    hearts = [];
    heartGameActive = true;
    let timeLeft = 120;
    
    document.getElementById('score').textContent = score;
    document.getElementById('timer').textContent = '2:00';
    
    const timerInterval = setInterval(() => {
        timeLeft--;
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        document.getElementById('timer').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0 || score >= 100) {
            clearInterval(timerInterval);
            heartGameActive = false;
            if (score >= 100) {
                showSuccess(() => {
                    showScreen(4);
                    initTask4();
                });
            } else {
                alert('Время вышло! Попробуй еще раз! 💪');
                startHeartGame();
            }
        }
    }, 1000);
    
    function createHeart() {
        if (!heartGameActive) return;
        
        const isSpecial = Math.random() < 0.2;
        const heart = {
            x: Math.random() * (canvas.width - 40),
            y: -40,
            speed: Math.random() * 2 + 1,
            size: 30,
            isSpecial: isSpecial,
            photo: isSpecial ? photoHearts[Math.floor(Math.random() * photoHearts.length)] : null,
            emoji: isSpecial ? null : ['💕', '💖', '💗', '💝', '💓'][Math.floor(Math.random() * 5)]
        };
        hearts.push(heart);
    }
    
    const heartInterval = setInterval(() => {
        if (heartGameActive) {
            createHeart();
        } else {
            clearInterval(heartInterval);
        }
    }, 800);
    
    canvas.onclick = (e) => {
        if (!heartGameActive) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        for (let i = hearts.length - 1; i >= 0; i--) {
            const heart = hearts[i];
            const distance = Math.sqrt((x - heart.x - 15) ** 2 + (y - heart.y - 15) ** 2);
            
            if (distance < heart.size) {
                score += heart.isSpecial ? 10 : 1;
                document.getElementById('score').textContent = score;
                hearts.splice(i, 1);
                
                if (score >= 100) {
                    heartGameActive = false;
                }
                break;
            }
        }
    };
    
    const loadedImages = {};
    photoHearts.forEach(src => {
        const img = new Image();
        img.src = src;
        loadedImages[src] = img;
    });
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = hearts.length - 1; i >= 0; i--) {
            const heart = hearts[i];
            heart.y += heart.speed;
            
            if (heart.y > canvas.height) {
                hearts.splice(i, 1);
                continue;
            }
            
            if (heart.isSpecial && heart.photo && loadedImages[heart.photo]) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(heart.x + 15, heart.y + 15, 20, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(loadedImages[heart.photo], heart.x, heart.y, 30, 30);
                ctx.restore();
                ctx.strokeStyle = '#ff1493';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(heart.x + 15, heart.y + 15, 20, 0, Math.PI * 2);
                ctx.stroke();
            } else {
                ctx.font = '30px Arial';
                ctx.fillText(heart.emoji, heart.x, heart.y + 30);
            }
        }
        
        if (heartGameActive) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function initTask4() {
    const symbols = ['💕', '💖', '💗', '💝', '💓', '🌸', '⭐', '✨'];
    const pairs = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    
    const game = document.getElementById('memoryGame');
    game.innerHTML = '';
    
    let flipped = [];
    let matched = 0;
    
    pairs.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `
            <div class="card-back">❤️</div>
            <div class="card-front">${symbol}</div>
        `;
        
        card.onclick = () => {
            if (flipped.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;
            
            card.classList.add('flipped');
            flipped.push({ card, symbol, index });
            
            if (flipped.length === 2) {
                setTimeout(() => {
                    if (flipped[0].symbol === flipped[1].symbol && flipped[0].index !== flipped[1].index) {
                        flipped[0].card.classList.add('matched');
                        flipped[1].card.classList.add('matched');
                        matched += 2;
                        
                        if (matched === pairs.length) {
                            showSuccess(() => {
                                showScreen(5);
                            });
                        }
                    } else {
                        flipped[0].card.classList.remove('flipped');
                        flipped[1].card.classList.remove('flipped');
                    }
                    flipped = [];
                }, 800);
            }
        };
        
        game.appendChild(card);
    });
}

window.checkRiddle = () => {
    const input = document.getElementById('riddleInput').value.toLowerCase().trim();
    const correctAnswers = ['счастье', 'любовь', 'гармония', 'romance', 'счасье'];
    
    if (correctAnswers.some(ans => input.includes(ans))) {
        showSuccess(() => {
            showScreen(6);
            initTask6();
        });
    } else {
        alert('Подумай еще! 💭');
    }
};

function initTask6() {
    const questions = [
        {
            question: "Что делает наши отношения особенными? 💕",
            options: ["Искренность и доверие", "Только красота", "Деньги", "Ничего особенного"],
            correct: 0
        },
        {
            question: "Самое важное в паре - это... 🌟",
            options: ["Поддержка друг друга", "Споры", "Соперничество", "Равнодушие"],
            correct: 0
        },
        {
            question: "Что означает настоящая любовь? ❤️",
            options: ["Принимать человека таким, какой он есть", "Постоянно менять партнера", "Контролировать каждый шаг", "Игнорировать чувства"],
            correct: 0
        },
        {
            question: "Лучший способ показать заботу? 🎁",
            options: ["Внимание и время вместе", "Дорогие подарки", "Критика", "Молчание"],
            correct: 0
        },
        {
            question: "Что нужно для крепких отношений? 💪",
            options: ["Взаимное уважение и понимание", "Ссоры каждый день", "Секреты друг от друга", "Безразличие"],
            correct: 0
        }
    ];

    const game = document.getElementById('quizGame');
    game.innerHTML = '';
    
    let currentQuestion = 0;

    function showQuestion(index) {
        if (index >= questions.length) {
            playSuccessSound();
            showSuccess(() => {
                bgMusic.pause();
                tensionMusic.play().catch(e => console.log('Audio play failed:', e));
                showScreen(7);
                startCountdown();
            });
            return;
        }

        const q = questions[index];
        game.innerHTML = `
            <div class="quiz-question">
                <h3 class="quiz-q-text">${q.question}</h3>
                <div class="quiz-options"></div>
            </div>
        `;

        const optionsContainer = game.querySelector('.quiz-options');
        q.options.forEach((option, i) => {
            const btn = document.createElement('div');
            btn.className = 'quiz-option';
            btn.textContent = option;
            btn.onclick = () => {
                if (i === q.correct) {
                    playSuccessSound();
                    btn.classList.add('correct');
                    setTimeout(() => {
                        currentQuestion++;
                        showQuestion(currentQuestion);
                    }, 800);
                } else {
                    btn.classList.add('wrong');
                    setTimeout(() => {
                        btn.classList.remove('wrong');
                    }, 500);
                }
            };
            optionsContainer.appendChild(btn);
        });
    }

    showQuestion(0);
}

function startCountdown() {
    let count = 30;
    const timer = document.getElementById('countdownTimer');
    
    const interval = setInterval(() => {
        count--;
        timer.textContent = count;
        
        if (count <= 0) {
            clearInterval(interval);
            tensionMusic.pause();
            victoryMusic.play().catch(e => console.log('Audio play failed:', e));
            showScreen(8);
            createConfetti();
        }
    }, 1000);
}

function createConfetti() {
    const container = document.getElementById('confetti');
    const colors = ['#ff69b4', '#ff1493', '#c71585', '#ffb3d9', '#ff85c0'];
    
    for (let i = 0; i < 100; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = Math.random() * 3 + 's';
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(piece);
    }
}

window.returnToBot = () => {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.close();
    } else {
        window.location.href = 'https://t.me/BetaHelperBot';
    }
};

window.onload = () => {
    initParticles();
    
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }
    
    const title = document.querySelector('.title');
    if (title) {
        title.addEventListener('click', () => {
            clickCount++;
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 500);
            
            if (clickCount === 3) {
                triggerEasterEgg();
                clickCount = 0;
            }
        });
    }
};
