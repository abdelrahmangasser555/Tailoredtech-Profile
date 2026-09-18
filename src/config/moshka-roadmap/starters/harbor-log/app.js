const form = document.getElementById("form")
const input = document.getElementById("text")
const list = document.getElementById("list")

form.addEventListener("submit", (event) => {
  event.preventDefault()
  const text = input.value.trim()
  if (!text) return
  const li = document.createElement("li")
  li.textContent = text
  list.prepend(li)
  input.value = ""
})
