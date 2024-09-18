function convert() {
  text = document.getElementById("showdown-text").value

  const speciesItemFind = /^(.*) ?@ ?(.*)$/g
  text = text.replaceAll(speciesItemFind, /Pokemon = $1\n    Item = $2\n/)
  const abilityFind = /^Ability: ?(.*)$/g
  text = text.replaceAll(abilityFind, /    Ability = $1\n/)
  const evsFind = /^EVs: (.*)$/g
  text = text.replaceAll(evsFind, /    EVs = $1\n/)
  const natureFind = /^(.*) Nature$/g
  text = text.replaceAll(natureFind, /    Nature = $1\n/)
  const moveFind = /^- (.*)[\n- (.*)]?[\n- (.*)]?[\n- (.*)]?/g
  text = text.replaceAll(moveFind, /    Moves = $1,$2,$3,$4\n/)

  document.getElementById("essentials-text").value = text
}

document.getElementById("convert").addEventListener('click', convert)
