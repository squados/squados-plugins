export default function App() {
  return (
    <>
      <nav>
        <strong>ANA / DESIGN</strong>
        <a href="#contact">Contato ↗</a>
      </nav>
      <main>
        <span className="eyebrow">PROJETOS SELECIONADOS · 2026</span>
        <h1>
          Design que
          <br />
          faz sentido.
        </h1>
        <p className="intro">
          Ideias, identidades e experiências construídas com atenção aos detalhes.
        </p>
        <section className="grid">
          <article>
            <span>IDENTIDADE</span>
            <h2>Uma nova perspectiva</h2>
            <p>Marca e direção visual para um novo começo.</p>
          </article>
          <article>
            <span>DIGITAL</span>
            <h2>Mais perto</h2>
            <p>Uma experiência de produto que aproxima pessoas.</p>
          </article>
          <article>
            <span>EDITORIAL</span>
            <h2>Entre páginas</h2>
            <p>Histórias e informações em um ritmo claro.</p>
          </article>
        </section>
        <section id="contact">
          <h2>Tem um projeto em mente?</h2>
          <a href="mailto:hello@example.com">hello@example.com</a>
        </section>
      </main>
    </>
  );
}
