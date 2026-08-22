let state = { categories: [], tasks: [], reminders: [] };
const $ = id => document.getElementById(id);

async function api(path, options={}) {
  const res = await fetch(path, { headers: {'Content-Type':'application/json'}, ...options });
  if (!res.ok) throw new Error(await res.text());
  return res.headers.get('content-type')?.includes('application/json') ? res.json() : res;
}

async function loadState(){ state = await api('/api/state'); render(); }

function escapeHtml(s=''){ return s.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function taskChildren(id){ return state.tasks.filter(t => t.parent_id === id); }
function rootsFor(cat){ return state.tasks.filter(t => t.category_id === cat.id && !t.parent_id); }
function pct(cat){ const ts = state.tasks.filter(t=>t.category_id===cat.id); return ts.length ? Math.round(ts.filter(t=>t.completed).length/ts.length*100) : 0; }
function taskHtml(t, level=0){
  const children = taskChildren(t.id);
  const due = t.due_at ? new Date(t.due_at).toLocaleString([], {month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}) : '';
  const link = t.url ? `<a href="${escapeHtml(t.url)}" target="_blank" rel="noreferrer">open</a>` : '';
  return `<div class="task ${t.completed?'done':''}" style="margin-left:${Math.min(level,3)*22}px" data-id="${t.id}">
    <button class="check" onclick="toggleTask('${t.id}')">${t.completed?'✓':''}</button>
    <div>
      <div class="title-row"><span class="title">${escapeHtml(t.title)}</span><span class="tag">${escapeHtml(t.kind)}</span><span class="tag priority ${t.priority}">${escapeHtml(t.priority)}</span></div>
      <div class="task-meta">${due?`<span>${due}</span>`:''}${link}${t.notes?`<span>${escapeHtml(t.notes.slice(0,100))}${t.notes.length>100?'…':''}</span>`:''}</div>
      ${children.length?`<div class="subtasks">${children.map(c=>taskHtml(c,level+1)).join('')}</div>`:''}
    </div>
    <div class="task-actions"><button class="small" onclick="editTask('${t.id}')">Edit</button></div>
  </div>`;
}

function render(){
  const total=state.tasks.length, done=state.tasks.filter(t=>t.completed).length, due=state.tasks.filter(t=>!t.completed && t.due_at && new Date(t.due_at)<new Date()).length;
  $('stats').innerHTML = `<div class="stat"><div class="stat-value">${done}/${total}</div><div class="stat-label">completed</div></div><div class="stat"><div class="stat-value">${total?Math.round(done/total*100):0}%</div><div class="stat-label">overall progress</div></div><div class="stat"><div class="stat-value">${due}</div><div class="stat-label">overdue</div></div>`;
  $('categories').innerHTML = state.categories.map(cat=>{
    const roots=rootsFor(cat), all=state.tasks.filter(t=>t.category_id===cat.id);
    return `<article class="category ${cat.color}" data-cat="${cat.id}">
      <div class="category-head"><div class="cat-main"><span class="cat-dot"></span><div><div class="cat-name">${escapeHtml(cat.name)}</div><div class="cat-meta">${all.filter(t=>t.completed).length} / ${all.length} complete</div></div></div>
      <div class="cat-actions"><div class="progress"><span style="width:${pct(cat)}%"></span></div><button class="small" onclick="addTask('${cat.id}')">+ task</button></div></div>
      <div class="task-list">${roots.length?roots.map(t=>taskHtml(t)).join(''):`<div class="empty">No items yet. Add the first thing you want to learn or build.</div>`}</div>
    </article>`
  }).join('');
}

function openDrawer(task=null, categoryId=null){
  $('drawer').classList.add('open'); $('drawer').setAttribute('aria-hidden','false');
  $('taskId').value=task?.id||''; $('drawerEyebrow').textContent=task?'EDIT ITEM':'NEW ITEM'; $('drawerTitle').textContent=task?'Edit item':'Add task';
  $('fTitle').value=task?.title||''; $('fKind').value=task?.kind||'task'; $('fPriority').value=task?.priority||'medium'; $('fDue').value=task?.due_at?task.due_at.slice(0,16):''; $('fUrl').value=task?.url||''; $('fNotes').value=task?.notes||'';
  $('fCategory').innerHTML=state.categories.map(c=>`<option value="${c.id}" ${((task?.category_id||categoryId)===c.id)?'selected':''}>${escapeHtml(c.name)}</option>`).join('');
  $('fParent').innerHTML='<option value="">None</option>'+state.tasks.filter(t=>t.id!==task?.id && (!task || t.category_id===(task?.category_id||categoryId))).map(t=>`<option value="${t.id}" ${task?.parent_id===t.id?'selected':''}>${escapeHtml(t.title)}</option>`).join('');
  const r=task?state.reminders.find(x=>x.task_id===task.id):null;
  $('rEnabled').checked=!!r?.enabled; $('rMode').value=r?.mode||'once'; $('rAt').value=r?.remind_at?r.remind_at.slice(0,16):(task?.due_at?task.due_at.slice(0,16):''); $('rInterval').value=r?.interval_minutes||60;
  [...$('rWeekdays').options].forEach(o=>o.selected = (()=>{try{return (r?.weekdays?JSON.parse(r.weekdays):[]).map(String).includes(o.value)}catch{return false}})());
  $('deleteBtn').classList.toggle('hidden',!task); updateReminderUI();
}
function closeDrawer(){ $('drawer').classList.remove('open'); $('drawer').setAttribute('aria-hidden','true'); }
function addTask(cat){ openDrawer(null,cat); }
function editTask(id){ openDrawer(state.tasks.find(t=>t.id===id)); }
async function toggleTask(id){ const t=state.tasks.find(x=>x.id===id); await api('/api/tasks/'+id,{method:'PATCH',body:JSON.stringify({completed:t.completed?0:1})}); await loadState(); }
function inputDate(v){ return v || null; }

async function saveTask(ev){
  ev.preventDefault();
  const id=$('taskId').value;
  const payload={category_id:$('fCategory').value,parent_id:$('fParent').value||null,title:$('fTitle').value,kind:$('fKind').value,priority:$('fPriority').value,due_at:inputDate($('fDue').value),url:$('fUrl').value,notes:$('fNotes').value};
  if(id) await api('/api/tasks/'+id,{method:'PATCH',body:JSON.stringify(payload)}); else { const x=await api('/api/tasks',{method:'POST',body:JSON.stringify(payload)}); $('taskId').value=x.id; }
  const taskId=$('taskId').value;
  if($('rEnabled').checked){
    await api('/api/reminders/'+taskId,{method:'PUT',body:JSON.stringify({enabled:1,mode:$('rMode').value,remind_at:inputDate($('rAt').value),interval_minutes:Number($('rInterval').value||0),weekdays:[...$('rWeekdays').selectedOptions].map(x=>Number(x.value))})});
  } else { await api('/api/reminders/'+taskId,{method:'DELETE'}).catch(()=>{}); }
  closeDrawer(); await loadState();
}
async function deleteTask(){ const id=$('taskId').value; if(!id) return; if(confirm('Delete this item and its subtasks?')){ await api('/api/tasks/'+id,{method:'DELETE'}); closeDrawer(); await loadState(); } }
function updateReminderUI(){ $('intervalWrap').classList.toggle('hidden',$('rMode').value!=='interval'); $('weekdaysWrap').classList.toggle('hidden',$('rMode').value!=='weekly'); }

async function showReport(){ const r=await api('/api/report'); $('reportBody').innerHTML=`<div class="report-grid"><div class="report-card"><b>${r.total}</b><span>items</span></div><div class="report-card"><b>${r.done}</b><span>completed</span></div><div class="report-card"><b>${r.completion_rate}%</b><span>completion rate</span></div></div><h4>Last 7 days</h4><div class="bars">${r.last7.map(x=>`<div class="bar-wrap"><div class="bar" style="height:${Math.max(3,x.completed*24)}px"></div><div class="bar-label">${x.date.slice(5)}</div></div>`).join('')}</div><h4>By category</h4>${r.categories.map(x=>`<div class="report-category"><span>${escapeHtml(x.name)}</span><span>${x.done}/${x.total}</span></div>`).join('')}`; $('reportModal').classList.add('open'); }

$('taskForm').addEventListener('submit',saveTask); $('rMode').addEventListener('change',updateReminderUI); $('addBtn').addEventListener('click',()=>openDrawer()); $('reportBtn').addEventListener('click',showReport); $('exportBtn').addEventListener('click',()=>{window.location='/api/export'}); $('importBtn').addEventListener('click',()=>$('importFile').click()); $('importFile').addEventListener('change',async e=>{ const file=e.target.files[0]; if(!file)return; const text=await file.text(); try{ await api('/api/import',{method:'POST',body:text}); await loadState(); alert('Imported successfully.'); }catch(err){ alert('Import failed: '+err.message); } e.target.value=''; }); $('deleteBtn').addEventListener('click',deleteTask);
document.addEventListener('click',e=>{ if(e.target.dataset.close) closeDrawer(); if(e.target.dataset.reportClose) $('reportModal').classList.remove('open'); });
loadState();
