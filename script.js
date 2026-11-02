/* ======================================================================
   ICONS — minimal inline SVG set, single style, reused across sidebar/UI
====================================================================== */
const ICON = {
  dashboard:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  animal:'<circle cx="12" cy="13" r="6"/><path d="M8 8 6 4M16 8l2-4"/><circle cx="9.5" cy="12.5" r=".6" fill="currentColor"/><circle cx="14.5" cy="12.5" r=".6" fill="currentColor"/>',
  facility:'<path d="M4 11 12 4l8 7"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>',
  feed:'<path d="M12 21c-4-1-7-5-7-10 5 0 9 3 10 7"/><path d="M12 21c4-1 7-5 7-10-5 0-9 3-10 7"/><path d="M12 21V9"/>',
  train:'<path d="M12 3 2 8l10 5 10-5-10-5z"/><path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5"/>',
  jobs:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
  people:'<circle cx="8.5" cy="8" r="3"/><circle cx="16" cy="9" r="2.4"/><path d="M2.5 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M14.5 14.2c2.6.4 4.5 2.6 4.5 5.3"/>',
  farm:'<path d="M12 21V10"/><path d="M12 10c0-4-3-6-7-6 0 4 3 7 7 7Z"/><path d="M12 13c0-3.5 2.6-5.5 6-5.5 0 3.5-2.6 6-6 6Z"/>',
  finance:'<path d="M3 21h18"/><path d="M5 21V10l7-6 7 6v11"/><path d="M9 21v-6h6v6"/>',
  time:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  analytics:'<path d="M4 20V10"/><path d="M11 20V4"/><path d="M18 20v-7"/>',
  scale:'<path d="M12 3v18"/><path d="M5 8h14"/><path d="M5 8 2 15a3 3 0 0 0 6 0L5 8Z"/><path d="M19 8l-3 7a3 3 0 0 0 6 0l-3-7Z"/>',
  chat:'<path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4A8.6 8.6 0 0 1 8 19l-5 1 1.5-4.4A8.4 8.4 0 1 1 21 11.5Z"/>',
  users:'<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.2 3.2 0 0 1 0 6.3"/><path d="M17.5 14.2a6.5 6.5 0 0 1 4 5.8"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1Z"/>',
  bell:'<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M12 11v5"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  clockin:'<path d="M12 22a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"/><path d="M12 10v4l2.5 1.5"/><path d="M9 2h6"/>'
};
function svg(key, size=17){ return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICON[key]||''}</svg>`; }

/* Escape any server/user-supplied value before putting it inside innerHTML.
   Values such as chat messages, job titles and animal records come from the
   database (user input), so they must never be injected as raw HTML. */
function esc(value){
  return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

/* ======================================================================
   STATIC UI CONSTANTS
   Role labels and the module registry below are UI configuration only.
   All user, credential, and record data is loaded from the API at runtime;
   no credentials or mock user records are kept in the browser.
====================================================================== */
const ROLE_LABEL = {admin:'Administrator', manager:'Farm Manager', accountant:'Accountant', worker:'Farm Worker'};

// module registry — single source of truth for sidebar + access control
const MODULES = [
  {id:'dashboard', label:'Dashboard', icon:'dashboard', roles:['admin','manager','accountant','worker'], group:'Overview'},
  {id:'jobs', label:'Jobs & Tasks', icon:'jobs', roles:['admin','manager','worker'], group:'Operations', full:true},
  {id:'animal', label:'Animal', icon:'animal', roles:['admin','manager','worker'], group:'Operations', full:true},
  {id:'facility', label:'Facility', icon:'facility', roles:['admin','manager'], group:'Operations'},
  {id:'feed', label:'Feed', icon:'feed', roles:['admin','manager'], group:'Operations'},
  {id:'farm', label:'Farm', icon:'farm', roles:['admin','manager','worker'], group:'Operations'},
  {id:'train', label:'Train Track', icon:'train', roles:['admin','manager'], group:'Operations'},
  {id:'scale', label:'Scale', icon:'scale', roles:['admin','accountant'], group:'Operations'},
  {id:'time', label:'Time', icon:'time', roles:['admin','manager','accountant','worker'], group:'Workforce', full:true},
  {id:'people', label:'People', icon:'people', roles:['admin','manager'], group:'Workforce', full:true},
  {id:'finance', label:'Finance', icon:'finance', roles:['admin','accountant'], group:'Workforce', full:true},
  {id:'analytics', label:'Analytics', icon:'analytics', roles:['admin','manager','accountant'], group:'Workforce'},
  {id:'chat', label:'Chat', icon:'chat', roles:['admin','manager','accountant','worker'], group:'Workforce', full:true},
  {id:'users', label:'Users & Roles', icon:'users', roles:['admin'], group:'Admin', full:true},
  {id:'settings', label:'Settings', icon:'settings', roles:['admin'], group:'Admin'},
];

let JOBS = [
  {id:1, title:'Move dairy herd to east paddock', assignee:'James Otieno', due:'Today', status:'open', priority:'high'},
  {id:2, title:'Repair fence — north boundary', assignee:'James Otieno', due:'Tomorrow', status:'open', priority:'medium'},
  {id:3, title:'Restock mineral licks, barn 2', assignee:'Unassigned', due:'Fri', status:'open', priority:'low'},
  {id:4, title:'Vaccinate calves (batch 12)', assignee:'James Otieno', due:'Mon', status:'done', priority:'high'},
];
let ANIMALS = [
  {tag:'UG-0142', type:'Dairy cow', breed:'Friesian', status:'Healthy', weight:'480 kg', location:'Paddock A'},
  {tag:'UG-0143', type:'Dairy cow', breed:'Ankole', status:'Under watch', weight:'410 kg', location:'Barn 2'},
  {tag:'UG-0144', type:'Calf', breed:'Friesian', status:'Healthy', weight:'92 kg', location:'Nursery'},
  {tag:'UG-0145', type:'Dairy cow', breed:'Jersey', status:'Healthy', weight:'395 kg', location:'Paddock A'},
];
let TIME_LOG = [
  {name:'James Otieno', date:'Jul 14', in:'6:02 AM', out:'—', hours:'in progress'},
  {name:'James Otieno', date:'Jul 13', in:'6:10 AM', out:'4:45 PM', hours:'10h 35m'},
  {name:'Peter Okello', date:'Jul 13', in:'7:00 AM', out:'5:30 PM', hours:'10h 30m'},
];
let CLOCKED_IN = false;
let TRANSACTIONS = [
  {date:'Jul 12', desc:'Milk sale — Mukono Dairy Co-op', type:'Income', amount:2450000},
  {date:'Jul 10', desc:'Feed supplier invoice #2291', type:'Expense', amount:-860000},
  {date:'Jul 9', desc:'Veterinary services', type:'Expense', amount:-210000},
  {date:'Jul 7', desc:'Livestock sale — 2 head', type:'Income', amount:1800000},
  {date:'Jul 3', desc:'Worker payroll — June', type:'Expense', amount:-1340000},
];
let STAFF = [
  {name:'Grace Nakato', role:'Administrator', dept:'Management', status:'Active'},
  {name:'Peter Okello', role:'Farm Manager', dept:'Operations', status:'Active'},
  {name:'Sarah Namuli', role:'Accountant', dept:'Finance', status:'Active'},
  {name:'James Otieno', role:'Farm Worker', dept:'Livestock', status:'Active'},
  {name:'Moses Kato', role:'Farm Worker', dept:'Crops', status:'On leave'},
];
let CHAT_CHANNELS = ['General', 'Livestock team', 'Maintenance', 'Management'];
let CHAT_MSGS = {
  'General':[
    {from:'Peter Okello', me:false, text:'Morning all — vet visit confirmed for 2pm today.', time:'7:12 AM'},
    {from:'James Otieno', me:false, text:'Noted, herd will be in barn 2 by then.', time:'7:15 AM'},
  ],
  'Livestock team':[
    {from:'Sarah Namuli', me:false, text:'Feed invoice looks higher than last month, can someone confirm quantities?', time:'8:02 AM'},
  ],
  'Maintenance':[], 'Management':[]
};
let activeChannel = 'General';
let FACILITIES = [
  {name:'Milking parlor', status:'Operational', health:'92%', type:'Core facility', note:'No downtime in the last 7 days'},
  {name:'Barn 2', status:'Maintenance due', health:'74%', type:'Housing', note:'Water trough valve replacement scheduled'},
  {name:'Feed store', status:'Stocked', health:'88%', type:'Storage', note:'Top-up order due Monday'},
  {name:'Cooling tank', status:'Operational', health:'95%', type:'Equipment', note:'Temperature under range'}
];
let FEED_INVENTORY = [
  {item:'Maize silage', stock:'1,420 kg', status:'Healthy', expiry:'12 days', reorder:'Low'},
  {item:'Concentrate meal', stock:'860 kg', status:'Healthy', expiry:'23 days', reorder:'On track'},
  {item:'Hay bales', stock:'64 bales', status:'Dry', expiry:'31 days', reorder:'Low'},
  {item:'Mineral lick', stock:'18 bags', status:'Active', expiry:'45 days', reorder:'On track'}
];
let FARM_FIELDS = [
  {name:'North paddock', crop:'Maize', stage:'Vegetative', yield:'18.5 t', moisture:'17%'},
  {name:'West grazing', crop:'Pasture', stage:'Regrowth', yield:'11.2 t', moisture:'19%'},
  {name:'South plot', crop:'Napier grass', stage:'Cutting cycle', yield:'9.8 t', moisture:'16%'},
  {name:'Lower orchard', crop:'Fruit trees', stage:'Blooming', yield:'4.3 t', moisture:'14%'}
];
let TRAINING_LOG = [
  {title:'Calf handling', trainer:'Vet Services', next:'Thu 9:00', status:'Required', level:'High priority'},
  {title:'Biosecurity briefing', trainer:'Farm manager', next:'Fri 14:00', status:'Scheduled', level:'Standard'},
  {title:'Milking hygiene', trainer:'Operations lead', next:'Mon 8:00', status:'Due soon', level:'Mandatory'},
  {title:'Equipment safety', trainer:'Maintenance', next:'Wed 11:30', status:'Completed', level:'Low'}
];
let SCALE_LOGS = [
  {animal:'UG-0142', weight:'480 kg', date:'Today', note:'Stable weight'},
  {animal:'UG-0143', weight:'410 kg', date:'Today', note:'Under watch'},
  {animal:'UG-0145', weight:'395 kg', date:'Yesterday', note:'Good gain'},
  {animal:'UG-0144', weight:'92 kg', date:'Yesterday', note:'Healthy calf'}
];
let ANALYTICS_SUMMARY = {
  milkProduction: '2,420 L',
  feedCost: 'UGX 3.6M',
  labourEfficiency: '86%',
  herdHealth: '94%',
  weeklyTrend: [62, 68, 72, 79, 74, 83, 88],
};
let SETTINGS_PROFILE = {
  farmName:'Mubiru Dairy Farm',
  timezone:'East Africa Time (UTC+3)',
  alerts:true,
  autoSync:true,
  regionalCost:'UGX',
  notifications:'Daily summary'
};

/* ======================================================================
   SESSION / AUTH
====================================================================== */
let session = null; // {username, role, name, sessionVersion}
let DASHBOARD = null;   // live dashboard counters from /api/dashboard
let CHAT_CHANNEL_IDS = {};
const API_BASE = '/api';

async function apiRequest(path, options={}){
  const response = await fetch(API_BASE + path, {
    credentials:'include', headers:{'Content-Type':'application/json', ...(options.headers||{})}, ...options,
  });
  const result = await response.json().catch(()=>({}));
  if(response.status===401 && session){
    session = null;
    document.getElementById('shell').classList.add('hidden');
    goTo('login');
    showToastLikeMessage('Your session expired. Please sign in again.');
  }
  if(!response.ok) throw new Error(result.error?.message || 'The server could not complete that request.');
  return result;
}
async function hydrateData(){
  const requests = await Promise.allSettled([
    apiRequest('/jobs'), apiRequest('/animals'), apiRequest('/facility'), apiRequest('/feed'), apiRequest('/farm'),
    apiRequest('/train'), apiRequest('/scale'), apiRequest('/time-logs'), apiRequest('/transactions'),
    apiRequest('/staff'), apiRequest('/analytics'), apiRequest('/settings'), apiRequest('/chat/channels'), apiRequest('/dashboard'),
  ]);
  const [jobs, animals, facility, feed, farm, train, scale, time, transactions, staff, analytics, settings, channels, dashboard] = requests;
  if(jobs.status==='fulfilled') JOBS = jobs.value.data.map(j=>({...j, assignee:j.assignee||'Unassigned', due:j.dueDate ? new Date(j.dueDate).toLocaleDateString([], {month:'short', day:'numeric'}) : 'Unscheduled'}));
  if(animals.status==='fulfilled') ANIMALS = animals.value.data;
  if(facility.status==='fulfilled') FACILITIES = facility.value.data;
  if(feed.status==='fulfilled') FEED_INVENTORY = feed.value.data;
  if(farm.status==='fulfilled') FARM_FIELDS = farm.value.data;
  if(train.status==='fulfilled') TRAINING_LOG = train.value.data;
  if(scale.status==='fulfilled') SCALE_LOGS = scale.value.data;
  if(time.status==='fulfilled') {
    TIME_LOG = time.value.data;
    CLOCKED_IN = Boolean(time.value.clockedIn);
  }
  if(transactions.status==='fulfilled') TRANSACTIONS = transactions.value.data;
  if(staff.status==='fulfilled') STAFF = staff.value.data;
  if(analytics.status==='fulfilled') ANALYTICS_SUMMARY = analytics.value.data;
  if(settings.status==='fulfilled') SETTINGS_PROFILE = settings.value.data;
  if(channels.status==='fulfilled'){
    CHAT_CHANNEL_IDS = Object.fromEntries(channels.value.data.map(c=>[c.channelName, c.id]));
    CHAT_CHANNELS = channels.value.data.map(c=>c.channelName);
  }
  if(dashboard.status==='fulfilled') DASHBOARD = dashboard.value.data;
}

async function refreshDashboard(){
  try{ DASHBOARD = (await apiRequest('/dashboard')).data; }
  catch(error){ console.warn(error); }
}

function goTo(view){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+view).classList.add('active');
}
function showErr(id, msg){
  const el = document.getElementById(id);
  el.textContent = msg; el.style.display='block';
}
function hideErr(id){ document.getElementById(id).style.display='none'; }

async function handleLogin(){
  const u = document.getElementById('loginUser').value.trim().toLowerCase();
  const p = document.getElementById('loginPass').value;
  hideErr('loginError');
  try{
    const result = await apiRequest('/auth/login', {method:'POST', body:JSON.stringify({username:u, password:p})});
    session = result.user;
    enterApp();
  }catch(error){ showErr('loginError', error.message || 'Unable to sign in.'); }
}
async function handleLogout(){
  try{ await apiRequest('/auth/logout', {method:'POST'}); }catch(error){ console.warn(error); }
  session = null;
  document.getElementById('shell').classList.add('hidden');
  document.getElementById('loginUser').value='';
  document.getElementById('loginPass').value='';
  goTo('login');
}

function showToastLikeMessage(msg){
  const el = document.getElementById('loginError');
  el.className='form-msg info'; el.textContent=msg; el.style.display='block';
}

/* ======================================================================
   APP SHELL RENDER
====================================================================== */
async function enterApp(){
  document.getElementById('view-login').classList.remove('active');
  document.getElementById('view-reset').classList.remove('active');
  document.getElementById('shell').classList.remove('hidden');
  document.getElementById('sideAvatar').textContent = initials(session.name);
  document.getElementById('sideName').textContent = session.name;
  document.getElementById('sideRole').textContent = ROLE_LABEL[session.role];
  await hydrateData();
  buildNav();
  buildPages();
  navigateTo('dashboard');
  tickClock();
  setInterval(tickClock, 1000*30);
}
function initials(name){
  return name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
}
function tickClock(){
  const d = new Date();
  document.getElementById('clockPill').textContent = d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  document.getElementById('datePill').textContent = d.toLocaleDateString([], {weekday:'short', month:'short', day:'numeric'});
}

function accessibleModules(){
  return MODULES.filter(m=>m.roles.includes(session.role));
}
function buildNav(){
  const mods = accessibleModules();
  const groups = [...new Set(mods.map(m=>m.group))];
  let html = '';
  groups.forEach(g=>{
    html += `<div class="nav-group-label">${g}</div>`;
    mods.filter(m=>m.group===g).forEach(m=>{
      html += `<div class="nav-item" id="nav-${m.id}" onclick="navigateTo('${m.id}')">${svg(m.icon)}<span>${m.label}</span></div>`;
    });
  });
  document.getElementById('navScroll').innerHTML = html;
}
function buildPages(){
  const content = document.getElementById('content');
  let html = '';
  accessibleModules().forEach(m=>{
    html += `<section class="page" id="page-${m.id}"></section>`;
  });
  content.innerHTML = html;
  accessibleModules().forEach(m=>{
    const el = document.getElementById('page-'+m.id);
    el.innerHTML = renderPage(m);
  });
}
function navigateTo(id){
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const navEl = document.getElementById('nav-'+id);
  if(navEl) navEl.classList.add('active');
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pageEl = document.getElementById('page-'+id);
  if(pageEl) pageEl.classList.add('active');
  const mod = MODULES.find(m=>m.id===id);
  document.getElementById('pageTitle').textContent = mod ? mod.label : 'Dashboard';
  if(id==='jobs') refreshJobs();
  if(id==='dashboard') refreshDashboardView();
  if(id==='animal') refreshAnimals();
  if(id==='time') refreshTime();
  if(id==='finance') refreshFinance();
  if(id==='people') refreshStaff();
  if(id==='chat') refreshChat();
  if(id==='users') refreshUsers();
  if(id==='facility') refreshFacility();
  if(id==='feed') refreshFeed();
  if(id==='farm') refreshFarm();
  if(id==='train') refreshTrain();
  if(id==='scale') refreshScale();
  if(id==='analytics') refreshAnalytics();
  if(id==='settings') refreshSettings();
}

/* ======================================================================
   PAGE RENDERERS
====================================================================== */
async function refreshDashboardView(){
  await refreshDashboard();
  const el = document.getElementById('page-dashboard');
  if(el) el.innerHTML = renderDashboard();
}
function renderPage(mod){
  switch(mod.id){
    case 'dashboard': return renderDashboard();
    case 'jobs': return renderJobs();
    case 'animal': return renderAnimal();
    case 'facility': return renderFacility();
    case 'feed': return renderFeed();
    case 'farm': return renderFarm();
    case 'train': return renderTrain();
    case 'scale': return renderScale();
    case 'time': return renderTime();
    case 'people': return renderPeople();
    case 'finance': return renderFinance();
    case 'analytics': return renderAnalytics();
    case 'chat': return renderChat();
    case 'users': return renderUsers();
    case 'settings': return renderSettings();
    default: return renderPlaceholder(mod);
  }
}

function renderFacility(){
  return `
  <div class="toolbar"><div><h2>Facility</h2><div class="desc">Operational status, equipment health, and service requirements.</div></div></div>
  <div class="grid cols-4" style="margin-bottom:16px;">
    <div class="stat-card"><div class="label">${svg('facility',15)} Facilities</div><div class="value">${FACILITIES.length}</div><div class="delta up">3 ready</div></div>
    <div class="stat-card"><div class="label">${svg('info',15)} Alerts</div><div class="value">2</div><div class="delta down">1 overdue</div></div>
    <div class="stat-card"><div class="label">${svg('time',15)} Uptime</div><div class="value">94%</div><div class="delta up">7-day average</div></div>
    <div class="stat-card"><div class="label">${svg('settings',15)} PM cycle</div><div class="value">14d</div><div class="delta flat">On schedule</div></div>
  </div>
  <div class="card">
    <table>
      <thead><tr><th>Asset</th><th>Type</th><th>Status</th><th>Health</th><th>Notes</th></tr></thead>
      <tbody>
        ${FACILITIES.map(item => `
          <tr>
            <td>${esc(item.name)}</td>
            <td>${esc(item.type)}</td>
            <td><span class="tag ${item.status === 'Operational' ? 'green' : item.status === 'Stocked' ? 'green' : item.status === 'Maintenance due' ? 'warn' : 'red'}">${esc(item.status)}</span></td>
            <td>${esc(item.health)}</td>
            <td>${esc(item.note)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>`;
}
async function refreshFacility(){
  try { FACILITIES = (await apiRequest('/facility')).data; }
  catch (error) { console.warn(error.message || 'Unable to refresh facility data.'); }
}

function renderFeed(){
  return `
  <div class="toolbar"><div><h2>Feed</h2><div class="desc">Feed inventory, usage coverage, and reorder risk.</div></div></div>
  <div class="grid cols-4" style="margin-bottom:16px;">
    <div class="stat-card"><div class="label">${svg('feed',15)} Feed stock</div><div class="value">3,600 kg</div><div class="delta up">12 days runway</div></div>
    <div class="stat-card"><div class="label">${svg('analytics',15)} Ration balance</div><div class="value">96%</div><div class="delta up">Within target</div></div>
    <div class="stat-card"><div class="label">${svg('bell',15)} Reorder alerts</div><div class="value">2</div><div class="delta warn">Review this week</div></div>
    <div class="stat-card"><div class="label">${svg('scale',15)} Waste</div><div class="value">1.8%</div><div class="delta up">Below goal</div></div>
  </div>
  <div class="card">
    <table>
      <thead><tr><th>Feed</th><th>Stock</th><th>Status</th><th>Expiry</th><th>Reorder</th></tr></thead>
      <tbody>
        ${FEED_INVENTORY.map(item => `
          <tr>
            <td>${esc(item.item)}</td>
            <td>${esc(item.stock)}</td>
            <td><span class="tag ${item.status === 'Healthy' || item.status === 'Dry' ? 'green' : 'warn'}">${esc(item.status)}</span></td>
            <td>${esc(item.expiry)}</td>
            <td>${esc(item.reorder)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>`;
}
async function refreshFeed(){
  try { FEED_INVENTORY = (await apiRequest('/feed')).data; }
  catch (error) { console.warn(error.message || 'Unable to refresh feed data.'); }
}

function renderFarm(){
  return `
  <div class="toolbar"><div><h2>Farm</h2><div class="desc">Field plan, crop progress, and expected outputs.</div></div></div>
  <div class="grid cols-4" style="margin-bottom:16px;">
    <div class="stat-card"><div class="label">${svg('farm',15)} Active plots</div><div class="value">12</div><div class="delta up">3 in harvest window</div></div>
    <div class="stat-card"><div class="label">${svg('analytics',15)} Area</div><div class="value">38.4 ha</div><div class="delta flat">Across 4 zones</div></div>
    <div class="stat-card"><div class="label">${svg('feed',15)} Yield forecast</div><div class="value">43.8 t</div><div class="delta up">+6.2% vs last cycle</div></div>
    <div class="stat-card"><div class="label">${svg('check',15)} Soil coverage</div><div class="value">88%</div><div class="delta up">Within plan</div></div>
  </div>
  <div class="card">
    <table>
      <thead><tr><th>Plot</th><th>Crop</th><th>Stage</th><th>Expected yield</th><th>Moisture</th></tr></thead>
      <tbody>
        ${FARM_FIELDS.map(field => `
          <tr>
            <td>${esc(field.name)}</td>
            <td>${esc(field.crop)}</td>
            <td>${esc(field.stage)}</td>
            <td>${esc(field.yield)}</td>
            <td>${esc(field.moisture)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>`;
}
async function refreshFarm(){
  try { FARM_FIELDS = (await apiRequest('/farm')).data; }
  catch (error) { console.warn(error.message || 'Unable to refresh farm data.'); }
}

function renderTrain(){
  return `
  <div class="toolbar"><div><h2>Train Track</h2><div class="desc">Skill checks, onboarding tasks, and upcoming training sessions.</div></div></div>
  <div class="grid cols-3" style="margin-bottom:16px;">
    <div class="stat-card"><div class="label">${svg('train',15)} Assigned</div><div class="value">18</div><div class="delta flat">Workers tracked</div></div>
    <div class="stat-card"><div class="label">${svg('bell',15)} Due soon</div><div class="value">5</div><div class="delta warn">2 mandatory</div></div>
    <div class="stat-card"><div class="label">${svg('check',15)} Completed</div><div class="value">72%</div><div class="delta up">This quarter</div></div>
  </div>
  <div class="card">
    <table>
      <thead><tr><th>Training</th><th>Facilitator</th><th>Next session</th><th>Status</th><th>Priority</th></tr></thead>
      <tbody>
        ${TRAINING_LOG.map(item => `
          <tr>
            <td>${esc(item.title)}</td>
            <td>${esc(item.trainer)}</td>
            <td>${esc(item.next)}</td>
            <td><span class="tag ${item.status === 'Completed' ? 'green' : item.status === 'Scheduled' ? 'warn' : 'red'}">${esc(item.status)}</span></td>
            <td>${esc(item.level)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>`;
}
async function refreshTrain(){
  try { TRAINING_LOG = (await apiRequest('/train')).data; }
  catch (error) { console.warn(error.message || 'Unable to refresh training data.'); }
}

function renderScale(){
  return `
  <div class="toolbar"><div><h2>Scale</h2><div class="desc">Livestock weigh-ins and production-quality measurements.</div></div></div>
  <div class="grid cols-4" style="margin-bottom:16px;">
    <div class="stat-card"><div class="label">${svg('scale',15)} Weigh-ins</div><div class="value">${SCALE_LOGS.length}</div><div class="delta up">This cycle</div></div>
    <div class="stat-card"><div class="label">${svg('animal',15)} Avg weight</div><div class="value">394 kg</div><div class="delta up">+12 kg</div></div>
    <div class="stat-card"><div class="label">${svg('analytics',15)} Growth rate</div><div class="value">7.8%</div><div class="delta up">Quarter trend</div></div>
    <div class="stat-card"><div class="label">${svg('info',15)} Review</div><div class="value">1</div><div class="delta warn">Under watch</div></div>
  </div>
  <div class="card">
    <table>
      <thead><tr><th>Animal</th><th>Weight</th><th>Date</th><th>Note</th></tr></thead>
      <tbody>
        ${SCALE_LOGS.map(item => `
          <tr>
            <td>${esc(item.animal)}</td>
            <td>${esc(item.weight)}</td>
            <td>${esc(item.date)}</td>
            <td>${esc(item.note)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>`;
}
async function refreshScale(){
  try { SCALE_LOGS = (await apiRequest('/scale')).data; }
  catch (error) { console.warn(error.message || 'Unable to refresh scale data.'); }
}

function renderAnalytics(){
  const chartData = ANALYTICS_SUMMARY.weeklyTrend;
  const chartMax = Math.max(...chartData);
  return `
  <div class="toolbar"><div><h2>Analytics</h2><div class="desc">Cross-module reporting for production, costs, and team efficiency.</div></div></div>
  <div class="grid cols-4" style="margin-bottom:16px;">
    <div class="stat-card"><div class="label">${svg('finance',15)} Milk output</div><div class="value">${esc(ANALYTICS_SUMMARY.milkProduction)}</div><div class="delta up">This week</div></div>
    <div class="stat-card"><div class="label">${svg('scale',15)} Feed cost</div><div class="value">${esc(ANALYTICS_SUMMARY.feedCost)}</div><div class="delta flat">Budgeted</div></div>
    <div class="stat-card"><div class="label">${svg('people',15)} Labour efficiency</div><div class="value">${esc(ANALYTICS_SUMMARY.labourEfficiency)}</div><div class="delta up">+2 pts</div></div>
    <div class="stat-card"><div class="label">${svg('animal',15)} Herd health</div><div class="value">${esc(ANALYTICS_SUMMARY.herdHealth)}</div><div class="delta up">Stable</div></div>
  </div>
  <div class="card">
    <div class="card-head"><h3>Weekly trends</h3><span class="muted">Last 7 days</span></div>
    <div class="bar-chart">
      ${chartData.map((value, index) => `
        <div class="bar-col">
          <div class="bar" style="height:${Math.max(12, (value / chartMax) * 100)}%"></div>
          <div class="bar-label">${['M','T','W','T','F','S','S'][index]}</div>
        </div>
      `).join('')}
    </div>
  </div>`;
}
async function refreshAnalytics(){
  try { ANALYTICS_SUMMARY = (await apiRequest('/analytics')).data; }
  catch (error) { console.warn(error.message || 'Unable to refresh analytics data.'); }
}

function renderSettings(){
  return `
  <div class="toolbar"><div><h2>Settings</h2><div class="desc">Farm profile data, alerts, and operational defaults.</div></div></div>
  <div class="grid cols-2">
    <div class="card">
      <div class="card-head"><h3>Farm profile</h3></div>
      <div class="field"><label>Farm name</label><input id="settingsFarmName" value="${esc(SETTINGS_PROFILE.farmName)}" /></div>
      <div class="field"><label>Timezone</label><input id="settingsTimezone" value="${esc(SETTINGS_PROFILE.timezone)}" /></div>
      <div class="field"><label>Regional currency</label><select id="settingsCurrency"><option ${SETTINGS_PROFILE.regionalCost === 'UGX' ? 'selected' : ''}>UGX</option><option ${SETTINGS_PROFILE.regionalCost === 'USD' ? 'selected' : ''}>USD</option></select></div>
    </div>
    <div class="card">
      <div class="card-head"><h3>Notifications</h3></div>
      <div class="field-row" style="display:flex; align-items:center; justify-content:space-between;">
        <span>Daily alerts</span>
        <input id="settingsAlerts" type="checkbox" ${SETTINGS_PROFILE.alerts ? 'checked' : ''} />
      </div>
      <div class="field-row" style="display:flex; align-items:center; justify-content:space-between;">
        <span>Auto sync</span>
        <input id="settingsAutoSync" type="checkbox" ${SETTINGS_PROFILE.autoSync ? 'checked' : ''} />
      </div>
      <div class="field"><label>Digest cadence</label><select id="settingsNotifications"><option ${SETTINGS_PROFILE.notifications === 'Daily summary' ? 'selected' : ''}>Daily summary</option><option ${SETTINGS_PROFILE.notifications === 'Weekly summary' ? 'selected' : ''}>Weekly summary</option></select></div>
      <button class="btn-primary" style="width:auto;" onclick="saveSettings()">Save settings</button>
    </div>
  </div>`;
}
async function refreshSettings(){
  try { SETTINGS_PROFILE = (await apiRequest('/settings')).data; }
  catch (error) { console.warn(error.message || 'Unable to refresh settings data.'); }
}
async function saveSettings(){
  const farmName = document.getElementById('settingsFarmName').value.trim();
  const timezone = document.getElementById('settingsTimezone').value.trim();
  if(!farmName || !timezone) return showToastLikeMessage('Farm name and timezone are required.');
  const payload = {
    farmName, timezone,
    regionalCost: document.getElementById('settingsCurrency').value,
    alerts: document.getElementById('settingsAlerts').checked,
    autoSync: document.getElementById('settingsAutoSync').checked,
    notifications: document.getElementById('settingsNotifications').value,
  };
  try{
    await apiRequest('/settings', {method:'PUT', body:JSON.stringify(payload)});
    SETTINGS_PROFILE = payload;
    showToastLikeMessage('Settings saved.');
  }catch(error){ showToastLikeMessage(error.message || 'Unable to save settings.'); }
}

function renderPlaceholder(mod){
  const roadmap = {
    facility:'Planned: barn &amp; equipment registry, maintenance scheduling, and downtime alerts tied to Jobs.',
    feed:'Planned: feed inventory, ration planning per herd group, and automatic reorder points.',
    farm:'Planned: field/plot mapping, planting &amp; harvest calendar, yield history.',
    train:'Planned: worker certifications, onboarding checklists, and skills tracking per role.',
    scale:'Planned: weigh-in records for produce and livestock, linked directly to Finance for accurate invoicing.',
    analytics:'Planned: cross-module reporting — production, cost per litre/animal, and labour efficiency in one view.',
    settings:'Planned: farm profile, notification rules, and integration settings.',
  };
  return `
  <div class="toolbar"><div><h2>${mod.label}</h2><div class="desc">This module is on the roadmap and will plug into the same live data as the rest of Farm Manager.</div></div></div>
  <div class="empty-state">
    <div class="icon-badge">${svg(mod.icon,20)}</div>
    <h3>${mod.label} is coming soon</h3>
    <p>There's nothing to show here yet. Once built, this module will connect with Jobs, Time, and Finance the same way the ONE ecosystem is designed — one entry updates everywhere it matters.</p>
    <div class="roadmap">${roadmap[mod.id]||'Planned: full module coming soon.'}</div>
  </div>`;
}

function accessBanner(text){
  return `<div class="access-banner">${svg('info',15)}<span>${text}</span></div>`;
}

/* ---------- DASHBOARD (role aware) ---------- */
function renderDashboard(){
  const r = session.role;
  let stats, chartLabel, chartData, feed;
  const d = DASHBOARD || {};
  const totalLivestock = (d.healthyAnimals!=null || d.animalsUnderWatch!=null)
    ? (Number(d.healthyAnimals||0) + Number(d.animalsUnderWatch||0))
    : ANIMALS.length;
  const underWatch = d.animalsUnderWatch!=null ? Number(d.animalsUnderWatch) : ANIMALS.filter(a=>a.status==='Under watch').length;
  const openJobsCount = d.openJobs!=null ? Number(d.openJobs) : JOBS.filter(j=>j.status==='open').length;
  const activeStaffCount = d.activeStaff!=null ? Number(d.activeStaff) : STAFF.filter(s=>s.status==='Active').length;
  const incomeVal = d.income!=null ? Number(d.income) : sumByType('Income');
  const expenseVal = d.expenses!=null ? Number(d.expenses) : Math.abs(sumByType('Expense'));

  if(r==='admin'){
    stats = [
      {label:'Total livestock', val:String(totalLivestock), icon:'animal', delta:underWatch+' under watch', dir:'flat'},
      {label:'Open jobs', val:openJobsCount, icon:'jobs', delta:'Across the farm', dir:'flat'},
      {label:'Staff active', val:activeStaffCount, icon:'people', delta:'On shift', dir:'flat'},
      {label:'Net this month', val:formatUGX(incomeVal - expenseVal), icon:'finance', delta:(incomeVal-expenseVal)>=0?'Positive':'Negative', dir:(incomeVal-expenseVal)>=0?'up':'down'},
    ];
  } else if(r==='manager'){
    stats = [
      {label:'Open jobs', val:openJobsCount, icon:'jobs', delta:'Across the farm', dir:'flat'},
      {label:'Livestock under watch', val:underWatch, icon:'animal', delta:'Review needed', dir:'down'},
      {label:'Staff on shift', val:activeStaffCount, icon:'people', delta:'Active now', dir:'flat'},
      {label:'Feed stock', val:'Adequate', icon:'feed', delta:'12 days runway', dir:'up'},
    ];
  } else if(r==='accountant'){
    stats = [
      {label:'Income (MTD)', val:formatUGX(incomeVal), icon:'finance', delta:'This month', dir:'up'},
      {label:'Expenses (MTD)', val:formatUGX(expenseVal), icon:'scale', delta:'Feed + payroll', dir:'down'},
      {label:'Net (MTD)', val:formatUGX(incomeVal - expenseVal), icon:'analytics', delta:(incomeVal-expenseVal)>=0?'On target':'Below target', dir:(incomeVal-expenseVal)>=0?'up':'down'},
      {label:'Pending invoices', val:'1', icon:'time', delta:'Due Fri', dir:'flat'},
    ];
  } else {
    stats = [
      {label:'My open tasks', val:JOBS.filter(j=>j.assignee===session.name && j.status==='open').length, icon:'jobs', delta:'1 high priority', dir:'flat'},
      {label:'Hours this week', val:'32.5h', icon:'time', delta:'On track', dir:'up'},
      {label:'Clock status', val:CLOCKED_IN?'Clocked in':'Clocked out', icon:'clockin', delta:CLOCKED_IN?'Since 6:02 AM':'Tap Time to start', dir:'flat'},
      {label:'Animals in my care', val:ANIMALS.length, icon:'animal', delta:'Paddock A · Barn 2', dir:'flat'},
    ];
  }

  chartLabel = r==='accountant' ? 'Income vs expense (last 5 entries)' : 'Jobs completed — last 7 days';
  chartData = r==='accountant'
    ? TRANSACTIONS.slice(0,5).reverse().map(t=>({label:t.date, v:Math.abs(t.amount)/30000}))
    : [4,6,3,7,5,8,6].map((v,i)=>({label:['M','T','W','T','F','S','S'][i], v:v*10}));
  const maxV = Math.max(...chartData.map(d=>d.v));

  feed = recentActivity(r);

  return `
  <div class="grid cols-4" style="margin-bottom:16px;">
    ${stats.map(s=>`
      <div class="stat-card">
        <div class="label">${svg(s.icon,15)} ${s.label}</div>
        <div class="value">${s.val}</div>
        <div class="delta ${s.dir}">${s.delta}</div>
      </div>`).join('')}
  </div>
  <div class="grid cols-2">
    <div class="card">
      <div class="card-head"><h3>${chartLabel}</h3><span class="muted">Live</span></div>
      <div class="bar-chart">
        ${chartData.map(d=>`<div class="bar-col"><div class="bar" style="height:${Math.max(6,(d.v/maxV)*100)}%"></div><div class="bar-label">${esc(d.label)}</div></div>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-head"><h3>Recent activity</h3></div>
      ${feed.map(f=>`
        <div class="list-row">
          <div class="list-icon">${svg(f.icon,15)}</div>
          <div class="list-main"><div class="t">${f.t}</div><div class="s">${f.s}</div></div>
          <span class="tag ${f.tag}">${f.tagText}</span>
        </div>`).join('')}
    </div>
  </div>`;
}
function formatUGX(n){ return 'UGX ' + Math.round(n).toLocaleString(); }
function sumByType(t){ return TRANSACTIONS.filter(x=>x.type===t).reduce((a,b)=>a+b.amount,0); }
function netTotal(){ return TRANSACTIONS.reduce((a,b)=>a+b.amount,0); }
function recentActivity(r){
  const all = [
    {icon:'animal', t:'Weight recorded — UG-0142', s:'Logged by James Otieno · 2h ago', tag:'green', tagText:'Animal', roles:['admin','manager','worker']},
    {icon:'jobs', t:'Vaccination job marked done', s:'Batch 12 calves · 4h ago', tag:'green', tagText:'Jobs', roles:['admin','manager','worker']},
    {icon:'finance', t:'Milk sale recorded', s:'Mukono Dairy Co-op · UGX 2,450,000', tag:'green', tagText:'Finance', roles:['admin','accountant']},
    {icon:'time', t:'James Otieno clocked in', s:'6:02 AM today', tag:'gray', tagText:'Time', roles:['admin','manager','accountant','worker']},
    {icon:'people', t:'Moses Kato marked on leave', s:'Approved by Peter Okello', tag:'warn', tagText:'People', roles:['admin','manager']},
    {icon:'finance', t:'Feed invoice #2291 paid', s:'UGX 860,000 · 2 days ago', tag:'red', tagText:'Expense', roles:['admin','accountant']},
  ];
  return all.filter(a=>a.roles.includes(r)).slice(0,5);
}

/* ---------- JOBS ---------- */
function renderJobs(){
  const canAssign = session.role!=='worker';
  return `
  <div class="toolbar">
    <div><h2>Jobs &amp; Tasks</h2><div class="desc">${canAssign?'Assign and track work across the team.':'Tasks assigned to you.'}</div></div>
  </div>
  ${canAssign?`
  <div class="inline-form">
    <input id="jobTitle" placeholder="New task title" style="min-width:240px;">
    <input id="jobAssignee" placeholder="Assign to (name)">
    <select id="jobPriority"><option value="low">Low priority</option><option value="medium">Medium priority</option><option value="high">High priority</option></select>
    <button id="addJobButton" class="btn-sm primary" onclick="addJob()">${svg('plus',13)} Add task</button>
  </div>`:''}
  <div class="card"><div id="jobsList"></div></div>`;
}
async function refreshJobs(){
  const list = document.getElementById('jobsList');
  if(!list) return;
  list.innerHTML = emptyRow('Loading tasks...');
  try{
    const result = await apiRequest('/jobs');
    JOBS = result.data.map(j=>({...j, assignee:j.assignee||'Unassigned', due:j.dueDate ? new Date(j.dueDate).toLocaleDateString([], {month:'short', day:'numeric'}) : 'Unscheduled'}));
  }catch(error){
    list.innerHTML = emptyRow(error.message || 'Unable to load tasks.');
    return;
  }
  let jobs = JOBS;
  if(session.role==='worker') jobs = jobs.filter(j=>j.assignee===session.name);
  if(jobs.length===0){ list.innerHTML = emptyRow('No tasks assigned to you right now.'); return; }
  list.innerHTML = jobs.map(j=>`
    <div class="list-row">
      <div class="list-icon">${svg('jobs',15)}</div>
      <div class="list-main">
        <div class="t">${esc(j.title)}</div>
        <div class="s">Assigned to ${esc(j.assignee)} · Due ${esc(j.due)}</div>
      </div>
      <span class="tag ${j.priority==='high'?'red':j.priority==='medium'?'warn':'gray'}">${esc(j.priority)}</span>
      ${j.status==='open' ? `<button class="btn-sm" onclick="completeJob(${j.id})">${svg('check',13)} Mark done</button>` : `<span class="tag green">Done</span>`}
    </div>`).join('');
}
let jobRequestInFlight = false;
let jobDraftFingerprint = '';
let jobIdempotencyKey = '';
function setJobRequestBusy(busy){
  const button = document.getElementById('addJobButton');
  if(button){ button.disabled = busy; button.setAttribute('aria-busy', String(busy)); }
}
async function addJob(){
  if(jobRequestInFlight) return;
  const t = document.getElementById('jobTitle').value.trim();
  const a = document.getElementById('jobAssignee').value.trim() || 'Unassigned';
  const p = document.getElementById('jobPriority').value;
  if(!t) return;
  const fingerprint = `${t}\u0000${a}\u0000${p}`;
  if(jobDraftFingerprint !== fingerprint){ jobDraftFingerprint = fingerprint; jobIdempotencyKey = createTransactionIdempotencyKey(); }
  jobRequestInFlight = true;
  setJobRequestBusy(true);
  try{
    await apiRequest('/jobs', {method:'POST', body:JSON.stringify({title:t, assignee:a, priority:p, idempotencyKey:jobIdempotencyKey})});
    document.getElementById('jobTitle').value=''; document.getElementById('jobAssignee').value='';
    jobDraftFingerprint = ''; jobIdempotencyKey = '';
    refreshJobs();
  }catch(error){ showToastLikeMessage(error.message || 'Unable to create task.'); }
  finally{ jobRequestInFlight = false; setJobRequestBusy(false); }
}
async function completeJob(id){
  try{ await apiRequest('/jobs/'+id, {method:'PATCH', body:JSON.stringify({status:'done'})}); refreshJobs(); }
  catch(error){ showToastLikeMessage(error.message || 'Unable to complete task.'); }
}
function emptyRow(text){ return `<div class="list-row"><div class="list-main"><div class="s">${esc(text)}</div></div></div>`; }

/* ---------- ANIMAL ---------- */
function renderAnimal(){
  const canEdit = session.role!=='worker';
  return `
  <div class="toolbar"><div><h2>Animal</h2><div class="desc">Herd records — health, weight, and location.</div></div></div>
  ${!canEdit?accessBanner('You can view and log field updates. Editing herd records is limited to Managers and Admins.'):''}
  ${canEdit?`
  <div class="inline-form">
    <input id="aTag" placeholder="Tag (e.g. UG-0146)" style="width:140px;">
    <input id="aType" placeholder="Type (e.g. Dairy cow)">
    <input id="aBreed" placeholder="Breed">
    <input id="aLoc" placeholder="Location">
    <button class="btn-sm primary" onclick="addAnimal()">${svg('plus',13)} Add record</button>
  </div>`:''}
  <div class="card">
    <table>
      <thead><tr><th>Tag</th><th>Type</th><th>Breed</th><th>Status</th><th>Weight</th><th>Location</th></tr></thead>
      <tbody id="animalRows"></tbody>
    </table>
  </div>`;
}
async function refreshAnimals(){
  const el = document.getElementById('animalRows');
  if(!el) return;
  el.innerHTML = '<tr><td colspan="6">Loading animal records...</td></tr>';
  try{ ANIMALS = (await apiRequest('/animals')).data; }
  catch(error){ el.innerHTML = `<tr><td colspan="6">${esc(error.message)}</td></tr>`; return; }
  el.innerHTML = ANIMALS.map(a=>`
    <tr>
      <td style="font-family:var(--font-mono);color:var(--text-muted);">${esc(a.tag)}</td>
      <td>${esc(a.type)}</td><td>${esc(a.breed)}</td>
      <td><span class="tag ${a.status==='Healthy'?'green':'warn'}">${esc(a.status)}</span></td>
      <td>${esc(a.weight)}</td><td>${esc(a.location)}</td>
    </tr>`).join('');
}
async function addAnimal(){
  const tag = document.getElementById('aTag').value.trim();
  if(!tag) return;
  try{
    await apiRequest('/animals', {method:'POST', body:JSON.stringify({tag, type:document.getElementById('aType').value, breed:document.getElementById('aBreed').value, location:document.getElementById('aLoc').value})});
    ['aTag','aType','aBreed','aLoc'].forEach(id=>document.getElementById(id).value='');
    refreshAnimals();
  }catch(error){ showToastLikeMessage(error.message || 'Unable to add animal.'); }
}

/* ---------- TIME ---------- */
function renderTime(){
  return `
  <div class="toolbar"><div><h2>Time</h2><div class="desc">Clock in/out and view attendance history.</div></div></div>
  <div class="grid cols-2">
    <div class="card">
      <div class="card-head"><h3>Attendance log</h3></div>
      <table>
        <thead><tr><th>Name</th><th>Date</th><th>In</th><th>Out</th><th>Hours</th></tr></thead>
        <tbody id="timeRows"></tbody>
      </table>
    </div>
    <div class="card" style="text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px;">
      ${svg('clockin', 34)}
      <div style="font-family:var(--font-mono); font-size:13px; color:var(--text-muted);" id="clockStatusText">You are clocked out</div>
      <button class="btn-primary" style="width:auto; padding:11px 26px;" id="clockBtn" onclick="toggleClock()">Clock in</button>
    </div>
  </div>`;
}
async function refreshTime(){
  const el = document.getElementById('timeRows');
  if(!el) return;
  try{ TIME_LOG = (await apiRequest('/time-logs')).data; }
  catch(error){ el.innerHTML = `<tr><td colspan="5">${esc(error.message)}</td></tr>`; return; }
  el.innerHTML = TIME_LOG.map(t=>`<tr><td>${esc(t.name)}</td><td>${esc(t.date)}</td><td>${esc(t.in)}</td><td>${esc(t.out)}</td><td>${esc(t.hours)}</td></tr>`).join('');
  const btn = document.getElementById('clockBtn');
  const status = document.getElementById('clockStatusText');
  if(btn){
    btn.textContent = CLOCKED_IN ? 'Clock out' : 'Clock in';
    status.textContent = CLOCKED_IN ? 'You are clocked in since 6:02 AM' : 'You are clocked out';
  }
}
let clockRequestInFlight = false;
let transactionRequestInFlight = false;
let transactionDraftFingerprint = '';
let transactionIdempotencyKey = '';
async function toggleClock(){
  if(clockRequestInFlight) return;
  clockRequestInFlight = true;
  try{ CLOCKED_IN = (await apiRequest('/time-logs/clock', {method:'POST', body: JSON.stringify({action: CLOCKED_IN ? 'clock_out' : 'clock_in'})})).clockedIn; refreshTime(); }
  catch(error){ showToastLikeMessage(error.message || 'Unable to update attendance.'); }
  finally{ clockRequestInFlight = false; }
}

/* ---------- FINANCE (accountant + admin) ---------- */
function renderFinance(){
  return `
  <div class="toolbar"><div><h2>Finance</h2><div class="desc">Income, expenses, and net position.</div></div></div>
  <div class="grid cols-3" style="margin-bottom:16px;">
    <div class="stat-card"><div class="label">${svg('finance',15)} Income (MTD)</div><div class="value">${formatUGX(sumByType('Income'))}</div></div>
    <div class="stat-card"><div class="label">${svg('scale',15)} Expenses (MTD)</div><div class="value">${formatUGX(Math.abs(sumByType('Expense')))}</div></div>
    <div class="stat-card"><div class="label">${svg('analytics',15)} Net (MTD)</div><div class="value">${formatUGX(netTotal())}</div></div>
  </div>
  <div class="inline-form">
    <input id="tDesc" placeholder="Description" style="min-width:220px;">
    <select id="tType"><option value="Income">Income</option><option value="Expense">Expense</option></select>
    <input id="tAmount" type="number" placeholder="Amount (UGX)">
    <button id="recordTransactionButton" class="btn-sm primary" onclick="addTransaction()">${svg('plus',13)} Record entry</button>
  </div>
  <div class="card">
    <table>
      <thead><tr><th>Date</th><th>Description</th><th>Type</th><th>Amount</th></tr></thead>
      <tbody id="finRows"></tbody>
    </table>
  </div>`;
}
async function refreshFinance(){
  const el = document.getElementById('finRows');
  if(!el) return;
  try{ TRANSACTIONS = (await apiRequest('/transactions')).data; }
  catch(error){ el.innerHTML = `<tr><td colspan="4">${esc(error.message)}</td></tr>`; return; }
  el.innerHTML = TRANSACTIONS.map(t=>`
    <tr><td>${esc(t.date)}</td><td>${esc(t.desc)}</td>
    <td><span class="tag ${t.type==='Income'?'green':'red'}">${esc(t.type)}</span></td>
    <td style="font-family:var(--font-mono);">${t.amount<0?'-':''}${formatUGX(Math.abs(t.amount))}</td></tr>`).join('');
}
function createTransactionIdempotencyKey(){
  if(globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  if(!globalThis.crypto?.getRandomValues) throw new Error('Your browser cannot create a secure request key. Refresh and try again.');
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
function setTransactionRequestBusy(busy){
  const button = document.getElementById('recordTransactionButton');
  if(button){ button.disabled = busy; button.setAttribute('aria-busy', String(busy)); }
}
async function addTransaction(){
  if(transactionRequestInFlight) return;
  const desc = document.getElementById('tDesc').value.trim();
  const type = document.getElementById('tType').value;
  let amt = parseFloat(document.getElementById('tAmount').value);
  if(!desc || isNaN(amt)) return;
  const amount = Math.abs(amt);
  const fingerprint = `${desc}\u0000${type}\u0000${amount}`;
  if(transactionDraftFingerprint !== fingerprint){
    transactionDraftFingerprint = fingerprint;
    transactionIdempotencyKey = createTransactionIdempotencyKey();
  }
  transactionRequestInFlight = true;
  setTransactionRequestBusy(true);
  try{
    await apiRequest('/transactions', {method:'POST', body:JSON.stringify({description:desc, type, amount, idempotencyKey:transactionIdempotencyKey})});
    document.getElementById('tDesc').value=''; document.getElementById('tAmount').value='';
    transactionDraftFingerprint = '';
    transactionIdempotencyKey = '';
    refreshFinance();
  }catch(error){ showToastLikeMessage(error.message || 'Unable to record transaction.'); }
  finally{ transactionRequestInFlight = false; setTransactionRequestBusy(false); }
}

/* ---------- PEOPLE (manager + admin) ---------- */
function renderPeople(){
  return `
  <div class="toolbar"><div><h2>People</h2><div class="desc">Staff directory and status.</div></div></div>
  <div class="card">
    <table>
      <thead><tr><th>Name</th><th>Role</th><th>Department</th><th>Status</th></tr></thead>
      <tbody id="staffRows"></tbody>
    </table>
  </div>`;
}
async function refreshStaff(){
  const el = document.getElementById('staffRows');
  if(!el) return;
  try{ STAFF = (await apiRequest('/staff')).data; }
  catch(error){ el.innerHTML = `<tr><td colspan="4">${esc(error.message)}</td></tr>`; return; }
  el.innerHTML = STAFF.map(s=>`<tr><td>${esc(s.name)}</td><td>${esc(s.role)}</td><td>${esc(s.dept)}</td><td><span class="tag ${s.status==='Active'?'green':'warn'}">${esc(s.status)}</span></td></tr>`).join('');
}

/* ---------- CHAT ---------- */
function renderChat(){
  return `
  <div class="toolbar"><div><h2>Chat</h2><div class="desc">Talk to your team without leaving Farm Manager.</div></div></div>
  <div class="card">
    <div class="chat-wrap">
      <div class="chat-channels" id="chatChannels"></div>
      <div class="chat-main">
        <div class="chat-msgs" id="chatMsgs"></div>
        <div class="chat-input">
          <input id="chatInput" placeholder="Message the team..." onkeydown="if(event.key==='Enter')sendChat()">
          <button class="btn-sm primary" onclick="sendChat()">Send</button>
        </div>
      </div>
    </div>
  </div>`;
}
async function refreshChat(){
  const chEl = document.getElementById('chatChannels');
  if(!chEl) return;
  try{
    const channels = (await apiRequest('/chat/channels')).data;
    CHAT_CHANNEL_IDS = Object.fromEntries(channels.map(c=>[c.channelName, c.id]));
    CHAT_CHANNELS = channels.map(c=>c.channelName);
  }catch(error){ chEl.innerHTML = `<div>${esc(error.message)}</div>`; return; }
  if(!CHAT_CHANNELS.includes(activeChannel)) activeChannel = CHAT_CHANNELS[0] || '';
  chEl.innerHTML = CHAT_CHANNELS.map((c, index)=>`<div class="chat-channel ${c===activeChannel?'active':''}" data-channel-index="${index}">${esc(c)}</div>`).join('');
  chEl.querySelectorAll('[data-channel-index]').forEach(channel=>{
    channel.addEventListener('click', ()=>setChannel(CHAT_CHANNELS[Number(channel.dataset.channelIndex)]));
  });
  let msgs = [];
  try{ msgs = (await apiRequest('/chat/channels/'+CHAT_CHANNEL_IDS[activeChannel]+'/messages')).data.map(m=>({...m, from:m.from, me:m.userId===session.id})); }
  catch(error){ document.getElementById('chatMsgs').innerHTML = `<div>${esc(error.message)}</div>`; return; }
  const msgEl = document.getElementById('chatMsgs');
  msgEl.innerHTML = msgs.length ? msgs.map(m=>`
    <div class="msg ${m.me?'me':''}">
      <div class="avatar" style="width:26px;height:26px;font-size:10px;">${esc(initials(m.from))}</div>
      <div><div class="b">${esc(m.text)}</div><div class="meta">${m.me?'You':esc(m.from)} · ${esc(m.time)}</div></div>
    </div>`).join('') : `<div style="color:var(--text-faint); font-size:13px; margin:auto;">No messages yet in ${esc(activeChannel)}. Say hello.</div>`;
  msgEl.scrollTop = msgEl.scrollHeight;
}
function setChannel(c){ activeChannel = c; refreshChat(); }
async function sendChat(){
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if(!text) return;
  try{ await apiRequest('/chat/channels/'+CHAT_CHANNEL_IDS[activeChannel]+'/messages', {method:'POST', body:JSON.stringify({text})}); input.value=''; refreshChat(); }
  catch(error){ showToastLikeMessage(error.message || 'Unable to send message.'); }
}

/* ---------- USERS & ROLES (admin only) ---------- */
function renderUsers(){
  return `
  <div class="toolbar"><div><h2>Users &amp; Roles</h2><div class="desc">Every account and what part of Farm Manager it can reach.</div></div></div>
  <div class="inline-form">
    <input id="uName" placeholder="Full name" style="min-width:180px;">
    <input id="uUser" placeholder="Username">
    <input id="uPass" placeholder="Temporary password">
    <select id="uRole"><option value="worker">Farm Worker</option><option value="manager">Farm Manager</option><option value="accountant">Accountant</option><option value="admin">Administrator</option></select>
    <button class="btn-sm primary" onclick="addUser()">${svg('plus',13)} Create user</button>
  </div>
  <div class="card">
    <table>
      <thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Modules accessible</th><th>Account</th></tr></thead>
      <tbody id="userRows"></tbody>
    </table>
  </div>`;
}
async function refreshUsers(){
  const el = document.getElementById('userRows');
  if(!el) return;
  let directory = [];
  try{ directory = (await apiRequest('/users')).data; }
  catch(error){ el.innerHTML = `<tr><td colspan="5">${esc(error.message)}</td></tr>`; return; }
  el.innerHTML = directory.map(u=>{
    const modCount = MODULES.filter(m=>m.roles.includes(u.role)).length;
    return `<tr><td>${esc(u.name)}</td><td style="font-family:var(--font-mono);color:var(--text-muted);">${esc(u.username)}</td><td><span class="tag green">${esc(ROLE_LABEL[u.role]||u.role)}</span></td><td>${modCount} of ${MODULES.length} modules</td><td><button class="btn-sm" data-reset-user="${Number(u.id)}" data-username="${esc(u.username)}">Reset password</button></td></tr>`;
  }).join('');
  el.querySelectorAll('[data-reset-user]').forEach(button=>button.addEventListener('click', ()=>resetUserPassword(Number(button.dataset.resetUser), button.dataset.username || 'this user')));
}
async function resetUserPassword(userId, username){
  const password = window.prompt(`Enter a temporary password for ${username} (at least 12 characters).`);
  if(password === null) return;
  if(password.length < 12){ showToastLikeMessage('Temporary passwords must be at least 12 characters.'); return; }
  try{
    await apiRequest(`/users/${userId}/reset-password`, {method:'POST', body:JSON.stringify({password})});
    showToastLikeMessage(`Password reset for ${username}. Share it only through a safe private channel.`);
  }catch(error){ showToastLikeMessage(error.message || 'Unable to reset this password.'); }
}
async function addUser(){
  const name = document.getElementById('uName').value.trim();
  const uname = document.getElementById('uUser').value.trim().toLowerCase();
  const pass = document.getElementById('uPass').value;
  const role = document.getElementById('uRole').value;
  if(!name || !uname || !pass) return;
  try{
    await apiRequest('/users', {method:'POST', body:JSON.stringify({name, username:uname, password:pass, role})});
    ['uName','uUser','uPass'].forEach(id=>document.getElementById(id).value='');
    refreshUsers();
  }catch(error){ showToastLikeMessage(error.message || 'Unable to create user.'); }
}

/* ======================================================================
   HUB GRAPHIC (login screen decorative network)
====================================================================== */
(function buildHub(){
  const wrap = document.getElementById('hubGraphic');
  const nodeIcons = ['animal','facility','feed','train','jobs','people','farm','finance','time'];
  const angleStep = 360/ (nodeIcons.length);
  nodeIcons.forEach((icon,i)=>{
    const angle = (angleStep*i - 90) * Math.PI/180;
    const radius = 42; // percent
    const cx = 50 + radius*Math.cos(angle);
    const cy = 50 + radius*Math.sin(angle);
    const node = document.createElement('div');
    node.className='hub-node';
    node.style.left = `calc(${cx}% - 26px)`;
    node.style.top = `calc(${cy}% - 26px)`;
    node.style.animationDelay = (i*0.3)+'s';
    node.innerHTML = svg(icon, 20);
    wrap.appendChild(node);
  });
  const center = document.createElement('div');
  center.className='hub-center';
  center.textContent='FM';
  wrap.appendChild(center);
})();

/* keyboard: Enter submits login */
document.addEventListener('keydown', e=>{
  if(e.key==='Enter'){
    if(document.getElementById('view-login').classList.contains('active')) handleLogin();
  }
});
