const hostname = 'localhost';
const port = 3000;

window.onload = function() { 
    //Get submit button
    var searchTerm = document.getElementById("searchField");
    /*
    //Add listener to submit button
    if(searchTerm.addEventListener) {
        searchTerm.addEventListener("click", function() {
            if (searchTerm.value == '') {
                searchTerm.value = '';
            }
        });
    }
    */

    const form = document.querySelector('form');
    var button = document.getElementById('searchButton');

    function getSearchURL() {
        searchURL = 'http://' + hostname + ':' + port + '/search/' + searchTerm.value;
        console.log(searchURL);
        return searchURL;
    }

    button.addEventListener('click', (e) => {
        e.preventDefault();
        form.action = getSearchURL();
        form.submit();
    })

}