import { useEffect, useRef, useState } from "react";

function Icon({ name, size = 20 }) {
	const paths = {
		arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
		idea: (
			<>
				<path d="M9 18h6M10 21h4M8.5 15.5a7 7 0 1 1 7 0c-1 1-1.5 1.7-1.5 2.5h-4c0-.8-.5-1.5-1.5-2.5Z" />
			</>
		),
		folder: <path d="M3 7V5h6l2 2h10v13H3V7Zm0 3h18" />,
		connections: (
			<>
				<circle cx="6" cy="12" r="3" />
				<circle cx="18" cy="5" r="3" />
				<circle cx="18" cy="19" r="3" />
				<path d="m9 10 6-4M9 14l6 4" />
			</>
		),
		search: (
			<>
				<circle cx="10.5" cy="10.5" r="6.5" />
				<path d="m16 16 5 5" />
			</>
		),
		plus: <path d="M12 5v14M5 12h14" />,
		note: <path d="M6 3h9l4 4v14H6V3Zm9 0v5h4M9 12h7M9 16h5" />,
		people: (
			<>
				<circle cx="9" cy="8" r="3" />
				<path d="M3 20v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5" />
			</>
		),
		box: <path d="m12 3 8 5v9l-8 5-8-5V8l8-5Zm-8 5 8 5 8-5M12 13v9M8 5l8 5" />,
		check: <path d="m5 12 4 4L19 6" />,
		close: <path d="m6 6 12 12M18 6 6 18" />,
		menu: <path d="M4 7h16M4 12h16M4 17h16" />,
	};
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			{paths[name] || paths.note}
		</svg>
	);
}

function Brand({ small = false }) {
	return (
		<span className={`brand${small ? " brand-small" : ""}`}>
			<svg viewBox="0 0 48 42" fill="none" aria-hidden="true">
				<ellipse
					cx="24"
					cy="21"
					rx="21"
					ry="10"
					transform="rotate(-28 24 21)"
					stroke="currentColor"
					strokeWidth="1.2"
				/>
				<ellipse
					cx="24"
					cy="21"
					rx="14"
					ry="19"
					transform="rotate(32 24 21)"
					stroke="currentColor"
					strokeWidth="1.2"
				/>
			</svg>
			<span>orbe</span>
		</span>
	);
}

const modes = {
	ideas: {
		label: "Ideias",
		icon: "idea",
		title: "Plano de lançamento",
		subtitle: "Da ideia ao impacto. Juntos.",
		listTitle: "Visão geral",
		nodes: ["Público", "Oferta", "Conteúdo"],
		nodeIcons: ["people", "box", "note"],
		details: [
			"Conheça as pessoas e o que elas precisam.",
			"Uma proposta que resolve uma necessidade real.",
			"Histórias úteis para aproximar a sua marca.",
		],
	},
	projects: {
		label: "Projetos",
		icon: "folder",
		title: "Projetos em movimento",
		subtitle: "Clareza para cada próximo passo.",
		listTitle: "Frentes do projeto",
		nodes: ["Pesquisa", "Produto", "Lançamento"],
		nodeIcons: ["search", "box", "arrow"],
		details: [
			"Cinco conversas para entender o problema.",
			"Uma primeira versão simples para colocar à prova.",
			"Um plano claro para chegar às pessoas certas.",
		],
	},
	connections: {
		label: "Conexões",
		icon: "connections",
		title: "Um mapa do que importa",
		subtitle: "Enxergue o que uma lista não mostra.",
		listTitle: "Conexões do exemplo",
		nodes: ["Pessoas", "Ideias", "Ações"],
		nodeIcons: ["people", "idea", "check"],
		details: [
			"O conhecimento começa com uma boa conversa.",
			"O ponto em comum entre diferentes perspectivas.",
			"Um experimento pequeno para aprender fazendo.",
		],
	},
};
const initialNotes = [
	"Definir o público e suas necessidades",
	"Estruturar a oferta principal",
	"Produzir e distribuir conteúdo relevante",
	"Medir resultados e iterar",
];
const otherLists = {
	projects: [
		"Pesquisa com clientes · em andamento",
		"Primeira versão · em revisão",
		"Plano de lançamento · próximo passo",
	],
	connections: [
		"Pessoas inspiram novas ideias",
		"Ideias orientam pequenas ações",
		"Ações trazem novas conversas",
	],
};

