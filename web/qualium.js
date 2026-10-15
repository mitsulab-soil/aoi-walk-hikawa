/* 氷川幽玄：実在の参道と区別して重ねる、認知の模式表現。 */
(() => {
 const states={information:false,cognition:false,language:false,senses:false};
 const names={information:'情報',cognition:'認知',language:'言語',senses:'感覚'};
 const panel=document.createElement('section');panel.id='qualiumPanel';panel.setAttribute('aria-label','Qualiumの層');
 panel.innerHTML=`<h3>同じ場所に、世界を重ねる</h3><p>参道の3D再構成を基盤に、受けとり方の層を重ねます。線や輪は模式表現で、センサーの測定値ではありません。</p><div class="qualiumChoices">${Object.entries(names).map(([id,n])=>`<label><input type="checkbox" data-qualium="${id}">${n}</label>`).join('')}</div><p id="qualiumMeaning" role="status">現実の層：地理資料を基にした3D再構成。現地の実写そのものではありません。</p><label><input type="checkbox" id="qualiumStill">層の動きを止める</label> <button type="button" id="qualiumReset" class="ib">現実の層へ戻す</button><details><summary>この表現の出どころと限界</summary><p>情報の格子・認知の輪・感覚の線は創作した模式です。センサーの測定値ではありません。言語の札は、このアプリの既存の案内名を使います。観測や歴史の根拠は、各地点の解説と出典で確かめてください。現地モードでは重ねる3D演出を表示しません。</p></details>`;
 const style=document.createElement('style');style.textContent='#qualiumPanel{padding:10px 0 14px;border-bottom:1px solid #567078;margin-bottom:12px;font-size:13px;line-height:1.7}#qualiumPanel h3{font-weight:400;margin:4px 0;font-size:17px}.qualiumChoices{display:flex;flex-wrap:wrap;gap:4px 14px}.qualiumChoices label,#qualiumPanel summary{min-height:44px;display:inline-flex;align-items:center;gap:7px}#qualiumPanel input{width:20px;height:20px;accent-color:#9bcfd2}#qualiumPanel button{white-space:normal;min-height:44px}#qualiumPanel :focus-visible{outline:2px solid #ddf7ee;outline-offset:3px}';document.head.append(style);
 const mount=setInterval(()=>{const menu=document.getElementById('menu');if(menu){if(!panel.isConnected)menu.prepend(panel)}},100);
 const explain={information:'情報：地点を結ぶ格子。記録を重ねるための模式。',cognition:'認知：ひとつの場所へ注意を向ける輪。認知そのものの測定ではありません。',language:'言語：案内の名前が、場所の輪郭をつくります。',senses:'感覚：届く手がかりを波の線にした創作表現。実測音ではありません。'};
 function sync(){for(const [id,on] of Object.entries(states))panel.querySelector(`[data-qualium="${id}"]`).checked=on;document.getElementById('qualiumMeaning').textContent=Object.keys(states).filter(k=>states[k]).map(k=>explain[k]).join(' ')||'現実の層：地理資料を基にした3D再構成。現地の実写そのものではありません。';}
 panel.addEventListener('change',e=>{if(e.target.dataset.qualium){states[e.target.dataset.qualium]=e.target.checked;sync()}});panel.querySelector('#qualiumReset').onclick=()=>{for(const id in states)states[id]=false;sync()};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');panel.querySelector('#qualiumStill').checked=reduced.matches;
 let root,future,groups={},sprite,lastLabel='',last=0;const cols={information:0x8dcddd,cognition:0xe8dbb5,language:0xd0dfce,senses:0xb8a6da};
 window.__qualiumFrame=(scene,camera)=>{
  const core=window.__core,T=core?.THREE,talk=window.__talk;if(!T||!talk)return;
  if(!root){root=new T.Group();root.name='Qualium: symbolic layers';scene.add(root);for(const k in states){groups[k]=new T.Group();root.add(groups[k]);}
   const grid=new T.GridHelper(12,8,cols.information,cols.information);grid.material.transparent=true;grid.material.opacity=.22;groups.information.add(grid);
   for(let i=0;i<3;i++){const points=Array.from({length:97},(_,j)=>{const a=j/96*Math.PI*2;return new T.Vector3(Math.cos(a)*(1.4+i*.45),.2+i*.38,Math.sin(a)*(1.4+i*.45))});groups.cognition.add(new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:cols.cognition,transparent:true,opacity:.45})));}
   for(let i=0;i<5;i++){const points=Array.from({length:81},(_,j)=>{const x=j/80*10-5;return new T.Vector3(x,.8+Math.sin(x*.8+i)*.3,-2+i)});groups.senses.add(new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:cols.senses,transparent:true,opacity:.3})));}
   future=new T.Group();future.name='未来の気配・創作';root.add(future);
   const positions=[];for(let i=0;i<160;i++){const a=i*2.399,r=3+(i%23)*.45;positions.push(Math.cos(a)*r,(i%31)*.28,Math.sin(a)*r)}
   const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));future.add(new T.Points(geo,new T.PointsMaterial({color:0x9adbcf,size:.055,transparent:true,opacity:.55,depthWrite:false})));
   for(let i=0;i<6;i++){const pts=[];for(let j=0;j<40;j++){const y=j*.23;pts.push(new T.Vector3(Math.sin(y*.5+i)*.5+Math.cos(i)*7,y,Math.sin(i)*7))}future.add(new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:0x79b8cc,transparent:true,opacity:.14,depthWrite:false})));}
   sprite=new T.Sprite(new T.SpriteMaterial({transparent:true,depthTest:true}));sprite.position.set(0,3,0);sprite.scale.set(6,1.5,1);groups.language.add(sprite);
  }
  const isFuture=window.__r21?.era?.()==='future';future.visible=isFuture;root.visible=(isFuture||Object.values(states).some(Boolean))&&talk.mode==='sim'&&!!window.__aoi?.aoi?.visible;
  if(!root.visible)return;
  const now=performance.now();if(now-last<100)return;last=now;
  const marks=(talk.MARKS||[]).filter(m=>m.wp&&Number.isFinite(m.wp.x)).sort((a,b)=>Math.hypot(a.wp.x-camera.position.x,a.wp.z-camera.position.z)-Math.hypot(b.wp.x-camera.position.x,b.wp.z-camera.position.z));
  const nearest=marks[0];if(nearest&&Math.hypot(nearest.wp.x-camera.position.x,nearest.wp.z-camera.position.z)<60)root.position.set(nearest.wp.x,Number.isFinite(nearest.wp.y)?nearest.wp.y:camera.position.y-1.6,nearest.wp.z);else{const p=talk.toWorld(talk.d+14,0);root.position.set(p.x,camera.position.y-1.6,p.z);}
  for(const k in groups)groups[k].visible=states[k];
  const label=nearest?.lb?.textContent?.trim()||'目の前の場所';if(label!==lastLabel){lastLabel=label;const c=document.createElement('canvas');c.width=768;c.height=192;const ctx=c.getContext('2d');ctx.font='38px serif';ctx.textAlign='center';ctx.fillStyle='#e7f4ed';ctx.fillText(label.slice(0,18),384,100);const texture=new T.CanvasTexture(c);sprite.material.map?.dispose();sprite.material.map=texture;sprite.material.needsUpdate=true;}
  const frozen=panel.querySelector('#qualiumStill').checked||reduced.matches;groups.senses.position.y=frozen?0:Math.sin(now*.0005)*.12;future.rotation.y=frozen?0:Math.sin(now*.00008)*.08;
 };
 window.__qualium={states,panel,get visible(){return !!root?.visible},get count(){return root?.children.length||0}};
})();
