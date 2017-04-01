let txt_city = document.getElementById('txt_city');
let btn_search = document.getElementById('btn_search');
let lat, lon, place_name;
btn_search.onclick = function () {
    if (txt_city.value == '') {
        alert('Please enter city name...');
        txt_city.focus();
    }
    var wObject;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            wObject = JSON.parse(this.responseText);
            //document.getElementById('demo').innerHTML = this.responseText;
            lon = wObject[0].lon;
            lat = wObject[0].lat;
            place_name = wObject[0].display_name;

            document.getElementById('longitude').value = lon;
            document.getElementById('latitude').value = lat;
            document.getElementById('place_name').value = place_name;
            wxmlhttp.open('GET', 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=f21b1d6145eaf5874b227a81227a5854', true);
            wxmlhttp.send();
            fxmlhttp.open('GET', 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + lat + '&lon=' + lon + '&cnt=6&appid=f21b1d6145eaf5874b227a81227a5854', true);
            fxmlhttp.send();
        }
    };

    xmlhttp.open('GET', 'http://locationiq.org/v1/search.php?key=f606af3e7bca08821da7&format=json&q=' + txt_city.value, true);
    xmlhttp.send();

    let wxmlhttp = new XMLHttpRequest();
    wxmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            wdata = JSON.parse(this.responseText);
            var w = document.getElementsByClassName('weather')[0];
            w.innerText = '';
            var wul = document.createElement('ul');
            w.appendChild(wul);
            addwli(wul, "Weather", wdata.weather[0].main, wdata.weather[0].description);
            addwli(wul, "Temperature", (Math.round(wdata.main.temp - 273.15, 0)) + '&deg;C');
            addwli(wul, "Pressure", wdata.main.pressure + ' hpa');
            addwli(wul, "Humidity", wdata.main.humidity + '%');
            addwli(wul, "Min Temperature", (Math.round(wdata.main.temp_min - 273.15, 0)) + '&deg;C');
            addwli(wul, "Max Temperature", (Math.round(wdata.main.temp_max - 273.15, 0)) + '&deg;C');
            addwli(wul, "Wind Speed", wdata.wind.speed + ' km/h', wdata.wind.deg);
            document.getElementById('wimg').src = 'img/' + wdata.weather[0].icon + '.png';
        }
    };

    //forecast next 5 days
    let fxmlhttp = new XMLHttpRequest();
    fxmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            fdata = JSON.parse(this.responseText);
            var f = document.getElementsByClassName('forecast')[0];
            while (f.rows.length > 0) {
                f.deleteRow(0);
            }
            addtr(f, fdata);
        }
    };

};

//row
function addwli(element, heading, data, subdata) {
    //subdata = subdata | '';
    let wli = document.createElement('li');
    let wem = document.createElement('em');
    wem.innerHTML = heading;
    let wspan = document.createElement('span')
    wspan.innerHTML = data;
    if (!(typeof subdata === 'undefined')) {
        var wkbd = document.createElement('kbd');
        wkbd.innerHTML = subdata;
        wspan.appendChild(wkbd);
    }
    wli.appendChild(wem);
    wli.appendChild(wspan);
    element.appendChild(wli);
}
function addtr(f, fdata) {
    let columns = ['Date', 'Min Temp', 'Max Temp', 'Pressure', 'Humidity', 'Weather', 'Image'];
    for (var a = 0; a < fdata.list.length; a++) {

        if (a == 0) {
            let tr = document.createElement('tr');
            for (var b = 0; b <= 6; b++) {
                var th = document.createElement('th');
                th.innerHTML = columns[b];
                tr.appendChild(th);
            }
            f.appendChild(tr);
        }
        else {
            let tr = document.createElement('tr');
            //columns
            let td0 = document.createElement('td');
            td0.innerHTML = (new Date(fdata.list[a].dt * 1000)).toDateString();
            tr.appendChild(td0);


            //min temp
            let td1 = document.createElement('td');
            td1.innerHTML = Math.round(fdata.list[a].temp.min - 273.15, 0) + '&deg;C';
            tr.appendChild(td1);

            //max temp
            let td2 = document.createElement('td');
            td2.innerHTML = Math.round(fdata.list[a].temp.max - 273.15, 0) + '&deg;C';
            tr.appendChild(td2);

            //pressure
            let td3 = document.createElement('td');
            td3.innerHTML = fdata.list[a].pressure + ' hpa';
            tr.appendChild(td3);

            //humidity
            let td4 = document.createElement('td');
            td4.innerHTML = fdata.list[a].humidity + '%';
            tr.appendChild(td4);

            //weather
            let td5 = document.createElement('td');
            td5.innerHTML = fdata.list[a].weather[0].main + ' <kbd>' + fdata.list[a].weather[0].description + '</kbd>';
            tr.appendChild(td5);

            //Image
            let td6 = document.createElement('td');
            let icon = document.createElement('img');
            icon.src = 'img/' + fdata.list[a].weather[0].icon + '.png';
            td6.appendChild(icon);
            tr.appendChild(td6);

            f.appendChild(tr);
        }
    }
}
