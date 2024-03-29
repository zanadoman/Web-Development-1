var users = [];

var displayCount;
var displayFrom;
var displayTo;

function loadUsers() {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://reqres.in/api/users');
    xhr.onreadystatechange = function() {

        if (this.readyState !== 4) {
            return;
        }

        if (this.status === 200) {

            var response = JSON.parse(this.response).data;

            for (var i = 0; i < response.length; i++) {
                
                users[i] = response[i];
            }

            displayFrom = 0;
            displayTo = users.length;
            userCountSelector();
            initPageButtons();
            updatePageButtons();
            initNewUser();
            updateUsers();
        }
        else {

            console.log('User loading error: ' + this.status);
        }
    }
    xhr.send(null);
}

function updateUsers() {
    
    var from;
    var to;
    var allUsers = document.getElementById('allUsers');

    if (displayFrom < 0) {

        from = 0;
        to = displayTo;
    }
    else if (users.length < displayTo) {

        from = displayFrom;
        to = users.length;
    }
    else
    {
        from = displayFrom;
        to = displayTo;
    }

    var content = '';
    for (var i = from; i < to; i++) {

        content += `
            <div class="row">
                <div class="col avatar"><img src="${users[i].avatar}"></div>
                <div class="col-5 data">
                    <ul>
                        <li>Azonosító: ${users[i].id}</li>
                        <li>Név: <a id="name${i}" class="name" href="#singleUser">${users[i].last_name} ${users[i].first_name}</a></li>
                        <li>E-mail: ${users[i].email}</li>
                    </ul>
                </div>
                <div class="col buttons">
                    <button type="button" id="refresh${i}" class="btn btn-secondary">Frissítés</button>
                    <button type="button" id="delete${i}" class="btn btn-secondary">Törlés</button>
                </div>
            </div>
        `;
    }
    allUsers.innerHTML = content;
    document.getElementById('singleUser').innerHTML = '';

    initNameButtons(from, to);
    initRefreshButtons(from, to);
    initDeleteButtons(from, to);
}

function userCountSelector() {

    var selector = document.getElementById('selector');

    var options = `<option value="${users.length}">Összes felhasználó</option>`;
    for (var i = 0; i < users.length - 1; i++) {

        options += `<option value="${i + 1}">${i + 1}db felhasználó</option>`;
    }
    selector.innerHTML = options;

    displayCount = users.length;
    selector.addEventListener('change', function(event) {

        displayCount = event.target.value;
        displayFrom = 0;
        displayTo = displayCount;
        updatePageButtons();
        updateUsers();
    });
}

function initPageButtons() {

    var buttonPrevs = document.getElementsByClassName('buttonPrev');
    var buttonNexts = document.getElementsByClassName('buttonNext');

    for (var i = 0; i < buttonPrevs.length; i++) {

        buttonPrevs[i].addEventListener('click', function(event) {

            displayFrom = Number(displayFrom) - Number(displayCount);
            displayTo = Number(displayTo) - Number(displayCount);
            updatePageButtons();
            updateUsers();
        });
    }

    for (var i = 0; i < buttonNexts.length; i++) {

        buttonNexts[i].addEventListener('click', function(event) {

            displayFrom = Number(displayFrom) + Number(displayCount);
            displayTo = Number(displayTo) + Number(displayCount);
            updatePageButtons();
            updateUsers();
        });
    }
}

function updatePageButtons() {

    var buttonPrevs = document.getElementsByClassName('buttonPrev');
    var buttonNexts = document.getElementsByClassName('buttonNext');

    if (displayFrom <= 0) {

        for (var i = 0; i < buttonPrevs.length; i++) {

            buttonPrevs[i].disabled = true;
            buttonPrevs[i].classList.add('disabled');
        }
    }
    else {

        for (var i = 0; i < buttonPrevs.length; i++) {

            buttonPrevs[i].disabled = false;
            buttonPrevs[i].classList.remove('disabled');
        }
    }

    if (users.length <= displayTo) {

        for (var i = 0; i < buttonNexts.length; i++) {

            buttonNexts[i].disabled = true;
            buttonNexts[i].classList.add('disabled');
        }
    }
    else {

        for (var i = 0; i < buttonPrevs.length; i++) {

            buttonNexts[i].disabled = false;
            buttonNexts[i].classList.remove('disabled');
        }
    }
}

