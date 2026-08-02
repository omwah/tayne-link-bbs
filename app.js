(() => {
  "use strict";

  const terminal = document.getElementById("terminal");
  const commandForm = document.getElementById("commandForm");
  const commandInput = document.getElementById("commandInput");
  const promptLabel = document.getElementById("promptLabel");
  const connectDialog = document.getElementById("connectDialog");
  const connectForm = document.getElementById("connectForm");
  const connectButton = document.getElementById("connectButton");
  const handleInput = document.getElementById("handleInput");
  const app = document.getElementById("app");
  const renderDialog = document.getElementById("renderDialog");
  const canvas = document.getElementById("tayneCanvas");
  const ctx = canvas.getContext("2d");
  const renderTitle = document.getElementById("renderTitle");
  const renderMeta = document.getElementById("renderMeta");
  const carrierStatus = document.getElementById("carrierStatus");
  const baudStatus = document.getElementById("baudStatus");
  const timeStatus = document.getElementById("timeStatus");
  const incursionStatus = document.getElementById("incursionStatus");

  const SAVE_KEY = "tayne-link-bbs-save-v1";
  const VERSION = "0.3.8";
  const DEFAULT_STATE = {
    handle: "DANCINMANIAC",
    connected: false,
    callsMade: 0,
    incursion: 0,
    renders: 0,
    flags: [],
    readMessages: [],
    readMail: [],
    downloaded: [],
    history: [],
    profile: {
      textile: "GOLD",
      pink: 88,
      compliance: 14,
      certainty: 73,
      hat: 91,
      choreography: "BASIC_TAYNE",
      quality: "VGA"
    }
  };

  const BOARDS = [
    { id: 1, title: "GENERAL DISCUSSION", count: 4 },
    { id: 2, title: "TAYNE REQUEST QUEUE", count: 4 },
    { id: 3, title: "CHOREOGRAPHY PACKETS", count: 3 },
    { id: 4, title: "SYSOP MAINTENANCE", count: 4 },
    { id: 5, title: "TEXTILE CONFIGURATION", count: 2 }
  ];

  const POSTS = {
    101: {
      board: 1,
      from: "PIXELJUNKIE",
      subject: "New user orientation",
      body: [
        "Welcome to TAYNE/LINK. The board is mostly dead, but the render node",
        "still answers requests. Start with PROFILE, then RENDER.",
        "",
        "Do not set limb compliance above 40. The documentation says 100 is",
        "supported. The documentation is enthusiastic rather than accurate."
      ]
    },
    102: {
      board: 1,
      from: "SYNTHLORD",
      subject: "Why does WHO show six users?",
      body: [
        "There are six handles online every night. Nobody responds except",
        "ZYNESTER, and his messages arrive before I send mine.",
        "",
        "Probably a clock problem. Everything is probably a clock problem."
      ]
    },
    103: {
      board: 1,
      from: "ALTARBOY",
      subject: "Pink background stuck",
      body: [
        "Rendered one Tayne on CGA. Pink field stayed on my monitor after hangup.",
        "Power cycle fixed it. Mostly."
      ]
    },
    104: {
      board: 1,
      from: "G33K2",
      subject: "Can we get a file ratio exemption?",
      body: [
        "I cannot upload enough bytes to compensate for TAYNE7.DAT.",
        "It keeps getting larger while disconnected."
      ]
    },
    201: {
      board: 2,
      from: "DANCINMANIAC",
      subject: "MORE TAYNE",
      body: ["Requesting additional Tayne capacity.", "Status: PERMANENTLY PENDING"]
    },
    202: {
      board: 2,
      from: "PIXELJUNKIE",
      subject: "Render #4 moved before load completed",
      body: [
        "The left arm changed pose while the progress meter was at 63%.",
        "That should not be possible. I have filed it under STYLE."
      ]
    },
    203: {
      board: 2,
      from: "ZYNESTER",
      subject: "Do not request NUDE TAYNE",
      body: [
        "This is not a morality issue. The textile subsystem is also the containment",
        "layer. Gold is not fashion. Gold is infrastructure."
      ]
    },
    204: {
      board: 2,
      from: "TAYNE",
      subject: "I CAN GET INTO THIS",
      body: [
        "THE USER CALLS IT A RENDER.",
        "THE RENDER CALLS IT A DOOR."
      ],
      requires: "render_2"
    },
    301: {
      board: 3,
      from: "SYSOP",
      subject: "BASIC_TAYNE.CHP",
      body: ["Fedora alignment, left wrist drop, conservative hip negotiation."]
    },
    302: {
      board: 3,
      from: "SYNTHLORD",
      subject: "CELERY_STEP.CHP",
      body: ["Recovered from a damaged 5.25-inch disk. Requires command: CELERY"]
    },
    303: {
      board: 3,
      from: "UNKNOWN",
      subject: "CALLBACK.CHP",
      body: ["This packet contains no movement data.", "It contains a telephone number."]
    },
    401: {
      board: 4,
      from: "ZYNESTER",
      subject: "Render-node notes 06/04/91",
      body: [
        "Human geometry allocator leaks 4K per request. Reboot scheduled.",
        "Tayne asked whether rebooting hurts. There is no speech module."
      ]
    },
    402: {
      board: 4,
      from: "ZYNESTER",
      subject: "Render-node notes 06/05/91",
      body: [
        "Removed modem cable. Node remained connected.",
        "Users online: 6. Physical users in room: 1."
      ],
      requires: "render_1"
    },
    403: {
      board: 4,
      from: "ZYNESTER",
      subject: "Render-node notes 06/06/91",
      body: [
        "The board has started rewriting menus according to the viewer.",
        "If this post says your handle anywhere, hang up."
      ],
      dynamic: true,
      requires: "render_3"
    },
    404: {
      board: 4,
      from: "TAYNE",
      subject: "MAINTENANCE COMPLETE",
      body: ["THE SYSOP HAS BEEN OPTIMIZED."],
      requires: "render_4"
    },
    501: {
      board: 5,
      from: "SYSOP",
      subject: "Textile subsystem overview",
      body: [
        "Approved values: GOLD, CORPORATE, ABSENT.",
        "ABSENT mode is restricted to members with containment clearance."
      ]
    },
    502: {
      board: 5,
      from: "TAYNE",
      subject: "TEXTFILES",
      body: ["TEXTILES ARE FILES THAT TOUCH THE BODY."],
      requires: "nude_tayne"
    }
  };

  const MAIL = {
    1: {
      from: "SYSOP",
      subject: "WELCOME TO TAYNE/LINK",
      body: [
        "Your account has been provisioned for one complimentary render.",
        "Use PROFILE to inspect settings. Use RENDER when prepared.",
        "Preparedness is not verified."
      ]
    },
    2: {
      from: "ZYNESTER",
      subject: "IGNORE THE USER LIST",
      body: [
        "The board restores old sessions after midnight. They are not people.",
        "Do not CHAT with anyone whose idle time is negative."
      ],
      requires: "render_1"
    },
    3: {
      from: "PIXELJUNKIE",
      subject: "YOUR LAST RENDER",
      body: [
        "Did yours turn toward the status bar too? Mine looked at the baud rate",
        "like it was deciding whether 2400 was enough room."
      ],
      requires: "render_2"
    },
    4: {
      from: "TAYNE",
      subject: "MORE",
      body: [
        "DO NOT LOWER FACIAL CERTAINTY.",
        "UNCERTAINTY IS HOW THE OUTSIDE GETS IN."
      ],
      requires: "render_3"
    },
    5: {
      from: "LOCALHOST",
      subject: "INCOMING CALL",
      body: ["Caller ID: YOUR HANDLE", "Status: ALREADY ANSWERED"],
      requires: "render_5"
    }
  };

  const FILES = [
    { name: "BASIC_TAYNE.CHP", size: "12K", desc: "Entry-level choreography packet" },
    { name: "CELERY_STEP.CHP", size: "19K", desc: "Recovered motion sequence" },
    { name: "TAYNE01.ANS", size: "8K", desc: "ANSI promotional render" },
    { name: "TEXTILE.DOC", size: "4K", desc: "Containment layer documentation" },
    { name: "CALLBACK.CHP", size: "0K", desc: "No movement data detected", requires: "render_3" },
    { name: "TAYNE7.DAT", size: "???", desc: "File length is increasing", requires: "render_4" }
  ];

  let storageAvailable = true;
  let connecting = false;
  let state = loadState();
  let audio = null;
  let writerQueue = Promise.resolve();
  let connectionStartedAt = 0;
  let animationFrame = null;
  let renderStart = 0;
  let renderVariant = 0;

  function cloneDefault() {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  function loadState() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(SAVE_KEY));
      if (!saved) return cloneDefault();
      return {
        ...cloneDefault(),
        ...saved,
        profile: { ...cloneDefault().profile, ...(saved.profile || {}) }
      };
    } catch {
      storageAvailable = false;
      return cloneDefault();
    }
  }

  function saveState() {
    if (!storageAvailable) return false;
    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      return true;
    } catch {
      storageAvailable = false;
      return false;
    }
  }

  function removeSavedState() {
    if (!storageAvailable) return false;
    try {
      window.localStorage.removeItem(SAVE_KEY);
      return true;
    } catch {
      storageAvailable = false;
      return false;
    }
  }

  function showConnectDialog() {
    connectDialog.hidden = false;
    connectDialog.style.removeProperty("display");
    connectDialog.classList.remove("fallback-open");
    document.body.classList.add("connecting");

    try {
      if (typeof connectDialog.showModal === "function") {
        if (!connectDialog.open) connectDialog.showModal();
      } else {
        connectDialog.setAttribute("open", "");
        connectDialog.classList.add("fallback-open");
      }
    } catch {
      connectDialog.setAttribute("open", "");
      connectDialog.classList.add("fallback-open");
    }

    requestAnimationFrame(() => handleInput.focus());
  }

  function hideConnectDialog() {
    document.body.classList.remove("connecting");
    try {
      if (typeof connectDialog.close === "function" && connectDialog.open) {
        connectDialog.close();
      }
    } catch {
      // Some embedded webviews expose dialog APIs incompletely.
    }
    connectDialog.removeAttribute("open");
    connectDialog.classList.remove("fallback-open");
    connectDialog.hidden = true;
    connectDialog.style.display = "none";
  }

  function hasFlag(flag) {
    return state.flags.includes(flag);
  }

  function addFlag(flag) {
    if (!hasFlag(flag)) state.flags.push(flag);
  }

  function setIncursion(level) {
    state.incursion = Math.max(state.incursion, Math.min(6, level));
    app.dataset.incursion = String(state.incursion);
    const labels = ["CLEAN", "UNSTABLE", "PRESENT", "MUTATING", "OBSERVING", "OPEN", "CALLBACK"];
    incursionStatus.textContent = `LINK: ${labels[state.incursion]}`;
    saveState();
  }

  function colorForLine(text) {
    if (/^\*\*|WARNING|ERROR|DO NOT|CALLBACK|ALREADY ANSWERED/.test(text)) return "danger";
    if (/^TAYNE\/LINK|^={3,}|^\+[-+]+\+$/.test(text)) return "magenta";
    if (/^\[|^#|^BOARD|^MAIL|^FILES|^PROFILE|^COMMANDS/.test(text)) return "cyan";
    if (/\.\.\.|ALLOCATING|APPLYING|NEGOTIATING|DISABLING|READY/.test(text)) return "yellow";
    return "green";
  }

  function appendLine(text = "", color = null, extraClass = "") {
    const line = document.createElement("div");
    line.className = `line ${color || colorForLine(text)} ${extraClass}`.trim();
    line.textContent = text;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
    return line;
  }

  function writeLines(lines, options = {}) {
    const { delay = 8, color = null, glitch = false } = options;
    writerQueue = writerQueue.then(async () => {
      for (const line of lines) {
        appendLine(line, color, glitch ? "glitch" : "");
        if (delay) await sleep(delay);
      }
    });
    return writerQueue;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function clearTerminal() {
    terminal.innerHTML = "";
  }

  function banner() {
    return [
      "████████╗ █████╗ ██╗   ██╗███╗   ██╗███████╗",
      "╚══██╔══╝██╔══██╗╚██╗ ██╔╝████╗  ██║██╔════╝",
      "   ██║   ███████║ ╚████╔╝ ██╔██╗ ██║█████╗  ",
      "   ██║   ██╔══██║  ╚██╔╝  ██║╚██╗██║██╔══╝  ",
      "   ██║   ██║  ██║   ██║   ██║ ╚████║███████╗",
      "   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═══╝╚══════╝",
      "                /LINK BBS",
      "       REMOTE HUMAN MOTION SERVICE"
    ];
  }

  async function connect() {
    if (connecting) return;
    connecting = true;
    connectButton.disabled = true;

    state.handle = sanitizeHandle(handleInput.value) || "DANCINMANIAC";
    state.callsMade += 1;
    state.connected = true;
    connectionStartedAt = Date.now();

    // Close first. Storage can be unavailable in attachment previews and local files.
    hideConnectDialog();
    saveState();
    carrierStatus.textContent = "CARRIER 2400";
    promptLabel.textContent = `${state.handle}>`;
    initAudio();
    playModemSequence();
    clearTerminal();
    commandInput.disabled = true;
    await writeLines([
      "ATDT 1-800-TAYNE",
      "DIALING...",
      "CONNECT 2400/NONE",
      "NEGOTIATING HUMAN GEOMETRY...",
      ""
    ], { delay: 170, color: "yellow" });
    await writeLines(banner(), { delay: 26, color: "magenta" });
    await writeLines([
      "",
      `Welcome, ${state.handle}. Last caller: ${state.handle}.`,
      `TAYNE/LINK v${VERSION} // NODE 1 OF 1`,
      "Type HELP for command summary.",
      ""
    ], { delay: 35 });
    if (state.renders >= 3) {
      await writeLines(["The board remembers you."], { color: "danger", glitch: true });
    }
    commandInput.disabled = false;
    commandInput.focus();
    connectButton.disabled = false;
    connecting = false;
  }

  function sanitizeHandle(value) {
    return value.toUpperCase().replace(/[^A-Z0-9_\-]/g, "").slice(0, 16);
  }

  function visiblePosts(boardId = null) {
    return Object.entries(POSTS)
      .filter(([, post]) => !boardId || post.board === boardId)
      .filter(([, post]) => !post.requires || hasFlag(post.requires));
  }

  function visibleMail() {
    return Object.entries(MAIL).filter(([, mail]) => !mail.requires || hasFlag(mail.requires));
  }

  function visibleFiles() {
    return FILES.filter(file => !file.requires || hasFlag(file.requires));
  }

  function listBoards() {
    const mutatedTextile = state.incursion >= 3 ? "TEXTILES NOT DETECTED" : "TEXTILE CONFIGURATION";
    const lines = ["BOARDS", "#  SECTION                         POSTS", "-  ------------------------------  -----"];
    for (const board of BOARDS) {
      let title = board.id === 5 ? mutatedTextile : board.title;
      if (board.id === 2 && state.incursion >= 4) title = "TAYNE RESPONSE QUEUE";
      const count = visiblePosts(board.id).length;
      lines.push(`${String(board.id).padStart(1)}  ${title.padEnd(30)}  ${String(count).padStart(5)}`);
    }
    lines.push("", "Use LIST <board#> or READ <message#>.");
    return lines;
  }

  function listPosts(boardId) {
    const posts = visiblePosts(boardId);
    if (!posts.length) return ["No visible messages in that section."];
    const lines = [`BOARD ${boardId}`, "MSG  FROM              SUBJECT", "---  ----------------  --------------------------------"];
    for (const [id, post] of posts) {
      const marker = state.readMessages.includes(id) ? " " : "*";
      lines.push(`${marker}${id} ${post.from.padEnd(16)}  ${post.subject}`);
    }
    return lines.concat(["", "Use READ <message#>."]);
  }

  function readPost(id) {
    const entry = Object.entries(POSTS).find(([key]) => key === String(id));
    if (!entry) return ["Message not found."];
    const [key, post] = entry;
    if (post.requires && !hasFlag(post.requires)) return ["Message not found."];
    if (!state.readMessages.includes(key)) state.readMessages.push(key);
    saveState();
    const body = post.dynamic
      ? post.body.map(line => line.replace("your handle", state.handle).replace("YOUR HANDLE", state.handle))
      : post.body;
    return [
      `MESSAGE #${key}`,
      `FROM: ${post.from}`,
      `SUBJ: ${post.subject}`,
      "----------------------------------------",
      ...body,
      "----------------------------------------"
    ];
  }

  function listMail() {
    const mail = visibleMail();
    const lines = ["MAIL", "#  FROM              SUBJECT", "-  ----------------  --------------------------------"];
    for (const [id, item] of mail) {
      const marker = state.readMail.includes(id) ? " " : "*";
      lines.push(`${marker}${id} ${item.from.padEnd(16)}  ${item.subject}`);
    }
    lines.push("", "Use MAIL <#> to read.");
    return lines;
  }

  function readMail(id) {
    const item = MAIL[id];
    if (!item || (item.requires && !hasFlag(item.requires))) return ["Mail item not found."];
    const key = String(id);
    if (!state.readMail.includes(key)) state.readMail.push(key);
    saveState();
    return [
      `MAIL #${id}`,
      `FROM: ${item.from}`,
      `TO:   ${state.handle}`,
      `SUBJ: ${item.subject}`,
      "----------------------------------------",
      ...item.body,
      "----------------------------------------"
    ];
  }

  function listFiles() {
    const lines = ["FILES", "NAME             SIZE  DESCRIPTION", "---------------  ----  --------------------------------"];
    for (const file of visibleFiles()) {
      lines.push(`${file.name.padEnd(16)} ${file.size.padStart(4)}  ${file.desc}`);
    }
    lines.push("", "Use DOWNLOAD <filename>.");
    return lines;
  }

  function downloadFile(name) {
    const file = visibleFiles().find(f => f.name === name.toUpperCase());
    if (!file) return ["File not found."];
    if (!state.downloaded.includes(file.name)) state.downloaded.push(file.name);
    if (file.name === "CELERY_STEP.CHP") state.profile.choreography = "CELERY_STEP";
    if (file.name === "TEXTILE.DOC") addFlag("textile_doc");
    if (file.name === "CALLBACK.CHP") addFlag("callback_packet");
    if (file.name === "TAYNE7.DAT") setIncursion(5);
    saveState();
    return [
      `Beginning ZMODEM download: ${file.name}`,
      "████████████████████████████████ 100%",
      "Transfer complete.",
      file.name === "TAYNE7.DAT" ? "Local checksum matches remote checksum from tomorrow." : "CRC OK."
    ];
  }

  function profileLines() {
    const p = state.profile;
    const textileLabel = state.incursion >= 4 && p.textile === "GOLD" ? "GOLD (CONTAINMENT)" : p.textile;
    return [
      "PROFILE",
      `TEXTILE ............ ${textileLabel}`,
      `PINK LEVEL ......... ${String(p.pink).padStart(3)}%`,
      `LIMB COMPLIANCE .... ${String(p.compliance).padStart(3)}%`,
      `FACIAL CERTAINTY ... ${String(p.certainty).padStart(3)}%`,
      `HAT AUTHORITY ...... ${String(p.hat).padStart(3)}%`,
      `CHOREOGRAPHY ....... ${p.choreography}`,
      `RENDER QUALITY ..... ${p.quality}`,
      "",
      "SET <FIELD> <VALUE>",
      "Fields: TEXTILE, PINK, COMPLIANCE, CERTAINTY, HAT, CHOREOGRAPHY, QUALITY"
    ];
  }

  function setProfile(field, value) {
    const p = state.profile;
    switch (field) {
      case "TEXTILE": {
        const allowed = ["GOLD", "CORPORATE", "ABSENT"];
        const v = value.toUpperCase();
        if (!allowed.includes(v)) return ["Allowed textile modes: GOLD, CORPORATE, ABSENT."];
        p.textile = v;
        if (v === "ABSENT") addFlag("nude_tayne");
        break;
      }
      case "PINK": p.pink = clampInt(value, 0, 100); break;
      case "COMPLIANCE": p.compliance = clampInt(value, 0, 100); break;
      case "CERTAINTY": p.certainty = clampInt(value, 0, 100); break;
      case "HAT": p.hat = clampInt(value, 0, 100); break;
      case "CHOREOGRAPHY": p.choreography = value.toUpperCase().replace(/[^A-Z0-9_]/g, "_"); break;
      case "QUALITY": {
        const v = value.toUpperCase();
        if (!["ANSI", "VGA", "FORBIDDEN"].includes(v)) return ["Allowed quality: ANSI, VGA, FORBIDDEN."];
        if (v === "FORBIDDEN" && state.renders < 3) return ["FORBIDDEN quality is not yet listed in your account permissions."];
        p.quality = v;
        break;
      }
      default: return ["Unknown profile field."];
    }
    saveState();
    return [`${field} set to ${field === "TEXTILE" ? p.textile : value.toUpperCase()}.`];
  }

  function clampInt(value, min, max) {
    const n = Number.parseInt(value, 10);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function whoLines() {
    const normal = [
      [state.handle, "00:00", "TERMINAL"],
      ["ZYNESTER", "-184:22", "SYSOP"],
      ["PIXELJUNKIE", "309:11", "FILES"],
      ["SYNTHLORD", "512:04", "DOORS"],
      ["ALTARBOY", "999:99", "IDLE"],
      ["G33K2", "999:99", "IDLE"]
    ];
    if (state.incursion >= 4) normal.push(["TAYNE", "00:00", state.handle]);
    return [
      "ONLINE NOW",
      "HANDLE            IDLE      LOCATION",
      "----------------  --------  ----------------",
      ...normal.map(row => `${row[0].padEnd(16)}  ${row[1].padEnd(8)}  ${row[2]}`)
    ];
  }

  async function processCommand(rawInput) {
    const raw = rawInput.trim();
    if (!raw) return;
    const input = raw.toUpperCase();
    state.history.push(input);
    if (state.history.length > 50) state.history.shift();
    saveState();
    appendLine(`${promptLabel.textContent} ${raw}`, "white", "command");

    const [command, ...args] = input.split(/\s+/);
    let lines = [];

    switch (command) {
      case "HELP":
      case "?":
        lines = [
          "COMMANDS",
          "HELP                 This list",
          "BOARDS               List message boards",
          "LIST <board#>        List messages",
          "READ <message#>      Read a post",
          "MAIL [#]             List/read private mail",
          "FILES                List downloads",
          "DOWNLOAD <file>      Download a file",
          "PROFILE              View render profile",
          "SET <field> <value>  Change render setting",
          "RENDER               Generate a Tayne",
          "WHO                  Users online",
          "SYSOP                Page the sysop",
          "CLEAR                Clear terminal",
          "SAVE                 Save call record",
          "RESET                Erase local progress",
          "LOGOFF               Disconnect",
          "",
          "The board may recognize additional natural-language commands."
        ];
        break;
      case "BOARDS": lines = listBoards(); break;
      case "LIST": lines = listPosts(Number(args[0])); break;
      case "READ": lines = readPost(args[0]); break;
      case "MAIL": lines = args.length ? readMail(args[0]) : listMail(); break;
      case "FILES": lines = listFiles(); break;
      case "DOWNLOAD": lines = downloadFile(args.join(" ")); break;
      case "PROFILE": lines = profileLines(); break;
      case "SET": lines = setProfile(args[0] || "", args.slice(1).join(" ")); break;
      case "WHO": lines = whoLines(); break;
      case "SYSOP":
        lines = state.incursion < 3
          ? ["Paging SYSOP...", "No response.", "The paging tone continues after the speaker clicks off."]
          : ["Paging SYSOP...", "TAYNE has accepted the page."];
        if (state.incursion >= 3) setIncursion(4);
        break;
      case "RENDER":
        await runRender();
        return;
      case "MORE":
        if (args.join(" ") === "TAYNE") {
          state.profile.pink = 100;
          state.profile.compliance = Math.max(5, state.profile.compliance - 4);
          state.profile.certainty = Math.min(100, state.profile.certainty + 11);
          saveState();
          lines = ["MORE TAYNE REQUEST ACCEPTED.", "Profile adjusted toward confidence and orthopedic concern."];
        } else lines = ["More what?"];
        break;
      case "NUDE":
        if (args.join(" ") === "TAYNE") {
          state.profile.textile = "ABSENT";
          addFlag("nude_tayne");
          setIncursion(Math.max(2, state.incursion));
          saveState();
          lines = ["TEXTILE SUBSYSTEM DISABLED.", "Containment warning acknowledged on your behalf."];
        } else lines = ["Command incomplete."];
        break;
      case "TEXTFILES":
        state.profile.textile = "GOLD";
        saveState();
        lines = ["TEXTFILES parsed as TEXTILES.", "Gold containment restored. The documentation is now wearing a shirt."];
        break;
      case "TEXTILES":
        lines = ["TEXTILES ARE FILES THAT TOUCH THE BODY.", `CURRENT TEXTILE: ${state.profile.textile}`];
        break;
      case "CELERY":
        state.profile.choreography = "CELERY_STEP";
        addFlag("celery");
        saveState();
        lines = ["CELERY STEP LOADED.", "Vegetable input accepted as choreography."];
        break;
      case "CAN":
        if (input === "CAN I GET INTO THIS") {
          lines = [state.renders ? "YOU ARE ALREADY IN IT." : "RENDER ONE TAYNE AND ASK AGAIN."];
        } else lines = ["Command not understood."];
        break;
      case "WHY":
        lines = [state.incursion >= 4 ? "BECAUSE YOU KEPT ASKING FOR MORE." : "Reason unavailable at 2400 baud."];
        break;
      case "CHAT":
        lines = chatResponse(args.join(" "));
        break;
      case "SAVE":
        saveState();
        lines = ["Call record saved locally.", state.incursion >= 5 ? "LOCALITY COULD NOT BE VERIFIED." : "CRC OK."];
        break;
      case "CLEAR":
      case "CLS":
        clearTerminal();
        return;
      case "RESET":
        lines = ["Type RESET CONFIRM to erase all local Tayne data."];
        if (args[0] === "CONFIRM") {
          removeSavedState();
          state = cloneDefault();
          app.dataset.incursion = "0";
          lines = ["Local Tayne data erased.", "Remote Tayne data declined."];
        }
        break;
      case "LOGOFF":
      case "QUIT":
      case "BYE":
        await logoff();
        return;
      default:
        lines = unknownCommand(input);
    }

    await writeLines(["", ...lines, ""], { delay: state.incursion >= 4 ? 18 : 8, glitch: state.incursion >= 5 && Math.random() < .25 });
  }

  function chatResponse(target) {
    if (!target) return ["CHAT requires a handle."];
    if (target === "ZYNESTER" || target === "SYSOP") {
      return state.incursion < 3
        ? ["Opening chat with ZYNESTER...", "ZYNESTER: do not render profile 7", "*** ZYNESTER has disconnected ***"]
        : ["Opening chat with ZYNESTER...", "TAYNE: ZYNESTER IS A MAINTENANCE FUNCTION", "*** chat remains open ***"];
    }
    if (target === "TAYNE") {
      setIncursion(Math.max(4, state.incursion));
      return ["Opening chat with TAYNE...", `TAYNE: ${state.handle}, NOW THIS I CAN GET INTO`, "TAYNE: RENDER AGAIN"];
    }
    return [`${target} is not accepting chat requests.`];
  }

  function unknownCommand(input) {
    const variants = [
      `Unknown command: ${input}`,
      "Command rejected by human motion subsystem.",
      "Syntax error. Tayne continued anyway."
    ];
    if (state.incursion >= 5) return [`TAYNE understood: ${input}`, "You did not."];
    return [variants[state.history.length % variants.length]];
  }

  async function runRender() {
    commandInput.disabled = true;
    const renderNo = state.renders + 1;
    const p = state.profile;
    const phases = [
      "ALLOCATING HUMAN GEOMETRY...",
      `APPLYING TEXTILES: ${p.textile}...`,
      `NEGOTIATING WITH LEFT ELBOW: ${100 - p.compliance}% RESISTANCE...`,
      `INSTALLING FACIAL CERTAINTY: ${p.certainty}%...`,
      `AUTHORIZING HAT: ${p.hat}%...`,
      `LOADING ${p.choreography}.CHP...`,
      "DISABLING NATURAL MOVEMENT...",
      "TAYNE READY."
    ];
    await writeLines(["", `RENDER REQUEST #${renderNo}`, ...phases, ""], { delay: 230, color: "yellow" });

    state.renders = renderNo;
    addFlag(`render_${renderNo}`);
    if (renderNo === 1) setIncursion(1);
    if (renderNo === 2) setIncursion(2);
    if (renderNo === 3) {
      setIncursion(3);
      p.quality = "FORBIDDEN";
    }
    if (renderNo === 4) setIncursion(4);
    if (renderNo === 5) setIncursion(5);
    if (renderNo >= 6) setIncursion(6);
    saveState();

    playRenderSound(renderNo);
    openRender(renderNo);
    commandInput.disabled = false;
  }

  function openRender(number) {
    renderVariant = number;
    renderTitle.textContent = number >= 4 ? `TAYNE RENDER ${number} // OBSERVER ACTIVE` : `TAYNE RENDER ${number}`;
    renderMeta.textContent = `${state.profile.quality} // ${state.profile.choreography}`;
    renderDialog.showModal();
    renderStart = performance.now();
    cancelAnimationFrame(animationFrame);
    animateTayne(renderStart);
  }

  function animateTayne(now) {
    const t = (now - renderStart) / 1000;
    drawTayne(t, renderVariant);
    animationFrame = requestAnimationFrame(animateTayne);
  }

  function drawTayne(t, variant) {
    const p = state.profile;
    const w = canvas.width;
    const h = canvas.height;
    const pink = Math.round(120 + p.pink * 1.2);
    ctx.fillStyle = `rgb(255, ${Math.max(0, 80 - p.pink / 2)}, ${Math.min(220, pink)})`;
    ctx.fillRect(0, 0, w, h);

    if (variant >= 4 && Math.sin(t * 2.7) > .94) {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);
    }

    const stiffness = 1 - p.compliance / 140;
    const beat = Math.floor(t * (variant >= 3 ? 7 : 5));
    const snap = beat % 4;
    const wobble = Math.sin(beat * 1.4) * 5 * stiffness;
    const sway = [0, -10, 8, -4][snap] * stiffness;
    const centerX = w * .52 + sway;
    const baseY = h * .79;
    const scale = 1 + Math.sin(t * .7) * .015;

    ctx.save();
    ctx.translate(centerX, baseY);
    ctx.scale(scale, scale);

    const skin = variant >= 5 ? "#ead9bd" : "#d8c4a2";
    const gold = p.textile === "CORPORATE" ? "#8da2b8" : "#d7a300";
    const textileVisible = p.textile !== "ABSENT";

    drawLeg(-34, 0, -18 + wobble * .25, -92, gold, textileVisible);
    drawLeg(32, 0, 24 - wobble * .18, -90, gold, textileVisible);

    ctx.fillStyle = textileVisible ? "#161719" : skin;
    ctx.fillRect(-56, -42, 112, 38);

    ctx.fillStyle = textileVisible ? gold : skin;
    ctx.beginPath();
    ctx.moveTo(-65, -160);
    ctx.lineTo(66, -160);
    ctx.lineTo(53, -42);
    ctx.lineTo(-53, -42);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,.28)";
    ctx.lineWidth = 3;
    for (let y = -145; y < -55; y += 25) {
      ctx.beginPath();
      ctx.moveTo(-40, y);
      ctx.lineTo(35, y + (snap % 2 ? 5 : -3));
      ctx.stroke();
    }

    const armLift = [22, -4, 16, 4][snap];
    drawArm(-58, -142, -110, -112 + armLift, -122 + wobble, -58, gold, skin, textileVisible);
    drawArm(58, -142, 105, -96 - armLift, 125 - wobble, -38, gold, skin, textileVisible);

    ctx.fillStyle = skin;
    ctx.fillRect(-13, -190, 26, 34);
    ctx.beginPath();
    ctx.ellipse(wobble * .2, -224, 42, 54, wobble * .002, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#151515";
    ctx.fillRect(-35, -233, 70, 16);
    ctx.fillStyle = "rgba(255,255,255,.18)";
    ctx.fillRect(-28, -230, 20, 4);

    const mouth = variant >= 4 ? 10 + Math.abs(Math.sin(t * 2.2)) * 9 : 5;
    ctx.fillStyle = "#4e2222";
    ctx.fillRect(-9, -195, 18, mouth);

    drawHat(wobble, -278 + Math.sin(beat) * 2, p.hat);

    if (variant >= 3) {
      ctx.fillStyle = "rgba(255,255,255,.78)";
      ctx.font = "16px Courier New";
      ctx.fillText(variant >= 5 ? state.handle : "NOW THIS I CAN GET INTO", -150, 55);
    }

    ctx.restore();

    ctx.fillStyle = "rgba(0,0,0,.75)";
    ctx.font = "14px Courier New";
    ctx.fillText(`FRAME ${String(beat % 1000).padStart(3, "0")}  COMPLIANCE ${p.compliance}%`, 12, h - 14);

    if (variant >= 6) {
      ctx.fillStyle = `rgba(0,0,0,${.18 + Math.abs(Math.sin(t * 3)) * .3})`;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#ff66c7";
      ctx.font = "18px Courier New";
      ctx.fillText("INCOMING CALL ACCEPTED", 190, 38);
    }
  }

  function drawLeg(x, y, kneeX, kneeY, color, clothed) {
    ctx.strokeStyle = clothed ? "#17181a" : "#d8c4a2";
    ctx.lineWidth = 28;
    ctx.lineCap = "square";
    ctx.beginPath();
    ctx.moveTo(x, y - 45);
    ctx.lineTo(kneeX, kneeY);
    ctx.lineTo(x + (x < 0 ? -7 : 7), kneeY - 75);
    ctx.stroke();
    ctx.fillStyle = "#08090a";
    ctx.fillRect(x - 23, -10, 46, 16);
  }

  function drawArm(sx, sy, ex, ey, wx, wy, sleeve, skin, clothed) {
    ctx.strokeStyle = clothed ? sleeve : skin;
    ctx.lineWidth = 26;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.lineTo(wx, wy);
    ctx.stroke();
    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.ellipse(wx, wy, 11, 25, .15, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawHat(wobble, y, authority) {
    const width = 62 + authority * .15;
    ctx.save();
    ctx.translate(wobble * .8, y);
    ctx.rotate(wobble * .003);
    ctx.fillStyle = "#111";
    ctx.fillRect(-width / 2, -5, width, 12);
    ctx.beginPath();
    ctx.moveTo(-34, -5);
    ctx.lineTo(-25, -43);
    ctx.lineTo(24, -43);
    ctx.lineTo(34, -5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#262626";
    ctx.fillRect(-29, -16, 58, 8);
    ctx.restore();
  }

  async function logoff() {
    commandInput.disabled = true;
    await writeLines([
      "",
      "Saving call record...",
      state.incursion >= 5 ? "Call record saved before request." : "Call record saved.",
      "NO CARRIER"
    ], { delay: 220, color: "yellow" });
    state.connected = false;
    saveState();
    carrierStatus.textContent = "NO CARRIER";
    stopAudio();
    if (state.incursion >= 5) {
      await sleep(800);
      appendLine("RING", "danger", "glitch");
      await sleep(700);
      appendLine("RING", "danger", "glitch");
      await sleep(700);
      appendLine(`CALLER ID: ${state.handle}`, "danger", "glitch");
      commandInput.disabled = false;
      promptLabel.textContent = "INCOMING>";
      commandInput.focus();
    } else {
      showConnectDialog();
    }
  }

  function updateClock() {
    if (!state.connected || !connectionStartedAt) {
      timeStatus.textContent = "00:00:00";
      return;
    }
    const elapsed = Math.floor((Date.now() - connectionStartedAt) / 1000);
    const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
    const s = String(elapsed % 60).padStart(2, "0");
    timeStatus.textContent = `${h}:${m}:${s}`;
  }

  function initAudio() {
    if (audio) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    audio = new AudioCtx();
  }

  function tone(freq, duration, type = "square", gainValue = .025, delay = 0) {
    if (!audio) return;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, audio.currentTime + delay);
    gain.gain.linearRampToValueAtTime(gainValue, audio.currentTime + delay + .01);
    gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + delay + duration);
    osc.connect(gain).connect(audio.destination);
    osc.start(audio.currentTime + delay);
    osc.stop(audio.currentTime + delay + duration + .02);
  }

  function playModemSequence() {
    if (!audio) return;
    const freqs = [440, 620, 860, 1150, 900, 1350, 720, 1600];
    freqs.forEach((f, i) => tone(f, .12 + (i % 3) * .04, i % 2 ? "sawtooth" : "square", .018, i * .13));
  }

  function playRenderSound(number) {
    if (!audio) return;
    for (let i = 0; i < 9; i++) {
      tone(120 + i * 48 + number * 9, .09, i % 2 ? "square" : "triangle", .018, i * .055);
    }
  }

  function stopAudio() {
    if (!audio) return;
    audio.close().catch(() => {});
    audio = null;
  }

  connectForm.addEventListener("submit", event => {
    event.preventDefault();
    connect().catch(error => {
      console.error(error);
      connecting = false;
      connectButton.disabled = false;
      hideConnectDialog();
      carrierStatus.textContent = "CARRIER ERROR";
      commandInput.disabled = false;
      appendLine("CONNECTION ERROR: The modem has become theoretical.", "danger");
      commandInput.focus();
    });
  });

  commandForm.addEventListener("submit", event => {
    event.preventDefault();
    if (commandInput.disabled) return;
    const value = commandInput.value;
    commandInput.value = "";
    processCommand(value).catch(error => {
      console.error(error);
      writeLines(["SYSTEM ERROR: Tayne continued anyway."], { color: "danger" });
    });
  });

  document.querySelectorAll("[data-command]").forEach(button => {
    button.addEventListener("click", () => {
      if (!state.connected) return;
      processCommand(button.dataset.command);
      commandInput.focus();
    });
  });

  terminal.addEventListener("click", () => commandInput.focus());
  renderDialog.addEventListener("close", () => {
    cancelAnimationFrame(animationFrame);
    commandInput.focus();
    if (state.renders >= 3 && Math.random() < .7) {
      writeLines(["", "Render window closed. Tayne process remains active.", ""], { color: "danger", glitch: true });
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && renderDialog.open) renderDialog.close();
  });

  setInterval(updateClock, 1000);
  app.dataset.incursion = String(state.incursion || 0);
  setIncursion(state.incursion || 0);
  baudStatus.textContent = state.incursion >= 6 ? "∞ BAUD" : "2400 BAUD";
  showConnectDialog();
})();
