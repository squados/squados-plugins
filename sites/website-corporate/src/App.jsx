import { useEffect, useRef, useState } from "react";
const artwork = `${import.meta.env.BASE_URL}art/editorial.png`;
const services = [{
  id: "strategy",
  name: "Estratégia",
  title: "Escolher o que move o negócio.",
  description: "Quando tudo parece prioridade, crescer custa mais energia. Conectamos a ambição da empresa às escolhas que fazem sentido para seu momento, seu mercado e sua capacidade de executar.",
  deliverables: ["Diagnóstico do negócio e das oportunidades", "Prioridades e escolhas estratégicas", "Plano de ação com responsáveis e indicadores"],
  caption: "Uma direção compartilhada. Escolhas que se conectam."
}, {
  id: "operations",
  name: "Operação",
  title: "Fazer a estratégia acontecer.",
  description: "O plano encontra a realidade no dia a dia. Olhamos o trabalho de ponta a ponta para reduzir atritos, organizar a capacidade e criar uma rotina de gestão que a equipe consegue sustentar.",
  deliverables: ["Mapa de processos e pontos de atrito", "Redesenho de fluxos e responsabilidades", "Rotina de gestão e indicadores operacionais"],
  caption: "Menos atrito entre as etapas. Mais fluidez no trabalho."
}, {
  id: "people",
  name: "Pessoas",
  title: "Dar autonomia para avançar.",
  description: "Uma empresa muda quando as pessoas entendem seu papel nessa mudança. Aproximamos lideranças e equipes das decisões, com acordos claros e espaço para aprender fazendo.",
  deliverables: ["Lideranças alinhadas às prioridades", "Papéis, decisões e acordos de equipe", "Plano de desenvolvimento na prática"],
  caption: "Pessoas com clareza. Uma organização que aprende."
}];
const steps = [{
  title: "Escutar",
  text: "Começamos com perguntas. Entendemos o contexto com quem decide e com quem vive a operação.",
  output: "Um ponto de partida comum"
}, {
  title: "Dar clareza",
  text: "Organizamos os fatos, tornamos os desafios visíveis e escolhemos o que merece atenção primeiro.",
  output: "Prioridades bem definidas"
}, {
  title: "Construir junto",
  text: "Traduzimos as escolhas em um plano possível. Testamos soluções com as pessoas que vão colocá-las de pé.",
  output: "Um plano que cabe na realidade"
}, {
  title: "Sustentar",
  text: "Acompanhamos a aplicação, ajustamos a rota e deixamos uma rotina que funciona sem depender de nós.",
  output: "Capacidade para continuar"
}];
const cases = [{
  id: "capacity",
  sector: "Serviços",
  title: "Crescer sem perder o cuidado com a entrega.",
  text: "Uma empresa de serviços precisa equilibrar novas vendas e a capacidade do time.",
  image: "team",
  challenge: "A carteira aumenta, mas os prazos são combinados sem uma visão comum da capacidade disponível.",
  approach: "Mapear a jornada da venda à entrega, identificar limites e criar uma reunião curta de capacidade com comercial e operação.",
  output: "Mapa de capacidade, critérios para aceitar novas demandas e um painel de acompanhamento semanal."
}, {
  id: "factory",
  sector: "Indústria",
  title: "Conectar o planejamento ao chão de fábrica.",
  text: "Uma operação industrial busca mais previsibilidade entre pedidos, produção e expedição.",
  image: "industry",
  challenge: "Mudanças frequentes na programação fazem cada área trabalhar com uma versão diferente da prioridade.",
  approach: "Observar o fluxo de pedidos, tornar as restrições visíveis e testar um ciclo integrado de planejamento com a equipe.",
  output: "Fluxo de planejamento, regras de priorização e indicadores compartilhados de prazo e capacidade."
}, {
  id: "retail",
  sector: "Varejo",
  title: "Uma experiência consistente em cada unidade.",
  text: "Uma rede em expansão quer organizar a rotina sem perder a identidade de cada loja.",
  image: "report",
  challenge: "A abertura de novas unidades amplia as diferenças na reposição, no atendimento e nas decisões do dia a dia.",
  approach: "Escutar as equipes de loja, identificar as boas práticas existentes e construir padrões mínimos com espaço para o contexto local.",
  output: "Guia de operação, matriz de decisões e rotina de troca entre as lideranças das unidades."
}, {
  id: "leaders",
  sector: "Serviços",
  title: "Decisões que não precisam esperar pelo fundador.",
  text: "Uma empresa familiar prepara sua próxima etapa com mais autonomia para as lideranças.",
  image: "notebook",
  challenge: "Decisões recorrentes se concentram em uma pessoa, criando espera e sobrecarga para toda a organização.",
  approach: "Explicitar quais decisões pertencem a cada papel e experimentar novos acordos de autonomia em uma área piloto.",
  output: "Matriz de decisões, acordos de liderança e encontros de acompanhamento da transição."
}];
function Compass() {
  return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="1.2" />
      <path d="M32 0v64M0 32h64" stroke="currentColor" strokeWidth=".8" />
      <path d="m32 5 5 22 22 5-22 5-5 22-5-22-22-5 22-5Z" fill="currentColor" />
      </svg>;
}
function Arrow({
  diagonal = false
}) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M3 12h18m-7-7 7 7-7 7"} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>;
}
function ServiceDiagram({
  type
}) {
  return <svg className="service-diagram" viewBox="0 0 360 280" role="img" aria-label={type === "strategy" ? "Três escolhas convergem para uma direção comum" : type === "operations" ? "Um fluxo conecta três etapas de trabalho" : "Lideranças e equipes conectadas em uma rede"}>
      <g fill="none" stroke="currentColor" strokeWidth="1">
    {type === "strategy" && <>
      <circle cx="180" cy="130" r="103" strokeOpacity=".25" />
      <circle cx="180" cy="130" r="67" />
      <path d="M180 12v237M61 130h238" strokeOpacity=".5" />
      <path d="m180 45 21 64 65 21-65 21-21 64-21-64-65-21 65-21Z" />
      <circle cx="180" cy="130" r="8" fill="currentColor" />
      <text x="180" y="272" textAnchor="middle">Direção</text>
      </>}
    {type === "operations" && <>
      <path d="M30 90h88v88H30zm106 0h88v88h-88zm106 0h88v88h-88Z" />
      <path d="M74 90V49h212v41M74 178v41h212v-41" strokeOpacity=".35" />
      <path d="M59 120h32m-8-8 8 8-8 8m82-8h32m-8-8 8 8-8 8m82-8h32m-8-8 8 8-8 8" />
      <text x="74" y="159" textAnchor="middle">Entender</text>
      <text x="180" y="159" textAnchor="middle">Organizar</text>
      <text x="286" y="159" textAnchor="middle">Entregar</text>
      </>}
    {type === "people" && <>
      <circle cx="180" cy="127" r="91" strokeOpacity=".25" />
      <path d="m180 37 78 135H102Zm0 0v180m-78-45 156-90M102 82l156 90M102 82h156L180 217Z" strokeOpacity=".5" />{[[180, 37], [258, 82], [258, 172], [180, 217], [102, 172], [102, 82]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="11" fill="var(--paper)" />)}<circle cx="180" cy="127" r="22" fill="currentColor" />
      <text x="180" y="272" textAnchor="middle">Confiança para decidir</text>
      </>}
  </g>
      </svg>;
}
function ContactForm() {
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const resultRef = useRef(null);
  const nameRef = useRef(null);
  const resetFocusRef = useRef(false);
  useEffect(() => {
    if (submitted) resultRef.current?.focus();else if (resetFocusRef.current) {
      nameRef.current?.focus();
      resetFocusRef.current = false;
    }
  }, [submitted]);
  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors = {};
    const email = String(data.get("email") || "").trim();
    if (!String(data.get("name") || "").trim()) nextErrors.name = "Informe seu nome.";
    if (!form.elements.namedItem("email").validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Informe um email corporativo válido.";
    else if (/^(gmail|googlemail|hotmail|outlook|live|yahoo|icloud|uol|bol|protonmail|proton)\./i.test(email.split("@")[1])) nextErrors.email = "Use o email da sua empresa.";
    if (!String(data.get("challenge") || "").trim()) nextErrors.challenge = "Conte brevemente o desafio da sua empresa.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) form.elements.namedItem(Object.keys(nextErrors)[0])?.focus();else setSubmitted(true);
  }
  if (submitted) return <div className="contact-result" role="status">
      <Compass />
      <h3 ref={resultRef} id="contact-confirmation" tabIndex="-1">Mensagem demonstrativa concluída.</h3>
      <p>Este é um formulário de demonstração. Nenhum dado foi enviado ou salvo.</p>
      <button className="button light" onClick={() => {
      resetFocusRef.current = true;
      setSubmitted(false);
    }}>Voltar ao formulário <Arrow />
      </button>
      </div>;
  return <form onSubmit={handleSubmit} noValidate>
    <div className="form-row">
      <div className="field">
      <label htmlFor="name">Nome completo <span>(obrigatório)</span>
      </label>
      <input ref={nameRef} id="name" name="name" autoComplete="name" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />{errors.name && <p className="form-error" id="name-error" role="alert">{errors.name}</p>}</div>
      <div className="field">
      <label htmlFor="company">Empresa <span>(opcional)</span>
      </label>
      <input id="company" name="company" autoComplete="organization" />
      </div>
      </div>
    <div className="field">
      <label htmlFor="email">Email corporativo <span>(obrigatório)</span>
      </label>
      <input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : "email-hint"} />
      <p className="field-hint" id="email-hint">Use seu endereço de trabalho, como nome@empresa.com.br.</p>{errors.email && <p className="form-error" id="email-error" role="alert">{errors.email}</p>}</div>
    <div className="field">
      <label htmlFor="challenge">Qual é o seu desafio? <span>(obrigatório)</span>
      </label>
      <textarea id="challenge" name="challenge" rows="3" required aria-invalid={Boolean(errors.challenge)} aria-describedby={errors.challenge ? "challenge-error" : undefined} />{errors.challenge && <p className="form-error" id="challenge-error" role="alert">{errors.challenge}</p>}</div>
    <div className="form-submit">
      <button className="button light" type="submit">Enviar mensagem <Arrow />
      </button>
      <p>Demonstração local.<br />Seus dados não são enviados nem salvos.</p>
      </div>
  </form>;
}
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(0);
  const [sector, setSector] = useState("Todos");
  const menuRef = useRef(null);
  const tabRefs = useRef([]);
  const service = services[selectedService];
  const visibleCases = cases.filter(item => sector === "Todos" || item.sector === sector);
  useEffect(() => {
    if (!menuOpen) return;
    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);
  function handleTabKey(event, index) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % services.length;else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + services.length - 1) % services.length;else if (event.key === "Home") next = 0;else if (event.key === "End") next = services.length - 1;else return;
    event.preventDefault();
    setSelectedService(next);
    tabRefs.current[next]?.focus();
  }
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="Nortea, início">
      <Compass />
      <span>nortea.</span>
      </a>
      <button ref={menuRef} className="menu-toggle" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>
      <span>{menuOpen ? "Fechar" : "Menu"}</span>
      <span className={`menu-lines${menuOpen ? " is-open" : ""}`} aria-hidden="true">
      <i />
      <i />
      </span>
      </button>
      <nav id="main-navigation" aria-label="Principal" className={menuOpen ? "is-open" : ""}>
      <a href="#servicos" onClick={() => setMenuOpen(false)}>Serviços</a>
      <a href="#metodo" onClick={() => setMenuOpen(false)}>Método</a>
      <a href="#casos" onClick={() => setMenuOpen(false)}>Casos</a>
      <a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a>
      <a className="button nav-cta" href="#contato" onClick={() => setMenuOpen(false)}>Conversar com a Nortea <Arrow />
      </a>
      </nav>
      </header>
    <main id="conteudo" tabIndex="-1">
      <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-heading">
      <p className="hero-side left">Operação<br />transforma<br />negócios</p>
      <div>
      <h1 id="hero-title">
      <span>Clareza para decidir.</span>
      <span>Método para crescer.</span>
      </h1>
      <p className="hero-subtitle">Estratégia e operação para empresas em movimento.</p>
      </div>
      <p className="hero-side right">Pessoas<br />processos<br />resultados</p>
      </div>
      <figure className="hero-art">
      <img src={artwork} width="2304" height="800" alt="Cinco perspectivas do trabalho: escritório, caderno de estratégia, equipe reunida, operação industrial e relatório editorial." fetchPriority="high" />
      </figure>
      <div className="hero-actions">
      <a className="button" href="#metodo">Conheça nossa abordagem <Arrow />
      </a>
      <a className="text-link" href="#casos">Ver casos demonstrativos</a>
      </div>
      <div className="hero-foot">
      <span>Brasil em movimento</span>
      <span>Operação com propósito</span>
      </div>
      </section>
      <section className="section services-section" id="servicos" aria-labelledby="services-title">
      <div className="section-intro">
      <div>
      <p className="section-label">O que fazemos</p>
      <h2 id="services-title">Entre a intenção<br />e a realidade.</h2>
      </div>
      <p>É nesse espaço que trabalhamos. Unimos visão de negócio, disciplina de execução e o conhecimento de quem está dentro da empresa para transformar desafios em próximos passos.</p>
      </div>
      <div className="services-workspace">
      <div role="tablist" aria-label="Nossas frentes de trabalho" className="service-tabs">{services.map((item, index) => <button key={item.id} ref={element => {
              tabRefs.current[index] = element;
            }} role="tab" id={`tab-${item.id}`} aria-controls="service-panel" aria-selected={selectedService === index} tabIndex={selectedService === index ? 0 : -1} onClick={() => setSelectedService(index)} onKeyDown={event => handleTabKey(event, index)}>{item.name}<Arrow diagonal />
      </button>)}</div>
      <div className="service-panel" role="tabpanel" id="service-panel" aria-labelledby={`tab-${service.id}`} tabIndex="0">
      <div className="service-copy" key={service.id}>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <h4>O que construímos juntos</h4>
      <ul>{service.deliverables.map(item => <li key={item}>{item}</li>)}</ul>
      </div>
      <figure className="diagram-figure">
      <ServiceDiagram type={service.id} />
      <figcaption>{service.caption}</figcaption>
      </figure>
      </div>
      </div>
      </section>
      <section className="method-section" id="metodo" aria-labelledby="method-title">
      <div className="section">
      <div className="section-intro">
      <div>
      <p className="section-label">Nosso método</p>
      <h2 id="method-title">Perto para entender.<br />Junto para fazer.</h2>
      </div>
      <p>Não chegamos com respostas prontas. Construímos um caminho com a sua equipe, conectando cada decisão ao que precisa acontecer na prática.</p>
      </div>
      <ol className="method-steps">{steps.map((step, index) => <li key={step.title}>
      <span className="step-number">0{index + 1}</span>
      <h3>{step.title}</h3>
      <p>{step.text}</p>
      <span className="step-output">{step.output}</span>
      </li>)}</ol>
      <div className="method-note">
      <Compass />
      <p>O método dá direção.<br />
      <span>O contexto de cada empresa define o caminho.</span>
      </p>
      </div>
      </div>
      </section>
      <section className="section cases-section" id="casos" aria-labelledby="cases-title">
      <div className="section-intro">
      <div>
      <p className="section-label">Possibilidades na prática</p>
      <h2 id="cases-title">Desafios diferentes.<br />Um olhar próximo.</h2>
      </div>
      <p>Estes casos demonstrativos ilustram como pensamos. São situações fictícias, criadas para apresentar nossa abordagem; não representam clientes ou resultados reais.</p>
      </div>
      <div className="case-filters" role="group" aria-label="Filtrar casos por setor">{["Todos", "Serviços", "Indústria", "Varejo"].map(item => <button key={item} aria-pressed={sector === item} onClick={() => setSector(item)}>{item}</button>)}<p role="status" aria-live="polite">{visibleCases.length} {visibleCases.length === 1 ? "caso demonstrativo" : "casos demonstrativos"}</p>
      </div>
      <div className="case-grid">{visibleCases.map(item => <article className="case" key={item.id}>
      <div className={`case-image crop-${item.image}`} role="img" aria-label={item.image === "team" ? "Equipe analisando documentos de trabalho" : item.image === "industry" ? "Centro industrial e logístico ao entardecer" : item.image === "report" ? "Relatório com linhas de um mapa topográfico" : "Caderno de planejamento com desenho de compasso"} style={{
              backgroundImage: `url("${artwork}")`
            }} />
      <div className="case-meta">
      <span>{item.sector}</span>
      <span>Exemplo demonstrativo</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
      <details>
      <summary>
      <span>Ver caso <span className="sr-only">{item.title}</span>
      </span>
      <span className="details-icon" aria-hidden="true" />
      </summary>
      <div className="case-detail">
      <h4>Desafio</h4>
      <p>{item.challenge}</p>
      <h4>Hipótese de trabalho</h4>
      <p>{item.approach}</p>
      <h4>Entregáveis propostos</h4>
      <p>{item.output}</p>
      <p className="case-disclaimer">Exemplo fictício. Não há resultado histórico ou promessa de desempenho.</p>
      </div>
      </details>
      </article>)}</div>{!visibleCases.length && <p className="empty-state">Ainda não há exemplos neste setor. Escolha Todos para conhecer as outras possibilidades.</p>}</section>
      <section className="about-section" id="sobre" aria-labelledby="about-title">
      <div className="about-image" role="img" aria-label="Pessoas reunidas em uma mesa, construindo um plano em conjunto" style={{
          backgroundImage: `url("${artwork}")`
        }} />
      <div className="about-copy">
      <p className="section-label">Sobre a Nortea</p>
      <h2 id="about-title">O negócio é feito<br />de gente.</h2>
      <p className="about-lead">Acreditamos em empresas que crescem com direção e em pessoas que sabem por que estão caminhando.</p>
      <p>A Nortea é uma marca de consultoria criada para este template. Sua proposta é representar uma equipe brasileira, com repertório em estratégia, gestão de operações e desenvolvimento de lideranças.</p>
      <p>Nossa forma de trabalhar aproxima perspectivas: a visão de quem empreende, o conhecimento de quem opera e a energia de quem quer construir o próximo passo.</p>
      <div className="team-principles">
      <span>Visão de negócio</span>
      <span>Presença na operação</span>
      <span>Construção com a equipe</span>
      </div>
      </div>
      </section>
      <section className="section faq-section" id="perguntas" aria-labelledby="faq-title">
      <div>
      <p className="section-label">Antes da conversa</p>
      <h2 id="faq-title">Algumas respostas<br />para começar.</h2>
      </div>
      <div className="faq-list">
      <details>
      <summary>Os casos apresentados são reais?<span className="details-icon" aria-hidden="true" />
      </summary>
      <p>Não. Esta é uma demonstração de website. A marca, a equipe descrita e os casos são fictícios; os exemplos mostram tipos de desafio, abordagem e entregáveis, sem alegar clientes ou resultados reais.</p>
      </details>
      <details>
      <summary>Como começa um projeto de consultoria?<span className="details-icon" aria-hidden="true" />
      </summary>
      <p>Em uma operação real, o primeiro passo seria uma conversa para entender o momento da empresa. A partir daí, seriam definidos o desafio, o escopo, as pessoas envolvidas e uma proposta de trabalho.</p>
      </details>
      <details>
      <summary>O formulário envia minha mensagem?<span className="details-icon" aria-hidden="true" />
      </summary>
      <p>Este template valida os campos e apresenta uma confirmação local. Nenhuma informação é enviada ou salva. Para receber mensagens reais, é necessário integrar um serviço de sua escolha.</p>
      </details>
      </div>
      </section>
      <section className="contact-section" id="contato" aria-labelledby="contact-title">
      <div className="section contact-grid">
      <div className="contact-copy">
      <p className="section-label">Vamos conversar</p>
      <h2 id="contact-title">Qual é o próximo<br />passo da sua<br />empresa?</h2>
      <p>Conte o que está no seu horizonte.<br />Uma boa conversa começa com uma pergunta clara.</p>
      <span className="contact-demo">Nortea é uma marca demonstrativa.</span>
      </div>
      <ContactForm />
      </div>
      </section>
    </main>
    <footer className="site-footer">
      <div className="footer-top">
      <a className="brand" href="#inicio" aria-label="Nortea, voltar ao início">
      <Compass />
      <span>nortea.</span>
      </a>
      <p>Clareza que orienta.<br />Método que movimenta.</p>
      <a className="back-top" href="#inicio">Voltar ao início <Arrow diagonal />
      </a>
      </div>
      <div className="footer-bottom">
      <span>© {new Date().getFullYear()} Nortea. Template demonstrativo.</span>
      <span>Estratégia, operação e pessoas.</span>
      </div>
      </footer>
  </>;
}
