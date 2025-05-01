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

    /**
     * Gets the index of the node.
     * @returns {number} The index of the InternalNode.
     */
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

    /**
     * Gets the array of successors.
     * @returns {Array} Array of successor nodes.
     */
    getSuccessors() {
        return this._successors;
    }

    /**
     * Gets a specific successor by index.
     * @param {number} index - Index of the successor to retrieve.
     * @returns {InternalNode|TerminalNode|null} The successor node or null if out of bounds.
     */
    getSuccessor(index) {
        if (index >= 0 && index < this._successors.length) {
            return this._successors[index];
        }
        return null; // Return null if the index is out of bounds
    }

    /**
     * Gets the number of successors.
     * @returns {number} The number of successor nodes.
     */
    getSuccessorsCount() {
        return this._successors.length;
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
     * @param {number} value - The value that TerminalNode will represent.
     */
    constructor(value) {
        this._value = value;
    }

    /**
     * Gets the result value of the node.
     * @returns {number} The result value.
     */
    getResultValue() {
        return this._value;
    }

    /**
     * Returns a string representation of the TerminalNode, which is its result value.
     * @returns {string} A string representation of the TerminalNode.
     */
    toString() {
        return this._value;
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
        this._rootNode = rootNode;
    }

    /**
     * Gets the root node of the MDD.
     * @returns {InternalNode|TerminalNode} The root node.
     */
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
        }
    }
}

export { InternalNode, TerminalNode, MDD };

// Enable CommonJS only if running in Node.js (Jest)
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = { InternalNode, TerminalNode, MDD };
}