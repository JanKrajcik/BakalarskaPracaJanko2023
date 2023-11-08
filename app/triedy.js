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
        //TODO Nebude tu treba ukladat aj nejako hrany?
        // Ci vlastne tie bude vediet vykreslovacia metoda nakreslit sama
        // 0 alebo 1 podla pozicie successora v poli?
        // Aj ked, takymto pristupom by sme nemohli nasledne upravovat
        // jednotlive hrany, aku maju mat farbu, styl a pod.
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
 * Final vertex displaying the result value of the evaluation.
 */
class ResultVertex {
    constructor(name, year) {
        this.name = name;
        this.year = year;
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

    /**
     * Method evaluate evaluates the result of the given steps in the MDD.
     * Input should be an array of integers such as: [0,1,0,0,0,1].
     */
    evaluate() {
        //TODO implement array of integers to be used as input.
        //TODO logika metody evaluate.

        // Haha, tato hlupost nevie radit metody, lebo to nevie, ze root vertex je typu Vertex.

        //TODO asi by tu malo ist o to, ze podla poctu vstupnych parametrov
        // prejdeme dany pocet vrcholov a s predpokladom, ze posledny vlastne
        // nie je vertex ale ResultVertex si od neho vypytame, ci je nula alebo 1?

        // Vo vertexoch potom predpokladame s tym, ze podla cisla cesty (0,1,...)
        // su rovnako zoradene v arrayliste, teda ak vytiahneme nulty prvok,
        // ako by sme isli cestou 0, ak vytiahneme prvy, ako by sle isli cestou 1?
        //this._rootVertex._successors.
        this.printMDDStructure(this._rootVertex);

    }
    // Function to print the structure of the MDD recursively
    printMDDStructure(vertex, level = 0) {
        const indentation = '   '.repeat(level); // Create indentation based on the level
        console.log(`${indentation}Vertex ${vertex.index}`);
        for (const successor of vertex.successors) {
            this.printMDDStructure(successor, level + 1);
        }
    }
}

const vertex1 = new Vertex(1);
const vertex2 = new Vertex(2);
const vertex3 = new Vertex(3);
const vertex4 = new Vertex(4);
const vertex5 = new Vertex(5);

vertex1.addSuccessor(vertex2);
vertex1.addSuccessor(vertex3);
vertex1.addSuccessor(vertex4);
vertex2.addSuccessor(vertex5);


const mdd = new MDD(vertex1);
mdd.evaluate();
