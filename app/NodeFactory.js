const { TerminalNode, InternalNode } = require("./diagram");
class NodeFactory {
    constructor() {
        this._terminalTable = new Map();
        // Key is composite key made of index and successors. Value is InternalNode object.
        this._internalTable = new Map();
        //this._diagram = new Diagram();
    }

    /**
     * Makes composite key out of index and successors array of a node.
     *  It basically just creates one long string out of them.
     *
     * @param index of a node
     * @param successors of a node
     * @returns {string} composite key - one long string of index and successors.
     */
    makeCompositeKey(index, successors = []) {
        const successorsString = successors.toString();
        console.log(`${index}:${successorsString}`);
        return `${index}:${successorsString}`;
    }

    /**
     * Determines if the current node is redundant by analyzing its successors.
     *
     * A redundant node is a node with all edges leading to the same node. Decisions in such a node
     * will always result in the selection of the same successor (e.g., during evaluation). Therefore,
     * there is no need to keep such node in the diagram.
     *
     * @param {(InternalNode|TerminalNode)[]} successors - The list of successors to be analyzed.
     * @returns {boolean} - True if the node is redundant, false otherwise.
     */
    //This implementation was not good, it was comparing, whether two objects are have equal successors and recursively for their successors.
    // while it should only check, whether they are the same instances.
    /*isRedundant(successors = []) {
        let currentSuccessor;
        let i = 0;
        let previousWasInstanceOfTerminalNode;
        while (i <= successors.length) {
            currentSuccessor = successors[i];
            //If all the successors are not of the same type, node is certainly not redundant.
            if(currentSuccessor.instanceOf(TerminalNode)) {
                if (previousWasInstanceOfTerminalNode === false) {
                    /!* If current successor is TerminalNode and previous was InternalNode, we have found successors of different
                        types, which means, node is not redundant. *!/
                    return false;
                }
                previousWasInstanceOfTerminalNode = true;
            } else {
                if (previousWasInstanceOfTerminalNode === true) {
                    /!* If current successor is InternalNode and previous was TerminalNode, we have found successors of different
                        types, which means, node is not redundant. *!/
                    return false;
                }
                previousWasInstanceOfTerminalNode = false;
            }
            // If consecutive successors are of the same type, we have to check, whether they are the same.
            if (!successors[i-1].equals(currentSuccessor)) {
                // If consecutive successors are not the same, we can return, that the node isn't redundant.
                return false;
            }
            i++;
        }
        return true; // If we haven't found any argument against node being redundant, we can say, it is redundant.
    } */

    //Corrected implementation.
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
     * Factory function for the creation of terminal nodes.
     * @param value
     * @returns {TerminalNode|any}
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
     * Factory functions for the creation of internal nodes
     * @param index
     * @param successors
     * @returns {*}
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


module.exports = { NodeFactory };