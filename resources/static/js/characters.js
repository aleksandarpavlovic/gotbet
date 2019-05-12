const fetchAPIUrl = "/api/characters";

const charactersTable = document.getElementById("characterstable").tBodies[0];
let dataTimestamp = -1;

poll();

function poll() {
	let request = new XMLHttpRequest();
	request.onload = function() {
		if (this.status == 200) {
			let response = JSON.parse(this.responseText);
			populateView(response.data);
			dataTimestamp = response.dataTimestamp;
		}
		poll();
    };
    let url = fetchAPIUrl;
    if (dataTimestamp >= 0)
        url = url + "?dataTimestamp=" + dataTimestamp;
	request.open("GET", url);
    request.setRequestHeader("Content-type", "application/json");
    request.send();
}

function populateView(data) {
    if (data) {
        while(charactersTable.firstChild) charactersTable.removeChild(charactersTable.firstChild);
        data.forEach(function(item, index) {
            let row = charactersTable.insertRow(index);
            let nameCell = row.insertCell(0);
            nameCell.innerHTML = item.name;
            nameCell.style.width = "70%";
            let statusCell = row.insertCell(1);
            statusCell.innerHTML = item.status;
            statusCell.style.width = "30%";
        });
    }
}