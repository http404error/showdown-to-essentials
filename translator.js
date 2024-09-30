const BattleStatIDs = {
	HP: 'hp',
	hp: 'hp',
	Atk: 'atk',
	atk: 'atk',
	Def: 'def',
	def: 'def',
	SpA: 'spa',
	SAtk: 'spa',
	SpAtk: 'spa',
	spa: 'spa',
	spc: 'spa',
	Spc: 'spa',
	SpD: 'spd',
	SDef: 'spd',
	SpDef: 'spd',
	spd: 'spd',
	Spe: 'spe',
	Spd: 'spe',
	spe: 'spe',
};

function importTeams(buffer) {
  var text = buffer.split("\n");
  var team = [];
  var curSet = null;

  for (var i = 0; i < text.length; i++) {
    var line = text[i].trim();
    if (line === '' || line === '---') {
      curSet = null;
    } else if (!curSet) {
      curSet = { name: '', species: '', gender: '', level: 100, ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 } };
      team.push(curSet);
      var atIndex = line.lastIndexOf(' @ ');
      if (atIndex !== -1) {
        curSet.item = line.substr(atIndex + 3);
        //if (toID(curSet.item) === 'noitem') curSet.item = '';
        line = line.substr(0, atIndex);
      }
      if (line.substr(line.length - 4) === ' (M)') {
        curSet.gender = 'male';
        line = line.substr(0, line.length - 4);
      }
      if (line.substr(line.length - 4) === ' (F)') {
        curSet.gender = 'female';
        line = line.substr(0, line.length - 4);
      }
      var parenIndex = line.lastIndexOf(' (');
      if (line.substr(line.length - 1) === ')' && parenIndex !== -1) {
        line = line.substr(0, line.length - 1);
        //curSet.species = Dex.species.get(line.substr(parenIndex + 2)).name;
        curSet.species = line.substr(parenIndex + 2);
        line = line.substr(0, parenIndex);
        curSet.name = line;
      } else {
        //curSet.species = Dex.species.get(line).name;
        curSet.species = line;
        curSet.name = '';
      }
    } else if (line.substr(0, 7) === 'Trait: ') {
      line = line.substr(7);
      curSet.ability = line;
    } else if (line.substr(0, 9) === 'Ability: ') {
      line = line.substr(9);
      curSet.ability = line;
    } else if (line === 'Shiny: Yes') {
      curSet.shiny = true;
    } else if (line.substr(0, 7) === 'Level: ') {
      line = line.substr(7);
      curSet.level = +line;
    } else if (line.substr(0, 11) === 'Happiness: ') {
      line = line.substr(11);
      curSet.happiness = +line;
    } else if (line.substr(0, 10) === 'Pokeball: ') {
      line = line.substr(10);
      curSet.pokeball = line;
    } else if (line.substr(0, 14) === 'Hidden Power: ') {
      line = line.substr(14);
      curSet.hpType = line;
    } else if (line.substr(0, 11) === 'Tera Type: ') {
      line = line.substr(11);
      curSet.teraType = line;
    } else if (line.substr(0, 15) === 'Dynamax Level: ') {
      line = line.substr(15);
      curSet.dynamaxLevel = +line;
    } else if (line === 'Gigantamax: Yes') {
      curSet.gigantamax = true;
    } else if (line.substr(0, 5) === 'EVs: ') {
      line = line.substr(5);
      var evLines = line.split('/');
      curSet.evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
      for (var j = 0; j < evLines.length; j++) {
        var evLine = evLines[j].trim();
        var spaceIndex = evLine.indexOf(' ');
        if (spaceIndex === -1) continue;
        var statid = BattleStatIDs[evLine.substr(spaceIndex + 1)];
        var statval = parseInt(evLine.substr(0, spaceIndex), 10);
        if (!statid) continue;
        curSet.evs[statid] = statval;
      }
    } else if (line.substr(0, 5) === 'IVs: ') {
      line = line.substr(5);
      var ivLines = line.split(' / ');
      curSet.ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
      for (var j = 0; j < ivLines.length; j++) {
        var ivLine = ivLines[j];
        var spaceIndex = ivLine.indexOf(' ');
        if (spaceIndex === -1) continue;
        var statid = BattleStatIDs[ivLine.substr(spaceIndex + 1)];
        var statval = parseInt(ivLine.substr(0, spaceIndex), 10);
        if (!statid) continue;
        if (isNaN(statval)) statval = 31;
        curSet.ivs[statid] = statval;
      }
    } else if (line.match(/^[A-Za-z]+ (N|n)ature/)) {
      var natureIndex = line.indexOf(' Nature');
      if (natureIndex === -1) natureIndex = line.indexOf(' nature');
      if (natureIndex === -1) continue;
      line = line.substr(0, natureIndex);
      if (line !== 'undefined') curSet.nature = line;
    } else if (line.substr(0, 1) === '-' || line.substr(0, 1) === '~') {
      line = line.substr(1);
      if (line.substr(0, 1) === ' ') line = line.substr(1);
      if (!curSet.moves) curSet.moves = [];
      if (line.substr(0, 14) === 'Hidden Power [') {
        // var hptype = line.substr(14, line.length - 15);
        // line = 'Hidden Power ' + hptype;
        // var type = Dex.types.get(hptype);
        // if (!curSet.ivs && type) {
        //   curSet.ivs = {};
        //   for (var stat in type.HPivs) {
        //     curSet.ivs[stat] = type.HPivs[stat];
        //   }
        // }
      }
      if (line === 'Frustration' && curSet.happiness === undefined) {
        curSet.happiness = 0;
      }
      curSet.moves.push(line);
    }
  }
  return team;
}


function to_sym(str) {
  return str.toUpperCase().replaceAll(/[^0-9a-z]/gi, '');
}

function poke_to_essentials(p) {
  output = ""
  output += "Pokemon = "+to_sym(p.species)+","+p.level+"\n";
  if (p.name) {
    output += "    Name = "+p.name+"\n";
  }
  var move_str = p.moves.map(to_sym).join(",");
  output += "    Moves = "+move_str+"\n";
  if (p.ability) {
    output += "    Ability = "+to_sym(p.ability)+"\n";
  }
  if (p.item) {
    output += "    Item = "+to_sym(p.item)+"\n";
  }
  if (p.gender) {
    output += "    Gender = "+p.gender+"\n";
  }
  if (p.nature) {
    output += "    Nature = "+to_sym(p.nature)+"\n";
  }
  if (p.ivs) {
    var iv_array = [p.ivs['hp'],p.ivs['atk'],p.ivs['def'],p.ivs['spe'],p.ivs['spa'],p.ivs['spd']];
    output += "    IV = "+iv_array.join(",")+"\n";
  }
  if (p.evs) {
    var iv_array = [p.evs['hp'],p.evs['atk'],p.evs['def'],p.evs['spe'],p.evs['spa'],p.evs['spd']];
    output += "    EV = "+iv_array.join(",")+"\n";
  }
  if (p.shiny) {
    output += "    Shiny = true\n";
  }
  if (p.pokeball) {
    output += "    Ball = "+to_sym(p.pokeball)+"\n";
  }
  return output;
}

function convert() {
  team = importTeams(document.getElementById("showdown-text").value)
  output = ""

  for (var i = 0; i < team.length; i++) {
    output += poke_to_essentials(team[i]);
  }

  document.getElementById("essentials-text").value = output;
}

document.getElementById("convert").addEventListener('click', convert);
