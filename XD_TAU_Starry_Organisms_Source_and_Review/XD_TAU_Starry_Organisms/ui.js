/* Standalone Canvas preview. This renderer is an artistic observation adapter.
 * It does not feed brightness, camera transforms, or rasterization into physics.
 */
'use strict';
(() => {
  const X=XDTau,$=id=>document.getElementById(id),canvas=$('scene'),ctx=canvas.getContext('2d');
  const paint=document.createElement('canvas'),pc=paint.getContext('2d');
  let state=X.initial(),playing=true,mode='orbit',brushes=[],stars=[],dirty=true;
  let width=900,height=700,pixelRatio=1,lastFrame=0,lastStats=0,sequence=0;
  let busy=false,rotation=0,dragX=null;
  const notices=[];
  function notice(text,error=false) {
    $('notice').textContent=text;$('notice').className=error?'notice error':'notice';
    notices.push({text,error});
  }
  function prepare() {
    brushes=[];stars=[];
    for(let i=0;i<4500;i++) {
      const a=X.unit(state.seed,'brush-u',i),b=X.unit(state.seed,'brush-phase',i),u=2*a-1,p=b*X.TAU;
      const rr=Math.sqrt(1-u*u),idx=X.locate(rr*Math.cos(p),u,rr*Math.sin(p));
      const rgb=X.sample(state.source,b,1-a),lum=X.luminosity(rgb);
      const l1=X.luminosity(X.sample(state.source,b+.03,1-a));
      const l2=X.luminosity(X.sample(state.source,b,1-a+.03));
      brushes.push({u,p,idx,rgb,lum,edge:[l1-lum,l2-lum],size:X.unit(state.seed,'brush-size',i),
        offset:X.unit(state.seed,'brush-offset',i),highlight:X.unit(state.seed,'brush-highlight',i)});
    }
    for(let i=0;i<150;i++)stars.push([X.unit(state.seed,'star-x',i),X.unit(state.seed,'star-y',i),X.unit(state.seed,'star-size',i)]);
    $('seedHash').textContent=state.seed;
    $('sourceLabel').textContent=state.source.label;
    const preview=$('sourcePreview'),pctx=preview.getContext('2d');
    const im=pctx.createImageData(state.source.width,state.source.height);
    for(let i=0;i<state.source.rgb.length/3;i++) {
      im.data[i*4]=state.source.rgb[i*3];im.data[i*4+1]=state.source.rgb[i*3+1];
      im.data[i*4+2]=state.source.rgb[i*3+2];im.data[i*4+3]=255;
    }
    const tiny=document.createElement('canvas');tiny.width=state.source.width;tiny.height=state.source.height;
    tiny.getContext('2d').putImageData(im,0,0);pctx.clearRect(0,0,preview.width,preview.height);
    pctx.drawImage(tiny,0,0,preview.width,preview.height);
    dirty=true;stats();
  }
  function resize() {
    const r=canvas.getBoundingClientRect();width=r.width;height=r.height;
    pixelRatio=Math.min(devicePixelRatio||1,1.5);
    canvas.width=paint.width=Math.round(width*pixelRatio);
    canvas.height=paint.height=Math.round(height*pixelRatio);
    dirty=true;
  }
  function palette(b,q,idx) {
    const style=+$('style').value/100;
    const light=b.lum,warm=b.highlight>.975 || (light>.53 && b.highlight>.32);
    const h=Math.log1p(q.heat)/6;
    const blue=[34+light*52,81+light*99,150+light*78];
    const gold=[250,154+light*85,67+light*98];
    const col=warm?gold:blue;
    return col.map((c,i)=>Math.round(Math.min(255,(1-style)*b.rgb[i]+style*c+(i===2?5:2)*h+state.b[idx]*5)));
  }
  function project(x,y,z,R) {
    const angle=(mode==='membrane'?.22:.5)+rotation+(mode==='orbit'?state.n*.00065:0);
    let xx=x*Math.cos(angle)+z*Math.sin(angle),zz=-x*Math.sin(angle)+z*Math.cos(angle);
    const yy=y*.976-zz*.218;zz=y*.218+zz*.976;
    const scale=4.6/(4.6-zz);
    return [width*.50+xx*R*scale,height*.49-yy*R*scale,zz,scale];
  }
  function point(b,d,q,idx,R) {
    const growth=X.outerRadius(q)/q.Ri-1,t=state.t,phase=state.xi[idx].flowPhase;
    if(mode==='photo') {
      const flow=.028*Math.sin(b.p*2+phase+t*.09);
      const x=(b.p/X.TAU-.5)*2.65+flow+ d*(.02+b.edge[1]*.15);
      const y=b.u*.85+ .018*Math.sin(b.p*3+t*.2)+d*(.01-b.edge[0]*.15);
      return [width*.5+x*R,height*.50-y*R,1,1];
    }
    const p=b.p+.15*Math.sin(3*b.u+phase+t*.10)+d*(.030+b.size*.046);
    const u=b.u+.025*Math.sin(4*b.p+phase+t*.13)*(1-b.u*b.u)+d*.018*Math.sin(b.p*3+phase)*(1-b.u*b.u);
    // The art chart is intentionally not an exact CSG distance or a physical deformation.
    const r=mode==='membrane'?1:(1+.15*growth+.028*Math.sin(7*b.p+phase+t*.2));
    const latitude=Math.max(-.9999,Math.min(.9999,u)),rr=Math.sqrt(1-latitude*latitude);
    return project(r*rr*Math.cos(p),r*latitude,r*rr*Math.sin(p),R);
  }
  function draw() {
    ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);pc.setTransform(pixelRatio,0,0,pixelRatio,0,0);
    ctx.clearRect(0,0,width,height);pc.clearRect(0,0,width,height);
    const R=Math.min(width*(mode==='photo'?.29:.33),height*.34);
    const g=ctx.createRadialGradient(width*.5,height*.49,R*.03,width*.5,height*.49,R*1.8);
    g.addColorStop(0,'#11254c');g.addColorStop(.53,'#0a122b');g.addColorStop(1,'#060a15');
    ctx.fillStyle=g;ctx.fillRect(0,0,width,height);
    for(const [x,y,r] of stars) {
      ctx.fillStyle=`rgba(164,193,245,${.12+r*.46})`;ctx.beginPath();ctx.arc(x*width,y*height,.4+r*.8,0,X.TAU);ctx.fill();
    }
    // Faint latitude guide: a display coordinate aid, not an extra physical boundary.
    if(mode!=='photo') {
      ctx.strokeStyle='rgba(113,155,224,.075)';ctx.lineWidth=1;
      for(let j=0;j<3;j++){ctx.beginPath();ctx.ellipse(width*.5,height*.49,R*(1.14+.12*j),R*(.38+.035*j),-.28,0,X.TAU);ctx.stroke();}
    }
    let coords=brushes.map(b=>{
      const idx=mode==='membrane'?+$('specimen').value:b.idx,q=state.F[idx];
      const p=point(b,0,q,idx,R);return {b,idx,q,p};
    });
    coords.sort((a,b)=>a.p[2]-b.p[2]);
    pc.lineCap='round';
    for(const {b,idx,q,p} of coords) {
      if(mode!=='photo'&&p[2]<-.12)continue;
      const p1=point(b,1,q,idx,R),p2=point(b,2,q,idx,R),col=palette(b,q,idx);
      const front=mode==='photo'?1:.26+.74*Math.max(0,p[2]);
      const alpha=Math.min(.98,front*(.52+b.size*.38));
      pc.strokeStyle=`rgba(${col.join(',')},${alpha})`;pc.lineWidth=(.7+b.size*1.8)*Math.min(1.5,R/240);
      pc.beginPath();pc.moveTo(p[0],p[1]);pc.quadraticCurveTo(p1[0],p1[1],p2[0],p2[1]);pc.stroke();
      if(b.highlight>.97) {
        pc.strokeStyle=`rgba(239,234,192,${alpha*.85})`;pc.lineWidth=.55;
        pc.beginPath();pc.moveTo(p[0]+.7,p[1]);pc.lineTo(p1[0]+.7,p1[1]);pc.stroke();
      }
    }
    // Compact luminous nuclei are graphical observations of local stored heat.
    if(mode!=='photo')for(let i=0;i<state.F.length;i++) {
      if(i%5!==1&&mode!=='membrane')continue;
      if(mode==='membrane'&&i!==+$('specimen').value)continue;
      const q=state.F[i],pos=mode==='membrane'?[.31,.16,.94]:state.H[i].representative;
      const growth=X.outerRadius(q)/q.Ri-1,p=project(...pos.map(x=>x*(mode==='membrane'?1:1+.15*growth)),R);
      if(p[2]<0)continue;
      const s=(5+Math.log1p(q.heat)*2.5)*p[3];
      pc.strokeStyle='rgba(255,208,123,.72)';pc.lineWidth=1.6;
      for(let arm=0;arm<3;arm++) {
        pc.beginPath();
        for(let j=0;j<34;j++) {
          const a=j*.125+arm*2.1+state.t*.02,r=s*(.17+j*.037);
          const xx=p[0]+Math.cos(a)*r,yy=p[1]+Math.sin(a)*r*.75;
          if(j===0)pc.moveTo(xx,yy);else pc.lineTo(xx,yy);
        }
        pc.stroke();
      }
      pc.fillStyle='rgba(255,242,193,.9)';pc.beginPath();pc.arc(p[0],p[1],2.1*p[3],0,X.TAU);pc.fill();
    }
    const glow=+$('glow').value/100;
    ctx.save();ctx.globalCompositeOperation='screen';
    ctx.filter='blur(17px)';ctx.globalAlpha=glow*.8;ctx.drawImage(paint,0,0,width,height);
    ctx.filter='blur(5px)';ctx.globalAlpha=glow*.6;ctx.drawImage(paint,0,0,width,height);
    ctx.filter='none';ctx.globalAlpha=1;ctx.drawImage(paint,0,0,width,height);ctx.restore();
    if(mode==='membrane') {
      const q=state.F[+$('specimen').value],inner=q.Ri/X.outerRadius(q);
      ctx.save();ctx.strokeStyle='rgba(118,209,222,.6)';ctx.setLineDash([3,6]);ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(width*.5,height*.49,R*inner,0,X.TAU);ctx.stroke();ctx.restore();
      ctx.font='11px ui-monospace, monospace';ctx.fillStyle='#97cdd7';
      ctx.fillText('DASHED: FIXED CORE / PAINTED: PRODUCED SHELL',24,height-28);
    }
    dirty=false;
  }
  function stats() {
    const z=X.total(state);
    $('tick').textContent=String(state.n).padStart(5,'0');$('time').textContent=state.t.toFixed(2);
    $('logtime').textContent=state.T.toFixed(3);$('shell').textContent=z.shell.toFixed(3);
    $('heat').textContent=z.heat.toFixed(3);$('amountError').textContent=z.amountResidual.toExponential(2);
    $('energyError').textContent=z.energyResidual.toExponential(2);
    $('events').textContent=state.O.length;$('timeline').value=Math.min(2400,state.n);
    $('lineage').textContent=state.b.reduce((a,b)=>a+b,0)+'/32 active alleles';
    $('stateHash').textContent=X.snapshot(state).stateHash;
    const idx=+$('specimen').value,q=state.F[idx];
    $('specimenInfo').textContent=`${state.H[idx].word}  •  Rᵢ ${q.Ri.toFixed(3)}  →  Rₒ ${X.outerRadius(q).toFixed(3)}`;
  }
  function download(name,text,type='application/json') {
    const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');
    a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function setPlay(value) {playing=value;$('play').textContent=playing?'Pause':'Resume';}
  $('play').onclick=()=>setPlay(!playing);
  $('step').onclick=()=>{setPlay(false);state=X.advance(state,1);dirty=true;stats();};
  $('reset').onclick=()=>{state=X.replay(state,0,[]);sequence=0;dirty=true;stats();notice('Same genome; original state; event history cleared.');};
  $('germinate').onclick=()=>{state=X.initial($('seedPhrase').value,state.source);sequence=0;prepare();notice('New genesis from the public art seed and canonical pixels.');};
  $('feed').onclick=()=>{
    state=X.addEvent(state,{replica:'local',sequence:sequence++,epoch:state.n,logical:state.n,kind:'feed',target:'all',amount:12});
    notice('Feed scheduled for the next tick. +12 amount and +12 chemical energy entered in the source ledger.');stats();
  };
  $('mutate').onclick=()=>{
    state=X.addEvent(state,{replica:'local',sequence:sequence++,epoch:state.n,logical:state.n,kind:'xor',target:'all'});
    notice('Tagged allele toggle scheduled. Stable entity IDs remain unchanged; production rates change next tick.');stats();
  };
  $('save').onclick=()=>{
    const packet=X.snapshot(state);download(`xdtau-${state.seed.slice(0,10)}-n${state.n}.json`,JSON.stringify(packet,null,2));
    notice('Saved source pixels, finite state, profile, events, and SHA-256 checkpoint. Original photo bytes are not embedded.');
  };
  $('saveImage').onclick=()=>{
    const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download=`xdtau-paint-n${state.n}.png`;a.click();
    notice('Saved a display-only PNG. Use the checkpoint to preserve the living state.');
  };
  $('restore').onclick=()=>$('checkpointFile').click();
  $('checkpointFile').onchange=async e=>{
    const f=e.target.files[0];if(!f)return;
    try {
      if(f.size>3000000)throw new Error('Checkpoint file exceeds the 3 MB preview limit.');
      busy=true;setPlay(false);notice('Checking digest and replaying the recorded profile…');
      state=X.restore(JSON.parse(await f.text()));
      sequence=Math.max(-1,...state.O.filter(e=>e.replica==='local').map(e=>e.sequence))+1;
      $('seedPhrase').value=state.seedPhrase;prepare();notice('Checkpoint verified against full replay in this browser.');
    }catch(err){notice(err.message,true);}finally{busy=false;e.target.value='';}
  };
  $('photo').onclick=()=>$('photoFile').click();
  $('photoFile').onchange=async e=>{
    const f=e.target.files[0];if(!f)return;
    try {
      if(f.size>20000000)throw new Error('For this preview, choose a browser-decodable image smaller than 20 MB.');
      busy=true;notice('Reading locally; hashing source bytes and retaining the normalized RGB pixels…');
      const raw=new Uint8Array(await f.arrayBuffer()),rawHash=X.sha256(raw);
      const image=await createImageBitmap(f),c=document.createElement('canvas');c.width=48;c.height=32;
      const cc=c.getContext('2d',{willReadFrequently:true});cc.fillStyle='#000';cc.fillRect(0,0,48,32);
      const scale=Math.min(48/image.width,32/image.height),dw=image.width*scale,dh=image.height*scale;
      cc.drawImage(image,(48-dw)/2,(32-dh)/2,dw,dh);image.close();
      const pixels=cc.getImageData(0,0,48,32).data,rgb=[];
      for(let i=0;i<pixels.length;i+=4)rgb.push(pixels[i],pixels[i+1],pixels[i+2]);
      const src=X.makeSource(48,32,rgb,rawHash,'Your local image — frozen 48 × 32 RGB8 letterbox');
      state=X.initial($('seedPhrase').value,src);sequence=0;prepare();
      notice('Your image now changes both the genome and initial precursor fields. Nothing was uploaded.');
    }catch(err){notice('Image import: '+err.message,true);}finally{busy=false;e.target.value='';}
  };
  $('builtin').onclick=()=>{state=X.initial($('seedPhrase').value,X.builtinSource());sequence=0;prepare();notice('Synthetic input restored.');};
  document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{
    mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('active',x===b));
    $('viewLabel').textContent=mode==='orbit'?'3D ARTISTIC FIELD PORTRAIT':mode==='photo'?'2D PHOTO-FIELD CHART':'LOCAL MEMBRANE OBSERVATION';
    dirty=true;
  });
  for(const id of ['style','glow','specimen'])$(id).oninput=()=>{dirty=true;stats();};
  $('timeline').oninput=()=>{
    setPlay(false);state=X.replay(state,+$('timeline').value);dirty=true;stats();
  };
  canvas.onpointerdown=e=>{dragX=e.clientX;canvas.setPointerCapture(e.pointerId);};
  canvas.onpointermove=e=>{if(dragX!==null){rotation+=(e.clientX-dragX)*.008;dragX=e.clientX;dirty=true;}};
  canvas.onpointerup=()=>{dragX=null;};canvas.onpointercancel=()=>{dragX=null;};
  new ResizeObserver(resize).observe(canvas);
  function frame(now) {
    if(now-lastFrame>40) {
      if(playing&&!busy){state=X.advance(state,+$('speed').value);dirty=true;}
      if(dirty)draw();
      if(now-lastStats>400){stats();lastStats=now;}lastFrame=now;
    }
    requestAnimationFrame(frame);
  }
  // A small inspection surface for automated tests; never executes imported code.
  window.StarryLab={getState:()=>state,getNotices:()=>notices,setPlaying:setPlay,
    setTick:n=>{setPlay(false);state=X.replay(state,n);dirty=true;stats();},
    checkpoint:()=>X.snapshot(state),renderNow:draw,core:X};
  prepare();resize();notice('Built-in synthetic source. Load a photo to make a specimen from your own pixels.');
  requestAnimationFrame(frame);
})();
