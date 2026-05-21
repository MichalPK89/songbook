function createSongList(paramsH, paramsD) {
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
  row.appendChild(cell);

  for (i=0; i<paramsH.length; i++) {
	
  var cell = document.createElement("TH");
  var text = document.createTextNode([paramsH[i]]);
  cell.appendChild(text);
  row.appendChild(cell);

  }
  
  x.appendChild(row);
  
  for (song in songs) {
		
		var row = document.createElement("TR");
		
		var cell = document.createElement("TD");
		var a = document.createElement("a");
		var text = document.createTextNode(songs[song].title);
		a.appendChild(text);
		a.title = "odkaz";
		a.href = folder + "/" + song + ".html";
		cell.appendChild(a);
		row.appendChild(cell);
		
		for (i=0; i<paramsD.length; i++) {
		
		var cell = document.createElement("TD");
		var text = document.createTextNode(songs[song][paramsD[i]]);
		cell.appendChild(text);
		row.appendChild(cell);
		}		
		
		x.appendChild(row);
      }

  
  document.getElementById("list").innerHTML = list;  
}

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
