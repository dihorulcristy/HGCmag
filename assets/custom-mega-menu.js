/**
 * Custom Mega Menu Logic
 * Parses JSON and builds the 'Categorii de produse' mega menu.
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
    // We aim to find the main nav and append our 'Categorii de produse' item
    const mainNav = document.querySelector('.header__inline-menu ul');
    const mobileNav = document.querySelector('.menu-drawer__menu');

    if (!mainNav) return;

    // Hide existing Catalog link if it exists and find its index
    const listItems = mainNav.querySelectorAll('li');
    let insertIndex = -1;
    listItems.forEach((li, index) => {
       const link = li.querySelector('a, span');
       if (!link) return;
       const text = link.textContent.trim().toLowerCase();
       if (text === 'catalog' || text === 'catalog produse' || text === 'categorii de produse') {
         li.style.display = 'none';
         if (insertIndex === -1) insertIndex = index;
       }
    });

    const megaMenuHTML = this.buildMegaMenuHTML();
    
    // Create the trigger li
    const li = document.createElement('li');
    li.className = 'custom-mega-menu-list-item';
    li.innerHTML = `
      <div class="custom-mega-menu-trigger" aria-expanded="false" aria-haspopup="true">
        <span>Categorii de produse</span>
        <svg aria-hidden="true" focusable="false" class="icon icon-caret" viewBox="0 0 10 6">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor">
        </svg>
        ${megaMenuHTML}
      </div>
    `;

    // Append or insert at the found index
    if (insertIndex !== -1 && listItems[insertIndex]) {
       mainNav.insertBefore(li, listItems[insertIndex]);
    } else {
       mainNav.appendChild(li);
    }

    // Mobile integration
    if (mobileNav) {
      // Hide existing Catalog on mobile
      const mobileLinks = mobileNav.querySelectorAll('.menu-drawer__menu-item');
      mobileLinks.forEach(link => {
         const text = link.textContent.trim().toLowerCase();
         if (text === 'catalog' || text === 'catalog produse' || text === 'categorii de produse') {
           link.closest('li').style.display = 'none';
         }
      });

      const mobileLi = document.createElement('li');
      mobileLi.innerHTML = `
        <details class="menu-drawer__menu-item list-menu__item link link--text focus-inset" id="Details-Mobile-Categorii">
          <summary>Categorii de produse <svg aria-hidden="true" focusable="false" class="icon icon-caret" viewBox="0 0 10 6">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></svg></summary>
          <div class="menu-drawer__inner-submenu">
             ${this.buildMegaMenuHTML(true)}
          </div>
        </details>
      `;
      mobileNav.appendChild(mobileLi);
    }
  }

  buildMegaMenuHTML(isMobile = false) {
    const categories = this.menuData.megamenu || [];
    let html = isMobile ? '<ul class="menu-drawer__menu list-menu" role="list">' : `
      <div class="cm-mega-menu-wrapper">
        <div class="cm-mega-menu-container">
    `;

    categories.forEach(category => {
      const setting = category.setting || {};
      const submenus = category.menus || [];
      const url = this.getURL(setting.url);

      if (isMobile) {
        html += `
          <li>
            <details class="menu-drawer__menu-item list-menu__item link link--text focus-inset">
              <summary>${setting.title || ''}</summary>
              <ul class="menu-drawer__menu list-menu" role="list">
        `;
        submenus.forEach(sub => {
          const subSetting = sub.setting || {};
          const subUrl = this.getURL(subSetting.url);
          html += `
            <li>
              <a href="${subUrl}" class="menu-drawer__menu-item list-menu__item link link--text focus-inset">${subSetting.title || ''}</a>
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
          <div class="cm-category-group">
            <a href="${url}" class="cm-category-title">${setting.title || ''}</a>
            <ul class="cm-subcategory-list">
        `;
        submenus.forEach(sub => {
          const subSetting = sub.setting || {};
          const subUrl = this.getURL(subSetting.url);
          html += `
            <li class="cm-subcategory-item">
              <a href="${subUrl}" class="cm-subcategory-link">${subSetting.title || ''}</a>
            </li>
          `;
        });
        html += `
            </ul>
          </div>
        `;
      }
    });

    html += isMobile ? '</ul>' : `
        </div>
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
    const trigger = document.querySelector('.custom-mega-menu-trigger');
    if (!trigger) return;

    // Desktop hover is handled by CSS, but we can add JS click for mobile
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth < 990) {
        const wrapper = trigger.querySelector('.cm-mega-menu-wrapper');
        wrapper.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', wrapper.classList.contains('is-open'));
      }
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CustomMegaMenu();
});