function Halo() {
	return (
		<div className="halo" aria-hidden="true">
			<svg viewBox="0 0 1600 760" preserveAspectRatio="none">
				<defs>
					<linearGradient id="halo-line">
						<stop stopColor="#26c8ff" />
						<stop offset=".48" stopColor="#67a9ff" />
						<stop offset="1" stopColor="#c0a0ff" />
					</linearGradient>
					<filter id="halo-glow">
						<feGaussianBlur stdDeviation="6" />
					</filter>
				</defs>
				<path
					d="M-50 740C15 175 357 18 800 20s785 155 850 720"
					fill="none"
					stroke="url(#halo-line)"
					strokeWidth="5"
					filter="url(#halo-glow)"
				/>
				{Array.from({ length: 12 }, (_, index) => (
					<path
						key={index}
						d={`M${-50 + index * 19} 760C${15 + index * 22} ${175 + index * 13} ${357 + index * 6} ${18 + index * 4} 800 ${20 + index * 4}s${785 - index * 28} ${155 + index * 14} ${850 - index * 19} 740`}
						fill="none"
						stroke="url(#halo-line)"
						strokeWidth={index === 0 ? 1.7 : 0.65}
						opacity={1 - index * 0.06}
					/>
				))}
			</svg>
		</div>
	);
}

function ConnectionMap({ config, selected, onSelect }) {
	return (
		<div>
			<div className="connection-map">
				<svg
					viewBox="0 0 360 220"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<defs>
						<linearGradient id="map-line">
							<stop stopColor="#54d8ff" />
							<stop offset="1" stopColor="#c0a0ff" />
						</linearGradient>
					</defs>
					<path
						d="M180 43C155 90 117 115 84 162M180 43c25 47 63 72 96 119M84 162c55 32 133-32 192 0M180 43v112"
						fill="none"
						stroke="url(#map-line)"
						strokeWidth="1.2"
					/>
					<circle cx="180" cy="155" r="5" fill="#a5a7ff" />
				</svg>
				{config.nodes.map((node, index) => (
					<button
						key={node}
						className={`graph-node node-${index}${selected === index ? " is-selected" : ""}`}
						aria-label={`${node}: ver conexão`}
						aria-pressed={selected === index}
						onClick={() => onSelect(index)}
					>
						<span className="node-orb">
							<Icon name={config.nodeIcons[index]} size={23} />
						</span>
						<span>{node}</span>
					</button>
				))}
			</div>
			<p className="node-detail" aria-live="polite">
				{config.details[selected]}
			</p>
		</div>
	);
}

