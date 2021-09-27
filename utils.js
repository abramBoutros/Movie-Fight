// to make the least api calls
const debounce = (func, delay) => {
    let timeoutId;
    // this return will be passed to onInput that executes every input
    return (...args) =>{
        if(timeoutId){ // if there is a timeout, reset it becouse the user is still typing 
            clearTimeout(timeoutId);
        };
        // set a new time out and start over the count
        timeoutId = setTimeout( ()=>{
            func.apply(null , args);
        }  , delay)
    };
};

