export default function App() {
  return (
    <>
      <nav>
        <strong>NORTH / STUDIO</strong>
        <a href="#contact">Vamos conversar ↗</a>
      </nav>
      <main>
        <span className="eyebrow">IDEIAS QUE GANHAM FORMA</span>
        <h1>
          O próximo capítulo
          <br />
          começa com você.
        </h1>
        <p className="intro">
          Uma solução clara, feita para pessoas que querem transformar possibilidades em resultados.
        </p>
        <a className="button" href="#contact">
          Conheça a proposta ↗
        </a>
        <section className="grid">
          <article>
            <span>01</span>
            <h2>Clareza</h2>
            <p>Uma mensagem direta para o seu público.</p>
          </article>
          <article>
            <span>02</span>
            <h2>Confiança</h2>
            <p>Conteúdo e benefícios organizados.</p>
          </article>
          <article>
            <span>03</span>
            <h2>Próximo passo</h2>
            <p>Uma ação simples para começar.</p>
          </article>
        </section>
        <section id="contact">
          <h2>Vamos criar algo útil.</h2>
          <a href="mailto:contato@example.com">contato@example.com</a>
        </section>
      </main>
    </>
  );
}
