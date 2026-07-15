let song = '';
let formats = [0, 1, 2, 3]
let format = formats[0];
let TRANSPOSE = 0;

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


function drawSong(){
	switch(format){
		case 0:
			renderSong(song);
			break;
		case 1:
			toggleChords();
			break;
		case 2:
			toggleChords();
			break;
		case 3:
			break;
	}
}


function parseLine(line, withChords = true) {

    let chords = []
    let text = ""
    let pos = 0

    for (let i = 0; i < line.length; i++) {

        if (line[i] === "[") {

            let end = line.indexOf("]", i)
            let raw = line.slice(i + 1, end)

            if (withChords) {
                let parts = raw.split(" ").filter(x => x)

                for (let p of parts) {
                    chords.push({
                        name: p,
                        pos: pos
                    })
                }
            }

            i = end
        } else {
            text += line[i]
            pos++
        }
    }

    return { text, chords }
}


const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "B", "H"]

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




function renderLine(row) {

    row.chords = row.chords || []

    let chordsHTML = ""

    for (let chord of row.chords) {

        let newChord = transposeChord(chord.name, TRANSPOSE)

        chordsHTML += `
        <span class="chord" style="left:${chord.pos}ch">
            ${newChord}
        </span>`
    }

    return `
    <div class="line ${row.chords.length ? "has-chords" : "no-chords"}">
        ${row.chords.length ? `<div class="chords">${chordsHTML}</div>` : ""}
        <div class="lyrics">${row.text || "&nbsp;"}</div>
    </div>`
}

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


function renderSettings() {

	let transposeSign = (TRANSPOSE > 0) ? '+' : (TRANSPOSE == 0)? ' ' : '';

    document.getElementById("settings").innerHTML = `
        <p>
            <button onclick="changeKey(-2)">-2</button>
            <button onclick="changeKey(-1)">-1</button>`
			+` ${transposeSign}${TRANSPOSE} ` +
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

    return result
}



function copySong() {

    let text = buildCopyText(song)

    navigator.clipboard.writeText(text)
}


function renderSong(song) {

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






