const playerIds = ["virat","rohit"]; // add more here

let playersData = [];

// LOAD ALL PLAYERS
async function loadAllPlayers(){
  playersData = [];

  for(let id of playerIds){
    const res = await fetch(`data/players/${id}.json`);
    const data = await res.json();
    data.id = id;
    playersData.push(data);
  }
}

// ================= PLAYERS PAGE =================
async function initPlayersPage(){
  await loadAllPlayers();

  renderPlayers(playersData);
  renderLeaderboards();

  document.getElementById("search").addEventListener("input", e=>{
    const val = e.target.value.toLowerCase();
    const filtered = playersData.filter(p=>p.name.toLowerCase().includes(val));
    renderPlayers(filtered);
  });
}

function renderPlayers(list){
  const container = document.getElementById("players");
  container.innerHTML = "";

  list.forEach(p=>{
    container.innerHTML += `
      <div onclick="location.href='player.html?id=${p.id}'"
        class="bg-slate-800 p-4 rounded-xl hover:scale-105 transition cursor-pointer">

        <img src="${p.image}" class="w-20 h-20 rounded-full mx-auto">
        <h3 class="text-center mt-2">${p.name}</h3>
      </div>
    `;
  });
}

function renderLeaderboards(){
  const runs = [...playersData].sort((a,b)=>b.runs-a.runs);
  const wickets = [...playersData].sort((a,b)=>b.wickets-a.wickets);

  document.getElementById("runs").innerHTML =
    runs.map(p=>`${p.name} - ${p.runs}`).join("<br>");

  document.getElementById("wickets").innerHTML =
    wickets.map(p=>`${p.name} - ${p.wickets}`).join("<br>");
}

// ================= SINGLE PLAYER =================
async function loadSinglePlayer(){
  const id = new URLSearchParams(location.search).get("id");

  const res = await fetch(`data/players/${id}.json`);
  const p = await res.json();

  document.getElementById("player").innerHTML = `
    <h1 class="text-3xl mb-4">${p.name}</h1>
    <p>Jersey #${p.jersey}</p>
  `;

  new Chart(document.getElementById("chart"),{
    type:"bar",
    data:{
      labels:["Runs","6s","4s","Wickets"],
      datasets:[{
        label:p.name,
        data:[p.runs,p.sixes,p.fours,p.wickets]
      }]
    }
  });
}

// ================= COMPARISON =================
async function comparePlayers(){
  const id1 = document.getElementById("p1").value;
  const id2 = document.getElementById("p2").value;

  const p1 = await fetch(`data/players/${id1}.json`).then(r=>r.json());
  const p2 = await fetch(`data/players/${id2}.json`).then(r=>r.json());

  new Chart(document.getElementById("compareChart"),{
    type:"bar",
    data:{
      labels:["Runs","6s","4s","Wickets"],
      datasets:[
        {label:p1.name,data:[p1.runs,p1.sixes,p1.fours,p1.wickets]},
        {label:p2.name,data:[p2.runs,p2.sixes,p2.fours,p2.wickets]}
      ]
    }
  });
}

// INIT COMPARE PAGE
window.onload = async ()=>{
  if(document.getElementById("p1")){
    await loadAllPlayers();

    const p1 = document.getElementById("p1");
    const p2 = document.getElementById("p2");

    playersData.forEach(p=>{
      p1.innerHTML += `<option value="${p.id}">${p.name}</option>`;
      p2.innerHTML += `<option value="${p.id}">${p.name}</option>`;
    });
  }
};