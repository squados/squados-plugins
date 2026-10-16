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

export default function App() {
  const [selectedModule, setSelectedModule] = useState(0);
  const [activeDialog, setActiveDialog] = useState(null);
  const [lessonStep, setLessonStep] = useState(0);
  const [problem, setProblem] = useState('');
  const [format, setFormat] = useState('Conversa individual');
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef(null);
  const confirmationActionRef = useRef(null);
  const openerRef = useRef(null);
  const tabsRef = useRef([]);
  const currentModule = modules[selectedModule];

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
  function onTabKeyDown(event, index) {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % modules.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + modules.length - 1) % modules.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = modules.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setSelectedModule(next);
    tabsRef.current[next]?.focus();
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
        <div className="hero-portrait"><img src={asset('art/instructor.png')} alt="Nora Vasconcelos, instrutora fictícia da Trama" width="1586" height="992" fetchPriority="high" /></div>
        <div className="hero-content">
          <h1 id="hero-title">Crie um negócio<br className="desktop-break" /> digital com método.</h1>
          <p className="hero-subtitle">Da primeira ideia ao lançamento, com direção e prática.</p>
          <div className="hero-actions"><a className="button button-coral" href="#programa">Conhecer a formação</a><button className="text-button lesson-trigger" onClick={(event) => openDialog('lesson', event)}>Ver uma aula <Arrow /></button></div>
          <div className="social-proof"><img src={asset('art/avatars.png')} alt="Cinco retratos fictícios de participantes" width="230" height="64" /><div><div className="stars" aria-label="Cinco estrelas demonstrativas">★★★★★</div><p>Quem aprende, recomenda.</p><small>Avaliações demonstrativas</small></div></div>
        </div>
      </section>
      <div className="method-strip" aria-label="Etapas do método"><span>Ideia com direção</span><Mark /><span>Oferta com sentido</span><Mark /><span>Mensagem com clareza</span><Mark /><span>Prática de verdade</span></div>
      <section className="proposal section-cream" aria-labelledby="proposal-title">
        <div className="section-heading container"><p className="section-label">A formação Trama</p><h2 id="proposal-title">Uma boa ideia é o começo.<br />O método costura o resto.</h2></div>
        <div className="proposal-grid container"><div className="course-art"><img src={asset('art/course.png')} alt="Caderno, fichas de planejamento e materiais didáticos da formação Trama" width="1200" height="900" loading="lazy" /><span className="art-caption">Menos abas abertas. Mais decisões no papel.</span></div><div className="proposal-copy"><p className="large-copy">Você não precisa de mais uma ideia solta. Precisa saber o que fazer com a que já tem.</p><p>A Trama é uma formação para transformar seu conhecimento em uma oferta digital. Você sai do “por onde começo?” e trabalha uma decisão de cada vez: para quem criar, o que entregar e como apresentar.</p><p>As aulas dão a direção. Os exercícios ajudam a trazer tudo para a sua realidade. Sem pular a parte de testar, ouvir e ajustar.</p><a className="underlined-link" href="#programa">Veja o caminho completo <Arrow diagonal /></a></div></div>
        <div className="learning-note container"><Mark /><p>O seu negócio não precisa nascer grande.<br /><strong>Precisa começar com sentido.</strong></p><span>Um passo de cada vez.<br />Uma entrega a cada módulo.</span></div>
      </section>
      <section className="program container" id="programa" aria-labelledby="program-title">
        <div className="program-heading"><div><p className="section-label">O caminho, por dentro</p><h2 id="program-title">Da ideia ao mundo.<br />Em quatro movimentos.</h2></div><p>Uma sequência para fazer na ordem,<br className="desktop-break" /> no seu ritmo e com o seu projeto.</p></div>
        <div className="program-grid"><div className="module-tabs" role="tablist" aria-label="Módulos da formação" aria-orientation="vertical">{modules.map((module, index) => <button key={module.short} ref={(element) => { tabsRef.current[index] = element; }} role="tab" id={`module-tab-${index}`} aria-controls="module-preview" aria-selected={selectedModule === index} tabIndex={selectedModule === index ? 0 : -1} className="module-tab" onClick={() => setSelectedModule(index)} onKeyDown={(event) => onTabKeyDown(event, index)}><span className="module-number">0{index + 1}</span><span>{module.short}</span><Arrow /></button>)}</div><div className="module-preview" id="module-preview" role="tabpanel" aria-labelledby={`module-tab-${selectedModule}`} tabIndex="0"><div className="preview-meta"><span>Módulo 0{selectedModule + 1}</span><span data-duration>{currentModule.duration}</span></div><div className="preview-content" key={selectedModule}><h3>{currentModule.title}</h3><p>{currentModule.description}</p><ul>{currentModule.topics.map((topic) => <li key={topic}><span aria-hidden="true">↳</span>{topic}</li>)}</ul><div className="module-deliverable"><span>Você coloca em prática</span><strong>{currentModule.deliverable}</strong></div></div></div></div>
        <p className="program-footnote">Conteúdo e durações demonstrativos. Selecione os módulos para explorar.</p>
      </section>
      <section className="instructor section-lilac" aria-labelledby="instructor-title"><div className="instructor-grid container"><div className="instructor-image"><img src={asset('art/instructor.png')} alt="Retrato de Nora Vasconcelos, personagem fictícia desta formação" width="1586" height="992" loading="lazy" /><div className="instructor-signature">Nora Vasconcelos<span>Sua guia nesta jornada</span></div></div><div className="instructor-copy"><p className="section-label">Quem puxa o fio</p><h2 id="instructor-title">“Clareza vem<br />quando a gente<br />coloca em prática.”</h2><p>Na Trama, Nora conduz cada etapa com perguntas simples, exemplos e espaço para você pensar no próprio negócio.</p><p>A proposta da formação é essa: trocar o excesso de informação por um caminho que você consegue acompanhar e colocar no papel.</p><p className="fiction-note">Nora é uma instrutora fictícia, criada para esta demonstração. Retratos gerados por IA.</p><button className="underlined-link" onClick={(event) => openDialog('lesson', event)}>Experimente a mini-aula <Arrow diagonal /></button></div></div></section>
      <section className="offer" id="inscricao" aria-labelledby="offer-title"><div className="offer-grid container"><div><p className="section-label">Seu próximo movimento</p><h2 id="offer-title">Tire a ideia<br />do “um dia”.</h2><p className="offer-intro">Comece pequeno. Faça com intenção.<br />Construa uma coisa que é sua.</p></div><div className="offer-details"><div className="offer-brand"><Mark /><span>trama<span>Formação em negócios digitais</span></span></div><ul><li>4 módulos, da ideia ao lançamento</li><li>Caderno de exercícios e decisões</li><li>Roteiro para o primeiro lançamento</li><li>Aulas para acompanhar no seu ritmo</li></ul><div className="price"><span>Investimento demonstrativo</span><p>R$ <strong>497</strong><span>,00</span></p></div><button className="button button-dark" onClick={(event) => openDialog('enrollment', event)}>Quero fazer parte <Arrow /></button><p className="offer-disclaimer">Esta é uma oferta demonstrativa.<br />Não há compra ou cobrança nesta página.</p></div></div></section>
      <section className="faq section-cream" id="duvidas" aria-labelledby="faq-title"><div className="faq-grid container"><div><p className="section-label">Antes do primeiro passo</p><h2 id="faq-title">Ainda tem<br />alguma dúvida?</h2><p>Começar fica mais leve<br />quando o caminho está claro.</p></div><div className="faq-list">{questions.map(([question, answer]) => <details key={question}><summary>{question}<span className="faq-symbol" aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></div></section>
    </main>
    <footer className="footer container"><a className="wordmark" href="#conteudo" aria-label="Trama, voltar ao início"><Mark />trama</a><p>Ideia, direção e prática.<br /><small>Template demonstrativo. Marca, instrutora e avaliações fictícias.</small></p><a className="footer-top" href="#conteudo">Voltar ao início <Arrow diagonal /></a></footer>
    <dialog className="modal" ref={dialogRef} aria-labelledby={activeDialog === 'lesson' ? 'lesson-title' : activeDialog === 'enrollment' ? 'enrollment-title' : undefined} onClick={closeOnBackdrop}>
      {activeDialog && <button className="modal-close" aria-label="Fechar" onClick={() => dialogRef.current.close()}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" /></svg></button>}
      {activeDialog === 'lesson' && <div className="lesson"><p className="section-label">Mini-aula demonstrativa</p><h2 id="lesson-title">Da ideia à primeira oferta.</h2><ol className="lesson-progress" aria-label="Progresso da mini-aula">{['Problema', 'Formato', 'Primeiro passo'].map((step, index) => <li key={step} aria-current={index === lessonStep ? 'step' : undefined}><span>{index + 1}</span>{step}</li>)}</ol><div className="lesson-stage" aria-live="polite" aria-atomic="true" key={lessonStep}>
        {lessonStep === 0 && <><h3>Comece por um problema específico.</h3><p>“Quero ajudar todo mundo” é difícil de colocar em prática. Pense em uma pessoa e em uma dificuldade que você conhece bem.</p><label htmlFor="lesson-problem">Qual problema você quer resolver?</label><textarea id="lesson-problem" rows="3" maxLength="240" placeholder="Ex.: organizar as finanças de quem trabalha por conta própria" value={problem} onChange={(event) => setProblem(event.target.value)} /><p className="field-note">Use uma situação fictícia. O texto fica só nesta atividade.</p></>}
        {lessonStep === 1 && <><h3>Escolha uma primeira entrega pequena.</h3><p>Antes de criar um curso inteiro, experimente um formato simples para ouvir, ajudar e aprender com uma pessoa.</p><fieldset><legend>Como você prefere começar?</legend>{['Conversa individual', 'Oficina em grupo', 'Guia de exercícios'].map((option) => <label className="radio-choice" key={option}><input type="radio" name="lesson-format" value={option} checked={format === option} onChange={() => setFormat(option)} /><span>{option}</span></label>)}</fieldset></>}
        {lessonStep === 2 && <><h3>Agora você tem um ponto de partida.</h3><div className="lesson-summary"><span>O problema</span><p>{problem.trim() || 'Uma dificuldade específica que você conhece e pode ajudar a resolver.'}</p><span>A primeira entrega</span><p>{format}</p></div><p>Seu próximo passo: converse com uma pessoa que vive esse problema. Pergunte como ela lida com isso hoje e escute antes de apresentar sua ideia.</p><p className="lesson-takeaway">Uma boa oferta começa com uma boa escuta.</p></>}
      </div><div className="lesson-navigation"><span>Etapa {lessonStep + 1} de 3</span><div><button className="text-button" disabled={lessonStep === 0} onClick={() => setLessonStep((step) => step - 1)}>Voltar</button>{lessonStep < 2 ? <button className="button button-dark" onClick={() => setLessonStep((step) => step + 1)}>Avançar <Arrow /></button> : <button className="button button-dark" onClick={() => dialogRef.current.close()}>Concluir aula <Arrow /></button>}</div></div></div>}
      {activeDialog === 'enrollment' && <div className="enrollment"><p className="section-label">Formação Trama</p><h2 id="enrollment-title">Seu próximo passo começa aqui.</h2>{submitted ? <div className="enrollment-success"><Mark /><div role="status" aria-live="polite"><h3>Demonstração concluída.</h3><p>Nenhum dado foi enviado ou salvo. Esta inscrição é apenas um exemplo de como a experiência funciona.</p></div><button ref={confirmationActionRef} className="button button-dark" onClick={() => { setSubmitted(false); dialogRef.current.close(); }}>Explorar novamente <Arrow /></button></div> : <><p>Experimente a inscrição demonstrativa. Use dados fictícios para conhecer o fluxo.</p><form onSubmit={(event) => { event.preventDefault(); if (event.currentTarget.reportValidity()) setSubmitted(true); }}><label htmlFor="enrollment-name">Seu nome</label><input id="enrollment-name" name="name" type="text" required minLength="2" maxLength="100" autoComplete="off" placeholder="Como podemos chamar você?" onInput={(event) => event.currentTarget.setCustomValidity(event.currentTarget.value.trim().length >= 2 ? '' : 'Informe um nome com pelo menos dois caracteres.')} /><label htmlFor="enrollment-email">Seu e-mail</label><input id="enrollment-email" name="email" type="email" required maxLength="254" autoComplete="off" placeholder="voce@exemplo.com" /><p className="form-note">Demonstração local. Nenhum dado será enviado ou salvo e nenhuma cobrança será feita.</p><button className="button button-dark" type="submit">Confirmar interesse <Arrow /></button></form></>}</div>}
    </dialog>
  </>;
}
