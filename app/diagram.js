/**
 * Changelog:
 * -Table:
 *      -isRedundant()
 *      -createTerminalNode()
 *      -createInternalNode()
 *      -Tests for all of these functions.
 * -Diagram:
 *      -InternalNode has new function equals, which evaluates, whether argument and this InternalNode have same successors and index.
 *      -MDD has to be crated with InternalNode or TerminalNode as rootNode.
 *      -Both internal and TerminalNode have toString() method implemented.
 */

/**
 * Class InternalNode representing one InternalNode in diagram.
 * It has its index and holds array of its
 *  successors (other instances of InternalNode class).
 */
class InternalNode {
    constructor(index, successors = []) {
        // Underscore before name of the variable means, that it is private. (It is just a que for programmer, JS ignores it.)
        this._index = index;
        this._successors = successors;
        // Term sons could be used instead of successors, I like successors more, as they seem more appropriate to me.

        // Edges are not needed here, the drawing method knows which edge is what number,
        // as they are going to be in the due order here in successors array.
        //PROBLEM - What if we want to have an edge with title 1, even though we only have one successor from the original InternalNode?
        // Could be a problem with this architecture. Another option could be editing it only on drawing layer, which I'm not sure is the best way to do it.
    }

    // Getter for the InternalNode index
    get index() {
        return this._index;
    }

    /**
     * !!!! Needed for testing, DO NOT REMOVE !!!!
     * It will probably be needed even outside the testing, as you have to create InternalNode,
     * before you can use it as successor when creating another InternalNode.
     * Another option will be, to create the diagram from the bottom, where successors
     * already exist when creating another layer of InternalNodes closer to the root.
     * Add successor to the _successors array.
     * @param successor is another instance of InternalNode class.
     */
    addSuccessor(successor) {
        this._successors.push(successor);
    }

    // Getter for the array of successors
    get successors() {
        return this._successors;
    }

    /**
     * @param index index of the successor in the _successors array of this InternalNode.
     * @returns {*|null} returns the InternalNode from the _successors array based on its index.
     *                   If index is nonsense or out of bounds, returns null.
     */
    getSuccessor(index) {
        if (index >= 0 && index < this._successors.length) {
            return this._successors[index];
        }
        return null; // Return null if the index is out of bounds
    }

    /**
     * @returns number of successors in the _successors array of this InternalNode.
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

    /**
     * Method to check if this InternalNode is equal to another InternalNode.
     * @param {InternalNode} other - The other InternalNode to compare with.
     * @returns {boolean} - True if the indices and successors of the InternalNodes are equal, else false.
     */
    equals(other) {
        if (!(other instanceof InternalNode) &&  // Check if other is an instance of InternalNode
                    this.index !== other.index &&  // Check if the indices of this InternalNode and the other InternalNode are equal
                            this.successors.length !== other.successors.length) { // Check if other and this have same amount of successors.
            return false;
        }
        // Check if the successors of this InternalNode and the other InternalNode are equal
        // Successors are considered equal if they are the same instances in the same order
        for (let i = 0; i < this.successors.length; i++) {
            if (!this.successors[i].equals(other.successors[i])) {
                return false;
            }
        }
        return true;  // If all checks passed, return true
    }

    /**
     * Returns a string representation of the InternalNode, including its index and indices of its successors.
     * InternalNode indices are prefixed with 'N', and TerminalNode indices are prefixed with 'TN'.
     * @returns {string} A string representation of the InternalNode.
     */
    toString() {
        const successorIndices = this._successors.map(successor => {
            if (successor instanceof InternalNode) {
                return `N${successor.index}`;
            } else if (successor instanceof TerminalNode) {
                return `TN${successor.resultValue}`;
            } else {
                return 'UNKNOWN';
            }
        }).join(',');
        return `N${this._index}:${successorIndices}`;
    }
}

/**
 * Terminal node displaying the result value of the evaluation.
 */
class TerminalNode {
    constructor(value) {
        this.value = value;
    }

    // Getter for the value property
    get resultValue() {
        return this.value;
    }

    /**
     * Method to check if this TerminalNode is equal to another TerminalNode.
     * @param {TerminalNode} other - The other TerminalNode to compare with.
     * @returns {boolean} - True if the values of the TerminalNodes are equal, else false.
     */
    equals(other) {
        // Check if other is an instance of TerminalNode
        if (!(other instanceof TerminalNode)) {
            return false;
        }

        // Compare the values of this TerminalNode and the other TerminalNode
        return this.value === other.value;
    }

    /**
     * Returns a string representation of the TerminalNode, which is its result value.
     * @returns {string} A string representation of the TerminalNode.
     */
    toString() {
        return this.value;
    }
}

/**
 * Class MDD representing diagram.
 * Stores root InternalNode of the diagram.
 */
class MDD {
    constructor(rootNode) {
        if (!rootNode instanceof InternalNode && !rootNode instanceof TerminalNode) {
            return null;
        }
        this._rootNode = rootNode;
    }

    /**
     * Method evaluate evaluates the result of the given variablesValues in the MDD.
     *
     * Each integer corresponds to the path to take at decision node at integers index.
     * For example, if the input array is [0,1,0], and the internal nodes in MDD are ordered
     * by index (node with index 0 is root node, only nodes with index 1 are successors of root node,
     * only nodes with index 2 are successors of nodes with index 1,....) the variableValues would mean
     * to take the first path at the root node, then the second path at its successor,
     * and finally the first path at the successor of the second node.
     * @param {number[]} variablesValues - An array of integers such as: [0,1,0,0,0,1] representing the decision variablesValues.
     * @returns {TerminalNode|null} The result of the evaluation, which is TerminalNode if found, or null if not found.
     */
    evaluate(variablesValues) {
        let CurrentNode = this._rootNode;

        while (!(CurrentNode instanceof TerminalNode)) {
            if ((variablesValues.length-1) < CurrentNode.index || variablesValues[CurrentNode.index] > (CurrentNode.getSuccessorsCount() - 1)) {
                console.error(`Invalid decision at node index ${CurrentNode.index}: Either the decision exceeds the number of node's successors or it is beyond the provided decisions' scope.`);
                return null;
            }
            // Selects new CurrentNode from successors of CurrentNode.
            // The decision that is made on CurrentNode is based on index of the CurrentNode.
            //     n-th variableValue (decision) is performed on n-th node.
            CurrentNode = CurrentNode.successors[variablesValues[CurrentNode.index]];

        }
        return CurrentNode;
    }

