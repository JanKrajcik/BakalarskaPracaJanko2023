/**
 * Changelog:
 * -evaluate() accepts array of integers as input and returns resultVertex now.
 * -Updated printMDDStructure() to support diagrams terminated with ResultVertexes, updated its tests to match new implementation.
 * -Added tests for evaluate().
 */

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
        // as they are going to be in the due order here in successors array.
        //TODO PROBLEM - What if we want to have an edge with title 1, even though we only have one successor from the original vertex?
        // Could be a problem with this architecture. Another option could be editing it only on drawing layer, which I'm not sure is the best way to do it.
    }

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
     *
     * Each integer corresponds to the path to take at each decision node.
     * For example, if the input array is [0,1,0], it means to take the first path at the root node,
     * then the second path at its successor, and finally the first path at the successor of the second node.
     * @param {number[]} steps - An array of integers such as: [0,1,0,0,0,1] representing the decision steps.
     * @returns {ResultVertex|null} The result of the evaluation, which is ResultVertex if found, or null if not found.
     */
    evaluate(steps) {
        let currentVertex = this._rootVertex;

        for (const step of steps) {
            const successors = currentVertex.successors;
            if (step >= 0 && step < successors.length) {
                currentVertex = successors[step];
            } else {
                console.error(`Invalid step ${step} at vertex ${currentVertex.index}`);
                return null;
            }

            // If the current vertex is a ResultVertex, return it
            if (currentVertex instanceof ResultVertex) {
                return currentVertex;
            }
        }

        // If no ResultVertex is found, return null
        return null;
    }

    /**
     * Evaluates route and prints the path through the diagram.
     * @param {number[]} steps - An array of integers representing the decision steps.
     * @returns {ResultVertex|null} The result of the evaluation, which is a ResultVertex if found, else null.
     */
    evaluateAndPrintPath(steps) {
        //console.log('---MDD structure--- ');
        //this.printMDDStructure(this._rootVertex);
        let currentVertex = this._rootVertex;
        let path = []; // Array to store the route through the diagram

        for (const step of steps) {
            const successors = currentVertex.successors;
            if (step >= 0 && step < successors.length) {
                // Store the index of the chosen successor in the path array
                path.push(currentVertex instanceof ResultVertex ? `RV${currentVertex.resultValue}` : `V${currentVertex.index}`);
                currentVertex = successors[step];
            } else {
                console.error(`Invalid step ${step} at vertex ${currentVertex.index}`);
                return null;
            }

            // If the current vertex is a ResultVertex, add it to the path and return it
            if (currentVertex instanceof ResultVertex) {
                path.push(`RV${currentVertex.resultValue}`);
                console.log('---Path through the diagram---');
                console.log(path.join(' -> ')); // Print the entire route in one line
                return currentVertex;
            }
        }

        // If no ResultVertex is found, return null
        return null;
    }

    /**
     * Function to print the structure of the MDD recursively
     * @param {Vertex|ResultVertex} vertex - The vertex being processed during the recursive calls.
     * @param {number} levelOfVertex - in the "tree" of vertexes
     *                      (Number of edges that separate the vertex from the root).
     */
    printMDDStructure(vertex, levelOfVertex = 0) {
        const indentation = '  '.repeat(levelOfVertex); // Create indentation based on the levelOfVertex
        // Check if the vertex is an instance of Vertex
        if (vertex instanceof Vertex) {
            console.log(`${indentation}V${vertex.index}`);
            // Print the structure recursively for each successor
            for (const successor of vertex.successors) {
                this.printMDDStructure(successor, levelOfVertex + 1);
            }
        } else if (vertex instanceof ResultVertex) {
            // If the vertex is an instance of ResultVertex, print "RV" followed by its resultValue
            console.log(`${indentation}RV${vertex.resultValue}`);
        } else {
            console.error('ERROR: Not a vertex or resultVertex.'); // Print an error message if the vertex type is invalid
        }
    }
}


// TESTS************************************
/*const vertex1 = new Vertex(1);
const vertex2 = new Vertex(2);
const vertex3 = new Vertex(3);
const vertex4 = new Vertex(4);
const vertex5 = new Vertex(5);

vertex1.addSuccessor(vertex2);
vertex1.addSuccessor(vertex3);
vertex1.addSuccessor(vertex4);
vertex2.addSuccessor(vertex5);


const mdd = new MDD(vertex1);
mdd.printMDDStructure(vertex1)*/


/*const vertex1 = new Vertex(1);
const vertex2 = new Vertex(2);
const vertex3 = new Vertex(3);
const vertex4 = new Vertex(4);
const vertex5 = new Vertex(5);
const vertex6 = new Vertex(6);
const vertex7 = new Vertex(7);
const vertex8 = new Vertex(8);
const vertex9 = new Vertex(9);
const vertex10 = new Vertex(10);
const vertex11 = new Vertex(11);

const resultVertex1 = new ResultVertex(1);
const resultVertex2 = new ResultVertex(2);
const resultVertex3 = new ResultVertex(3);
const resultVertex4 = new ResultVertex(4);

// Define the structure of the diagram
vertex1.addSuccessor(vertex2);
vertex1.addSuccessor(vertex3);
vertex2.addSuccessor(vertex4);
vertex2.addSuccessor(vertex5);
vertex4.addSuccessor(vertex6);
vertex4.addSuccessor(vertex7);
vertex5.addSuccessor(vertex8);
vertex5.addSuccessor(vertex9);
vertex8.addSuccessor(vertex10);
vertex9.addSuccessor(vertex11);

vertex6.addSuccessor(resultVertex1);
vertex7.addSuccessor(resultVertex2);
vertex10.addSuccessor(resultVertex3);
vertex11.addSuccessor(resultVertex4);

// Create the MDD with the root vertex
const mdd = new MDD(vertex1);
//mdd.printMDDStructure(vertex1);
mdd.evaluateAndPrintPath([0, 1, 0, 0, 0]);*/

/*const vertex1 = new Vertex(1);
const vertex2 = new Vertex(2);
const vertex3 = new Vertex(3);
const vertex4 = new Vertex(4);
const vertex5 = new Vertex(5);
const vertex6 = new Vertex(6);
const vertex7 = new Vertex(7);
const vertex8 = new Vertex(8);
const vertex9 = new Vertex(9);
const vertex10 = new Vertex(10);
const vertex11 = new Vertex(11);

const resultVertex1 = new ResultVertex(1);
const resultVertex2 = new ResultVertex(2);
const resultVertex3 = new ResultVertex(3);
const resultVertex4 = new ResultVertex(4);

// Define the structure of the diagram
vertex1.addSuccessor(vertex2);
vertex1.addSuccessor(vertex3);
vertex2.addSuccessor(vertex4);
vertex2.addSuccessor(vertex5);
vertex4.addSuccessor(vertex6);
vertex4.addSuccessor(vertex7);
vertex5.addSuccessor(vertex8);
vertex5.addSuccessor(vertex9);
vertex8.addSuccessor(vertex10);
vertex9.addSuccessor(vertex11);

vertex6.addSuccessor(resultVertex1);
vertex7.addSuccessor(resultVertex2);
vertex10.addSuccessor(resultVertex3);
vertex11.addSuccessor(resultVertex4);

// Create the MDD with the root vertex
const mdd = new MDD(vertex1);

// Call evaluateAndPrintPath with valid steps
const result = mdd.evaluateAndPrintPath([0, 1, 0, 0, 0]);*/

module.exports = { Vertex, ResultVertex, MDD };