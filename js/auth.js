// 🔥 Firebase import
import { app } from "./firebase.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const auth = getAuth(app);

// ================= EMAIL AUTH =================

// Signup
function signup() {
  showLoader();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    hideLoader();
    showError("Please fill all fields ❌");
    return;
  }

  if (password.length < 6) {
    hideLoader();
    showError("Password must be at least 6 characters ❌");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      hideLoader();
      showError("Signup successful ✅");
    })
    .catch((err) => {
      hideLoader();
      showError(err.message);
    });
}

// Login
function login() {
  showLoader();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    hideLoader();
    showError("Enter email and password ❌");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      hideLoader();
      window.location.href = "index.html";
    })
    .catch((err) => {
      hideLoader();

      if (err.code === "auth/user-not-found") {
        showError("User not found ❌");
      } else if (err.code === "auth/wrong-password") {
        showError("Wrong password ❌");
      } else {
        showError(err.message);
      }
    });
}

// 🔐 FORGOT PASSWORD
window.resetPassword = function () {
  const email = document.getElementById("email").value.trim();

  if (!email) {
    showError("Enter your email first ❌");
    return;
  }

  showLoader();

  sendPasswordResetEmail(auth, email)
    .then(() => {
      hideLoader();
      showError("Password reset email sent 📧");
    })
    .catch((error) => {
      hideLoader();
      showError(error.message);
    });
};

// ================= PHONE OTP AUTH =================

let confirmationResult;
let recaptchaVerifier;

// Setup reCAPTCHA
window.addEventListener("load", () => {
  recaptchaVerifier = new RecaptchaVerifier(
    auth,
    'recaptcha-container',
    { size: 'normal' }
  );

  recaptchaVerifier.render();
});

// Send OTP
window.sendOTP = function () {
  showLoader();

  const phoneNumber = document.getElementById("phone").value;

  if (!phoneNumber.startsWith("+91") || phoneNumber.length !== 13) {
    hideLoader();
    showError("Enter valid number like +911234567890 ❌");
    return;
  }

  signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      hideLoader();
      showError("OTP Sent ✅");
    })
    .catch((error) => {
      hideLoader();
      showError(error.message);
    });
};

// Verify OTP
window.verifyOTP = function () {
  showLoader();

  const code = document.getElementById("otp").value;

  confirmationResult.confirm(code)
    .then(() => {
      hideLoader();
      window.location.href = "index.html";
    })
    .catch(() => {
      hideLoader();
      showError("Invalid OTP ❌");
    });
};

// ================= LOGOUT =================

window.logout = function () {
  signOut(auth)
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      showError(error.message);
    });
};

// ================= EXPORT =================

window.signup = signup;
window.login = login;