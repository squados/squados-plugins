import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const sat = x => Math.max(0, Math.min(1, x));
const settle = x => x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.exp(-7*x) * (Math.cos(8*x) + .36*Math.sin(8*x));
const smooth = x => { x = sat(x); return x*x*(3-2*x); };

function topology(source) {
  const position = source.getAttribute('position');
  const index = source.getIndex();
  const n = position.count;
  const welded = new Map();
  const vertex = new Uint32Array(n);
  for (let i=0; i<n; i++) {
    const k = [position.getX(i),position.getY(i),position.getZ(i)].map(v => Math.round(v*10000)).join('/');
    if (!welded.has(k)) welded.set(k,welded.size);
    vertex[i]=welded.get(k);
  }
  const tree = Uint32Array.from({length:welded.size},(_,i)=>i);
  const root = i => {
    while (tree[i]!==i) { tree[i]=tree[tree[i]]; i=tree[i]; }
    return i;
  };
  const count=index?.count || n;
  const at=i=>index ? index.getX(i) : i;
  for (let i=0;i<count;i+=3) {
    const a=root(vertex[at(i)]);
    tree[root(vertex[at(i+1)])]=a;
    tree[root(vertex[at(i+2)])]=a;
  }
  const groups=new Map();
  for (let i=0;i<count;i+=3) {
    const a=root(vertex[at(i)]);
    if (!groups.has(a)) groups.set(a,[]);
    groups.get(a).push(at(i),at(i+1),at(i+2));
  }
  return [...groups.values()];
}

function separate(source, indexes) {
  const geo = new T.BufferGeometry();
  const used = [...new Set(indexes)];
  const inverse = new Map(used.map((v,i)=>[v,i]));
  for (const [name,a] of Object.entries(source.attributes)) {
    const out = new Float32Array(used.length*a.itemSize);
    used.forEach((v,i)=> {
      for (let k=0;k<a.itemSize;k++) out[i*a.itemSize+k]=a.getComponent(v,k);
    });
    geo.setAttribute(name,new T.BufferAttribute(out,a.itemSize));
  }
  geo.setIndex(indexes.map(i=>inverse.get(i)));
  geo.computeBoundingBox();
  return geo;
}

function lightRig(scene, renderer) {
  scene.add(new T.HemisphereLight('#edf3ff','#554878',2.1));
  for (const [hex, power, p] of [['#f8f4ff',2.8,[4,8,4]],['#9aa8ff',2.15,[-5,3,-5]],['#ffb884',1.3,[-3,1,6]]]) {
    const light = new T.DirectionalLight(hex,power);
    light.position.set(...p);
    scene.add(light);
  }
  const env = new RoomEnvironment();
  const pmrem = new T.PMREMGenerator(renderer);
  scene.environment=pmrem.fromScene(env,.045).texture;
  scene.environmentIntensity=.84;
  env.dispose();
  pmrem.dispose();
}

function components(asset, stage) {
  const parts=[];
  const bounds=new T.Box3().setFromObject(asset);
  const center=bounds.getCenter(new T.Vector3());
  const dim=bounds.getSize(new T.Vector3());
  const scale=4.72/dim.x;
  asset.updateMatrixWorld(true);
  asset.traverse(mesh=>{
    if (!mesh.isMesh) return;
    const raw=mesh.geometry;
    const byComponent=topology(raw);
    const pieces=byComponent.filter(indexes=>indexes.length>=150);
    const extras=byComponent.filter(indexes=>indexes.length<150).flat();
    if (extras.length) pieces.push(extras);
    const mat=mesh.material.clone();
    mat.side=T.DoubleSide;
    pieces.forEach((indices,i)=>{
      const geo=separate(raw,indices);
      geo.applyMatrix4(mesh.matrixWorld);
      geo.translate(-center.x,-bounds.min.y,-center.z);
      geo.scale(scale,scale,scale);
      geo.computeBoundingBox();
      const at=geo.boundingBox.getCenter(new T.Vector3());
      const extent=geo.boundingBox.getSize(new T.Vector3());
      geo.translate(-at.x,-at.y,-at.z);
      const object=new T.Mesh(geo,mat);
      object.position.copy(at);
      stage.add(object);
      const k=parts.length;
      const side=Math.abs(at.z)>.06 ? Math.sign(at.z) : k%2 ? 1 : -1;
      const shell=extent.x>1.16 || extent.y>.38 || extent.z>.66;
      const wheel=/tire|rim/i.test(mat.name)&&Math.abs(at.z)>.48 && at.y<.82;
      const height=wheel ? -.14-(k%5)*.065 : shell ? .72+at.y*.72+(k%3)*.13 : .18+(k%9)*.116;
      const shift=new T.Vector3(at.x*.48+(Math.sin(k*2.399)*.16),height,
        side*(wheel ? 1.03+(k%4)*.055 : shell ? .38+Math.abs(at.z)*.34 : .35+(k%11)*.12));
      if (extent.x>3.2 && extent.z>.95) shift.set(.08,1.62+.15*(i%3),-.16);
      parts.push({object,at,shift,lag:wheel?.10:shell?.02:.10+.014*(k%9),spin:shell?.18:.38});
    });
  });
  return parts;
}

