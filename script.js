document.addEventListener("DOMContentLoaded", function () {
  const participantInput = document.getElementById("participantInput");
  const multipleParticipantsInput = document.getElementById(
    "multipleParticipantsInput"
  );
  const addParticipantBtn = document.getElementById("addParticipantBtn");
  const addMultipleParticipantsBtn = document.getElementById(
    "addMultipleParticipantsBtn"
  );
  const startRaffleBtn = document.getElementById("startRaffleBtn");
  const startAllRaffleBtn = document.getElementById("startAllRaffleBtn");
  const clearRankingBtn = document.getElementById("clearRankingBtn");
  const noParticipantsMsg = document.getElementById("noParticipantsMsg");
  const participantsList = document.getElementById("participantsList");
  const finalParticipantsList = document.getElementById(
    "finalParticipantsList"
  );
  const exportButtons = document.getElementById("exportButtons");
  const exportPDF = document.getElementById("exportPDF");
  const exportDOC = document.getElementById("exportDOC");

  let participants = [];
  let finalParticipants = [];

  // Load participants from localStorage
  const savedParticipants = JSON.parse(localStorage.getItem("participants"));
  if (savedParticipants) {
    participants = savedParticipants;
    renderParticipants();
  }

  // Function to handle participant input change
  participantInput.addEventListener("input", function (event) {
    if (event.target.value.trim() !== "") {
      startRaffleBtn.removeAttribute("disabled");
    } else {
      startRaffleBtn.setAttribute("disabled", "disabled");
    }
  });

  // Function to handle adding a single participant
  addParticipantBtn.addEventListener("click", function () {
    const participantName = participantInput.value.trim();
    if (participantName !== "") {
      participants.push(participantName);
      renderParticipants();
      participantInput.value = "";
      checkDisableRaffleButtons();
    }
  });

  // Function to handle adding multiple participants
  addMultipleParticipantsBtn.addEventListener("click", function () {
    const multipleNames = multipleParticipantsInput.value.trim();
    if (multipleNames !== "") {
      const namesArray = multipleNames
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name !== "");
      participants = [...participants, ...namesArray];
      renderParticipants();
      multipleParticipantsInput.value = "";
      checkDisableRaffleButtons();
    }
  });

  // Function to handle deleting a participant
  function deleteParticipant(index) {
    participants.splice(index, 1);
    renderParticipants();
    checkDisableRaffleButtons();
  }

  // Function to render participants list
  function renderParticipants() {
    participantsList.innerHTML = "";
    participants.forEach(function (participant, index) {
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center animate__animated animate__fadeIn";
      li.textContent = participant;
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-sm btn-danger mx-3";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", function () {
        deleteParticipant(index);
      });
      li.appendChild(deleteBtn);
      participantsList.appendChild(li);
    });

    if (participants.length === 0) {
      noParticipantsMsg.classList.remove("d-none");
    } else {
      noParticipantsMsg.classList.add("d-none");
    }

    // Save participants to localStorage
    localStorage.setItem("participants", JSON.stringify(participants));
  }

  // Function to disable/enable raffle buttons
  function checkDisableRaffleButtons() {
    if (participants.length === 0) {
      startRaffleBtn.setAttribute("disabled", "disabled");
      startAllRaffleBtn.setAttribute("disabled", "disabled");
    } else {
      startRaffleBtn.removeAttribute("disabled");
      startAllRaffleBtn.removeAttribute("disabled");
    }
  }

  // Function to handle the single raffle button click
  startRaffleBtn.addEventListener("click", function () {
    if (participants.length === 0) return; // Prevent raffling if no participants
    let participantsCopy = [...participants];
    let participantsInRound = [];

    while (participantsCopy.length > 1) {
      const randomIndex = Math.floor(Math.random() * participantsCopy.length);
      const participant = participantsCopy.splice(randomIndex, 1)[0];
      participantsInRound.push(participant);
    }

    finalParticipants.push(participantsCopy[0]);
    setFinalParticipantsList();
    participants = participantsInRound;
    renderParticipants();
    if (participants.length === 0) {
      exportButtons.classList.remove("d-none"); // Show export options when all participants are raffled
    }
  });

  // Function to handle full raffle (shuffling all participants) with animation
  startAllRaffleBtn.addEventListener("click", function () {
    if (participants.length === 0) return; // Prevent raffling if no participants
    let shuffledParticipants = shuffle([...participants]);
    finalParticipants = [];
    setFinalParticipantsList(); // Clear list before animating

    shuffledParticipants.forEach(function (participant, index) {
      setTimeout(function () {
        finalParticipants.push(participant);
        setFinalParticipantsList();
        participants = participants.filter((p) => p !== participant);
        renderParticipants();
        if (participants.length === 0) {
          exportButtons.classList.remove("d-none"); // Show export options when all participants are raffled
        }
      }, index * 1000); // Delay of 1 second per participant
    });
  });

  // Function to render final participants list
  function setFinalParticipantsList() {
    finalParticipantsList.innerHTML = "";
    finalParticipants.forEach(function (participant, index) {
      const li = document.createElement("li");
      li.className = "list-group-item animate__animated animate__fadeIn";
      li.textContent = ordinalSuffix(index + 1) + ": " + participant;
      finalParticipantsList.appendChild(li);
    });
  }

  // Function to shuffle participants
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  // Function to clear ranking order
  clearRankingBtn.addEventListener("click", function () {
    finalParticipants = [];
    setFinalParticipantsList();
    exportButtons.classList.add("d-none"); // Hide export buttons when cleared
  });

  // Function to generate ordinal suffix (e.g., 1st, 2nd, 3rd)
  function ordinalSuffix(num) {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  }

  // Export results as PDF using jsPDF
  exportPDF.addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let yOffset = 10;

    doc.text("Raffle Results", 10, yOffset);
    finalParticipants.forEach((participant, index) => {
      yOffset += 10;
      doc.text(`${ordinalSuffix(index + 1)}: ${participant}`, 10, yOffset);
    });

    doc.save("raffle_results.pdf");
  });
});
