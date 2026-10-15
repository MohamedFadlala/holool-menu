(() => {
  document.addEventListener('error', event => {
    if (event.target instanceof HTMLImageElement) event.target.remove();
  }, true);
  document.querySelectorAll('img').forEach(img => {
    if (img.complete && !img.naturalWidth) img.remove();
  });
  const input = document.querySelector('#search');
  if (!input) return;
  const nav = document.querySelector('.categories');
  const clear = document.querySelector('#clear-search');
  let selected = 'all';
  const normalize = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').trim();
  const filter = () => {
    const query = normalize(input.value);
    let total = 0;
    document.querySelectorAll('.menu-category').forEach(category => {
      let matches = 0;
      category.querySelectorAll('.menu-item').forEach(item => {
        item.hidden = !(selected === 'all' || selected === category.dataset.id) || !normalize(item.dataset.search).includes(query);
        if (!item.hidden) matches++;
      });
      category.hidden = matches === 0;
      total += matches;
    });
    document.querySelector('#no-results').hidden = total > 0 || !document.querySelector('.menu-item');
    clear.hidden = !input.value;
  };
  nav.hidden = false;
  nav.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    selected = button.dataset.category;
    nav.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    filter();
  });
  input.addEventListener('input', filter);
  clear.addEventListener('click', () => { input.value = ''; filter(); input.focus(); });
})();
