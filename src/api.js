export async function api(){
    // This function serves to get all the favorites from the local storage.
    function getFavorites() {
        return JSON.parse(localStorage.getItem('favorites') || '[]');
    }

    // This changes to stored favorites data
    function setFavorites(favorites) {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // Instead of making two seperate functions, I decided to make a toggle instead
    function toggleFavorite(id) {
        let favorites = getFavorites();
        const index = favorites.indexOf(id);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(id);
        }
        setFavorites(favorites);
        renderFavorites();
        if (favoritesonly.checked == true){
            characterfilter = logFavoriteIDs();
            getCharacters(""+characterfilter+"");
        }
    }

    // Purely decorative. This just makes the icon change if needed.
    function renderFavorites() {
        const favorites = getFavorites();
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const id = parseInt(btn.dataset.id);
            btn.classList.toggle('unfavorited', !favorites.includes(id));
            btn.innerHTML = favorites.includes(id) ? '★' : '☆';
        });
    }

    // In order to display all the favorites, you need to get their ID in an order like "1,3,61". This function does this.
    function logFavoriteIDs() {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        return favorites.join(',');
    }      


    // This is the API call itself. Here I get all the characters and display them
    async function getCharacters(lookfor){
        // In this API there is no password, only a call to that API. The function "lookfor" serves as a filter
        let response = await fetch("https://rickandmortyapi.com/api/character/" + lookfor);
        let data = await response.json();

        // The for each loop tends to break when requested 1 or more ID's. This code makes it so I don't have to change that much code for those exeptions.
        let characters = [];
        if (Array.isArray(data)) {
            characters = data;
        } else if (data.results) {
            characters = data.results;
        } else {
            characters = [data];
        }

        // This code is to display the characters in cards. I learned in PHP how to use an for each loop with JSON, so I decided to look for a javascript equilivant.
        container.innerHTML="";
        characters.forEach(char => {
            const charDiv = document.createElement('div');
            charDiv.classList="col-xxl-3 col-xl-4 col-lg-4 col-sm-6 col-12 p-1 m-0";
            charDiv.innerHTML = `
            <div class="card text-light h-100" style="background-color: #50e02d;">
                <img src="${char.image}" class="card-img-top" alt="${char.name}">
                <div class="card-body flex-grow-1">
                <div class="d-flex justify-content-between align-items-start">
                    <h5 class="card-title mt-1">${char.name}</h5>
                    <button class="favorite-btn unfavorited" data-id="${char.id}" title="Toggle Favorite">☆</button>
                </div>
                <p class="card-text mb-1"><strong>Status:</strong> ${char.status}</p>
                <p class="card-text mb-1"><strong>Species:</strong> ${char.species}</p>
                <p class="card-text mb-1"><strong>Type:</strong> ${char.type || 'N/A'}</p>
                <p class="card-text mb-1"><strong>Gender:</strong> ${char.gender}</p>
                <p class="card-text mb-1"><strong>Origin:</strong> ${char.origin.name}</p>
                <p class="card-text mb-1"><strong>Location:</strong> ${char.location.name}</p>
                <p class="card-text mb-1"><strong>Episodes:</strong> ${char.episode.length}</p>
                </div>
                <div class="card-footer text-end" style="background-color: #45ad2b;">
                </div>
            </div>
            `;
            container.appendChild(charDiv);
        });

        // Making every favorite button run the functions above by adding event listeners
        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.dataset.id);
                toggleFavorite(id);
            });
        });

        renderFavorites();
    }


    // In order to keep a somwhat clear code I made this filter system. It's pretty basic, but it works.
    let filter = "";
    let speciesfilter = "";
    let genderfilter = "";
    let statusfilter = "";
    let namefilter = "";
    function UpdateFilter(){
        filter = speciesfilter+statusfilter+genderfilter+namefilter;
    }

    // The API I used displayed their characters in pages. So this code is basicaly just to change the page.
    let characterpage = 1;
    function updatePage(increment){
        currentpageoutput.value = Number(currentpageoutput.value) + increment;
        if (currentpageoutput.value < 1) {
            currentpageoutput.value = 1;
        }
        characterpage = currentpageoutput.value;
    }


    // These are all the HTML elements used in the javascript code.
    let container = document.querySelector('#characterlist');

    let previousbutton = document.querySelector('#previousbutton');
    let currentpageoutput = document.querySelector('#currentpage');
    let nextbutton = document.querySelector('#nextbutton');

    let speciesselect = document.querySelector("#speciesselect");
    let genderselect = document.querySelector("#genderselect");
    let statusselect = document.querySelector("#statusselect");
    let nameinput = document.querySelector("#nameinput");
    let favoritesonly = document.querySelector("#favoritesonly");


    // These are the event listeners for the HTML elements above.
    // I used an input to keep track of the current page, this has the benefit of making the user just fill in a page to go to.
    previousbutton.addEventListener('click', function(){
        updatePage(-1);
        getCharacters(characterfilter+"?page="+characterpage+filter);
    })

    nextbutton.addEventListener('click', function () {
        updatePage(1);
        getCharacters(characterfilter+"?page="+characterpage+filter);
    })

    currentpageoutput.addEventListener("input",function(){
        updatePage(0);
        getCharacters(characterfilter+"?page="+characterpage+filter);
    })

    // These are the actual filters. They have practically the same code, but I couldn't manage to make it a function.
    speciesselect.addEventListener("input", function(){
        if (speciesselect.value!=""){
            speciesfilter = "&species=" + speciesselect.value
        } else {
            speciesfilter = "";
        }
        characterpage = 1
        currentpageoutput.value = 1
        UpdateFilter();
        getCharacters(characterfilter+"?page="+characterpage+filter);
    })

    statusselect.addEventListener("input", function(){
        if (statusselect.value!=""){
            statusfilter = "&status=" + statusselect.value
        } else {
            statusfilter = "";
        }
        characterpage = 1
        currentpageoutput.value = 1
        UpdateFilter();
        getCharacters(characterfilter+"?page="+characterpage+filter);
    })

    genderselect.addEventListener("input", function(){
        if (genderselect.value!=""){
            genderfilter = "&gender=" + genderselect.value
        } else {
            genderfilter = "";
        }
        characterpage = 1
        currentpageoutput.value = 1
        UpdateFilter();
        getCharacters(characterfilter+"?page="+characterpage+filter);
    })

    nameinput.addEventListener("input", function(){
        if (nameinput.value!=""){
            namefilter = "&name=" + nameinput.value
        } else {
            namefilter = "";
        }
        characterpage = 1
        currentpageoutput.value = 1
        UpdateFilter();
        getCharacters(characterfilter+"?page="+characterpage+filter);
    })

    // This is used to make the favorites be shown or not
    let characterfilter="";
    favoritesonly.addEventListener("change", function (){
        if (favoritesonly.checked == true) {
            characterfilter = logFavoriteIDs();
            getCharacters(characterfilter+"?page="+characterpage+filter);
        } else {
            characterfilter = "";
            UpdateFilter();
            getCharacters(characterfilter+"?page="+characterpage+filter);
        }
    })

    // This is the initial API request
    getCharacters(characterfilter+"?page="+characterpage+filter);
}