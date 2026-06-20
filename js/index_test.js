fetch(index)
    .then(response => response.json())
    .then(songs => {
		
		document.getElementById("list").innerHTML = createSongList(columnNames, columns, songs);
        /*createSongList(columnNames, columns);*/
    });


if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register("../js/sw.js");

}



async function downloadOffline() {

    const cache = await caches.open("songbook-v1");

    // základné súbory
    let files = [
        "/",
        "moderne/index.html",
        "moderne/songs.html",
        "moderne/json/songs.json",
        "css/style.css",
        "js/index_test.js",
        "js/songbook_test.js"
    ];

    // načítanie song listu
    const response = await fetch("moderne/json/songs.json");

    const songs = await response.json();

    // pridaj všetky txt
    Object.values(songs).forEach(song => {

        files.push(song.lyricsFile);

    });

    await cache.addAll(files);

    alert("Offline cache aktualizovaná.");
}




function createSongList(paramsH, paramsD, index) {
  let list = "";
  var x = document.createElement("TABLE");
  x.setAttribute("id", "index");
 
  var tbody = document.createElement("tbody");
  x.appendChild(tbody);
  document.body.appendChild(x);
  
  
  var row = document.createElement("TR");
  
  var cell = document.createElement("TH");
  var text = document.createTextNode("Názov");
  cell.appendChild(text);
  cell.onclick = () => sortTable(0);
  row.appendChild(cell);

  for (i=0; i<paramsH.length; i++) {
  let sort = i + 1; 
  var cell = document.createElement("TH");
  var text = document.createTextNode([paramsH[i]]);
  cell.appendChild(text);
  cell.onclick = () => sortTable(sort);
  row.appendChild(cell);

  }
  
  x.appendChild(row);
  
  for (song in index) {
		
		var row = document.createElement("TR");
		
		var cell = document.createElement("TD");
		var a = document.createElement("a");
		var text = document.createTextNode(index[song].title);
		a.appendChild(text);
		a.title = "odkaz";
		a.href = "songs.html" + "?id=" + song;
		cell.appendChild(a);
		row.appendChild(cell);
		
		for (i=0; i<paramsD.length; i++) {
		
		var cell = document.createElement("TD");
		var text = document.createTextNode(index[song][paramsD[i]]);
		cell.appendChild(text);
		row.appendChild(cell);
		}		
		
		x.appendChild(row);
      }

  
  /*document.getElementById("list").innerHTML = obj;*/
}



function filterTable() {
	
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("filter");
  filter = input.value.toUpperCase();
  table = document.getElementById("index");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
	let all_columns = tr[i].getElementsByTagName("td");
	for(j=0; j<all_columns.length; j++){
	if (all_columns[j]){
		let column_value = all_columns[j].textContent || all_columns[j].innerText;
        column_value = column_value.toUpperCase();
        if(column_value.indexOf(filter) > -1){
            tr[i].style.display = "";
			break;
         } else {
           tr[i].style.display = "none"; 
		}
      }
    }       
  }
}

/* zaloha povodneho filtra na pvry stlpec
function filterTable() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("filter");
  filter = input.value.toUpperCase();
  table = document.getElementById("index");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}
*/


function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("index");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc"; 
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;      
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
