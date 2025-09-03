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

//animação
function Anima() {
    requestAnimationFrame(Anima)
    Render.render(Cena, Camera)
}
Anima()