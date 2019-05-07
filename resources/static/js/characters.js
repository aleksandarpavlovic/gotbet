const ticketPageUrl = "http://localhost:3000/api/characters";
dataTimestamp = 0;

const charactersTable = document.getElementById("characterstable").tBodies[0];

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
	request.open("GET", ticketPageUrl+"?dataTimestamp=" + dataTimestamp);
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