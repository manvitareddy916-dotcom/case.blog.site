// =============================================
// CYBER NOIR DETECTIVE - ADVANCED VERSION
// =============================================

// CASE DATABASE

const defaultCases = [
    {
        id: 1,
        title: "THE MIDNIGHT KILLER",
        location: "Abandoned Warehouse",
        description: "A mysterious murder has taken place inside an abandoned warehouse.",
        progress: 65,
        solved: false,
        evidence: [
            { id: 1, title: "CRIME SCENE", description: "A photograph of the abandoned warehouse.", type: "photo", x: 7, y: 18 },
            { id: 2, title: "UNKNOWN MESSAGE", description: "An encrypted message found near the victim.", type: "document", x: 38, y: 10 },
            { id: 3, title: "DR. ELENA VANCE", description: "The victim and a classified researcher.", type: "person", x: 76, y: 17 },
            { id: 4, title: "JAY GHOST MILLER", description: "The primary suspect.", type: "suspect", x: 25, y: 48 },
            { id: 5, title: "UNKNOWN OBJECT", description: "An unidentified object recovered from the warehouse.", type: "weapon", x: 52, y: 59 },
            { id: 6, title: "UNIT-7", description: "A mysterious witness statement.", type: "witness", x: 82, y: 55 }
        ],
        suspects: [
            { name: "JAY GHOST MILLER", age: 29, role: "Primary Suspect", motive: "Unknown connection to the victim", status: "Under Investigation" },
            { name: "DR. ELENA VANCE", age: 32, role: "Victim", motive: "Classified research", status: "Deceased" },
            { name: "UNIT-7", age: "Unknown", role: "Witness", motive: "Unknown", status: "Available" }
        ],
        connections: []
    },
    {
        id: 2,
        title: "THE BLACK SIGNAL",
        location: "Underground Station",
        description: "A strange signal is being transmitted from an abandoned underground station.",
        progress: 35,
        solved: false,
        evidence: [
            { id: 1, title: "RADIO SIGNAL", description: "A mysterious frequency recorded at 02:15 AM.", type: "document", x: 10, y: 15 },
            { id: 2, title: "ABANDONED TRAIN", description: "An empty train discovered at the station.", type: "photo", x: 40, y: 12 },
            { id: 3, title: "UNKNOWN CALLER", description: "An anonymous caller contacted the station.", type: "witness", x: 73, y: 20 }
        ],
        suspects: [
            { name: "UNKNOWN CALLER", age: "Unknown", role: "Suspect", motive: "Unknown", status: "Missing" },
            { name: "STATION MANAGER", age: 45, role: "Person of Interest", motive: "Possible cover-up", status: "Under Review" }
        ],
        connections: []
    },
    {
        id: 3,
        title: "GHOST PROTOCOL",
        location: "Research Facility",
        description: "A classified AI experiment has gone wrong. Nobody knows what happened to the research team.",
        progress: 25,
        solved: false,
        evidence: [
            { id: 1, title: "SERVER LOG", description: "An unusual server activity record.", type: "document", x: 10, y: 20 },
            { id: 2, title: "MISSING SCIENTIST", description: "A scientist disappeared from the facility.", type: "person", x: 40, y: 15 },
            { id: 3, title: "SECURITY FOOTAGE", description: "A mysterious figure appears in the footage.", type: "photo", x: 72, y: 35 }
        ],
        suspects: [
            { name: "DR. MORGAN", age: 38, role: "Lead Scientist", motive: "Unknown", status: "Missing" },
            { name: "SYSTEM ZERO", age: "N/A", role: "AI Entity", motive: "Unknown", status: "Active" }
        ],
        connections: []
    }
];


// =============================================
// GLOBAL STATE AND STORAGE
// =============================================

let cases = loadCases();
let activeCaseId = cases[0]?.id;
let selectedEvidence = null;
let connectMode = false;
let zoomed = false;
let dragging = null;

function loadCases() {
    try {
        const saved = localStorage.getItem("cyberNoirCases");
        return saved ? JSON.parse(saved) : defaultCases;
    } catch {
        return defaultCases;
    }
}