function initNameButtons(from, to) {

    var buttons = [];

    for (var i = from; i < to; i++) {

        buttons[i] = document.getElementById(`name${i}`);
    }

    for (var i = from; i < to; i++) {

        buttons[i].addEventListener('click', function(event) {

            for (var j = 0; j < buttons.length; j++) {

                if (buttons[j] == this) {

                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', `https://reqres.in/api/users/${j + 1}`);
                    xhr.onreadystatechange = function() {

                        if (this.readyState !== 4) {
                            return;
                        }
                
                        if (this.status === 200) {
                
                            var response = JSON.parse(this.response).data;
                
                            var singleUser = document.getElementById('singleUser');
                            content = `
                                <div class="userCard">
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-4 avatar"><img src="${response.avatar}"></div>
                                            <div class="col data">
                                                <ul>
                                                    <li>Azonosító: ${response.id}</li>
                                                    <li>Név: ${response.last_name} ${response.first_name}</li>
                                                    <li>E-mail: ${response.email}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                <div>
                            `;
                            singleUser.innerHTML = content;
                        }
                        else if (this.status === 404) {

                            window.alert(`A felhasználó nem létezik vagy törölve lett.`);
                        }
                        else {

                            console.log('User card loading error: ' + this.status);
                        }
                    }
                    xhr.send(null);

                    break;
                }
            }
        });
    }
}

function initRefreshButtons(from, to) {

    var buttons = [];

    for (var i = from; i < to; i++) {

        buttons[i] = document.getElementById(`refresh${i}`);
    }

    for (var i = from; i < to; i++) {

        buttons[i].addEventListener('click', function(event) {

            for (var j = 0; j < buttons.length; j++) {

                if (buttons[j] == this) {

                    var userName = window.prompt("Név:");
                    if (!userName) {

                        break;
                    }
                    var userJob = window.prompt("Munkakör:");
                    if (!userJob) {

                        break;
                    }

                    var user = {

                        name: userName,
                        job: userJob
                    }

                    var xhr = new XMLHttpRequest();
                    xhr.open('PUT', `https://reqres.in/api/users/${j + 1}`);
                    xhr.onreadystatechange = function() {

                        if (this.readyState !== 4) {

                            return;
                        }

                        if (this.status === 200) {

                            window.alert('Sikeres frissítés!');
                            location.reload();
                        }
                        else {

                            console.log('User refresh error: ' + this.status);
                            window.alert('A felhasználót nem sikerült frissíteni!');
                        }
                    }
                    xhr.send(JSON.stringify(user));

                    break;
                }
            }
        });
    }
}

function initDeleteButtons(from, to) {

    var buttons = [];

    for (var i = from; i < to; i++) {

        buttons[i] = document.getElementById(`delete${i}`);
    }

    for (var i = from; i < to; i++) {

        buttons[i].addEventListener('click', function(event) {

            for (var j = 0; j < buttons.length; j++)
            {
                if (buttons[j] == this) {

                    var xhr = new XMLHttpRequest();
                    xhr.open('DELETE', `https://reqres.in/api/users/${j}`);
                    xhr.onreadystatechange = function() {

                        if (this.readyState !== 4) {

                            return;
                        }
                
                        if (this.status === 204) {

                            window.alert(`Felhasználó (ID: ${users[j].id}) sikeresen törölve!`);
                            location.reload();
                        }
                        else {
                            
                            console.log('User deteletion error: ' + this.status);
                            window.alert("Sikertelen törlés!");
                        }
                    }
                    xhr.send(null);

                    break;
                }
            }
        });
    }
}

function initNewUser() {

    var form = document.getElementById('newUserForm');

    form.addEventListener('submit', function(event){

        event.preventDefault();

        var userName = document.getElementById('name').value;
        var userJob = document.getElementById('job').value;

        var user = {

            name: userName,
            job: userJob
        };

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://reqres.in/api/users');
        xhr.onreadystatechange = function() {

            if (this.readyState !== 4) {

                return;
            }

            if (this.status === 201) {

                window.alert('Felhasználó sikeresen létrehozva!');
                location.reload();
            }
            else {

                console.log('User creation error: ' + this.status);
                window.alert('A felhasználót nem sikerült létrehozni!');
            }
        }
        xhr.send(JSON.stringify(user));
    });
}