const byId = id => document.getElementById(id);
const storageKey = 'shelf-ui-lab.saved.v1';
let savedIds = [];
let savedOnly = false;

// Small original SVG illustrations keep the fictional catalog self-contained.
function productIllustration(kind, id) {
  let drawing;
  if (kind === 'camera') {
    drawing = '<rect x="15" y="32" width="70" height="47" rx="9" fill="#d7dde6"/><path d="M26 32l6-9h22l6 9"/><circle cx="51" cy="56" r="18" fill="#9ca9bc"/><circle cx="51" cy="56" r="11" fill="#e9edf4"/><circle cx="75" cy="41" r="2" fill="#7c8b9e"/>';
  } else if (kind === 'keyboard') {
    drawing = '<rect x="8" y="27" width="84" height="50" rx="7" fill="#dce1e9"/><path d="M17 39h66M17 49h66M17 59h66M33 68h36M24 35v24m13-24v24m13-24v24m13-24v24m13-24v24" stroke="#a0adbf"/>';
  } else if (kind === 'bag') {
    drawing = '<path d="M24 33h52l7 50H17z" fill="#d8d7cd"/><path d="M36 35V23c0-17 28-17 28 0v12"/><path d="M34 34v10m32-10v10M26 73h48" stroke="#a1a499"/>';
  } else if (kind === 'light') {
    drawing = '<path d="M38 19h25l14 30H24z" fill="#d3dce8"/><path d="M50 49v31M30 84h40" stroke-width="4"/><ellipse cx="50" cy="49" rx="26" ry="4" fill="#f5ead3"/>';
  } else if (id === 'p6') {
    drawing = '<rect x="27" y="13" width="46" height="76" rx="18" fill="#cbd9d2"/><circle cx="50" cy="38" r="13" fill="#a8bcb5"/><circle cx="50" cy="68" r="10" fill="#a8bcb5"/><circle cx="50" cy="38" r="6"/><path d="M41 19h18"/>';
  } else {
    drawing = '<path d="M24 58V40a26 26 0 0 1 52 0v18" stroke-width="7"/><rect x="17" y="48" width="18" height="34" rx="9" fill="#b2c2d4"/><rect x="65" y="48" width="18" height="34" rx="9" fill="#b2c2d4"/>';
  }
  return `<svg class="product-illustration" viewBox="0 0 100 100" aria-hidden="true">${drawing}</svg>`;
}

// Read only IDs that still exist in the sample catalog.
try {
  const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(value)) {
    savedIds = value.filter(id => ShelfCatalog.products.some(item => item.id === id));
  }
} catch (_) {
  byId('status').textContent = 'Site storage is unavailable. Browsing still works.';
}

function render() {
  const budget = byId('budget').value;
  const items = ShelfCatalog.visible(ShelfCatalog.products, {
    query: byId('query').value,
    market: byId('market').value,
    maxPrice: budget === '' ? null : Number(budget),
    sort: byId('sort').value,
    savedOnly,
    savedIds,
  });

  byId('heading').textContent = savedOnly ? 'Your saved shelf' : 'The collection';
  byId('savedCount').textContent = savedIds.length;
  byId('count').textContent = `${items.length} of ${ShelfCatalog.products.length} sample items`;
  byId('empty').hidden = items.length > 0;
  byId('catalog').replaceChildren();

  // These cards use fixed sample data, not HTML supplied by a user.
  for (const item of items) {
    const card = document.createElement('article');
    card.className = 'product';
    const isSaved = savedIds.includes(item.id);
    card.innerHTML = `
      <div class="product-art" style="--tone:${item.tone}">
        <small>${item.marketplace}</small>${productIllustration(item.variant_kind, item.id)}
      </div>
      <div class="product-body">
        <h3>${item.title}</h3><p>${item.description}</p>
        <div class="product-bottom">
          <span class="price">RM${item.price}</span>
          <button class="save" data-save="${item.id}" aria-pressed="${isSaved}"
            aria-label="${isSaved ? 'Unsave' : 'Save'} ${item.title}">
            ${isSaved ? '✓ Saved' : '+ Save'}
          </button>
        </div>
      </div>`;
    byId('catalog').appendChild(card);
  }

  for (const [id, active] of [['browse', !savedOnly], ['saved', savedOnly]]) {
    byId(id).classList.toggle('active', active);
    byId(id).setAttribute('aria-pressed', String(active));
  }
}

byId('filters').addEventListener('submit', event => event.preventDefault());
byId('filters').addEventListener('input', render);
// Wait for the browser to reset the field values before drawing again.
byId('filters').addEventListener('reset', () => setTimeout(render, 0));
byId('browse').addEventListener('click', () => {
  savedOnly = false;
  render();
});
byId('saved').addEventListener('click', () => {
  savedOnly = true;
  render();
});

function setSaved(id, saved) {
  if (!ShelfCatalog.products.some(item => item.id === id)) return false;
  const next = saved
    ? [...new Set([...savedIds, id])]
    : savedIds.filter(value => value !== id);
  // Show success only after storage accepts the change.
  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
    savedIds = next;
    byId('status').textContent = next.includes(id)
      ? 'Saved on this browser. Open Saved to find it.'
      : 'Removed from your saved shelf.';
    byId('status').classList.remove('error');
    render();
    return true;
  } catch (_) {
    byId('status').textContent = 'Could not save. Site storage is full or blocked.';
    byId('status').classList.add('error');
    return false;
  }
}

byId('catalog').addEventListener('click', event => {
  const button = event.target.closest('[data-save]');
  if (!button) return;
  const id = button.dataset.save;
  setSaved(id, !savedIds.includes(id));
});

// The product dialog uses this same save path, even if filters hide the card.
window.ShelfDemo = {saveProduct: id => setSaved(id, true)};

render();
