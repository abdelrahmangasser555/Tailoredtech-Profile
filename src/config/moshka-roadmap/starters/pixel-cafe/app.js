let total = 0
const label = document.getElementById("total")

document.querySelectorAll("button[data-price]").forEach((btn) => {
  btn.addEventListener("click", () => {
    total += Number(btn.dataset.price)
    label.textContent = String(total)
  })
})
