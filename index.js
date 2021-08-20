// Import stylesheets
import "./style.css";
var $ = require('jquery');

// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from "firebaseui";

// Document elements

// Listen to guestbook updates
function subscribeGuestbook(){
  // Create query for messages
guestbookListener = firebase.firestore().collection("guestbook")
.orderBy("timestamp","desc")
.onSnapshot((snaps) => {
  // Reset page
  guestbook.innerHTML = "";
  // Loop through documents in database
  snaps.forEach((doc) => {
    // Create an HTML entry for each document and add it to the chat
    const entry = document.createElement("p");
    entry.textContent = doc.data().name + ": " + doc.data().text;
    guestbook.appendChild(entry);
  });
});
};

// Unsubscribe from guestbook updates
function unsubscribeGuestbook(){
  if (guestbookListener != null)
  {
    guestbookListener();
    guestbookListener = null;
  }
 };

// Elements
const guestbook = document.getElementById("guestbook");
const numberAttending = document.getElementById("number-attending");
const rsvpYes = document.getElementById("rsvp-yes");
const rsvpNo = document.getElementById("rsvp-no");

var rsvpListener = null;
var guestbookListener = null;

async function main() {

  // Add Firebase project configuration object here
var firebaseConfig = {
  apiKey: "AIzaSyA44dGfejcQ1K8dZKvVQAqRQPZTpT3L_yc",
  authDomain: "manutencao-preventiva-veicular.firebaseapp.com",
  databaseURL: "https://manutencao-preventiva-veicular-default-rtdb.firebaseio.com",
  projectId: "manutencao-preventiva-veicular",
  storageBucket: "manutencao-preventiva-veicular.appspot.com",
  messagingSenderId: "362357850279",
  appId: "1:362357850279:web:dc514b45da3bf159c65b82",
  measurementId: "G-ZFNPXNH6ZD"
};
firebase.initializeApp(firebaseConfig);
};

main();

// FirebaseUI config
const uiConfig = {
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInOptions: [
    // Email / Password Provider.
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // Handle sign-in.
      // Return false to avoid redirect.
      return false;
    }
  }
};
const ui = new firebaseui.auth.AuthUI(firebase.auth());

// Listen to RSVP button clicks
$("#startRsvp").on("click",
 () => {
      ui.start("#firebaseui-auth-container", uiConfig);
});

// Listen to the current Auth state
firebase.auth().onAuthStateChanged((user)=> {
  if (user) {
    $("#startRsvp").text('LOGOUT')
    $("#guestbook-container").show();
    subscribeGuestbook();
  }
  else {
    $("#startRsvp").text('LOGIN')
    $("#guestbook-container").hide();
    unsubscribeGuestbook();
  }
});

// Called when the user clicks the RSVP button
$("#startRsvp").on("click",
 () => {
    if (firebase.auth().currentUser) {
      // User is signed in; allows user to sign out
      firebase.auth().signOut();
    } else {
      // No user is signed in; allows user to sign in
      ui.start("#firebaseui-auth-container", uiConfig);
    }
});

// Listen to the form submission
$("#leave-message").on("submit", (e) => {
  // Prevent the default form redirect
  e.preventDefault();
  // Write a new message to the database collection "guestbook"
  firebase.firestore().collection("guestbook").add({
    text: $("#message").val(),
    timestamp: Date.now(),
    name: firebase.auth().currentUser.displayName,
    userId: firebase.auth().currentUser.uid
  })
  // clear message input field
  $("#message").val(""); 
  // Return false to avoid redirect
  return false;
 });
