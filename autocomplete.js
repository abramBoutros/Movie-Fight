const createAutoComplete = ({
    // parameter 1 , where to render the autocomplete
    root , 
    // parameter 2, how show an individual item
    renderOption, 
    // parameter 3, what to do when an item is clicked
    onOptionSelect,
    // parameter 4, what to fill after an item is clicked
    inputValue,
    // parameter 5, how to fetch the data
    fetchData
}) => {
        root.innerHTML =`
            <label><b>Search</b></label>
            <input class="input">
            <div class="dropdown">
                <div class="dropdown-menu" role="menu">
                    <div class="dropdown-content results"></div>
                </div>
            </div>
`;

const input = root.querySelector('input');
const dropdown = root.querySelector(".dropdown");
const resultsWrapper = root.querySelector(".results");



const onInput = async event => {   
// this function will be called every time the user make an input so we used a helper function to add a type of delay to reduce the api calls 
// chech the debounce function
    const items = await fetchData(event.target.value);  

    //check if there is no items fetched close the list
    if(!items.length){
        dropdown.classList.remove('is-active');
        return;
    }

    // clear the results to fetch new data
    resultsWrapper.innerHTML='';
    // add is-active class to show the dropdown menu
    dropdown.classList.add('is-active');

    // creat anchors for the results and append them to the results div
    for (let item of items){
        const option = document.createElement('a');

        option.classList.add("dropdown-item");
        option.innerHTML = renderOption(item);
        // when user select this item
        option.addEventListener('click', () => {
            // remove the menu
            dropdown.classList.remove('is-active');
            input.value = inputValue(item);
            onOptionSelect(item);
        });

        resultsWrapper.appendChild(option);
    };
};
//add the event listener to the input element
    //the params of debounce are a cb function and a customized delay
input.addEventListener('input',debounce(onInput, 500));


document.addEventListener('click', event => {
    // if the user clicked outside the div root close the shown menu
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-active');
    }
});
};