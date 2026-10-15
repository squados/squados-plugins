# 3D.CITY · Cidade Jardim

Versão **modificada** de [3d.city, de lo-th](https://github.com/lo-th/3d.city),
com entrada direta em uma cidade jogável. O renderer Three.js, a simulação
MicropolisJS, os modelos, texturas, ícones e ferramentas pertencem ao projeto original.

Abra esta pasta por HTTP em um navegador com WebGL 2. A demo usa arquivos e um
Web Worker locais, com caminhos relativos: funciona sob `/games/3d-city/` e em
outros subdiretórios. Não depende de login, backend, chave ou serviço externo.
Na raiz deste repositório, o servidor compartilhado está em `games`: execute
`npm --prefix games ci` e `npm --prefix games start`, depois abra
`http://127.0.0.1:4387/3d-city/`.

Selecione uma ferramenta na barra original e clique no terreno para construir.
Arraste com o botão esquerdo sem ferramenta para girar; botão direito para mover;
roda para zoom; WASD/setas para mover. A barra inferior controla pausa e velocidade.
`Controles` abre as instruções; `EN`/`PT` alterna as instruções adicionadas.
O HUD e os painéis originais permanecem em inglês.

`Reiniciar` recarrega a cidade inicial de 64 × 64, com 65 edifícios e serviços,
ruas, bosque, parque central e 35.000 de fundos. Recarregar também restaura esse
estado. O save/carregador manual original continua disponível em `FILES`; a demo
não retoma automaticamente partidas anteriores.

Para reproduzir o build, dentro desta pasta:

```powershell
npm ci
npm run demo:generate
npm run build
```

O build usa os scripts Rollup originais. Fontes e artefatos gerados estão juntos;
`scripts/generate-demo.mjs` produz o save inicial com as classes e ferramentas nativas.
Consulte [UPSTREAM.md](UPSTREAM.md) para origem, mudanças, licenças e limitações,
e [VALIDATION.md](VALIDATION.md) para a evidência de navegador desta entrega.

**Licenças:** existe divergência no upstream. README/package declaram MIT, porém
`LICENSE` declara GPLv3 para MicropolisJS com termos adicionais e `COPYING`
contém a GPLv3. Esta distribuição preserva esses arquivos e avisos de terceiros;
**não se declara MIT para o pacote inteiro**. Leia [LICENSE](LICENSE),
[COPYING](COPYING) e [README original](UPSTREAM-README.md).
