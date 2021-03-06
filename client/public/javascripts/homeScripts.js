const hostname = 'localhost';
const port = 3000;

window.onload = function() {
    // Get search elements
    var searchTerm = document.getElementById("searchField");
    const form = document.querySelector('form');
    var posButton = document.getElementById('pos');
    var negButton = document.getElementById('neg');
    var allButton = document.getElementById('all');

    posButton.addEventListener('click', (e) => {
        e.preventDefault();
        form.action = '/positive';
        form.submit();
    })

    negButton.addEventListener('click', (e) => {
        e.preventDefault();
        form.action = '/negative';
        form.submit();
    })

    allButton.addEventListener('click', (e) => {
        e.preventDefault();
        form.action = '/';
        form.submit();
    })
}