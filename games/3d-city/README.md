# Simulador de Cidades

**City Simulator**, em inglês. Planeje bairros, serviços e o futuro de **Nova Aurora**
em uma cidade 3D que já começa funcionando.

Esta adaptação do SquadOS tem identidade visual própria: selo urbano vetorial,
Prefeitura lateral, indicadores de gestão, prancheta de ferramentas com ícones e
nomes, cores verde/mineral e enquadramento para desktop ou tela estreita.
O motor, simulação, modelos 3D, texturas e ferramentas são herdados de
[3d.city, de lo-th](https://github.com/lo-th/3d.city), com Three.js e MicropolisJS.
O novo nome não representa autoria integral desses componentes.

## Jogar

Abra a pasta por HTTP em um navegador com WebGL 2. Arquivos e Web Worker são locais,
com caminhos relativos: funciona sob `/games/3d-city/` e outros subdiretórios.
Não depende de login, backend, chave ou serviço externo.

Na raiz do repositório, o servidor compartilhado está em `games`:

```powershell
npm --prefix games ci
npm --prefix games start
```

Abra `http://127.0.0.1:4387/3d-city/`. `?lang=en` abre em inglês; `EN`/`PT`
alterna a nova interface e conserva a escolha ao reiniciar. O link SquadOS volta
à seleção dos jogos.

Selecione uma ferramenta e clique no terreno para construir. As cores das ferramentas
continuam identificando os usos nativos. Sem ferramenta, arraste para girar; use o
botão direito para mover, a roda para zoom e WASD/setas para mover. A prancheta inferior
controla pausa e velocidade. `Como jogar` abre a ajuda. Em tela estreita, `Gestão`
abre a Prefeitura. Em telas baixas, role a faixa de ferramentas horizontalmente.

`Reiniciar` restaura Nova Aurora: mapa 64 × 64, 65 edifícios e serviços, ruas,
bosques, parque central e 35.000 de fundos. `Salvar e abrir` reúne o save local e
exportação JSON nativos; não há retomada automática de partidas anteriores.
A turbina eólica continua indisponível no upstream e aparece desabilitada.

## Fontes e build

Dentro desta pasta:

```powershell
npm ci
npm run demo:generate
npm run build
```

O build usa os scripts Rollup originais. Fontes e artefatos gerados estão juntos;
`scripts/generate-demo.mjs` produz o save inicial com as classes e ferramentas nativas.
Não houve mudança de engine, física ou simulação para esta identidade. Alguns campos
internos dos painéis avançados e mensagens da simulação permanecem no inglês herdado;
a interface principal, ferramentas, métricas, ajuda e títulos dos painéis têm PT-BR/EN.

Consulte [UPSTREAM.md](UPSTREAM.md) para origem, contribuições, licenças e limites,
e [VALIDATION.md](VALIDATION.md) para provas de gameplay e layout.
Previews atuais: [desktop](preview.png), [390 × 844](preview-mobile.png) e
[390 × 568](preview-mobile-short.png).

**Licenças:** existe divergência no upstream. README/package originais declaram MIT,
porém `LICENSE` declara GPLv3 para MicropolisJS com termos adicionais e `COPYING`
contém a GPLv3. Esta distribuição preserva esses textos e avisos de terceiros;
**não se declara MIT para o pacote inteiro**. Leia [LICENSE](LICENSE),
[COPYING](COPYING) e [README original](UPSTREAM-README.md).
