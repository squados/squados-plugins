# Navegador e testes

Use a aplicação, origem e sessão realmente autorizadas. Prefira o mecanismo de navegador presente no Studio; para testes por terminal, use a ferramenta do projeto. Playwright CLI e uso interativo são variantes deste mesmo modo. No Windows, invoque o comando Node/npx apropriado, sem depender de bash para um wrapper Unix.

Capture estado e use seletores observáveis; valide navegação, formulários, erros e resultado final. Estado JavaScript alterado por evaluate não comprova interação pela interface. Depois de mutações remotas, confirme o estado e registre o efeito; credenciais e sessão não entram em código ou screenshots públicos. Em execução interativa, preserve referências da mesma sessão; reobtenha locators após navegação/DOM substituído. Feche processos próprios ao terminar.
