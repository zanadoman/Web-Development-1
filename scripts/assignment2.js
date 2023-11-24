var users = [];

var allUsersCount;

var buttonMin;
var buttonMax;

function updateAllUsers() {
    
    var first;
    var last;
    var allUsers = document.getElementById('allUsers');

    if (buttonMin < 0) {

        first = 0;
        last = buttonMax;
    }
    else if (users.length < buttonMax) {

        first = buttonMin;
        last = users.length;
    }
    else
    {
        first = buttonMin;
        last = buttonMax;
    }
    console.log(`${buttonMin} - ${buttonMax}`);
    console.log(`${first} - ${last}`);

    var content = '<table>';
    for (var i = first; i < last; i++) {

        content += `
            <tr>
                <td><img src="${users[i].avatar}"></td>
                <td>${users[i].id}</td>
                <td>${users[i].first_name}</td>
                <td>${users[i].last_name}</td>
                <td>${users[i].email}</td>
            </tr>
        `;
    }
    content += '</table>';

    allUsers.innerHTML = content;
}

function loadUsers() {

    var url = 'https://reqres.in/api/users';
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url);
    xhr.onreadystatechange = function() {

        if (this.readyState !== 4) {
            return;
        }

        if (this.status === 200) {

            response = JSON.parse(this.response).data;

            for (var i = 0; i < response.length; i++) {
                users[i] = response[i]
            }

            userCountSelector();

            buttonMin = 0;
            buttonMax = users.length;
            buttonPrev();
            buttonNext();
            updateButtons();

            allUsersCount = users.length;
            updateAllUsers();
        }
    }

    xhr.send(null);
}

function userCountSelector() {

    var selector = document.getElementById('userCountSelector');

    var options = `<option value="${users.length}">Összes felhasználó</option>`;
    for (var i = 0; i < users.length - 1; i++) {

        options += `<option value="${i + 1}">${i + 1}db felhasználó</option>`
    }
    selector.innerHTML = options;

    selector.addEventListener('change', function(event) {

        allUsersCount = event.target.value;
        buttonMin = 0;
        buttonMax = allUsersCount;
        updateButtons();
        updateAllUsers();
    });
}

function buttonPrev() {

    var buttons = document.getElementsByClassName('buttonPrev');

    for (var i = 0; i < buttons.length; i++) {

        buttons[i].addEventListener('click', function(event) {

            buttonMin = Number(buttonMin) - Number(allUsersCount);
            buttonMax = Number(buttonMax) - Number(allUsersCount);
            updateButtons();
            updateAllUsers();
        });
    }
}

function buttonNext() {

    var buttons = document.getElementsByClassName('buttonNext');

    for (var i = 0; i < buttons.length; i++) {

        buttons[i].addEventListener('click', function(event) {

            buttonMin = Number(buttonMin) + Number(allUsersCount);
            buttonMax = Number(buttonMax) + Number(allUsersCount);
            updateButtons();
            updateAllUsers();
        });
    }
}

function updateButtons() {

    var buttonPrevs = document.getElementsByClassName('buttonPrev');
    var buttonNexts = document.getElementsByClassName('buttonNext');

    if (buttonMin <= 0) {

        for (var i = 0; i < buttonPrevs.length; i++) {

            buttonPrevs[i].disabled = true;
        }
    }
    else {

        for (var i = 0; i < buttonPrevs.length; i++) {

            buttonPrevs[i].disabled = false;
        }
    }

    if (users.length <= buttonMax) {

        for (var i = 0; i < buttonNexts.length; i++) {

            buttonNexts[i].disabled = true;
        }
    }
    else {

        for (var i = 0; i < buttonPrevs.length; i++) {

            buttonNexts[i].disabled = false;
        }
    }
}