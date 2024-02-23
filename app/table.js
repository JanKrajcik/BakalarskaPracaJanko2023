class TruthTable {

    constructor(domains = [], truthVector = []) {
        this._domains = domains;
        this._truthVector = truthVector;
        this._truthTable = null;
    }
    generateTable() {
        //This is the smartest declaration of 2D array I have found.
        let tableLength = this._domains.reduce((accumulator, currentValue) => accumulator * currentValue, 1); // Multiplies all the elements of an array.
        this._truthTable = Array.from({ length: tableLength }, () => Array.from({ length: this._domains.length }).fill(0));
        let offsets = []; // d(i)

        //Temp table to make Truth Table evaluation easier.
        let variablesCount = this._domains.length;
        offsets[variablesCount-1] = 1;
        for (let i = variablesCount-2; i >= 0; i--) {
            offsets[i] =  this._domains[i+1]*offsets[i+1];
        }
        //Fill table with values of variables.
        for (let i = 0; i < variablesCount; i++) {
            for(let j = 1; j < tableLength; j++) {
                this._truthTable[j][i] = (Math.floor(j/offsets[i]))%this._domains[i];
            }
        }
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
//console.log(truthTable);