const hostname = 'localhost';
const port = 3000;

window.onload = function() {
    // Get search elements
    var searchTerm = document.getElementById("searchField");
    const form = document.querySelector('form');
    var button = document.getElementById('searchButton');

    // URL to redirect page to
    function getSearchURL() {
        searchURL = 'http://' + hostname + ':' + port + '/search/' + searchTerm.value;
        console.log(searchURL);
        return searchURL;
    }

    // Go to URL when button is clicked
    button.addEventListener('click', (e) => {
        e.preventDefault();
        form.action = getSearchURL();
        form.submit();
    })
}