/* app.js - Registro de Atividades (sem dependências) */
const STORAGE_KEY = 'atividade_logger_entries';

function nowISO(){ return new Date().toISOString(); }
function formatDateTime(iso){
  if(!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString();
}
function formatDate(iso){
  if(!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString();
}

function loadEntries(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return [];
  try { return JSON.parse(raw); } catch(e){ return []; }
}
function saveEntries(arr){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function renderTable(){
  const tbody = document.querySelector('#log-table tbody');
  tbody.innerHTML = '';
  const entries = loadEntries();
  entries.forEach(e=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDate(e.start)}</td>
      <td>${new Date(e.start).toLocaleTimeString()}</td>
      <td>${escapeHtml(e.activity)}</td>
      <td>${e.end ? new Date(e.end).toLocaleTimeString() : ''}</td>
      <td>${escapeHtml(e.notes || '')}</td>
    `;
    tbody.appendChild(tr);
  });
}

function escapeHtml(s){
  if(!s) return '';
  return String(s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

function startActivity(){
  const activity = document.getElementById('input-activity').value.trim();
  const notes = document.getElementById('input-notes').value.trim();
  if(!activity){
    alert('Por favor, preencha o campo "Atividade".');
    return;
  }
  const entries = loadEntries();
  // check if there's an open activity
  const open = entries.find(e=>!e.end);
  if(open){
    if(!confirm('Existe uma atividade não encerrada. Deseja encerrar a anterior e iniciar a nova?')){
      return;
    }
    open.end = nowISO();
  }
  entries.push({ start: nowISO(), activity, end: null, notes });
  saveEntries(entries);
  renderTable();
}

function stopActivity(){
  const entries = loadEntries();
  const open = entries.slice().reverse().find(e=>!e.end);
  if(!open){
    alert('Não há atividade em andamento para encerrar.');
    return;
  }
  open.end = nowISO();
  saveEntries(entries);
  renderTable();
}

function clearEntries(){
  if(!confirm('Apagar todos os registros? A ação é irreversível.')) return;
  localStorage.removeItem(STORAGE_KEY);
  renderTable();
}

function generateReport(){
  const startDate = document.getElementById('report-start').value;
  const endDate = document.getElementById('report-end').value;
  if(!startDate || !endDate){
    alert('Selecione data inicial e final para o relatório.');
    return;
  }
  const s = new Date(startDate); s.setHours(0,0,0,0);
  const e = new Date(endDate); e.setHours(23,59,59,999);
  const entries = loadEntries().filter(ent=>{
    const entDate = new Date(ent.start);
    return entDate >= s && entDate <= e;
  });
  showReport(entries, startDate, endDate);
}

function showReport(entries, startDate, endDate){
  const wrapper = document.getElementById('report-table-wrapper');
  wrapper.innerHTML = '';
  const h = document.createElement('div');
  h.innerHTML = `<p>Período: <strong>${startDate}</strong> — <strong>${endDate}</strong> — ${entries.length} registro(s).</p>`;
  wrapper.appendChild(h);
  const table = document.createElement('table');
  table.style.width='100%';
  table.border=1;
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>DATA</th><th>HORA INÍCIO</th><th>ATIVIDADE</th><th>HORA ENCERRAMENTO</th><th>OBSERVAÇÕES</th></tr>';
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  entries.forEach(e=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${formatDate(e.start)}</td><td>${new Date(e.start).toLocaleTimeString()}</td><td>${escapeHtml(e.activity)}</td><td>${e.end? new Date(e.end).toLocaleTimeString():''}</td><td>${escapeHtml(e.notes||'')}</td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrapper.appendChild(table);
  document.getElementById('report-area').classList.remove('hidden');
}

function closeReport(){ document.getElementById('report-area').classList.add('hidden'); }

function printReport(){
  const printWindow = window.open('', '_blank');
  const wrapper = document.getElementById('report-table-wrapper').innerHTML;
  const title = '<h1>Relatório de Atividades</h1>';
  const style = `<style>body{font-family:Arial,Helvetica,sans-serif;padding:20px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #333;padding:6px;text-align:left}</style>`;
  printWindow.document.open();
  printWindow.document.write('<html><head><meta charset="utf-8"/>'+style+'</head><body>'+title+wrapper+'</body></html>');
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  // optionally close the window after printing:
  // printWindow.close();
}

function exportCSV(){
  const entries = loadEntries();
  if(entries.length===0){ alert('Não há registros para exportar.'); return; }
  const rows = [
    ['DATA','HORA DE INÍCIO','ATIVIDADE EXECUTADA','HORA DE ENCERRAMENTO','OBSERVAÇÕES']
  ];
  entries.forEach(e=>{
    rows.push([formatDate(e.start), new Date(e.start).toLocaleTimeString(), e.activity, e.end? new Date(e.end).toLocaleTimeString() : '', e.notes||'']);
  });
  const csv = rows.map(r => r.map(cell => '"'+String(cell).replace(/"/g,'""')+'"').join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'relatorio_atividades.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* Wire UI */
document.getElementById('btn-start').addEventListener('click', startActivity);
document.getElementById('btn-stop').addEventListener('click', stopActivity);
document.getElementById('btn-generate').addEventListener('click', generateReport);
document.getElementById('btn-print').addEventListener('click', printReport);
document.getElementById('btn-close-report').addEventListener('click', closeReport);
document.getElementById('btn-export-csv').addEventListener('click', exportCSV);
document.getElementById('btn-clear').addEventListener('click', clearEntries);

renderTable();
