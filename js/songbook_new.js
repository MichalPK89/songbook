let song = '';
let formats = [0, 1, 2, 3]
let format = formats[0];
let TRANSPOSE = 0;

// init song page

async function initSongPage() {

    const params = new URLSearchParams(location.search);

    const songId = params.get("id");

    const songs = await fetch(index)
        .then(r => r.json());

    const songName = songs[songId];
   
    let author = "";
	if (songName.music === songName.lyrics){
		author = `<div id="author">hudba & text: ${songName.music}</div>`
	}
	else
	{author = `<div id="author">hudba: ${songName.music}</div>
		<div id="author">text: ${songName.lyrics}</div>`}
	

	document.getElementById("info").innerHTML = `
        <div id="title">${songName.title}</div> ` + author;
       
    
	const songFile = folder + songId + ".txt"
	
    const lyrics = await fetch(songFile)
        .then(r => r.text());

	song = lyrics;

    drawSong();
}

// Draw song based on format

function drawSong(){
	switch(format){
		case 0:
			renderSong(song);
			break;
		case 1:
			buildCopyText(song);
			break;
		case 2:
			toggleChords();
			break;
		case 3:
			break;
	}
}

// separate lyrics and chords

function parseLine(line) {
  let array = []
  let chords = ""
  let text = ""
  let sections = line.match(/\[[^\]]*\]|[^\[\]]+/g) || [];
	console.log("sections:" + sections);



  for (const [index, p] of sections.entries()){
     
    array.push({
        name: p,
        section: index,
        isChord: (p.substring(0,1) === "[")
      })
  }

 console.log("array" + array);
  // rozdeľ akordy, ak sú na jednej pozícií
  separateChordArray = array.flatMap(item => {
      if (item.isChord) {
          const match = item.name.match(/\[([^\]]+)\]/);

        if (match) {
            return match[1].trim().split(/\s+/).flatMap(chord => {
                const parts = chord.split("/");

                return parts.map((part, index) => ({
                    ...item,
                    name: `[${part}]`,
                    isBass: index > 0
                }));
            });
        }
    }

    return [item];
});


  for (s of separateChordArray){
    if (s.isChord){s.name=transposeChord(s.name.replace(/[\[\]]/g, ""), TRANSPOSE)}
  }

  let prev = 0;
  let prevIsChord = false;
  let consequentChordsDel = "";
  let chordsSpaces =0;
  let textSpaces =0;

  for (i = 0; i< separateChordArray.length; i++) {

   /*Počet medzier, ktoré treba nechať pred ďalším textom */
    chordsSpaces = Math.abs(chords.length - text.length)
    textSpaces = Math.abs(Math.max(chords.lastIndexOf(" "),-1) - text.length + 1);
  /* Pridaj hodnotu do akordov a textu*/
    if(separateChordArray[i].isBass){chords += "/"  + separateChordArray[i].name};
    if (i > 0 && separateChordArray[i].isChord && separateChordArray[i-1].isChord){chords += " "  + separateChordArray[i].name}
    else if (separateChordArray[i].isChord) {
      chords += " ".repeat(chordsSpaces) + separateChordArray[i].name} 
    else 
    {text += " ".repeat(textSpaces) + separateChordArray[i].name}

  
    }

  console.log("chords" + chords);
	console.log("text" + text);
  return {chords, text}

}



const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "B", "H"]

// transposing chords

function transposeChord(chord, shift) {

    // match root + rest (e.g. C#m7 → C# + m7)
    const match = chord.match(/^([A-H]#?)(.*)$/)

    if (!match) return chord

    let root = match[1]
    let suffix = match[2]

    let index = NOTES.indexOf(root)
    if (index === -1) return chord

    let newIndex = (index + shift) % NOTES.length
    if (newIndex < 0) newIndex += NOTES.length

    return NOTES[newIndex] + suffix
}

// render Line

function renderLine(row) {

    row.chords = row.chords || []

    let chordsHTML = ""

    return `
    <div class="line">
        ${row.chords.length ? `<div class="chords">${row.chords || "&nbsp;"}</div>` : ""}
        <div class="lyrics">${row.text || "&nbsp;"}</div>
    </div>`
}



// chord transposing

function changeKey(step) {
    TRANSPOSE += step
    renderSong(song)
    renderSettings();
}

function resetKey() {
    TRANSPOSE = 0
    renderSong(song);
    renderSettings();
}

let showChords = true;


// Change song format

function formatChange() {
	if (format< formats.length-1){
		format = formats[format+1]
	}
	else
	{
		format = formats[0];
	};
	drawSong();
}


function toggleChords() {
    showChords = !showChords
    renderSong(song)
    /*renderTransposer()*/
}


//render settings

function renderSettings() {

	let transposeSign = (TRANSPOSE > 0) ? '+' : (TRANSPOSE == 0)? '&nbsp' : '';
	let transposeShow = (TRANSPOSE == 0)? '&nbsp' : TRANSPOSE;

    document.getElementById("settings").innerHTML = `
        <p>
            <button onclick="changeKey(-2)">-2</button>
            <button onclick="changeKey(-1)">-1</button>`
			+` ${transposeSign}${transposeShow} ` +
            `<button onclick="changeKey(1)">+1</button>
            <button onclick="changeKey(2)">+2</button>
            <button onclick="resetKey()">Reset</button>
            &nbsp;
            <button onclick="formatChange()">Formát</button>
            <button onclick="copySong()">Copy</button>
			&nbsp
			<button onclick="window.location='index.html'">späť</button>
        </p>
    `
}



// Build Copy Text

function buildCopyText(song) {

    let lines = song.split("\n")
    let result = ""

    for (let line of lines) {

        let parsed = parseLine(line)

        let chordLine = []
        let lyricLine = parsed.text.split("")

        // build chord line with spacing
        for (let chord of parsed.chords) {

            let name = transposeChord(chord.name, TRANSPOSE)

            for (let i = 0; i < name.length; i++) {
                chordLine[chord.pos + i] = name[i]
            }
        }

        // fill empty spaces
        let maxLen = Math.max(lyricLine.length, chordLine.length)

        for (let i = 0; i < maxLen; i++) {
            if (!chordLine[i]) chordLine[i] = " "
            if (!lyricLine[i]) lyricLine[i] = " "
        }

        // add both lines
        if (parsed.chords.length > 0) {
            result += chordLine.join("") + "\n"
        }

        result += lyricLine.join("") + "\n"
    }
	document.getElementById("song").innerHTML = result
    return result
}


// Copy Song

function copySong() {

    let text = buildCopyText(song)

    navigator.clipboard.writeText(text)
}


// RenderSong

function renderSong(song) {
	console.log(song);
    let lines = song.split("\n")
    let html = ""

    for (let line of lines) {

        let parsed = parseLine(line, showChords)

        html += renderLine(parsed)
    }

    document.getElementById("song").innerHTML = html
}




<!-- pridaj info -->

function getFileName() {
    let path = window.location.pathname
    let file = path.split("/").pop()
	if (file.substring(file.length - 5) == ".html"){
		file = file;
    } else {
		file = file + ".html"
	}
	  return file
  }



function initPage() {
    
    const key = getFileName().replace(".html","");
	const song = songs[key];

    document.getElementById("info").innerHTML = `
        <div id="title">${song.title}</div>
        <div id="author">hudba: ${song.music}</div>
		<div id="author">text: ${song.lyrics}</div>
    `
}

<!-- pridaj transposer -->
function loadHTML(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data
        })
}
