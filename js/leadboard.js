const leaderboardBody = document.getElementById("leaderboard-body");

db.collection("users")
    .orderBy("score", "desc")
    .limit(10)
    .get()
    .then((querySnapshot) => {
        let rank = 1;
        querySnapshot.forEach((doc) => {
            const user = doc.data();
            leaderboardBody.innerHTML += `
                <tr>
                    <td>${rank++}</td>
                    <td>${user.name}</td>
                    <td>${user.score}</td>
                </tr>
            `;
        });
    });