function battery(stage) {
  const baseMat = new T.MeshStandardMaterial({color:'#2f3947',metalness:.75,roughness:.39});
  const base=new T.Mesh(new T.BoxGeometry(2.90,.055,1.44),baseMat);
  base.position.set(0,.20,0);
  stage.add(base);
  const geom=new T.CylinderGeometry(.028,.028,.095,9);
  const mat=new T.MeshStandardMaterial({color:'#cdd5e2',metalness:.72,roughness:.33});
  const rows=9, cols=24;
  const cells=new T.InstancedMesh(geom,mat,rows*cols);
  cells.instanceMatrix.setUsage(T.DynamicDrawUsage);
  cells.frustumCulled=false;
  stage.add(cells);
  const dummy=new T.Object3D();
  const cellColor=new T.Color();
  for (let i=0;i<rows*cols;i++) {
    cellColor.set(i%5===0 ? '#b1977d' : '#aebfd4');
    cells.setColorAt(i,cellColor);
  }
  const covers=Array.from({length:8},(_,i)=>{
    const metal=new T.Mesh(new T.BoxGeometry(.321,.025,1.37),baseMat);
    stage.add(metal);
    return metal;
  });
  return (t)=>{
    const p=settle((t-.37)/1.04);
    const active=t>.28;
    base.visible=cells.visible=active;
    base.position.y=.21-.92*p;
    for (let i=0;i<rows*cols;i++) {
      const col=i%cols, row=Math.floor(i/cols);
      const q=settle((t-.44-(col%6)*.027-row*.012)/1.04);
      dummy.position.set((col-11.5)*.116*(1+.28*q),.285-.54*q+(row%3)*.061*q,
        (row-4)*.139*(1+.87*q));
      dummy.rotation.set(.46*q,0,((col%3)-1)*.36*q);
      dummy.updateMatrix();
      cells.setMatrixAt(i,dummy.matrix);
    }
    cells.instanceMatrix.needsUpdate=true;
    covers.forEach((cover,i)=>{
      cover.visible=active;
      const x=(i-3.5)*.365;
      cover.position.set(x*(1+.21*p),.36-.20*p,Math.sign(x)*.28*p);
      cover.rotation.x=p*.13*(i%2 ? 1 : -1);
    });
  };
}

export async function createTesla(canvas, options) {
  const renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,preserveDrawingBuffer:true});
  renderer.setSize(options.width,options.height,false);
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.07;
  renderer.setClearColor(0,0);
  const scene=new T.Scene();
  lightRig(scene,renderer);
  const stage=new T.Group();
  scene.add(stage);
  const {scene:asset}=await new GLTFLoader().loadAsync('assets/model3-highland.glb');
  const parts=components(asset,stage);
  const drawBattery=battery(stage);
  const camera=new T.PerspectiveCamera(34,options.width/options.height,.1,80);
  window.teslaParts={external:parts.length, internalCells:216,internalOther:9};
  const cue = Number.isFinite(options.explodeAt) ? Math.max(0,Math.min(1.6,options.explodeAt)) : .25;
  return t=>{
    const work=t-cue+.25;
    const orbit=smooth(t/3.4);
    const expand=smooth((work-.28)/1.15);
    const angle=.68-.31*orbit;
    const distance=8.1+2.1*expand;
    camera.position.set(distance*Math.cos(angle),3.15+1.32*expand,distance*Math.sin(angle));
    camera.lookAt(.12,.71+.22*expand,0);
    parts.forEach(({object,at,shift,lag,spin},i)=>{
      const p=settle((work-.25-lag)/1.22);
      object.position.copy(at).addScaledVector(shift,p);
      object.rotation.set((i%2===0?1:-1)*spin*p,.12*Math.sin(i)*p,.16*Math.cos(i*2)*p);
    });
    drawBattery(work);
    renderer.render(scene,camera);
  };
}
