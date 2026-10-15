/* Compatibilidade pontual do Three.js 50dev com validadores GLSL atuais.
 * O upstream declara renderType sem precisão; vertex e fragment escolhem
 * padrões diferentes, causando falha de link do shader de lens flare.
 */
Object.keys(THREE.ShaderFlares).forEach(function (name) {
  var shader = THREE.ShaderFlares[name];
  ['vertexShader', 'fragmentShader'].forEach(function (stage) {
    shader[stage] = shader[stage].replace('uniform int renderType;', 'uniform mediump int renderType;');
  });
});
