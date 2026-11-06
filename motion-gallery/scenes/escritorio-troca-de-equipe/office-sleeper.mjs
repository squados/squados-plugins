import * as T from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

const source = 'assets/rocketbox/';

export async function loadSleeper() {
  const manager = new T.LoadingManager();
  // Rocketbox references original TGAs. The staged web textures are assigned by material below.
  manager.addHandler(/\.tga$/i, { load: () => new T.Texture(), setPath() { return this; } });
  const textures = new T.TextureLoader();
  const [actor, body, head, bodyNormal, headNormal] = await Promise.all([
    new FBXLoader(manager).loadAsync(source + 'Male_Adult_11.fbx'),
    textures.loadAsync(source + 'body-color.jpg'),
    textures.loadAsync(source + 'head-color.jpg'),
    textures.loadAsync(source + 'body-normal.jpg'),
    textures.loadAsync(source + 'head-normal.jpg'),
  ]);
  for (const texture of [body, head]) texture.colorSpace = T.SRGBColorSpace;
  for (const texture of [body, head, bodyNormal, headNormal]) texture.anisotropy = 8;
  const skin = new T.MeshStandardMaterial({ map: head, normalMap: headNormal, normalScale: new T.Vector2(.4, -.4), roughness: .65 });
  const clothes = new T.MeshStandardMaterial({ map: body, normalMap: bodyNormal, normalScale: new T.Vector2(.48, -.48), roughness: .88 });
  const bones = {};
  actor.traverse(node => {
    if (node.isBone) bones[node.name.replace('Bip01_', '')] = node;
    if (node.isSkinnedMesh) {
      node.material = node.material.map(mat => mat.name.endsWith('_head') ? skin : clothes);
      node.castShadow = node.receiveShadow = true;
      node.frustumCulled = false;
    }
  });
  actor.updateMatrixWorld(true);
  const position = (bone) => bones[bone].getWorldPosition(new T.Vector3());

  function rotateWorld(bone, rotation) {
    const joint = bones[bone];
    const parent = joint.parent.getWorldQuaternion(new T.Quaternion());
    joint.quaternion.premultiply(parent.clone().invert().multiply(rotation).multiply(parent));
    joint.updateMatrixWorld(true);
  }

  function aim(bone, child, direction) {
    const from = position(child).sub(position(bone)).normalize();
    const swing = new T.Quaternion().setFromUnitVectors(from, new T.Vector3(...direction).normalize());
    rotateWorld(bone, swing);
  }

  function handFrame(forward, palm) {
    const across = new T.Vector3().crossVectors(palm, forward).normalize();
    const normal = new T.Vector3().crossVectors(forward, across);
    return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(across, normal, forward));
  }

  function restHand(side, direction, palmDirection) {
    const wrist = side + '_Hand';
    const finger = (suffix) => side + '_Finger' + suffix;
    const forward = position(finger('2')).sub(position(wrist)).normalize();
    const thumbward = position(finger('1')).sub(position(finger('4')));
    const palm = new T.Vector3().crossVectors(forward, thumbward).multiplyScalar(side === 'L' ? 1 : -1);
    const targetPalm = new T.Vector3(...palmDirection).normalize();
    const target = handFrame(new T.Vector3(...direction).normalize(), targetPalm);
    rotateWorld(wrist, target.multiply(handFrame(forward, palm).invert()));

    const thumb = position(finger('01')).sub(position(finger('0')));
    thumb.addScaledVector(targetPalm, -thumb.dot(targetPalm));
    aim(finger('0'), finger('01'), thumb.toArray());

    for (const [digit, curl] of [[1, .09], [2, .12], [3, .14], [4, .17]]) {
      for (const [joint, next, angle] of [['', '1', curl], ['1', '2', curl * 1.25]]) {
        const name = finger(digit + joint);
        const segment = position(finger(digit + next)).sub(position(name));
        const axis = segment.cross(targetPalm).normalize();
        rotateWorld(name, new T.Quaternion().setFromAxisAngle(axis, angle));
      }
    }
  }

  aim('L_UpperArm', 'L_Forearm', [.20, -.94, .08]);
  aim('L_Forearm', 'L_Hand', [-.68, -.40, .63]);
  aim('R_UpperArm', 'R_Forearm', [-.24, -.96, .12]);
  aim('R_Forearm', 'R_Hand', [.43, -.81, .45]);
  // The far hand rests on the shirt and the near hand follows the thigh.
  restHand('L', [-.87, -.46, .17], [0, -.12, -1]);
  restHand('R', [.22, -.92, .27], [.36, .08, -1]);
  aim('L_Thigh', 'L_Calf', [.04, -.94, .30]);
  aim('L_Calf', 'L_Foot', [-.05, -.98, .16]);
  aim('R_Thigh', 'R_Calf', [-.07, -.97, .24]);
  aim('R_Calf', 'R_Foot', [.12, -.98, .17]);
  for (const side of ['L', 'R']) {
    const upper = bones[side + 'EyeBlinkTop'];
    const lower = position(side + 'EyeBlinkBottom');
    const closed = position(side + 'EyeBlinkTop').lerp(lower, .84);
    upper.position.copy(upper.parent.worldToLocal(closed));
  }

  actor.scale.setScalar(.0112);
  actor.position.set(0, -1.00, 0);
  const recline = new T.Group();
  recline.add(actor);
  const spine = new T.Vector3(-1, .08, -.08).normalize();
  const cross = new T.Vector3().crossVectors(spine, new T.Vector3(-.04, .87, .49)).normalize();
  const face = new T.Vector3().crossVectors(cross, spine).normalize();
  recline.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(cross, spine, face));
  return recline;
}
