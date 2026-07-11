import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    collection,
    getDocs,
    query,
    orderBy
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


const historyBox = document.getElementById("historyBox");


onAuthStateChanged(auth, async(user)=>{

    if(!user){
        window.location.href = "login.html";
        return;
    }


    const q = query(
        collection(db, "users", user.uid, "chats"),
        orderBy("timestamp")
    );


    const snapshot = await getDocs(q);


    snapshot.forEach((doc)=>{

        const chat = doc.data();


        historyBox.innerHTML += `

        <div>
            <b>${chat.role}</b>
            <p>${chat.message}</p>
        </div>

        <hr>

        `;

    });


});