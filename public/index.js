


const button = document.getElementById("showText");


//Sets inputted text into Test object and simultaneously evaluates the text
button.addEventListener('click', function() {

   

    fetch('/', {
      method: "GET"
    })
      .then((data) => {
        console.log("Worked!");
        console.log(data);
        document.getElementById("demo").innerHTML = "The Overall Lexical Density is " + data.old;
        document.getElementById("demo2").innerHTML = "The Lexical Densities for each sentence are " + data.ldarr;
      })
      .catch(error => {
        console.error("Fetch error:", error);
      })
  });

  button.addEventListener('click', function() {

      let text = document.getElementById("writtenText").value;
      console.log(text);

        fetch('/', {
            method: 'POST',
            body:JSON.stringify({text:text})
        })
        .then((data) =>  console.log(data))
        .catch((err)=>console.log(err))
    });

