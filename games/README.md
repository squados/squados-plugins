# Jogos demonstrativos do SquadOS Studio

Três jogos de navegador adaptados das bases escolhidas pelo usuário. Cada pasta é
um pacote independente, com o jogo, suas fontes e recursos, créditos, licença e
prévia real. O [índice visual](index.html) abre cada demonstração diretamente.

| Jogo | Demonstração | Origem e documentação |
| --- | --- | --- |
| [3D City](3d-city/) | Construção e simulação de uma cidade 3D já preparada | [lo-th/3d.city](https://github.com/lo-th/3d.city) · [README](3d-city/README.md) |
| [HexGL](hexgl/) | Corrida futurista 3D, com pista e controles locais | [BKcore/HexGL](https://github.com/BKcore/HexGL) · [README](hexgl/README.md) |
| [Clumsy Bird](clumsy-bird/) | Voo, obstáculos e pontuação; primeiro toque começa a partida | [ellisonleao/clumsy-bird](https://github.com/ellisonleao/clumsy-bird) · [README](clumsy-bird/README.md) |

Os nomes e a autoria dos projetos originais são preservados. As adaptações do
SquadOS simplificam a entrada e os controles de demonstração. Não há autenticação,
backend, ranking remoto ou serviço externo obrigatório. A interface nova oferece
PT-BR e inglês; os jogos mantêm sua apresentação e mecânicas próprias.

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
alterar seus arquivos; o 3D City tem seu próprio processo de build.

## Licenças e publicação

**A licença MIT da raiz de squados-plugins não substitui as licenças dos jogos.**
Os arquivos de licença e os avisos por arquivo das bases foram preservados. Os
snapshots e as modificações estão documentados nos registros de cada pacote.

| Pacote | Termos encontrados no snapshot utilizado | Consequência para esta entrega |
| --- | --- | --- |
| 3D City | Metadados MIT, mas `LICENSE`/`COPYING` incluem GPLv3 e termos adicionais do Micropolis | Preservar o conjunto, seus créditos e fontes; não rotular tudo como MIT |
| HexGL | MIT geral, com cabeçalhos **CC BY-NC 3.0** em arquivos centrais; áudio com licença CC BY 3.0 | A versão local está preparada para demonstração. A autorização para distribuição/uso comercial precisa ser resolvida antes de publicar neste contexto |
| Clumsy Bird | `LICENSE.md` GPLv3; indicação MIT do package antigo é inconsistente | Preservar GPLv3, autoria, fontes e licenças das dependências |

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
são capturas do jogo real. A [verificação integrada](QA.md) do índice e dos caminhos
sob `/games/` passou com a ressalva documentada de eventos de cancelamento de HDR
no Chromium após consumo completo dos arquivos. Desempenho em navegador headless
não representa FPS em aparelhos dos usuários; compatibilidade com Safari, Firefox
e aparelhos físicos exige verificação própria.
