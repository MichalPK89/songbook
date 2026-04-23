const songs = {
  cervena_reka: {
    title: "Červená řeka",
    file: "cervena_reka.html",
    author: "tradicionál",
    lyrics: "Ivo Fischer",
    genre: "folk"
  },

  Other_song: {
    title: "Name",
    author: "autor",
    genre: "rock",
    file: "Other_song.html"
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


let TRANSPOSE = 0 // change this

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
    renderTransposer()
}

function resetKey() {
    TRANSPOSE = 0
    renderSong(song)
    renderTransposer()
}

let showChords = true;

function toggleChords() {
    showChords = !showChords
    renderSong(song)
    renderTransposer()
}


function renderSettings() {

    document.getElementById("settings").innerHTML = `
        <p>
            <button onclick="changeKey(-2)">-2</button>
            <button onclick="changeKey(-1)">-1</button>
            <button onclick="changeKey(1)">+1</button>
            <button onclick="changeKey(2)">+2</button>
            <button onclick="resetKey()">Reset</button>
            &nbsp;
            <button onclick="toggleChords()">Akordy</button>
            <button onclick="copySong()">Copy</button>
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

function loadSong(key) {
    const s = songs[key]
    window.location.href = s.file + "?song=" + key
}

function initPage() {
    const key = getSongKey()

    if (!key || !songs[key]) return

    const s = songs[key]

    document.getElementById("info").innerHTML = `
        <h3>${s.title}</h3>
        <p>${s.author} • ${s.genre}</p>
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

<!-- renderuj text a akordy-->
renderSong(song);




