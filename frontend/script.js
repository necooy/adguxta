/* ============================================================
   SecureGuard — Frontend Logic
   Vanilla JS: CRUD operations, DOM management, validation, toasts
   ============================================================ */

(() => {
  'use strict';

  // ---- Config ----
  const API_URL = '/api/items';

  // ---- DOM References ----
  const stateLoading = document.getElementById('state-loading');
  const stateError = document.getElementById('state-error');
  const stateEmpty = document.getElementById('state-empty');
  const itemsGrid = document.getElementById('items-grid');
  const errorMessage = document.getElementById('error-message');

  const btnAddItem = document.getElementById('btn-add-item');
  const btnAddFirst = document.getElementById('btn-add-first');
  const btnRetry = document.getElementById('btn-retry');

  // Form modal
  const modalFormOverlay = document.getElementById('modal-form-overlay');
  const modalFormTitle = document.getElementById('modal-form-title');
  const modalFormClose = document.getElementById('modal-form-close');
  const itemForm = document.getElementById('item-form');
  const btnCancelForm = document.getElementById('btn-cancel-form');
  const btnSubmitText = document.getElementById('btn-submit-text');
  const btnSubmitSpinner = document.getElementById('btn-submit-spinner');
  const inputMarca = document.getElementById('input-marca');
  const inputModelo = document.getElementById('input-modelo');
  const inputPreco = document.getElementById('input-preco');
  const inputFoto = document.getElementById('input-foto');
  const formPreview = document.getElementById('form-preview');
  const previewImg = document.getElementById('preview-img');

  // Confirm modal
  const modalConfirmOverlay = document.getElementById('modal-confirm-overlay');
  const modalConfirmClose = document.getElementById('modal-confirm-close');
  const confirmItemName = document.getElementById('confirm-item-name');
  const btnCancelDelete = document.getElementById('btn-cancel-delete');
  const btnConfirmDelete = document.getElementById('btn-confirm-delete');
  const btnDeleteText = document.getElementById('btn-delete-text');
  const btnDeleteSpinner = document.getElementById('btn-delete-spinner');

  const toastContainer = document.getElementById('toast-container');

  // ---- State ----
  let items = [];
  let editingId = null;
  let deletingId = null;

  // ---- Initialize ----
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    bindEvents();
    loadItems();
  }

  // ---- Event Binding ----
  function bindEvents() {
    btnAddItem.addEventListener('click', () => openFormModal());
    btnAddFirst.addEventListener('click', () => openFormModal());
    btnRetry.addEventListener('click', loadItems);

    modalFormClose.addEventListener('click', closeFormModal);
    btnCancelForm.addEventListener('click', closeFormModal);
    modalFormOverlay.addEventListener('click', (e) => {
      if (e.target === modalFormOverlay) closeFormModal();
    });

    modalConfirmClose.addEventListener('click', closeConfirmModal);
    btnCancelDelete.addEventListener('click', closeConfirmModal);
    modalConfirmOverlay.addEventListener('click', (e) => {
      if (e.target === modalConfirmOverlay) closeConfirmModal();
    });

    btnConfirmDelete.addEventListener('click', confirmDelete);
    itemForm.addEventListener('submit', handleFormSubmit);

    // Live image preview
    inputFoto.addEventListener('input', debounce(handleImagePreview, 400));

    // ESC key closes modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!modalFormOverlay.classList.contains('hidden')) closeFormModal();
        if (!modalConfirmOverlay.classList.contains('hidden')) closeConfirmModal();
      }
    });
  }

  // ---- API Functions ----
  async function loadItems() {
    showState('loading');

    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
      items = await res.json();

      if (items.length === 0) {
        showState('empty');
      } else {
        renderItems();
        showState('grid');
      }
    } catch (err) {
      console.error('Erro ao carregar itens:', err);
      errorMessage.textContent = err.message || 'Não foi possível conectar à API.';
      showState('error');
    }
  }

  async function createItem(data) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.message || 'Erro ao criar item.');
    return body;
  }

  async function updateItem(id, data) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.message || 'Erro ao atualizar item.');
    return body;
  }

  async function deleteItem(id) {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    const body = await res.json();
    if (!res.ok) throw new Error(body.message || 'Erro ao excluir item.');
    return body;
  }

  // ---- Rendering ----
  function renderItems() {
    itemsGrid.innerHTML = '';

    items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'item-card';
      card.style.animationDelay = `${index * 0.05}s`;
      card.dataset.id = item._id;

      const priceFormatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(item.preco);

      card.innerHTML = `
        <div class="item-card__image-wrapper">
          ${
            item.foto
              ? `<img class="item-card__image" src="${escapeHtml(item.foto)}" alt="${escapeHtml(item.marca)} ${escapeHtml(item.modelo)}" loading="lazy" onerror="this.parentElement.innerHTML='${placeholderSVG()}'" />`
              : `<div class="item-card__placeholder">${placeholderSVGRaw()}</div>`
          }
        </div>
        <div class="item-card__body">
          <span class="item-card__brand">${escapeHtml(item.marca)}</span>
          <h3 class="item-card__model">${escapeHtml(item.modelo)}</h3>
          <p class="item-card__price">${priceFormatted}</p>
          <div class="item-card__actions">
            <button class="btn btn--edit" data-action="edit" data-id="${item._id}" aria-label="Editar ${escapeHtml(item.modelo)}">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.5 2.5L13.5 4.5M2 14L2.5 11.5L11 3L13 5L4.5 13.5L2 14Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Editar
            </button>
            <button class="btn btn--delete" data-action="delete" data-id="${item._id}" data-name="${escapeHtml(item.marca)} ${escapeHtml(item.modelo)}" aria-label="Excluir ${escapeHtml(item.modelo)}">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4H14M5 4V2.5C5 2.22 5.22 2 5.5 2H10.5C10.78 2 11 2.22 11 2.5V4M6.5 7V11.5M9.5 7V11.5M3.5 4L4.5 13.5C4.5 13.78 4.72 14 5 14H11C11.28 14 11.5 13.78 11.5 13.5L12.5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Excluir
            </button>
          </div>
        </div>
      `;

      itemsGrid.appendChild(card);
    });

    // Delegate click events on cards
    itemsGrid.addEventListener('click', handleCardAction);
  }

  function placeholderSVG() {
    return '<div class=\\"item-card__placeholder\\">' + placeholderSVGRaw().replace(/"/g, '\\"') + '</div>';
  }

  function placeholderSVGRaw() {
    return `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="16" width="40" height="32" rx="3" stroke="#64748B" stroke-width="1.5" opacity="0.4"/>
      <circle cx="24" cy="28" r="4" stroke="#6366F1" stroke-width="1.5" opacity="0.4"/>
      <path d="M12 40L24 32L32 38L44 28L52 36" stroke="#6366F1" stroke-width="1.5" stroke-linecap="round" opacity="0.3"/>
    </svg>`;
  }

  // ---- State Management ----
  function showState(state) {
    stateLoading.classList.add('hidden');
    stateError.classList.add('hidden');
    stateEmpty.classList.add('hidden');
    itemsGrid.classList.add('hidden');

    switch (state) {
      case 'loading':
        stateLoading.classList.remove('hidden');
        break;
      case 'error':
        stateError.classList.remove('hidden');
        break;
      case 'empty':
        stateEmpty.classList.remove('hidden');
        break;
      case 'grid':
        itemsGrid.classList.remove('hidden');
        break;
    }
  }

  // ---- Card Action Handler ----
  function handleCardAction(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === 'edit') {
      const item = items.find((i) => i._id === id);
      if (item) openFormModal(item);
    } else if (action === 'delete') {
      openConfirmModal(id, btn.dataset.name);
    }
  }

  // ---- Form Modal ----
  function openFormModal(item = null) {
    editingId = item ? item._id : null;
    modalFormTitle.textContent = item ? 'Editar Item' : 'Novo Item';
    btnSubmitText.textContent = item ? 'Salvar Alterações' : 'Salvar Item';

    itemForm.reset();
    clearFormErrors();
    formPreview.classList.remove('active');

    if (item) {
      inputMarca.value = item.marca || '';
      inputModelo.value = item.modelo || '';
      inputPreco.value = item.preco || '';
      inputFoto.value = item.foto || '';
      if (item.foto) {
        previewImg.src = item.foto;
        formPreview.classList.add('active');
      }
    }

    modalFormOverlay.classList.remove('hidden');
    inputMarca.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeFormModal() {
    modalFormOverlay.classList.add('hidden');
    editingId = null;
    itemForm.reset();
    clearFormErrors();
    formPreview.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ---- Form Submission ----
  async function handleFormSubmit(e) {
    e.preventDefault();
    clearFormErrors();

    const data = {
      marca: inputMarca.value.trim(),
      modelo: inputModelo.value.trim(),
      preco: inputPreco.value,
      foto: inputFoto.value.trim(),
    };

    // Client-side validation
    let hasError = false;

    if (!data.marca) {
      showFieldError('marca', 'A marca é obrigatória.');
      hasError = true;
    }
    if (!data.modelo) {
      showFieldError('modelo', 'O modelo é obrigatório.');
      hasError = true;
    }
    if (data.preco === '' || data.preco === undefined) {
      showFieldError('preco', 'O preço é obrigatório.');
      hasError = true;
    } else if (isNaN(Number(data.preco)) || Number(data.preco) < 0) {
      showFieldError('preco', 'O preço deve ser um número ≥ 0.');
      hasError = true;
    }
    if (data.foto && !/^https?:\/\/.+\..+/.test(data.foto)) {
      showFieldError('foto', 'URL inválida. Use http:// ou https://');
      hasError = true;
    }

    if (hasError) return;

    data.preco = Number(data.preco);

    setFormLoading(true);

    try {
      if (editingId) {
        await updateItem(editingId, data);
        showToast('Item atualizado com sucesso!', 'success');
      } else {
        await createItem(data);
        showToast('Item criado com sucesso!', 'success');
      }
      closeFormModal();
      await loadItems();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setFormLoading(false);
    }
  }

  function setFormLoading(loading) {
    const btn = document.getElementById('btn-submit-form');
    btn.disabled = loading;
    btnSubmitText.classList.toggle('hidden', loading);
    btnSubmitSpinner.classList.toggle('hidden', !loading);
  }

  // ---- Confirm Modal ----
  function openConfirmModal(id, name) {
    deletingId = id;
    confirmItemName.textContent = name;
    modalConfirmOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeConfirmModal() {
    modalConfirmOverlay.classList.add('hidden');
    deletingId = null;
    document.body.style.overflow = '';
  }

  async function confirmDelete() {
    if (!deletingId) return;

    setDeleteLoading(true);

    try {
      await deleteItem(deletingId);
      showToast('Item excluído com sucesso!', 'success');
      closeConfirmModal();
      await loadItems();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleteLoading(false);
    }
  }

  function setDeleteLoading(loading) {
    btnConfirmDelete.disabled = loading;
    btnDeleteText.classList.toggle('hidden', loading);
    btnDeleteSpinner.classList.toggle('hidden', !loading);
  }

  // ---- Image Preview ----
  function handleImagePreview() {
    const url = inputFoto.value.trim();
    if (url && /^https?:\/\/.+\..+/.test(url)) {
      previewImg.src = url;
      previewImg.onload = () => formPreview.classList.add('active');
      previewImg.onerror = () => formPreview.classList.remove('active');
    } else {
      formPreview.classList.remove('active');
    }
  }

  // ---- Form Validation Helpers ----
  function showFieldError(field, message) {
    const errorEl = document.getElementById(`error-${field}`);
    const inputEl = document.getElementById(`input-${field}`);
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.classList.add('invalid');
  }

  function clearFormErrors() {
    document.querySelectorAll('.form-error').forEach((el) => (el.textContent = ''));
    document.querySelectorAll('.form-input').forEach((el) => el.classList.remove('invalid'));
  }

  // ---- Toast Notifications ----
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    const iconMap = {
      success: `<svg class="toast__icon" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#22C55E" stroke-width="2"/><path d="M8 12L11 15L16 9" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      error: `<svg class="toast__icon" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#EF4444" stroke-width="2"/><path d="M12 8V12M12 16H12.01" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/></svg>`,
      warning: `<svg class="toast__icon" viewBox="0 0 24 24" fill="none"><path d="M12 2L22 20H2L12 2Z" stroke="#F59E0B" stroke-width="2"/><path d="M12 10V14M12 17H12.01" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/></svg>`,
    };

    toast.innerHTML = `
      ${iconMap[type] || iconMap.success}
      <span class="toast__message">${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 3200);
  }

  // ---- Utilities ----
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
})();