function saveCases() {
    localStorage.setItem("cyberNoirCases", JSON.stringify(cases));
}

function getActiveCase() {
    return cases.find(c => c.id === activeCaseId);
}


// =============================================
// HTML ELEMENTS
// =============================================

const board = document.getElementById("evidenceBoard");
const chatMessages = document.getElementById("chatMessages");
const caseList = document.querySelector(".case-list");
const modal = document.getElementById("detailModal");


// =============================================
// CASE RENDERING
// =============================================

function renderCases() {
    caseList.innerHTML = "";

    cases.forEach(c => {
        const button = document.createElement("button");
        button.className = "case-item" +
            (c.id === activeCaseId ? " selected" : "");

        const number = document.createElement("span");
        number.textContent = String(cases.indexOf(c) + 1).padStart(2, "0");

        const name = document.createElement("span");
        name.textContent = c.title;

        const status = document.createElement("small");
        status.textContent = c.solved ? "SOLVED" : "ACTIVE";

        button.append(number, name, status);

        button.addEventListener("click", () => switchCase(c.id));

        caseList.appendChild(button);
    });
}


// =============================================
// SWITCH CASES
// =============================================

function switchCase(id) {
    activeCaseId = id;

    const c = getActiveCase();
    if (!c) return;

    selectedEvidence = null;
    connectMode = false;

    document.getElementById("caseTitle").textContent = c.title;
    document.getElementById("locationName").textContent = c.location;

    document.getElementById("progressNumber").textContent =
        c.progress + "%";

    document.getElementById("progressFill").style.width =
        c.progress + "%";

    renderCases();
    renderEvidence();
    renderSuspects();

    addMessage("CASE OPENED: " + c.title +
        ". Location: " + c.location, "assistant");
}


// =============================================
// CREATE A NEW CASE
// =============================================

document.getElementById("newCaseBtn").addEventListener("click", () => {

    const title = prompt("Enter the name of your new crime case:");

    if (!title || !title.trim()) return;

    const location = prompt("Enter the crime location:");

    if (!location || !location.trim()) return;

    const description = prompt("Describe the crime:");

    if (!description || !description.trim()) return;

    const newCase = {
        id: Date.now(),
        title: title.trim().toUpperCase(),
        location: location.trim(),
        description: description.trim(),
        progress: 0,
        solved: false,

        evidence: [
            {
                id: Date.now() + 1,
                title: "INITIAL CRIME REPORT",
                description: description.trim(),
                type: "document",
                x: 10,
                y: 15
            },
            {
                id: Date.now() + 2,
                title: "CRIME LOCATION",
                description: "Initial crime scene. Further investigation required.",
                type: "photo",
                x: 45,
                y: 35
            }
        ],

        suspects: [
            {
                name: "UNKNOWN SUSPECT",
                age: "Unknown",
                role: "Person of Interest",
                motive: "Not established",
                status: "Under Investigation"
            }
        ],

        connections: []
    };

    cases.push(newCase);
    saveCases();
    switchCase(newCase.id);

    addMessage(
        "New case successfully created. Start collecting clues and identifying suspects.",
        "assistant"
    );

});


// =============================================
// DELETE ACTIVE CASE
// =============================================

function deleteActiveCase() {

    if (cases.length <= 1) {
        alert("You must keep at least one case.");
        return;
    }

    const c = getActiveCase();

    if (!confirm("Delete " + c.title + "? This cannot be undone.")) return;

    cases = cases.filter(item => item.id !== activeCaseId);

    activeCaseId = cases[0].id;

    saveCases();
    switchCase(activeCaseId);

}


// Add delete button next to existing case controls

const deleteButton = document.createElement("button");
deleteButton.textContent = "DELETE CASE";
deleteButton.className = "delete-case-button";
deleteButton.addEventListener("click", deleteActiveCase);

document.querySelector(".workspace-header .board-controls")
    .appendChild(deleteButton);


// =============================================
// EVIDENCE RENDERING
// =============================================

