const API_KEY = "29c0ddf5377631927fb5468e6bcb82f6";

async function searchSongs() {
  const query = document.getElementById("songInput").value;
  const resultsDiv = document.getElementById("results");
  const loading = document.getElementById("loading");

  if (!query) return;

  resultsDiv.innerHTML = "";
  loading.style.display = "block";

  try {
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${query}&api_key=${API_KEY}&format=json`
    );

    const data = await res.json();
    const tracks = data.results.trackmatches.track;

    loading.style.display = "none";

    if (!tracks || tracks.length === 0) {
      resultsDiv.innerHTML = "No songs found 😢";
      return;
    }

    tracks.slice(0, 10).forEach(track => {
      const card = document.createElement("div");
      card.className = "card";

      const uniqueId = Math.random().toString(36).substring(7);

      card.innerHTML = `
        <div class="title">${track.name}</div>
        <div class="artist">${track.artist}</div>
        <div class="similar" id="sim-${uniqueId}">
          Finding similar songs...
        </div>
      `;

      resultsDiv.appendChild(card);

      getSimilar(track.artist, track.name, uniqueId);
    });

  } catch (err) {
    loading.style.display = "none";
    resultsDiv.innerHTML = "Error fetching songs";
    console.error(err);
  }
}

async function getSimilar(artist, track, id) {
  try {
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${artist}&track=${track}&api_key=${API_KEY}&format=json`
    );

    const data = await res.json();
    const similar = data.similartracks.track;

    const el = document.getElementById(`sim-${id}`);

    if (!similar || similar.length === 0) {
      el.innerHTML = "No similar songs";
      return;
    }

    const names = similar.slice(0, 3).map(s => s.name).join(", ");
    el.innerHTML = `🎵 ${names}`;

  } catch {
    const el = document.getElementById(`sim-${id}`);
    if (el) el.innerHTML = "No data";
  }
}
