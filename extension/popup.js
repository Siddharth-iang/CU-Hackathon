/**
 * SENTINEL // PromptShield Chrome Extension - Popup Logic
 * Communicates with the active browser tab, queries the SENTINEL FastAPI backend,
 * and renders real-time threat scores and findings.
 */

const API_BASE = 'http://localhost:8000';
let activeTabId = null;
let currentFindings = [];
let currentSafeText = '';

document.addEventListener('DOMContentLoaded', async () => {
  const pageTitleEl = document.getElementById('pageTitle');
  const pageUrlEl = document.getElementById('pageUrl');
  const apiStatusBadge = document.getElementById('apiStatus');
  const apiStatusText = document.getElementById('apiStatusText');
  const btnScan = document.getElementById('btnScan');
  const btnIcon = document.getElementById('btnIcon');
  const btnText = document.getElementById('btnText');
  const btnSpinner = document.getElementById('btnSpinner');
  const resultsCard = document.getElementById('resultsCard');
  const scoreVal = document.getElementById('scoreVal');
  const statusLabel = document.getElementById('statusLabel');
  const severityPill = document.getElementById('severityPill');
  const findingsList = document.getElementById('findingsList');
  const findingsCount = document.getElementById('findingsCount');
  const btnHighlight = document.getElementById('btnHighlight');
  const btnCopySafe = document.getElementById('btnCopySafe');

  // 1. Resolve Active Tab
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      activeTabId = tab.id;
      pageTitleEl.textContent = tab.title || 'Active Web Page';
      pageUrlEl.textContent = tab.url || '--';
    }
  } catch (err) {
    pageTitleEl.textContent = 'Could not read tab';
    console.error(err);
  }

  // 2. Check Backend API Connectivity
  try {
    const res = await fetch(`${API_BASE}/`, { method: 'GET', cache: 'no-store' });
    if (res.ok) {
      apiStatusBadge.classList.remove('offline');
      apiStatusText.textContent = 'SENTINEL API Online';
    } else {
      throw new Error('API returned non-200');
    }
  } catch (err) {
    apiStatusBadge.classList.add('offline');
    apiStatusText.textContent = 'Backend Offline (port 8000)';
  }

  // 3. Scan Button Click Handler
  btnScan.addEventListener('click', async () => {
    if (!activeTabId) return;

    // Set UI to loading state
    btnScan.disabled = true;
    btnIcon.style.display = 'none';
    btnSpinner.style.display = 'inline-block';
    btnText.textContent = 'Scanning DOM & Elements...';
    resultsCard.style.display = 'none';

    try {
      // Ensure content script is injected
      let extractedData = null;
      try {
        extractedData = await chrome.tabs.sendMessage(activeTabId, { action: 'extract' });
      } catch (injectionErr) {
        // Programmatically inject content.js if not yet loaded
        await chrome.scripting.executeScript({
          target: { tabId: activeTabId },
          files: ['content.js']
        });
        extractedData = await chrome.tabs.sendMessage(activeTabId, { action: 'extract' });
      }

      if (!extractedData) {
        throw new Error('Could not extract page contents. Note: Chrome does not allow extensions on chrome:// URLs.');
      }

      // Send to SENTINEL FastAPI /scan endpoint
      btnText.textContent = 'Evaluating via L1 Firewall...';
      const scanPayload = {
        url: extractedData.url,
        title: extractedData.title,
        content: extractedData.content,
        hidden_snippets: extractedData.hidden_snippets || [],
        comments: extractedData.comments || []
      };

      const response = await fetch(`${API_BASE}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scanPayload)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const scanResult = await response.json();
      currentFindings = scanResult.findings || [];
      currentSafeText = scanResult.safe_text || '';

      // Render Results
      resultsCard.style.display = 'block';
      scoreVal.textContent = scanResult.threat_score;
      statusLabel.textContent = scanResult.status === 'CLEAN' ? '✅ Page Verified Clean' : '⚠️ Injections Quarantined';
      statusLabel.style.color = scanResult.status === 'CLEAN' ? '#059669' : '#DC2626';

      // Update Severity Pill
      severityPill.textContent = scanResult.threat_severity;
      severityPill.className = 'severity-pill';
      if (scanResult.threat_severity === 'CRITICAL') severityPill.classList.add('sev-critical');
      else if (scanResult.threat_severity === 'HIGH') severityPill.classList.add('sev-high');
      else if (scanResult.threat_severity === 'MEDIUM') severityPill.classList.add('sev-medium');
      else severityPill.classList.add('sev-low');

      // Update Findings
      findingsCount.textContent = currentFindings.length;
      findingsList.innerHTML = '';

      if (currentFindings.length === 0) {
        findingsList.innerHTML = `
          <div style="color: #64748B; font-size: 11px; padding: 6px 0;">
            No hidden steganography, delimiter forgeries, or prompt injections found. Safe for AI agent ingestion.
          </div>
        `;
        btnHighlight.style.display = 'none';
      } else {
        btnHighlight.style.display = 'block';
        currentFindings.forEach((f) => {
          const item = document.createElement('div');
          item.className = 'finding-item';
          item.innerHTML = `
            <div class="finding-rule">
              <span>${f.rule.replace(/_/g, ' ').toUpperCase()}</span>
              <span style="color: #64748B; font-weight: 500;">${f.layer || 'firewall'}</span>
            </div>
            <div class="finding-snippet">${escapeHtml(f.snippet || '')}</div>
          `;
          findingsList.appendChild(item);
        });
      }
    } catch (err) {
      alert(`Scan Failed: ${err.message}`);
      console.error(err);
    } finally {
      btnScan.disabled = false;
      btnIcon.style.display = 'inline-block';
      btnSpinner.style.display = 'none';
      btnText.textContent = 'Re-Scan Webpage';
    }
  });

  // 4. Highlight on Page Button
  btnHighlight.addEventListener('click', async () => {
    if (!activeTabId || currentFindings.length === 0) return;
    try {
      const res = await chrome.tabs.sendMessage(activeTabId, {
        action: 'highlight',
        findings: currentFindings
      });
      btnHighlight.textContent = `🟠 Highlighted (${res ? res.highlighted : 0})`;
      setTimeout(() => {
        btnHighlight.textContent = '🟠 Highlight in Orange';
      }, 2000);
    } catch (err) {
      console.error('Could not highlight:', err);
    }
  });

  // 5. Copy Safe Sanitized Text
  btnCopySafe.addEventListener('click', () => {
    if (!currentSafeText) return;
    navigator.clipboard.writeText(currentSafeText).then(() => {
      btnCopySafe.textContent = '✅ Copied to Clipboard!';
      setTimeout(() => {
        btnCopySafe.textContent = '📋 Copy Safe Text';
      }, 2000);
    });
  });

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
