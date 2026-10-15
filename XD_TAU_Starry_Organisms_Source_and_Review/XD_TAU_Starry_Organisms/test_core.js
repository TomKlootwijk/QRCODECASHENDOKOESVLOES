'use strict';
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const X=require('./organism_core.js');
const checks=[];
function test(name,f){try{const details=f()||{};checks.push({name,passed:true,...details});}catch(e){checks.push({name,passed:false,error:e.stack});}}
const digest=s=>X.snapshot(s).stateHash;
let base=X.initial(),evolved=X.advance(base,1200);
const event=(sequence,kind='xor',epoch=12)=>({replica:'test',sequence,epoch,logical:epoch,kind,target:'all',...(kind==='feed'?{amount:12}:{})});
test('SHA-256 vectors and block-boundary lengths',()=>{
  const cases=['','abc','a'.repeat(55),'a'.repeat(56),'a'.repeat(63),'a'.repeat(64),'a'.repeat(65),'x'.repeat(1000),'a'.repeat(100000),'luminous \u03c4'];
  for(const s of cases)assert.equal(X.sha256(s),crypto.createHash('sha256').update(s).digest('hex'));
  return {vectors:cases.length,reference:'Node built-in crypto SHA-256'};
});
test('Sorted canonical object encoding',()=>assert.equal(X.canonical({b:2,a:1}),X.canonical({a:1,b:2})));
test('Domain-separated random access',()=>{
  assert.notEqual(X.hash('gene','a',1),X.hash('paint','a',1));assert.notEqual(X.hash('x','ab','c'),X.hash('x','a','bc'));
  assert.equal(X.unit(base.seed,'channel',25),X.unit(base.seed,'channel',25));
});
test('All equal-area representatives round trip',()=>{
  let area=0;for(let i=0;i<32;i++){const c=X.cell(i);assert.equal(X.locate(...c.representative),i);area+=c.solidAngle;}
  assert.ok(Math.abs(area-4*Math.PI)<1e-12);return {cells:32,totalSolidAngle:area};
});
test('Owned seam and poles',()=>{
  assert.ok(X.locate(1,0,0)>=16);assert.equal(X.locate(0,1,0),X.locate(0,4,0));
  assert.equal(X.locate(0,0,0),X.locate(0,1,0));
});
test('Identical genesis is repeatable',()=>assert.equal(digest(base),digest(X.initial())));
test('Different public seeds change genesis',()=>assert.notEqual(base.seed,X.initial('another art seed').seed));
test('Input pixels affect content hash and phenotype',()=>{
  const original=X.builtinSource(),rgb=original.rgb.map(()=>220),src=X.makeSource(48,32,rgb);
  const alt=X.initial(base.seedPhrase,src);assert.notEqual(base.seed,alt.seed);assert.notEqual(base.F[0].fb,alt.F[0].fb);
});
test('Produced shell increases; inner radius fixed',()=>{
  for(let i=0;i<32;i++){assert.ok(evolved.F[i].Ns>base.F[i].Ns);assert.equal(evolved.F[i].Ri,base.F[i].Ri);
    assert.ok(evolved.P[i].children[0].radius>base.P[i].children[0].radius);}
});
test('Closed amount and chemical/thermal energy ledgers',()=>{
  const a=X.total(evolved);assert.ok(Math.abs(a.amountResidual)<1e-9);assert.ok(Math.abs(a.energyResidual)<1e-9);
  return {ticks:1200,amountResidual:a.amountResidual,energyResidual:a.energyResidual};
});
test('External feed is counted once in each source ledger',()=>{
  const s=X.advance(X.addEvent(base,event(1,'feed',0)),5),a=X.total(s);
  assert.equal(s.external.amount,12);assert.equal(s.external.energy,12);
  assert.ok(Math.abs(a.amountResidual)<1e-9);assert.ok(Math.abs(a.energyResidual)<1e-9);
});
test('Duplicate tag is idempotent',()=>{
  const e=event(7),a=X.advance(X.addEvent(base,e),100);
  const b=X.advance(X.addEvent(X.addEvent(base,e),e),100);assert.equal(digest(a),digest(b));
});
test('Distinct equal XOR payloads cancel at the same epoch',()=>{
  const s=X.advance(X.addEvent(X.addEvent(base,event(2)),event(3)),30);assert.ok(s.b.every(x=>x===0));
});
test('Merge is order independent',()=>{
  const a=[event(4,'feed',8),event(1),event(2)];
  assert.equal(X.canonical(X.mergeLogs(a)),X.canonical(X.mergeLogs([...a].reverse(),a)));
});
test('Same-tag collision uses declared canonical maximum',()=>{
  const a=event(10),b={...a,kind:'feed',amount:5};
  assert.equal(X.canonical(X.mergeLogs([a],[b])),X.canonical(X.mergeLogs([b],[a])));
  assert.equal(X.mergeLogs([a],[b]).length,1);
});
test('Late event replay equals known-ahead event replay',()=>{
  const e=event(9,'feed',17),ahead=X.advance(X.addEvent(base,e),200),late=X.addEvent(X.advance(base,200),e);
  assert.equal(digest(ahead),digest(late));
});
test('Stable IDs survive mutation',()=>{
  const s=X.advance(X.addEvent(base,event(11,'xor',0)),30);
  assert.deepEqual(s.E.map(x=>x.id),base.E.map(x=>x.id));assert.ok(s.b.every(x=>x===1));
});
test('Full replay restores state identity',()=>assert.equal(digest(evolved),digest(X.replay(evolved))));
test('Checkpoint round trip with replay validation',()=>assert.equal(digest(evolved),digest(X.restore(JSON.parse(JSON.stringify(X.snapshot(evolved)))))));
test('Changed checkpoint bytes are detected',()=>{
  const p=X.snapshot(evolved);p.state.F[0].f+=1;assert.throws(()=>X.restore(p),/digest mismatch/);
});
test('Evolution leaves its input snapshot unchanged',()=>{
  const old=digest(base);X.advance(base,10);assert.equal(digest(base),old);
});
test('Step grouping does not change tick-indexed state',()=>assert.equal(digest(X.advance(base,150)),digest(X.advance(X.advance(base,80),70))));
test('All inventories stay nonnegative in a longer run',()=>{
  const t=X.total(X.advance(base,12000));assert.ok(t.min>=0);assert.ok(Math.abs(t.amountResidual)<1e-8);
  assert.ok(Math.abs(t.energyResidual)<1e-8);return {ticks:12000,minInventory:t.min,amountResidual:t.amountResidual,energyResidual:t.energyResidual};
});
test('Invalid external records fail at import, not inside evolution',()=>{
  assert.throws(()=>X.mergeLogs([{...event(1),epoch:-1}]));
  assert.throws(()=>X.makeSource(48,32,[1,2,3]));
  assert.throws(()=>X.canonical({value:Infinity}));
});
const out={profile:X.PROFILE,environment:{node:process.version,platform:process.platform,arch:process.arch},
  testGroups:checks.length,allPassed:checks.every(c=>c.passed),checks,
  scope:'Finite regression checks, not a general theorem or cross-runtime/GPU rendering guarantee.'};
fs.writeFileSync(path.join(__dirname,'demo_test_results.json'),JSON.stringify(out,null,2)+'\n');
fs.writeFileSync(path.join(__dirname,'example_checkpoint_n1200.json'),JSON.stringify(X.snapshot(evolved),null,2)+'\n');
console.log(JSON.stringify({testGroups:out.testGroups,allPassed:out.allPassed,failures:checks.filter(c=>!c.passed)},null,2));
if(!out.allPassed)process.exitCode=1;
