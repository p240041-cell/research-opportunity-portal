const API = 'http://localhost:3000/api/opportunities';
const $ = id => document.getElementById(id);
const formModal = new bootstrap.Modal($('formModal'));
const detailModal = new bootstrap.Modal($('detailModal'));

const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function showMsg(text, type = 'success') {
  $('alerts').innerHTML = `<div class="alert alert-${type} alert-dismissible fade show">${esc(text)}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
  setTimeout(() => ($('alerts').innerHTML = ''), 5000);
}

async function api(url = '', options = {}) {
  const res = await fetch(API + url, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const details = data.details ? ': ' + data.details.join(', ') : '';
    throw new Error((data.error || 'Request failed') + details + ` (HTTP ${res.status})`);
  }
  return data;
}

async function load() {
  try {
    const items = await api();
    $('rows').innerHTML = items.length ? items.map(o => `
      <tr>
        <td class="title-cell">${esc(o.title)}</td>
        <td>${esc(o.faculty_name)}</td>
        <td>${esc(o.research_area)}</td>
        <td>${o.available_positions}</td>
        <td>${esc(o.application_deadline)}</td>
        <td><span class="badge ${o.status === 'Open' ? 'badge-open' : 'badge-closed'}">${o.status}</span></td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary" onclick="viewOne(${o.id})">View</button>
          <button class="btn btn-sm btn-outline-primary" onclick="editOne(${o.id})">Edit</button>
          ${o.status === 'Open' ? `<button class="btn btn-sm btn-outline-warning" onclick="closeOne(${o.id})">Close</button>` : ''}
          <button class="btn btn-sm btn-outline-danger" onclick="delOne(${o.id})">Delete</button>
        </td>
      </tr>`).join('')
      : '<tr><td colspan="7" class="text-center text-muted py-4">No opportunities yet. Click "Post opportunity" to add one.</td></tr>';
  } catch (e) { showMsg('Could not load opportunities: ' + e.message, 'danger'); }
}

window.viewOne = async id => {
  try {
    const o = await api('/' + id);
    $('d_title').textContent = o.title;
    $('d_body').innerHTML = `
      <p>${esc(o.description)}</p>
      <dl class="row mb-0">
        <dt class="col-sm-4">Research area</dt><dd class="col-sm-8">${esc(o.research_area)}</dd>
        <dt class="col-sm-4">Faculty member</dt><dd class="col-sm-8">${esc(o.faculty_name)}</dd>
        <dt class="col-sm-4">Department</dt><dd class="col-sm-8">${esc(o.department)}</dd>
        <dt class="col-sm-4">Required skills</dt><dd class="col-sm-8">${esc(o.required_skills)}</dd>
        <dt class="col-sm-4">Available positions</dt><dd class="col-sm-8">${o.available_positions}</dd>
        <dt class="col-sm-4">Application deadline</dt><dd class="col-sm-8">${esc(o.application_deadline)}</dd>
        <dt class="col-sm-4">Status</dt><dd class="col-sm-8">${o.status}</dd>
      </dl>`;
    detailModal.show();
  } catch (e) { showMsg(e.message, 'danger'); load(); }
};

function openForm(o) {
  $('oppForm').classList.remove('was-validated');
  $('formError').textContent = '';
  $('formTitle').textContent = o ? 'Edit opportunity' : 'Post opportunity';
  $('f_id').value = o ? o.id : '';
  $('f_title').value = o?.title || '';
  $('f_description').value = o?.description || '';
  $('f_area').value = o?.research_area || '';
  $('f_faculty').value = o?.faculty_name || '';
  $('f_dept').value = o?.department || '';
  $('f_skills').value = o?.required_skills || '';
  $('f_positions').value = o?.available_positions || '';
  $('f_deadline').value = o?.application_deadline || '';
  $('f_status').value = o?.status || 'Open';
  formModal.show();
}

$('newBtn').onclick = () => openForm(null);
window.editOne = async id => {
  try { openForm(await api('/' + id)); } catch (e) { showMsg(e.message, 'danger'); load(); }
};

$('oppForm').addEventListener('submit', async ev => {
  ev.preventDefault();
  const form = ev.target;
  form.classList.add('was-validated');
  if (!form.checkValidity()) { $('formError').textContent = 'Please fill all required fields.'; return; }
  $('formError').textContent = '';
  const id = $('f_id').value;
  const body = {
    title: $('f_title').value, description: $('f_description').value,
    research_area: $('f_area').value, faculty_name: $('f_faculty').value,
    department: $('f_dept').value, required_skills: $('f_skills').value,
    available_positions: Number($('f_positions').value),
    application_deadline: $('f_deadline').value, status: $('f_status').value
  };
  try {
    await api(id ? '/' + id : '', { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
    formModal.hide();
    showMsg(id ? 'Opportunity updated.' : 'Opportunity created.');
    load();
  } catch (e) { $('formError').textContent = e.message; }
});

window.closeOne = async id => {
  try {
    await api('/' + id, { method: 'PUT', body: JSON.stringify({ status: 'Closed' }) });
    showMsg('Opportunity closed.');
  } catch (e) { showMsg(e.message, 'danger'); }
  load();
};

window.delOne = async id => {
  if (!confirm('Delete this opportunity permanently?')) return;
  try {
    await api('/' + id, { method: 'DELETE' });
    showMsg('Opportunity deleted.');
  } catch (e) { showMsg(e.message, 'danger'); }
  load();
};

load();
