# Padrão — formulário longo como checklist de seções

Um formulário longo tem um defeito estrutural que nenhum ajuste de espaçamento conserta:
**ele mostra tudo o tempo todo**. Doze campos empilhados custam a mesma atenção estejam
respondidos ou não, o usuário perde a conta do que falta, e a tela cresce até virar duas ou
três rolagens de parede uniforme. Refinar esse layout — medida de linha, ritmo, hierarquia
— melhora o craft e não muda o problema.

O checklist de seções muda. Cada assunto vira **uma linha** que ou pede algo ou **mostra o
que já foi respondido**; abrir uma linha revela os campos daquele assunto e recolhe as
demais. O formulário passa a caber numa tela e a responder sozinho "quanto falta".

Referência viva do padrão: Brevo (editor de campanha), Mailchimp, Stripe Checkout
settings. Implementação canônica no SquadOS: `src/components/ui/sectioned-form.tsx`,
documentada em `DESIGN.md` §SectionedForm.

## Quando aplicar

- **4+ assuntos distintos** no mesmo formulário (não 4 campos — 4 *assuntos*: um endereço
  com seis campos é UM assunto).
- O usuário vai **voltar** a um assunto já respondido (revisão, rascunho, configuração).
- Existe uma **ação final** que depende de todos os assuntos estarem de pé.

## Quando NÃO aplicar

- **1–3 campos seguidos.** O padrão cobra um clique por assunto; sem checklist para
  devolver visão do todo, é só atrito.
- **Fluxo linear de mão única** (onboarding que nunca volta) — ali um wizard com passos
  numerados é mais honesto: ele promete uma ordem, e o checklist promete o contrário.
- **Formulário onde tudo precisa ser visto junto** para a decisão fazer sentido (comparar
  campos entre si, conferir um total).

## Anatomia

```
┌───────────────────────────────────────────────────────────┐
│ ✓  Remetente                              [   Editar   ]  │  ← respondida: resumo
│    Sem Codar · curso@semcodar.com.br                      │
├───────────────────────────────────────────────────────────┤
│ ●  Destinatários                       [ Adicionar    ]   │  ← pendente: descrição
│    Quem recebe a sua campanha                             │
├───────────────────────────────────────────────────────────┤
│ ●  Assunto                                            ✕   │  ← ABERTA: painel elevado
│    Escreva a linha de assunto                             │
│                                                           │
│    [ campos do assunto ]                                  │
│                             Cancelar   [   Salvar   ]     │
├───────────────────────────────────────────────────────────┤
│    (demais seções a 45% de opacidade, inert)              │
└───────────────────────────────────────────────────────────┘
│ ☐ Li e aceito …                                           │  ← rodapé, fora da lista
│ [ Ação final ]                                            │
└───────────────────────────────────────────────────────────┘
```

Sete decisões, e cada uma carrega peso:

1. **Bolinha de estado** — ✓ preenchido em verde quando respondida, círculo vazio com
   ponto cinza quando não. É o único elemento que se lê em varredura vertical; é ele que
   responde "quanto falta" sem ler texto nenhum.
2. **O resumo substitui a instrução.** Fechada e respondida, a linha mostra **o valor**
   ("7.718 destinatários", "Av. Paulista, 1000, São Paulo — SP"), não a descrição do que
   ela pedia. Manter a descrição depois de respondida é o erro mais comum ao copiar este
   padrão: a lista deixa de ser um relatório do estado e vira um menu.
3. **Uma aberta por vez**, com as demais **esmaecidas e `inert`** — não só opacidade. Sem
   o `inert`, um clique fora derruba o que estava sendo digitado.
4. **O botão da linha muda de verbo** com o estado: *Adicionar* enquanto pendente,
   *Editar* depois. Verbo fixo ("Configurar") apaga a informação que o estado carrega.
5. **`Salvar` precisa salvar de verdade, e `Cancelar` e `X` descartam.** Se já existe
   usuário, cada seção PERSISTE ao salvar: o botão espera a escrita e a seção só fecha
   quando ela passa. Um "Salvar" que fecha antes de gravar é uma mentira que o usuário só
   descobre ao voltar — e o padrão inteiro promete justamente que dá para sair no meio.
   Diga isso na tela, numa linha ("suas respostas ficam salvas — pode fechar e continuar
   depois"): sem a frase, ninguém arrisca sair. Com salvamento explícito, um fechar que
   MANTÉM edição não gravada vira armadilha, então `X` e `Cancelar` passam a fazer a mesma
   coisa: descartar o que mudou desde a abertura. A exceção é o formulário de CADASTRO na
   plataforma, onde ainda não existe conta para guardar nada — ali o estado fica no front.

   O rascunho é **por organização**, não por usuário, quando o que se configura é a
   organização: dois admins preenchendo metade cada um é o caso real, e um rascunho por
   usuário faria o segundo ver a tela em branco.
6. **O fecho fica no rodapé, fora da lista, e à DIREITA.** Aceite e ação final numa faixa
   própria; como mais uma linha da lista, somem entre as outras. O botão vai na borda
   direita — é onde a leitura termina e onde o `Salvar` de cada seção já ensinou a procurar;
   à esquerda ele briga com o aceite e parece um controle secundário.

7. **Container centralizado, e um jeito de VOLTAR.** Uma coluna estreita encostada à
   esquerda deixa a tela torta contra o resto do layout (`mx-auto`). E um formulário longo
   costuma ser destino próprio: sem um "Voltar" explícito, a única saída é a navegação
   global, o que na prática significa abandonar o preenchimento sem saber se ele sobreviveu.

## Craft dentro do painel aberto

Valem as regras normais de formulário — e três que este padrão torna visíveis:

- **Rótulo e campo se pareiam com `flex`/`gap`, não com `space-y-*`.** No Tailwind 4
  `space-y-*` compila para `margin-bottom` no filho, e margem vertical **não se aplica a
  elemento inline**: um `<label>` inline (o de shadcn/Radix é) engole o espaçamento
  inteiro, e o gap medido fica em ~3px por mais que você aumente o valor. Confira o `display` do rótulo antes de aumentar a margem.
- **Instrução ANTES das opções.** "Pode escolher mais de uma" embaixo de oito caixas chega
  depois de a escolha ter sido feita.
- **Grade sem órfão.** Numa grade de 2 colunas, faça os campos largos ocuparem a linha
  inteira (`col-span-2`) de modo que a contagem de células feche par. Um campo sozinho na
  última linha, com metade da linha vazia, é o defeito que mais denuncia layout não
  desenhado.

## Ao propor este padrão numa auditoria

No `audit`, o gatilho para sugeri-lo é medível, não é gosto: **altura do conteúdo maior que
~2 viewports** somada a **3+ blocos de pergunta de mesmo peso visual**. Registre como
finding de Camada 2 (`## Crítica perceptual`), com a altura medida como evidência, e a
proposta nomeando o padrão.

Cuidado com o regime (`SKILL.md` §Abertura): trocar uma coluna de campos por um checklist
**muda a estrutura da tela**, não só o craft. Num refino, isso só entra com o usuário
avisado — é a maior mudança que um refino comporta antes de virar redesign.
