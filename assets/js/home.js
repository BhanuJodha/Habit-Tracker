{
    const body = document.getElementById("body");
    const deleteQueue = [];

    const fetchAllHabits = async () => {
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
            card.className = "card";
            card.innerHTML = `
                <div class="card-top">
                    <span class="habit">${i.content}</span>
                    <span class="time">${new Date(i.createdAt).toLocaleTimeString([],{hour: "2-digit", minute:"2-digit"})}</span>
                </div>
                <div class="card-middle" data-hid="${i._id}">
                    <input type="checkbox" class="toggle-delete">
                    <span class="material-symbols-outlined fav ${i.favourite === true? "fav-on" : ""}">
                    favorite
                    </span>
                </div>
                <div class="card-bottom">
                    <span class="days">${new Date(i.createdAt).toLocaleDateString([], {year: 'numeric', month: 'short', day: 'numeric'})}</span>
                    <span class="out-of">Take action ${i.dailyStatus.length}/${daysCalc(i.createdAt)}</span>
                    <span class="repeat">Daily</span>
                </div>
            `;
            body.append(card);
        }
    }

    const deleteHabits = async () => {
        if (deleteQueue.length === 0){
            alert("Delete queue is empty");
        }
        else{
            for (const e of deleteQueue){
                const response = await fetch("/api/v1/habit/remove?hid=" + e, {
                    method: "delete",
                    headers: {
                        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzUyODczMDJiNjZiYTdlNzVlMjhjZjYiLCJpYXQiOjE2NjYzNTYyNTIsImV4cCI6MTY2NjM1NjU1Mn0.Ak1DmZOJPfQFMJURAkLUVkgxRaj6jLu5Sbl5ygexsyQ"
                    }
                });
                const data = await response.json();
                console.log(data);
            }
            
            // delete hid from queue
            deleteQueue.splice(0, deleteQueue.length);

            // clear element from body
            body.innerHTML = "";
            fetchAllHabits();
        }
    }

    const toggleDelete = (child) => {
        if(!child.checked){
            deleteQueue.splice(deleteQueue.indexOf(child.parentElement.dataset.hid), 1);
        }
        else{
            deleteQueue.push(child.parentElement.dataset.hid);
        }
    }

    const clickHandler = (e) => {
        const target = e.target;
        if (target.classList[1] === "delete"){
            deleteHabits();
        }
        else if (target.className === "toggle-delete"){
            toggleDelete(target)
            console.log(deleteQueue)
        }
    }

    document.addEventListener("click", clickHandler);

    fetchAllHabits();
}