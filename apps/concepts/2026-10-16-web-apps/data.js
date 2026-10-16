window.NumaData = {
  screens: [
    {id:'crm',name:'CRM',section:'Comercial',title:'Um bom negócio começa com uma conversa.',description:'Seu pipeline, contatos e próximos passos em um só lugar.',icon:'briefcase',reference:'Attio',nav:['Visão geral','Pipeline','Contatos','Atividades','Relatórios']},
    {id:'gestao',name:'Sistema de gestão',section:'Gestão',title:'Uma visão clara de toda a operação.',description:'Finanças, pedidos e o pulso do seu negócio.',icon:'grid',reference:'Pennylane + ERPNext',nav:['Visão geral','Financeiro','Vendas','Estoque','Relatórios']},
    {id:'pessoas',name:'RH e pessoas',section:'Pessoas',title:'Gente bem cuidada. Time que cresce.',description:'Pessoas, jornadas e momentos que importam.',icon:'users',reference:'Humaans',nav:['Visão geral','Pessoas','Ausências','Onboarding','Desenvolvimento']},
    {id:'ia',name:'Aplicação de IA',section:'Assistente',title:'Espaço para pensar e criar.',description:'Da conversa ao primeiro rascunho, sem perder o contexto.',icon:'spark',reference:'Claude Artifacts',nav:['Assistente','Biblioteca','Documentos','Favoritos']},
    {id:'membros',name:'Área de membros',section:'Academy',title:'Seu próximo passo começa aqui.',description:'Aprenda algo novo. Coloque uma boa ideia em prática.',icon:'book',reference:'Kajabi',nav:['Meu aprendizado','Meus cursos','Explorar','Meus certificados']},
    {id:'comunidade',name:'Comunidade',section:'Comunidade',title:'Boas ideias crescem juntas.',description:'Um lugar para compartilhar o que você está construindo.',icon:'message',reference:'Circle',nav:['Feed','Espaços','Eventos','Membros','Conteúdos salvos']},
    {id:'quiz',name:'Quiz interativo',section:'Descobertas',title:'Um pouco mais sobre o seu jeito.',description:'Cinco perguntas para descobrir como você transforma ideias em ação.',icon:'shapes',reference:'Typeform',nav:['Seu perfil','Como funciona','Resultados']},
    {id:'calculadora',name:'Calculadora interativa',section:'Simulador',title:'Boas ideias, números claros.',description:'Uma estimativa para dar o próximo passo com mais confiança.',icon:'calculator',reference:'involve.me',nav:['Novo orçamento','Comparar cenários','Como calcular']},
    {id:'conversoes',name:'Rastreador de conversões',section:'Analytics',title:'Entenda o caminho até a conversão.',description:'Canais, campanhas e resultados com uma leitura mais clara.',icon:'chart',reference:'Triple Whale',nav:['Visão geral','Campanhas','Funil','Páginas','Relatórios']}
  ],
  deals: [
    {id:1,company:'Casa Lina',name:'Nova presença digital',amount:18400,stage:0,owner:'Marina',tag:'Website',color:'peach',letter:'cl',person:0,note:'Primeira conversa agendada',days:'Hoje'},
    {id:2,company:'Solis',name:'Identidade para uma nova fase',amount:12500,stage:0,owner:'Rafael',tag:'Branding',color:'yellow',letter:'s',person:1,note:'Contato pelo site',days:'Há 2 h'},
    {id:3,company:'Orbit Studio',name:'Produto para novos mercados',amount:32000,stage:1,owner:'Marina',tag:'Produto',color:'purple',letter:'o',person:2,note:'Escopo em construção',days:'Amanhã'},
    {id:4,company:'Mimo',name:'Loja com uma nova experiência',amount:16800,stage:1,owner:'Marina',tag:'E-commerce',color:'pink',letter:'m',person:3,note:'Alinhamento de prioridades',days:'Há 1 dia'},
    {id:5,company:'Lagoa',name:'Uma marca mais próxima',amount:24000,stage:2,owner:'Rafael',tag:'Branding',color:'blue',letter:'la',person:4,note:'Proposta enviada',days:'Hoje'},
    {id:6,company:'Primo Café',name:'O café também no digital',amount:9600,stage:2,owner:'Marina',tag:'Website',color:'green',letter:'p',person:0,note:'Retorno na sexta',days:'Há 3 dias'},
    {id:7,company:'Casa Una',name:'Um novo jeito de apresentar',amount:14200,stage:3,owner:'Rafael',tag:'Website',color:'peach',letter:'u',person:1,note:'Vamos começar na segunda',days:'Ontem'},
    {id:8,company:'Dobra',name:'Design para crescer',amount:22000,stage:3,owner:'Marina',tag:'Produto',color:'purple',letter:'d',person:2,note:'Contrato confirmado',days:'Há 2 dias'}
  ],
  transactions: [
    {id:1,name:'Projeto de identidade',company:'Lagoa',type:'receber',amount:12000,date:'16 out',status:'A receber',color:'blue',letter:'la'},
    {id:2,name:'Ferramentas e assinaturas',company:'Operação',type:'pagar',amount:1240,date:'16 out',status:'A pagar',color:'purple',letter:'↗'},
    {id:3,name:'Website institucional',company:'Casa Una',type:'receber',amount:7100,date:'17 out',status:'A receber',color:'peach',letter:'u'},
    {id:4,name:'Produção e parceiros',company:'Fornecedores',type:'pagar',amount:3800,date:'18 out',status:'Pago',color:'green',letter:'p'},
    {id:5,name:'Consultoria de produto',company:'Dobra',type:'receber',amount:5500,date:'19 out',status:'Recebido',color:'pink',letter:'d'}
  ],
  people: [
    {id:1,name:'Marina Almeida',role:'Product designer',department:'Design',person:0,status:'Disponível',city:'São Paulo'},
    {id:2,name:'Rafael Costa',role:'Desenvolvedor',department:'Tecnologia',person:1,status:'Disponível',city:'Campinas'},
    {id:3,name:'Ana Martins',role:'Head de design',department:'Design',person:2,status:'De férias',city:'Curitiba'},
    {id:4,name:'Lucas Ferreira',role:'Customer success',department:'Operações',person:3,status:'Disponível',city:'Belo Horizonte'},
    {id:5,name:'Joana Lima',role:'Marketing lead',department:'Marketing',person:4,status:'Disponível',city:'Porto Alegre'},
    {id:6,name:'Bia Santos',role:'People partner',department:'Operações',person:5,status:'Disponível',city:'São Paulo'},
    {id:7,name:'Pedro Nunes',role:'Product manager',department:'Tecnologia',person:6,status:'Disponível',city:'Recife'},
    {id:8,name:'Lara Mendes',role:'Brand designer',department:'Design',person:7,status:'Onboarding',city:'Florianópolis'}
  ],
  courses: [
    {id:0,name:'Design que resolve',category:'Design e produto',lessons:12,done:5,cover:0,description:'Da primeira pergunta a uma solução que faz sentido.'},
    {id:1,name:'IA no seu processo criativo',category:'Criatividade e IA',lessons:10,done:2,cover:1,description:'Mais possibilidades, com intenção e repertório.'},
    {id:2,name:'Estratégia para tirar do papel',category:'Negócios',lessons:8,done:0,cover:2,description:'Conecte o que você sabe ao que o mundo precisa.'}
  ],
  posts: [
    {id:1,name:'Ana Martins',person:2,time:'Há 35 min',category:'Discussões',title:'O que você aprendeu criando algo do zero?',body:'Hoje terminei meu primeiro projeto pessoal em muito tempo. O mais difícil foi aceitar que a primeira versão só precisava existir. Qual foi a sua descoberta mais recente?',likes:24,comments:8,liked:false,saved:false,pinned:true},
    {id:2,name:'Rafael Costa',person:1,time:'Há 1 h',category:'Projetos',title:'Um pequeno projeto, uma boa conversa.',body:'Estou explorando como tornar o planejamento de uma semana mais visual. Separei algumas decisões do processo para compartilhar com vocês.',likes:18,comments:4,liked:false,saved:false,cover:2},
    {id:3,name:'Joana Lima',person:4,time:'Há 2 h',category:'Discussões',title:'Uma referência para guardar',body:'Comecei a semana observando mais e salvando menos. Três referências bem entendidas têm me ajudado mais que uma pasta com cem links. Como vocês organizam o repertório?',likes:12,comments:3,liked:false,saved:false}
  ],
  quiz: [
    {question:'Quando uma ideia aparece, qual é o seu primeiro movimento?',hint:'Pense no que você faz naturalmente, antes de qualquer planejamento.',options:['Organizo um caminho para seguir','Converso com alguém sobre ela','Faço um teste para ver acontecer','Exploro diferentes possibilidades']},
    {question:'Qual parte de um projeto mais dá energia a você?',hint:'Aquela etapa em que o tempo passa um pouco mais rápido.',options:['Conectar as peças e definir prioridades','Entender as pessoas envolvidas','Transformar o plano em algo concreto','Imaginar caminhos que ainda não existem']},
    {question:'Quando o caminho fica confuso, você prefere…',hint:'Não existe uma resposta melhor. Existe o seu jeito de começar.',options:['Rever o objetivo e organizar as etapas','Trocar ideias com outras pessoas','Criar uma versão pequena e testar','Dar um passo atrás e buscar referências']},
    {question:'O que você gostaria de ouvir sobre o seu trabalho?',hint:'Escolha a frase que mais combina com o que você valoriza.',options:['“Você trouxe clareza para tudo.”','“Você fez a gente trabalhar melhor.”','“Você fez acontecer de verdade.”','“Você encontrou uma ideia que ninguém viu.”']},
    {question:'Seu próximo projeto merece mais…',hint:'Uma última escolha. Pode responder com o que faz sentido hoje.',options:['Direção e foco','Conversa e colaboração','Prática e experimentação','Repertório e novas possibilidades']}
  ],
  campaigns: [
    {name:'Uma ideia, um começo',channel:'Meta Ads',spend:24400,revenue:92300,conversions:840,visits:21600,color:'blue',letter:'m'},
    {name:'Quem procura, encontra',channel:'Google Ads',spend:16900,revenue:62000,conversions:565,visits:14800,color:'green',letter:'g'},
    {name:'Novos jeitos de criar',channel:'TikTok Ads',spend:8000,revenue:23800,conversions:242,visits:8500,color:'pink',letter:'t'},
    {name:'Uma conversa que continua',channel:'E-mail',spend:0,revenue:11300,conversions:137,visits:3360,color:'purple',letter:'@'}
  ]
};
