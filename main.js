//Vars
const pontos = document.getElementById("ponto")
const lf = document.getElementById("vida")
const gameOver = document.getElementById("perdeu")
const Win = document.getElementById("ganhou")
const restart = document.getElementsByClassName("Reset")
let pontosL = 0
let lfL = 10
let GameOver = false


//criar cena
const Cena = new THREE.Scene()
Cena.background = new THREE.Color(0x000000)

//camera
const Camera = new THREE.PerspectiveCamera(75, window.innerWidth /window.innerHeight, 0.1, 1000)

//render
const Render = new THREE.WebGLRenderer()
Render.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(Render.domElement)

//criar nave(jogador)
const NaveGEO = new THREE.BoxGeometry(1, 0.5, 0.5)
const NaveMat = new THREE.MeshStandardMaterial({color:0x00ff00})
const Nave = new THREE.Mesh(NaveGEO, NaveMat)
Nave.position.y = -3
Cena.add(Nave)

//luz
const Luiz = new THREE.AmbientLight(0xffffff, 0.5)
Cena.add(Luiz)
const LuizD = new THREE.DirectionalLight(0xffffff, 1)
LuizD.position.set(5, 5, 5)
Cena.add(LuizD)
Camera.position.z = 5

//criar balas
let balas = []
function CriarBala() {
    if (gameOver) {
        return
    }
    const BalaGEO = new THREE.BoxGeometry(0.1, 0.3, 0.1)// w, h, profundida
    const BalaMat = new THREE.MeshStandartMaterial({color:0xFFE900})
    const Bala = new THREE.Mesh(BalaGEO, BalaMat)
    Bala.position.set(Nave.position.x, Nave.position.y + 0.5, Nave.position.z)
    Cena.add(Bala)
    balas.push(Bala)
}

//teclas
const teclas = {}
document.addEventListener("keydown", (e)=> {
    teclas[e.key] = true
    if (e.key === " ") {
        CriarBala()
    }
})
document.addEventListener("keyup", (e)=> teclas[e.key] = false)

//checar se deu GameOver
function checkGameOver() {
    for (let inimigo of inimgos) {
      if (  inimigo.position.y <= Nave.position.y + 0.5 && inimigo.position.x == Nave.position.x){
        return true
    }
    return lfL <= 0
}}

//animação
function Anima() {
    if (GameOver) {
        return
    }
    requestAnimationFrame(Anima)
    if (teclas["a"] || teclas["ArrowLeft"]) {
        Nave.position.x -= 0.1        
    }
        if (teclas["d"] || teclas["ArrowRight"]) {
        Nave.position.x += 0.1        
    }
    balas.forEach((bala, index)=> {
        bala.position.y += 0.3
        if (bala.position.y > 5) {
            Cena.remove(bala)
            balas.splice(index, 1)
        }
    })
    //bala colide? soon
    if (checkGameOver()) {
        GameOver = true
        gameOver.style.display = "flex"
        return
    }

    Render.render(Cena, Camera)
}
Anima()