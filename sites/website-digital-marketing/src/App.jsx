import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const asset = (name) => `${import.meta.env.BASE_URL}${name}`;
const modules = [
  { title: 'Encontre o fio da sua ideia', short: 'Ideia e direção', duration: '1h40 de aulas', description: 'Comece pelo problema que vale resolver. Conecte o que você sabe fazer a uma necessidade específica, antes de pensar em logo ou rede social.', topics: ['Recorte de público e problema', 'Pesquisa com conversas reais', 'Uma proposta em uma frase'], deliverable: 'Seu mapa de oportunidade' },
  { title: 'Desenhe uma oferta possível', short: 'Oferta e valor', duration: '2h10 de aulas', description: 'Transforme a ideia em uma entrega que você consegue realizar. Defina formato, escopo e preço com os pés no chão.', topics: ['Formato da primeira entrega', 'Escopo, limites e experiência', 'Preço e custos da operação'], deliverable: 'Sua primeira oferta desenhada' },
  { title: 'Dê forma à sua mensagem', short: 'Mensagem e presença', duration: '2h30 de aulas', description: 'Explique o que você faz sem rodeios. Construa uma página simples e uma sequência de conteúdo que ajudem a iniciar boas conversas.', topics: ['Mensagem central e argumentos', 'Estrutura da página de apresentação', 'Conteúdo com uma função clara'], deliverable: 'Seu roteiro de comunicação' },
  { title: 'Coloque a ideia em movimento', short: 'Lançamento e rotina', duration: '1h55 de aulas', description: 'Organize um primeiro lançamento do tamanho da sua realidade. Crie uma rotina de convite, escuta e revisão para aprender com cada passo.', topics: ['Plano de lançamento em etapas', 'Conversas e acompanhamento', 'Revisão do que manter e ajustar'], deliverable: 'Seu plano de ação de 30 dias' },
];
const questions = [
  ['Preciso ter uma ideia pronta?', 'Não. O primeiro módulo começa justamente no recorte de uma ideia: o que você sabe, quem pode se beneficiar e qual problema você consegue ajudar a resolver. Você também pode usar o método para revisar uma ideia que já existe.'],
  ['A formação é para qualquer tipo de negócio?', 'A proposta foi desenhada para quem quer organizar uma primeira oferta digital de serviço, conhecimento ou conteúdo. Negócios com estoque, logística ou exigências regulatórias precisam de planejamento específico além deste método.'],
  ['Vou precisar aparecer nas redes sociais?', 'Você vai trabalhar uma mensagem clara e escolher canais que façam sentido para sua oferta. Aparecer pode ser uma escolha; o ponto de partida é saber com quem conversar e o que apresentar.'],
  ['Como funcionam as aulas e os materiais?', 'Neste modelo, a formação tem quatro módulos gravados e um caderno de exercícios. A mini-aula desta página permite experimentar uma atividade em três etapas. O conteúdo completo é demonstrativo e deve ser adaptado antes de uma oferta real.'],
  ['A inscrição desta página é real?', 'Esta é uma demonstração de template. O formulário apenas simula a confirmação na sua tela: não envia nem salva nome ou e-mail, não cria cadastro e não realiza cobrança. A instrutora, os retratos e as avaliações também são fictícios.'],
];

function Arrow({ diagonal = false, ...props }) {
  return <svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true" {...props}><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Mark({ className = '' }) {
  return <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M8 16h32M8 24h32M8 32h32M16 8v32M24 8v32M32 8v32" stroke="currentColor" strokeWidth="2.5" /><path d="M8 8h32v32H8z" stroke="currentColor" strokeWidth="2.5" /></svg>;
}

