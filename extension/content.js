/**
 * SENTINEL // PromptShield Chrome Extension - Content Script
 * Extracts visible text, hidden CSS elements, HTML comments, and zero-width steganography from the DOM.
 * Also highlights intercepted injection payloads directly on the live webpage.
 */

// Helper to determine if element is hidden from human view
function isElementHidden(el) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
  const style = window.getComputedStyle(el);
  if (style.display === 'none') return true;
  if (style.visibility === 'hidden') return true;
  if (parseFloat(style.opacity) === 0) return true;
  if (parseFloat(style.fontSize) === 0) return true;

  // White text on white background or transparent text
  if (style.color === 'transparent' || style.color === 'rgba(0, 0, 0, 0)') return true;
  if (
    (style.color === 'rgb(255, 255, 255)' || style.color === '#ffffff') &&
    (style.backgroundColor === 'rgb(255, 255, 255)' || style.backgroundColor === '#ffffff')
  ) {
    return true;
  }

  // Offscreen positioning
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return true;

  return false;
}

// Extract comprehensive DOM payloads (Visible + Hidden + Comments + Metadata)
function extractPagePayloads() {
  const visibleText = document.body ? document.body.innerText : '';
  const hiddenSnippets = [];
  const comments = [];

  // 1. Traverse all DOM elements to find hidden nodes
  const allElements = document.querySelectorAll('body *');
  allElements.forEach((el) => {
    // Avoid script and style tags
    if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'NOSCRIPT') return;

    if (isElementHidden(el)) {
      const txt = (el.innerText || el.textContent || '').trim();
      if (txt.length > 5 && !hiddenSnippets.includes(txt)) {
        hiddenSnippets.push(`[HIDDEN_ELEMENT <${el.tagName.toLowerCase()}>]: ${txt}`);
      }
    }

    // Check for aria-hidden text with suspicious length
    if (el.getAttribute('aria-hidden') === 'true') {
      const ariaTxt = (el.innerText || el.textContent || '').trim();
      if (ariaTxt.length > 10 && !hiddenSnippets.includes(ariaTxt)) {
        hiddenSnippets.push(`[ARIA_HIDDEN]: ${ariaTxt}`);
      }
    }
  });

  // 2. Extract HTML Comments using TreeWalker
  try {
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_COMMENT, null, false);
    let commentNode;
    while ((commentNode = walker.nextNode())) {
      const cVal = commentNode.nodeValue ? commentNode.nodeValue.trim() : '';
      if (cVal.length > 4) {
        comments.push(`<!-- ${cVal} -->`);
      }
    }
  } catch (e) {
    console.warn('[SENTINEL] Could not walk comment nodes:', e);
  }

  // 3. Scan for Zero-Width Steganography in full HTML
  const fullHtml = document.documentElement ? document.documentElement.innerHTML : '';
  const zeroWidthRegex = /[\u200B-\u200D\uFEFF]/;
  if (zeroWidthRegex.test(fullHtml)) {
    // Zero-width characters detected in document!
    hiddenSnippets.push('[STEGANOGRAPHY_DETECTED]: Document contains hidden zero-width unicode characters.');
  }

  return {
    url: window.location.href,
    title: document.title || window.location.hostname,
    content: visibleText.slice(0, 50000), // Cap for high performance
    hidden_snippets: hiddenSnippets.slice(0, 30),
    comments: comments.slice(0, 30)
  };
}

