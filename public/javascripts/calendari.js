window.onload = async function () {
   let nav = 0;
   let clicked = null;

   const calendar = document.getElementById("calendar");
   const newEventModal = document.getElementById("newEventModal");
   const deleteEventModal = document.getElementById("deleteEventModal");
   const backDrop = document.getElementById("modalBackDrop");
   const eventTitleInput = document.getElementById("eventTitleInput");
   const opcioOferirRebre = document.getElementById("opcioOferirRebre");
   const descripcio = document.getElementById("descripcio");
   const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
   let eventsForDay, eventForDay;
   let events = [];

   function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
   }

   async function getData() {
      try {
         const response = await fetch("/obtenirDades");
         const data = await response.json();
         events = data;
      } catch (error) {
         console.error(error);
      }
   }

   const username = getCookie("user");
   const idUsuari = getCookie("id");

   function veureEsdeveniment(date, id) {
      clicked = date;

      if (username == "admin") {
         eventForDay = events.find(
            (e) => e.date === clicked && e._id.includes(id)
         );
      } else {
         eventForDay = events.find(
            (e) =>
               e.date === clicked && e.user == username && e._id.includes(id)
         );
      }

      if (eventForDay) {
         document.getElementById("eventText").innerText = eventForDay.servei;
         document.getElementById("eventDescription").innerText = eventForDay.descripcio;
         deleteEventModal.style.display = "block";
      }

      backDrop.style.display = "block";
      document.getElementById("deleteButton").addEventListener("click", function () {
         deleteEvent(date, id);
      });
      document.getElementById("closeButton").addEventListener("click", closeModal);

      if (!e) var e = window.event;
      e.stopPropagation();
   }

   function creaEsdeveniment(date) {
      clicked = date;
      newEventModal.style.display = "block";
      backDrop.style.display = "block";
      document.getElementById("saveButton").addEventListener("click", saveEvent);
      document.getElementById("cancelButton").addEventListener("click", closeModal);
   }

   async function load() {
      await getData();
      const dt = new Date();

      if (nav !== 0) {
         dt.setMonth(new Date().getMonth() + nav);
      }

      const day = dt.getDate();
      const month = dt.getMonth();
      const year = dt.getFullYear();

      const firstDayOfMonth = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
         weekday: "long",
         year: "numeric",
         month: "numeric",
         day: "numeric",
      });
      const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

      // Aquesta línea canvia automaticament el nom del mes
      document.getElementById("monthDisplay").innerText = `${dt.toLocaleDateString("ca-CA", { month: "long" }).toUpperCase()} ${year}`;

      calendar.innerHTML = "";
      for (let i = 1; i <= paddingDays + daysInMonth; i++) {
         const daySquare = document.createElement("div");
         daySquare.classList.add("day");

         const dayString = `${i - paddingDays}/${month + 1}/${year}`;

         if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;

            if (username == "admin") {
               eventsForDay = events.filter((event) => event.date == dayString);
            } else {
               eventsForDay = events.filter(
                  (event) => event.user == username && event.date == dayString
               );
            }

            if (i - paddingDays === day && nav === 0) {
               daySquare.id = "currentDay";
            }

            if (eventsForDay) {
               eventsForDay.forEach((element) => {
                  const eventDiv = document.createElement("div");
                  eventDiv.classList.add("event");

                  eventDiv.innerText = element.servei;
                  if (username == "admin") {
                     if (events.find((event) => event.servei == eventDiv.innerText && event.date == dayString && event._id == element._id && event.tipus == "Rebre")) {
                        eventDiv.setAttribute("id", "rebre");
                     }
                  } else {
                     if (events.find((event) => event.servei == eventDiv.innerText && event.date == dayString && event.user == username && event._id == element._id && event.tipus == "Rebre")) {
                        eventDiv.setAttribute("id", "rebre");
                     }
                  }
                  daySquare.appendChild(eventDiv);
                  eventDiv.addEventListener("click", () => veureEsdeveniment(dayString, element._id));
               });
            }

            daySquare.addEventListener("click", () => creaEsdeveniment(dayString));
         } else {
            daySquare.classList.add("padding");
         }

         calendar.appendChild(daySquare);
      }
   }

   function closeModal() {
      eventTitleInput.classList.remove("error");
      newEventModal.style.display = "none";
      deleteEventModal.style.display = "none";
      backDrop.style.display = "none";
      eventTitleInput.value = "";
      clicked = null;
      load();
   }

   async function saveEvent() {
      if (eventTitleInput.value) {
         eventTitleInput.classList.remove("error");

         let event = {
            user: username,
            date: clicked,
            servei: eventTitleInput.value,
            tipus: opcioOferirRebre.value,
            descripcio: descripcio.value != undefined ? descripcio.value : "",
         };

         try {
            fetch("/desaEsdeveniment", {
               method: "POST",
               body: JSON.stringify(event),
               headers: { "Content-Type": "application/json" },
            });
         } catch (error) {
            console.error(error);
         }
         closeModal();
      } else {
         eventTitleInput.classList.add("error");
      }
   }

   async function deleteEvent(clicked, id) {
      let index;
      if (username == "admin") index = events.find((event) => event.date === clicked && event._id == id);
      else index = events.find((event) => event.user === username && event.date === clicked && event._id == id);
      if (index !== undefined) {
         try {
            fetch("/esborraEsdeveniment", {
               method: "POST",
               body: JSON.stringify(index),
               headers: { "Content-Type": "application/json" },
            });
         } catch (error) {
            console.error(error);
         }
      }
      closeModal();
   }

   function initButtons() {
      document.getElementById('nextButton').addEventListener('click', () => {
         nav++;
         load();
      });

      document.getElementById('backButton').addEventListener('click', () => {
         nav--;
         load();
      });
   }
   initButtons();
   load();

};
