/** Rover X & Tipsy Ninjas — Internal Portal (no-build static app)
 * Google Sign-In kept simple (text/plain requests).
 * Employee Handbook with 2 subtabs (Rover X / Tipsy Ninjas).
 * Admin → “Handbook HTML (Server)” saves HTML to Apps Script Properties.
 * Mapping of who sees which subtab comes from the “Handbook” sheet (Email → Company).
 * DSR links come from the “DSR” sheet.
 */

(function () {
  const elApp = document.getElementById("app");

  /* ------------------ API base (HARD-CODED) ------------------ */
  const API_EXEC = "https://script.google.com/macros/s/AKfycbxarN-MSvr86BA83tPs5iMMO8btTPLjxrllZb_knMTdONXCD36w6veRm92EACgztzaxrQ/exec";


  /* ------------------ Storage helpers ------------------ */
  function set(k, v) { localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v)); }
  function get(k) {
    try { const v = localStorage.getItem(k); return v && (v[0] === "{" || v[0] === "[") ? JSON.parse(v) : v; }
    catch (_) { return null; }
  }
  function del(k) { localStorage.removeItem(k); }

  /* ------------------ API helper (text/plain avoids preflight) ------------------ */
  async function apiCall(action, body) {
    const r = await fetch(API_EXEC, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, ...body }),
    });
    const ct = r.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const t = await r.text().catch(()=>"(no text)");
      throw new Error("API returned non-JSON: " + t.slice(0, 200));
    }
    return r.json();
  }

  /* ------------------ Session until midnight ------------------ */
  function setSession(obj) {
    const expiresAt = new Date(); expiresAt.setHours(23, 59, 59, 999);
    obj.exp = +expiresAt; set("rx_session", obj);
  }
  function getSession() {
    const s = get("rx_session");
    if (!s) return null;
    if (Date.now() > (s.exp || 0)) { del("rx_session"); return null; }
    return s;
  }
  function signOut() { del("rx_session"); renderSignIn(); }

  /* ------------------ Branding / Links (local settings) ------------------ */
  const DEFAULTS = {
    logoLeft:  "https://files.catbox.moe/8c0x7w.png",
    logoRight: "https://files.catbox.moe/3j1q2a.png",
    logoSize: 120,
    checkInURL: "https://script.google.com/macros/s/AKfycbyxsYKhEGsE4WfK74rkPttiFEPYMEp9PFm88HdxXUSMhc1jhnnqLzk2-KvtbzPw-RsN/exec",
    leaveURL:   "https://forms.gle/idkWEa9db5QwUAE3A",
    cvURL:      "https://docs.google.com/forms/d/18PDSTMt6LP2h6yPpscdZ322-bjrDitKB669WD05ho4I/viewform",
    handbookHTML_RoverX_local: "",
    handbookHTML_Ninjas_local: "",
  };
  function getBrand() { const cur = get("rx_brand"); return { ...DEFAULTS, ...(cur || {}) }; }
  function setBrand(patch) { const next = { ...getBrand(), ...(patch || {}) }; set("rx_brand", next); return next; }

  /* ------------------ Minimal sanitizer for handbook HTML ------------------ */
  const ALLOWED_TAGS = new Set([
    "div","p","span","strong","em","b","i","u","br","hr",
    "h1","h2","h3","h4","h5","h6","ul","ol","li","blockquote","pre","code",
    "table","thead","tbody","tr","th","td","a"
  ]);
  const ALLOWED_ATTR = { "a": new Set(["href","target","rel"]), "*": new Set([]) };
  function sanitizeHTML(html) {
    const tpl = document.createElement("template"); tpl.innerHTML = html || "";
    const walk = (node) => {
      if (node.nodeType === 8) { node.remove(); return; }
      if (node.nodeType === 1) {
        const tag = node.tagName.toLowerCase();
        if (!ALLOWED_TAGS.has(tag)) { node.replaceWith(...Array.from(node.childNodes)); return; }
        [...node.attributes].forEach(attr => {
          const name = attr.name.toLowerCase();
          if (name.startsWith("on")) node.removeAttribute(attr.name);
          else {
            const allowed = (ALLOWED_ATTR[tag] && ALLOWED_ATTR[tag].has(name)) || (ALLOWED_ATTR["*"].has(name));
            if (!allowed) node.removeAttribute(attr.name);
          }
        });
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

  /* ------------------ Sign-in & Landing ------------------ */
  function renderSignIn() {
    const brand = getBrand();
    elApp.innerHTML = `
      <div class="center">
        <div class="card" style="width:min(94vw,520px)">
          <div class="brand-logos">
            <img src="${brand.logoLeft}"  alt="Rover X"      style="width:${brand.logoSize}px;height:auto">
            <img src="${brand.logoRight}" alt="Tipsy Ninjas" style="width:${brand.logoSize}px;height:auto">
          </div>
          <div class="h1"  style="text-align:center;margin-top:8px">Rover X & Tipsy Ninjas</div>
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
            <img src="${brand.logoLeft}"  alt="" style="width:${brand.logoSize}px">
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

  /* ------------------ Main Dashboard ------------------ */
  function renderDashboard() {
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
          <div class="row"><button class="btn" id="signOutBtn" style="width:auto">Sign Out</button></div>
        </div>

        <div class="space"></div>

        <div class="tabs">
          ${tabs.checkIn ? `<button class="tab" data-tab="checkin">Check In</button>` : ``}
          ${tabs.leave    ? `<button class="tab" data-tab="leave">Leave Form</button>` : ``}
          ${hasDaily      ? `<button class="tab" data-tab="dailysale">Daily Sale</button>` : ``}
          <button class="tab" data-tab="handbook">Employee Handbook</button>
          ${canAdmin      ? `<button class="tab" data-tab="admin">Admin</button>` : ``}
        </div>

        <div id="panel"></div>
      </div>
    `;

    document.getElementById("signOutBtn").onclick = signOut;

    const first = document.querySelector(".tab[data-tab='handbook']") || document.querySelector(".tab");
    const open = first ? first.getAttribute("data-tab") : null;
    if (open) openPanel(open);

    document.querySelectorAll(".tab").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        openPanel(e.currentTarget.getAttribute("data-tab"));
      });
    });

    function openPanel(key) {
      if (key === "checkin")    return renderCheckIn();
      if (key === "leave")      return renderLeave();
      if (key === "dailysale")  return renderDailySale();
      if (key === "handbook")   return renderHandbook();
      if (key === "admin")      return renderAdmin();
      document.getElementById("panel").innerHTML = "";
    }
  }

  function renderCheckIn() {
    const s = getSession();
    const brand = getBrand();
    document.getElementById("panel").innerHTML = `
      <div class="card">
        <div class="h2">Check In</div>
        <div class="kv">Signed in as <b>${s.name || s.email}</b></div>
        <div class="space"></div>
        <a class="btn btn-blue" target="_blank" rel="noopener" href="${brand.checkInURL}">↗ Check In/Check Out</a>
        <div class="kv" style="margin-top:6px">This opens your existing Google Sheet in a new tab.</div>
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
      a.href = it.url; a.target = "_blank"; a.rel = "noopener";
      a.innerHTML = `<div><div><b>${it.name}</b></div><div class="meta">${it.url}</div></div><div>↗</div>`;
      el.appendChild(a);
    });
  }

  /* ------------------ Employee Handbook (two subtabs) ------------------ */
  function renderHandbook() {
    const brand = getBrand();
    const s = getSession();
    const canAdmin = !!(s.tabs && s.tabs.admin);

    // [{ key:'roverx'|'ninjas'|'fallback', company, html }]
    const hb = s.handbooks || [];
    const hbMap = {}; hb.forEach(x => hbMap[x.key] = x.html || "");

    // Entitlements from backend; Admins can view both tabs regardless
    const entitled = new Set(hb.filter(x => x.key !== 'fallback').map(x => x.key));
    if (canAdmin) { entitled.add('roverx'); entitled.add('ninjas'); }

    const wantsRX = entitled.has('roverx');
    const wantsTN = entitled.has('ninjas');
    const initialKey = wantsRX ? 'roverx' : (wantsTN ? 'ninjas' : (hbMap['fallback'] ? 'fallback' : 'roverx'));

    document.getElementById("panel").innerHTML = `
      <div class="card">
        <div class="h2">Employee Handbook</div>

        <div class="tabs" id="subtabs" style="margin-top:8px">
          ${wantsRX ? `<button class="tab small" data-sub="roverx">ROVER X TRAVEL</button>` : ``}
          ${wantsTN ? `<button class="tab small" data-sub="ninjas">Tipsy Ninjas</button>` : ``}
          ${(!wantsRX && !wantsTN && hbMap['fallback']) ? `<button class="tab small" data-sub="fallback">General</button>` : ``}
        </div>

        <div id="hbPanel" style="margin-top:10px"></div>

        ${canAdmin ? `
          <div class="row" id="hbAdminRow" style="margin-top:12px">
            <button class="btn" id="editThisPage">✏️ Edit this page (local preview)</button>
          </div>
          <div id="editArea" style="display:none;margin-top:8px">
            <textarea id="editTextarea" class="textarea" rows="12" placeholder="<h2>Title</h2><p>..."></p>"></textarea>
            <div class="row" style="margin-top:8px">
              <button class="btn btn-blue" id="saveEdits">Save (local preview)</button>
              <button class="btn" id="cancelEdits">Cancel</button>
            </div>
            <div class="kv" style="margin-top:6px;color:#555">Admins: official handbook HTML is saved in Admin → “Handbook HTML (Server)”. This editor is local only (your browser).</div>
          </div>
        ` : ``}
      </div>
    `;

    const localRX = (brand.handbookHTML_RoverX_local || "").trim();
    const localTN = (brand.handbookHTML_Ninjas_local || "").trim();
    const fb = hbMap['fallback'] || "";

    function resolveHTMLFor(key) {
      if (key === 'roverx') return (localRX || hbMap['roverx'] || fb || "");
      if (key === 'ninjas') return (localTN || hbMap['ninjas'] || fb || "");
      if (key === 'fallback') return fb || "";
      return "";
    }

    function activateSub(key) {
      document.querySelectorAll('#subtabs .tab').forEach(b => b.classList.remove('active'));
      const btn = document.querySelector(`#subtabs .tab[data-sub="${key}"]`); if (btn) btn.classList.add('active');

      const html = resolveHTMLFor(key);
      const hbPanel = document.getElementById("hbPanel");
      if (html) hbPanel.innerHTML = `<div class="handbookContent">${sanitizeHTML(html)}</div>`;
      else hbPanel.innerHTML = `<div class="kv" style="color:#b91c1c">No handbook content available.</div>`;

      if (canAdmin) wireInlineEditor(key, html);
    }

    function wireInlineEditor(key, currentHTML) {
      const editBtn = document.getElementById("editThisPage");
      const area = document.getElementById("editArea");
      const ta = document.getElementById("editTextarea");
      const save = document.getElementById("saveEdits");
      const cancel = document.getElementById("cancelEdits");
      if (!editBtn || !area || !ta || !save || !cancel) return;

      editBtn.onclick = () => { area.style.display = "block"; ta.value = currentHTML || ""; ta.focus(); };
      cancel.onclick = () => { area.style.display = "none"; };
      save.onclick = () => {
        const content = ta.value || "";
        const patch = {};
        if (key === "roverx") patch.handbookHTML_RoverX_local = content;
        if (key === "ninjas") patch.handbookHTML_Ninjas_local = content;
        setBrand(patch);
        area.style.display = "none";
        document.getElementById("hbPanel").innerHTML = content
          ? `<div class="handbookContent">${sanitizeHTML(content)}</div>`
          : `<div class="kv" style="color:#b91c1c">No handbook content found.</div>`;
      };
    }

    // Wire subtabs and open initial
    document.querySelectorAll('#subtabs .tab').forEach(btn => {
      btn.addEventListener('click', e => activateSub(e.currentTarget.getAttribute('data-sub')));
    });
    const firstBtn = document.querySelector('#subtabs .tab');
    const firstKey = (firstBtn && firstBtn.getAttribute('data-sub')) || initialKey;
    activateSub(firstKey);
  }

  /* ------------------ Admin (Approvals + Branding + Handbook server editor) ------------------ */
  function renderAdmin() {
    const el = document.getElementById("panel");
    const brand = getBrand();
    const s = getSession();

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
        <div class="h2">Branding & Links</div>
        <div class="space"></div>
        <div class="list">
          <label class="kv">Logo Left URL <input id="logoLeft"  type="url" class="text" value="${brand.logoLeft}"  placeholder="https://..."></label>
          <label class="kv">Logo Right URL<input id="logoRight" type="url" class="text" value="${brand.logoRight}" placeholder="https://..."></label>
          <label class="kv">Logo Size <input id="logoSize" type="range" min="60" max="220" step="2" value="${brand.logoSize}" /> <span id="logoSizeVal">${brand.logoSize}px</span></label>
          <label class="kv">Check-In URL <input id="checkInURL" type="url" class="text" value="${brand.checkInURL}" placeholder="https://..."></label>
          <label class="kv">Leave Form URL <input id="leaveURL" type="url" class="text" value="${brand.leaveURL}" placeholder="https://..."></label>
          <label class="kv">CV Form URL    <input id="cvURL"    type="url" class="text" value="${brand.cvURL}"    placeholder="https://..."></label>
        </div>
        <div class="space"></div>
        <div class="row">
          <button class="btn btn-blue" id="saveBrand">Save</button>
          <button class="btn" id="previewBrand">Preview on Sign-In</button>
        </div>
      </div>

      <div class="space-lg"></div>

      <div class="card" id="hbServerCard">
        <div class="h2">Handbook HTML (Server)</div>
        <div class="kv">Edit the official HTML shown to staff. Mapping (who sees which subtab) comes from <b>Handbook</b> sheet (Email → Company). No HTML is stored in the sheet.</div>
        <div class="space"></div>

        <div class="h3">Rover X</div>
        <textarea id="rxHtml" class="textarea" rows="10" placeholder="<h2>Rover X Handbook</h2>..."></textarea>

        <div class="space"></div>
        <div class="h3">Tipsy Ninjas</div>
        <textarea id="tnHtml" class="textarea" rows="10" placeholder="<h2>Tipsy Ninjas Handbook</h2>..."></textarea>

        <div class="space"></div>
        <div class="h3">Fallback (optional)</div>
        <textarea id="fbHtml" class="textarea" rows="6" placeholder="<p>General handbook…</p>"></textarea>

        <div class="row" style="margin-top:10px;gap:8px;flex-wrap:wrap">
          <button class="btn btn-blue" id="loadServer">Load from Server</button>
          <button class="btn btn-green" id="saveServer">Save to Server</button>
        </div>
        <div id="saveStatus" class="kv" style="margin-top:6px"></div>
      </div>
    `;

    /* ---------- Approvals ---------- */
    document.getElementById("refreshBtn").onclick = loadPending;
    async function loadPending() {
      try {
        document.getElementById("error").textContent = "";
        const res = await apiCall("listPending");
        if (!res.ok) throw new Error(res.error || "Failed to load");
        const rows = res.pending || [];
        const list = document.getElementById("pendingList");
        list.innerHTML = "";
        if (rows.length === 0) { list.innerHTML = `<div class="kv">No pending requests.</div>`; return; }
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
                <option ${r.role === "Staff"   ? "selected" : ""}>Staff</option>
                <option ${r.role === "HR"      ? "selected" : ""}>HR</option>
                <option ${r.role === "Manager" ? "selected" : ""}>Manager</option>
                <option ${r.role === "Owner"   ? "selected" : ""}>Owner</option>
              </select>
              <button class="btn"          data-act="revoke">Revoke</button>
              <button class="btn btn-green" data-act="approve">Approve</button>
            </div>
          `;
          row.querySelector(".roleSel").addEventListener("change", async (e) => {
            await apiCall("setRole", { target: r.email, role: e.target.value });
          });
          row.querySelector('[data-act="revoke"]').addEventListener("click", async () => {
            await apiCall("revoke", { target: r.email }); await loadPending();
          });
          row.querySelector('[data-act="approve"]').addEventListener("click", async () => {
            await apiCall("approve", { target: r.email }); await loadPending();
          });
          list.appendChild(row);
        });
      } catch (err) {
        document.getElementById("error").textContent = String(err);
      }
    }
    loadPending();

    /* ---------- Branding form ---------- */
    const sizeInput = document.getElementById("logoSize");
    const sizeVal   = document.getElementById("logoSizeVal");
    sizeInput.addEventListener("input", () => (sizeVal.textContent = sizeInput.value + "px"));

    document.getElementById("saveBrand").onclick = () => {
      setBrand({
        logoLeft:  document.getElementById("logoLeft").value.trim(),
        logoRight: document.getElementById("logoRight").value.trim(),
        logoSize:  parseInt(document.getElementById("logoSize").value, 10) || 120,
        checkInURL: document.getElementById("checkInURL").value.trim(),
        leaveURL:   document.getElementById("leaveURL").value.trim(),
        cvURL:      document.getElementById("cvURL").value.trim(),
      });
      alert("Saved. Refresh to see everywhere, or Preview.");
    };
    document.getElementById("previewBrand").onclick = renderSignIn;

    /* ---------- Handbook (server-backed) editors ---------- */
    const rxTA = document.getElementById("rxHtml");
    const tnTA = document.getElementById("tnHtml");
    const fbTA = document.getElementById("fbHtml");
    const saveStatus = document.getElementById("saveStatus");

    document.getElementById("loadServer").onclick = loadServer;
    document.getElementById("saveServer").onclick = saveServer;
    loadServer();

    async function loadServer(){
      try{
        saveStatus.textContent = "Loading…";
        const res = await apiCall("getHandbookAdmin", { email: s.email });
        if (!res.ok) throw new Error(res.error || "Cannot load");
        rxTA.value = res.rx || "";
        tnTA.value = res.tn || "";
        fbTA.value = res.fallback || "";
        saveStatus.textContent = "Loaded.";
      }catch(err){
        saveStatus.textContent = "Error: " + err.message;
      }
    }
    async function saveServer(){
      try{
        saveStatus.textContent = "Saving…";
        const res = await apiCall("setHandbookAdmin", {
          email: s.email,
          rx: rxTA.value || "",
          tn: tnTA.value || "",
          fallback: fbTA.value || ""
        });
        if (!res.ok) throw new Error(res.error || "Cannot save");
        saveStatus.textContent = "Saved to server.";
      }catch(err){
        saveStatus.textContent = "Error: " + err.message;
      }
    }
  }

  /* ------------------ Google Identity Services button ------------------ */
  function initGoogleButton() {
    const cid = get("rx_google_client_id") || "790326467841-o52rg342gvi39t7g7ldirhc5inahf802.apps.googleusercontent.com";
    function onLoaded() {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) return;
      window.google.accounts.id.initialize({
        client_id: cid,
        callback: async (resp) => {
          try {
            const res = await apiCall("googleLogin", { id_token: resp.credential });
            if (!res.ok) throw new Error(res.error || "Login failed");

            // Ask backend which company handbooks + HTML to deliver
            let handbooks = [];
            try {
              const h = await apiCall("resolveHandbook", { email: res.email, name: res.name });
              if (h && h.ok && Array.isArray(h.handbooks)) handbooks = h.handbooks;
            } catch (_) {}

            setSession({
              email:  res.email,
              name:   res.name,
              role:   res.role,
              status: res.status,
              tabs:   res.tabs,
              sheets: res.sheets,
              handbooks // [{ key:'roverx'|'ninjas'|'fallback', company, html }]
            });

            if (String(res.status).toLowerCase() === "approved") renderDashboard();
            else renderPending();
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
    renderDashboard();
  } else {
    renderSignIn();
  }
})();
