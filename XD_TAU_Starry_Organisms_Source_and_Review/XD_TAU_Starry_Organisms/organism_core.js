/* XD-TAU Starry Organisms — proposed finite application profile 0.1.0.
 * Paradigm: Tom Klootwijk, XD-TAU v1.5. Application implementation: AI-assisted.
 * Source maps: PDF pp. 3, 8, 26, 31–36, 49, 52. See PROFILE.md for scope.
 * No network, wallets, mining, eval, native plugins, or external dependencies.
 * This is NOT a full implementation or certification of the architecture.
 */
'use strict';
const XDTau = (() => {
  const TAU = 2 * Math.PI;
  const SPEC = '8dfae654435c035beefc3f9770cf6f51b55c0cef968071900142e4cf9b1cf0fd';
  const PROFILE = Object.freeze({
    name: 'xdtau-starry-membrane', version: '0.1.0', architecture: 'XD-TAU v1.5',
    architectureSha256: SPEC, cells: 32, hierarchyDepth: 5,
    dt: 0.04, tStar: 1, coreVolume: 1, reservoirVolume: 6, molarVolume: 0.8,
    speciesEnergy: [1, 0, 0, 0], shellSpeciesEnergy: 0,
    coordinateFrame: 'y-polar sphere, longitude atan2(z,x), upper-child split ownership',
    modelUnits: 'declared normalized length, amount, energy and time units; no material calibration',
    stages: ['tagged-events', 'freeze-conductance-and-rates', 'reservoir-exchange',
      'reaction-1', 'reaction-2', 'reaction-3', 'deposition', 'geometry-output', 'observation'],
    numericalScheme: 'binary64, exponential pair/subflows, ordered first-order Lie splitting',
    canonicalEncoding: 'ASCII-key sorted JSON; ECMAScript finite-number serialization; UTF-8',
    randomness: 'SHA-256 domain-separated counter samples; first 32 digest bits / 2^32',
    display: 'nonphysical painterly chart, independent of conservation ledgers'
  });
  const enc = new TextEncoder();
  const K = Uint32Array.from([
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ]);
  function sha256(input) {
    const bytes = typeof input === 'string' ? enc.encode(input) : new Uint8Array(input);
    const n = bytes.length, len = Math.ceil((n + 9) / 64) * 64;
    const data = new Uint8Array(len); data.set(bytes); data[n] = 128;
    const view = new DataView(data.buffer);
    view.setUint32(len - 8, Math.floor(n / 0x20000000));
    view.setUint32(len - 4, (n * 8) >>> 0);
    const H = Uint32Array.from([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,
      0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
    const w = new Uint32Array(64), r = (a,b) => (a >>> b) | (a << (32-b));
    for (let p = 0; p < len; p += 64) {
      for (let i=0;i<16;i++) w[i] = view.getUint32(p+4*i);
      for (let i=16;i<64;i++) {
        const a=w[i-15], b=w[i-2];
        w[i]=(w[i-16]+(r(a,7)^r(a,18)^(a>>>3))+w[i-7]+(r(b,17)^r(b,19)^(b>>>10)))>>>0;
      }
      let [a,b,c,d,e,f,g,h]=H;
      for (let i=0;i<64;i++) {
        const t1=(h+(r(e,6)^r(e,11)^r(e,25))+((e&f)^(~e&g))+K[i]+w[i])>>>0;
        const t2=((r(a,2)^r(a,13)^r(a,22))+((a&b)^(a&c)^(b&c)))>>>0;
        h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;
      }
      [a,b,c,d,e,f,g,h].forEach((x,i)=>H[i]=(H[i]+x)>>>0);
    }
    return Array.from(H,x=>x.toString(16).padStart(8,'0')).join('');
  }
  function canonical(x) {
    if (x===null || typeof x==='boolean' || typeof x==='string') return JSON.stringify(x);
    if (typeof x==='number') {
      if (!Number.isFinite(x)) throw new Error('Nonfinite value outside the encoding domain.');
      return JSON.stringify(x);
    }
    if (Array.isArray(x)) return '['+x.map(canonical).join(',')+']';
    if (typeof x==='object' && Object.getPrototypeOf(x)===Object.prototype)
      return '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}';
    throw new Error('Unsupported canonical value.');
  }
  const hash = (tag,...data) => sha256(canonical([tag,...data]));
  const unit = (seed,label,i) => parseInt(hash('xdtau-counter/v1',seed,label,i).slice(0,8),16)/4294967296;
  const copy = x => JSON.parse(JSON.stringify(x));
  function cell(key, depth=PROFILE.hierarchyDepth) {
    let u0=-1,u1=1,p0=0,p1=TAU;
    for(let level=0;level<depth;level++) {
      const bit=(key >>> (depth-level-1))&1;
      if(level%2===0) {const m=(u0+u1)/2;if(bit)u0=m;else u1=m;}
      else {const m=(p0+p1)/2;if(bit)p0=m;else p1=m;}
    }
    const u=(u0+u1)/2, psi=(p0+p1)/2, r=Math.sqrt(1-u*u);
    return {word:key.toString(2).padStart(depth,'0'),depth,key,heapAddress:2**depth-1+key,
      uInterval:[u0,u1],longitudeInterval:[p0,p1],solidAngle:(u1-u0)*(p1-p0),
      representative:[r*Math.cos(psi),u,r*Math.sin(psi)]};
  }
  function locate(x,y,z,depth=PROFILE.hierarchyDepth) {
    const norm=Math.hypot(x,y,z),u=norm===0?1:y/norm;
    const psi=(norm===0 || (x===0&&z===0))?0:((Math.atan2(z,x)%TAU)+TAU)%TAU;
    let u0=-1,u1=1,p0=0,p1=TAU,key=0;
    for(let level=0;level<depth;level++) {
      let bit;
      if(level%2===0){const m=(u0+u1)/2;bit=u>=m?1:0;if(bit)u0=m;else u1=m;}
      else{const m=(p0+p1)/2;bit=psi>=m?1:0;if(bit)p0=m;else p1=m;}
      key=2*key+bit;
    }
    return key;
  }
  function makeSource(width,height,rgb,rawDigest=null,label='Local image') {
    if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width*height>65536)
      throw new Error('Expected a bounded positive raster.');
    if(rgb.length!==width*height*3 || rgb.some(x=>!Number.isInteger(x)||x<0||x>255))
      throw new Error('Expected RGB8 pixels.');
    const s={adapter:'rgb8-art-raster/v1',width,height,rgb:Array.from(rgb),rawSha256:rawDigest,
      label,interpretation:'sRGB-like encoded color samples; not a measured depth or physical energy field'};
    s.pixelSha256=hash('xdtau-rgb8/v1',width,height,s.rgb);
    return s;
  }
  function sample(source,u,v) {
    const ix=Math.max(0,Math.min(source.width-1,Math.floor(u*source.width)));
    const iy=Math.max(0,Math.min(source.height-1,Math.floor(v*source.height)));
    const i=(iy*source.width+ix)*3;
    return source.rgb.slice(i,i+3);
  }
  // Display/input quantization is separate from evolution; no state clipping occurs in _tick.
  function builtinSource() {
    const w=48,h=32,rgb=[];
    for(let y=0;y<h;y++) for(let x=0;x<w;x++) {
      const u=x/w,v=y/h;
      const wave=0.5+0.5*Math.sin(16*u+5*Math.sin(8*v)+9*v);
      let star=0;
      for(const [sx,sy,ss] of [[.19,.22,.020],[.73,.3,.036],[.53,.62,.018],[.88,.76,.018],[.28,.79,.025]])
        star+=Math.exp(-((u-sx)**2+(v-sy)**2)/ss);
      rgb.push(Math.round(Math.min(255,16+25*wave+180*star)),
        Math.round(Math.min(255,25+64*wave+138*star)),Math.round(Math.min(255,68+104*wave+57*star)));
    }
    return makeSource(w,h,rgb,null,'Synthetic night-field — no supplied photograph');
  }
  const luminosity = rgb => (0.2126*rgb[0]+0.7152*rgb[1]+0.0722*rgb[2])/255;
  function outerRadius(q) {return Math.cbrt(q.Ri**3+3*PROFILE.molarVolume*q.Ns/(4*Math.PI));}
  function total(s) {
    let amount=0,energy=0,shell=0,heat=0,min=Infinity;
    for(const q of s.F) {
      amount+=q.V*(q.f+q.a+q.b+q.m)+q.Ns+q.Vb*q.fb;
      energy+=q.V*q.f+q.Vb*q.fb+q.heat;
      shell+=q.Ns;heat+=q.heat;
      min=Math.min(min,q.f,q.a,q.b,q.m,q.fb,q.Ns,q.heat);
    }
    return {amount,energy,shell,heat,min,
      amountResidual:s.initial?amount-s.initial.amount-s.external.amount:0,
      energyResidual:s.initial?energy-s.initial.energy-s.external.energy:0};
  }
  function geometry(s) {
    // These local concentric shells have exact region semantics.
    // The painterly overview is an explicitly nonphysical chart of these regions.
    s.P=s.F.map((q,i)=>({kind:'Difference',id:s.E[i].id,frame:'reactor-local',
      children:[{kind:'Sphere',radius:outerRadius(q),center:[0,0,0]},
        {kind:'Sphere',radius:q.Ri,center:[0,0,0]}]}));
  }
  function initial(seedPhrase='starry starry night',source=builtinSource()) {
    if(typeof seedPhrase!=='string'||seedPhrase.length>1000)throw new Error('Seed must be a public phrase of at most 1000 characters.');
    const seed=hash('xdtau-genesis/v1',PROFILE,source.pixelSha256,seedPhrase);
    const s={schema:'xdtau-starry-state/0.1.0',profile:copy(PROFILE),seed,seedPhrase,source:copy(source),
      n:0,t:0,T:0,E:[],H:[],P:[],xi:[],b:[],F:[],O:[],applied:[],
      C:[{from:'photo-encoded-luminance',to:'initial-precursor-and-reservoir',type:'artistic-input-coefficient'},
        {from:'shell-inventory',to:'shell-radius',type:'material-volume',source:'D.1'},
        {from:'shell-radius',to:'precursor-conductance',type:'Fick-shell-model',source:'D.1'},
        {from:'reaction-precursor-loss',to:'heat',type:'chemical-energy-ledger',source:'C.13'},
        {from:'state',to:'brushes/glow',type:'display-only-no-physical-feedback'}],
      external:{amount:0,energy:0},initial:null};
    for(let i=0;i<PROFILE.cells;i++) {
      const c=cell(i),uv=[(c.longitudeInterval[0]+c.longitudeInterval[1])/(2*TAU),
        0.5-(c.uInterval[0]+c.uInterval[1])/4];
      const rgb=sample(source,...uv),lum=luminosity(rgb);
      s.E.push({id:hash('xdtau-entity/v1',seed,i),orgParent:seed,cellWord:c.word,
        chartPosition:c.representative,payload:{uv,rgb,lum}});
      s.H.push(c);s.b.push(0);
      s.xi.push({k1:.20+.18*unit(seed,'k1',i),k2:.18+.15*unit(seed,'k2',i),
        k3:.7+.8*unit(seed,'k3',i),kd:.22+.28*unit(seed,'kd',i),
        Ds:.0015+.003*unit(seed,'diffusion',i),partition:1,
        flowPhase:TAU*unit(seed,'flow-phase',i)});
      s.F.push({Ri:Math.cbrt(3/(4*Math.PI)),V:1,Vb:6,
        f:.6+.8*lum,a:.16+.1*unit(seed,'catalyst-a',i),b:.12+.1*unit(seed,'catalyst-b',i),
        m:.03,fb:1.4+1.2*lum,Ns:.16,heat:1,activity:0});
    }
    geometry(s);const t=total(s);s.initial={amount:t.amount,energy:t.energy};return s;
  }
  function tagKey(e){return canonical([e.replica,e.sequence]);}
  function eventCompare(a,b){return a.logical-b.logical || (a.replica<b.replica?-1:a.replica>b.replica?1:0)
    || a.sequence-b.sequence || (canonical(a)<canonical(b)?-1:canonical(a)>canonical(b)?1:0);}
  function validateEvent(e) {
    if(!e||!Number.isSafeInteger(e.sequence)||e.sequence<0||!Number.isSafeInteger(e.epoch)||e.epoch<0||
      !Number.isSafeInteger(e.logical)||e.logical<0||typeof e.replica!=='string'||e.replica.length>100||
      !['feed','xor'].includes(e.kind)||!(e.target==='all'||(Number.isInteger(e.target)&&e.target>=0&&e.target<PROFILE.cells)))
      throw new Error('Event is outside the typed import domain.');
    if(e.kind==='feed'&&(!Number.isFinite(e.amount)||e.amount<0||e.amount>10000))throw new Error('Invalid external feed amount.');
  }
  function mergeLogs(...logs) {
    const byTag=new Map();
    for(const e of logs.flat()) {
      validateEvent(e);const key=tagKey(e),prev=byTag.get(key);
      if(!prev||canonical(e)>canonical(prev))byTag.set(key,copy(e));
    }
    return [...byTag.values()].sort(eventCompare);
  }
  function _tick(s) {
    const done=new Set(s.applied);
    for(const e of s.O) if(e.epoch<=s.n&&!done.has(tagKey(e))) {
      const ids=e.target==='all'?s.F.map((_,i)=>i):[e.target];
      for(const i of ids) {
        if(e.kind==='xor') s.b[i]^=1;
        else {const amount=e.amount/ids.length;s.F[i].fb+=amount/s.F[i].Vb;
          s.external.amount+=amount;s.external.energy+=amount;}
      }
      done.add(tagKey(e));
    }
    s.applied=[...done].sort();
    const h=PROFILE.dt;
    // G is frozen from the materialized start-of-tick geometry, per the causal profile.
    const coeff=s.F.map((q,i)=>{const p=s.xi[i],Ro=outerRadius(q);return {
      G:4*Math.PI*p.Ds*p.partition*q.Ri*Ro/(Ro-q.Ri),
      k1:p.k1,k2:p.k2,k3:p.k3*(1+.5*s.b[i]),kd:p.kd};});
    for(let i=0;i<s.F.length;i++) {
      const q=s.F[i],g=coeff[i].G;
      const mixed=-Math.expm1(-g*h*(1/q.V+1/q.Vb));
      const f=q.f,fb=q.fb;
      // Convex two-cell map: positivity without repairing a proposed next state.
      const a=q.Vb/(q.V+q.Vb)*mixed,b=q.V/(q.V+q.Vb)*mixed;
      q.f=(1-a)*f+a*fb;q.fb=b*f+(1-b)*fb;q.activity=0;
    }
    for(let stage=0;stage<3;stage++)for(let i=0;i<s.F.length;i++) {
      const q=s.F[i],p=coeff[i];
      const rate=stage===0?p.k1*q.b:stage===1?p.k2*q.a:p.k3*q.a*q.b;
      const next=q.f*Math.exp(-rate*h),consumed=q.f-next;q.f=next;
      if(stage===0)q.a+=consumed;else if(stage===1)q.b+=consumed;else q.m+=consumed;
      q.heat+=q.V*consumed;q.activity+=consumed/h;
    }
    for(let i=0;i<s.F.length;i++) {
      const q=s.F[i],next=q.m*Math.exp(-coeff[i].kd*h);
      q.Ns+=q.V*(q.m-next);q.m=next;
    }
    geometry(s);s.n++;s.t=s.n*PROFILE.dt;s.T=Math.log1p(s.t/PROFILE.tStar);
  }
  function advance(state,ticks=1) {
    if(!Number.isInteger(ticks)||ticks<0||ticks>100000)throw new Error('Invalid tick count.');
    const s=copy(state);for(let i=0;i<ticks;i++)_tick(s);return s;
  }
  function replay(state,ticks=state.n,logs=state.O) {
    const s=initial(state.seedPhrase,state.source);s.O=mergeLogs(logs);return advance(s,ticks);
  }
  function addEvent(state,event) {
    const log=mergeLogs(state.O,[event]);
    // Late logs trigger deliberate replay, not a claim that log convergence alone fixes trajectories.
    if(event.epoch<state.n)return replay(state,state.n,log);
    const s=copy(state);s.O=log;return s;
  }
  function snapshot(state) {return {format:'xdtau-starry-checkpoint/0.1.0',
    stateHash:hash('xdtau-checkpoint/v1',state),state:copy(state)};}
  function restore(packet) {
    if(!packet||packet.format!=='xdtau-starry-checkpoint/0.1.0')throw new Error('Unsupported checkpoint format.');
    const s=packet.state;
    if(hash('xdtau-checkpoint/v1',s)!==packet.stateHash)throw new Error('Checkpoint digest mismatch.');
    if(!s||s.schema!=='xdtau-starry-state/0.1.0'||canonical(s.profile)!==canonical(PROFILE))
      throw new Error('This checkpoint requires another profile version.');
    if(!Number.isInteger(s.n)||s.n<0||s.n>100000||s.source.width*s.source.height>65536||s.O.length>10000)
      throw new Error('Checkpoint exceeds this demonstrator’s import limits.');
    const source=makeSource(s.source.width,s.source.height,s.source.rgb,s.source.rawSha256,s.source.label);
    if(source.pixelSha256!==s.source.pixelSha256)throw new Error('Canonical pixel digest mismatch.');
    if(initial(s.seedPhrase,source).seed!==s.seed)throw new Error('Genesis digest mismatch.');
    const expected=replay(s,s.n);
    // Full replay validation is appropriate at an import boundary, not a dynamics rejection policy.
    if(canonical(expected)!==canonical(s))throw new Error('State differs from replay in this runtime. Use the original runtime or genesis/logs.');
    return copy(s);
  }
  return {PROFILE,SPEC,TAU,sha256,canonical,hash,unit,cell,locate,makeSource,sample,builtinSource,
    luminosity,outerRadius,total,initial,advance,replay,mergeLogs,addEvent,snapshot,restore};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=XDTau;
