// --- VARIÁVEIS DE INTERFACE ---
const pontos = document.getElementById("ponto");
const lf = document.getElementById("vida");
const gameOver = document.getElementById("perdeu");
const Win = document.getElementById("ganhou");
const telas = document.getElementById("telas");
let pontosL = 0;
let lfL = 10;
let GameOver = false;

// --- SOM ---
const AudioCTX = new (window.AudioContext || window.webkitAudioContext)();

function tocarSom(frequencia, duracao) {
    const oscilador = AudioCTX.createOscillator();
    const ganho = AudioCTX.createGain();
    oscilador.connect(ganho);
    ganho.connect(AudioCTX.destination);
    oscilador.type = "square";
    oscilador.frequency.setValueAtTime(frequencia, AudioCTX.currentTime);
    oscilador.start();
    ganho.gain.exponentialRampToValueAtTime(0.0001, AudioCTX.currentTime + duracao);
    oscilador.stop(AudioCTX.currentTime + duracao);
}

function st() { tocarSom(1000, 0.1); }
function se() { tocarSom(200, 0.3); }
function sgm() {
    tocarSom(150, 0.6);
    setTimeout(() => tocarSom(130, 0.6), 600);
}

// --- CENA ---
const Cena = new THREE.Scene();
const loader = new THREE.GLTFLoader();
Cena.background = new THREE.Color(0x000000);

// --- CÂMERA ---
const Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
Camera.position.z = 5;

// --- RENDER ---
const Render = new THREE.WebGLRenderer();
Render.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(Render.domElement);

// --- NAVE ---
let Nave;
loader.load("Models/GamerShip/scene.gltf", function (gltf) {
    Nave = gltf.scene; // CORRIGIDO: era 'gltf.Cena'
    Nave.scale.set(0.6, 0.6, 0.6);
    Nave.position.y = -3;
    Cena.add(Nave);
});

// --- BALAS ---
let balas = [];
function CriarBala() {
    if (GameOver || !Nave) return;
    const BalaGEO = new THREE.BoxGeometry(0.1, 0.3, 0.1);
    const BalaMat = new THREE.MeshStandardMaterial({ color: 0xFFE900 });
    const Bala = new THREE.Mesh(BalaGEO, BalaMat);
    Bala.position.set(Nave.position.x, Nave.position.y + 0.5, Nave.position.z);
    Cena.add(Bala);
    balas.push(Bala);
    st();
}

// --- INIMIGOS ---
let inimigos = [];
function CriarI() {
    inimigos = [];
    for (let i = -3; i <= 3; i += 1.5) {
        loader.load("Models/InimegoShip/scene.gltf", function (gltf) {
            const inimigo = gltf.scene; // CORRIGIDO
            inimigo.scale.set(0.1, 0.1, 0.1);
            inimigo.position.set(i, 2.5 + Math.random(), 0);
            inimigo.userData.velocity = 0.02 + Math.random() * 0.01;
            Cena.add(inimigo);
            inimigos.push(inimigo);
        });
    }
}
CriarI();

// --- LUZ ---
const luzAmbiente = new THREE.AmbientLight(0xffffff, 10);
Cena.add(luzAmbiente);
const luzDirecional = new THREE.DirectionalLight(0xffffff, 3);
luzDirecional.position.set(25, 25, 25);
Cena.add(luzDirecional);
Camera.position.z = 6;

// --- CONTROLE ---
const teclas = {};
document.addEventListener("keydown", (e) => {
    teclas[e.key] = true;
    if (e.key === " ") CriarBala();
});
document.addEventListener("keyup", (e) => teclas[e.key] = false);

// --- RESET ---
function reiniciar() {
    GameOver = false;
    pontosL = 0;
    lfL = 10;
    lf.textContent = lfL;
    pontos.textContent = pontosL;
    balas.forEach(b => Cena.remove(b));
    inimigos.forEach(i => Cena.remove(i));
    balas = [];
    CriarI();
    if (Nave) Nave.position.set(0, -3, 0);
    telas.style.display = "none";
    gameOver.style.display = "none";
    Win.style.display = "none";
    Anima();
}

// --- GAME OVER ---
function checkGameOver() {
    if (!Nave) return false;
    for (let inimigo of inimigos) {
        if (Math.abs(inimigo.position.x - Nave.position.x) < 0.5 &&
            Math.abs(inimigo.position.y - Nave.position.y) < 0.5) {
            return true;
        }
    }
    return lfL <= 0;
}

// --- EXPLOSÃO ---
function explodir(inimigo) {
    for (let i = 0; i < 8; i++) {
        const partGEO = new THREE.SphereGeometry(0.15);
        const partMAT = new THREE.MeshStandardMaterial({ color: 0xEBFF00 });
        const part = new THREE.Mesh(partGEO, partMAT);
        part.position.copy(inimigo.position);
        Cena.add(part);

        const dir = new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);
        let frames = 0;
        function mover() {
            if (frames > 30) {
                Cena.remove(part);
                return;
            }
            part.position.add(dir);
            frames++;
            requestAnimationFrame(mover);
        }
        mover();
    }
    Cena.remove(inimigo);
}

// --- LOOP DE ANIMAÇÃO ---
function Anima() {
    if (GameOver) return;
    requestAnimationFrame(Anima);

    // Movimento da nave
    if (Nave) {
        if (teclas["a"] || teclas["ArrowLeft"]) Nave.position.x -= 0.1;
        if (teclas["d"] || teclas["ArrowRight"]) Nave.position.x += 0.1;
    }

    // Movimento das balas
    balas.forEach((bala, i) => {
        bala.position.y += 0.3;
        if (bala.position.y > 5) {
            Cena.remove(bala);
            balas.splice(i, 1);
        }
    });

    // Colisão bala-inimigo
    balas.forEach((bala, bIndex) => {
        inimigos.forEach((inimigo, iIndex) => {
            if (Math.abs(bala.position.x - inimigo.position.x) < 0.5 &&
                Math.abs(bala.position.y - inimigo.position.y) < 0.5) {
                Cena.remove(bala);
                balas.splice(bIndex, 1);
                se();
                explodir(inimigo);
                inimigos.splice(iIndex, 1);
                pontosL++;
                pontos.textContent = pontosL;
                if (inimigos.length === 0) {
                    GameOver = true;
                    telas.style.display = "flex";
                    Win.style.display = "flex";
                }
            }
        });
    });

    // Movimento dos inimigos
    inimigos.forEach((inimigo) => {
        inimigo.position.y -= inimigo.userData.velocity;
        if (inimigo.position.y < -4) {
            inimigo.position.y = 3 + Math.random();
            inimigo.position.x = -3 + Math.random() * 6;
            lfL--;
            lf.textContent = lfL;
        }
    });

    // Game Over
    if (checkGameOver()) {
        GameOver = true;
        telas.style.display = "flex";
        gameOver.style.display = "flex";
        sgm();
        return;
    }

    Render.render(Cena, Camera);
}

Anima();