export default function App() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [mode, setMode] = useState("ideas");
	const [selected, setSelected] = useState(0);
	const [notes, setNotes] = useState(initialNotes);
	const [query, setQuery] = useState("");
	const [newIdea, setNewIdea] = useState("");
	const [noteStatus, setNoteStatus] = useState("");
	const [annual, setAnnual] = useState(false);
	const [plan, setPlan] = useState("Essencial");
	const [email, setEmail] = useState("");
	const [formError, setFormError] = useState("");
	const [confirmed, setConfirmed] = useState(false);
	const dialogRef = useRef(null),
		resultRef = useRef(null),
		ideaInput = useRef(null);
	const config = modes[mode];
	const filteredNotes = notes.filter((note) =>
		note
			.toLocaleLowerCase("pt-BR")
			.includes(query.trim().toLocaleLowerCase("pt-BR")),
	);
	useEffect(() => {
		if (confirmed) resultRef.current?.focus();
	}, [confirmed]);
	function changeMode(next) {
		setMode(next);
		setSelected(0);
		setQuery("");
		setNoteStatus("");
	}
	function explore() {
		changeMode("ideas");
		setMenuOpen(false);
		requestAnimationFrame(() =>
			document.getElementById("demo-ideas")?.focus({ preventScroll: true }),
		);
	}
	function addIdea(event) {
		event.preventDefault();
		if (!newIdea.trim()) {
			setNoteStatus("Escreva uma ideia antes de adicionar.");
			ideaInput.current?.focus();
			return;
		}
		setNotes((previous) => [...previous, newIdea.trim()]);
		setNewIdea("");
		setQuery("");
		setNoteStatus("Ideia adicionada nesta demonstração.");
		ideaInput.current?.focus();
	}
	function openInterest(name) {
		setPlan(name);
		setEmail("");
		setFormError("");
		setConfirmed(false);
		dialogRef.current.showModal();
	}
	function submitInterest(event) {
		event.preventDefault();
		if (!event.currentTarget.elements.email.validity.valid || !email.trim()) {
			setFormError("Informe um email válido para continuar.");
			event.currentTarget.elements.email.focus();
			return;
		}
		setConfirmed(true);
	}
	return (
		<>
			<style>{`@font-face { font-family: 'DM Sans'; src: url('${import.meta.env.BASE_URL}fonts/body.woff2') format('woff2'); font-style: normal; font-weight: 100 1000; font-display: swap; }`}</style>
			<a className="skip-link" href="#conteudo">
				Pular para o conteúdo
			</a>
			<header className="site-header">
				<a href="#conteudo" aria-label="Orbe, início">
					<Brand />
				</a>
				<button
					className="menu-toggle"
					aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
					aria-expanded={menuOpen}
					aria-controls="main-nav"
					onClick={() => setMenuOpen(!menuOpen)}
				>
					<Icon name={menuOpen ? "close" : "menu"} />
				</button>
				<nav
					id="main-nav"
					className={menuOpen ? "main-nav is-open" : "main-nav"}
					aria-label="Navegação principal"
				>
					<a href="#produto" onClick={() => setMenuOpen(false)}>
						Produto
					</a>
					<a href="#possibilidades" onClick={() => setMenuOpen(false)}>
						Possibilidades
					</a>
					<a href="#como-funciona" onClick={() => setMenuOpen(false)}>
						Como funciona
					</a>
				</nav>
				<a
					className="button button-outline header-cta"
					href="#demo"
					onClick={explore}
				>
					Explorar a demo
					<Icon name="arrow" size={18} />
				</a>
			</header>
			<main id="conteudo">
				<section className="hero" aria-labelledby="hero-title">
					<h1 id="hero-title">
						Conecte ideias.
						<br />
						Encontre o próximo passo.
					</h1>
					<p>
						Um espaço para organizar conhecimento e transformar conexões em
						ação.
					</p>
					<a className="button button-primary" href="#demo" onClick={explore}>
						Explorar a demonstração
						<Icon name="arrow" />
					</a>
				</section>
				<section
					className="demo-stage"
					id="demo"
					aria-label="Demonstração interativa do Orbe"
				>
					<Halo />
					<span className="stage-caption caption-left">
						Ideias conectam pessoas
						<span />
					</span>
					<span className="stage-caption caption-right">
						Conhecimento move o amanhã
						<span />
					</span>
					<div className="workspace">
						<aside className="workspace-sidebar">
							<Brand small />
							<div className="mode-buttons" aria-label="Áreas da demonstração">
								{Object.entries(modes).map(([key, item]) => (
									<button
										id={`demo-${key}`}
										key={key}
										onClick={() => changeMode(key)}
										className={mode === key ? "active" : ""}
										aria-pressed={mode === key}
									>
										<Icon name={item.icon} />
										<span>{item.label}</span>
									</button>
								))}
							</div>
							<div className="sidebar-bottom">
								<span className="workspace-dot" />
								Seu espaço, suas ideias
							</div>
						</aside>
						<div className="workspace-main">
							<div className="workspace-topbar">
								<span>
									Meu espaço <span className="crumb-separator">›</span>
									<span>Exploração</span>
								</span>
								<span className="demo-badge">
									<span />
									Demonstração
								</span>
							</div>
							<div className="workspace-body">
								<div className="workspace-heading">
									<h2>{config.title}</h2>
									<p>{config.subtitle}</p>
								</div>
								<div className="workspace-grid">
									<section
										className="panel overview-panel"
										aria-label={config.listTitle}
									>
										<h3>
											<Icon name="note" size={17} />
											{config.listTitle}
										</h3>
										{mode === "ideas" ? (
											<>
												<div className="search-field">
													<Icon name="search" size={16} />
													<input
														type="search"
														aria-label="Buscar ideias"
														placeholder="Buscar ideias..."
														value={query}
														onChange={(event) => setQuery(event.target.value)}
													/>
													{query && (
														<button
															aria-label="Limpar busca"
															onClick={() => setQuery("")}
														>
															<Icon name="close" size={14} />
														</button>
													)}
												</div>
												{filteredNotes.length ? (
													<ol className="idea-list">
														{filteredNotes.map((note, index) => (
															<li key={`${note}-${index}`}>{note}</li>
														))}
													</ol>
												) : (
													<div className="empty-state">
														<p>Nenhuma ideia encontrada.</p>
														<span>Tente outra palavra ou limpe a busca.</span>
													</div>
												)}
											</>
										) : (
											<ul className="mode-list">
												{otherLists[mode].map((item, index) => (
													<li key={item}>
														<span className="list-marker">
															{mode === "projects" ? (
																<Icon
																	name={index === 2 ? "arrow" : "check"}
																	size={14}
																/>
															) : (
																<span />
															)}
														</span>
														{item}
													</li>
												))}
											</ul>
										)}
									</section>
									<section
										className="panel map-panel"
										aria-label="Mapa de conexões"
									>
										<h3>
											<Icon name="connections" size={17} />
											Mapa de conexões
										</h3>
										<ConnectionMap
											config={config}
											selected={selected}
											onSelect={setSelected}
										/>
									</section>
								</div>
								{mode === "ideas" ? (
									<form className="add-idea" onSubmit={addIdea} noValidate>
										<Icon name="plus" />
										<label className="sr-only" htmlFor="new-idea">
											Nova ideia
										</label>
										<input
											id="new-idea"
											ref={ideaInput}
											value={newIdea}
											maxLength={160}
											onChange={(event) => setNewIdea(event.target.value)}
											placeholder="Adicionar uma nova ideia..."
										/>
										<button type="submit" aria-label="Adicionar ideia">
											<Icon name="arrow" size={18} />
										</button>
									</form>
								) : (
									<p className="mode-hint">
										<Icon name="connections" size={16} />
										Selecione um ponto do mapa para explorar uma conexão.
									</p>
								)}
								<p className="note-status" role="status">
									{noteStatus}
								</p>
							</div>
						</div>
					</div>
					<p className="demo-disclaimer">
						<span />
						Uma demonstração local com dados de exemplo. Suas ideias ficam só
						nesta página.
					</p>
				</section>
				<section
					className="capabilities section-shell"
					id="produto"
					aria-labelledby="product-title"
				>
					<div className="section-heading">
						<p className="section-kicker">Um espaço para pensar melhor</p>
						<h2 id="product-title">
							O conhecimento ganha valor
							<br />
							quando encontra conexão.
						</h2>
						<p>
							Reúna o que inspira você. Dê forma ao que está solto.{" "}
							<br className="desktop-break" />E descubra um caminho entre uma
							ideia e a próxima.
						</p>
					</div>
					<div className="capability-grid">
						{[
							{
								key: "ideas",
								title: "Capture o que pode ser.",
								text: "Um insight da conversa. Um trecho de leitura. A pergunta que ainda não tem resposta. Tudo tem um lugar para começar.",
							},
							{
								key: "projects",
								title: "Dê direção às ideias.",
								text: "Aproxime referências, organize frentes e transforme aquele pensamento recorrente em um próximo passo possível.",
							},
							{
								key: "connections",
								title: "Enxergue além da lista.",
								text: "Navegue entre pessoas, assuntos e projetos. As melhores descobertas podem estar no espaço entre eles.",
							},
						].map((item) => (
							<article key={item.key}>
								<span className="capability-icon">
									<Icon name={modes[item.key].icon} size={27} />
								</span>
								<h3>{item.title}</h3>
								<p>{item.text}</p>
								<a
									href="#demo"
									onClick={() => {
										changeMode(item.key);
										requestAnimationFrame(() =>
											document
												.getElementById(`demo-${item.key}`)
												?.focus({ preventScroll: true }),
										);
									}}
								>
									Explorar {modes[item.key].label.toLowerCase()}
									<Icon name="arrow" size={17} />
								</a>
							</article>
						))}
					</div>
				</section>
				<section
					className="possibilities section-shell"
					id="possibilidades"
					aria-labelledby="possibilities-title"
				>
					<div className="possibilities-intro">
						<p className="section-kicker">Possibilidades</p>
						<h2 id="possibilities-title">
							Cabe no seu jeito
							<br />
							de pensar.
						</h2>
						<p>
							Não existe uma única forma de chegar a uma boa ideia. Encontre a
							sua.
						</p>
						<a href="#demo" className="text-link" onClick={explore}>
							Comece com uma ideia
							<Icon name="arrow" size={18} />
						</a>
						<div className="orbit-mark" aria-hidden="true">
							<span />
							<span />
							<span />
							<i />
						</div>
					</div>
					<div className="use-cases">
						<article>
							<span className="case-icon">
								<Icon name="search" size={22} />
							</span>
							<div>
								<h3>Para quem pesquisa</h3>
								<p>
									Referências deixam de ser abas esquecidas e passam a fazer
									parte de um raciocínio.
								</p>
								<span className="case-example">
									Leituras → conexões → novas perguntas
								</span>
							</div>
						</article>
						<article>
							<span className="case-icon">
								<Icon name="idea" size={22} />
							</span>
							<div>
								<h3>Para quem cria</h3>
								<p>
									Um repertório vivo para aproximar inspirações e encontrar uma
									direção própria.
								</p>
								<span className="case-example">
									Inspiração → conceito → criação
								</span>
							</div>
						</article>
						<article>
							<span className="case-icon">
								<Icon name="people" size={22} />
							</span>
							<div>
								<h3>Para quem constrói junto</h3>
								<p>
									Um ponto de encontro entre o que o time sabe e o que o projeto
									precisa.
								</p>
								<span className="case-example">
									Conversas → clareza → próximos passos
								</span>
							</div>
						</article>
					</div>
				</section>
				<section
					className="how-it-works section-shell"
					id="como-funciona"
					aria-labelledby="how-title"
				>
					<div className="section-heading">
						<p className="section-kicker">Como funciona</p>
						<h2 id="how-title">
							Da primeira faísca
							<br />
							ao próximo movimento.
						</h2>
					</div>
					<ol className="steps">
						<li>
							<span className="step-number">01</span>
							<h3>Traga uma ideia.</h3>
							<p>
								Uma pergunta, uma referência ou algo que você não quer esquecer.
							</p>
						</li>
						<li>
							<span className="step-number">02</span>
							<h3>Encontre as conexões.</h3>
							<p>
								Organize por assunto e aproxime o que faz sentido estar junto.
							</p>
						</li>
						<li>
							<span className="step-number">03</span>
							<h3>Dê o próximo passo.</h3>
							<p>Transforme o que descobriu em uma ação pequena e concreta.</p>
						</li>
					</ol>
				</section>
				<section
					className="pricing section-shell"
					id="planos"
					aria-labelledby="pricing-title"
				>
					<div className="section-heading">
						<p className="section-kicker">Planos demonstrativos</p>
						<h2 id="pricing-title">
							Espaço para começar.
							<br />
							Fôlego para ir além.
						</h2>
						<p>
							Valores ilustrativos para explorar este template.
							<br />
							Nenhuma assinatura ou cobrança será criada.
						</p>
					</div>
					<div
						className="billing-toggle"
						role="group"
						aria-label="Período dos planos"
					>
						<button aria-pressed={!annual} onClick={() => setAnnual(false)}>
							Mensal
						</button>
						<button
							aria-label="Anual"
							aria-pressed={annual}
							onClick={() => setAnnual(true)}
						>
							Anual<span>−20%</span>
						</button>
					</div>
					<div className="plan-grid">
						<article className="plan-card">
							<span className="plan-name">Livre</span>
							<p>Para dar lugar às primeiras ideias.</p>
							<div className="plan-price">
								<span>R$</span>
								<strong>0</strong>
								<span>/ mês</span>
							</div>
							<p className="billing-description">
								Gratuito neste exemplo de produto.
							</p>
							<button
								className="button button-outline"
								onClick={() => openInterest("Livre")}
								aria-label="Experimentar Livre"
							>
								Experimentar
								<Icon name="arrow" size={18} />
							</button>
							<ul>
								<li>
									<Icon name="check" size={17} />
									Um espaço pessoal
								</li>
								<li>
									<Icon name="check" size={17} />
									Até 50 ideias no exemplo
								</li>
								<li>
									<Icon name="check" size={17} />
									Mapa de conexões básico
								</li>
							</ul>
						</article>
						<article className="plan-card featured-plan">
							<div className="plan-title-row">
								<span className="plan-name">Essencial</span>
								<span className="plan-pill">Mais possibilidades</span>
							</div>
							<p>Para cultivar um repertório vivo.</p>
							<div className="plan-price" aria-live="polite">
								<span>R$</span>
								<strong data-price="essencial">{annual ? "23" : "29"}</strong>
								<span>/ mês</span>
							</div>
							<p className="billing-description">
								{annual
									? "R$ 276 por ano · economia de R$ 72"
									: "R$ 29 por mês · cobrança ilustrativa"}
							</p>
							<button
								className="button button-primary"
								onClick={() => openInterest("Essencial")}
								aria-label="Experimentar Essencial"
							>
								Experimentar
								<Icon name="arrow" size={18} />
							</button>
							<ul>
								<li>
									<Icon name="check" size={17} />
									Tudo do plano Livre
								</li>
								<li>
									<Icon name="check" size={17} />
									Ideias e projetos sem limite
								</li>
								<li>
									<Icon name="check" size={17} />
									Conexões entre projetos
								</li>
								<li>
									<Icon name="check" size={17} />
									Organização por coleções
								</li>
							</ul>
						</article>
						<article className="plan-card">
							<span className="plan-name">Juntos</span>
							<p>Para o conhecimento circular.</p>
							<div className="plan-price" aria-live="polite">
								<span>R$</span>
								<strong>{annual ? "47" : "59"}</strong>
								<span>/ pessoa / mês</span>
							</div>
							<p className="billing-description">
								{annual
									? "R$ 564 por pessoa por ano"
									: "R$ 59 por pessoa por mês"}
							</p>
							<button
								className="button button-outline"
								onClick={() => openInterest("Juntos")}
								aria-label="Experimentar Juntos"
							>
								Experimentar
								<Icon name="arrow" size={18} />
							</button>
							<ul>
								<li>
									<Icon name="check" size={17} />
									Tudo do plano Essencial
								</li>
								<li>
									<Icon name="check" size={17} />
									Espaços compartilhados
								</li>
								<li>
									<Icon name="check" size={17} />
									Coleções do time
								</li>
								<li>
									<Icon name="check" size={17} />
									Permissões de acesso
								</li>
							</ul>
						</article>
					</div>
					<p className="pricing-note">
						A demonstração acima é a mesma para todos os planos. O formulário
						apenas simula um cadastro.
					</p>
				</section>
				<section
					className="faq section-shell"
					id="perguntas"
					aria-labelledby="faq-title"
				>
					<div>
						<p className="section-kicker">Perguntas frequentes</p>
						<h2 id="faq-title">
							Antes de <br />
							seguir em frente.
						</h2>
					</div>
					<div className="faq-list">
						{[
							{
								q: "Posso testar sem criar uma conta?",
								a: "Sim. A demonstração funciona nesta página: troque de área, busque ideias, adicione uma nota e explore os pontos do mapa. Nenhuma conta é criada.",
							},
							{
								q: "Minhas ideias ficam salvas?",
								a: "Neste template, as ideias existem apenas na memória da página. Ao recarregar, o exemplo volta ao estado inicial. Não há envio ou armazenamento dos dados.",
							},
							{
								q: "O Orbe usa inteligência artificial nesta demo?",
								a: "Não. As conexões e os conteúdos são exemplos locais preparados para demonstrar a interface. A página não consulta modelos, provedores ou serviços externos.",
							},
							{
								q: "O que acontece ao experimentar um plano?",
								a: "Um formulário local simula seu interesse no plano escolhido. O email não é enviado nem salvo, e nenhuma assinatura, pagamento ou mensagem é gerada.",
							},
							{
								q: "Posso adaptar este site para meu produto?",
								a: "Sim. Este é um template open source. Você pode personalizar textos, cores, exemplos e planos; consulte o README e preserve os avisos de licença.",
							},
						].map((item) => (
							<details key={item.q}>
								<summary>
									{item.q}
									<span>
										<Icon name="plus" size={18} />
									</span>
								</summary>
								<p>{item.a}</p>
							</details>
						))}
					</div>
				</section>
				<section className="final-invite" aria-labelledby="invite-title">
					<div className="invite-orbit" aria-hidden="true" />
					<Brand small />
					<h2 id="invite-title">
						A próxima grande ideia
						<br />
						pode estar entre duas pequenas.
					</h2>
					<p>Dê um espaço para elas se encontrarem.</p>
					<a href="#demo" className="button button-primary" onClick={explore}>
						Começar a explorar
						<Icon name="arrow" />
					</a>
				</section>
			</main>
			<footer className="site-footer">
				<a href="#conteudo" aria-label="Orbe, voltar ao início">
					<Brand small />
				</a>
				<span>Ideias em movimento.</span>
				<nav aria-label="Navegação do rodapé">
					<a href="#produto">Produto</a>
					<a href="#planos">Planos</a>
					<a href="#perguntas">Perguntas</a>
				</nav>
				<p>Orbe é uma marca demonstrativa. Template open source.</p>
			</footer>
			<dialog
				ref={dialogRef}
				aria-labelledby={confirmed ? "interest-result" : "interest-title"}
				onKeyDown={(event) => {
					if (event.key !== "Tab") return;
					const controls = Array.from(
						event.currentTarget.querySelectorAll(
							"button:not([disabled]), input:not([disabled])",
						),
					);
					const first = controls[0],
						last = controls[controls.length - 1];
					if (
						event.shiftKey &&
						(document.activeElement === first ||
							!controls.includes(document.activeElement))
					) {
						event.preventDefault();
						last?.focus();
					} else if (!event.shiftKey && document.activeElement === last) {
						event.preventDefault();
						first?.focus();
					}
				}}
				onClick={(event) => {
					if (event.target === event.currentTarget) {
						const rect = event.currentTarget.getBoundingClientRect();
						if (
							event.clientX < rect.left ||
							event.clientX > rect.right ||
							event.clientY < rect.top ||
							event.clientY > rect.bottom
						)
							dialogRef.current.close();
					}
				}}
			>
				<button
					className="dialog-close"
					aria-label="Fechar formulário"
					onClick={() => dialogRef.current.close()}
				>
					<Icon name="close" />
				</button>
				{confirmed ? (
					<div className="interest-success">
						<span className="success-icon">
							<Icon name="check" size={27} />
						</span>
						<h2 id="interest-result" tabIndex={-1} ref={resultRef}>
							Tudo certo para explorar.
						</h2>
						<p>
							Você experimentou o cadastro no plano {plan}. Este foi um
							formulário de demonstração: nenhum email foi enviado ou salvo e
							nenhuma cobrança foi criada.
						</p>
						<button
							className="button button-primary"
							onClick={() => dialogRef.current.close()}
						>
							Continuar explorando
							<Icon name="arrow" size={18} />
						</button>
					</div>
				) : (
					<form onSubmit={submitInterest} noValidate>
						<Brand small />
						<h2 id="interest-title">
							Um espaço para
							<br />o seu próximo passo.
						</h2>
						<p>
							Experimente o cadastro no plano <strong>{plan}</strong>. É uma
							simulação local, sem assinatura.
						</p>
						<label htmlFor="interest-email">Seu email</label>
						<input
							id="interest-email"
							name="email"
							type="email"
							required
							autoFocus
							autoComplete="off"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							aria-describedby="form-note form-error"
							placeholder="voce@exemplo.com"
						/>
						<p className="form-error" id="form-error" role="alert">
							{formError}
						</p>
						<button className="button button-primary" type="submit">
							Confirmar interesse
							<Icon name="arrow" size={18} />
						</button>
						<p id="form-note" className="form-note">
							Seus dados não saem desta página.
						</p>
					</form>
				)}
			</dialog>
		</>
	);
}