const evidenceImages = {
    photo: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400",
    person: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    suspect: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    weapon: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400",
    witness: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400"
};

function renderEvidence() {

    const c = getActiveCase();
    if (!c) return;

    board.querySelectorAll(".evidence-node").forEach(n => n.remove());

    const empty = document.getElementById("emptyBoard");

    empty.hidden = c.evidence.length > 0;

    c.evidence.forEach(item => {

        const node = document.createElement("div");

        node.className = "evidence-node";
        node.dataset.id = item.id;

        node.style.left = item.x + "%";
        node.style.top = item.y + "%";

        node.draggable = false;

        const photo = document.createElement("div");
        photo.className = "evidence-photo";

        if (evidenceImages[item.type]) {
            photo.style.backgroundImage =
                `url("${evidenceImages[item.type]}")`;
        } else {
            photo.classList.add("document-photo");
        }

        const number = document.createElement("span");
        number.textContent = String(c.evidence.indexOf(item) + 1)
            .padStart(2, "0");

        photo.appendChild(number);

        const caption = document.createElement("div");
        caption.className = "evidence-caption";

        const title = document.createElement("strong");
        title.textContent = item.title;

        const description = document.createElement("small");
        description.textContent = item.description;

        caption.append(title, description);
        node.append(photo, caption);

        if (selectedEvidence === item.id) {
            node.classList.add("evidence-selected");
        }

        // Dragging

        node.addEventListener("pointerdown", startDrag);
        node.addEventListener("click", () => handleEvidenceClick(item.id));

        board.appendChild(node);
    });

    drawConnections();
}


// =============================================
// DRAG AND DROP EVIDENCE
// =============================================

function startDrag(event) {

    if (connectMode) return;

    if (event.button !== 0) return;

    const node = event.currentTarget;
    const id = Number(node.dataset.id);

    const c = getActiveCase();
    const item = c.evidence.find(e => e.id === id);

    if (!item) return;

    const boardRect = board.getBoundingClientRect();

    dragging = {
        node,
        item,
        startX: event.clientX,
        startY: event.clientY,
        originalX: item.x,
        originalY: item.y,
        boardRect,
        moved: false
    };

    node.setPointerCapture(event.pointerId);
    node.addEventListener("pointermove", moveDrag);
    node.addEventListener("pointerup", stopDrag);
    node.addEventListener("pointercancel", stopDrag);
}

function moveDrag(event) {

    if (!dragging) return;

    const d = dragging;

    const dx = event.clientX - d.startX;
    const dy = event.clientY - d.startY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        d.moved = true;
    }

    if (!d.moved) return;

    const width = d.boardRect.width;
    const height = d.boardRect.height;

    const newX = d.originalX + (dx / width) * 100;
    const newY = d.originalY + (dy / height) * 100;

    d.item.x = Math.max(0, Math.min(85, newX));
    d.item.y = Math.max(0, Math.min(85, newY));

    d.node.style.left = d.item.x + "%";
    d.node.style.top = d.item.y + "%";

    drawConnections();
}

function stopDrag(event) {

    if (!dragging) return;

    const node = dragging.node;
    const moved = dragging.moved;

    node.removeEventListener("pointermove", moveDrag);
    node.removeEventListener("pointerup", stopDrag);
    node.removeEventListener("pointercancel", stopDrag);

    if (moved) {
        event.stopPropagation();
        saveCases();
    }

    dragging = null;
}


// =============================================
// CONNECT TWO PIECES OF EVIDENCE
// =============================================

// Dynamically add connection mode button

const connectButton = document.createElement("button");
connectButton.textContent = "↗ CONNECT CLUES";
connectButton.id = "connectEvidenceBtn";

document.querySelector(".board-controls").appendChild(connectButton);

connectButton.addEventListener("click", () => {

    connectMode = !connectMode;
    selectedEvidence = null;

    connectButton.classList.toggle("active-connect", connectMode);

    connectButton.textContent = connectMode
        ? "✕ CANCEL CONNECTION"
        : "↗ CONNECT CLUES";

    renderEvidence();

    if (connectMode) {
        addMessage(
            "Connection mode activated. Select two evidence cards to connect them.",
            "assistant"
        );
    }

});

