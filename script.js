const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const totalCountElement = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const successMessage = document.getElementById("greeting");
const celebrationMessage = document.getElementById("celebration");
const attendeeList = document.getElementById("attendeeList");

let count = 0;
const maxCount = 50;
const storageKey = "sustainabilitySummitCheckIn";
let attendees = [];

function saveProgress() {
    const progress = {
        count: count,
        teamCounts: {
            water: Number(document.getElementById("waterCount").textContent),
            zero: Number(document.getElementById("zeroCount").textContent),
            power: Number(document.getElementById("powerCount").textContent)
        },
        attendees: attendees
    };

    localStorage.setItem(storageKey, JSON.stringify(progress));
}

function renderAttendees() {
    attendeeList.textContent = "";

    attendees.forEach(function (attendee) {
        const listItem = document.createElement("li");
        listItem.textContent = `${attendee.name} - ${attendee.teamName}`;
        attendeeList.appendChild(listItem);
    });
}

function showProgress() {
    const percentage = Math.round((count / maxCount) * 100);
    const progressWidth = Math.min(percentage, 100);

    totalCountElement.textContent = count;
    progressBar.style.width = `${progressWidth}%`;
}

function showCelebration() {
    if (count < maxCount) {
        celebrationMessage.style.display = "none";
        return;
    }

    const teamCards = document.querySelectorAll(".team-card");
    let winningTeam = "";
    let winningCount = -1;

    teamCards.forEach(function (teamCard) {
        const teamCount = Number(teamCard.querySelector(".team-count").textContent);

        if (teamCount > winningCount) {
            winningCount = teamCount;
            winningTeam = teamCard.querySelector(".team-name").textContent;
        }
    });

    celebrationMessage.textContent = `Goal reached! ${winningTeam} is leading the celebration!`;
    celebrationMessage.style.display = "block";
}

function loadProgress() {
    const savedProgress = localStorage.getItem(storageKey);

    if (savedProgress === null) {
        return;
    }

    try {
        const progress = JSON.parse(savedProgress);

        count = Number(progress.count) || 0;
        attendees = Array.isArray(progress.attendees) ? progress.attendees : [];

        const teamCounts = progress.teamCounts || {};
        document.getElementById("waterCount").textContent = Number(teamCounts.water) || 0;
        document.getElementById("zeroCount").textContent = Number(teamCounts.zero) || 0;
        document.getElementById("powerCount").textContent = Number(teamCounts.power) || 0;

        showProgress();
        renderAttendees();
        showCelebration();
    } catch (error) {
        console.error("Unable to load saved check-in progress.", error);
    }
}

loadProgress();

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const team = teamSelect.value;
    const teamName = teamSelect.options[teamSelect.selectedIndex].text;

    count++;
    attendees.push({
        name: name,
        team: team,
        teamName: teamName
    });

    showProgress();

    const teamCountElement = document.getElementById(`${team}Count`);
    const currentTeamCount = Number(teamCountElement.textContent) || 0;

    teamCountElement.textContent = currentTeamCount + 1;

    successMessage.textContent = `Welcome ${name} to the ${teamName} team!`;
    successMessage.classList.add("success-message");
    successMessage.style.display = "block";
    renderAttendees();
    saveProgress();

    showCelebration();

    form.reset();
});