const API_KEY = "29c0ddf5377631927fb5468e6bcb82f6";

async function searchSong() {
  const query = document.getElementById("songInput").value;
  const resultsDiv = document.getElementById("results");
  const loading = document.getElementById("loading");
  const sortOption = document.getElementById("sortOption").value;

  loading.style.display = "block";
  resultsDiv.innerHTML = "";

  try {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${query}&api_key=${API_KEY}&format=json`
    );

    const data = await response.json();
    loading.style.display = "none";

    let tracks = data.results.trackmatches.track;

    if (!tracks || tracks.length === 0) {
      resultsDiv.innerHTML = "No songs found 😢";
      return;
    }

    // SORTING
    if (sortOption === "az") {
      tracks.sort((a, b) => a.name.localeCompare(b.name));
    }

    // REMOVE DUPLICATES
    const unique = [];
    tracks.forEach(song => {
      if (!unique.find(s => s.artist === song.artist)) {
        unique.push(song);
      }
    });

    // DISPLAY SEARCH RESULTS
    resultsDiv.innerHTML += `<div class="section-title">Search Results 🎵</div>`;

    unique.slice(0, 5).forEach(song => {
      resultsDiv.innerHTML += `
        <div class="card">
          <img src="${song.image[2]['#text']}" />
          <h3>${song.name}</h3>
          <p>Artist: ${song.artist}</p>
        </div>
      `;
    });

    // CALL SIMILAR SONGS
    const firstSong = unique[0];
    getSimilarSongs(firstSong.artist, firstSong.name);

  } catch (error) {
    loading.style.display = "none";
    resultsDiv.innerHTML = "Error fetching data ❌";
    console.error(error);
  }
}

// SIMILAR SONGS FUNCTION
async function getSimilarSongs(artist, track) {
  const resultsDiv = document.getElementById("results");

  try {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${artist}&track=${track}&api_key=${API_KEY}&format=json`
    );

    const data = await response.json();

    const similarTracks = data.similartracks.track;

    if (!similarTracks || similarTracks.length === 0) return;

    resultsDiv.innerHTML += `<div class="section-title">Recommended Songs 🎧</div>`;

    similarTracks.slice(0, 5).forEach(song => {
      resultsDiv.innerHTML += `
        <div class="card">
          <img src="${song.image[2]['#text']}" />
          <h3>${song.name}</h3>
          <p>Artist: ${song.artist.name}</p>
        </div>
      `;
    });

  } catch (error) {
    console.log("Error fetching similar songs");
  }
}

// ENTER KEY SUPPORT
document.getElementById("songInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    searchSong();
  }
});