const lessonMinutes = [[22, 36, 42], [34, 46, 50], [45, 50, 55], [35, 40, 40]];
const challenges = [
  ['idea', 'Você tem conhecimento, mas ainda não sabe o que vender.'],
  ['target', 'As ideias são muitas. O próximo passo continua confuso.'],
  ['message', 'Explicar o valor do que você faz parece mais difícil do que fazer.'],
  ['layers', 'Você começa a criar e logo se perde nas ferramentas.'],
  ['people', 'Falta alguém com quem testar a ideia antes de lançar.'],
  ['spark', 'Você quer começar de um jeito que caiba na sua vida.'],
];
const features = [
  ['play', 'Aulas que viram ação', '12 aulas demonstrativas organizadas em decisões pequenas. Você entende, experimenta e segue com algo feito.'],
  ['layers', 'Um caminho completo', 'Público, oferta, mensagem e lançamento. As peças se conectam para você enxergar o negócio inteiro.'],
  ['target', 'Três projetos para explorar', 'Veja como o mesmo método ganha forma em uma oficina, um serviço e um programa de acompanhamento.'],
  ['book', 'Materiais para fazer junto', 'Mapas, roteiros e exercícios para tirar as decisões da cabeça e dar forma ao seu projeto.'],
  ['message', 'Feedback que dá direção', 'Um exemplo de acompanhamento para mostrar como perguntas e ajustes ajudam a melhorar uma oferta.'],
  ['people', 'Aprendizado com troca', 'Uma proposta de formação que aproxima ideias, pessoas e experiências. Cada percurso continua sendo seu.'],
];
const projects = [
  { name: 'Clareia', type: 'Uma oficina online', theme: 'workshop', title: 'O que você sabe pode virar uma primeira oficina.', description: 'Organize uma experiência curta, escolha uma transformação possível e faça um convite que as pessoas entendam.', brief: 'Uma pessoa que ensina organização quer experimentar uma oficina de duas horas para quem trabalha por conta própria.', decisions: ['Um público com uma rotina em comum', 'Uma entrega possível em um encontro', 'Um convite com problema, formato e próximo passo'], result: 'Uma página de apresentação e um roteiro simples para a primeira turma.' },
  { name: 'Prumo', type: 'Uma oferta de serviço', theme: 'service', title: 'Um serviço claro começa com uma boa proposta.', description: 'Defina o que entra, o que fica de fora e como o seu trabalho ajuda alguém a chegar a um resultado concreto.', brief: 'Um profissional independente quer apresentar um serviço de organização da comunicação para pequenos negócios.', decisions: ['Escopo que cabe na operação', 'Etapas e entregáveis visíveis', 'Argumentos que conectam serviço e necessidade'], result: 'Uma proposta de serviço com etapas, limites e uma apresentação que inicia a conversa.' },
  { name: 'Casa Viva', type: 'Um programa de acompanhamento', theme: 'mentoring', title: 'Um processo seu, transformado em uma experiência.', description: 'Desenhe uma sequência de encontros, materiais e pequenos avanços para acompanhar alguém de perto.', brief: 'Uma educadora quer reunir seu método em um programa de quatro encontros sobre hábitos de estudo.', decisions: ['Uma sequência com começo, meio e fim', 'Materiais que apoiam cada encontro', 'Um plano de convite e escuta para validar o formato'], result: 'Um programa enxuto, com uma jornada definida e um plano de primeiro lançamento.' },
];
const plans = [
  { name: 'Essencial', description: 'Para construir no seu ritmo.', amount: 49700, installment: 4970, items: ['Os quatro módulos completos', '12 aulas e três projetos de exemplo', 'Caderno de exercícios', 'Roteiro de primeiro lançamento'] },
  { name: 'Acompanhada', description: 'Para avançar com troca e direção.', amount: 89700, installment: 8970, featured: true, items: ['Tudo do plano Essencial', 'Revisão de um projeto', 'Encontros de perguntas e respostas', 'Comunidade de aprendizagem'] },
  { name: 'Mentoria', description: 'Para olhar de perto para a sua ideia.', amount: 149700, installment: 14970, items: ['Tudo do plano Acompanhada', 'Dois encontros individuais', 'Plano de ação para o seu contexto', 'Revisão da sua primeira oferta'] },
];
const money = (cents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

function Icon({ name, size = 24 }) {
  const paths = {
    idea: <><path d="M9 18h6m-5 3h4M8 15a7 7 0 1 1 8 0l-1 3H9l-1-3Z" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    message: <path d="M4 4h16v12H9l-5 4V4Zm4 5h8m-8 3h5" />,
    layers: <><path d="m12 3 10 5-10 5L2 8l10-5Zm-9 9 9 5 9-5m-18 5 9 5 9-5" /></>,
    people: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3m2-16a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 5" /></>,
    spark: <path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" />,
    play: <><rect x="2" y="4" width="20" height="16" rx="4" /><path d="m10 8 6 4-6 4V8Z" /></>,
    book: <><path d="M12 5v16M2 3h5a5 5 0 0 1 5 3 5 5 0 0 1 5-3h5v16h-5a5 5 0 0 0-5 2 5 5 0 0 0-5-2H2V3Z" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    plus: <path d="M12 4v16M4 12h16" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.spark}</svg>;
}

function ProjectArt({ project }) {
  return <div className={'project-art project-art--' + project.theme} aria-hidden="true">
    <span className="project-art-brand">{project.name}<span>®</span></span>
    {project.theme === 'workshop' && <><div className="sun-art"><span /><span /><span /><span /><span /><span /><span /><span /></div><p>Abra espaço<br />para o que<br /><em>importa.</em></p><span className="project-art-caption">Uma oficina para organizar o seu dia.</span></>}
    {project.theme === 'service' && <><div className="prumo-art"><span /><span /><span /><span /><span /></div><p>Boas ideias.<br />Direção clara.</p><span className="project-art-caption">Estratégia que encontra a prática.</span></>}
    {project.theme === 'mentoring' && <><div className="petal-art"><i /><i /><i /><i /></div><p>Pequenos hábitos.<br />Novos começos.</p><span className="project-art-caption">Um encontro de cada vez.</span></>}
  </div>;
}

function SectionTitle({ label, children, description, align = 'center' }) {
  return <div className={'section-heading section-heading--' + align}>
    {label && <p className="section-label">{label}</p>}
    <h2>{children}</h2>
    {description && <p className="section-description">{description}</p>}
  </div>;
}


export default function App() {
  const [selectedProject, setSelectedProject] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [paymentMode, setPaymentMode] = useState('cash');
  const [activeDialog, setActiveDialog] = useState(null);
  const [lessonStep, setLessonStep] = useState(0);
  const [problem, setProblem] = useState('');
  const [format, setFormat] = useState('Conversa individual');
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef(null);
  const confirmationActionRef = useRef(null);
  const openerRef = useRef(null);
  const currentProject = projects[selectedProject];

  useLayoutEffect(() => {
    if (activeDialog === 'enrollment' && submitted) confirmationActionRef.current?.focus({ preventScroll: true });
  }, [activeDialog, submitted]);

  useEffect(() => {
    if (!activeDialog) return undefined;
    const dialog = dialogRef.current;
    const opener = openerRef.current;
    const onClose = () => setActiveDialog(null);
    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return;
      const controls = Array.from(dialog.querySelectorAll('button:not(:disabled), input, textarea, a[href], [tabindex="0"]')).filter((element) => element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    dialog.addEventListener('close', onClose);
    dialog.addEventListener('keydown', onKeyDown);
    dialog.showModal();
    return () => {
      dialog.removeEventListener('close', onClose);
      dialog.removeEventListener('keydown', onKeyDown);
      if (dialog.open) dialog.close();
      opener?.focus({ preventScroll: true });
    };
  }, [activeDialog]);

  function openDialog(type, event) {
    openerRef.current = event.currentTarget;
    if (type === 'lesson') { setLessonStep(0); setProblem(''); setFormat('Conversa individual'); }
    setSubmitted(false);
    setActiveDialog(type);
  }
  function closeOnBackdrop(event) {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialogRef.current.close();
  }

  return <>
    <a className="skip-link" href="#programa">Pular para o programa</a>
    <main id="conteudo">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-portrait"><img src={asset('art/instructor.png')} alt="Nora Vasconcelos, instrutora fictícia da Trama" width="1586" height="992" fetchPriority="high" /></div>
        <div className="hero-content container">
          <p className="hero-brand"><Mark /> Formação Trama</p>
          <h1 id="hero-title">Crie um negócio<br className="desktop-break" /> digital com método.</h1>
          <p className="hero-subtitle">Da primeira ideia ao lançamento, com direção e prática.</p>
          <div className="hero-actions"><a className="button button-peach" href="#programa">Conhecer a formação <Arrow /></a><button className="button button-violet" onClick={(event) => openDialog('lesson', event)}>Experimentar uma aula <span className="play-triangle" aria-hidden="true" /></button></div>
          <div className="social-proof"><img src={asset('art/avatars.png')} alt="Cinco participantes fictícios, em uma composição ilustrativa de avatares" width="2079" height="756" /><div><span className="proof-stars" aria-label="Cinco estrelas ilustrativas">★★★★★</span><p>Quem aprende, recomenda.</p><small>Avaliações demonstrativas</small></div></div>
        </div>
        <div className="course-facts container"><span><Icon name="layers" size={19} /> 4 módulos conectados</span><span><Icon name="play" size={19} /> 12 aulas demonstrativas</span><span><Icon name="target" size={19} /> 3 projetos para explorar</span><span><Icon name="book" size={19} /> Do seu jeito, no seu ritmo</span></div>
      </section>

      <section className="challenges section-space container" aria-labelledby="challenges-title">
        <SectionTitle label="Talvez você esteja aqui" description="O começo fica mais fácil quando existe um caminho para seguir."><span id="challenges-title">A ideia existe.<br />Falta fazer acontecer.</span></SectionTitle>
        <div className="challenge-grid">{challenges.map(([icon, text]) => <article className="challenge-card" key={text}><span className="icon-tile"><Icon name={icon} /></span><p>{text}</p></article>)}</div>
        <p className="section-closing">Se algum desses pontos parece familiar, a Trama foi desenhada para esse começo.</p>
      </section>

      <section className="overview section-space section-indigo" id="formacao" aria-labelledby="overview-title">
        <div className="container"><SectionTitle label="Conheça a formação" description="Um método para conectar o que você sabe ao que alguém precisa."><span id="overview-title">Tudo se conecta.<br />Inclusive o seu próximo passo.</span></SectionTitle>
          <div className="formation-scene">
            <div className="scene-workbook"><img src={asset('art/course.png')} alt="Caderno e materiais de planejamento da formação Trama, gerados por IA" width="1448" height="1086" loading="lazy" /><span>Caderno de decisões</span></div>
            <div className="formation-window"><div className="window-bar"><span><i /><i /><i /></span><span><Mark /> Sua formação</span><span>Trama</span></div><div className="window-content"><div className="window-heading"><span>Do rascunho à primeira entrega</span><strong>Uma ideia sua.<br />Um caminho possível.</strong></div><div className="window-modules">{modules.map((module, index) => <div key={module.short}><span>0{index + 1}</span><p>{module.short}</p><Icon name="check" size={18} /></div>)}</div><div className="window-note"><span className="mini-dot" /> Aqui, cada módulo termina com algo que você pode usar.</div></div></div>
            <div className="scene-note"><Icon name="spark" size={30} /><p>Aprender.<br />Fazer.<br />Ajustar.</p></div>
          </div>
          <div className="feature-grid">{features.map(([icon, title, text]) => <article className="feature-card" key={title}><span className="icon-tile"><Icon name={icon} /></span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section className="program section-space section-indigo" id="programa" aria-labelledby="program-title">
        <div className="container"><SectionTitle label="O programa, por dentro" description="Quatro módulos na ordem certa. Uma entrega ao final de cada um."><span id="program-title">Da ideia ao mundo.<br />Veja o caminho completo.</span></SectionTitle>
          <div className="curriculum-grid"><div className="curriculum-list">{modules.map((module, index) => <details className="module-card" name="curriculum" open={index === 0} key={module.short}><summary><span className="module-chevron" aria-hidden="true">›</span><span>{module.short}</span><span className="module-number">Módulo 0{index + 1}</span></summary><div className="module-body"><p>{module.description}</p><ol className="lesson-list">{module.topics.map((topic, lessonIndex) => <li key={topic}><span className="lesson-number">{lessonIndex + 1}</span>{index === 0 && lessonIndex === 0 ? <button onClick={(event) => openDialog('lesson', event)}>{topic}<span>Aula aberta <span className="play-triangle" aria-hidden="true" /></span></button> : <span>{topic}</span>}<time>{lessonMinutes[index][lessonIndex]} min</time></li>)}</ol><div className="module-deliverable"><Icon name="check" size={18} /><p><span>Você coloca em prática</span><strong>{module.deliverable}</strong></p></div><span className="module-duration" data-duration>{module.duration}</span></div></details>)}</div>
            <div className="lesson-preview-card"><button className="lesson-poster" onClick={(event) => openDialog('lesson', event)} aria-label="Experimentar mini-aula Da ideia à primeira oferta"><img src={asset('art/instructor.png')} alt="" width="1586" height="992" loading="lazy" /><span className="poster-tag">Uma aula para começar</span><span className="poster-copy">Da ideia à<br />primeira oferta.</span><span className="poster-play" aria-hidden="true"><span className="play-triangle" /></span><span className="poster-format">Atividade interativa · 3 etapas</span></button><div className="lesson-preview-copy"><h3>Experimente antes de continuar.</h3><p>Escreva um problema, escolha um formato e encontre o primeiro passo da sua oferta. Tudo aqui na página.</p><button className="inline-link" onClick={(event) => openDialog('lesson', event)}>Experimentar a mini-aula <Arrow /></button></div></div>
          </div><p className="program-footnote">Conteúdo e durações ilustrativos. Abra os módulos para ver as aulas. A aula aberta é uma atividade textual, sem vídeo.</p>
        </div>
      </section>

      <section className="projects section-space container" aria-labelledby="projects-title">
        <SectionTitle label="Aprender fazendo" description="O mesmo método, aplicado a três ideias diferentes. Explore o raciocínio por trás de cada uma."><span id="projects-title">Seu conhecimento.<br />Novas possibilidades.</span></SectionTitle>
        <div className="project-grid">{projects.map((project, index) => <article className="project-card" key={project.name}><ProjectArt project={project} /><div className="project-copy"><p className="project-type">Projeto 0{index + 1} · {project.type}</p><h3>{project.title}</h3><p>{project.description}</p><button className="inline-link" onClick={(event) => { setSelectedProject(index); openDialog('project', event); }}>Explorar {project.name} <Arrow /></button></div></article>)}</div>
      </section>

      <section className="mentoring section-space section-indigo" aria-labelledby="mentoring-title"><div className="container"><SectionTitle label="Troca que faz avançar" description="Uma pergunta no momento certo pode mudar o rumo de um projeto."><span id="mentoring-title">Você não precisa<br />pensar em tudo sozinho.</span></SectionTitle>
        <div className="feedback-board"><div className="feedback-draft"><span>Meu primeiro rascunho</span><strong>Quero ajudar<br />todo mundo a<br />se organizar.</strong><span className="draft-strike" aria-hidden="true" /><p>Recorte, teste e uma nova tentativa.</p></div><div className="feedback-message"><div><span className="person-badge">N</span><p>Nora<span>Exemplo de acompanhamento</span></p></div><p>E se você começar pelas pessoas que trabalham por conta própria e precisam organizar a semana?</p><span>Uma conversa abre outra possibilidade.</span></div><div className="feedback-result"><Icon name="spark" size={28} /><p>Agora ficou<br /><strong>mais claro.</strong></p><span>Uma oficina para organizar<br />a rotina de quem trabalha por conta.</span></div></div>
        <div className="support-grid"><article><Icon name="message" /><h3>Feedback com contexto</h3><p>Veja exemplos de perguntas que ajudam a melhorar uma entrega sem perder a sua ideia.</p></article><article><Icon name="people" /><h3>Aprendizado em companhia</h3><p>Conheça uma proposta de troca entre pessoas que estão construindo seus primeiros projetos.</p></article><article><Icon name="target" /><h3>Um passo possível</h3><p>Uma jornada para experimentar, ouvir o retorno e seguir com mais direção.</p></article></div><p className="program-footnote">Acompanhamento e comunidade ilustram a proposta da formação. Não há chat ou serviço conectado nesta demonstração.</p>
      </div></section>

      <section className="instructor section-space container" aria-labelledby="instructor-title"><div className="instructor-grid"><div className="instructor-image"><img src={asset('art/instructor.png')} alt="Retrato de Nora Vasconcelos, personagem fictícia da formação Trama" width="1586" height="992" loading="lazy" /><span className="instructor-signature">Nora Vasconcelos</span></div><div className="instructor-copy"><p className="section-label">Sua guia na formação</p><h2 id="instructor-title">Menos informação solta.<br />Mais clareza para fazer.</h2><p>Na Trama, Nora conduz cada etapa com perguntas simples, exemplos e espaço para você pensar no próprio negócio.</p><p>A proposta é trocar o excesso de possibilidades por um caminho que você consegue acompanhar, experimentar e colocar no papel.</p><div className="instructor-principles"><span><Icon name="check" size={18} /> Exemplos com contexto</span><span><Icon name="check" size={18} /> Decisões que viram prática</span><span><Icon name="check" size={18} /> Espaço para o seu jeito</span></div><button className="inline-link" onClick={(event) => openDialog('lesson', event)}>Conheça a proposta na mini-aula <Arrow /></button><p className="fiction-note">Nora é uma instrutora fictícia. Retratos criados com IA para este template.</p></div></div></section>

      <section className="reviews section-space container" aria-labelledby="reviews-title"><SectionTitle label="Avaliações demonstrativas" description="Depoimentos fictícios para ilustrar esta seção do template."><span id="reviews-title">Aprender faz sentido<br />quando a ideia ganha forma.</span></SectionTitle><div className="review-grid">{[
        ['AM', 'Ana Martins', 'Eu tinha várias ideias e nenhuma ordem. O exercício de escrever a proposta em uma frase ajudou a encontrar um começo.'],
        ['RC', 'Rafael Costa', 'Gostei de pensar na primeira entrega antes de tentar montar um curso inteiro. Ficou mais fácil enxergar o que testar.'],
        ['JL', 'Joana Lima', 'O exemplo de oficina me ajudou a imaginar uma forma pequena e possível de compartilhar o que eu sei.'],
      ].map(([initials, name, text]) => <article className="review-card" key={name}><span className="proof-stars" aria-label="Cinco estrelas ilustrativas">★★★★★</span><blockquote>“{text}”</blockquote><div className="review-person"><span className="person-badge">{initials}</span><p>{name}<span>Participante fictício</span></p></div></article>)}</div></section>

      <section className="offer section-space section-indigo" id="inscricao" aria-labelledby="offer-title"><div className="container"><SectionTitle label="O próximo passo é seu" description="Três maneiras de ilustrar a oferta da sua formação. Valores e planos são demonstrativos."><span id="offer-title">Escolha o caminho.<br />Comece a construir.</span></SectionTitle><div className="payment-toggle" role="group" aria-label="Forma de pagamento demonstrativa"><button aria-pressed={paymentMode === 'cash'} onClick={() => setPaymentMode('cash')}>À vista</button><button aria-pressed={paymentMode === 'installments'} onClick={() => setPaymentMode('installments')}>Parcelado</button></div><div className="pricing-grid">{plans.map((plan, index) => <article className={'pricing-card' + (plan.featured ? ' pricing-card--featured' : '')} key={plan.name}>{plan.featured && <span className="plan-ribbon">Para construir com companhia</span>}<h3>{plan.name}</h3><p className="plan-description">{plan.description}</p><div className="plan-price"><span>{paymentMode === 'cash' ? 'Pagamento único' : '12 parcelas de'}</span><strong>{money(paymentMode === 'cash' ? plan.amount : plan.installment)}</strong><span>{paymentMode === 'cash' ? 'à vista' : 'Total ' + money(plan.installment * 12)}</span></div><button className={'button ' + (plan.featured ? 'button-peach' : 'button-outline')} onClick={(event) => { setSelectedPlan(index); openDialog('enrollment', event); }}>Escolher {plan.name} <Arrow /></button><ul>{plan.items.map((item) => <li key={item}><Icon name="check" size={18} />{item}</li>)}</ul></article>)}</div><p className="offer-disclaimer">Oferta ilustrativa. As ações abrem uma inscrição local de demonstração.<br />Nenhuma compra, cobrança ou reserva é realizada.</p><div className="offer-note"><Mark /><p>Comece pequeno. Faça com intenção.<br /><strong>Construa uma coisa que é sua.</strong></p><a href="#programa">Rever o programa <Arrow /></a></div></div></section>

      <section className="faq section-space container" id="duvidas" aria-labelledby="faq-title"><div className="faq-grid"><div><p className="section-label">Antes do primeiro passo</p><h2 id="faq-title">Ficou alguma<br />dúvida?</h2><p>O caminho também precisa<br />ser claro antes de começar.</p></div><div className="faq-list">{questions.map(([question, answer]) => <details key={question}><summary>{question}<span className="faq-symbol" aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></div></section>
    </main>
    <footer className="footer container"><a className="wordmark" href="#conteudo" aria-label="Trama, voltar ao início"><Mark />trama</a><p>Ideia, direção e prática.<br /><small>Template demonstrativo. Marca, instrutora e avaliações fictícias.</small></p><a className="footer-top" href="#conteudo">Voltar ao início <Arrow /></a></footer>
    <dialog className="modal" ref={dialogRef} aria-labelledby={activeDialog === 'lesson' ? 'lesson-title' : activeDialog === 'enrollment' ? 'enrollment-title' : activeDialog === 'project' ? 'project-title' : undefined} onClick={closeOnBackdrop}>
      {activeDialog && <button className="modal-close" aria-label="Fechar" onClick={() => dialogRef.current.close()}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" /></svg></button>}
      {activeDialog === 'lesson' && <div className="lesson"><p className="section-label">Mini-aula demonstrativa</p><h2 id="lesson-title">Da ideia à primeira oferta.</h2><ol className="lesson-progress" aria-label="Progresso da mini-aula">{['Problema', 'Formato', 'Primeiro passo'].map((step, index) => <li key={step} aria-current={index === lessonStep ? 'step' : undefined}><span>{index + 1}</span>{step}</li>)}</ol><div className="lesson-stage" aria-live="polite" aria-atomic="true" key={lessonStep}>
        {lessonStep === 0 && <><h3>Comece por um problema específico.</h3><p>“Quero ajudar todo mundo” é difícil de colocar em prática. Pense em uma pessoa e em uma dificuldade que você conhece bem.</p><label htmlFor="lesson-problem">Qual problema você quer resolver?</label><textarea id="lesson-problem" rows="3" maxLength="240" placeholder="Ex.: organizar as finanças de quem trabalha por conta própria" value={problem} onChange={(event) => setProblem(event.target.value)} /><p className="field-note">Use uma situação fictícia. O texto fica só nesta atividade.</p></>}
        {lessonStep === 1 && <><h3>Escolha uma primeira entrega pequena.</h3><p>Antes de criar um curso inteiro, experimente um formato simples para ouvir, ajudar e aprender com uma pessoa.</p><fieldset><legend>Como você prefere começar?</legend>{['Conversa individual', 'Oficina em grupo', 'Guia de exercícios'].map((option) => <label className="radio-choice" key={option}><input type="radio" name="lesson-format" value={option} checked={format === option} onChange={() => setFormat(option)} /><span>{option}</span></label>)}</fieldset></>}
        {lessonStep === 2 && <><h3>Agora você tem um ponto de partida.</h3><div className="lesson-summary"><span>O problema</span><p>{problem.trim() || 'Uma dificuldade específica que você conhece e pode ajudar a resolver.'}</p><span>A primeira entrega</span><p>{format}</p></div><p>Seu próximo passo: converse com uma pessoa que vive esse problema. Pergunte como ela lida com isso hoje e escute antes de apresentar sua ideia.</p><p className="lesson-takeaway">Uma boa oferta começa com uma boa escuta.</p></>}
      </div><div className="lesson-navigation"><span>Etapa {lessonStep + 1} de 3</span><div><button className="text-button" disabled={lessonStep === 0} onClick={() => setLessonStep((step) => step - 1)}>Voltar</button>{lessonStep < 2 ? <button className="button button-dark" onClick={() => setLessonStep((step) => step + 1)}>Avançar <Arrow /></button> : <button className="button button-dark" onClick={() => dialogRef.current.close()}>Concluir aula <Arrow /></button>}</div></div></div>}
      {activeDialog === 'enrollment' && <div className="enrollment"><p className="section-label">Formação Trama</p><h2 id="enrollment-title">Seu próximo passo começa aqui.</h2><p className="selected-plan">Plano {plans[selectedPlan].name} · Demonstração local</p>{submitted ? <div className="enrollment-success"><Mark /><div role="status" aria-live="polite"><h3>Demonstração concluída.</h3><p>Nenhum dado foi enviado ou salvo. Esta inscrição é apenas um exemplo de como a experiência funciona.</p></div><button ref={confirmationActionRef} className="button button-dark" onClick={() => { setSubmitted(false); dialogRef.current.close(); }}>Explorar novamente <Arrow /></button></div> : <><p>Experimente a inscrição demonstrativa. Use dados fictícios para conhecer o fluxo.</p><form onSubmit={(event) => { event.preventDefault(); if (event.currentTarget.reportValidity()) setSubmitted(true); }}><label htmlFor="enrollment-name">Seu nome</label><input id="enrollment-name" name="name" type="text" required minLength="2" maxLength="100" autoComplete="off" placeholder="Como podemos chamar você?" onInput={(event) => event.currentTarget.setCustomValidity(event.currentTarget.value.trim().length >= 2 ? '' : 'Informe um nome com pelo menos dois caracteres.')} /><label htmlFor="enrollment-email">Seu e-mail</label><input id="enrollment-email" name="email" type="email" required maxLength="254" autoComplete="off" placeholder="voce@exemplo.com" /><p className="form-note">Demonstração local. Nenhum dado será enviado ou salvo e nenhuma cobrança será feita.</p><button className="button button-dark" type="submit">Confirmar interesse <Arrow /></button></form></>}</div>}
      {activeDialog === 'project' && <div className="project-detail"><p className="section-label">Projeto demonstrativo · {currentProject.type}</p><h2 id="project-title">{currentProject.name}</h2><ProjectArt project={currentProject} /><h3>O ponto de partida</h3><p>{currentProject.brief}</p><h3>As decisões que dão forma</h3><ul>{currentProject.decisions.map((decision) => <li key={decision}><Icon name="check" size={18} />{decision}</li>)}</ul><div className="project-result"><span>A entrega deste projeto</span><p>{currentProject.result}</p></div><p className="fiction-note">Marca e situação fictícias, criadas para ilustrar o método.</p><button className="button button-dark" onClick={() => dialogRef.current.close()}>Continuar explorando <Arrow /></button></div>}
    </dialog>
  </>;
}
