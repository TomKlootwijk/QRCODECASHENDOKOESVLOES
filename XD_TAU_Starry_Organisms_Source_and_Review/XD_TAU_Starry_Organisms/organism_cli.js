#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const X=require('./organism_core.js');
function usage(){console.log(`XD-TAU Starry Organisms — finite headless runner\n\nnode organism_cli.js --seed "public art phrase" --ticks 1200 --out checkpoint.json\nnode organism_cli.js --input checkpoint.json --ticks 50 --out later.json\nnode organism_cli.js --verify checkpoint.json\n\n--ticks is additional ticks after an input checkpoint; default 1200.\n--overwrite permits replacing an existing output. No network or wallet is used.`);}
try {
  const args=process.argv.slice(2),o={ticks:1200,seed:'starry starry night'};
  for(let i=0;i<args.length;i++) {
    const a=args[i];if(a==='--help'){usage();process.exit(0);}
    if(a==='--overwrite'){o.overwrite=true;continue;}
    if(!['--seed','--ticks','--input','--out','--verify'].includes(a)||i+1>=args.length)throw new Error(`Unknown or incomplete option: ${a}`);
    o[a.slice(2)]=args[++i];
  }
  const read=file=>{if(fs.statSync(file).size>3000000)throw new Error('Checkpoint larger than the 3 MB preview limit.');return X.restore(JSON.parse(fs.readFileSync(file,'utf8')));};
  if(o.verify){const s=read(o.verify);console.log(JSON.stringify({verified:true,n:s.n,seed:s.seed,totals:X.total(s)},null,2));process.exit(0);}
  const ticks=Number(o.ticks);if(!Number.isInteger(ticks)||ticks<0||ticks>100000)throw new Error('--ticks must be an integer from 0 to 100000.');
  const base=o.input?read(o.input):X.initial(o.seed);
  const s=X.advance(base,ticks),packet=X.snapshot(s);
  if(o.out)fs.writeFileSync(o.out,JSON.stringify(packet,null,2)+'\n',{flag:o.overwrite?'w':'wx'});
  console.log(JSON.stringify({profile:X.PROFILE.name,n:s.n,seed:s.seed,stateHash:packet.stateHash,totals:X.total(s),output:o.out||null},null,2));
}catch(e){console.error('Error: '+e.message);process.exitCode=1;}
