// Vocabulário da interface adaptada. Identificadores do motor permanecem nativos.
const pt = {
  name:'Simulador de Cidades', city:'Nova Aurora', municipality:'Prefeitura', management:'Gestão da cidade',
  overview:'Panorama urbano', build:'Construir', services:'Serviços', demand:'Demanda',
  class:'Porte', date:'Calendário', population:'População', money:'Fundos', score:'Pontuação', happiness:'Satisfação',
  Budget:'Orçamento', Eval:'Avaliação', Orders:'Leis', Ordinances:'Leis', Economy:'Economia', Awards:'Conquistas',
  History:'Histórico', Overlay:'Mapas', Overlays:'Mapas', Disaster:'Desastres', Disasters:'Desastres', Files:'Salvar e abrir', About:'Créditos',
  residential:'Moradias', commercial:'Comércio', industrial:'Indústria', road:'Rua', bulldozer:'Demolir', rail:'Ferrovia', wire:'Energia',
  coal:'Usina a carvão', nuclear:'Usina nuclear', turbine:'Turbina', park:'Parque', fire:'Bombeiros', police:'Polícia', hospital:'Hospital',
  school:'Escola', port:'Porto', stadium:'Estádio', airport:'Aeroporto', query:'Consultar', none:'Mover',
  pause:'Pausar', slow:'Devagar', normal:'Velocidade normal', fast:'Rápido', veryFast:'Muito rápido',
  unavailable:'Indisponível nesta versão', selectTool:'Escolha uma ferramenta e clique no terreno.',
  loading:'Preparando a cidade', loadingEnvironment:'Preparando a luz e o céu', loadingTexture:'Preparando os materiais',
  loadingImages:'Preparando o terreno', loadingModels:'Preparando os edifícios', loadingMap:'Abrindo Nova Aurora',
  welcome:'Sua cidade está em movimento.', cityGrowing:'A população chegou a', blizzard:'Nevasca: as ruas precisam de manutenção.',
  Village:'Vila', Town:'Município', City:'Cidade', Capital:'Capital', Metropolis:'Metrópole', Megalopolis:'Megalópole',
  close:'Fechar', 'Save Load':'Salvar e abrir', localSave:'Salvar local', exportSave:'Exportar JSON', loadLocal:'Abrir local', restartCity:'Reiniciar Nova Aurora', baseCredit:'Base e recursos herdados', ownCredit:'Identidade e adaptação', licenses:'Licenças', licenseNotice:'GPLv3 + termos Micropolis. Avisos MIT dos componentes preservados.',
};
const en = {
  name:'City Simulator', city:'Nova Aurora', municipality:'City hall', management:'City management', overview:'Urban overview',
  build:'Build', services:'Services', demand:'Demand', class:'Size', date:'Calendar', population:'Population', money:'Funds', score:'Score', happiness:'Satisfaction',
  Budget:'Budget', Eval:'Evaluation', Orders:'Ordinances', Ordinances:'Ordinances', Economy:'Economy', Awards:'Awards', History:'History',
  Overlay:'Maps', Overlays:'Maps', Disaster:'Disasters', Disasters:'Disasters', Files:'Save and open', About:'Credits',
  residential:'Housing', commercial:'Commerce', industrial:'Industry', road:'Road', bulldozer:'Demolish', rail:'Railway', wire:'Power', coal:'Coal plant', nuclear:'Nuclear plant',
  turbine:'Turbine', park:'Park', fire:'Fire station', police:'Police', hospital:'Hospital', school:'School', port:'Port', stadium:'Stadium', airport:'Airport', query:'Inspect', none:'Pan',
  pause:'Pause', slow:'Slow', normal:'Normal speed', fast:'Fast', veryFast:'Very fast', unavailable:'Unavailable in this version',
  selectTool:'Choose a tool, then click the ground.', loading:'Preparing the city', loadingEnvironment:'Preparing the light and sky',
  loadingTexture:'Preparing materials', loadingImages:'Preparing the ground', loadingModels:'Preparing buildings', loadingMap:'Opening Nova Aurora',
  welcome:'Your city is in motion.', cityGrowing:'Population has reached', blizzard:'Blizzard: the roads need maintenance.',
  Village:'Village', Town:'Town', City:'City', Capital:'Capital', Metropolis:'Metropolis', Megalopolis:'Megalopolis',
  close:'Close', 'Save Load':'Save and open', localSave:'Save locally', exportSave:'Export JSON', loadLocal:'Open local save', restartCity:'Restart Nova Aurora', baseCredit:'Original engine and resources', ownCredit:'Identity and adaptation', licenses:'Licenses', licenseNotice:'GPLv3 + Micropolis additional terms. Component MIT notices preserved.',
};
export const language = () => document.documentElement.lang === 'en' ? 'en' : 'pt-BR';
export const t = key => (language()==='en'?en:pt)[key] || key;
export function message(text) {
  if(!text) return t('welcome');
  if(text==='Welcome to 3D City') return t('welcome');
  if(text.startsWith('Population has reached')) {
    const population=Number(text.replace(/\D/g,''));
    return t('cityGrowing')+' '+new Intl.NumberFormat(language()).format(population);
  }
  if(text.startsWith('Blizzard!')) return t('blizzard');
  return text;
}
