"use strict";

class MainClass {
    constructor() {
        let fs = null;
        eval("   fs = require('fs');   ");
        let WebSocketServer = null;
        eval("   WebSocketServer = new require('ws');   ");
        let portNumber = process.env.PORT || 5007;
        let  webSocketServer = new WebSocketServer.Server({ port: portNumber });
        console.log("Server works on port " + portNumber);

        let clients = {};
        let nameCounter = 1;

        function sendAnswerToClient(id, answerText) {
            try {
                clients[id].send(answerText.toString());
            } catch (err) {
                // err
            }
        }

        let w = false;
        let a = false;
        let s = false;
        let d = false;

        let keyInterval = setInterval(() => {
            fs.readFile('keysFile.txt', function (err, data) {
                if (err) {
                   console.log("FILE ERROR: " + err);
                } else {
                    const content = data.toString();
                    w = false;
                    a = false;
                    s = false;
                    d = false;

                    let keys = "";

                    if(content.indexOf('W') !== -1) {
                        w = true;
                        keys += 'W';
                    }
                    if(content.indexOf('A') !== -1) {
                        a = true;
                        keys += 'A';
                    }
                    if(content.indexOf('S') !== -1) {
                        s = true;
                        keys += 'S';
                    }
                    if(content.indexOf('D') !== -1) {
                        d = true;
                        keys += 'D';
                    }

                    for (let key in clients) {
                        sendAnswerToClient(key, "__" + keys + "__");
                    }
                }
            });
        }, 100);

        webSocketServer.on("connection", function(ws) {
            let id = "id_" + nameCounter;
            nameCounter++;
            clients[id] = ws;
            console.log("Новый клиент " + id);

            ws.on("close", function() {
                console.log("Клиент " + id + " отключился");
                delete clients[id];
            });

            ws.on("message", function(message) {
				// console.log("Message: " + message);
            });
        });

    }
}

new MainClass();
