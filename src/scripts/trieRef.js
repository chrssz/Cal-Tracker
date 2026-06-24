import { Trie } from "../assets/helper/trie";

let trie = null;
function checkTrie(data){
    
    if(!trie){
        trie = new Trie(data);
    } else {
        trie.updateTrie(data);
    }
}

function getTrie(){
    return trie;
}


export {
    getTrie, checkTrie
};