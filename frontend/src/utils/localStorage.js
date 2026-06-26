export const saveToLocalStorage = (key, value) => {
    try {
        if(!key || !value){
            throw new Error("key and value is required");
        }
        localStorage.setItem(String(key), value);
        return;
    } catch (error) {
        console.error("error saving to storage", error.message);
        throw error;
    }
}

export const getFromLocalStorage = (key) =>{
    try{
        if(!key){
            throw new Error("key is required")
        }
        return localStorage.getItem(key);
    }catch(error){
        console.error("error getting data", error.message);
        throw error;
    }
}