const fetchDTOAPIUrl = "/api/tickets/dto";
const ticketPageUrl = "/tickets";

let dataTimestamp = -1;

// const ranksTable = $("#rankstable > tbody:last");
const ranksTable = document.getElementById("rankstable").tBodies[0];

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
    let url = fetchDTOAPIUrl;
    if (dataTimestamp >= 0)
        url = url + "?dataTimestamp=" + dataTimestamp;
	request.open("GET", url);
    request.setRequestHeader("Content-type", "application/json");
    request.send();
}

function populateView(data) {
    if (data) {
        while(ranksTable.firstChild) ranksTable.removeChild(ranksTable.firstChild);
        data.forEach(function(item, index) {
            let row = ranksTable.insertRow(index);
            let nameCell = row.insertCell(0);
            let a = document.createElement('a');
            a.setAttribute('href', ticketPageUrl + "/" + item.id);
            a.innerHTML = item.name;
            nameCell.appendChild(a);
            nameCell.style.width = "70%";
            let pointsCell = row.insertCell(1);
            pointsCell.innerHTML = item.points ? item.points : "-";
            pointsCell.style.width = "30%";
        });
    }
}