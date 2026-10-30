# Jogos demonstrativos do SquadOS Studio

Cinco jogos de navegador: três adaptados das bases escolhidas pelo usuário e dois
originais. Cada pasta é um pacote independente, com o jogo, suas fontes e recursos,
créditos, licença e prévia real. O [índice visual](index.html) abre cada demonstração diretamente.

| Jogo | Demonstração | Origem e documentação |
| --- | --- | --- |
| [Simulador de Cidades](3d-city/) | Gestão urbana 3D, com identidade verde/mineral e cidade preparada | [lo-th/3d.city](https://github.com/lo-th/3d.city) · [README](3d-city/README.md) |
| [Corrida Espacial](hexgl/) | Corrida 3D com ambientação orbital e interface própria | [BKcore/HexGL](https://github.com/BKcore/HexGL) · [README](hexgl/README.md) |
| [Arcade 2D](clumsy-bird/) | Robô voador, cenário vetorial e portais de energia originais | [ellisonleao/clumsy-bird](https://github.com/ellisonleao/clumsy-bird) · [README](clumsy-bird/README.md) |
| [Cidade Sem Lei](lawless-city/play/) | Cidade 3D aberta para correr, roubar carros e dirigir pelo tráfego | Original SquadOS sobre Three.js, assets Kenney CC0 · [README](lawless-city/README.md) |
| [Pulo Alto](high-jump/) | Plataforma 2D de uma fase: moedas, slimes e bandeira de chegada | Original SquadOS em Canvas 2D, assets Kenney CC0 · [README](high-jump/README.md) |

Os nomes públicos são do SquadOS; os projetos que serviram de base conservam
autoria e créditos na documentação de cada pacote. As adaptações incluem identidade
visual, cenário/interface próprios e entrada direta. Não há autenticação,
backend, ranking remoto ou serviço externo obrigatório. A interface nova oferece
PT-BR e inglês. Engines e mecânicas aproveitados continuam identificados como
derivados; a identidade nova não altera as licenças herdadas.

## Execução local

Os jogos finais já são estáticos; não é necessário compilar para jogar. Para
desenvolvimento, a partir desta pasta:

```powershell
npm ci
npm start
```

O servidor local escuta somente `127.0.0.1:4387` e serve o índice em
`http://127.0.0.1:4387/`, sem abrir janela. `http-server` é ferramenta de
desenvolvimento, fixada em 14.1.1 no lock. Os jogos não dependem de Node em produção.
Use HTTP para servir os arquivos: módulos, workers e carregamento de assets não
funcionam de forma equivalente abrindo `index.html` por `file://`.

Para servir o acervo inteiro, o diretório também pode ficar sob `/games/`. As
pastas dos jogos usam caminhos relativos. Copiar um jogo exige levar a pasta
inteira, inclusive fontes e avisos legais. Leia o README específico antes de
alterar seus arquivos; o Simulador de Cidades tem seu próprio processo de build.

## Licenças e publicação

**A licença MIT da raiz de squados-plugins não substitui as licenças dos jogos.**
Os arquivos de licença e os avisos por arquivo das bases foram preservados. Os
snapshots e as modificações estão documentados nos registros de cada pacote.

| Pacote | Termos encontrados no snapshot utilizado | Consequência para esta entrega |
| --- | --- | --- |
| Simulador de Cidades / base 3d.city | Metadados MIT, mas `LICENSE`/`COPYING` incluem GPLv3 e termos adicionais do Micropolis | Preservar o conjunto, seus créditos e fontes; não rotular tudo como MIT |
| Corrida Espacial / base HexGL | MIT geral, com cabeçalhos **CC BY-NC 3.0** em arquivos centrais; áudio com licença CC BY 3.0 | A autorização para distribuição/uso comercial precisa ser resolvida antes de publicar neste contexto |
| Arcade 2D / base Clumsy Bird | `LICENSE.md` GPLv3; indicação MIT do package antigo é inconsistente | Preservar GPLv3, autoria, fontes e licenças das dependências |
| Cidade Sem Lei | Código MIT (SquadOS); Three.js MIT; modelos e sons Kenney CC0 | Preservar LICENSE, LICENSE-three.txt e LICENSE-Kenney.txt |
| Pulo Alto | Código MIT (SquadOS); sprites e sons Kenney CC0 | Preservar LICENSE e LICENSE-Kenney.txt |

O HexGL contém exceções não comerciais expressas por arquivo e, portanto, o pacote
incluído não deve ser apresentado como integralmente open-source ou liberado para
uso comercial apenas por seu LICENSE geral. Veja a identificação dos arquivos no
[README do HexGL](hexgl/README.md). Não apagamos cabeçalhos para contornar a restrição.

Os clones originais permanecem em `D:\Coding Projects\_tempsandbox`, nos snapshots
registrados abaixo. O destino dos derivados é `games/`; não há submódulos nem
dependência em tempo de execução desses clones.

| Projeto | Commit upstream |
| --- | --- |
| 3d.city | `60fc6de2451ac6cf4df211a7cdae6c55c97e73c7` |
| HexGL | `6addc95a2fce3bf05f4d751823cc054c61a16d68` |
| clumsy-bird | `fae3d487d5102af29fb3f78431cbd45e9b83aed3` |

Não houve push, deploy, escolha de hospedagem ou integração ao catálogo do Desktop.
`gallery.json` continua sendo o índice de skills. Uma hospedagem futura deve servir
os tipos MIME corretos, preservar as subpastas e disponibilizar fontes/créditos e
licenças aplicáveis, além de resolver a restrição do HexGL.

## Verificação

As evidências por jogo ficam em seus READMEs e arquivos de verificação. Os previews
são capturas das identidades atuais no jogo real. A [verificação integrada](QA.md)
do índice e dos caminhos sob `/games/` passou. O relatório documenta também eventos
intermitentes de cancelamento no Chromium após consumo completo de HDR/WASM,
com comprovação dos bytes e decodificação. Desempenho em navegador headless
não representa FPS em aparelhos dos usuários; compatibilidade com Safari, Firefox
e aparelhos físicos exige verificação própria.
