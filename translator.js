function convert() {
  text = document.getElementById("showdown-text").value

  text = text.replaceAll('hello', 'goodbye')

  document.getElementById("essentials-text").value = text
}

document.getElementById("convert").addEventListener('click', convert)
