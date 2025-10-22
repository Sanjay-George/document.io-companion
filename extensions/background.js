chrome.runtime.onInstalled.addListener(() => {
    console.log("[Document.io Companion] Extension installed.");
});

// ---- Web Navigation Logic ----
function makeKey(tabId, domain) {
    return `docio_${tabId}_${domain}`;
}

function handleUrl(details) {
    if (details.frameId !== 0) return; // only top-level frames

    try {
        const urlObj = new URL(details.url);
        const domain = urlObj.hostname;
        const docId = urlObj.searchParams.get("documentation-id");

        if (docId) {
            const key = makeKey(details.tabId, domain);

            chrome.storage.session.set({ [key]: docId }, () => {
                console.debug(
                    `[Document.io Companion] [Tab=${details.tabId}] [${domain}] Stored documentation-id=${docId}`
                );
            });
        }
    } catch (err) {
        console.warn("[Document.io Companion] Failed parsing URL:", err);
    }
}

// Listen to navigations
chrome.webNavigation.onCommitted.addListener(handleUrl);
chrome.webNavigation.onHistoryStateUpdated.addListener(handleUrl);

// Cleanup storage on tab close
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    chrome.storage.session.get(null).then((all) => {
        for (const key of Object.keys(all)) {
            if (key.startsWith(`docio_${tabId}_`)) {
                chrome.storage.session.remove(key);
            }
        }
    });
});

// ---- Message Handling ----
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "GET_DOC_ID") {
        // Use sender.tab info
        if (!sender.tab || !sender.tab.id || !sender.tab.url) {
            sendResponse({ documentationId: null });
            return false;
        }

        try {
            const urlObj = new URL(sender.tab.url);
            const key = makeKey(sender.tab.id, urlObj.hostname);

            chrome.storage.session.get(key).then((data) => {
                sendResponse({ documentationId: data[key] || null });
            });
        } catch (err) {
            console.warn("[Document.io Companion] Failed extracting domain:", err);
            sendResponse({ documentationId: null });
        }

        return true; // Keep response channel open
    }

    if (msg.type === "API_FETCH") {
        doFetch(msg.url, msg.options)
            .then((data) => sendResponse({ ok: true, data }))
            .catch((err) => sendResponse({ ok: false, error: err.message }));

        return true; // async response
    }
});

// ---- Fetch Helper ----
async function doFetch(url, options) {
    const base = "http://localhost:5001"; // Base URL for local API
    if (!/^https?:\/\//i.test(url)) url = base + url;
    console.debug(`[Document.io Companion] Background fetching: ${url}`);
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
}