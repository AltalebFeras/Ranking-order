  document.addEventListener('DOMContentLoaded', function() {
    const participantInput = document.getElementById('participantInput');
    const addParticipantBtn = document.getElementById('addParticipantBtn');
    const startRaffleBtn = document.getElementById('startRaffleBtn');
    const noParticipantsMsg = document.getElementById('noParticipantsMsg');
    const participantsList = document.getElementById('participantsList');
    const finalParticipantsList = document.getElementById('finalParticipantsList');

    let participants = [];
    let finalParticipants = [];

    // Function to handle participant input change
    participantInput.addEventListener('input', function(event) {
      if (event.target.value.trim() !== "") {
        startRaffleBtn.removeAttribute('disabled');
      } else {
        startRaffleBtn.setAttribute('disabled', 'disabled');
      }
    });

    // Function to handle adding participant
    addParticipantBtn.addEventListener('click', function() {
      const participantName = participantInput.value.trim();
      if (participantName !== "") {
        participants.push(participantName);
        renderParticipants();
        participantInput.value = "";
        startRaffleBtn.removeAttribute('disabled');
      }
    });

    // Function to handle deleting a participant
    function deleteParticipant(index) {
      participants.splice(index, 1);
      renderParticipants();
    }

    // Function to render participants list
    function renderParticipants() {
      participantsList.innerHTML = "";
      participants.forEach(function(participant, index) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.textContent = participant;
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-danger mx-3';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function() {
          deleteParticipant(index);
        });
        li.appendChild(deleteBtn);
        participantsList.appendChild(li);
      });

      if (participants.length === 0) {
        noParticipantsMsg.classList.remove('d-none');
      } else {
        noParticipantsMsg.classList.add('d-none');
      }
    }

    // Function to handle raffle button click
    startRaffleBtn.addEventListener('click', function() {
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
    });

    // Function to render final participants list
    function setFinalParticipantsList() {
      finalParticipantsList.innerHTML = "";
      finalParticipants.forEach(function(participant, index) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = (index + 1) + ": " + participant;
        finalParticipantsList.appendChild(li);
      });
    }
  });