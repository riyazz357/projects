// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load mock tests
async function loadMockTests() {
    const testSelect = document.getElementById('testSelect');
    const querySnapshot = await getDocs(collection(db, "mockTests"));
    
    querySnapshot.forEach((doc) => {
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = doc.data().title;
        testSelect.appendChild(option);
    });
}

// Add question
document.getElementById('questionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const testId = document.getElementById('testSelect').value;
    const text = document.getElementById('questionText').value;
    const explanation = document.getElementById('explanation').value;
    const difficulty = document.getElementById('difficulty').value;
    
    // Process options
    const optionInputs = document.querySelectorAll('.option-input');
    let options = [];
    let correctAnswer = '';
    
    optionInputs.forEach(input => {
        const value = input.value;
        if (value.includes('*')) {
            correctAnswer = value.replace('*', '');
            options.push(correctAnswer);
        } else {
            options.push(value);
        }
    });
    
    // Add to Firestore
    try {
        await addDoc(collection(db, "mockTests", testId, "questions"), {
            text,
            options,
            correctAnswer,
            explanation,
            difficulty,
            createdAt: new Date()
        });
        
        alert('Question added successfully!');
        e.target.reset();
    } catch (error) {
        console.error("Error adding question: ", error);
        alert('Error adding question');
    }
});

// Add/remove options dynamically
document.getElementById('addOption').addEventListener('click', () => {
    const container = document.getElementById('optionsContainer');
    const div = document.createElement('div');
    div.className = 'input-group mb-2';
    div.innerHTML = `
        <input type="text" class="form-control option-input" placeholder="Option ${container.children.length + 1}" required>
        <button type="button" class="btn btn-outline-danger remove-option">×</button>
    `;
    container.appendChild(div);
});

document.getElementById('optionsContainer').addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-option')) {
        e.target.parentElement.remove();
    }
});

// Initialize
loadMockTests();