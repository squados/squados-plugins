import * as T from 'three';

// Silhuetas do Cerâmica canônico do SquadOS Studio, em coordenadas da arte vetorial.
const SHELL = 'M88 60Q98 32 160 31Q221 32 234 62L243 104Q248 135 226 156Q205 174 160 177Q114 176 94 158Q72 141 77 109Z';
const VISOR = 'M104 76Q122 68 159 68Q193 68 211 77Q226 85 226 110Q227 132 211 141Q195 151 159 151Q124 151 107 141Q92 132 92 110Q92 86 104 76Z';
const BODY = 'M127 170Q112 175 116 201L123 226Q131 249 160 252Q189 249 197 226L204 201Q208 175 193 170Z';

function ceramicRelief(path, centerY, scale, depth, bevel) {
  const shape = new T.Shape();
  for (const [command, coordinates] of [...path.matchAll(/([MQLZ])([^MQLZ]*)/g)].map(([, c, p]) => [c, p])) {
    const p = coordinates.trim().split(/\s+/).map(Number);
    const x = i => (p[i] - 160) * scale, y = i => (centerY - p[i]) * scale;
    if (command === 'M') shape.moveTo(x(0), y(1));
    if (command === 'L') shape.lineTo(x(0), y(1));
    if (command === 'Q') shape.quadraticCurveTo(x(0), y(1), x(2), y(3));
    if (command === 'Z') shape.closePath();
  }
  return new T.ExtrudeGeometry(shape, {
    depth, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 5, curveSegments: 10, steps: 1,
  });
}

const helmet = ceramicRelief(SHELL, 105, .00303, .205, .052);
const glass = ceramicRelief(VISOR, 105, .00308, .008, .014);
const hull = ceramicRelief(BODY, 210, .00434, .154, .038);
const sphere = new T.SphereGeometry(1, 20, 12);
const enamel = new T.MeshPhysicalMaterial({
  color: '#ece8fb', roughness: .26, metalness: .03, clearcoat: .86, clearcoatRoughness: .24,
});
const shade = new T.MeshPhysicalMaterial({
  color: '#d5c9f3', roughness: .28, metalness: .07, clearcoat: .68,
});
const visor = new T.MeshPhysicalMaterial({
  color: '#2b154c', roughness: .25, metalness: .20, clearcoat: 1, clearcoatRoughness: .18,
});
const white = new T.MeshStandardMaterial({
  color: '#f3e9ff', emissive: '#f1ddff', emissiveIntensity: .68, roughness: .36,
});
const lavender = new T.MeshStandardMaterial({
  color: '#8052d2', emissive: '#5e3693', emissiveIntensity: .27, roughness: .32,
});

function piece(parent, geometry, material, position, scale) {
  const mesh = new T.Mesh(geometry, material);
  mesh.position.set(...position);
  if (scale) mesh.scale.set(...scale);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function addCeramic(station, index) {
  const body = new T.Group(), head = new T.Group();
  station.add(body, head);
  body.position.set(0, .720, .006);
  piece(body, hull, enamel, [0, 0, -.085]);
  piece(body, sphere, shade, [0, .099, .013], [.122, .08, .115]);
  piece(body, sphere, lavender, [0, .035, .105], [.059, .039, .017]);
  piece(body, sphere, white, [-.009, .041, .121], [.025, .0037, .002]);
  piece(body, sphere, white, [.009, .027, .121], [.016, .0037, .002]);

  head.position.set(0, 1.163, .02);
  piece(head, helmet, enamel, [0, 0, -.103]);
  piece(head, glass, visor, [0, 0, .153]);
  const eyes = [-.086, .084].map(x =>
    piece(head, sphere, white, [x, -.021, .178], [.027, .037, .009]));
  const smile = new T.QuadraticBezierCurve3(
    new T.Vector3(-.045, -.083, .179), new T.Vector3(0, -.123, .180), new T.Vector3(.043, -.083, .179));
  piece(head, new T.TubeGeometry(smile, 16, .006, 7, false), white, [0, 0, 0]);
  const hands = [-1, 1].map(sign => {
    const hand = piece(station, sphere, enamel, [sign * .147, .821, .45], [.059, .031, .069]);
    hand.rotation.y = sign * .22;
    return hand;
  });

  return (t, response = 0) => {
    const phase = t + index * 1.75;
    head.rotation.set(.09 + .025 * Math.sin(phase * 1.6), -.38 - response * .25 + .085 * Math.sin(phase * 1.2), -.024 * Math.sin(phase * 2));
    const blink = Math.max(.10, 1 - Math.max(0, 1 - Math.abs((phase % 4.7) - 2.2) * 18));
    for (const eye of eyes) eye.scale.y = .037 * blink;
    hands.forEach((hand, i) => {
      const beat = (.5 + .5 * Math.sin(phase * (i ? 12.3 : 15.6) + i * 1.8)) ** 2;
      hand.position.y = .821 + .013 * beat;
      hand.position.z = .451 + .013 * Math.sin(phase * 2.7 + i);
      hand.rotation.x = .033 + .065 * beat;
    });
  };
}

function handFrame(forward, palm) {
  const across = new T.Vector3().crossVectors(palm, forward).normalize();
  const normal = new T.Vector3().crossVectors(forward, across);
  return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(across, normal, forward));
}

