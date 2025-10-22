# SpaceShip War 3D

Bem-vindo(a) ao SpaceShip War 3D — um joguinho 3D simples e divertido feito com Three.js! Este projeto é uma demo local que carrega modelos GLTF/GLB para controlar uma nave espacial, atirar em inimigos e tentar sobreviver o máximo possível.

## 🎮 O que é

É um jogo estilo arcade onde você pilota uma nave enquanto hordas de inimigos descem em sua direção. Você ganha pontos destruindo inimigos e perde vidas quando eles passam por baixo da tela ou colidem com você.

## 🚀 Como abrir e rodar (rápido)

> Observação: por motivos de segurança do navegador, carregar modelos 3D locais (GLTF/GLB) normalmente requer servir os arquivos por um servidor HTTP — abrir `index.html` diretamente com o `file://` pode falhar ao carregar os assets.

Passos rápidos (Windows PowerShell):

1. Abra o PowerShell na pasta do projeto (a raiz onde estão `index.html` e `main.js`).
2. Execute um servidor HTTP simples com Python (se tiver Python instalado):

```powershell
python -m http.server 8000
```

3. Abra o navegador e vá para:

```
http://localhost:8000
```

Alternativas sem Python:
- Usando Node.js (se tiver instalado): `npx http-server -p 8000`
- Extensão VS Code: "Live Server" (botão "Go Live")

## ⌨️ Controles

- A / ← : mover para a esquerda
- D / → : mover para a direita
- Espaço : atirar

## 📁 Estrutura do projeto

- `index.html` — página principal, carrega Three.js e `main.js`
- `main.js` — lógica do jogo, carregamento de modelos, render e controles
- `style.css` — estilos da interface (HUD, telas de vitória/derrota)
- `Models/` — pasta com assets 3D e texturas
  - `GamerShip/` — modelo da sua nave
  - `InimegoShip/` — modelo dos inimigos

## ⚙️ Notas técnicas rápidas

- O projeto usa Three.js r128 (carregado via CDN em `index.html`).
- O carregador GLTF é utilizado para importar os modelos na pasta `Models/`.
- O arquivo `main.js` já contém a lógica de criação de balas, inimigos, colisões, efeitos sonoros simples e telas de vitória/derrota.

## 🛠️ Problemas comuns e soluções

- Modelos não carregam (erros no console sobre carregamento): certifique-se de que você está servindo a pasta por HTTP (veja a seção "Como abrir e rodar").
- Tela em branco / renderer pequeno: verifique se o canvas está sendo anexado ao `document.body` (o `main.js` já faz isso). Reabra a página após iniciar o servidor.
- Som não toca automaticamente: navegadores exigem interação do usuário antes de tocar áudio — pressione uma tecla ou clique na página e depois atire para ouvir os efeitos.

## ✨ Como personalizar

- Troque os modelos GLTF em `Models/GamerShip/scene.gltf` e `Models/InimegoShip/scene.gltf` por outros mantend o mesmo nome e estrutura de pastas.
- Ajuste velocidade e quantidade de inimigos em `main.js` (procure por `CriarI`, `userData.velocity` ou os loops que criam inimigos).
- Adicione novas partículas e efeitos no método `explodir()`.

## 🧾 Créditos

- Desenvolvedor: DuduZeroDois
- Engines / libs: Three.js (r128)
- Modelos e texturas: incluídos nas pastas `Models/` (veja os arquivos `license.txt` ao lado dos modelos para detalhes)
