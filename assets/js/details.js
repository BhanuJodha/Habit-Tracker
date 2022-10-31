{
    const body = document.querySelector("#body")
    const weekContainer = document.querySelector(".week-days");
    const monthContainer = document.querySelector(".month");
    const weekName = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    const today = new Date();
    const dateTray = [];

    const loadWeek = () => {
        // +1 to shift to next day
        const todayDay = today.getDay() + 1;
        // circular iteration
        for (let i = 0; i < 7; i++) {
            let span = document.createElement("span");
            span.innerText = weekName[(i + todayDay) % 7];
            weekContainer.append(span);
        }
    }

    const loadDates = () => {
        const todayDate = today.getDate();
        for (let i = 0; i < 7; i++) {
            // pushing dates in decending order
            const date = todayDate - i;
            if (date > 0) {
                dateTray.push(date);
            }
            else {
                dateTray.push(null);
            }
        }
    }

    const fetchBody = async () => {
        const response = await fetch("/api/v1/habit/fetch-with-status", {
            method: "get",
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzUyODczMDJiNjZiYTdlNzVlMjhjZjYiLCJpYXQiOjE2NjYzNTYyNTIsImV4cCI6MTY2NjM1NjU1Mn0.Ak1DmZOJPfQFMJURAkLUVkgxRaj6jLu5Sbl5ygexsyQ"
            }
        });
        const data = await response.json();
        console.log(data);

        for (const i of data.data.habits) {
            let card = document.createElement("div");
            card.className = "habit-container";
            card.innerHTML = `
                <div data-hid="${i._id}">
                    <span class="habit">${i.content}</span>
                    <span class="time">${new Date(i.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    <span class="out-of">${i.dailyStatus.length}/${daysCalc(i.createdAt)}</span>
                    <span class="material-symbols-outlined fav ${i.favourite === true? "fav-on" : ""}">
                    favorite
                    </span>
                </div>
            `;

            // adding dates
            const div = document.createElement("div");
            div.className = "daily-status";
            // setting habit id to element
            div.dataset.hid = i._id;
            for (let j = 0, k = i.dailyStatus.length - 1; j < 7; j++) {
                let span = document.createElement("span");
                span.dataset.dd = dateTray[j];
                span.innerText = dateTray[j];

                // if status available
                if (i.dailyStatus[k]){
                    let sDate = new Date(i.dailyStatus[k].createdAt);

                    // if target status date match calendar date
                    if (sDate.getDate() == dateTray[j] && sDate.getMonth() === today.getMonth() && sDate.getFullYear() === today.getFullYear()) {
                        switch (i.dailyStatus[k].status) {
                            case "Done":
                                span.innerHTML += `<span class="material-symbols-outlined">
                                done
                                </span>`;
                                break;
                            case "Not-Done":
                                span.innerHTML += `<span class="material-symbols-outlined">
                                close
                                </span>`;
                                break;
                            case "None":
                                break;
                            default:
                                break;
                        }
                        // changing pointer to prev status
                        k--;
                    }
                }
                div.prepend(span);
            }

            card.append(div);
            body.append(card);
        }
    }

    // toggle status of a habit
    const toggleStatus = async (child) => {
        const parent = child.parentElement;
        const hid = parent.dataset.hid;
        const dd = child.dataset.dd;

        const response = await fetch("/api/v1/status/toggle", {
            method: "post",
            body: JSON.stringify({
                hid,
                dd,
                mm: today.getMonth() + 1, // for indexing
                yyyy: today.getFullYear()
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzUyODczMDJiNjZiYTdlNzVlMjhjZjYiLCJpYXQiOjE2NjYzNTYyNTIsImV4cCI6MTY2NjM1NjU1Mn0.Ak1DmZOJPfQFMJURAkLUVkgxRaj6jLu5Sbl5ygexsyQ"
            }
        });
        
        const data = await response.json();
        // check for successfull response
        if(response.ok){
            console.log(data)
            switch (data.data.status.status) {
                case "Done":
                    child.innerHTML = `${dd}<span class="material-symbols-outlined">
                    done
                    </span>`;
                    break;
                case "Not-Done":
                    child.innerHTML = `${dd}<span class="material-symbols-outlined">
                    close
                    </span>`;
                    break;
                case "None":
                    child.innerHTML = `${dd}</span>`;
                    break;
                default:
                    break;
            }
        }
        else{
            alert(data.message);
        }
    }

    const clickHandler = (e) => {
        const target = e.target;
        if(target.parentElement.className === "daily-status"){
            toggleStatus(target);
        }
    }

    monthContainer.innerText = today.toLocaleDateString([], { year: 'numeric', month: 'long' })
    loadWeek();
    loadDates();
    fetchBody();

    // Event listeners
    document.addEventListener("click", clickHandler);
}