function handleEvidenceClick(id) {

    if (!connectMode) {
        openEvidence(id);
        return;
    }

    if (selectedEvidence === null) {
        selectedEvidence = id;
        renderEvidence();
        addMessage("First clue selected. Now select another clue.", "assistant");
        return;
    }

    if (selectedEvidence === id) {
        selectedEvidence = null;
        renderEvidence();
        return;
    }

    const c = getActiveCase();

    const alreadyConnected = c.connections.some(connection =>
        (connection[0] === selectedEvidence && connection[1] === id) ||
        (connection[1] === selectedEvidence && connection[0] === id)
    );

    if (!alreadyConnected) {
        c.connections.push([selectedEvidence, id]);
        saveCases();
        addMessage("Evidence connection successfully created.", "assistant");
    } else {
        addMessage("These two clues are already connected.", "assistant");
    }

    selectedEvidence = null;
    renderEvidence();
}


// =============================================
// DRAW CONNECTION LINES
// =============================================

function drawConnections() {

    const c = getActiveCase();
    if (!c) return;

    const svg = document.getElementById("connections");

    const rect = board.getBoundingClientRect();

    svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
    svg.innerHTML = "";

    c.connections.forEach(connection => {

        const first = c.evidence.find(e => e.id === connection[0]);
        const second = c.evidence.find(e => e.id === connection[1]);

        if (!first || !second) return;

        const x1 = (first.x / 100) * rect.width + 60;
        const y1 = (first.y / 100) * rect.height + 45;

        const x2 = (second.x / 100) * rect.width + 60;
        const y2 = (second.y / 100) * rect.height + 45;

        const line = document.createElementNS(
            "http://www.w3.org/2000/svg", "line"
        );

        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);

        line.setAttribute("stroke", "#a855f7");
        line.setAttribute("stroke-width", "2.5");
        line.setAttribute("stroke-dasharray", "5 4");

        svg.appendChild(line);
    });
}

window.addEventListener("resize", drawConnections);


// =============================================
// OPEN EVIDENCE
// =============================================

function openEvidence(id) {

    const c = getActiveCase();

    const item = c.evidence.find(e => e.id === id);

    if (!item) return;

    document.getElementById("modalTitle").textContent = item.title;

    document.getElementById("modalDescription").textContent =
        item.description;

    modal.classList.add("show");

}


// =============================================
// ADD NEW EVIDENCE
// =============================================

document.getElementById("addEvidenceBtn").addEventListener("click", () => {

    const title = prompt("Enter evidence name:");

    if (!title || !title.trim()) return;

    const description = prompt("Enter evidence description:");

    if (!description || !description.trim()) return;

    const c = getActiveCase();

    const newEvidence = {
        id: Date.now(),
        title: title.trim().toUpperCase(),
        description: description.trim(),
        type: "document",
        x: 10 + Math.random() * 65,
        y: 10 + Math.random() * 60
    };

    c.evidence.push(newEvidence);

    c.progress = Math.min(100, c.progress + 5);

    saveCases();
    renderEvidence();
    updateProgress();

    addMessage(
        "New evidence added: " + newEvidence.title,
        "assistant"
    );

});

function updateProgress() {

    const c = getActiveCase();

    document.getElementById("progressNumber").textContent =
        c.progress + "%";

    document.getElementById("progressFill").style.width =
        c.progress + "%";

}


// =============================================
// SUSPECT MANAGEMENT
// =============================================

