//const {Diagram} = require('./Diagram');
const {/*TerminalNode, InternalNode,*/ MDD} = require("./diagram");
const {NodeFactory} = require('./NodeFactory');

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
        // Domains and offsets together are staging table needed for generating table and evaluating it.
        this._domains = domains;
        this._offsets = [];

        this._variablesCount = this._domains.length;
        this.createStagingTable();

        this._truthTable = null;
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
     * Generates the truth table for the specified variables and their domains.
     * @returns {void}
     */
    generateTable() {
        //This is the smartest declaration of 2D array I have found.
        let tableLength = this._domains.reduce((accumulator, currentValue) => accumulator * currentValue, 1); // Multiplies all the elements of an array.
        this._truthTable = Array.from({length: tableLength}, () => Array.from({length: this._domains.length}).fill(0));
        //Fill table with values of variables.
        for (let i = 0; i < this._variablesCount; i++) {
            for (let j = 1; j < tableLength; j++) {
                this._truthTable[j][i] = (Math.floor(j / this._offsets[i])) % this._domains[i];
            }
        }
    }

    /**
     * Evaluates the TruthTable based on provided variables values.
     * @param {number[]} variablesValues - An array of variable values.
     * @returns {number|null} - The evaluated result value if the evaluation can be performed, or null if the evaluation cannot be done.
     */
    evaluate(variablesValues = []) {
        //this.createStagingTable();
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
        // Print the row labels.
        let topRow = '';
        for (let i = 0; i < this._truthTable[0].length; i++) {
            topRow += `x${i} `;
        }
        topRow += '  f';
        console.log(topRow);

        // Print the truthTable values, straight line of '|' and truthVector values.
        for (let i = 0; i < this._truthTable.length; i++) {
            let row = '';
            for (let j = 0; j < this._truthTable[i].length; j++) {
                row += `${this._truthTable[i][j]}  `;
            }
            row += `| ${this._truthVector[i]}`;
            console.log(row);
        }
    }

    // this method should have parameter truthVector, but we already
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
            let successors = new Array[mn];
            for (let k = 0; k < mn; k++) {
                successors[k] = this._nodeFactory.createTerminalNode(this._truthVector[j]);
                j++;
            }
            let node = this._nodeFactory.createInternalNode(n);
            stack.push([node, n]);
            this.shrinkStack();
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
        //TODO implement
        while (true) {
            let peekIndex = stack.length - 1;
            let node = stack[peekIndex][0]; // "Peek" into the stack and retrieve just the node from the pair [node, integer].
            let i = stack[peekIndex][1]; // "Peek" into the stack and retrieve just the integer from the pair [node, integer].
            //TODO ask Michal if this description is correct VVVVVVVV
            if (i === 1) return; // If we are at the root of the diagram, we have nothing to reduce???

            let k = 0; // Used to peek k-th element from the top.
            let count = 0;
            let j; // Declared here for better performance.

            do {
                j = stack[peekIndex-k][1]; // Peek k-th (integer) element from the top of the stack.
                if (j === i) count++;
            } while (k < stack.length && i === j);
            let miMinusOne = this._domains[i] - 1; // Size of the domain of the (i-1)-th element.
            if (count < miMinusOne) return; // If count is smaller than size of the domain of the (i-1) -th element, return.
            let successors = new Array[miMinusOne];
            for (let k = 0; k <= miMinusOne; k++) {
                successors[k] = stack[peekIndex][0]; // "Peek" into the stack and retrieve just the node from the pair [node, integer].
            }
            node = this._nodeFactory.createInternalNode(i-1, successors);
            stack.push([node, i-1]);
        }
    }
}

// Usage
//const tableOfTruth = new TruthTable([2,2,3], [0,0,0,0,1,1,0,1,1,0,2,2]);
//const tableOfTruth = new TruthTable([2,5,3], [1,0,0,1,0,1,1,1,1,0,1,0,0,0,1,0,1,0,0,1,0,1,0,0,0,1,0,1,1,1]);
//tableOfTruth.generateTable();
//tableOfTruth.printTable();
// console.log(tableOfTruth.evaluate([0, 0, 1]));
// console.log(tableOfTruth.evaluate([0, 0, 1]));
// console.log(tableOfTruth.evaluate([0, 0, 2]));
// console.log(tableOfTruth.evaluate([0, 1, 0]));
//console.log(tableOfTruth.evaluate([0, 1, 1])); //0
// console.log(tableOfTruth.evaluate([0, 1, 2]));
// console.log(tableOfTruth.evaluate([1, 0, 0]));
// console.log(tableOfTruth.evaluate([1, 0, 1]));
// console.log(tableOfTruth.evaluate([1, 0, 2]));
// console.log(tableOfTruth.evaluate([1, 1, 0]));
// console.log(tableOfTruth.evaluate([1, 1, 1]));
// console.log(tableOfTruth.evaluate([1, 1, 2]));

//console.log(truthTable);

/*const tableOfTruth = new TruthTable();
tableOfTruth.createTerminalNode(1);
tableOfTruth.createTerminalNode(1);
tableOfTruth.createTerminalNode(0);
tableOfTruth.createTerminalNode(1);
tableOfTruth.createTerminalNode(0);
console.log(tableOfTruth._terminalTable.size);*/

/*const tableOfTruth = new TruthTable();

// Create diagram structure in a bottom-up manner.
tableOfTruth.createTerminalNode(0);
tableOfTruth.createTerminalNode(1);
tableOfTruth.createTerminalNode(2);

tableOfTruth.createInternalNode(1, [tableOfTruth._terminalTable.get(0), tableOfTruth._terminalTable.get(1)]);
tableOfTruth.createInternalNode(1, [tableOfTruth._terminalTable.get(1), tableOfTruth._terminalTable.get(2)]);
//These two are not being created, as they are redundant. all their edges are leading to the same node.
tableOfTruth.createInternalNode(1, [tableOfTruth._terminalTable.get(2)]);
tableOfTruth.createInternalNode(2, [tableOfTruth._terminalTable.get(1)]);



//console.log(tableOfTruth.makeCompositeKey(1, [tableOfTruth._terminalTable.get(1).toString(), tableOfTruth._terminalTable.get(2)]).toString());
console.log(tableOfTruth.makeCompositeKey(1, [tableOfTruth._terminalTable.get(1), tableOfTruth._terminalTable.get(2)]));
console.log(tableOfTruth._internalTable.size);*/

module.exports = {TruthTable};