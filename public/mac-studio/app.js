const rates={64:1.33,96:2,256:3.5,512:7};
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2}).format(n);
let billing='hourly';
function renderPlans(){document.querySelector('#plans').innerHTML=Object.entries(rates).map(([ram,rate])=>`<article class="plan ${ram==='256'?'featured':''}"><div class="plan-top">${ram==='256'?'<span class="plan-badge">ROOM TO EXPLORE</span>':`<span class="plan-code">MAC STUDIO / ${ram}</span>`}</div><h3>${ram}<span> GB</span><span class="sr-only"> Mac Studio M5 Ultra rental</span></h3><p class="plan-sub">M5 Ultra · Unified memory</p><div class="price">${money(billing==='monthly'?rate*730*.85:rate)}<span>/${billing==='monthly'?'mo':'hr'}</span></div><p class="price-secondary">${billing==='monthly'?`${money(rate)}/hr on demand`:`${money(rate*730*.85)}/month · save 15%`}</p><ul><li>Dedicated Apple silicon</li><li>4TB SSD or larger, by quote</li><li>SSH access</li><li>${ram==='64'?'Provisional price · confirm by quote':'Hourly or monthly rental'}</li></ul><button class="button ${ram==='256'?'':'ghost'}" data-plan="${ram}">Request ${ram}GB <span>↗</span></button></article>`).join('');document.querySelectorAll('[data-plan]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#request-config').value=b.dataset.plan==='64'?'64GB (provisional rate)':b.dataset.plan+'GB';document.querySelector('[name="period"]').selectedIndex=billing==='monthly'?1:0;document.querySelector('#request').scrollIntoView({behavior:'smooth'});}));}
document.querySelectorAll('[data-billing]').forEach(b=>b.addEventListener('click',()=>{billing=b.dataset.billing;document.querySelectorAll('[data-billing]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});renderPlans();}));
function calculate(){const rate=rates[document.querySelector('#memory').value],hours=Number(document.querySelector('#hours').value),month=rate*730*.85;document.querySelector('#hours-label').textContent=hours+' hours';document.querySelector('#hourly-total').textContent=money(rate*hours);document.querySelector('#monthly-total').textContent=money(month);document.querySelector('#savings-note').textContent=`Save ${money(rate*730-month)} against 730 hourly hours.`;document.querySelector('#recommendation').textContent=rate*hours<month?'For this runtime, hourly pricing has the lower estimated cost.':'For this runtime, the monthly reservation has the lower estimated cost.';}
document.querySelector('#memory').addEventListener('change',calculate);document.querySelector('#hours').addEventListener('input',calculate);
document.querySelector('#theme').addEventListener('click',()=>{const light=document.body.classList.toggle('light');document.querySelector('#theme').setAttribute('aria-label',light?'Switch to dark mode':'Switch to light mode');});
document.querySelector('#copy-ssh').addEventListener('click',async e=>{try{await navigator.clipboard.writeText(document.querySelector('#ssh-command').textContent);e.target.textContent='Copied';}catch{e.target.textContent='Select the command to copy';}});
document.querySelector('#request-form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.currentTarget;
  if (form.dataset.submitting === 'true') return;
  const button = form.querySelector('[type="submit"]');
  const status = document.querySelector('#form-status');
  const values = Object.fromEntries(new FormData(form));
  values.lead_context = window.HoflingsLeadContext?.get() || {};
  form.dataset.submitting = 'true';
  form.setAttribute('aria-busy', 'true');
  button.disabled = true;
  button.textContent = 'Sending…';
  status.textContent = '';
  status.classList.remove('error');
  form.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
  try {
    const response = await fetch('/rental-quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      if (result.fields) {
        for (const name of Object.keys(result.fields)) {
          const field = form.elements.namedItem(name);
          if (field) field.setAttribute('aria-invalid', 'true');
        }
      }
      throw new Error(result.fields ? Object.values(result.fields).join(' ') : result.error || 'We could not send your request. Please try again.');
    }
    window.HoflingsTrackLead?.(result.id, 'rental_quote');
    form.reset();
    status.textContent = 'Your rental request has been received. The Hoflings team will contact you to confirm availability, hardware and pricing.';
    button.textContent = 'Request received ✓';
  } catch (error) {
    status.classList.add('error');
    status.textContent = error instanceof TypeError || error instanceof SyntaxError
      ? 'Connection interrupted. Please try again, or email support@hoflings.com.'
      : error.message;
    button.innerHTML = 'Send rental request <span>↗</span>';
  } finally {
    form.dataset.submitting = 'false';
    form.removeAttribute('aria-busy');
    button.disabled = false;
    status.focus({ preventScroll: true });
  }
});
renderPlans();calculate();
