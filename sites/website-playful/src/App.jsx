import { useEffect, useLayoutEffect, useRef, useState } from "react";

const asset = (name) => `${import.meta.env.BASE_URL}${name}`;
const activities = [
  {
    id: "draw",
    name: "Desenhar",
    icon: "brush",
    title: "Tudo começa com um rabisco.",
    description:
      "Siga uma linha, invente uma flor. O papel aceita todas as suas ideias.",
    alt: "Personagem azul desenhando uma flor, personagem verde com recortes e uma pipa sorridente ao centro.",
    color: "yellow",
    duration: "Uma pausa de 5 minutos",
  },
  {
    id: "write",
    name: "Escrever",
    icon: "pen",
    title: "Uma ideia puxa outra.",
    description:
      "Encontre uma história pequena nas coisas de todo dia. Ela só precisa ser sua.",
    alt: "Personagens azul e verde escrevendo em cadernos, acompanhados de uma pipa sorridente.",
    color: "mint",
    duration: "Uma pausa de 7 minutos",
  },
  {
    id: "invent",
    name: "Inventar",
    icon: "bulb",
    title: "Junte o que ainda não existe.",
    description:
      "Misture formas, cores e um pouquinho de acaso. Veja o que acontece.",
    alt: "Personagens azul e verde inventando composições com papéis coloridos e uma pipa sorridente.",
    color: "coral",
    duration: "Uma pausa de 5 minutos",
  },
];

