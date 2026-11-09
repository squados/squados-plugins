// Ícones de traço próprios das cenas de cartões e notificações (24 × 24).
// Um nome desconhecido vira texto: aceita emoji ou um símbolo curto.
(() => {
  const paths = {
    venda: '<path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
    agenda: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    mensagem: '<path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-9l-5 4v-4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/>',
    estrela: '<path d="m12 3 2.8 6 6.2.3-4.8 4.1 1.6 6.6-5.8-3.6L6.2 20l1.6-6.6L3 9.3 9.2 9 12 3Z"/>',
    pagamento: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>',
    contrato: '<path d="M7 3h7l5 5v13H7V3Z"/><path d="M14 3v5h5M10 14l2 2 4-4"/>',
    grafico: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    raio: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
    relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    alvo: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  }
  window.motionIcon = (node, name) => {
    const key = String(name ?? '').trim().toLowerCase()
    if (Object.hasOwn(paths, key)) {
      node.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[key] + '</svg>'
    } else {
      node.textContent = String(name ?? '').slice(0, 4)
      node.classList.add('glyph')
    }
  }
})()
