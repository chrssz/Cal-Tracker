class Node {
    constructor() {
        this.children = new Map();
        this.ids = new Set();
    }
}

export class Trie {
    constructor(foods = []) {
        this.root = new Node();
        this.id_to_food = new Map();

        this.updateTrie(foods);
    }
    
    updateTrie(new_foods) {
        const new_set = new Set();
        const current = new_foods.length !== 0 ? new_foods : JSON.parse(localStorage.getItem("food-list") || "[]");
        new_foods.forEach(food => {
            new_set.add(food.id);
        });

        this.id_to_food.forEach((food, id) => {
            if (!new_set.has(id)) {
                this.del(food);
                this.id_to_food.delete(id);
            }
        });

        new_foods.forEach(food => {
            if (!this.id_to_food.has(food.id)) {
                this.add(food);
            }
        });
    }

    add(food) {
        const id = food.id;

        if (this.id_to_food.has(id)) {
            return;
        }

        this.id_to_food.set(id, food);

        const name = this.normalize(food.name);

        let current = this.root;
        current.ids.add(id);

        for(const char of name) {
            
            if (!current.children.has(char)) {
                current.children.set(char, new Node());
            }

            current = current.children.get(char);
            current.ids.add(id);
        }
    }

    del(food) {
        const id = food.id;
        const name = this.normalize(food.name);

        let current = this.root;

        current.ids.delete(id);

        for (const char of name) {
            if(!current.children.has(char)){
                return new Set();
            }
            current = current.children.get(char);
            current.ids.delete(id);
        }
    }

    getPrefix(prefix) {
        let current = this.root;

        for (const char of this.normalize(prefix)) {
            

            if (!current.children.has(char)) {
                return new Set();
            }

            current = current.children.get(char);
        }

        return current.ids;
    }

    normalize(str) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z]/g, '');
    }
}