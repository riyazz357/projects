// Initialize Firebase (replace with your config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-app",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Load quiz questions
function loadQuiz() {
    const quizContainer = document.getElementById("quiz-container");
    db.collection("questions").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const question = doc.data();
            quizContainer.innerHTML += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5>${question.text}</h5>
                        ${question.options.map(opt => `
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="q${doc.id}" value="${opt}">
                                <label class="form-check-label">${opt}</label>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;
        });
    });
}

// Submit quiz
document.getElementById("submit-btn").addEventListener("click", () => {
    let score = 0;
    db.collection("questions").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const correctAnswer = doc.data().correctAnswer;
            const selectedOption = document.querySelector(`input[name="q${doc.id}"]:checked`);
            if (selectedOption && selectedOption.value === correctAnswer) {
                score++;
            }
        });
        document.getElementById("result").innerHTML = `
            <div class="alert alert-success">
                Your score: <strong>${score}/${querySnapshot.size}</strong>
            </div>
        `;
    });
});

// Load quiz on page load
window.onload = loadQuiz;