export function addEditor(station, model, clip) {
  station.add(model);
  const bone = key => model.getObjectByName('Bip01_' + key);
  const at = key => bone(key).getWorldPosition(new T.Vector3());
  model.traverse(node => {
    if (!node.isMesh) return;
    node.castShadow = node.receiveShadow = true;
    if (node.isSkinnedMesh) node.frustumCulled = false;
  });
  const mixer = new T.AnimationMixer(model);
  const action = mixer.clipAction(clip).play();
  action.paused = true;

  function rotateWorld(name, q) {
    const joint = bone(name);
    const parent = joint.parent.getWorldQuaternion(new T.Quaternion());
    joint.quaternion.premultiply(parent.clone().invert().multiply(q).multiply(parent));
    joint.updateMatrixWorld(true);
  }

  function aim(name, child, direction) {
    const from = at(child).sub(at(name)).normalize();
    rotateWorld(name, new T.Quaternion().setFromUnitVectors(from, direction.normalize()));
  }

  function arm(side, sign, t, correction, localFrame) {
    const shoulderName = side + '_UpperArm', elbowName = side + '_Forearm';
    const wristName = side + '_Hand', finger = digit => side + '_Finger' + digit;
    const handX = sign * (.146 + (sign < 0 ? .155 * correction : 0));
    const handZ = .342 + (sign < 0 ? .10 * correction : 0);
    const goal = model.parent.localToWorld(new T.Vector3(handX, .824 + .003 * Math.sin(t * 8 + sign) + (sign < 0 ? .016 * correction : 0), handZ));
    const shoulder = at(shoulderName), elbow = at(elbowName), wrist = at(wristName);
    const upper = shoulder.distanceTo(elbow), lower = elbow.distanceTo(wrist);
    const direction = goal.clone().sub(shoulder).normalize();
    const length = Math.min(goal.distanceTo(shoulder), upper + lower - .002);
    const projection = (length * length + upper * upper - lower * lower) / (2 * length);
    const bend = elbow.clone().sub(shoulder);
    bend.addScaledVector(direction, -bend.dot(direction)).normalize();
    const targetElbow = shoulder.clone().addScaledVector(direction, projection)
      .addScaledVector(bend, Math.sqrt(Math.max(0, upper * upper - projection * projection)));
    aim(shoulderName, elbowName, targetElbow.sub(shoulder));
    aim(elbowName, wristName, goal.sub(at(elbowName)));

    const current = at(finger('2')).sub(at(wristName)).normalize();
    const thumbward = at(finger('1')).sub(at(finger('4')));
    const currentPalm = new T.Vector3().crossVectors(current, thumbward).multiplyScalar(sign);
    const forward = new T.Vector3(-sign * .10, .036, 1).normalize().applyQuaternion(localFrame);
    const palm = new T.Vector3(0, -1, .025).normalize().applyQuaternion(localFrame);
    rotateWorld(wristName, handFrame(forward, palm).multiply(handFrame(current, currentPalm).invert()));

    const thumb = at(finger('01')).sub(at(finger('0')));
    thumb.addScaledVector(palm, -thumb.dot(palm));
    aim(finger('0'), finger('01'), thumb);
    for (const [i, digit] of ['1', '2', '3', '4'].entries()) {
      const tap = (.5 + .5 * Math.sin(t * (11.1 + i * .77) + sign * 1.8 + i * 1.7)) ** 3;
      for (const [part, next, turn] of [['', '1', .13 + .119 * tap], ['1', '2', .23 + .13 * tap]]) {
        const key = finger(digit + part);
        const vector = at(finger(digit + next)).sub(at(key));
        const axis = vector.cross(palm).normalize();
        rotateWorld(key, new T.Quaternion().setFromAxisAngle(axis, turn));
      }
    }
  }

  return {
    model,
    pose(t, correction = 0) {
      action.time = (t * .84 + .56) % clip.duration;
      mixer.update(0);
      model.updateMatrixWorld(true);
      const stationOrientation = model.parent.getWorldQuaternion(new T.Quaternion());
      arm('L', 1, t, 0, stationOrientation);
      arm('R', -1, t, correction, stationOrientation);
    },
    fingers() {
      return ['L', 'R'].map(side =>
        ['1', '2', '3', '4'].map(digit => model.parent.worldToLocal(at(side + '_Finger' + digit + '2')).toArray()));
    },
  };
}
