/**
 * Custom Vertical Mega Menu Logic
 * Built for Hgcmag - Sonitech style
 */
class CustomMegaMenu {
  constructor() {
    this.dataElement = document.getElementById('tmenu-data');
    if (!this.dataElement) return;

    try {
      this.menuData = JSON.parse(this.dataElement.textContent);
      this.init();
    } catch (e) {
      console.error('Failed to parse mega menu data:', e);
    }
  }

  init() {
    this.injectToHeader();
    this.setupEventListeners();
  }

  injectToHeader() {
    const mainNav = document.querySelector('.header__inline-menu ul');
    if (!mainNav) return;

    // Create the 'Toate Produsele' item for the main nav
    const li = document.createElement('li');
    li.className = 'custom-mega-menu-list-item';
    li.innerHTML = `
      <div class="custom-mega-menu-trigger" aria-expanded="false" aria-haspopup="true">
        <span>Toate Produsele</span>
        <svg aria-hidden="true" focusable="false" class="icon icon-caret" viewBox="0 0 10 6">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor">
        </svg>
        ${this.buildVerticalSidebarHTML()}
      </div>
    `;

    // Insert as the FIRST item in the main nav
    mainNav.prepend(li);

    // Mobile integration
    const mobileNav = document.querySelector('.menu-drawer__menu');
    if (mobileNav) {
      const mobileLi = document.createElement('li');
      mobileLi.innerHTML = `
        <details class="menu-drawer__menu-item list-menu__item link link--text focus-inset" id="Details-Mobile-Categorii">
          <summary>Toate Produsele <svg aria-hidden="true" focusable="false" class="icon icon-caret" viewBox="0 0 10 6">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></svg></summary>
          <div class="menu-drawer__inner-submenu">
             ${this.buildMobileMenuHTML()}
          </div>
        </details>
      `;
      mobileNav.prepend(mobileLi);
    }

    // Hide existing Catalog/Categorii links if they exist
    const existingItems = mainNav.querySelectorAll('li');
    existingItems.forEach(item => {
      const text = item.textContent.trim().toLowerCase();
      if (text.includes('catalog') || text.includes('categorii de produse')) {
        item.style.display = 'none';
      }
    });
  }

  buildVerticalSidebarHTML() {
    const categories = this.menuData.megamenu || [];
    let html = `
      <div class="cm-vertical-sidebar">
        <ul class="cm-sidebar-list">
    `;

    categories.forEach(category => {
      const setting = category.setting || {};
      const submenus = category.menus || [];
      const url = this.getURL(setting.url);
      const hasSub = submenus.length > 0;

      html += `
        <li class="cm-sidebar-item">
          <a href="${url}" class="cm-sidebar-link">
            <span>${setting.title || ''}</span>
            ${hasSub ? '<svg class="icon-chevron" viewBox="0 0 10 6" style="transform: rotate(-90deg)"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2"/></svg>' : ''}
          </a>
          ${hasSub ? this.buildFlyoutHTML(category) : ''}
        </li>
      `;
    });

    html += `
        </ul>
      </div>
    `;
    return html;
  }

  buildMobileMenuHTML() {
    const categories = this.menuData.megamenu || [];
    let html = '<ul class="menu-drawer__menu list-menu" role="list">';

    categories.forEach(category => {
      const setting = category.setting || {};
      const submenus = category.menus || [];
      const url = this.getURL(setting.url);
      const hasSub = submenus.length > 0;

      if (hasSub) {
        html += `
          <li>
            <details class="menu-drawer__menu-item list-menu__item link link--text focus-inset">
              <summary>${setting.title}</summary>
              <ul class="menu-drawer__menu list-menu" role="list">
        `;
        submenus.forEach(sub => {
          const subSetting = sub.setting || {};
          const subUrl = this.getURL(subSetting.url);
          html += `
            <li>
              <a href="${subUrl}" class="menu-drawer__menu-item list-menu__item link link--text focus-inset">${subSetting.title}</a>
            </li>
          `;
        });
        html += `
              </ul>
            </details>
          </li>
        `;
      } else {
        html += `
          <li>
            <a href="${url}" class="menu-drawer__menu-item list-menu__item link link--text focus-inset">${setting.title}</a>
          </li>
        `;
      }
    });

    html += '</ul>';
    return html;
  }

  buildFlyoutHTML(category) {
    const submenus = category.menus || [];
    const setting = category.setting || {};
    const url = this.getURL(setting.url);

    let html = `
      <div class="cm-sidebar-flyout">
        <a href="${url}" class="cm-flyout-title">${setting.title}</a>
        <ul class="cm-flyout-list">
    `;

    submenus.forEach(sub => {
      const subSetting = sub.setting || {};
      const subUrl = this.getURL(subSetting.url);
      html += `
        <li class="cm-flyout-item">
          <a href="${subUrl}" class="cm-flyout-link">${subSetting.title}</a>
        </li>
      `;
    });

    html += `
        </ul>
      </div>
    `;
    return html;
  }

  getURL(urlObj) {
    if (!urlObj) return '#';
    if (urlObj.type && urlObj.type.id === 'collection' && urlObj.collection) {
      return `/collections/${urlObj.collection.handle}`;
    }
    if (urlObj.type && urlObj.type.id === 'home') {
      return '/';
    }
    return '#';
  }

  setupEventListeners() {
    // We can add some JS for hover delay or click-to-toggle on mobile here
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CustomMegaMenu();
});