    /**
     * Evaluates route and prints the path through the diagram.
     * @param {number[]} variablesValues - An array of integers representing the decisions on nodes.
     * @returns {TerminalNode|null} The result of the evaluation, which is a TerminalVertex if found, else null.
     */
    evaluateAndPrintPath(variablesValues) {
        let CurrentNode = this._rootNode;
        let path = []; // This will store the path as we traverse the graph

        while (!(CurrentNode instanceof TerminalNode)) {
            // Check for out-of-bounds or invalid decisions
            if ((variablesValues.length - 1) < CurrentNode.index || variablesValues[CurrentNode.index] < 0 || variablesValues[CurrentNode.index] >= CurrentNode.getSuccessorsCount()) {
                console.error(`Invalid decision at node index ${CurrentNode.index}: Either the decision exceeds the number of node's successors or it is beyond the provided decisions' scope.`);
                return null;
            }

            // Add the current node to the path before making the next move
            path.push(CurrentNode instanceof TerminalNode ? `TN${CurrentNode.resultValue}` : `N${CurrentNode.index}`);

            // Move to the next node based on the decision
            CurrentNode = CurrentNode.successors[variablesValues[CurrentNode.index]];
        }

        // Once the loop is done, it means we've reached a TerminalNode
        // Add the terminal node to the path as well
        path.push(`TN${CurrentNode.resultValue}`);

        // Print the path
        console.log('---Path through the diagram---');
        console.log(path.join(' -> '));

        return CurrentNode;
    }

    /**
     * Function to print the structure of the MDD recursively
     * @param {InternalNode|TerminalNode} node - The node being processed during the recursive calls.
     * @param {number} levelOfNode - in the "tree" of nodes
     *                      (Number of edges that separate the node from the root).
     */
    printMDDStructure(node, levelOfNode = 0) {
        const indentation = '  '.repeat(levelOfNode); // Create indentation based on the levelOfNode
        //Printing InternalNodes differently than TerminalNodes.
        if (node instanceof InternalNode) {
            console.log(`${indentation}N${node.index}`);
            // Print the structure recursively for each successor
            for (const successor of node.successors) {
                this.printMDDStructure(successor, levelOfNode + 1);
            }
        } else if (node instanceof TerminalNode) {
            console.log(`${indentation}TN${node.resultValue}`);
        } else {
            console.error('ERROR: Not an InternalNode or TerminalNode.'); // Print an error message if the node type is invalid
        }
    }
}


// TESTS************************************
/*const vertex1 = new InternalNode(1);
const vertex2 = new InternalNode(2);
const vertex3 = new InternalNode(3);
const vertex4 = new InternalNode(4);
const vertex5 = new InternalNode(5);

vertex1.addSuccessor(vertex2);
vertex1.addSuccessor(vertex3);
vertex1.addSuccessor(vertex4);
vertex2.addSuccessor(vertex5);


const mdd = new MDD(vertex1);
mdd.printMDDStructure(vertex1)*/

//Test on decision diagram from Picture 2.2 from thesis.
/*const internalNode0 = new InternalNode(0);
const internalNode11 = new InternalNode(1);
const internalNode12 = new InternalNode(1);
const internalNode21 = new InternalNode(2);
const internalNode22 = new InternalNode(2);

const terminalNode0 = new TerminalNode(1);
const terminalNode1 = new TerminalNode(0);
const terminalNode2 = new TerminalNode(2);

// Define the structure of the diagram
internalNode0.addSuccessor(internalNode11);
internalNode0.addSuccessor(internalNode12);
internalNode11.addSuccessor(terminalNode1);
internalNode11.addSuccessor(internalNode21);
internalNode12.addSuccessor(internalNode21);
internalNode12.addSuccessor(internalNode22);

internalNode21.addSuccessor(terminalNode1);
internalNode21.addSuccessor(terminalNode0);
internalNode21.addSuccessor(terminalNode0);
internalNode22.addSuccessor(terminalNode1);
internalNode22.addSuccessor(terminalNode2);
internalNode22.addSuccessor(terminalNode2);


console.log(internalNode11.toString());*/
/*// Create the MDD with the root internal node
const mdd = new MDD(internalNode0);
//mdd.printMDDStructure(internalNode0);
mdd.evaluateAndPrintPath([1, 0, 2]);*/


/*const internalNode1 = new InternalNode(0);
const internalNode2 = new InternalNode(1);
internalNode1.addSuccessor(internalNode2);
const mdd = new MDD(internalNode1);

mdd.evaluate([1]);*/

/*const vertex1 = new InternalNode(1);
const vertex2 = new InternalNode(2);
const vertex3 = new InternalNode(3);
const vertex4 = new InternalNode(4);
const vertex5 = new InternalNode(5);
const vertex6 = new InternalNode(6);
const vertex7 = new InternalNode(7);
const vertex8 = new InternalNode(8);
const vertex9 = new InternalNode(9);
const vertex10 = new InternalNode(10);
const vertex11 = new InternalNode(11);

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

module.exports = { InternalNode, TerminalNode, MDD };