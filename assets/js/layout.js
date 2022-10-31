{
    const addHabit = async () => {
        const response = await fetch("/api/v1/habit/add", {
            method: "post",
            body: JSON.stringify({
                content: prompt("Enter habit name")
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzUyODczMDJiNjZiYTdlNzVlMjhjZjYiLCJpYXQiOjE2NjYzNTYyNTIsImV4cCI6MTY2NjM1NjU1Mn0.Ak1DmZOJPfQFMJURAkLUVkgxRaj6jLu5Sbl5ygexsyQ"
            }
        })
        
        const data = await response.json();
        console.log(data);
        location.reload();
    }

    const toggleFav = async (child) => {
        const response = await fetch("/api/v1/habit/toggle-fav", {
            method: "PATCH",
            body: JSON.stringify({
                hid: child.parentElement.dataset.hid
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzUyODczMDJiNjZiYTdlNzVlMjhjZjYiLCJpYXQiOjE2NjYzNTYyNTIsImV4cCI6MTY2NjM1NjU1Mn0.Ak1DmZOJPfQFMJURAkLUVkgxRaj6jLu5Sbl5ygexsyQ"
            }
        })
        const data = await response.json();
        console.log(data)
        // changing style
        child.classList.toggle("fav-on");
    }

    const clickHandler = (e) => {
        const target = e.target;
        if (target.classList[1] === "add"){
            addHabit();
        }
        else if(target.classList[1] === "fav"){
            toggleFav(target);
        }
    }

    document.addEventListener("click", clickHandler);
}

// Default section

const daysCalc = (date) => {
    const pastDate = new Date(date);
    const dd = pastDate.getDate();
    const mm = pastDate.getMonth();
    const yyyy = pastDate.getFullYear();
    const today = new Date();
    const diff = (today.getDate() + today.getMonth() + today.getFullYear()) - (dd + mm + yyyy)
    // +1 to include today
    return diff + 1;
}