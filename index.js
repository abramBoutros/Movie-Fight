const autoCompleteConfig ={
    // argument 2, how show an individual item
    renderOption(movie){
        // to chech if the img is avalable to show
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
       // pass the HTML we want to creat for every option
        return `
            <img src=${imgSrc} />
            ${movie.Title} (${movie.Year})`;
    },
   // argument 4, what to fill after an item is clicked
    inputValue(movie){
        return movie.Title;
    }, 
   // argument 5, how to fetch the data
    async fetchData(searchTerm){
       // we add the static url then the dynamic parts in the param
        const response = await axios.get("http://www.omdbapi.com/", {
            params: {
                apikey:'39f2c244',
                s: searchTerm
            }
        });
        if(response.data.Error){
            return[];
        };
        return response.data.Search;
    }
}

createAutoComplete({
    // rest of the arguments
    ...autoCompleteConfig,
    // argument 1 , where to render the autocomplete
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#left-summary"), 'left');
    }
});
createAutoComplete({
    // rest of the arguments
    ...autoCompleteConfig,
    // argument 1 , where to render the autocomplete
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#right-summary"), 'right');
    }
});

// declaring two movie vars to compare them
let leftMovie;
let rightMovie;



const onMovieSelect = async (movie,summaryElement,side) =>{
        // make a followup request to get more details about the selected movie
       // we add the static url then the dynamic parts in the param
        const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey:'39f2c244',
            i:  movie.imdbID
        }
    });
    summaryElement.innerHTML= movieTemplate(response.data);
    // asign left and right movies to there vars
    if(side === 'left'){
        leftMovie = response.data;
    }else{
        rightMovie = response.data;
    }
    // if both assigned
    if(leftMovie && rightMovie){
        runComparison();
    }
};

const runComparison = () =>{
    const leftSideStats = document.querySelectorAll("#left-summary .notification");
    const rightSideStats = document.querySelectorAll("#right-summary .notification");

    // select every two corresponding article and compare them
    leftSideStats.forEach( (leftStat , index) =>{
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if(rightSideValue > leftSideValue){
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
            rightStat.classList.add('is-primary');
            rightStat.classList.remove('is-warning');
        }else if(rightSideValue < leftSideValue ){
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
            leftStat.classList.add('is-primary');
            leftStat.classList.remove('is-warning');
        }
    })
};

const movieTemplate = movieDetail =>{
    // take the boxoffice string and parse it to an int
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')) ;
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

    // for awards we will add the wins to the nominations and oscars
    // then compare the two movies numbers as a hole
    // maybe i'll add some upgrades to the app in the future like a filter to the user to choose the comparing criteria

    let count = 0;
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) =>{
        const value = parseInt(word);
        if(isNaN(value)){
            return prev;
        }else{
            return prev + value;
        };

    }, 0);
    
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src=${movieDetail.Poster}>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>

        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>

        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>

        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>

        <article data-value=${imdbRating}  class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>

        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};  