function Icon({ name, ...props }) {
  const paths = {
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    brush: (
      <>
        <path d="m9 14 9-10 3 3-10 9M9 14c-7-2-3 7-7 6 6 3 11-1 9-4Z" />
        <path d="m15 7 3 3" />
      </>
    ),
    pen: (
      <>
        <path d="m4 15-1 6 6-2L21 7l-4-4Z" />
        <path d="m4 15 5 4M14 6l4 4" />
      </>
    ),
    bulb: (
      <>
        <path d="M8 16c0-4-4-4-4-9a8 8 0 0 1 16 0c0 5-4 5-4 9M8 17h8M9 21h6M10 13l-1-5 3 2 3-2-1 5" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    check: <path d="m5 12 4 4L19 6" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
      </>
    ),
  };
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

function Kite({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 110 130"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m55 4 38 45-34 40L18 47Z"
        fill="#ffd65c"
        stroke="#203541"
        strokeWidth="2.5"
      />
      <path d="m55 4 4 85-41-42Z" fill="#f77962" />
      <path d="m55 4 4 85M18 47l75 2" stroke="#203541" strokeWidth="2.5" />
      <path
        d="M59 89c-25 26 32 19 22 37"
        stroke="#203541"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="m69 105-8-6-2 10Z" fill="#f77962" />
    </svg>
  );
}

function Brand({ footer = false }) {
  return (
    <a
      className={`brand${footer ? " brand-footer" : ""}`}
      href="#inicio"
      aria-label="Pipa, início"
    >
      <span>pipa</span>
      <Kite />
    </a>
  );
}

function DrawExperience() {
  const canvasRef = useRef(null),
    drawingRef = useRef(false);
  const [color, setColor] = useState("#f77962"),
    [strokes, setStrokes] = useState(0),
    [flowers, setFlowers] = useState(0);
  const colors = [
    ["#f77962", "Coral"],
    ["#e8b522", "Amarelo"],
    ["#4b824b", "Verde"],
    ["#3c88ad", "Azul"],
    ["#203541", "Azul escuro"],
  ];
  const point = (event) => {
    const canvas = canvasRef.current,
      rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * canvas.height) / rect.height,
    };
  };
  const start = (event) => {
    if (event.button !== 0) return;
    const canvas = canvasRef.current,
      ctx = canvas.getContext("2d"),
      { x, y } = point(event);
    canvas.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 0.1, y + 0.1);
    ctx.strokeStyle = color;
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };
  const move = (event) => {
    if (!drawingRef.current) return;
    const { x, y } = point(event),
      ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const end = () => {
    if (drawingRef.current) {
      drawingRef.current = false;
      setStrokes((n) => n + 1);
    }
  };
  const addFlower = () => {
    const ctx = canvasRef.current.getContext("2d"),
      x = 100 + (flowers % 4) * 125,
      y = 105 + (Math.floor(flowers / 4) % 2) * 125;
    ctx.fillStyle = color;
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.ellipse(
        x + Math.cos(angle) * 26,
        y + Math.sin(angle) * 26,
        27,
        17,
        angle,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    ctx.fillStyle = "#ffd65c";
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
    setFlowers((n) => n + 1);
  };
  const clear = () => {
    canvasRef.current.getContext("2d").clearRect(0, 0, 620, 340);
    setFlowers(0);
    setStrokes(0);
  };
  return (
    <div className="experience-body">
      <p>
        Desenhe uma flor que ainda não existe. Pode ter pétalas tortas, folhas
        enormes ou a sua cor preferida.
      </p>
      <fieldset className="color-picker">
        <legend>Escolha uma cor</legend>
        <div>
          {colors.map(([hex, label]) => (
            <button
              key={hex}
              className="color-swatch"
              type="button"
              aria-label={label}
              aria-pressed={color === hex}
              style={{ "--swatch": hex }}
              onClick={() => setColor(hex)}
            >
              {color === hex && <Icon name="check" />}
            </button>
          ))}
        </div>
      </fieldset>
      <canvas
        ref={canvasRef}
        width="620"
        height="340"
        aria-label="Área de desenho"
        aria-describedby="canvas-help"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onLostPointerCapture={end}
      >
        Área de desenho. Use o botão Adicionar uma flor para criar com o
        teclado.
      </canvas>
      <p id="canvas-help" className="field-hint">
        Desenhe com o mouse ou o dedo. Pelo teclado, escolha uma cor e adicione
        uma flor.
      </p>
      <div className="activity-actions">
        <button
          className="button small yellow"
          type="button"
          onClick={addFlower}
        >
          Adicionar uma flor
        </button>
        <button className="text-button" type="button" onClick={clear}>
          Limpar desenho
        </button>
      </div>
      <p className="activity-status" role="status">
        {strokes + flowers === 0
          ? "Sua folha está em branco. Por onde vamos começar?"
          : `${strokes} ${strokes === 1 ? "traço" : "traços"} e ${flowers} ${flowers === 1 ? "flor" : "flores"} na sua criação. Do seu jeito!`}
      </p>
    </div>
  );
}

function WriteExperience() {
  const [text, setText] = useState(""),
    [preview, setPreview] = useState(false);
  const inputRef = useRef(null),
    resultRef = useRef(null);
  useLayoutEffect(() => {
    if (preview) resultRef.current?.focus();
    else inputRef.current?.focus();
  }, [preview]);
  const edit = () => setPreview(false);
  const reset = () => {
    setText("");
    setPreview(false);
    inputRef.current?.focus();
  };
  return (
    <div className="experience-body">
      {preview ? (
        <>
          <div className="writing-result">
            <span className="tiny-sun">
              <Icon name="sun" />
            </span>
            <h3 ref={resultRef} tabIndex="-1">
              Sua ideia ganhou o mundo.
            </h3>
            <p>{text}</p>
            <span className="creation-signature">
              Uma pequena história, criada por você.
            </span>
          </div>
          <div className="activity-actions">
            <button className="button small mint" type="button" onClick={edit}>
              Editar texto
            </button>
            <button className="text-button" type="button" onClick={reset}>
              Recomeçar texto
            </button>
          </div>
        </>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!text.trim()) {
              inputRef.current.setCustomValidity(
                "Escreva uma palavra ou uma pequena história para continuar.",
              );
              inputRef.current.reportValidity();
              return;
            }
            setPreview(true);
          }}
        >
          <p className="writing-prompt">
            “Hoje eu encontrei algo inesperado dentro de uma xícara…”
          </p>
          <p>
            Continue essa história em poucas linhas. Não precisa fazer sentido
            para mais ninguém.
          </p>
          <label className="field-label" htmlFor="creation-text">
            Minha pequena história
          </label>
          <textarea
            id="creation-text"
            ref={inputRef}
            value={text}
            onChange={(event) => {
              event.target.setCustomValidity("");
              setText(event.target.value);
            }}
            required
            maxLength="1200"
            rows="6"
            placeholder="Era um jardim? Uma palavra? O começo de uma aventura?"
          />
          <p className="field-hint">
            Até 1.200 caracteres. Sua história fica só nesta página.
          </p>
          <div className="activity-actions">
            <button className="button small mint" type="submit">
              Ver minha criação <Icon name="arrow" />
            </button>
            <button className="text-button" type="button" onClick={reset}>
              Recomeçar texto
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function InventExperience() {
  const [shape, setShape] = useState("circle"),
    [color, setColor] = useState("#f77962"),
    [pieces, setPieces] = useState([]),
    [message, setMessage] = useState(
      "Sua folha está esperando a primeira ideia.",
    );
  const nextId = useRef(0);
  const add = () => {
    if (pieces.length >= 16) {
      setMessage(
        "Sua composição tem 16 recortes. Gire, organize ou recomece para explorar mais.",
      );
      return;
    }
    const id = nextId.current++;
    setPieces((items) => [
      ...items,
      {
        id,
        shape,
        color,
        x: 12 + ((id * 23) % 66),
        y: 10 + ((id * 17) % 53),
        rotation: ((id % 5) - 2) * 12,
      },
    ]);
    setMessage(
      `${pieces.length + 1} ${pieces.length === 0 ? "recorte na sua composição" : "recortes na sua composição"}. Uma ideia nova acaba de chegar!`,
    );
  };
  const organize = () => {
    setPieces((items) =>
      items.map((piece, i) => ({
        ...piece,
        x: 10 + (i % 4) * 22,
        y: 5 + Math.floor(i / 4) * 21,
        rotation: 0,
      })),
    );
    setMessage("Recortes organizados. Que tal olhar de outro jeito?");
  };
  const rotate = () => {
    setPieces((items) =>
      items.map((piece, i) =>
        i === items.length - 1
          ? { ...piece, rotation: piece.rotation + 45 }
          : piece,
      ),
    );
    setMessage("O último recorte ganhou um novo ângulo.");
  };
  const reorder = () => {
    setPieces((items) => [...items.slice(1), items[0]]);
    setMessage("A ordem mudou. O primeiro recorte foi para a frente.");
  };
  const clear = () => {
    setPieces([]);
    nextId.current = 0;
    setMessage("Sua folha está esperando a primeira ideia.");
  };
  return (
    <div className="experience-body">
      <p>
        Um sol quadrado? Uma cidade de bolinhas? Junte recortes e descubra uma
        imagem que só você imaginaria.
      </p>
      <div className="cutout-controls">
        <label>
          Forma do recorte
          <select
            value={shape}
            onChange={(event) => setShape(event.target.value)}
          >
            <option value="circle">Círculo</option>
            <option value="triangle">Triângulo</option>
            <option value="arch">Arco</option>
            <option value="square">Quadrado</option>
          </select>
        </label>
        <label>
          Cor do recorte
          <select
            value={color}
            onChange={(event) => setColor(event.target.value)}
          >
            <option value="#f77962">Coral</option>
            <option value="#ffd65c">Amarelo</option>
            <option value="#8ab987">Verde</option>
            <option value="#6daed0">Azul</option>
          </select>
        </label>
        <button className="button small yellow" type="button" onClick={add}>
          Adicionar recorte
        </button>
      </div>
      <div
        className="collage-board"
        role="img"
        aria-label={`Composição com ${pieces.length} recortes coloridos`}
      >
        {pieces.length === 0 && <span>Qual vai ser a primeira forma?</span>}
        {pieces.map((piece) => (
          <span
            key={piece.id}
            className={`paper-piece ${piece.shape}`}
            data-piece={piece.id}
            style={{
              backgroundColor: piece.color,
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              transform: `rotate(${piece.rotation}deg)`,
            }}
          />
        ))}
      </div>
      <div className="collage-actions">
        <button
          className="text-button"
          type="button"
          disabled={!pieces.length}
          onClick={rotate}
        >
          Girar último recorte
        </button>
        <button
          className="text-button"
          type="button"
          disabled={!pieces.length}
          onClick={organize}
        >
          Organizar recortes
        </button>
        <button
          className="text-button"
          type="button"
          disabled={pieces.length < 2}
          onClick={reorder}
        >
          Mudar a ordem
        </button>
        <button className="text-button" type="button" onClick={clear}>
          Limpar recortes
        </button>
      </div>
      <p className="activity-status" role="status">
        {message}
      </p>
    </div>
  );
}

function Signup() {
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [submitted, setSubmitted] = useState(false);
  const resultRef = useRef(null),
    nameRef = useRef(null),
    returnFocusRef = useRef(false);
  useLayoutEffect(() => {
    if (submitted) resultRef.current?.focus();
    else if (returnFocusRef.current) {
      nameRef.current?.focus();
      returnFocusRef.current = false;
    }
  }, [submitted]);
  const reset = () => {
    returnFocusRef.current = true;
    setName("");
    setEmail("");
    setSubmitted(false);
  };
  return (
    <section
      className="signup section-wrap"
      id="convite"
      aria-labelledby="signup-heading"
    >
      <div className="signup-copy">
        <span className="handwritten">a próxima ideia pode ser sua</span>
        <h2 id="signup-heading" tabIndex="-1">
          Deixe um espaço
          <br /> para o inesperado.
        </h2>
        <p>
          Receba ideias para fazer uma pausa criativa e novidades da nossa
          escola.
        </p>
        <Kite className="signup-kite" />
      </div>
      <div className="signup-paper">
        {submitted ? (
          <div className="signup-result">
            <span className="success-icon">
              <Icon name="check" />
            </span>
            <h3 tabIndex="-1" ref={resultRef}>
              Que bom ter você por aqui, {name.trim().split(/\s+/)[0]}!
            </h3>
            <p>
              Uma pausa criativa cabe no seu dia. Você já pode experimentar as
              atividades desta página.
            </p>
            <p className="demo-note">
              Demonstração: nenhum dado foi enviado ou salvo. Esta inscrição não
              entra em uma lista real.
            </p>
            <button className="text-button" type="button" onClick={reset}>
              Voltar ao formulário
            </button>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!name.trim()) {
                nameRef.current.setCustomValidity(
                  "Preencha seu nome para continuar.",
                );
                nameRef.current.reportValidity();
                return;
              }
              setSubmitted(true);
            }}
          >
            <h3>
              Um pouco de Pipa
              <br /> na sua caixa de entrada.
            </h3>
            <label htmlFor="signup-name">Seu nome</label>
            <input
              id="signup-name"
              ref={nameRef}
              autoComplete="given-name"
              value={name}
              onChange={(event) => {
                event.target.setCustomValidity("");
                setName(event.target.value);
              }}
              placeholder="Como podemos chamar você?"
              required
              maxLength="80"
            />
            <label htmlFor="signup-email">Seu e-mail</label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@exemplo.com"
              required
              maxLength="254"
            />
            <button className="button ink" type="submit">
              Quero receber novidades <Icon name="arrow" />
            </button>
            <p className="demo-note">
              Este é um formulário demonstrativo. Seus dados ficam apenas na
              memória desta página, sem envio ou armazenamento.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

export default function App() {
  const [selected, setSelected] = useState("draw"),
    [active, setActive] = useState("draw"),
    [session, setSession] = useState(0),
    [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef(null),
    openerRef = useRef(null),
    menuRef = useRef(null),
    tabRefs = useRef([]);
  const current = activities.find((activity) => activity.id === selected);
  const openExperience = (id, event) => {
    openerRef.current = event.currentTarget;
    setActive(id);
    setSession((value) => value + 1);
    dialogRef.current.showModal();
  };
  const closeExperience = () => dialogRef.current.close();
  const navigate = (event, target) => {
    event.preventDefault();
    setMenuOpen(false);
    window.history.pushState(null, "", target);
    document.querySelector(target)?.scrollIntoView({ block: "start" });
    document
      .querySelector(`${target} h2, ${target} h1`)
      ?.focus({ preventScroll: true });
  };
  const trapFocus = (event) => {
    if (event.key !== "Tab") return;
    const controls = [
      ...dialogRef.current.querySelectorAll(
        'button:not(:disabled), input, textarea, select, a[href], [tabindex="0"]',
      ),
    ].filter((element) => element.getClientRects().length);
    const first = controls[0],
      last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };
  useEffect(() => {
    if (!menuOpen) return;
    const escape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuRef.current?.focus();
      }
    };
    const outside = (event) => {
      if (!event.target.closest(".site-header")) setMenuOpen(false);
    };
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", escape);
      document.removeEventListener("pointerdown", outside);
    };
  }, [menuOpen]);
  const selectTab = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % activities.length;
    if (event.key === "ArrowLeft")
      next = (index + activities.length - 1) % activities.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = activities.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      setSelected(activities[next].id);
      tabRefs.current[next]?.focus();
    }
  };
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="site-header">
        <Brand />
        <button
          ref={menuRef}
          className="menu-toggle"
          type="button"
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          aria-controls="navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
        <nav
          id="navigation"
          aria-label="Navegação principal"
          className={menuOpen ? "is-open" : ""}
        >
          <a
            href="#experiencias"
            onClick={(event) => navigate(event, "#experiencias")}
          >
            Experiências
          </a>
          <a href="#escola" onClick={(event) => navigate(event, "#escola")}>
            Nossa escola
          </a>
          <a
            href="#perguntas"
            onClick={(event) => navigate(event, "#perguntas")}
          >
            Perguntas
          </a>
          <a
            className="button coral header-cta"
            href="#convite"
            onClick={(event) => navigate(event, "#convite")}
          >
            Quero experimentar
          </a>
        </nav>
      </header>
      <main id="conteudo">
        <section className="hero" id="inicio" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <h1 id="hero-heading" tabIndex="-1">
              Criatividade para
              <br /> dar cor ao seu dia.
            </h1>
            <p className="hero-intro">
              Pequenas experiências de arte, escrita e invenção
              <br className="desktop-break" /> para criar do seu jeito.
            </p>
            <div
              className="activity-tabs"
              role="tablist"
              aria-label="Escolha sua experiência"
            >
              {activities.map((activity, index) => (
                <button
                  key={activity.id}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  id={`tab-${activity.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected === activity.id}
                  aria-controls="activity-panel"
                  tabIndex={selected === activity.id ? 0 : -1}
                  onClick={() => setSelected(activity.id)}
                  onKeyDown={(event) => selectTab(event, index)}
                >
                  <Icon name={activity.icon} />
                  {activity.name}
                </button>
              ))}
            </div>
            <div
              className="hero-selection"
              id="activity-panel"
              role="tabpanel"
              aria-labelledby={`tab-${selected}`}
            >
              <button
                className="button coral hero-cta"
                type="button"
                onClick={(event) => openExperience(selected, event)}
              >
                Escolher uma experiência <Icon name="arrow" />
              </button>
              <p className="scene-caption" aria-live="polite">
                {current.title}
              </p>
            </div>
          </div>
          <figure className="hero-figure">
            <img
              className="hero-art"
              src={asset(`art/${current.id}.png`)}
              alt={current.alt}
              width="1774"
              height="887"
              fetchPriority="high"
            />
          </figure>
          <span className="hero-note note-left">
            mais arte,
            <br /> dias mais leves <span>♥</span>
          </span>
          <span className="hero-note note-right">
            ideias também
            <br /> voam por aqui{" "}
            <svg viewBox="0 0 100 70" fill="none" aria-hidden="true">
              <path
                d="M12 13c80-30 83 57 39 43-24-7 18-53 37-24m-6-12 9 13-15 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </section>
        <section
          className="experiences section-wrap"
          id="experiencias"
          aria-labelledby="experiences-heading"
        >
          <div className="section-heading">
            <h2 id="experiences-heading" tabIndex="-1">
              Um convite para
              <br /> começar pequeno.
            </h2>
            <p>
              Sem lista de materiais. Sem precisar saber antes.
              <br /> Escolha uma curiosidade e dê o primeiro passo.
            </p>
          </div>
          <div className="experience-cards">
            {activities.map((activity) => (
              <article
                className={`experience-card ${activity.color}`}
                key={activity.id}
              >
                <div className="card-illustration" aria-hidden="true">
                  {activity.id === "draw" ? (
                    <svg viewBox="0 0 240 160">
                      <path
                        d="M124 146c-7-35-1-58 0-74"
                        fill="none"
                        stroke="#456e47"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M122 126c-38 0-42-21-45-31 28-1 39 13 45 31"
                        fill="#7ca67b"
                      />
                      <g fill="#f77962">
                        <ellipse cx="122" cy="46" rx="19" ry="33" />
                        <ellipse
                          cx="122"
                          cy="46"
                          rx="19"
                          ry="33"
                          transform="rotate(60 122 77)"
                        />
                        <ellipse
                          cx="122"
                          cy="46"
                          rx="19"
                          ry="33"
                          transform="rotate(120 122 77)"
                        />
                        <ellipse
                          cx="122"
                          cy="46"
                          rx="19"
                          ry="33"
                          transform="rotate(180 122 77)"
                        />
                        <ellipse
                          cx="122"
                          cy="46"
                          rx="19"
                          ry="33"
                          transform="rotate(240 122 77)"
                        />
                        <ellipse
                          cx="122"
                          cy="46"
                          rx="19"
                          ry="33"
                          transform="rotate(300 122 77)"
                        />
                      </g>
                      <circle cx="122" cy="77" r="21" fill="#203541" />
                      <path
                        d="m52 40-7-8m150 75 10 5M183 29l7-10"
                        stroke="#203541"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : activity.id === "write" ? (
                    <svg viewBox="0 0 240 160">
                      <path d="m59 24 121 6-9 124-124-9Z" fill="#fff8ec" />
                      <path
                        d="m80 56 75 4M76 77l62 3M73 99l48 3"
                        stroke="#203541"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="m154 99 30-59 14 8-32 58-15 9Z"
                        fill="#f77962"
                        stroke="#203541"
                        strokeWidth="2"
                      />
                      <path d="m166 106-15 9 3-16" fill="#203541" />
                      <path
                        d="m47 36-9-7m157 101 9 5"
                        stroke="#203541"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 240 160">
                      <circle cx="80" cy="87" r="44" fill="#ffd65c" />
                      <path d="m147 19 62 110-127 4Z" fill="#d6e9d3" />
                      <path d="m113 79 43-19 25 58-45 20Z" fill="#6daed0" />
                      <path
                        d="m44 29 8-11m143 135 11 3"
                        stroke="#203541"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="card-duration">{activity.duration}</span>
                <h3>{activity.name}</h3>
                <p>{activity.description}</p>
                <button
                  className="card-link"
                  type="button"
                  onClick={(event) => openExperience(activity.id, event)}
                >
                  Vamos {activity.name.toLowerCase()} <Icon name="arrow" />
                </button>
              </article>
            ))}
          </div>
          <p className="experience-footnote">
            Experiências demonstrativas gratuitas. Um pequeno começo já conta.
          </p>
        </section>
        <section
          className="school"
          id="escola"
          aria-labelledby="school-heading"
        >
          <div className="school-inner section-wrap">
            <div className="school-statement">
              <span className="handwritten">a gente acredita nisso</span>
              <h2 id="school-heading" tabIndex="-1">
                Você não precisa
                <br /> ser artista.
                <br /> <span>Só precisa ser você.</span>
              </h2>
              <p>
                A Pipa é uma escola criativa fictícia para quem quer reencontrar
                o prazer de fazer algo com as próprias mãos — e com as próprias
                ideias.
              </p>
              <p>
                Aqui, a curiosidade vale mais que o resultado. E criar é um
                jeito de estar presente, se escutar e deixar o dia um pouco mais
                seu.
              </p>
            </div>
            <div className="school-values">
              <div>
                <span className="value-mark value-yellow">
                  <Icon name="sun" />
                </span>
                <h3>
                  Menos cobrança,
                  <br /> mais descoberta.
                </h3>
                <p>
                  Não tem certo ou errado. Tem o que você ainda não
                  experimentou.
                </p>
              </div>
              <div>
                <span className="value-mark value-coral">
                  <Icon name="brush" />
                </span>
                <h3>
                  Um tempo que
                  <br /> é todo seu.
                </h3>
                <p>
                  Alguns minutos de atenção já abrem espaço para uma ideia
                  aparecer.
                </p>
              </div>
              <div>
                <span className="value-mark value-cream">
                  <Icon name="bulb" />
                </span>
                <h3>
                  Pequeno também
                  <br /> é um começo.
                </h3>
                <p>
                  Uma frase, uma forma, um rabisco. Você escolhe o tamanho do
                  passo.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          className="path-section section-wrap"
          aria-labelledby="path-heading"
        >
          <div className="path-title">
            <Icon name="sun" />
            <h2 id="path-heading">
              Não precisa complicar.
              <br /> É só dar uma chance.
            </h2>
          </div>
          <ol className="creative-path">
            <li>
              <span className="step-number">1</span>
              <h3>Siga sua curiosidade.</h3>
              <p>
                Escolha entre desenho, escrita ou uma invenção com recortes.
              </p>
            </li>
            <li>
              <span className="step-number">2</span>
              <h3>Faça do seu jeito.</h3>
              <p>
                Entre na experiência. Teste uma ideia, troque de cor, comece de
                novo.
              </p>
            </li>
            <li>
              <span className="step-number">3</span>
              <h3>Leve a vontade com você.</h3>
              <p>Repita no papel, no caderno ou na próxima pausa do seu dia.</p>
            </li>
          </ol>
          <a className="button yellow" href="#experiencias">
            Encontrar minha experiência <Icon name="arrow" />
          </a>
        </section>
        <Signup />
        <section
          className="faq section-wrap"
          id="perguntas"
          aria-labelledby="faq-heading"
        >
          <div className="faq-heading">
            <h2 id="faq-heading" tabIndex="-1">
              Ficou uma
              <br /> curiosidade?
            </h2>
            <p>
              Uma resposta ajuda.
              <br /> Um primeiro rabisco também.
            </p>
            <Kite />
          </div>
          <div className="faq-items">
            {[
              [
                "Preciso ter experiência com arte?",
                "Não. As propostas foram feitas para começar de onde você está. Não há nota, comparação ou resultado esperado. A ideia é experimentar.",
              ],
              [
                "As experiências são gratuitas?",
                "Sim. As três mini-experiências desta página são gratuitas e demonstrativas. Não pedimos conta, cartão ou inscrição para começar.",
              ],
              [
                "Preciso separar algum material?",
                "Para experimentar aqui, basta seu celular ou computador. Depois, se quiser continuar fora da tela, papel, lápis e o que você já tem por perto são um ótimo começo.",
              ],
              [
                "Minhas criações ficam salvas?",
                "As criações ficam apenas na memória da página enquanto a experiência está aberta. Ao fechar a experiência e abrir de novo, você começa uma folha nova. Recarregar ou fechar a página também apaga tudo. Não há envio, download ou armazenamento.",
              ],
              [
                "Como funciona a inscrição?",
                "Este site é um template demonstrativo de uma escola fictícia. O formulário mostra como seria a confirmação, mas não envia seus dados, não cria inscrição real e não inclui você em uma lista de e-mails.",
              ],
            ].map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer className="site-footer section-wrap">
        <div className="footer-top">
          <Brand footer />
          <p>
            Criar faz bem.
            <br /> Começar pequeno também.
          </p>
          <a href="#inicio">Voltar ao começo ↑</a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Pipa · Escola criativa fictícia
          </span>
          <span>Um template para ideias ganharem forma.</span>
        </div>
      </footer>
      <dialog
        className="experience-dialog"
        ref={dialogRef}
        aria-labelledby="dialog-heading"
        onKeyDown={trapFocus}
        onClose={() => openerRef.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const rect = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < rect.left ||
              event.clientX > rect.right ||
              event.clientY < rect.top ||
              event.clientY > rect.bottom
            )
              closeExperience();
          }
        }}
      >
        <div className="dialog-inner">
          <div className="dialog-heading">
            <div>
              <span className="dialog-label">Sua pausa criativa</span>
              <h2 id="dialog-heading">
                {activities.find((activity) => activity.id === active).name}
              </h2>
            </div>
            <button
              className="close-button"
              type="button"
              aria-label="Fechar experiência"
              onClick={closeExperience}
              autoFocus
            >
              <Icon name="close" />
            </button>
          </div>
          <div key={`${active}-${session}`}>
            {active === "draw" ? (
              <DrawExperience />
            ) : active === "write" ? (
              <WriteExperience />
            ) : (
              <InventExperience />
            )}
          </div>
          <p className="dialog-note">
            Só você e a sua ideia. Nada é enviado ou salvo. Ao reabrir, uma
            folha nova.
          </p>
        </div>
      </dialog>
    </>
  );
}