function renderSuspects() {

    const c = getActiveCase();

    const list = document.querySelector(".suspect-list");

    list.innerHTML = "";

    c.suspects.forEach((suspect, index) => {

        const button = document.createElement("button");
        button.className = "suspect-card";

        const avatar = document.createElement("div");
        avatar.className = "suspect-avatar";
        avatar.textContent = suspect.name
            .split(" ")
            .map(word => word[0])
            .join("")
            .slice(0, 2);

        const info = document.createElement("div");
        info.className = "suspect-info";

        const name = document.createElement("strong");
        name.textContent = suspect.name;

        const role = document.createElement("small");
        role.textContent = suspect.role.toUpperCase();

        const status = document.createElement("span");
        status.className = "risk medium";
        status.textContent = suspect.status.toUpperCase();

        info.append(name, role, status);
        button.append(avatar, info);

        button.addEventListener("click", () => {
            showSuspect(suspect);
            document.querySelectorAll(".suspect-card")
                .forEach(card => card.classList.remove("active"));
            button.classList.add("active");
        });

        list.appendChild(button);

    });

    const heading = document.querySelector(".right-sidebar .section-heading");
    heading.lastElementChild.textContent = String(c.suspects.length).padStart(2, "0");

}

function showSuspect(suspect) {

    document.getElementById("profileName").textContent = suspect.name;
    document.getElementById("profileRole").textContent = suspect.role;
    document.getElementById("profileAge").textContent = suspect.age;
    document.getElementById("profileStatus").textContent = suspect.status;
    document.getElementById("profileAvatar").textContent =
        suspect.name.split(" ").map(w => w[0]).join("").slice(0, 2);

    document.getElementById("profileDescription").textContent =
        "Motive: " + suspect.motive + ". Status: " + suspect.status + ".";
}


// Add suspect button

const addSuspectButton = document.createElement("button");

addSuspectButton.textContent = "＋ ADD SUSPECT";
addSuspectButton.className = "add-suspect-button";

document.querySelector(".right-sidebar .section-heading")
    .after(addSuspectButton);

addSuspectButton.addEventListener("click", () => {

    const name = prompt("Enter suspect name:");
    if (!name || !name.trim()) return;

    const age = prompt("Enter suspect age:");
    const role = prompt("Enter role (Suspect, Witness, Person of Interest):");
    const motive = prompt("Enter possible motive:");

    const c = getActiveCase();

    c.suspects.push({
        name: name.trim().toUpperCase(),
        age: age || "Unknown",
        role: role || "Suspect",
        motive: motive || "Unknown",
        status: "Under Investigation"
    });

    saveCases();
    renderSuspects();

    addMessage("New suspect added: " + name, "assistant");

});


// =============================================
// DETECTIVE CHAT
// =============================================

