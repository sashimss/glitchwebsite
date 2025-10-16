import { getCookie } from "cookies-next";

// Map game names to IDs
const gameMap: Record<string, number> = {
  Topdown: 1,
  Runner: 2,
  Puzzle: 3,
  Shooter: 4,
  Maze: 5,
};

export const submitScore = async () => {
  try {
    const token = getCookie("authToken");
    const uid = getCookie("uid"); 
    if (!token || !uid) {
      console.error("User not authenticated or UID missing");
      return;
    }

    const payload = (window as any).get_payload?.(); // Unity payload
    if (!payload || !payload.encrypted || !payload.gameName) {
      console.error("Invalid payload from Unity");
      return;
    }

    const gameId = gameMap[payload.gameName];
    if (!gameId) {
      console.error("Unknown gameName:", payload.gameName);
      return;
    }

    // Send to backend
    const res = await fetch("/api/submit-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        data: payload.encrypted, 
        gameId // send mapped gameId to backend
      }),
    });

    const result = await res.json();
    if (!res.ok) console.error("Failed to submit score:", result.error);
    else console.log("Score submitted successfully:", result.message);

  } catch (err) {
    console.error("Error submitting score:", err);
  }
};
