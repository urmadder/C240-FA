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
        orderBy("timestamp", "asc")
    );


    const snapshot = await getDocs(q);

    historyBox.innerHTML = "";

    if (snapshot.empty) {
    
        historyBox.innerHTML = `
            <div class="history-empty">
                No chat history yet.<br><br>
                Start a conversation with StudySync AI to see it here.
            </div>
        `;
    
        return;
    }

    snapshot.forEach((doc)=>{

        const chat = doc.data();


        const isUser = chat.role === "user";


        let fileDisplay = "";

        if(chat.fileName){
            fileDisplay = `
            <div class="history-file">
                📎 ${chat.fileName}
            </div>
            `;
        }


        let time = "";

        if(chat.timestamp){
            time = chat.timestamp.toDate()
            .toLocaleString();
        }


        historyBox.innerHTML += `


        <div class="history-message ${
            isUser 
            ? "history-user" 
            : "history-ai"
        }">


            <strong>
                ${
                isUser
                ? "👤 You"
                : "🤖 SmartStudent AI"
                }
            </strong>


            <p>
                ${
                    chat.message
                        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
                        .replace(/### (.*?)/g, "<b>$1</b>")
                        .replace(/\n/g, "<br>")
                }
            </p>


            ${fileDisplay}


            <div class="history-time">
                ${time}
            </div>


        </div>


        `;


    });


});
