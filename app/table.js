import { MDD } from "./diagram.js";
import { NodeFactory } from "./nodeFactory.js";

/**
 * Represents a Truth Table used for evaluating logical expressions.
 */
class TruthTable {
    /**
     * Constructs a TruthTable with the given domains and truth vector.
     * @param {number[]} domains - An array representing the domains of variables.
     * @param {number[]} truthVector - The truth vector for evaluation.
     */
    constructor(domains = [], truthVector = []) {
        // Domains and offsets together are staging variables needed for generating table and evaluating it.
        this._domains = domains;
        this._offsets = [];

        this._variablesCount = this._domains.length;
        this.createStagingTable();

        this._truthVector = truthVector;

        // Node factory for creating nodes in the MDD
        this._nodeFactory = new NodeFactory();
    }

    /**
     * Returns the domain value at a specific index in the TruthTable instance.
     * @param {number} index - The index of the variable domain to retrieve.
     * @returns {number|null} - The domain value if the index is valid, or null if the index is out of bounds.
     */
    getDomain(index) {
        if (index < 0 || index > this._domains.length - 1) {
            console.error(`There is no variable with index ${index}.Variables are from 0 to ${this._domains.length - 1}`);
            return null;
        }
        return this._domains[index];
    }

    //TODO Ask, what is the purpose of this method and how it should be implemented.
    getValue(index) {

    }

    /**
     * Creates the staging table used for generating the truth table.
     * @returns {void}
     */
    createStagingTable() {
        this._offsets[this._variablesCount - 1] = 1;
        for (let i = this._variablesCount - 2; i >= 0; i--) {
            this._offsets[i] = this._domains[i + 1] * this._offsets[i + 1];
        }
    }

    /**
     * Generates and returns the truth table based on the domains.
     * @returns {number[]} The generated truth table.
     */
    getTruthTable() {
        let truthTable;
        //This is the smartest declaration of 2D array I have found.
        let tableLength = this._domains.reduce((accumulator, currentValue) => accumulator * currentValue, 1); // Multiplies all the elements of an array.
        truthTable = Array.from({length: tableLength}, () => Array.from({length: this._domains.length}).fill(0));
        //Fill table with values of variables.
        for (let i = 0; i < this._variablesCount; i++) {
            for (let j = 1; j < tableLength; j++) {
                truthTable[j][i] = (Math.floor(j / this._offsets[i])) % this._domains[i];
            }
            //TODO
            // Lambda which will test, whether MDD and Table gives same result for same values will be executed here. Extract this method to a Utils class.

        }
        return truthTable;
    }

    /**
     * Evaluates the TruthTable based on provided variables values.
     * @param {number[]} variablesValues - An array of variable values.
     * @returns {number|null} - The evaluated result value if the evaluation can be performed, or null if the evaluation cannot be done.
     */
    evaluate(variablesValues = []) {
        if (variablesValues.length !== this._variablesCount) {
            console.error(`Evaluation cannot be performed. The number of provided variable values (${variablesValues.length}) does not match the expected number of variables (${this._variablesCount}).`);
        }

        let index = 0;
        for (let i = 0; i < this._variablesCount; i++) {
            index += this._offsets[i] * variablesValues[i];
        }
        return this._truthVector[index];
    }

    /**
     * Prints the truth table.
     * @returns {void}
     */
    printTable() {
        let truthTable = this.getTruthTable();
        // Print the row labels.
        let topRow = '';
        for (let i = 0; i < truthTable[0].length; i++) {
            topRow += `x${i} `;
        }
        topRow += '  f';
        console.log(topRow);

        // Print the truthTable values, straight line of '|' and truthVector values.
        for (let i = 0; i < truthTable.length; i++) {
            let row = '';
            for (let j = 0; j < truthTable[i].length; j++) {
                row += `${truthTable[i][j]}  `;
            }
            row += `| ${this._truthVector[i]}`;
            console.log(row);
        }
    }

    // This method should have a parameter truthVector, but we already
    // have access to it here, so we don't have to pass it.
    /**
     * Converts the truth vector and domains into an MDD (Multi-Decision Diagram) representation.
     * @returns {MDD} - The MDD created based on truthVector and domains.
     */
    fromVector() {
        // each line of stack contains a pair of [node, integer]
        let stack  = []; // push() to push, pop() to pop.
        let j = 0;

        while (j < this._truthVector.length) {
            let n = this._domains.length;
            let mn = this._domains[n-1];
            let successors = new Array(mn);
            for (let k = 0; k < mn; k++) {
                successors[k] = this._nodeFactory.createTerminalNode(this._truthVector[j]);
                j++;
            }
            let node = this._nodeFactory.createInternalNode(n-1, successors);
            //console.log("Node created in fromVector: " + node.toString());
            stack.push([node, n-1]);
            this.shrinkStack(stack);
        }
        let root = stack[stack.length - 1][0]; // "Peek" into the stack and retrieve just the node from the pair [node, integer].
        return new MDD(root);
    }

    /**
     * Shrinks the stack to optimize redundant nodes while building the MDD.
     * @param {Array[]} stack - The stack to shrink.
     * @returns {void}
     */
    shrinkStack(stack = []) {
        while (true) {
            let peekIndex = stack.length - 1;
            let node = stack[peekIndex][0]; // "Peek" into the stack and retrieve just the node from the pair [node, integer].
            let i = stack[peekIndex][1]; // "Peek" into the stack and retrieve just the integer from the pair [node, integer].
            if (i === 0) return; // If we are at the root of the diagram, we have nothing to reduce.

            let k = 0; // Used to peek k-th element from the top.
            let count = 0;
            let j; // Declared here for better performance.

            do {
                j = stack[peekIndex-k][1]; // Peek k-th (integer) element from the top of the stack.
                if (j === i) count++;
                k++;
            } while (k < stack.length && i === j);
            let miMinusOne = this._domains[i-1]; // Size of the domain of the (i-1)-th element.
            if (count < miMinusOne) return;// If count is smaller than size of the domain of the (i-1) -th element, return.
            let successors = [];
            for (let k = miMinusOne - 1; k >= 0; k--) {
                let poppedElement = stack.pop(); // Pop pair [node, integer] from the stack and
                successors[k] = poppedElement[0];       // retrieve just the node.
            }
            node = this._nodeFactory.createInternalNode(i-1, successors);
            stack.push([node, i-1]);
        }
    }
}

if (typeof window !== 'undefined') {
    window.TruthTable = TruthTable;
}

export { TruthTable };
// Enable CommonJS only if running in Node.js (Jest)
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = { TruthTable };
}