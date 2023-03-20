      // Function to increment Local score and update the display
      function incrementLocal() {
        // Retrieve the current Local score from Local Storage or set to 0 if not found
        let localScore = localStorage.getItem("localScore") || 0;
        // Increment the Local score
        localScore++;
        // Store the updated Local score in Local Storage
        localStorage.setItem("localScore", localScore);
        // Update the display of Local score
        document.getElementById("localScore").innerHTML = localScore;
      }

      // Function to increment Session score and update the display
      function incrementSession() {
        // Retrieve the current Session score from Session Storage or set to 0 if not found
        let sessionScore = sessionStorage.getItem("sessionScore") || 0;
        // Increment the Session score
        sessionScore++;
        // Store the updated Session score in Session Storage
        sessionStorage.setItem("sessionScore", sessionScore);
        // Update the display of Session score
        document.getElementById("sessionScore").innerHTML = sessionScore;
      }
        // On page load, display the current Local score and Session score
        document.getElementById("localScore").innerHTML =
        localStorage.getItem("localScore") || 0;
        document.getElementById("sessionScore").innerHTML =
        sessionStorage.getItem("sessionScore") || 0;