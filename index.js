const COHORT = "2405-ftb-et-web-ft";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: [],
};

const partyList = document.querySelector("#partyList");
const addPartyForm = document.querySelector("#addPartyForm");
addPartyForm.addEventListener("submit", addParty);

async function render() {
  await getParties();
  renderParties();
}
render();

async function getParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.parties = json.data;
  } catch (error) {
    console.error(error);
  }
}

function renderParties() {
  if (!state.parties.length) {
    partyList.innerHTML = "<li>No Parties.</li>";
    return;
  }

  const partyCards = state.parties.map((party) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <h2>${party.name}</h2>
    <p>Date: ${party.date}</p>
    <p>Time: ${party.time}</p>
    <p>Location: ${party.location}</p>
    <p>Description: ${party.description}</p>
    <button onclick="deleteParty('${party.id}')">Delete</button>
    `;
    return li;
  });

  partyList.replaceChildren(...partyCards);
}

async function addParty(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addPartyForm.name.value,
        date: `${addPartyForm.date.value}T${addPartyForm.time.value}:00.000Z`,
        location: addPartyForm.location.value,
        description: addPartyForm.description.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create party");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteParty(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete party");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}
