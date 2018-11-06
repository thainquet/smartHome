let token = sessionStorage.getItem("token");
let hostAPI = "https://k61iotlab.ddns.net:3001/api/";

function loadChoice() {
    let temp = ``;
    temp += `<div>
    <form>
        <div class="form-group row">
                <div class="col-md-3">
                        <div class="setCenter">
                            <button type="button" class="btn btn-primary" onclick="loadHome()"> Choose home</button>
                        </div>
                        <label></label>
                        <select class="form-control" id="homelist">

                        </select>
                        <br>
                    </div>
            <div class="col-md-3">
                <div class="setCenter">
                    <button type="button" class="btn btn-primary" onclick="loadRoom()"> Choose room</button>
                </div>
                <label></label>
                <select class="form-control" id="room">

                </select>
                <br>
            </div>
            <div class="col-md-3">
                <div class="setCenter">
                    <button type="button" class="btn btn-primary" onclick="loadDevice()"> Choose device of room: <span
                            id="roomSe"></span></button>
                </div>

                <label></label>
                <div>
                <select class="form-control" id="device">

                </select>
                </div>
                <br>
            </div>
            <div class="col-md-3">

                <div class="setCenter">
                    <button type="button" class="btn btn-primary" onclick="loadDeviceDetails()">Details of <span
                            id="deviName"></span></button>
                </div>


            </div>
        </div>
    </form>
</div>`
    document.getElementById("choice").innerHTML = temp;


}

function loadHome() {
    let URL = hostAPI + "data?token=" + token;
    fetch(URL)
        .then(
            response => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                response.json().then(function (res) {
                    let temp = ``;
                    res.data.forEach(i => {
                        temp += `<option>${i.home_id}</option>`;
                    })
                    document.getElementById("homelist").innerHTML = temp;
                    return temp;
                })
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

function loadRoom() {
    var e = document.getElementById("homelist");
    var homeid = e.options[e.selectedIndex].value;
    let URL = hostAPI + "data/home/" + homeid + "?token=" + token
    fetch(URL)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                // Examine the text in the response  
                response.json().then(function (res) {
                    if (res.data.length == 0) {
                        alert("No room in this home, please choose another home!!")
                    } else {
                        let temp = ``;
                        res.data.forEach(i => {
                            temp += `<option>${i.room_name}</option>`;
                            sessionStorage.setItem(i.room_name, i.room_id);
                        });

                        document.getElementById("room").innerHTML = temp;
                    }
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

function loadDevice() {
    var h = document.getElementById("homelist");
    var homeid = h.value;
    var e = document.getElementById("room");
    var temp = e.value;
    let roomId = sessionStorage.getItem(`${temp}`);
    var f = document.getElementById("homelist");
    var homeid = f.options[f.selectedIndex].value;
    let URL = hostAPI + "data/home/" + homeid + "/room/" + roomId + "?token=" + token
    fetch(URL)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                // Examine the text in the response  
                response.json().then(function (res) {
                    if (res.data.length == 0) {
                        alert("No device in this room, please choose another room!")
                    } else {
                        document.getElementById("roomSe").innerHTML = `${roomId}`;
                        let temp = ``;
                        let count = 1;
                        res.data.forEach(i => {
                            temp += `<option>${i.device_type}</option>`;
                            sessionStorage.setItem("device " + count++, i.mac_ipnode);
                        });

                        document.getElementById("device").innerHTML = temp;
                    }
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

function loadDeviceDetails() {
    var e = document.getElementById("room");
    var roomId = e.options[e.selectedIndex].value;
    var f = document.getElementById("homelist");
    var homeid = f.options[f.selectedIndex].value;
    var g = document.getElementById("device");
    var device_type = g.value;
    let stt = g.selectedIndex +1;
    let mac_ipnode = sessionStorage.getItem(`device ${stt}`);
    let URL = hostAPI + "data/home/" + homeid + "/room/" + roomId + "/device_type/" + device_type + "/device_id/" + mac_ipnode + "/type/broker?token=" + token
    console.log(URL);
    fetch(URL, {
            method: "GET"
        })
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                response.json().then(function (res) {
                    document.getElementById("deviName").innerHTML = `${device_type}`;
                    let temp = ``;
                    let temp1 = ``;
                    let status = "";
                    let flag = "";
                    if (res.fulfilled.OperationStatus == true) {
                        status = "on";
                        flag = "off";
                    }
                    else {
                        status = "off";
                        flag = "on";
                    }
                    temp += `<li class="list-group-item list-group-item-info">Status: <span id="statusBulb">${status}</span></li>` +
                        `<li class="list-group-item list-group-item-info">Medium Capacity: <span id="ampeBulb">${res.fulfilled.MediumCapacity}</span></li>`
                    temp1 += `<button type="button" class="btn btn-success" onclick="loadChart()">Amperage and Voltage in last 24h</button>`
                    let temp3 = `<img src="https://www.w3schools.com/js/pic_bulbon.gif" alt="bub-on.png"></img>`;
                    let temp4 = `<img src="https://www.w3schools.com/js/pic_bulboff.gif" alt="bub-off.png"></img>`;
                    let temp5 = `<button type="button" class="btn btn-success" onclick="switchBulb()">Turn <span id="buttonBulb">${flag}</span></button>`;
                    document.getElementById("details").innerHTML = temp;
                    document.getElementById("chart").innerHTML = temp1;
                    document.getElementById("switch").innerHTML = temp5;
                    if (status == 'on') {
                        document.getElementById("bub").innerHTML = temp3;
                    } else {
                        document.getElementById("bub").innerHTML = temp4;
                    }
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

function loadChart() {
    window.location.assign('/home/24h')
}

function switchBulb() {
    var e = document.getElementById("room");
    var roomId = e.options[e.selectedIndex].value;
    var f = document.getElementById("homelist");
    var homeid = f.options[f.selectedIndex].value;
    var g = document.getElementById("device");
    var device_type = g.value;
    let stt = g.selectedIndex +1;
    let mac_ipnode = sessionStorage.getItem(`device ${stt}`);
    let status = document.getElementById("statusBulb").textContent;
    let change = 1;
    let flag = "";
    if (status == "on") {
        change = 0;
        flag = "off";
    }
    else {
        change = 1;
        flag = "on";
    }
    let URL = hostAPI + "command/home/" + homeid + "/room/" + roomId + "/device_type/" + device_type + "/device_id/" + mac_ipnode + "/switch/" + change +"?token=" + token
    console.log(URL);
    fetch(URL, {
        method: "POST"
    })
    .then(res => res.json())
    .then(res => {
        if (res.success = false) {
            alert("Please try again")
        } else {
            alert(`Turn ${flag} successfully!`);
            window.location.reload();
        }
    })
}
