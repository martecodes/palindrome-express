var trash = document.getElementsByClassName("fa-trash");
var question = document.getElementsByClassName("fas fa-question");

Array.from(question).forEach(function(element) {
    element.addEventListener('click', function(){
        const word = this.parentNode.parentNode.childNodes[1].innerText 
        const backwards = this.parentNode.parentNode.childNodes[5].innerText
        const result = this.parentNode.parentNode.childNodes[9].innerText
        const question = parseFloat(this.parentNode.parentNode.childNodes[11].innerText)
      fetch('questions', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'word': word,
            'backwards': backwards,
            'result': result,
            'question': question
        })
      })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        window.location.reload(true)
      })
    });
});


// event listener for deleting when clicking trash can
Array.from(trash).forEach(function(element) {
    element.addEventListener('click', function(){
      const word = this.parentNode.parentNode.childNodes[1].innerText // is
      const backwards = this.parentNode.parentNode.childNodes[5].innerText
      const result = this.parentNode.parentNode.childNodes[9].innerText
      fetch('words', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'word': word,
          'backwards': backwards,
          'result': result
        })
      }).then(function (response) {
        window.location.reload()
      })
    });
});