function addMessage(text, sender) {

    const message = document.createElement("div");
    message.className = "message " + sender;

    if (sender === "assistant") {
        const avatar = document.createElement("div");
        avatar.className = "message-avatar";
        avatar.textContent = "AI";
        message.appendChild(avatar);
    }

    const content = document.createElement("div");
    content.className = "message-content";

    const heading = document.createElement("strong");
    heading.textContent = sender === "assistant"
        ? "DETECTIVE ASSISTANT"
        : "YOU";

    const paragraph = document.createElement("p");
    paragraph.textContent = text;

    content.append(heading, paragraph);
    message.appendChild(content);

    chatMessages.appendChild(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getDetectiveResponse(question) {

    const c = getActiveCase();
    const q = question.toLowerCase();

    if (q.includes("help")) {
        return "Try asking: Who are the suspects? What evidence do we have? What is the crime location? What is the possible motive?";
    }

    if (q.includes("suspect") || q.includes("killer")) {
        return "Current suspects: " +
            c.suspects.map(s => s.name).join(", ") +
            ". Examine their motives and evidence before making an accusation.";
    }

    if (q.includes("evidence") || q.includes("clue")) {
        return "This case currently has " + c.evidence.length +
            " evidence records. " +
            c.evidence.map(e => e.title).join(", ") + ".";
    }

    if (q.includes("location") || q.includes("where")) {
        return "The crime location is " + c.location +
            ". Case details: " + c.description;
    }

    if (q.includes("motive")) {
        return c.suspects.map(s => s.name + ": " + s.motive).join(" | ");
    }

    if (q.includes("connection")) {
        return "There are " + c.connections.length +
            " evidence connections on the investigation board. More connections may reveal important patterns.";
    }

    if (q.includes("solve") || q.includes("finish")) {
        return "Review every clue and suspect. When ready, use the SOLVE CASE button to submit your final accusation.";
    }

    if (q.includes("progress")) {
        return "Your investigation is " + c.progress +
            "% complete. You have collected " + c.evidence.length +
            " clues and identified " + c.suspects.length + " people.";
    }

    return "I have received your question about " + c.title +
        ". I can analyze the available evidence, suspects, motives and connections. Try asking a more specific question.";
}

document.getElementById("chatForm").addEventListener("submit", event => {

    event.preventDefault();

    const input = document.getElementById("chatInput");
    const question = input.value.trim();

    if (!question) return;

    addMessage(question, "user");

    input.value = "";

    setTimeout(() => {
        addMessage(getDetectiveResponse(question), "assistant");
    }, 500);

});


// =============================================
// CLEAR CHAT
// =============================================

document.getElementById("clearChatBtn").addEventListener("click", () => {

    chatMessages.innerHTML = "";

    addMessage("Investigation chat cleared. Ready for your next question.", "assistant");

});


// =============================================
// SOLVE CASE FEATURE
// =============================================

const solveButton = document.createElement("button");

solveButton.textContent = "⚖ SOLVE CASE";
solveButton.className = "solve-case-button";

document.querySelector(".workspace-header .board-controls")
    .appendChild(solveButton);

solveButton.addEventListener("click", () => {

    const c = getActiveCase();

    if (c.solved) {
        alert("This case has already been solved.");
        return;
    }

    if (c.suspects.length === 0) {
        alert("Add a suspect before solving this case.");
        return;
    }

    const options = c.suspects.map(s => s.name);

    const answer = prompt(
        "WHO IS RESPONSIBLE?\n\n" +
        options.map((s, i) => (i + 1) + ". " + s).join("\n") +
        "\n\nEnter the exact suspect name:"
    );

    if (!answer) return;

    const chosen = c.suspects.find(s =>
        s.name.toLowerCase() === answer.trim().toLowerCase()
    );

    if (!chosen) {
        alert("Suspect not found. Please enter a name from the list.");
        return;
    }

    const correct = c.id === 1
        ? chosen.name === "JAY GHOST MILLER"
        : false;

    if (correct) {

        c.solved = true;
        c.progress = 100;

        saveCases();
        renderCases();
        updateProgress();

        alert("CASE SOLVED! Excellent detective work.");

        addMessage(
            "CASE CLOSED! " + chosen.name +
            " has been identified as responsible. Investigation completed.",
            "assistant"
        );

    } else {

        alert("The accusation is not confirmed. Continue investigating.");

        addMessage(
            "Your accusation against " + chosen.name +
            " is not supported by the current case solution. Investigate further.",
            "assistant"
        );

    }

});


// =============================================
// ZOOM BOARD
// =============================================

document.getElementById("zoomBtn").addEventListener("click", () => {

    zoomed = !zoomed;

    board.style.transform = zoomed ? "scale(1.04)" : "scale(1)";
    board.style.transition = "transform .3s";

});


// =============================================
// RESET VIEW
// =============================================

document.getElementById("resetBtn").addEventListener("click", () => {

    zoomed = false;
    board.style.transform = "scale(1)";

    switchCase(cases[0].id);

});


// =============================================
// MODAL CLOSE
// =============================================

document.getElementById("closeModal").addEventListener("click", () => {
    modal.classList.remove("show");
});

document.getElementById("modalAction").addEventListener("click", () => {
    modal.classList.remove("show");
});

modal.addEventListener("click", event => {
    if (event.target === modal) {
        modal.classList.remove("show");
    }
});


// =============================================
// INITIALIZE WEBSITE
// =============================================

function initialize() {

    if (!cases.length) {
        cases = defaultCases;
        saveCases();
    }

    activeCaseId = cases[0].id;

    renderCases();
    switchCase(activeCaseId);

    console.log("CYBER NOIR DETECTIVE SYSTEM ONLINE");
}

initialize();