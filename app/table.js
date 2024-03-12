const { Diagram } = require('./Diagram');
const {TerminalNode, InternalNode} = require("./diagram"); // Import the Diagram class from the Diagram.js file

class TruthTable {

    constructor(domains = [], truthVector = []) {
        // Domains and offsets together are staging table needed for generating table and evaluating it.
        this._domains = domains;
        this._offsets = [];

        this._variablesCount = this._domains.length;
        this.createStagingTable();

        this._truthTable = null;
        this._truthVector = truthVector;
        // Key is the value represented by the terminal node. Value is TerminalNode object.
        this._terminalTable = new Map();
        // Key is composite key made of index and successors. Value is InternalNode object.
        this._internalTable = new Map();
        //this._diagram = new Diagram();
    }

    /**
     * Returns the domain value at a specific index in the TruthTable instance.
     * @param {number} index - The index of the variable domain to retrieve.
     * @returns {number|null} - The domain value if the index is valid, or null if the index is out of bounds.
     */
    getDomain(index) {
        if (index < 0 || index > this._domains.length-1) {
            console.error(`There is no variable with index ${index}.Variables are from 0 to ${this._domains.length-1}`);
            return null;
        }
        return this._domains[index];
    }

    //TODO Ask, what is the purpose of this method and how it should be implemented.
    getValue(index) {

    }

    /**
     * Creates array of offsets, which with domains create "staging table", which is used to generate table.
     * @returns {void}
     */
    createStagingTable() {
        this._offsets[this._variablesCount-1] = 1;
        for (let i = this._variablesCount-2; i >= 0; i--) {
            this._offsets[i] =  this._domains[i+1]*this._offsets[i+1];
        }
    }

    /**
     * Generates the truth table for the specified variables and their domains.
     * @returns {void}
     */
    generateTable() {
        //This is the smartest declaration of 2D array I have found.
        let tableLength = this._domains.reduce((accumulator, currentValue) => accumulator * currentValue, 1); // Multiplies all the elements of an array.
        this._truthTable = Array.from({ length: tableLength }, () => Array.from({ length: this._domains.length }).fill(0));
        //Fill table with values of variables.
        for (let i = 0; i < this._variablesCount; i++) {
            for(let j = 1; j < tableLength; j++) {
                this._truthTable[j][i] = (Math.floor(j/this._offsets[i]))%this._domains[i];
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
        if (variablesValues.length !== this._variablesCount ) {
            console.error(`Evaluation cannot be performed. The number of provided variable values (${variablesValues.length}) does not match the expected number of variables (${this._variablesCount}).`);
        }

        let index = 0;
        for (let i = 0; i < this._variablesCount; i++) {
            index += this._offsets[i]*variablesValues[i];
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

module.exports = { TruthTable };