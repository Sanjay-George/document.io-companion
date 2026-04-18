const input = document.getElementById("host");
const saveBtn = document.getElementById("save");
const statusEl = document.getElementById("status");

// Load the current host on open
chrome.runtime.sendMessage({ type: "GET_API_HOST" }, (res) => {
    if (res?.host) input.value = res.host;
});

saveBtn.addEventListener("click", () => {
    const host = input.value.trim().replace(/\/+$/, "");
    if (!host) {
        statusEl.textContent = "Please enter a valid URL.";
        statusEl.style.color = "#ef4444";
        return;
    }
    chrome.runtime.sendMessage({ type: "SET_API_HOST", host }, () => {
        statusEl.textContent = "Saved!";
        statusEl.style.color = "#22c55e";
        setTimeout(() => { statusEl.textContent = ""; }, 2500);
    });
});