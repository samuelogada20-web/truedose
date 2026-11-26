/* Live 3D DNA helix */
(function(){
  if(typeof THREE==='undefined')return;
  let R;try{R=new THREE.WebGLRenderer({alpha:true,antialias:true})}catch(e){return}
  const cv=R.domElement;cv.id='gl';cv.setAttribute('aria-hidden','true');document.body.prepend(cv);
  R.setPixelRatio(Math.min(devicePixelRatio||1,2));
  const S=new THREE.Scene(),C=new THREE.PerspectiveCamera(45,1,.1,100);C.position.set(0,0,11);
  S.add(new THREE.AmbientLight(0xffffff,.55));
  const L1=new THREE.PointLight(0x9fdcff,2.2,45);L1.position.set(4,4,8);S.add(L1);
  const L2=new THREE.PointLight(0x2f7bff,1.6,45);L2.position.set(-5,-3,5);S.add(L2);
  const mS=new THREE.MeshStandardMaterial({roughness:.25,metalness:.2,transparent:true,opacity:.92});
  const mR=new THREE.MeshStandardMaterial({roughness:.3,transparent:true,opacity:.88});
  const mB=new THREE.MeshStandardMaterial({roughness:.05,metalness:.3,transparent:true,opacity:.55});
  const H=new THREE.Group(),N=46,Rd=1.25,dy=.26,tw=.42,up=new THREE.Vector3(0,1,0);
  const pa=[],pb=[];
  for(let i=0;i<N;i++){const a=i*tw,y=(i-N/2)*dy;
    pa.push(new THREE.Vector3(Math.cos(a)*Rd,y,Math.sin(a)*Rd));
    pb.push(new THREE.Vector3(Math.cos(a+Math.PI)*Rd,y,Math.sin(a+Math.PI)*Rd));}
  [pa,pb].forEach(p=>{
    H.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p),220,.09,10,false),mS));
    p.forEach((v,i)=>{if(i%2===0){const s=new THREE.Mesh(new THREE.SphereGeometry(.17,16,16),mS);s.position.copy(v);H.add(s)}});
  });
  const cg=new THREE.CylinderGeometry(.045,.045,1,8);
  for(let i=0;i<N;i++){
    const d=pa[i].clone().sub(pb[i]),m=new THREE.Mesh(cg,mR);
    m.position.set(0,pa[i].y,0);m.scale.y=d.length();
    m.quaternion.setFromUnitVectors(up,d.normalize());H.add(m);
  }
  H.rotation.z=.32;S.add(H);
  const bubbles=[];
  for(let i=0;i<14;i++){
    const m=new THREE.Mesh(new THREE.SphereGeometry(.14+Math.random()*.34,20,20),mB);
    m.position.set((Math.random()-.5)*13,(Math.random()-.5)*8,(Math.random()-.5)*5-1);
    m.userData={y:m.position.y,p:Math.random()*6.28,s:.3+Math.random()*.5};
    S.add(m);bubbles.push(m);
  }
  const pg=new THREE.BufferGeometry(),pv=new Float32Array(180*3);
  for(let i=0;i<pv.length;i++)pv[i]=(Math.random()-.5)*(i%3===1?9:15);
  pg.setAttribute('position',new THREE.BufferAttribute(pv,3));
  const pm=new THREE.PointsMaterial({size:.05,transparent:true,opacity:.7}),pts=new THREE.Points(pg,pm);S.add(pts);

  const mq=matchMedia('(prefers-color-scheme: dark)');
  function pal(){
    const th=document.documentElement.dataset.theme,d=th==='dark'||(th!=='light'&&mq.matches);
    const c=d?[0x38bdf8,0x1d8fe6,0xd6f0ff,0x6cc6ff]:[0x0a6cc4,0x0a5fb0,0x3d8fe0,0x0a6cc4];
    mS.color.set(c[0]);mS.emissive.set(c[1]);mS.emissiveIntensity=d?.75:.15;
    mR.color.set(c[2]);mR.emissive.set(c[3]);mR.emissiveIntensity=d?.5:.1;
    mB.color.set(c[0]);mB.emissive.set(c[1]);mB.emissiveIntensity=d?.3:.05;
    pm.color.set(c[2]);
  }
  pal();mq.addEventListener&&mq.addEventListener('change',()=>{pal();draw()});

  let px=0,py=0,baseX=4,baseS=1;
  function size(){
    const w=innerWidth,h=innerHeight;R.setSize(w,h,false);C.aspect=w/h;C.updateProjectionMatrix();
    const halfW=Math.tan(22.5*Math.PI/180)*11*C.aspect;
    baseX=Math.min(4.8,halfW*.62);baseS=Math.min(1,halfW/4.6);H.scale.setScalar(baseS);
  }
  addEventListener('resize',()=>{size();draw()});size();
  addEventListener('pointermove',e=>{px=e.clientX/innerWidth*2-1;py=e.clientY/innerHeight*2-1});
  const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function draw(t){
    t=(t||0)/1000;
    const sy=window.scrollY||0;
    H.rotation.y=still?.6:t*.38+sy*.0025;
    H.position.set(baseX,Math.sin(t*.6)*.18+Math.min(sy*.0015,2),0);
    bubbles.forEach(b=>{const u=b.userData;b.position.y=u.y+Math.sin(t*u.s+u.p)*.35});
    pts.rotation.y=t*.02;
    C.position.x+=(px*.9-C.position.x)*.04;C.position.y+=(-py*.6-C.position.y)*.04;C.lookAt(0,0,0);
    R.render(S,C);
  }
  function loop(t){draw(t);requestAnimationFrame(loop)}
  still?draw(0):requestAnimationFrame(loop);
})();
