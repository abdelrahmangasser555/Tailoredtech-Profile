document.getElementById("rows").addEventListener("click", (event) => {
  const row = event.target.closest("tr")
  if (!row) return
  console.log("selected", row.firstElementChild.textContent)
})
