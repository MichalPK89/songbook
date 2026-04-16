 

function parseLine(line) {

    let chords = []
    let text = ""
    let textPos = 0

    for (let i = 0; i < line.length; i++) {

        if (line[i] === "[") {

            let end = line.indexOf("]", i)
            let chordText = line.slice(i + 1, end)

			// split multiple chords like [A B]
			let chordNames = chordText.split(" ")

			for (let name of chordNames) {
				if (name.trim() !== "") {
					chords.push({
						name: name.trim(),
						pos: textPos
					})
				}
			}

            i = end
        } else {

            text += line[i]
            textPos++
        }
    }

    return {
        text: text,
        chords: chords
    }
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
}

function resetKey() {
    TRANSPOSE = 0
    renderSong(song)
}


function renderSong(song) {

    let lines = song.split("\n")
    let html = ""

    for (let line of lines) {
	
		if (line.trim() == ""){
			html += `<div class="line no-chords"><div class="lyrics">&nbsp;</div></div>`
			continue
			}

        let parsed = parseLine(line)
        html += renderLine(parsed)

    }

    document.getElementById("song").innerHTML = html;
	
	
}

<!-- pridaj popis k autorom -->

document.getElementById("music").innerHTML = "hudba: " + document.getElementById("music").innerHTML;
document.getElementById("lyrics").innerHTML = "text: " + document.getElementById("lyrics").innerHTML;

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




