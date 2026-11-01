import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getDatabase, ref, onValue, push, set } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCpYfaXQ_AqtmCx6b21-9Kj2XpvhkMriCQ",
  authDomain: "safetether-a582c.firebaseapp.com",
  databaseURL: "https://safetether-a582c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "safetether-a582c",
  storageBucket: "safetether-a582c.firebasestorage.app",
  messagingSenderId: "727450953294",
  appId: "1:727450953294:web:00528ac0c24e0db475c51f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const loginSection = document.getElementById("login-section");
const dashboard = document.getElementById("dashboard");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-btn");
const logoutButton = document.getElementById("logout-btn");
const loginMessage = document.getElementById("login-message");

// Login
loginButton.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        await signInWithEmailAndPassword(auth, email, password);

        loginSection.style.display = "none";
        dashboard.style.display = "block";

    } catch (error) {
        loginMessage.textContent = "Login failed: " + error.message;
    }
});

// Logout
logoutButton.addEventListener("click", async () => {
    await signOut(auth);

    dashboard.style.display = "none";
    loginSection.style.display = "block";

    passwordInput.value = "";
});
// Check login status
// Check login status and read distance
let stopDistanceListener = null;
let userAware = false;
let currentDistance = 0;
let lastDataTime = Date.now();
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.style.display = "none";
        dashboard.style.display = "block";

        const distanceRef = ref(database, "distance");

        stopDistanceListener = onValue(distanceRef, (snapshot) => {
            const distance = snapshot.val();
            lastDataTime = Date.now();
setInterval(() => {
    const isConnected = Date.now() - lastDataTime < 5000;

    document.getElementById("status-dot").style.backgroundColor =
        isConnected ? "green" : "red";

    document.getElementById("connection-text").textContent =
        isConnected ? "A0 Connected" : "A0 Disconnected";
}, 1000);
            document.getElementById("status-dot").style.backgroundColor = "green";
            document.getElementById("connection-text").textContent = "A0 Connected";
            currentDistance = distance;
        const distanceElement = document.querySelector(".distance");

        distanceElement.textContent = "Distance: " + distance + " cm";

        if (distance > 100) {
            distanceElement.style.color = "red";
        } else {
            distanceElement.style.color = "green";
        }
        const alertSection = document.getElementById("alert-section");

        if (distance > 100 && !userAware) {
            alertSection.style.display = "block";
        } else {
            alertSection.style.display = "none";
        }

        if (distance <= 100) {
            userAware = false;

            document.getElementById("alert-title").style.display = "block";
            document.getElementById("alert-question").style.display = "block";
            document.getElementById("aware-btn").style.display = "inline-block";
            document.getElementById("unaware-btn").style.display = "inline-block";
            document.getElementById("result-message").style.display = "none";
        }
        });
        const awareButton = document.getElementById("aware-btn");

        awareButton.addEventListener("click", () => {
            userAware = true;
            document.getElementById("alert-section").style.display = "none";
        });
        const unawareButton = document.getElementById("unaware-btn");

unawareButton.addEventListener("click", async () => {
    const alertsRef = ref(database, "alerts");
    const newAlertRef = push(alertsRef);

    await set(newAlertRef, {
        distance: currentDistance,
        status: "unaware",
        time: new Date().toISOString()
    });

document.getElementById("aware-btn").style.display = "none";
document.getElementById("unaware-btn").style.display = "none";

document.getElementById("alert-title").style.display = "none";
document.getElementById("alert-question").style.display = "none";

document.getElementById("result-message").style.display = "block";});
    } else {
        loginSection.style.display = "block";
        dashboard.style.display = "none";

        if (stopDistanceListener) {
            stopDistanceListener();
            stopDistanceListener = null;
        }
    }
});