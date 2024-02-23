class TruthTable {

    constructor(domains = [], truthVector = []) {
        // Domains and offsets together are staging table needed for generating table and evaluating it.
        this._domains = domains;
        this._offsets = [];

        this._variablesCount = this._domains.length;
        this.createStagingTable();

        this._truthTable = null;
        this._truthVector = truthVector;
    }

    //TODO Ask, what is the purpose of this method.
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

    createStagingTable() {
        this._offsets[this._variablesCount-1] = 1;
        for (let i = this._variablesCount-2; i >= 0; i--) {
            this._offsets[i] =  this._domains[i+1]*this._offsets[i+1];
        }
    }

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

    evaluate(variablesValues = []) {
        //TODO create staging table, algorithm for evaluation and returning result value.
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
}

// Usage
const tableOfTruth = new TruthTable([2,2,3], [0,0,0,0,1,1,0,1,1,0,2,2]);
//const tableOfTruth = new TruthTable([2,5,3], [1,0,0,1,0,1,1,1,1,0,1,0,0,0,1,0,1,0,0,1,0,1,0,0,0,1,0,1,1,1]);
tableOfTruth.generateTable();
tableOfTruth.printTable();
// console.log(tableOfTruth.evaluate([0, 0, 1]));
// console.log(tableOfTruth.evaluate([0, 0, 1]));
// console.log(tableOfTruth.evaluate([0, 0, 2]));
// console.log(tableOfTruth.evaluate([0, 1, 0]));
console.log(tableOfTruth.evaluate([0, 1, 1])); //0
// console.log(tableOfTruth.evaluate([0, 1, 2]));
// console.log(tableOfTruth.evaluate([1, 0, 0]));
// console.log(tableOfTruth.evaluate([1, 0, 1]));
// console.log(tableOfTruth.evaluate([1, 0, 2]));
// console.log(tableOfTruth.evaluate([1, 1, 0]));
// console.log(tableOfTruth.evaluate([1, 1, 1]));
// console.log(tableOfTruth.evaluate([1, 1, 2]));

//console.log(truthTable);



module.exports = { TruthTable };