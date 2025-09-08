/** Rover X & Tipsy Ninjas — Internal Portal (no-build static app)
 * FIXES:
 *  - Removed stray Markdown code fences that broke parsing
 *  - renderSignIn() now wires Google button + Guest button
 *  - Admin includes Guest Portal Content editor (save + preview)
 *  - CV Open uses brand.cvURL (from Admin) instead of hardcoded link
 *  - Minor null guards + tidy localStorage helpers
 */

(function () {
  const elApp = document.getElementById("app");
  if (!elApp) {
    console.error("#app container not found");
    return;
  }

  /* ------------------ Storage helpers ------------------ */
  function qs(key) {
    return new URLSearchParams(location.search).get(key) || "";
  }
  function set(k, v) {
    try {
      localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
    } catch (e) {
      console.warn("localStorage.set failed", e);
    }
  }
  function get(k) {
    try {
      const v = localStorage.getItem(k);
      if (v == null) return null;
      const t = v.trim();
      return t[0] === "{" || t[0] === "[" ? JSON.parse(t) : v;
    } catch (e) {
      console.warn("localStorage.get parse failed", e);
      return null;
    }
  }
  function del(k) {
    try { localStorage.removeItem(k); } catch (_) {}
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
    logoLeft: "https://files.catbox.moe/8c0x7w.png", // fallback (Rover X) – replace in Admin
    logoRight: "https://files.catbox.moe/3j1q2a.png", // fallback (Tipsy Ninjas) – replace in Admin
    logoSize: 120, // px
    checkInURL:
      "https://docs.google.com/spreadsheets/d/19DbytZMQborRmbqvDbb9gAJqdu_ClmuLTdVTklDxEfA/edit?usp=sharing",
    leaveURL: "https://forms.gle/idkWEa9db5QwUAE3A",
    cvURL:
      "https://docs.google.com/forms/d/18PDSTMt6LP2h6yPpscdZ322-bjrDitKB669WD05ho4I/viewform",
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

  /* ------------------ Guest Portal editable copy ------------------ */
  function getGuestContent() {
    const defaults = {
      roverAbout:
        "Rover X is a leading logistics and transportation company, committed to delivering excellence in every mile. We pride ourselves on innovation, reliability, and building strong relationships with our clients and team members.",
      roverWhy:
        "Join our growing team and be part of a company that values your contribution. We offer competitive compensation, comprehensive benefits, career development opportunities, and a supportive work environment where your success is our success.",
      tipsyAbout:
        "Tipsy Ninjas brings excitement and exceptional service to the hospitality and events industry. We create unforgettable experiences through creativity, attention to detail, and a passion for bringing people together.",
      tipsyWhy:
        "Be part of an energetic team that celebrates creativity and excellence. We offer flexible schedules, competitive pay, opportunities for growth, and the chance to work in a fun, dynamic environment where every day is different.",
    };
    const current = get("rx_guest_content");
    return { ...defaults, ...(current || {}) };
  }
  function setGuestContent(content) {
    set("rx_guest_content", content);
  }

  /* ------------------ API helper ------------------ */
  async function apiCall(action, body) {
    // const api = API();
    // if (!api) throw new Error("API URL not set. Open with ?api=https://.../exec");
    // Hardcode to avoid manual query params
    const api =
      "https://script.google.com/macros/s/AKfycbxarN-MSvr86BA83tPs5iMMO8btTPLjxrllZb_knMTdONXCD36w6veRm92EACgztzaxrQ/exec";
    const r = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, ...(body || {}) }),
    });
    return r.json();
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

    const guestBtn = document.getElementById("guestBtn");
    if (guestBtn) guestBtn.onclick = renderGuestCV;
    initGoogleButton();
  }

  // Guest CV Landing (enhanced)
  function renderGuestCV() {
    const brand = getBrand();
    const guestContent = getGuestContent();

    elApp.innerHTML = `
      <div class="center">
        <div class="card guest-portal" style="width:min(94vw,600px)">
          <!-- Header with both logos -->
          <div class="brand-logos">
            <img src="${brand.logoLeft}" alt="Rover X" style="width:${brand.logoSize}px">
            <img src="${brand.logoRight}" alt="Tipsy Ninjas" style="width:${brand.logoSize}px">
          </div>
          <div class="h1" style="text-align:center;margin:16px 0 8px">Apply to Join Our Team</div>
          <div class="sub" style="text-align:center;margin-bottom:24px">Choose your preferred company</div>

          <!-- Company Selection Cards -->
          <div class="company-cards">
            <div class="company-card rover-card" id="roverCard">
              <div class="company-header">
                <img src="${brand.logoLeft}" alt="Rover X" class="company-logo">
                <h3>Rover X</h3>
                <p class="company-tagline">Logistics & Transportation</p>
              </div>
              <div class="company-content">
                <div class="about-section">
                  <h4>About Us</h4>
                  <p>${guestContent.roverAbout}</p>
                </div>
                <div class="why-join-section">
                  <h4>Why Join Rover X?</h4>
                  <p>${guestContent.roverWhy}</p>
                </div>
              </div>
              <button class="apply-btn rover-btn" data-company="roverx">🚛 Apply to Rover X</button>
            </div>

            <div class="company-card tipsy-card" id="tipsyCard">
              <div class="company-header">
                <img src="${brand.logoRight}" alt="Tipsy Ninjas" class="company-logo">
                <h3>Tipsy Ninjas</h3>
                <p class="company-tagline">Hospitality & Events</p>
              </div>
              <div class="company-content">
                <div class="about-section">
                  <h4>About Us</h4>
                  <p>${guestContent.tipsyAbout}</p>
                </div>
                <div class="why-join-section">
                  <h4>Why Join Tipsy Ninjas?</h4>
                  <p>${guestContent.tipsyWhy}</p>
                </div>
              </div>
              <button class="apply-btn tipsy-btn" data-company="tipsy">🍹 Apply to Tipsy Ninjas</button>
            </div>
          </div>

          <!-- Navigation -->
          <div class="guest-nav">
            <button class="btn" id="backSignIn">⬅ Back to Sign-In</button>
          </div>
        </div>
      </div>
    `;

    const back = document.getElementById("backSignIn");
    if (back) back.onclick = renderSignIn;

    document.querySelectorAll('.apply-btn').forEach((btn) => {
      btn.onclick = () => {
        const company = btn.getAttribute('data-company');
        openCVApplication(company);
      };
    });
  }

  function openCVApplication(company) {
    const brand = getBrand();
    const cvURL = brand.cvURL;

    elApp.innerHTML = `
      <div class="center">
        <div class="card" style="width:min(94vw,480px)">
          <div class="h2" style="text-align:center">Opening Application Form</div>
          <div class="kv" style="text-align:center;margin:16px 0">
            You're applying to <b>${company === 'roverx' ? 'Rover X' : 'Tipsy Ninjas'}</b>
          </div>
          <div class="space"></div>
          <div class="row" style="flex-direction:column">
            <a class="btn btn-blue" target="_blank" rel="noopener noreferrer" href="${cvURL}">📄 Open Application Form</a>
            <button class="btn" id="backToGuest">⬅ Back to Company Selection</button>
            <button class="btn btn-green" id="doneBack">✔ I've submitted my application</button>
          </div>
        </div>
      </div>
    `;

    const backGuest = document.getElementById("backToGuest");
    if (backGuest) backGuest.onclick = renderGuestCV;
    const done = document.getElementById("doneBack");
    if (done) done.onclick = renderSignIn;
  }

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
          <div class="row">
            <button class="btn" id="signOutBtn" style="width:auto">Sign Out</button>
          </div>
        </div>

        <div class="space"></div>

        <div class="tabs">
          ${tabs.checkIn ? `<button class="tab active" data-tab="checkin">Check In</button>` : ``}
          ${tabs.leave ? `<button class="tab ${!tabs.checkIn ? "active" : ""}" data-tab="leave">Leave Form</button>` : ``}
          ${hasDaily ? `<button class="tab ${(!tabs.checkIn && !tabs.leave) ? "active" : ""}" data-tab="dailysale">Daily Sale</button>` : ``}
          ${canAdmin ? `<button class="tab ${(!tabs.checkIn && !tabs.leave && !hasDaily) ? "active" : ""}" data-tab="admin">Admin</button>` : ``}
        </div>

        <div id="panel"></div>
      </div>
    `;

    const so = document.getElementById("signOutBtn");
    if (so) so.onclick = signOut;

    const first = document.querySelector(".tab") || null;
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
      if (key === "checkin") return renderCheckIn();
      if (key === "leave") return renderLeave();
      if (key === "dailysale") return renderDailySale();
      if (key === "admin") return renderAdmin();
      const p = document.getElementById("panel");
      if (p) p.innerHTML = "";
    }
  }

  function renderCheckIn() {
    const s = getSession();
    const brand = getBrand();
    const p = document.getElementById("panel");
    if (!p) return;
    p.innerHTML = `
      <div class="card">
        <div class="h2">Check In</div>
        <div class="kv">Signed in as <b>${s?.name || s?.email || ""}</b></div>
        <div class="space"></div>
        <a class="btn btn-blue" target="_blank" rel="noopener" href="${brand.checkInURL}">↗ Open Attendance </a>
        <div class="kv" style="margin-top:6px">This opens your existing Google Sheet in a new tab.</div>
      </div>
    `;
  }

  function renderLeave() {
    const brand = getBrand();
    const p = document.getElementById("panel");
    if (!p) return;
    p.innerHTML = `
      <div class="card">
        <div class="h2">Leave Form</div>
        <div class="space"></div>
        <a class="btn btn-blue" target="_blank" rel="noopener" href="${brand.leaveURL}">↗ Open Leave Form</a>
      </div>
    `;
  }

  function renderDailySale() {
    const s = getSession();
    const list = s?.sheets || [];
    const has = list && list.length > 0;
    const p = document.getElementById("panel");
    if (!p) return;
    p.innerHTML = `
      <div class="card">
        <div class="h2">Daily Sale</div>
        ${!has ? `<div class="kv">No linked sheets for your account.</div>` : ""}
        <div class="space"></div>
        <div class="list" id="dsList"></div>
      </div>
    `;
    const el = document.getElementById("dsList");
    if (!el) return;
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

  /* ------------------ Admin (Approvals + Branding & Links + Guest Content) ------------------ */
  function renderAdmin() {
    const p = document.getElementById("panel");
    if (!p) return;
    const brand = getBrand();
    const guestContent = getGuestContent();

    p.innerHTML = `
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
          <label class="kv">Logo Left URL <input id="logoLeft" type="url" class="text" value="${brand.logoLeft}" placeholder="https://..."></label>
          <label class="kv">Logo Right URL <input id="logoRight" type="url" class="text" value="${brand.logoRight}" placeholder="https://..."></label>
          <label class="kv">Logo Size <input id="logoSize" type="range" min="60" max="220" step="2" value="${brand.logoSize}" /> <span id="logoSizeVal">${brand.logoSize}px</span></label>

          <label class="kv">Check-In URL <input id="checkInURL" type="url" class="text" value="${brand.checkInURL}" placeholder="https://..."></label>
          <label class="kv">Leave Form URL <input id="leaveURL" type="url" class="text" value="${brand.leaveURL}" placeholder="https://..."></label>
          <label class="kv">CV Form URL <input id="cvURL" type="url" class="text" value="${brand.cvURL}" placeholder="https://..."></label>
        </div>
        <div class="space"></div>
        <div class="row">
          <button class="btn btn-blue" id="saveBrand">Save</button>
          <button class="btn" id="previewBrand">Preview on Sign-In</button>
        </div>
      </div>

      <div class="space-lg"></div>

      <div class="card">
        <div class="h2">Guest Portal Content</div>
        <div class="kv" style="margin-bottom:16px">Edit the About Us and Why Join sections for both companies</div>
        <div class="guest-content-form">
          <div class="company-content-section">
            <h4 style="color:var(--rx-blue);margin:0 0 8px">Rover X Content</h4>
            <label class="kv">About Us <textarea id="roverAbout" class="text" rows="3" placeholder="About Rover X...">${guestContent.roverAbout}</textarea></label>
            <label class="kv">Why Join Us <textarea id="roverWhy" class="text" rows="3" placeholder="Why join Rover X...">${guestContent.roverWhy}</textarea></label>
          </div>
          <div class="company-content-section">
            <h4 style="color:#8b5cf6;margin:16px 0 8px">Tipsy Ninjas Content</h4>
            <label class="kv">About Us <textarea id="tipsyAbout" class="text" rows="3" placeholder="About Tipsy Ninjas...">${guestContent.tipsyAbout}</textarea></label>
            <label class="kv">Why Join Us <textarea id="tipsyWhy" class="text" rows="3" placeholder="Why join Tipsy Ninjas...">${guestContent.tipsyWhy}</textarea></label>
          </div>
        </div>
        <div class="space"></div>
        <div class="row">
          <button class="btn btn-blue" id="saveGuestContent">Save Guest Content</button>
          <button class="btn" id="previewGuest">Preview Guest Portal</button>
        </div>
      </div>
    `;

    // Approvals
    const refresh = document.getElementById("refreshBtn");
    if (refresh) refresh.onclick = loadPending;

    async function loadPending() {
      try {
        const err = document.getElementById("error");
        if (err) err.textContent = "";
        const res = await apiCall("listPending");
        if (!res.ok) throw new Error(res.error || "Failed to load");
        const rows = res.pending || [];
        const list = document.getElementById("pendingList");
        if (!list) return;
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
          if (sel) sel.addEventListener("change", async (e) => {
            await apiCall("setRole", { target: r.email, role: e.target.value });
          });
          const revoke = row.querySelector('[data-act="revoke"]');
          if (revoke) revoke.addEventListener("click", async () => {
            await apiCall("revoke", { target: r.email });
            await loadPending();
          });
          const approve = row.querySelector('[data-act="approve"]');
          if (approve) approve.addEventListener("click", async () => {
            await apiCall("approve", { target: r.email });
            await loadPending();
          });
          list.appendChild(row);
        });
      } catch (err) {
        const e = document.getElementById("error");
        if (e) e.textContent = String(err);
      }
    }
    loadPending();

    // Branding form
    const sizeInput = document.getElementById("logoSize");
    const sizeVal = document.getElementById("logoSizeVal");
    if (sizeInput && sizeVal) {
      sizeInput.addEventListener("input", () => (sizeVal.textContent = sizeInput.value + "px"));
    }

    const saveBrand = document.getElementById("saveBrand");
    if (saveBrand)
      saveBrand.onclick = () => {
        setBrand({
          logoLeft: (document.getElementById("logoLeft").value || "").trim(),
          logoRight: (document.getElementById("logoRight").value || "").trim(),
          logoSize: parseInt(document.getElementById("logoSize").value, 10) || 120,
          checkInURL: (document.getElementById("checkInURL").value || "").trim(),
          leaveURL: (document.getElementById("leaveURL").value || "").trim(),
          cvURL: (document.getElementById("cvURL").value || "").trim(),
        });
        alert("Saved. Refresh to see everywhere, or Preview.");
      };
    const previewBrand = document.getElementById("previewBrand");
    if (previewBrand) previewBrand.onclick = renderSignIn;

    // Guest content handlers
    const saveGuestContentBtn = document.getElementById("saveGuestContent");
    if (saveGuestContentBtn)
      saveGuestContentBtn.onclick = () => {
        setGuestContent({
          roverAbout: (document.getElementById("roverAbout").value || "").trim(),
          roverWhy: (document.getElementById("roverWhy").value || "").trim(),
          tipsyAbout: (document.getElementById("tipsyAbout").value || "").trim(),
          tipsyWhy: (document.getElementById("tipsyWhy").value || "").trim(),
        });
        alert("Guest portal content saved!");
      };
    const previewGuest = document.getElementById("previewGuest");
    if (previewGuest) previewGuest.onclick = renderGuestCV;
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
            setSession({
              email: res.email,
              name: res.name,
              role: res.role,
              status: res.status,
              tabs: res.tabs,
              sheets: res.sheets,
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
          <div class="kv" style="text-align:center">Signed in as <b>${s?.email || ""}</b></div>
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
    const back = document.getElementById("backLogin");
    if (back) back.onclick = renderSignIn;
    const guest = document.getElementById("guestEnter");
    if (guest) guest.onclick = renderGuestCV;
  }

  /* ------------------ Boot ------------------ */
  const sess = getSession();
  if (sess && String(sess.status || "").toLowerCase() === "approved") {
    renderDashboard();
  } else {
    renderSignIn();
  }
})();