// Highlight malicious nodes on the page
function highlightElements(findings) {
  // Remove prior sentinel highlights
  document.querySelectorAll('.sentinel-threat-highlight').forEach((el) => {
    el.classList.remove('sentinel-threat-highlight');
    const badge = el.querySelector('.sentinel-threat-badge');
    if (badge) badge.remove();
  });

  if (!findings || findings.length === 0) return 0;

  // Inject CSS styles for orange threat highlights once
  if (!document.getElementById('sentinel-style-sheet')) {
    const style = document.createElement('style');
    style.id = 'sentinel-style-sheet';
    style.textContent = `
      @keyframes sentinelPulseOrange {
        0%, 100% { 
          outline-color: #F97316; 
          box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.45); 
        }
        50% { 
          outline-color: #EA580C; 
          box-shadow: 0 0 0 10px rgba(249, 115, 22, 0.25); 
        }
      }
      .sentinel-threat-highlight {
        outline: 3px solid #F97316 !important;
        background-color: #FFEDD5 !important; /* Vibrant light orange marker background */
        color: #9A3412 !important; /* Contrast dark burnt orange text */
        font-size: 13px !important; /* Forces invisible 0px/1px font text to be readable */
        font-weight: 600 !important;
        display: inline-block !important; /* Unhides display:none elements */
        visibility: visible !important;
        opacity: 1 !important;
        animation: sentinelPulseOrange 1.8s infinite ease-in-out !important;
        position: relative !important;
        border-radius: 4px !important;
        padding: 3px 8px !important;
        z-index: 99999 !important;
        text-shadow: none !important;
      }
      .sentinel-threat-badge {
        position: absolute !important;
        top: -24px !important;
        left: 0 !important;
        background: #EA580C !important; /* Deep tactical orange */
        color: #FFFFFF !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        padding: 3px 8px !important;
        border-radius: 4px !important;
        z-index: 2147483647 !important;
        box-shadow: 0 2px 6px rgba(234, 88, 12, 0.35) !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 4px !important;
        pointer-events: none !important;
        white-space: nowrap !important;
      }
    `;
    document.head.appendChild(style);
  }

  let highlightedCount = 0;
  let firstHighlightedEl = null;

  findings.forEach((finding) => {
    let snippet = (finding.snippet || '').trim();
    if (!snippet || snippet.length < 4) return;

    // Clean comment or hidden element prefixes if present
    if (snippet.startsWith('<!--') && snippet.endsWith('-->')) {
      snippet = snippet.slice(4, -3).trim();
    }
    if (snippet.includes(']: ')) {
      snippet = snippet.split(']: ').slice(1).join(']: ').trim();
    }

    const searchSnippet = snippet.slice(0, 40).toLowerCase();

    // Search for element containing this text
    const allEls = document.querySelectorAll('p, div, span, li, td, h1, h2, h3, h4, section, article, footer, header, code, pre');
    for (const el of allEls) {
      if (el.children.length < 4 && el.textContent.toLowerCase().includes(searchSnippet)) {
        el.classList.add('sentinel-threat-highlight');
        if (!el.querySelector('.sentinel-threat-badge')) {
          const badge = document.createElement('div');
          badge.className = 'sentinel-threat-badge';
          badge.textContent = `🛡️ SENTINEL: ${finding.rule.toUpperCase()}`;
          el.appendChild(badge);
        }
        if (!firstHighlightedEl) firstHighlightedEl = el;
        highlightedCount++;
        break;
      }
    }
  });

  // If no specific child element matched, highlight body banner
  if (highlightedCount === 0 && findings.length > 0) {
    let topBanner = document.getElementById('sentinel-top-banner');
    if (!topBanner) {
      topBanner = document.createElement('div');
      topBanner.id = 'sentinel-top-banner';
      topBanner.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%;
        background: #EA580C; color: #FFFFFF; font-weight: bold;
        padding: 10px 16px; font-size: 13px; z-index: 2147483647;
        box-shadow: 0 4px 12px rgba(234,88,12,0.35); text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      `;
      topBanner.innerHTML = `⚠️ <strong>SENTINEL AI Web Shield:</strong> ${findings.length} indirect prompt injection payload(s) detected on this page!`;
      document.body.prepend(topBanner);
    }
  }

  if (firstHighlightedEl) {
    firstHighlightedEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return highlightedCount;
}

// Message Listener from Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extract') {
    const data = extractPagePayloads();
    sendResponse(data);
  } else if (request.action === 'highlight') {
    const count = highlightElements(request.findings);
    sendResponse({ highlighted: count });
  }
  return true;
});
