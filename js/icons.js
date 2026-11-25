/* ==========================================================================
   StrictAI Custom Geometric Vector Icon Library (StrictIcons)
   Zero emojis. Precision 1.75px Swiss architectural stroke icons.
   UMD-compatible: exposes window.StrictIcons & CommonJS module.exports.
   ========================================================================== */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.StrictIcons = factory();
  }
  if (typeof window !== 'undefined' && !window.StrictIcons) {
    window.StrictIcons = root.StrictIcons || factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var ICONS = {
    /* Machined geometric bear-head emblem matching the StrictPass hardware card */
    brandBear:
      '<path d="M5.5 8.5L4 5.5A1.8 1.8 0 0 1 6.8 3.6L9.2 5.4A7.6 7.6 0 0 1 14.8 5.4L17.2 3.6A1.8 1.8 0 0 1 20 5.5L18.5 8.5L20 12.2L17.4 17.8L14.2 20H9.8L6.6 17.8L4 12.2Z"/>' +
      '<path d="M8.5 11.2H9.6M14.4 11.2H15.5"/>' +
      '<path d="M9.6 14.6L12 13.3L14.4 14.6L13.5 17H10.5Z"/>' +
      '<path d="M12 15.6V17"/>',

    sun:
      '<circle cx="12" cy="12" r="4"/>' +
      '<path d="M12 2V4.2M12 19.8V22M4.93 4.93L6.49 6.49M17.51 17.51L19.07 19.07M2 12H4.2M19.8 12H22M4.93 19.07L6.49 17.51M17.51 6.49L19.07 4.93"/>',

    moon:
      '<path d="M20.4 14.6A8.5 8.5 0 0 1 9.4 3.6A8.5 8.5 0 1 0 20.4 14.6Z"/>',

    globe:
      '<circle cx="12" cy="12" r="9.25"/>' +
      '<path d="M2.75 12H21.25"/>' +
      '<path d="M12 2.75A13.5 13.5 0 0 1 15.6 12A13.5 13.5 0 0 1 12 21.25A13.5 13.5 0 0 1 8.4 12A13.5 13.5 0 0 1 12 2.75Z"/>',

    shield:
      '<path d="M12 2.75L4.5 5.8V11.6C4.5 16.4 7.7 20.2 12 21.5C16.3 20.2 19.5 16.4 19.5 11.6V5.8L12 2.75Z"/>',

    shieldCheck:
      '<path d="M12 2.75L4.5 5.8V11.6C4.5 16.4 7.7 20.2 12 21.5C16.3 20.2 19.5 16.4 19.5 11.6V5.8L12 2.75Z"/>' +
      '<path d="M8.8 12.2L11 14.4L15.4 9.8"/>',

    radar:
      '<circle cx="12" cy="12" r="9.25"/>' +
      '<circle cx="12" cy="12" r="5"/>' +
      '<path d="M12 12L17.8 6.2"/>' +
      '<circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/>',

    creditCard:
      '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/>' +
      '<path d="M2.5 9.5H21.5"/>' +
      '<path d="M6.5 14.5H10.5"/>',

    users:
      '<circle cx="9" cy="8.5" r="3.2"/>' +
      '<path d="M3 19.5C3.4 16.4 5.9 14.5 9 14.5C12.1 14.5 14.6 16.4 15 19.5"/>' +
      '<circle cx="16.4" cy="9.2" r="2.5"/>' +
      '<path d="M16.5 14.5C18.9 14.7 20.6 16.5 21 19.5"/>',

    user:
      '<circle cx="12" cy="8.25" r="3.5"/>' +
      '<path d="M4.75 19.75C5.4 16.2 8.3 14.25 12 14.25C15.7 14.25 18.6 16.2 19.25 19.75"/>',

    userCheck:
      '<circle cx="9.5" cy="8.25" r="3.5"/>' +
      '<path d="M3 19.75C3.6 16.3 6.2 14.25 9.5 14.25C12.8 14.25 15.4 16.3 16 19.75"/>' +
      '<path d="M16.5 11.5L18.2 13.2L21.5 9.6"/>',

    lock:
      '<rect x="4.5" y="10.5" width="15" height="10" rx="2.2"/>' +
      '<path d="M8 10.5V7.5A4 4 0 0 1 16 7.5V10.5"/>' +
      '<circle cx="12" cy="15.5" r="1.1" fill="currentColor" stroke="none"/>',

    unlock:
      '<rect x="4.5" y="10.5" width="15" height="10" rx="2.2"/>' +
      '<path d="M8 10.5V7.5A4 4 0 0 1 15.4 5.4"/>' +
      '<circle cx="12" cy="15.5" r="1.1" fill="currentColor" stroke="none"/>',

    key:
      '<circle cx="7.8" cy="15.2" r="3.8"/>' +
      '<path d="M10.6 12.6L19.5 4.5"/>' +
      '<path d="M16.5 7.2L19 9.7"/>' +
      '<path d="M19.5 4.5L21 6"/>',

    clock:
      '<circle cx="12" cy="12" r="9.25"/>' +
      '<path d="M12 7V12.2L15.4 14.2"/>',

    timer:
      '<path d="M9.5 2.75H14.5"/>' +
      '<path d="M12 2.75V5.25"/>' +
      '<circle cx="12" cy="13.25" r="8"/>' +
      '<path d="M12 13.25L15.2 10"/>',

    /* Clean geometric streak vector mark */
    flame:
      '<path d="M12.6 2.8C13.1 6.4 17.5 8.6 17.5 13.6A5.5 5.5 0 0 1 6.5 13.6C6.5 10.7 8.1 8.4 9.7 6.8C9.8 8.9 11 10 12 10.3C11.3 8.1 11.4 5.2 12.6 2.8Z"/>' +
      '<path d="M10.2 15.8A2.2 2.2 0 0 0 14.2 14.6C14.2 13.3 13.2 12.4 12.3 11.7C11.4 12.8 10.2 13.8 10.2 15.8Z"/>',

    /* Socratic precision node mark */
    spark:
      '<path d="M12 3V7.2M12 16.8V21M3 12H7.2M16.8 12H21"/>' +
      '<path d="M12 8.2L13.6 10.4L15.8 12L13.6 13.6L12 15.8L10.4 13.6L8.2 12L10.4 10.4Z"/>',

    messageSquare:
      '<path d="M4 5.5A2 2 0 0 1 6 3.5H18A2 2 0 0 1 20 5.5V14.5A2 2 0 0 1 18 16.5H8.5L4 20.5V5.5Z"/>',

    bookOpen:
      '<path d="M3 5.5C3 4.7 3.7 4 4.5 4H9.2C10.8 4 12 5.2 12 6.8V19.5C11.1 18.6 9.9 18 8.5 18H4.5C3.7 18 3 17.3 3 16.5V5.5Z"/>' +
      '<path d="M21 5.5C21 4.7 20.3 4 19.5 4H14.8C13.2 4 12 5.2 12 6.8V19.5C12.9 18.6 14.1 18 15.5 18H19.5C20.3 18 21 17.3 21 16.5V5.5Z"/>',

    graduationCap:
      '<path d="M2.5 9.5L12 5L21.5 9.5L12 14L2.5 9.5Z"/>' +
      '<path d="M6.5 11.4V16.2C6.5 17.6 9 19 12 19C15 19 17.5 17.6 17.5 16.2V11.4"/>' +
      '<path d="M21 10V15.5"/>',

    check:
      '<path d="M5 12.5L9.5 17L19 7.5"/>',

    checkCircle:
      '<circle cx="12" cy="12" r="9.25"/>' +
      '<path d="M8.5 12.2L10.9 14.6L15.7 9.6"/>',

    alertCircle:
      '<circle cx="12" cy="12" r="9.25"/>' +
      '<path d="M12 7.8V12.6"/>' +
      '<circle cx="12" cy="16" r="0.9" fill="currentColor" stroke="none"/>',

    alertTriangle:
      '<path d="M10.6 4.2L3.1 17.5A1.6 1.6 0 0 0 4.5 19.8H19.5A1.6 1.6 0 0 0 20.9 17.5L13.4 4.2A1.6 1.6 0 0 0 10.6 4.2Z"/>' +
      '<path d="M12 9.2V13.4"/>' +
      '<circle cx="12" cy="16.4" r="0.9" fill="currentColor" stroke="none"/>',

    x:
      '<path d="M6 6L18 18M18 6L6 18"/>',

    arrowRight:
      '<path d="M4.5 12H19.5"/>' +
      '<path d="M13.5 6L19.5 12L13.5 18"/>',

    arrowUpRight:
      '<path d="M6.5 17.5L17.5 6.5"/>' +
      '<path d="M8.5 6.5H17.5V15.5"/>',

    arrowLeft:
      '<path d="M19.5 12H4.5"/>' +
      '<path d="M10.5 6L4.5 12L10.5 18"/>',

    chevronRight:
      '<path d="M9 6L15 12L9 18"/>',

    chevronDown:
      '<path d="M6 9L12 15L18 9"/>',

    qrCode:
      '<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1"/>' +
      '<rect x="14" y="3.5" width="6.5" height="6.5" rx="1"/>' +
      '<rect x="3.5" y="14" width="6.5" height="6.5" rx="1"/>' +
      '<path d="M14 14H16.8V16.8H14Z"/>' +
      '<path d="M19.5 14V16.8M14 20.5H17.5M20.5 19.5V20.5"/>',

    smartphone:
      '<rect x="6.5" y="2.75" width="11" height="18.5" rx="2.2"/>' +
      '<path d="M10.5 18.25H13.5"/>',

    download:
      '<path d="M12 3.5V15.2"/>' +
      '<path d="M7.5 11L12 15.5L16.5 11"/>' +
      '<path d="M4.5 17.5V19A1.5 1.5 0 0 0 6 20.5H18A1.5 1.5 0 0 0 19.5 19V17.5"/>',

    share:
      '<circle cx="17.5" cy="5.5" r="2.5"/>' +
      '<circle cx="6.5" cy="12" r="2.5"/>' +
      '<circle cx="17.5" cy="18.5" r="2.5"/>' +
      '<path d="M8.7 10.7L15.3 6.8M8.7 13.3L15.3 17.2"/>',

    copy:
      '<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2"/>' +
      '<path d="M5.5 15.5H4.8A1.8 1.8 0 0 1 3 13.7V4.8A1.8 1.8 0 0 1 4.8 3H13.7A1.8 1.8 0 0 1 15.5 4.8V5.5"/>',

    sliders:
      '<path d="M4 6.5H9M13 6.5H20"/>' +
      '<circle cx="11" cy="6.5" r="2"/>' +
      '<path d="M4 12H15M19 12H20"/>' +
      '<circle cx="17" cy="12" r="2"/>' +
      '<path d="M4 17.5H7M11 17.5H20"/>' +
      '<circle cx="9" cy="17.5" r="2"/>',

    eye:
      '<path d="M2.5 12C4.6 7.8 8 5.75 12 5.75C16 5.75 19.4 7.8 21.5 12C19.4 16.2 16 18.25 12 18.25C8 18.25 4.6 16.2 2.5 12Z"/>' +
      '<circle cx="12" cy="12" r="2.75"/>',

    eyeOff:
      '<path d="M3.5 3.5L20.5 20.5"/>' +
      '<path d="M10.4 5.95A9.4 9.4 0 0 1 12 5.75C16 5.75 19.4 7.8 21.5 12A13.8 13.8 0 0 1 18.1 16.1"/>' +
      '<path d="M14.2 14.2A2.75 2.75 0 0 1 9.8 9.8"/>' +
      '<path d="M6.4 7.6A13.6 13.6 0 0 0 2.5 12C4.6 16.2 8 18.25 12 18.25C13.4 18.25 14.7 18 15.9 17.45"/>',

    bug:
      '<rect x="7.5" y="8" width="9" height="11" rx="4.5"/>' +
      '<path d="M9.5 8V6.5A2.5 2.5 0 0 1 14.5 6.5V8"/>' +
      '<path d="M8.5 4.2L10 5.7M15.5 4.2L14 5.7"/>' +
      '<path d="M4 11H7.5M16.5 11H20M3.5 15H7.5M16.5 15H20M5 18.8L8 16.8M19 18.8L16 16.8"/>',

    cpu:
      '<rect x="6.5" y="6.5" width="11" height="11" rx="1.8"/>' +
      '<rect x="9.8" y="9.8" width="4.4" height="4.4" rx="0.6"/>' +
      '<path d="M9.5 3V6.5M14.5 3V6.5M9.5 17.5V21M14.5 17.5V21M3 9.5H6.5M3 14.5H6.5M17.5 9.5H21M17.5 14.5H21"/>',

    activity:
      '<path d="M2.5 12H6.5L9.2 5.5L14.3 18.5L17.2 12H21.5"/>',

    layers:
      '<path d="M12 3.5L3.5 8L12 12.5L20.5 8L12 3.5Z"/>' +
      '<path d="M3.5 12.2L12 16.7L20.5 12.2"/>' +
      '<path d="M3.5 16.4L12 20.9L20.5 16.4"/>',

    target:
      '<circle cx="12" cy="12" r="9.25"/>' +
      '<circle cx="12" cy="12" r="5"/>' +
      '<circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>',

    plus:
      '<path d="M12 4.5V19.5M4.5 12H19.5"/>',

    trash:
      '<path d="M4.5 6.5H19.5"/>' +
      '<path d="M9 6.5V4.5A1 1 0 0 1 10 3.5H14A1 1 0 0 1 15 4.5V6.5"/>' +
      '<path d="M6.5 6.5L7.4 19A1.5 1.5 0 0 0 8.9 20.5H15.1A1.5 1.5 0 0 0 16.6 19L17.5 6.5"/>' +
      '<path d="M10.2 10.5V16.5M13.8 10.5V16.5"/>',

    play:
      '<path d="M7 5.2L18.5 12L7 18.8V5.2Z"/>',

    pause:
      '<rect x="6.5" y="5" width="3.5" height="14" rx="1"/>' +
      '<rect x="14" y="5" width="3.5" height="14" rx="1"/>',

    refresh:
      '<path d="M20 11A8 8 0 0 0 6.3 6.3L4 8.5"/>' +
      '<path d="M4 4.2V8.5H8.3"/>' +
      '<path d="M4 13A8 8 0 0 0 17.7 17.7L20 15.5"/>' +
      '<path d="M20 19.8V15.5H15.7"/>',

    send:
      '<path d="M20.5 3.5L10.5 13.5"/>' +
      '<path d="M20.5 3.5L14 20.5L10.5 13.5L3.5 10L20.5 3.5Z"/>',

    mail:
      '<rect x="3" y="5" width="18" height="14" rx="2"/>' +
      '<path d="M3.8 6.5L12 12.8L20.2 6.5"/>',

    logOut:
      '<path d="M9.5 4H5.5A2 2 0 0 0 3.5 6V18A2 2 0 0 0 5.5 20H9.5"/>' +
      '<path d="M16 16.5L20.5 12L16 7.5"/>' +
      '<path d="M20.5 12H9.5"/>',

    /* Brand Logos (crisp architectural vector paths) */
    google:
      '<path fill="currentColor" stroke="none" d="M21.35 12.23c0-.72-.06-1.41-.18-2.07H12v3.92h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.19 2.91-7.23ZM12 21.75c2.63 0 4.83-.87 6.44-2.36l-3.14-2.44c-.87.58-1.98.93-3.3.93-2.54 0-4.69-1.71-5.46-4.02H3.3v2.52a9.74 9.74 0 0 0 8.7 5.37ZM6.54 13.86a5.86 5.86 0 0 1 0-3.72V7.62H3.3a9.75 9.75 0 0 0 0 8.76l3.24-2.52ZM12 6.12c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.82 3.21 14.62 2.25 12 2.25a9.74 9.74 0 0 0-8.7 5.37l3.24 2.52C7.31 7.83 9.46 6.12 12 6.12Z"/>',

    apple:
      '<path fill="currentColor" stroke="none" d="M16.36 12.66c-.03-2.64 2.16-3.92 2.26-3.98-1.23-1.8-3.15-2.05-3.83-2.08-1.61-.17-3.18.96-4 .96-.83 0-2.1-.94-3.46-.91-1.77.03-3.41 1.04-4.32 2.63-1.86 3.22-.47 7.98 1.32 10.58.89 1.27 1.94 2.7 3.31 2.65 1.33-.05 1.84-.86 3.46-.86 1.61 0 2.08.86 3.47.83 1.44-.02 2.34-1.28 3.21-2.56 1.02-1.48 1.43-2.92 1.45-2.99-.03-.02-2.84-1.09-2.87-4.28ZM13.73 4.89c.73-.89 1.23-2.12 1.09-3.36-1.06.04-2.36.71-3.12 1.6-.68.78-1.28 2.04-1.12 3.24 1.18.09 2.4-.59 3.15-1.48Z"/>',

    github:
      '<path fill="currentColor" stroke="none" fill-rule="evenodd" clip-rule="evenodd" d="M12 2.5C6.75 2.5 2.5 6.75 2.5 12c0 4.2 2.72 7.76 6.5 9.02.47.09.65-.2.65-.45 0-.22-.01-.97-.01-1.76-2.39.44-3.01-.58-3.2-1.12-.11-.28-.57-1.12-.98-1.35-.33-.18-.81-.62-.01-.63.75-.01 1.29.69 1.47.98.86 1.45 2.24 1.04 2.79.79.09-.62.34-1.04.61-1.28-2.12-.24-4.34-1.06-4.34-4.71 0-1.04.37-1.9.98-2.57-.1-.24-.43-1.22.09-2.54 0 0 .8-.25 2.62.98a9.06 9.06 0 0 1 4.76 0c1.82-1.24 2.62-.98 2.62-.98.52 1.32.19 2.3.09 2.54.61.67.98 1.52.98 2.57 0 3.66-2.23 4.47-4.35 4.71.35.3.65.87.65 1.76 0 1.27-.01 2.3-.01 2.62 0 .25.18.55.65.45A9.5 9.5 0 0 0 21.5 12c0-5.25-4.25-9.5-9.5-9.5Z"/>'
  };

  function escapeAttr(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function svg(name, size, className) {
    var s = typeof size === 'number' && !isNaN(size) && size > 0 ? size : 18;
    var body = ICONS[name];
    if (!body) {
      body = '<rect x="4" y="4" width="16" height="16" rx="2"/>';
    }
    var cls = className ? 'sa-icon ' + String(className).trim() : 'sa-icon';
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      s +
      '" height="' +
      s +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="' +
      escapeAttr(cls) +
      '" aria-hidden="true" focusable="false">' +
      body +
      '</svg>'
    );
  }

  function mountAll(root) {
    if (typeof document === 'undefined') {
      return 0;
    }
    var scope = root || document;
    var nodes = scope.querySelectorAll('[data-icon]');
    var mounted = 0;

    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var name = el.getAttribute('data-icon');
      if (!name) continue;

      var sizeAttr = el.getAttribute('data-size');
      var parsedSize = sizeAttr ? parseInt(sizeAttr, 10) : 18;
      var size = !isNaN(parsedSize) && parsedSize > 0 ? parsedSize : 18;
      var existingClass = el.getAttribute('class') || '';
      var extraClass = el.getAttribute('data-class') || '';
      var combinedClass = [existingClass, extraClass, 'sa-icon-' + name]
        .filter(Boolean)
        .join(' ');

      var wrapper = document.createElement('span');
      wrapper.innerHTML = svg(name, size, combinedClass);
      var svgEl = wrapper.firstElementChild;
      if (!svgEl) continue;

      var ariaLabel = el.getAttribute('aria-label');
      if (ariaLabel) {
        svgEl.removeAttribute('aria-hidden');
        svgEl.setAttribute('role', 'img');
        svgEl.setAttribute('aria-label', ariaLabel);
      }

      if (el.id) {
        svgEl.id = el.id;
      }

      if (el.parentNode) {
        el.parentNode.replaceChild(svgEl, el);
        mounted++;
      }
    }

    return mounted;
  }

  function has(name) {
    return Object.prototype.hasOwnProperty.call(ICONS, name);
  }

  function list() {
    return Object.keys(ICONS);
  }

  return {
    ICONS: ICONS,
    svg: svg,
    mountAll: mountAll,
    has: has,
    list: list
  };
});
