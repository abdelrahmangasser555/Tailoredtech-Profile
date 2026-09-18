const scores = { home: 0, away: 0 }

function render() {
  document.getElementById("home").textContent = String(scores.home)
  document.getElementById("away").textContent = String(scores.away)
}

document.querySelectorAll("button[data-team]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const team = btn.dataset.team
    const delta = Number(btn.dataset.delta)
    scores[team] = Math.max(0, scores[team] + delta)
    render()
  })
})
