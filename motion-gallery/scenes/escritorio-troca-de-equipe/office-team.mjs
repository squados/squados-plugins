import * as T from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { clone } from 'three/addons/utils/SkeletonUtils.js';

const base = 'assets/rocketbox/';
const clamp = x => Math.max(0, Math.min(1, x));
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };

export async function teamCast() {
  const manager = new T.LoadingManager();
  manager.addHandler(/\.tga$/i, { load: () => new T.Texture(), setPath() { return this; } });
  const images = new T.TextureLoader();
  const [original, body, head, bodyNormal, headNormal] = await Promise.all([
    new FBXLoader(manager).loadAsync(base + 'Male_Adult_11.fbx'),
    ...['body-color.jpg', 'head-color.jpg', 'body-normal.jpg', 'head-normal.jpg'].map(file => images.loadAsync(base + file)),
  ]);
  body.colorSpace = head.colorSpace = T.SRGBColorSpace;
  const shirts = ['#6086b9', '#c29669', '#729a8a', '#a380a4', '#bf8e82', '#9ca6bf'];
  const skin = new T.MeshStandardMaterial({ map: head, normalMap: headNormal, roughness: .76 });
  return shirts.map((color, index) => {
    const model = clone(original);
    model.scale.setScalar(.0093);
    const actor = new T.Group();
    actor.add(model);
    const clothes = new T.MeshStandardMaterial({ map: body, normalMap: bodyNormal, color, roughness: .88 });
    const bones = {};
    model.traverse(node => {
      if (node.isBone) bones[node.name.replace('Bip01_', '')] = node;
      if (node.isSkinnedMesh) {
        node.material = node.material.map(m => m.name.endsWith('_head') ? skin : clothes);
        node.castShadow = true;
        node.frustumCulled = false;
      }
    });
    model.updateMatrixWorld(true);
    const position = bone => bones[bone].getWorldPosition(new T.Vector3());
    const toe = position('L_Toe0').sub(position('L_Foot'));
    model.rotation.y = Math.PI - Math.atan2(toe.x, toe.z);
    actor.updateMatrixWorld(true);
    const shoe = Math.min(position('L_Toe0').y, position('R_Toe0').y);
    model.position.y += .035 - shoe;
    const pose = Object.fromEntries(Object.entries(bones).map(([key, bone]) => [key, bone.quaternion.clone()]));
    function aim(bone, end, x, y, z) {
      const joint = bones[bone];
      const parent = joint.parent.getWorldQuaternion(new T.Quaternion());
      const delta = new T.Quaternion().setFromUnitVectors(
        position(end).sub(position(bone)).normalize(), new T.Vector3(x, y, z).normalize(),
      );
      joint.quaternion.premultiply(parent.clone().invert().multiply(delta).multiply(parent));
      joint.updateMatrixWorld(true);
    }
    return { actor, update(t, entry, remove) {
      const walk = ease((t - entry) / .85);
      const seat = ease((t - entry - .64) / .53);
      actor.visible = t >= entry && t < remove;
      if (!actor.visible) return;
      const stride = Math.sin((t - entry) * 14 + index * .38) * (1 - seat);
      const fromSide = index % 2 ? .55 : -.55;
      actor.position.set(fromSide * (1 - walk), -.42 * seat + .035 * Math.abs(stride), 2.64 - 1.66 * walk);
      for (const [name, rotation] of Object.entries(pose)) bones[name].quaternion.copy(rotation);
      actor.updateMatrixWorld(true);
      for (const [side, sign] of [['L', -1], ['R', 1]]) {
        aim(side + '_Thigh', side + '_Calf', .09 * sign, -.96 + .78 * seat, -.95 * seat + .29 * stride * sign);
        aim(side + '_Calf', side + '_Foot', 0, -.99, .25 * seat + .12 * Math.max(0, stride * sign));
        aim(side + '_Foot', side + '_Toe0', 0, -.09, -.99);
        aim(side + '_UpperArm', side + '_Forearm', .16 * sign, -.97, -.05 - .2 * seat - .26 * stride * sign);
        aim(side + '_Forearm', side + '_Hand', -.11 * sign, -.85 + .62 * seat, -.16 - .8 * seat);
      }
    }};
  });
}

export function deskHeight(t, start) {
  if (t < start) return null;
  const drop = (t - start) / .36;
  if (drop < 1) return 5.8 * (1 - drop * drop);
  const after = t - start - .36;
  return .25 * Math.abs(Math.sin(after * 17)) * Math.exp(-8 * after);
}

export function seatPop(room, x, z) {
  const group = new T.Group();
  group.position.set(x, 1.02, z + .88);
  room.add(group);
  const geometry = new T.IcosahedronGeometry(1, 1);
  const colors = ['#cbe6ff', '#fff1cb', '#bcb3ff'];
  const particles = Array.from({ length: 11 }, (_, i) => {
    const material = new T.MeshBasicMaterial({ color: colors[i % 3], transparent: true, depthWrite: false });
    const mesh = new T.Mesh(geometry, material);
    group.add(mesh);
    return mesh;
  });
  return (t) => {
    group.visible = t >= 0 && t < .45;
    if (!group.visible) return;
    particles.forEach((mesh, i) => {
      const p = clamp(t / .45);
      const travel = 1 - (1 - p) ** 3;
      const angle = i * Math.PI * 2 / particles.length;
      mesh.position.set(Math.cos(angle) * (.12 + .62 * travel), .5 * travel + .2 * Math.sin(angle),
        Math.sin(angle) * (.12 + .55 * travel));
      mesh.scale.setScalar((.065 + .055 * (i % 3)) * (1 - p) ** .72);
      mesh.material.opacity = .9 * (1 - p) ** 1.3;
    });
  };
}
