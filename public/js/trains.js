var stations = 'http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML'
var proxyUrl = 'https://cors-anywhere.herokuapp.com/'
var targetUrl = 'http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByCodeXML?StationCode='
parser = new DOMParser();

async function getXMLData(url) {
    let response = await fetch(url);
    let data = await response.text()
    return data;
}

function showStations(url) {
    getXMLData(proxyUrl + url)
        .then(function (data) {
            var XMLData = parser.parseFromString(data, "text/xml")
            displayStations(XMLData)
        });
}

function fetchXML(url) {
    getXMLData(proxyUrl + url)
        .then(function (data) {
            var XMLData = parser.parseFromString(data, "text/xml")
            displayTrains(XMLData)
        });
}

function getStationInfo(row) {
    document.getElementsByClassName('modal-header')[0].childNodes[3].innerHTML = 'Train Times For ' + row.childNodes[0].innerHTML
    fetchXML(targetUrl + row.childNodes[1].innerHTML)
}

function displayStations(data) {
    data = data.childNodes[0]
    var tableData = ''
    for (var i = 0; i < data.childElementCount; i++) {
        if (i % 2 == 1) {
            tableData += '<tr onclick="getStationInfo(this)"><td>' + data.childNodes[i].childNodes[1].innerHTML + '</td><td>' + data.childNodes[i].childNodes[9].innerHTML + '</td></tr>'
        }
    }
    var table = '<table><tr> <th>Station</th> <th>Code</th> </tr>' + tableData + '</table>'
    document.getElementById('table').innerHTML = table
}

function displayTrains(data) {
    var tableData = ''
    data = data.childNodes[0].childNodes
    for (var i = 0; i < data.length; i++) {

        if (data[i].tagName == 'objStationData') {
            for (var j = 0; j < data[i].childNodes.length; j++) {
                console.log(data[i].childNodes[j].tagName)
                if (data[i].childNodes[j].tagName == 'Origin') {
                    tableData += '<tr><td>' + data[i].childNodes[j].innerHTML + '</td>'
                }
                if (data[i].childNodes[j].tagName == 'Destination') {
                    tableData += '<td>' + data[i].childNodes[j].innerHTML + '</td>'
                }
                if (data[i].childNodes[j].tagName == 'Duein') {
                    tableData += '<td>' + data[i].childNodes[j].innerHTML + '</td>'
                }
                if (data[i].childNodes[j].tagName == 'Late') {
                    tableData += '<td>' + data[i].childNodes[j].innerHTML + '</td>'
                }
                if (data[i].childNodes[j].tagName == 'Scharrival') {
                    var time = data[i].childNodes[j].innerHTML
                    if (time === '00:00') {
                        time = "-"
                    }
                    tableData += '<td>' + time + '</td>'
                }
                if (data[i].childNodes[j].tagName == 'Schdepart') {
                    var time = data[i].childNodes[j].innerHTML
                    if (time === '00:00') {
                        time = '-'
                    }
                    tableData += '<td>' + time + '</td></tr>'
                }
            }
        }
    }
    console.log(tableData)
    var table = '<table><tr> <th>Origin</th> <th>Destination</th> <th>Duein</th> <th>Late</th> <th>Arrive</th> <th>Depart</th> </tr>' + tableData + '</table>'
    console.log(table)
    if (tableData === '') {
        document.getElementsByClassName('modal-body')[0].innerHTML = '<p>No Upcoming Trains To Show</p>'
    } else {
        document.getElementsByClassName('modal-body')[0].innerHTML = table
    }

    var modal = document.getElementById('trainTimes')
    modal.style.display = 'block';
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

showStations(stations)