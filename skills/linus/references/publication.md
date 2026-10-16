# Publicação e lojas

Distinga preparar, enviar rascunho, submeter à revisão e publicar. Siga as
instruções do projeto e a autorização já fornecida para cada efeito remoto.
Confirme conta, identificador, versão, build e artefato antes do envio.

## Chrome Web Store

O auxiliar scripts/chrome-webstore/upload.mjs preserva o envio como rascunho.
Com Node disponível, execute primeiro `node SKILL_DIR/scripts/chrome-webstore/upload.mjs
--cwd PROJECT --item-id ITEM_ID --dry-run` para um plano offline, sem credenciais,
alteração de versão, build ou arquivos de configuração. Resolva os placeholders.

A configuração de projeto .chrome-webstore.json contém itemId, package (comando
de build autorizado) e zip (caminho do pacote). Revise o comando antes de executá-lo.
O runtime deve fornecer CHROME_WEBSTORE_SA_KEY_PATH e CHROME_WEBSTORE_PUBLISHER_ID;
a chave permanece fora do repositório. O helper aceita somente o endpoint OAuth
oficial do Google. Não leia arquivos .env pessoais para descobrir credenciais.

Para enviar, retire --dry-run somente quando o upload de rascunho estiver autorizado.
--bump patch/minor/major ou --version determina a nova versão do manifest; após
autenticar, o helper atualiza a versão, executa o build e envia o ZIP. Em caso de
falha, inspecione a versão local e o status da loja antes de repetir. O script não
submete à revisão nem publica. Entregue comprovante do status realmente observado.

## Outras entregas

Use ferramentas e documentação oficiais disponíveis do projeto/provedor.
Uma compilação local não comprova que a versão foi enviada, revisada ou publicada.
Vercel e outros destinos exigem o procedimento já definido pelo projeto; não
importe configurações globais ou credenciais de outra aplicação.
