const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle')!;
const nav = document.querySelector<HTMLElement>('#main-nav')!;
toggle.hidden = false;
document.documentElement.classList.add('js');
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
nav
  .querySelectorAll('a')
  .forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (
    event.key === 'Escape' &&
    toggle.getAttribute('aria-expanded') === 'true'
  ) {
    closeMenu();
    toggle.focus();
  }
});
document.addEventListener('click', (event) => {
  if (
    event.target instanceof Node &&
    !nav.contains(event.target) &&
    !toggle.contains(event.target)
  )
    closeMenu();
});
const filters = document.querySelector<HTMLElement>('.filters')!;
const cards = [...document.querySelectorAll<HTMLElement>('.project-card')];
filters.hidden = false;
function filterWork(value: string) {
  filters
    .querySelectorAll<HTMLButtonElement>('button')
    .forEach((button) =>
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.filter === value),
      ),
    );
  cards.forEach((card) => {
    card.hidden = value !== 'all' && card.dataset.category !== value;
  });
  const count = cards.filter((card) => !card.hidden).length;
  document.querySelector('#work-count')!.textContent =
    `${count} selected project${count === 1 ? '' : 's'}`;
}
filters.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
    'button[data-filter]',
  );
  if (!button) return;
  const value = button.dataset.filter!;
  filterWork(value);
  const url = new URL(location.href);
  value === 'all'
    ? url.searchParams.delete('work')
    : url.searchParams.set('work', value);
  history.pushState(null, '', url);
});
function syncFilter() {
  const value = new URL(location.href).searchParams.get('work') || 'all';
  filterWork(['business', 'product'].includes(value) ? value : 'all');
  const target = cards.find((card) => `#${card.id}` === location.hash);
  if (target?.hidden) filterWork('all');
}
syncFilter();
window.addEventListener('popstate', syncFilter);
window.addEventListener('hashchange', syncFilter);
document.querySelector('#facterly-link')?.addEventListener('click', () => {
  filterWork('all');
  const url = new URL(location.href);
  url.searchParams.delete('work');
  history.replaceState(null, '', url);
});

const form = document.querySelector<HTMLFormElement>('#brief-form')!;
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const brief = `OMNI DEV — PROJECT BRIEF\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nInterest: ${data.get('interest')}\n\n${data.get('message')}\n`;
  const status = document.querySelector<HTMLElement>('#form-status')!;
  const email = form.dataset.email;
  if (email) {
    location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Project enquiry: ${data.get('interest')}`)}&body=${encodeURIComponent(brief)}`;
    status.textContent =
      'Your email draft is ready for your mail app. Please review and send it there; this website has not sent a message.';
  } else {
    const url = URL.createObjectURL(
      new Blob([brief], { type: 'text/plain;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'OmniDev-project-brief.txt';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent =
      'Your brief has been prepared for download. It has not been sent. Contact details are pending configuration.';
  }
});
