/**
 * TechGear Electronics Spec Comparison Controller
 */
(function () {
  const STORAGE_KEY = 'techgear_compare_products';
  const MAX_COMPARE = 3;

  function getCompareList() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function setCompareList(list) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_COMPARE)));
    document.dispatchEvent(new CustomEvent('compare:updated', { detail: { list } }));
  }

  function toggleCompareProduct(productData) {
    let list = getCompareList();
    const existingIndex = list.findIndex(item => item.id === productData.id);

    if (existingIndex > -1) {
      list.splice(existingIndex, 1);
    } else {
      if (list.length >= MAX_COMPARE) {
        alert(`You can compare up to ${MAX_COMPARE} products simultaneously.`);
        return;
      }
      list.push(productData);
    }

    setCompareList(list);
    renderMatrix();
    openDrawer();
  }

  function openDrawer() {
    const drawer = document.getElementById('SpecComparisonDrawer');
    if (drawer) {
      drawer.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }
  }

  function closeDrawer() {
    const drawer = document.getElementById('SpecComparisonDrawer');
    if (drawer) {
      drawer.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }

  function renderMatrix() {
    const matrix = document.getElementById('SpecComparisonMatrix');
    if (!matrix) return;

    const list = getCompareList();

    if (list.length === 0) {
      matrix.innerHTML = `
        <div class="col-span-full py-16 text-center text-slate-400">
          <p class="text-base font-semibold text-slate-200">No products added for comparison yet.</p>
          <p class="text-xs text-slate-500 mt-1">Click "Add to Compare" on any product page to compare hardware specs side-by-side.</p>
        </div>
      `;
      return;
    }

    matrix.innerHTML = list.map(item => `
      <div class="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-lg relative">
        <button type="button" class="remove-compare-btn absolute top-3 right-3 text-slate-500 hover:text-red-400 text-xs p-1" data-id="${item.id}">
          ✕ Remove
        </button>
        <div>
          <img src="${item.image || ''}" class="w-full h-40 object-contain rounded-lg mb-4 bg-slate-900 p-2" alt="${item.title}">
          <h4 class="font-bold text-sm text-slate-100 line-clamp-2">${item.title}</h4>
          <p class="text-blue-400 font-bold text-base mt-2">${item.price}</p>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-800 text-xs space-y-3">
          <div class="flex justify-between">
            <span class="text-slate-400 font-medium">Battery:</span>
            <span class="text-slate-200 font-semibold">${item.battery || 'N/A'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400 font-medium">Connectivity:</span>
            <span class="text-slate-200 font-semibold">${item.connectivity || 'N/A'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400 font-medium">ANC Support:</span>
            <span class="text-slate-200 font-semibold">${item.anc || 'N/A'}</span>
          </div>
        </div>

        <a href="${item.url}" class="mt-6 block w-full text-center py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors">
          View Product
        </a>
      </div>
    `).join('');

    // Attach remove event listeners
    matrix.querySelectorAll('.remove-compare-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        let list = getCompareList().filter(item => item.id !== id);
        setCompareList(list);
        renderMatrix();
      });
    });
  }

  // Global Event Binding
  document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('CloseSpecComparisonBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    const clearBtn = document.getElementById('ClearSpecComparisonBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        setCompareList([]);
        renderMatrix();
      });
    }

    renderMatrix();
  });

  window.TechGearCompare = { toggle: toggleCompareProduct, open: openDrawer, close: closeDrawer };
})();
