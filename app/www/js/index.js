/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


function createSensor() {

  var urlToPost = 'http://10.0.2.2:5333/capteurs';
  var json={ "origin": -1,
  "type": "Conso",
  "unit": "kWh",
  "value": 666}

console.log("post");
       
  var xmlHttp=new XMLHttpRequest();
  xmlHttp.open('POST',urlToPost);
  xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlHttp.send(JSON.stringify(json));
 xmlHttp.addEventListener('readystatechange', function() 
  {

    if (xmlHttp.readyState === 4) 
    {
        var message = "Opération réussie";
        var title = "Succès";
        var buttonName = "Ok";
    
        navigator.notification.alert(message, alertCallback, title, buttonName);

            function alertCallback() {
          console.log("Information notifiée à l'utilisateur");
        }

    }
  });
        
}

function readSensor() {

  console.log("get");
  var urlToGet = 'http://10.0.2.2:5333/capteurs/-1/Conso';
       
  var xmlHttp=new XMLHttpRequest();
  xmlHttp.open('GET',urlToGet);
  xmlHttp.send(null);
  xmlHttp.addEventListener('readystatechange', function() 
  {

    if (xmlHttp.readyState === 4) 
    {
        var json = JSON.parse(xmlHttp.responseText);
        var message = "id " + json[0].id + "\n" + "type " + json[0].type + "\n" + "unit " +  json[0].unit + "\n" + "value " +  json[0].value + "\n" + "date " + json[0].date + "\n";
        var title = "Information";
        var buttonName = "Ok";
    
        navigator.notification.alert(message, alertCallback, title, buttonName);

            function alertCallback() {
          console.log("Information notifiée à l'utilisateur");
        }
    } 
  });
}

 function updateSensor() {

console.log("put");

   var urlToPost = 'http://10.0.2.2:5333/capteurs';
  var json={ "origin": -1,
  "type": "Conso",
  "unit": "kWh",
  "value": 1000}

       
  var xmlHttp=new XMLHttpRequest();
  xmlHttp.open('PUT',urlToPost);
  xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlHttp.send(JSON.stringify(json));
    xmlHttp.addEventListener('readystatechange', function() 
    {

      if (xmlHttp.readyState === 4) 
      {
          var message = xmlHttp.responseText;
          var title = "Information";
          var buttonName = "Ok";
      
          navigator.notification.alert(message, alertCallback, title, buttonName);

              function alertCallback() {
            console.log("Information notifiée à l'utilisateur");
          }
      } 
    });
    
}   


function deleteSensor() {

  console.log("delete");
   var urlToPost = 'http://10.0.2.2:5333/capteurs';
  var json={ "origin": -1,
  "type": "Conso",
  "unit": "kWh",
  "value": 1000}

       
  var xmlHttp=new XMLHttpRequest();
  xmlHttp.open('DELETE',urlToPost);
  xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlHttp.send(JSON.stringify(json));
    xmlHttp.addEventListener('readystatechange', function() 
    {

      if (xmlHttp.readyState === 4) 
      {
          var message = xmlHttp.responseText;
          var title = "Information";
          var buttonName = "Ok";
      
          navigator.notification.alert(message, alertCallback, title, buttonName);

              function alertCallback() {
            console.log("Information notifiée à l'utilisateur");
          }
      } 
    });
}

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
          /*  document.getElementById("dialogAlert").addEventListener("click", dialogAlert);
            document.getElementById("dialogConfirm").addEventListener("click", dialogConfirm);
            document.getElementById("dialogPrompt").addEventListener("click", dialogPrompt);
            document.getElementById("dialogBeep").addEventListener("click", dialogBeep);*/
            document.getElementById("createSensor").addEventListener("click", createSensor);
            document.getElementById("readSensor").addEventListener("click", readSensor);
            document.getElementById("updateSensor").addEventListener("click", updateSensor);
            document.getElementById("deleteSensor").addEventListener("click", deleteSensor);
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }

};

app.initialize();