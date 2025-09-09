/** Rover X & Tipsy Ninjas — Internal Portal (no-build static app)
 * Handbook now prefers INLINE HTML content:
 *  - Backend resolveHandbook may return {html} or {url}; we render html inside portal.
 *  - Admin has a blank HTML box as fallback. No Google Docs necessary.
 */

(function () {
  const elApp = document.getElementById("app");

  /* ------------------ Storage helpers ------------------ */
  function qs(key) {
    return new URLSearchParams(location.search).get(key) || "";
  }
  function set(k, v) {
    localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
  }
  function get(k) {
    try {
      const v = localStorage.getItem(k);
      return v && (v[0] === "{" || v[0] === "[") ? JSON.parse(v) : v;
    } catch (_) {
      return null;
    }
  }
  function del(k) {
    localStorage.removeItem(k);
  }

  /* ------------------ API URL wiring ------------------ */
  (function wireApi() {
    const api = qs("api");
    if (api) set("rx_api_url", api);
  })();
  const API = () => get("rx_api_url") || "";

  /* ------------------ Session until midnight ------------------ */
  function setSession(obj) {
    const expiresAt = new Date();
    expiresAt.setHours(23, 59, 59, 999);
    obj.exp = +expiresAt;
    set("rx_session", obj);
  }
  function getSession() {
    const s = get("rx_session");
    if (!s) return null;
    if (Date.now() > (s.exp || 0)) {
      del("rx_session");
      return null;
    }
    return s;
  }
  function signOut() {
    del("rx_session");
    renderSignIn();
  }

  /* ------------------ Branding / Links (local settings) ------------------ */
  const DEFAULTS = {
    logoLeft:
      "https://files.catbox.moe/8c0x7w.png",
    logoRight:
      "https://files.catbox.moe/3j1q2a.png",
    logoSize: 120,

    checkInURL:
      "https://script.google.com/macros/s/AKfycbyxsYKhEGsE4WfK74rkPttiFEPYMEp9PFm88HdxXUSMhc1jhnnqLzk2-KvtbzPw-RsN/exec",
    leaveURL: "https://forms.gle/idkWEa9db5QwUAE3A",
    cvURL:
      "https://docs.google.com/forms/d/18PDSTMt6LP2h6yPpscdZ322-bjrDitKB669WD05ho4I/viewform",

    // NEW: Admin fallback HTML if backend does not provide per-user content
    handbookHTMLFallback: "",   // raw HTML string
    // Optional last-resort URL (won't be used if HTML exists)
    handbookURLFallback: "",
  };
  function getBrand() {
    const cur = get("rx_brand");
    return { ...DEFAULTS, ...(cur || {}) };
  }
  function setBrand(patch) {
    const next = { ...getBrand(), ...(patch || {}) };
    set("rx_brand", next);
    return next;
  }

  /* ------------------ API helper ------------------ */
  async function apiCall(action, body) {
    const api =
      "https://script.google.com/macros/s/AKfycbxarN-MSvr86BA83tPs5iMMO8btTPLjxrllZb_knMTdONXCD36w6veRm92EACgztzaxrQ/exec";
    const r = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, ...body }),
    });
    return r.json();
  }

  /* ------------------ Sanitizer (very small whitelist) ------------------ */
  const ALLOWED_TAGS = new Set([
    "div","p","span","strong","em","b","i","u","br","hr",
    "h1","h2","h3","h4","h5","h6",
    "ul","ol","li",
    "blockquote","pre","code",
    "table","thead","tbody","tr","th","td",
    "a"
  ]);
  const ALLOWED_ATTR = {
    "a": new Set(["href","target","rel"]),
    "*": new Set([]),
  };
  function sanitizeHTML(html) {
    const tpl = document.createElement("template");
    tpl.innerHTML = html || "";
    const walk = (node) => {
      // remove scripts/comments
      if (node.nodeType === 8) { node.remove(); return; }
      if (node.nodeType === 1) {
        const tag = node.tagName.toLowerCase();
        if (!ALLOWED_TAGS.has(tag)) { node.replaceWith(...Array.from(node.childNodes)); return; }
        // strip all on* attributes and non-allowed
        [...node.attributes].forEach(attr => {
          const name = attr.name.toLowerCase();
          if (name.startsWith("on")) node.removeAttribute(attr.name);
          else {
            const allowed = (ALLOWED_ATTR[tag] && ALLOWED_ATTR[tag].has(name)) || (ALLOWED_ATTR["*"].has(name));
            if (!allowed) node.removeAttribute(attr.name);
          }
        });
        // normalize anchors
        if (tag === "a") {
          const href = node.getAttribute("href") || "#";
          if (!/^https?:/i.test(href)) node.setAttribute("href", "#");
          node.setAttribute("target", "_blank");
          node.setAttribute("rel", "noopener noreferrer");
        }
      }
      [...node.childNodes].forEach(walk);
    };
    [...tpl.content.childNodes].forEach(walk);
    return tpl.innerHTML;
  }

  /* ------------------ Views ------------------ */
  function renderSignIn() {
    const brand = getBrand();
    elApp.innerHTML = `
      <div class="center">
        <div class="card" style="width:min(94vw,520px)">
          <div class="brand-logos">
            <img src="${brand.logoLeft}" alt="Rover X" style="width:${brand.logoSize}px;height:auto">
            <img src="${brand.logoRight}" alt="Tipsy Ninjas" style="width:${brand.logoSize}px;height:auto">
          </div>
          <div class="h1" style="text-align:center;margin-top:8px">Rover X & Tipsy Ninjas</div>
          <div class="sub" style="text-align:center">Internal Portal</div>

          <div id="google_btn_wrap" style="display:flex;justify-content:center;margin:16px 0 8px"></div>

          <div class="divider"><span>OR</span></div>

          <button id="guestBtn" class="btn">Continue as Guest (CV Application only)</button>
          <div class="footer">If you see a Google popup, please allow the sign-in window.</div>
        </div>
      </div>
    `;

    document.getElementById("guestBtn").onclick = () => renderGuestCV();
    initGoogleButton();
  }

  function renderGuestCV() {
    const brand = getBrand();
    elApp.innerHTML = `
      <div class="center">
        <div class="card" style="width:min(94vw,520px)">
          <div class="brand-logos">
            <img src="${brand.logoLeft}" alt="" style="width:${brand.logoSize}px">
            <img src="${brand.logoRight}" alt="" style="width:${brand.logoSize}px">
          </div>
          <div class="h2" style="text-align:center">CV Application</div>
          <div class="kv" style="text-align:center;margin-bottom:16px">Guest access only — opens your CV Google Form.</div>

          <div class="row" style="flex-direction:column">
            <a class="btn btn-blue" target="_blank" rel="noopener noreferrer"
               href="${brand.cvURL}">📄 Open CV Form Application</a>
            <button class="btn" id="backSignIn">⬅ Back to Sign-In</button>
            <button class="btn btn-green" id="doneBack">✔ I’ve submitted — Go back</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById("backSignIn").onclick = renderSignIn;
    document.getElementById("doneBack").onclick = renderSignIn;
  }

  function renderDashboard(preferTab) {
    const s = getSession();
    if (!s) return renderSignIn();

    const tabs = s.tabs || { cv: true };
    const canAdmin = !!tabs.admin;
    const hasDaily = !!tabs.dailySale;

    elApp.innerHTML = `
      <div class="container">
        <div class="row" style="justify-content:space-between">
          <div>
            <div class="h1">Internal Portal</div>
            <div class="kv">Signed in as <b>${s.name || s.email || ""}</b> · <span class="tag">${s.role || "-"}</span></div>
          </div>
          <div class="row">
            <button class="btn" id="signOutBtn" style="width:auto">Sign Out</button>
          </div>
        </div>

        <div class="space"></div>

        <div class="tabs" id="tabs">
          ${tabs.checkIn ? `<button class="tab" data-tab="checkin">Check In</button>` : ``}
          ${tabs.leave ? `<button class="tab" data-tab="leave">Leave Form</button>` : ``}
          ${hasDaily ? `<button class="tab" data-tab="dailysale">Daily Sale</button>` : ``}
          <button class="tab" data-tab="handbook">Employee Handbook</button>
          ${canAdmin ? `<button class="tab" data-tab="admin">Admin</button>` : ``}
        </div>

        <div id="panel"></div>
      </div>
    `;

    document.getElementById("signOutBtn").onclick = signOut;

    function openPanel(key) {
      document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
      const btn = document.querySelector(`.tab[data-tab="${key}"]`);
      if (btn) btn.classList.add("active");

      if (key === "checkin") return renderCheckIn();
      if (key === "leave") return renderLeave();
      if (key === "dailysale") return renderDailySale();
      if (key === "handbook") return renderHandbook();
      if (key === "admin") return renderAdmin();
      document.getElementById("panel").innerHTML = "";
    }

    const isOwner = (s.role || "").toLowerCase() === "owner";
    openPanel(isOwner ? (preferTab || "handbook") : "handbook");

    document.querySelectorAll(".tab").forEach((btn) => {
      btn.addEventListener("click", (e) => openPanel(e.currentTarget.getAttribute("data-tab")));
    });
  }

  function renderCheckIn() {
    const s = getSession();
    const brand = getBrand();
    document.getElementById("panel").innerHTML = `
      <div class="card">
        <div class="h2">Check In</div>
        <div class="kv">Signed in as <b>${s.name || s.email}</b></div>
        <div class="space"></div>
        <a class="btn btn-blue" target="_blank" rel="noopener" href="${brand.checkInURL}">↗ Open Attendance</a>
        <div class="kv" style="margin-top:6px">Opens your Google Sheet in a new tab.</div>
      </div>
    `;
  }

  function renderLeave() {
    const brand = getBrand();
    document.getElementById("panel").innerHTML = `
      <div class="card">
        <div class="h2">Leave Form</div>
        <div class="space"></div>
        <a class="btn btn-blue" target="_blank" rel="noopener" href="${brand.leaveURL}">↗ Open Leave Form</a>
      </div>
    `;
  }

  function renderDailySale() {
    const s = getSession();
    const list = s.sheets || [];
    const has = list && list.length > 0;
    document.getElementById("panel").innerHTML = `
      <div class="card">
        <div class="h2">Daily Sale</div>
        ${!has ? `<div class="kv">No linked sheets for your account.</div>` : ""}
        <div class="space"></div>
        <div class="list" id="dsList"></div>
      </div>
    `;
    const el = document.getElementById("dsList");
    list.forEach((it) => {
      const a = document.createElement("a");
      a.className = "item";
      a.href = it.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.innerHTML = `<div><div><b>${it.name}</b></div><div class="meta">${it.url}</div></div><div>↗</div>`;
      el.appendChild(a);
    });
  }

  /* ------------------ Employee Handbook (inline HTML preferred) ------------------ */
  function renderHandbook() {
    const brand = getBrand();
    const s = getSession();

    // Priority: backend HTML → admin fallback HTML → backend URL → admin URL → empty
    const htmlFromBackend = (s && s.handbookHTML) || "";
    const htmlFromAdmin   = brand.handbookHTMLFallback || "";
    const urlFromBackend  = (s && s.handbookURL) || "";
    const urlFromAdmin    = brand.handbookURLFallback || "";

    const html = (htmlFromBackend || htmlFromAdmin || "").trim();
    const url  = (!html ? (urlFromBackend || urlFromAdmin || "").trim() : "");

    let body = "";
    if (html) {
      body = `<div class="handbookContent">${sanitizeHTML(html)}</div>`;
    } else if (url) {
      body = `
        <div class="kv" style="margin-bottom:8px">No inline content provided; showing fallback embed.</div>
        <div class="iframeWrap" style="height:900px">
          <iframe title="Employee Handbook" src="${url}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen frameborder="0" style="width:100%;height:100%;border:0;"></iframe>
        </div>`;
    } else {
      body = `<div class="kv" style="color:#b91c1c">No handbook content configured yet.</div>`;
    }

    document.getElementById("panel").innerHTML = `
      <div class="card">
        <div class="h2">Employee Handbook</div>
        ${body}
      </div>
    `;
  }

  /* ------------------ Admin (includes blank HTML box) ------------------ */
  function renderAdmin() {
    const el = document.getElementById("panel");
    const brand = getBrand();
    el.innerHTML = `
      <div class="card">
        <div class="row" style="justify-content:space-between">
          <div class="h2">Admin — Approvals</div>
          <button class="btn btn-blue" id="refreshBtn">Refresh Pending</button>
        </div>
        <div id="error" class="kv" style="color:#b91c1c"></div>
        <div class="space"></div>
        <div class="list" id="pendingList"><div class="kv">Loading…</div></div>
      </div>

      <div class="space-lg"></div>

      <div class="card">
        <div class="h2">Handbook — Admin Content (HTML)</div>
        <div class="kv">Paste your <b>HTML text page</b> here. This is used only if backend does not return per-user HTML.</div>
        <div class="space"></div>
        <label class="kv">
          Inline HTML (fallback):
          <textarea id="handbookHTMLFallback" class="textarea" rows="12" placeholder="<h2>Welcome</h2><p>...</p>">${brand.handbookHTMLFallback || ""}</textarea>
        </label>

        <div class="space"></div>
        <div class="kv">Optional last-resort URL (only used if HTML is empty):</div>
        <label class="kv">
          Fallback URL:
          <input id="handbookURLFallback" type="url" class="text" value="${brand.handbookURLFallback || ""}" placeholder="https://... (not required)">
        </label>

        <div class="space"></div>
        <div class="row">
          <button class="btn btn-blue" id="saveBrand">Save</button>
          <button class="btn" id="previewBrand">Preview on Sign-In</button>
        </div>
      </div>
    `;

    // Approvals
    document.getElementById("refreshBtn").onclick = loadPending;

    async function loadPending() {
      try {
        document.getElementById("error").textContent = "";
        const res = await apiCall("listPending");
        if (!res.ok) throw new Error(res.error || "Failed to load");
        const rows = res.pending || [];
        const list = document.getElementById("pendingList");
        list.innerHTML = "";
        if (rows.length === 0) {
          list.innerHTML = `<div class="kv">No pending requests.</div>`;
          return;
        }
        rows.forEach((r) => {
          const row = document.createElement("div");
          row.className = "item";
          row.innerHTML = `
            <div>
              <div><b>${r.email}</b></div>
              <div class="meta">${r.name || "(no name)"} • ${r.when || ""}</div>
            </div>
            <div class="row">
              <select class="roleSel">
                <option ${r.role === "Staff" ? "selected" : ""}>Staff</option>
                <option ${r.role === "HR" ? "selected" : ""}>HR</option>
                <option ${r.role === "Manager" ? "selected" : ""}>Manager</option>
                <option ${r.role === "Owner" ? "selected" : ""}>Owner</option>
              </select>
              <button class="btn" data-act="revoke">Revoke</button>
              <button class="btn btn-green" data-act="approve">Approve</button>
            </div>
          `;
          const sel = row.querySelector(".roleSel");
          sel.addEventListener("change", async (e) => {
            await apiCall("setRole", { target: r.email, role: e.target.value });
          });
          row.querySelector('[data-act="revoke"]').addEventListener("click", async () => {
            await apiCall("revoke", { target: r.email });
            await loadPending();
          });
          row.querySelector('[data-act="approve"]').addEventListener("click", async () => {
            await apiCall("approve", { target: r.email });
            await loadPending();
          });
          list.appendChild(row);
        });
      } catch (err) {
        document.getElementById("error").textContent = String(err);
      }
    }
    loadPending();

    document.getElementById("saveBrand").onclick = () => {
      setBrand({
        handbookHTMLFallback: document.getElementById("handbookHTMLFallback").value,
        handbookURLFallback: document.getElementById("handbookURLFallback").value.trim(),
      });
      alert("Saved. Refresh to see everywhere, or Preview.");
    };
    document.getElementById("previewBrand").onclick = renderSignIn;
  }

  /* ------------------ Google Identity Services button ------------------ */
  function initGoogleButton() {
    const cid =
      get("rx_google_client_id") ||
      "790326467841-o52rg342gvi39t7g7ldirhc5inahf802.apps.googleusercontent.com";
    function onLoaded() {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) return;
      window.google.accounts.id.initialize({
        client_id: cid,
        callback: async (resp) => {
          try {
            const res = await apiCall("googleLogin", { id_token: resp.credential });
            if (!res.ok) throw new Error(res.error || "Login failed");

            // Ask backend to resolve handbook. It may return {html} or {url}.
            let handbookURL = "";
            let handbookHTML = "";
            try {
              const h = await apiCall("resolveHandbook", { email: res.email, name: res.name });
              if (h && h.ok) {
                handbookURL  = h.url  || "";
                handbookHTML = h.html || "";
              }
            } catch (_) {}

            setSession({
              email: res.email,
              name: res.name,
              role: res.role,
              status: res.status,
              tabs: res.tabs,
              sheets: res.sheets,
              company: res.company,
              handbookURL,
              handbookHTML,
            });

            if (String(res.status).toLowerCase() !== "approved") {
              renderPending();
              return;
            }

            const isOwner = (res.role || "").toLowerCase() === "owner";
            renderDashboard(isOwner ? undefined : "handbook");
          } catch (err) {
            alert("Google sign-in failed: " + err);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      const mount = document.getElementById("google_btn_wrap");
      if (mount) {
        window.google.accounts.id.renderButton(mount, {
          theme: "filled_black",
          size: "large",
          shape: "pill",
          text: "signin_with",
          logo_alignment: "left",
          width: 320,
        });
      }
    }
    if (window.google && window.google.accounts && window.google.accounts.id) onLoaded();
    else {
      const t = setInterval(() => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
          clearInterval(t);
          onLoaded();
        }
      }, 100);
    }
  }

  function renderPending() {
    const s = getSession();
    elApp.innerHTML = `
      <div class="center">
        <div class="card" style="width:min(94vw,520px)">
          <div class="h2" style="text-align:center">Your account setup is underway</div>
          <div class="kv" style="text-align:center">Signed in as <b>${s.email}</b></div>
          <div class="space"></div>
          <div class="kv" style="text-align:center">You may enter as Guest to access the CV Application while you wait.</div>
          <div class="space"></div>
          <div class="row" style="flex-direction:column">
            <button class="btn" id="backLogin">Back</button>
            <button class="btn btn-blue" id="guestEnter">Enter as Guest (CV only)</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById("backLogin").onclick = renderSignIn;
    document.getElementById("guestEnter").onclick = renderGuestCV;
  }

  /* ------------------ Boot ------------------ */
  const sess = getSession();
  if (sess && String(sess.status || "").toLowerCase() === "approved") {
    const isOwner = (sess.role || "").toLowerCase() === "owner";
    renderDashboard(isOwner ? undefined : "handbook");
  } else {
    renderSignIn();
  }
})();
