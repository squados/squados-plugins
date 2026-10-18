import { useState } from "react";
export default function App() {
  const [period, setPeriod] = useState("Mês");
  return (
    <>
      <nav>
        <strong>PULSO / RESULTADOS</strong>
        <button type="button" onClick={() => setPeriod(period === "Mês" ? "Semana" : "Mês")}>
          {period} ↓
        </button>
      </nav>
      <main>
        <span className="eyebrow">VISÃO GERAL</span>
        <h1>
          Seu trabalho.
          <br />
          Em perspectiva.
        </h1>
        <p className="intro">Indicadores demonstrativos do período selecionado.</p>
        <section className="grid">
          <article>
            <span>RECEITA</span>
            <h2>{period === "Mês" ? "R$ 48.200" : "R$ 12.050"}</h2>
            <p>18% acima do período anterior</p>
          </article>
          <article>
            <span>ENTREGAS</span>
            <h2>{period === "Mês" ? "42" : "11"}</h2>
            <p>Projetos concluídos</p>
          </article>
          <article>
            <span>SATISFAÇÃO</span>
            <h2>94%</h2>
            <p>Avaliação dos últimos atendimentos</p>
          </article>
        </section>
        <section>
          <h2>Atividade recente</h2>
          <p>Projeto Aurora · Concluído</p>
          <p>Proposta Norte · Em revisão</p>
          <p>Relatório do período · Publicado</p>
        </section>
      </main>
    </>
  );
}
