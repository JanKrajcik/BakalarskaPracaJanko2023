/**
 * Class InternalNode representing one InternalNode in diagram.
 * It has its index and holds array of its
 *  successors (other instances of InternalNode class).
 */
class InternalNode {
    /**
     * Constructs an InternalNode with the given index and optional successors.
     * @param {number} index - The index of the InternalNode.
     * @param {InternalNode[]} successors - An array of successor InternalNodes.
     */
    constructor(index, successors = []) {
        this._index = index;
        this._successors = successors;
    }

    // Getter for the InternalNode index
    getIndex() {
        return this._index;
    }

    /**
     * Adds a successor InternalNode to this InternalNode.
     * @param {InternalNode|TerminalNode} successor - The InternalNode to add as a successor.
     */
    addSuccessor(successor) {
        this._successors.push(successor);
    }

    // Getter for the array of successors
    getSuccessors() {
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
            this.getSuccessors().length !== other.getSuccessors().length) { // Check if other and this have same amount of successors.
            return false;
        }
        // Check if the successors of this InternalNode and the other InternalNode are equal
        // Successors are considered equal if they are the same instances in the same order
        for (let i = 0; i < this.getSuccessors().length; i++) {
            if (!this.getSuccessors()[i].equals(other.getSuccessors()[i])) {
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
                return `N${successor.getIndex()}`;
            } else if (successor instanceof TerminalNode) {
                return `TN${successor.getResultValue()}`;
            } else {
                return 'UNKNOWN';
            }
        }).join(',');
        return `N${this._index}:${successorIndices}`;
    }
}

/**
 * Represents a terminal node in the MDD, displaying the result value of the evaluation.
 */
class TerminalNode {
    /**
     * Constructs a TerminalNode with the given value.
     * @param {*} value - The value that TerminalNode will represent.
     */
    constructor(value) {
        this.value = value;
    }

    // Getter for the value property
    getResultValue() {
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
    /**
     * Constructs an MDD with the given root node.
     * @param {InternalNode|TerminalNode} rootNode - The root node of the MDD.
     */
    constructor(rootNode) {
        if (!rootNode instanceof InternalNode && !rootNode instanceof TerminalNode) {
            return null;
        }
        this._rootNode = rootNode;
    }

    getRoot() {
        return this._rootNode;
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
            if ((variablesValues.length - 1) < CurrentNode.getIndex() || variablesValues[CurrentNode.getIndex()] > (CurrentNode.getSuccessorsCount() - 1)) {
                console.error(`Invalid decision at node index ${CurrentNode.getIndex()}: Either the decision exceeds the number of node's successors or it is beyond the provided decisions' scope.`);
                return null;
            }
            // Selects new CurrentNode from successors of CurrentNode.
            // The decision that is made on CurrentNode is based on index of the CurrentNode.
            //     n-th variableValue (decision) is performed on n-th node.
            CurrentNode = CurrentNode.getSuccessors()[variablesValues[CurrentNode.getIndex()]];

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
            if ((variablesValues.length - 1) < CurrentNode.getIndex() || variablesValues[CurrentNode.getIndex()] < 0 || variablesValues[CurrentNode.getIndex()] >= CurrentNode.getSuccessorsCount()) {
                console.error(`Invalid decision at node index ${CurrentNode.getIndex()}: Either the decision exceeds the number of node's successors or it is beyond the provided decisions' scope.`);
                return null;
            }

            // Add the current node to the path before making the next move
            path.push(CurrentNode instanceof TerminalNode ? `TN${CurrentNode.getResultValue()}` : `N${CurrentNode.getIndex()}`);

            // Move to the next node based on the decision
            CurrentNode = CurrentNode.getSuccessors()[variablesValues[CurrentNode.getIndex()]];
        }

        // Once the loop is done, it means we've reached a TerminalNode
        // Add the terminal node to the path as well
        path.push(`TN${CurrentNode.getResultValue()}`);

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
    printMDDStructure(node = this._rootNode, levelOfNode = 0) {
        const indentation = '  '.repeat(levelOfNode); // Create indentation based on the levelOfNode
        //Printing InternalNodes differently than TerminalNodes.
        if (node instanceof InternalNode) {
            console.log(`${indentation}N${node.getIndex()}`);
            // Print the structure recursively for each successor
            for (const successor of node.getSuccessors()) {
                this.printMDDStructure(successor, levelOfNode + 1);
            }
        } else if (node instanceof TerminalNode) {
            console.log(`${indentation}TN${node.getResultValue()}`);
        } else {
            console.error('ERROR: Not an InternalNode or TerminalNode.'); // Print an error message if the node type is invalid
        }
    }
}

export { InternalNode, TerminalNode, MDD };

// Enable CommonJS only if running in Node.js (Jest)
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = { InternalNode, TerminalNode, MDD };
}