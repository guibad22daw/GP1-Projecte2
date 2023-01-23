window.onload = async function () {
    let nav = 0;
    let clicked = null;

    const calendar = document.getElementById('calendar');
    const newEventModal = document.getElementById('newEventModal');
    const deleteEventModal = document.getElementById('deleteEventModal');
    const backDrop = document.getElementById('modalBackDrop');
    const eventTitleInput = document.getElementById('eventTitleInput');
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',];
    let eventForDay;


    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    async function getData() {
        try {
            const response = await fetch('/get-data');
            const data = await response.json();
            return data;
        } catch(error) {
            console.error(error);            
        }
    }
    let events = await getData();
    
    const username = getCookie('user');
    const idUsuari = getCookie('id');

    if (!idUsuari || !username) {
        window.location.href = "/login";
    }

    function openModal(date) {
        clicked = date;

        if (username == 'admin') {
            eventForDay = events.find(e => e.date === clicked);
        } else {
            eventForDay = events.find(e => e.date === clicked && e.id == idUsuari);
        }

        if (eventForDay) {
            document.getElementById('eventText').innerText = eventForDay.title;
            deleteEventModal.style.display = 'block';
        } else {
            newEventModal.style.display = 'block';
        }

        backDrop.style.display = 'block';
    }

    function load() {
        const dt = new Date();

        if (nav !== 0) {
            dt.setMonth(new Date().getMonth() + nav);
        }

        const day = dt.getDate();
        const month = dt.getMonth();
        const year = dt.getFullYear();

        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
            weekday: 'long',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        });
        const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

        // Aquesta línea canvia automaticament el nom del mes
        document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString('ca-CA', { month: 'long' }).toUpperCase()} ${year}`;

        calendar.innerHTML = '';
        for (let i = 1; i <= paddingDays + daysInMonth; i++) {
            const daySquare = document.createElement('div');
            daySquare.classList.add('day');

            const dayString = `${i - paddingDays}/${month + 1}/${year}`;

            if (i > paddingDays) {
                daySquare.innerText = i - paddingDays;

                if (username == 'admin') {
                    eventForDay = events.find(event => event.date == dayString);
                } else {
                    eventForDay = events.find(event => event.id == idUsuari && event.date == dayString);
                }

                if (i - paddingDays === day && nav === 0) {
                    daySquare.id = 'currentDay';
                }


                if (eventForDay) {
                    const eventDiv = document.createElement('div');
                    eventDiv.classList.add('event');


                    eventDiv.innerText = eventForDay.title;
                    if (eventDiv.innerText.includes('Rebre')) {
                        eventDiv.setAttribute('id', 'rebre');
                    }
                    daySquare.appendChild(eventDiv);
                }

                daySquare.addEventListener('click', () => openModal(dayString));
            } else {
                daySquare.classList.add('padding');
            }

            calendar.appendChild(daySquare);
        }
    }

    function closeModal() {
        eventTitleInput.classList.remove('error');
        newEventModal.style.display = 'none';
        deleteEventModal.style.display = 'none';
        backDrop.style.display = 'none';
        eventTitleInput.value = '';
        clicked = null;
        load();
    }

    function saveEvent() {
        if (eventTitleInput.value) {
            eventTitleInput.classList.remove('error');

            events.push({
                id: idUsuari,
                user: username,
                date: clicked,
                title: eventTitleInput.value,
            });

            try {
                fetch('/save-data', {
                    method: 'POST',
                    body: JSON.stringify(events),
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch(error){
                console.error(error);
            }


            localStorage.setItem('events', JSON.stringify(events));
            closeModal();
        } else {
            eventTitleInput.classList.add('error');
        }
    }

    function deleteEvent() {
        if (username == 'admin') { events = events.filter(event => event.date !== clicked); }
        else {
            const index = events.findIndex(event => event.user === username && event.date === clicked);
            if (index !== -1) {
                events.splice(index, 1);
                console.log(events);

            }
        }
        try {
            fetch('/save-data', {
                method: 'POST',
                body: JSON.stringify(events),
                headers: { 'Content-Type': 'application/json' }
            });
        } catch(error){
            console.error(error);
        }
        localStorage.setItem('events', JSON.stringify(events));

        closeModal();
    }

    function initButtons() {
        document.getElementById('saveButton').addEventListener('click', saveEvent);
        document.getElementById('cancelButton').addEventListener('click', closeModal);
        document.getElementById('deleteButton').addEventListener('click', deleteEvent);
        document.getElementById('closeButton').addEventListener('click', closeModal);
    }

    initButtons();
    load();
}