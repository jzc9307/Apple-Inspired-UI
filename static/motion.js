// All interactions in this study are local. No account or provider is contacted.
(() => {
  const find = id => document.getElementById(id);
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let manualReduction = false;
  let toastTimer;
  let closeToastAnimation;
  let activeDialog;

  function reduceMotion() {
    return manualReduction || systemMotion.matches;
  }

  function updateMotion() {
    document.documentElement.dataset.motion = reduceMotion() ? 'reduce' : 'full';
    for (const id of ['motion-switch', 'drawer-motion']) {
      find(id).setAttribute('aria-checked', String(reduceMotion()));
    }
  }

  // A dismiss timer is reset when a new confirmation arrives.
  function toast(message) {
    clearTimeout(toastTimer);
    closeToastAnimation?.cancel();
    const element = find('live-toast');
    find('toast-message').textContent = message;
    element.hidden = false;
    toastTimer = setTimeout(hideToast, 4500);
  }

  async function hideToast() {
    clearTimeout(toastTimer);
    const element = find('live-toast');
    if (element.hidden) return;
    if (!reduceMotion()) {
      closeToastAnimation = element.animate(
        [{opacity: 1}, {opacity: 0, translate: '0 8px'}],
        {duration: 180, easing: 'ease-out'}
      );
      try { await closeToastAnimation.finished; } catch (_) { return; }
    }
    element.hidden = true;
  }

  find('close-toast').addEventListener('click', hideToast);
  document.querySelectorAll('[data-toast]').forEach(button => {
    button.addEventListener('click', () => toast(button.dataset.toast));
  });

  function setFinish(finish) {
    find('product-stage').dataset.finish = finish;
    document.querySelectorAll('.finish').forEach(button => {
      const selected = button.dataset.finish === finish;
      button.setAttribute('aria-checked', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    const select = find('drawer-finish');
    if (select.value !== finish) {
      select.value = finish;
      select.dispatchEvent(new Event('change', {bubbles: true}));
    }
  }

  const finishes = [...document.querySelectorAll('.finish')];
  finishes.forEach((button, index) => {
    button.addEventListener('click', () => setFinish(button.dataset.finish));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? finishes.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + finishes.length) % finishes.length;
      finishes[next].focus();
      setFinish(finishes[next].dataset.finish);
    });
  });
  find('drawer-finish').addEventListener('change', event => setFinish(event.target.value));
  setFinish('blue');

  // One selected tab, one visible panel. Arrow keys follow the tab order.
  const tabs = [...document.querySelectorAll('[role=tab]')];
  function selectTab(tab) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      const panel = find(item.getAttribute('aria-controls'));
      panel.hidden = !selected;
      panel.classList.toggle('is-entering', selected);
    });
    tab.parentElement.style.setProperty('--selected', tabs.indexOf(tab));
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      selectTab(tabs[next]);
      tabs[next].focus();
    });
  });

  document.querySelectorAll('[data-density]').forEach(button => {
    button.addEventListener('click', () => {
      const compact = button.dataset.density === 'compact';
      document.querySelector('.density-control').classList.toggle('is-compact', compact);
      find('spacing-preview').classList.toggle('is-compact', compact);
      document.querySelectorAll('[data-density]').forEach(item => {
        item.setAttribute('aria-pressed', String(item === button));
      });
    });
  });

  find('sound-switch').addEventListener('click', event => {
    const button = event.currentTarget;
    const checked = button.getAttribute('aria-checked') !== 'true';
    button.setAttribute('aria-checked', String(checked));
    find('switch-status').textContent = checked
      ? 'Sound effects are on in this visual demo. No audio plays.' : 'Sound effects are off.';
  });
  for (const id of ['motion-switch', 'drawer-motion']) {
    find(id).addEventListener('click', () => {
      if (systemMotion.matches) {
        toast('Your device asks for reduced motion. This study follows that preference.');
      } else {
        manualReduction = !manualReduction;
      }
      updateMotion();
    });
  }
  systemMotion.addEventListener('change', updateMotion);
  updateMotion();

  find('save-demo').addEventListener('click', event => {
    const button = event.currentTarget;
    const saved = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(saved));
    button.querySelector('.button-label').textContent = saved ? 'Favourite saved' : 'Save your favourite';
    button.querySelector('.button-glyph').textContent = saved ? '✓' : '+';
    button.classList.toggle('is-done', saved);
    toast(saved ? 'That is the button feedback demo. Product saves live in the collection below.' : 'The button is ready to try again.');
  });
  find('save-demo').setAttribute('aria-pressed', 'false');

  find('sync-demo').addEventListener('click', async event => {
    const button = event.currentTarget;
    if (button.disabled) return;
    button.disabled = true;
    button.classList.remove('is-done');
    button.classList.add('is-busy');
    find('sync-orbit').classList.remove('is-done');
    button.querySelector('.button-label').textContent = 'Working…';
    button.querySelector('.button-glyph').textContent = '';
    find('sync-caption').textContent = 'Running a short local simulation…';
    // This delay demonstrates a pending state. It is not a fake provider call.
    await new Promise(resolve => setTimeout(resolve, 1000));
    button.classList.remove('is-busy');
    button.classList.add('is-done');
    find('sync-orbit').classList.add('is-done');
    button.querySelector('.button-label').textContent = 'Done. Try again';
    button.querySelector('.button-glyph').textContent = '✓';
    find('sync-caption').textContent = 'Local action complete. Nothing was sent or uploaded.';
    button.disabled = false;
  });

  function openDialog(id) {
    const dialog = find(id);
    if (activeDialog || dialog.open) return;
    activeDialog = dialog;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }

  async function closeDialog(dialog) {
    if (!dialog.open || dialog.dataset.closing) return;
    dialog.dataset.closing = 'true';
    if (!reduceMotion()) {
      const drawer = dialog.classList.contains('drawer');
      const animation = dialog.animate(
        [{opacity: 1, transform: 'translate(0,0) scale(1)'},
          {opacity: 0, transform: drawer ? 'translateX(30px)' : 'translateY(12px) scale(.98)'}],
        {duration: 200, easing: 'ease-in', fill: 'forwards'}
      );
      try { await animation.finished; } catch (_) { /* Still close if an animation is cancelled. */ }
      dialog.close();
      animation.cancel();
    } else {
      dialog.close();
    }
    delete dialog.dataset.closing;
  }

  document.querySelectorAll('[data-open]').forEach(button => {
    button.addEventListener('click', () => openDialog(button.dataset.open));
  });
  find('open-settings').addEventListener('click', () => openDialog('settings-dialog'));
  document.querySelectorAll('.study-dialog').forEach(dialog => {
    dialog.querySelectorAll('[data-close]').forEach(button => {
      button.addEventListener('click', () => closeDialog(dialog));
    });
    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      closeDialog(dialog);
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog(dialog);
    });
    dialog.addEventListener('close', () => {
      activeDialog = null;
      document.body.style.overflow = '';
    });
  });
  find('dialog-save').addEventListener('click', () => {
    const saved = window.ShelfDemo.saveProduct('p1');
    toast(saved ? 'Cobalt headphones are saved to your shelf on this browser.' : 'Could not save. Browser storage may be full or blocked.');
  });

  function replay() {
    document.body.classList.remove('replay-entrance');
    if (reduceMotion()) return;
    // Restart the entrance only after removing the previous animation class.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.body.classList.add('replay-entrance');
    }));
  }
  find('replay-intro').addEventListener('click', () => {
    find('top').scrollIntoView({behavior: reduceMotion() ? 'instant' : 'smooth'});
    replay();
  });
  replay();
})();
