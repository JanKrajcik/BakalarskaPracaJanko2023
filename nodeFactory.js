import { TerminalNode, InternalNode } from "./diagram.js";

/**
 * NodeFactory class responsible for creating nodes in the Multi-Decision Diagram (MDD).
 */
class NodeFactory {
    /**
     * Constructs a NodeFactory with maps for storing terminal and internal nodes.
     */
    constructor() {
        // Stores unique terminal nodes. Key is the value, value is TerminalNode object.
        this._terminalTable = new Map();

        // Stores unique internal nodes. Key is composite key made of index and successors, value is InternalNode object.
        this._internalTable = new Map();
    }

    /**
     * Generates a composite key for identifying internal nodes uniquely.
     * This key combines an index with its successors to create a string representation,
     * ensuring internal nodes with the same structure can be identified and reused.
     *
     * @param {number} index - The index of the node.
     * @param {Array} successors - An array representing the successors of the node.
     * @returns {string} A composite key that uniquely identifies an internal node.
     */
    makeCompositeKey(index, successors = []) {
        const successorsString = successors.toString();
        return `${index}:${successorsString}`;
    }

    /**
     * Checks if a node is considered redundant. A node is redundant if all its
     * successors point to the same node, implying that any decision leads to the same outcome.
     * Redundant nodes can be simplified to directly connect to the common successor node.
     *
     * @param {(InternalNode|TerminalNode)[]} successors - An array of node successors to check for redundancy.
     * @returns {boolean} True if the node is redundant (all successors are the same instance), false otherwise.
     */
    isRedundant(successors = []) {
        if (successors.length === 0) {
            // If there are no successors, the node cannot be redundant
            return false;
        }

        const firstSuccessor = successors[0];
        // We check if all successors are the same instance as the first successor
        for (let i = 1; i < successors.length; i++) {
            if (successors[i] !== firstSuccessor) {
                // If any successor is not the same instance as the first successor, the node is not redundant
                return false;
            }
        }

        // If all successors are the same instance as the first successor, the node is redundant
        return true;
    }

    /**
     * Creates or retrieves a terminal node with the specified value. Implements the Flyweight pattern by ensuring that
     * for each unique value, only one terminal node exists in the system. This approach supports node reuse,
     * minimizes memory consumption, and prevents the proliferation of duplicate terminal nodes.
     *
     * @param {number} value - The value for the terminal node.
     * @returns {TerminalNode} A terminal node corresponding to the specified value.
     */
    createTerminalNode(value) {
        if (this._terminalTable.has(value)) {
            return this._terminalTable.get(value);
        } else {
            let tempTerminalNode = new TerminalNode(value)
            this._terminalTable.set(value, tempTerminalNode);
            return tempTerminalNode;
        }
    }

    /**
     * Creates or retrieves an internal node with the given index and successors, applying the Flyweight pattern
     * to minimize memory usage by reusing existing nodes with the same structure. This method ensures uniqueness
     * through the use of composite keys and supports the optimization of the diagram by preventing the creation
     * of redundant nodes.
     *
     * If the successors indicate that the node would be redundant, it returns the first successor directly,
     * further optimizing the diagram's structure.
     *
     * @param {number} index - The index of the node.
     * @param {Array} successors - An array of successors for the node.
     * @returns {InternalNode|TerminalNode} An internal node, or in the case of redundancy, the common successor node.
     */
    createInternalNode(index, successors = []) {
        let compositeKey = this.makeCompositeKey(index, successors);
        if (this.isRedundant(successors)) {
            return successors[0];
        } else if (this._internalTable.has(compositeKey)) {
            return this._internalTable.get(compositeKey);
        } else {
            let tempInternalNode = new InternalNode(index, successors);
            let key = this.makeCompositeKey(index, successors);
            this._internalTable.set(key, tempInternalNode);
            return tempInternalNode;
        }
    }
}

export { NodeFactory };

// Enable CommonJS only if running in Node.js (Jest)
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = { NodeFactory };
}