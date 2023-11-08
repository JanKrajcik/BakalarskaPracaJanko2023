/**
 * Class Vertex representing one vertex in diagram.
 * It has its index and holds array of its
 *  successors (other instances of Vertex class).
 */
class Vertex {
    constructor(index, successors = []) {
        //TODO Akoze haluz, ze v tomto jazyku nema nic typ. To nikomu nevadi? :D
        // Netreba pouzivat nejaky framework?????????????

        // Podciarknik sa dava pred nazov premennej, ked by mala byt
        // akoze private.
        this._index = index;
        this._successors = successors;
    }

    // Getter for the vertex index
    get index() {
        return this._index;
    }

    // Setter for the vertex index
    set index(index) {
        this._index = index;
    }

    // Getter for the array of successors
    get successors() {
        return this._successors;
    }

    // Setter for the array of successors
    set successors(successors) {
        this._successors = successors;
    }

    // Add a successor to the array
    addSuccessor(successor) {
        this._successors.push(successor);
    }

    // Remove a successor from the array
    removeSuccessor(successor) {
        // This code finds the index of successor in the array.
        // If successor is not found in array, it returns -1.
        const index = this._successors.indexOf(successor);
        // If successor exists (index is other than -1), it is removed.
        if (index !== -1) {
            this._successors.splice(index, 1);
        }
    }

}

/**
 * Class MDD representing diagram.
 * Stores root vertex of the diagram.
 */
class MDD {
    constructor(rootVertex) {
        this._rootVertex = rootVertex;
    }


    evaluate(arrayOfIntegers) {
        //TODO logika metody evaluate.

        // Haha, tato hlupost nevie radit metody, lebo to nevie, ze root vertex je typu Vertex.

        //TODO asi by tu malo ist o to, ze podla poctu vstupnych parametrov
        // prejdeme dany pocet vrcholov a s predpokladom, ze posledny vlastne
        // nie je vertex ale ResultVertex si od neho vypytame, ci je nula alebo 1?

        // Vo vertexoch potom predpokladame s tym, ze podla cisla cesty (0,1,...)
        // su rovnako zoradene v arrayliste, teda ak vytiahneme nulty prvok,
        // ako by sme isli cestou 0, ak vytiahneme prvy, ako by sle isli cestou 1?
        //this._rootVertex._successors.
    }
}
class ResultVertex {
    constructor(name, year) {
        this.name = name;
        this.year = year;
    }
}