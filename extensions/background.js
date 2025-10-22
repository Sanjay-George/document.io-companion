chrome.runtime.onInstalled.addListener(() => {
    console.log("[Document.io Companion] Extension installed.");
});

// ---- Web Navigation Logic ----
// Capture documentation-id from URL during any top-level navigation or history updates
function handleUrl(details) {
    if (details.frameId !== 0) return; // only top-level frames
    try {
        const urlObj = new URL(details.url);
        const docId = urlObj.searchParams.get("documentation-id");
        if (docId) {
            chrome.storage.session.set({ docio_documentation_id: docId }, () => {
                console.log(`[Document.io Companion] Stored documentation-id=${docId}`);
            });
        }
    } catch (err) {
        console.warn("[Document.io Companion] Failed parsing URL:", err);
    }
}

// Listen to standard navigations
chrome.webNavigation.onCommitted.addListener(handleUrl);
// Listen for SPA-style history changes (React Router, etc.)
chrome.webNavigation.onHistoryStateUpdated.addListener(handleUrl);

// ---- Message Handling ----
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "GET_DOC_ID") {
        chrome.storage.session.get("docio_documentation_id").then((data) => {
            sendResponse({ documentationId: data.docio_documentation_id || null });
        });
        return true; // keep channel open
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
    console.log(`[Document.io Companion] Background fetching: ${url}`);
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
}