/**
 * Changelog:
 * -Changed name of this class from triedy.js to diagram.js
 * -Removed some methods from Vertex that are not needed, as Vertex won't be changing much after being created.
 * -Added Jest tests for all the methods.
 *
 */

// Fun fact: this is called kebab-case: multivalued-decision-diagram
//               -||-       snake_case: multivalued_decision_diagram

/**
 * Class Vertex representing one vertex in diagram.
 * It has its index and holds array of its
 *  successors (other instances of Vertex class).
 */
class Vertex {
    constructor(index, successors = []) {
        // Underscore before name of the variable means, that it is private. (It is just a que for programmer, JS ignores it.)
        this._index = index;
        this._successors = successors;
        // Term sons could be used instead of successors, I like successors more, as they seem more appropriate to me.

        // Edges are not needed here, the drawing method knows which edge is what number,
        // as they are going to be in the due order here in this array.
        //TODO PROBLEM - What if we want to have an edge with title 1, even though we only have one successor from the original vertex?
        // Could be a problem with this architecture :D.

        // Ci vlastne tie bude vediet vykreslovacia metoda nakreslit sama
        // 0 alebo 1 podla pozicie successora v poli?
        // Aj ked, takymto pristupom by sme nemohli nasledne upravovat
        // jednotlive hrany, aku maju mat farbu, styl a pod.
    }

    //TODO pridat druhy konstruktor, kde bude len hodnota, co bude vlastne ten vysledny vrchol.
    // PROBLEM. Overload konstruktorov nie je mozny v JavaScripte.

    // Getter for the vertex index
    get index() {
        return this._index;
    }

    /**
     * !!!! Needed for testing, DO NOT REMOVE !!!!
     * It will probably be needed even outside the testing, as you have to create vertex,
     * before you can use it as successor when creating another vertex.
     * Another option will be, to create the diagram from the bottom, where successors
     * already exist when creating another layer of vertexes closer to the root.
     * Add successor to the _successors array.
     * @param successor is another instance of Vertex class.
     */
    addSuccessor(successor) {
        this._successors.push(successor);
    }

    // Getter for the array of successors
    get successors() {
        return this._successors;
    }

    /**
     * @param index index of the successor in the _successors array of this Vertex.
     * @returns {*|null} returns the Vertex from the _successors array based on its index.
     *                   If index is nonsense or out of bounds, returns null.
     */
    getSuccessor(index) {
        if (index >= 0 && index < this._successors.length) {
            return this._successors[index];
        }
        return null; // Return null if the index is out of bounds
    }

    /**
     * @returns number of successors in the _successors array of this Vertex.
     */
    getSuccessorsCount() {
        return this._successors.length;
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
    //TODO add tests for this class.
    //TODO implement logic to evaluate using this class.
    constructor(value) {
        this.value = value;
    }

    // Getter for the value property
    get resultValue() {
        return this.value;
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
        //TODO implement array of integers (such as: [0,1,0,0,0,1].) to be used as input.
        //TODO logika metody evaluate.

        // Haha, tato hlupost nevie radit metody, lebo to nevie, ze rootVertex je typu Vertex.

        //TODO asi by tu malo ist o to, ze podla poctu vstupnych parametrov
        // prejdeme dany pocet vrcholov a s predpokladom, ze posledny vlastne
        // nie je vertex ale ResultVertex si od neho vypytame, aka je jeho hodnota.

        // Vo vertexoch potom predpokladame s tym, ze podla cisla cesty (0,1,...)
        // su rovnako zoradene v arrayliste, teda ak vytiahneme nulty prvok,
        // ako by sme isli cestou 0, ak vytiahneme prvy, ako by sle isli cestou 1.

        this.printMDDStructure(this._rootVertex);
    }

    /**
     * Function to print the structure of the MDD recursively
     * @param vertex being processed during the recursive calls.
     * @param levelOfVertex  in the "tree" of vertexes
     *                      (Number of edges that separate the vertex from the root).
     */
    printMDDStructure(vertex, levelOfVertex = 0) {
        const indentation = '   '.repeat(levelOfVertex); // Create indentation based on the levelOfVertex
        console.log(`${indentation}Vertex ${vertex.index}`);
        for (const successor of vertex.successors) {
            this.printMDDStructure(successor, levelOfVertex + 1);
        }
    }
}


// TESTS************************************
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


module.exports = { Vertex, MDD };