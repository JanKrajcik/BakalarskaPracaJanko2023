const { TruthTable } = require('../app/table'); // Imports the TruthTable class from table.js.

describe('TruthTable - Table generating and printing', () => {
    it('should generate and print correct binary truth table for 2 variables.', () => {
        const tableOfTruth = new TruthTable([2, 2], [0, 0, 0, 1]);
        tableOfTruth.generateTable();
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

        tableOfTruth.printTable();

        expect(consoleLogSpy).toHaveBeenCalledTimes(5);
        expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'x0 x1   f');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(2, '0  0  | 0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(3, '0  1  | 0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(4, '1  0  | 0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(5, '1  1  | 1');

        consoleLogSpy.mockRestore();
    });

    it('should generate and print correct binary truth table for 3 variables.', () => {
        const tableOfTruth = new TruthTable([2, 2, 2], [0, 0, 0, 1, 1, 0, 0, 1]);
    tableOfTruth.generateTable();
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    tableOfTruth.printTable();

    expect(consoleLogSpy).toHaveBeenCalledTimes(9);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'x0 x1 x2   f');
    expect(consoleLogSpy).toHaveBeenNthCalledWith(2, '0  0  0  | 0');
    expect(consoleLogSpy).toHaveBeenNthCalledWith(3, '0  0  1  | 0');
    expect(consoleLogSpy).toHaveBeenNthCalledWith(4, '0  1  0  | 0');
    expect(consoleLogSpy).toHaveBeenNthCalledWith(5, '0  1  1  | 1');
    expect(consoleLogSpy).toHaveBeenNthCalledWith(6, '1  0  0  | 1');
    expect(consoleLogSpy).toHaveBeenNthCalledWith(7, '1  0  1  | 0');
    expect(consoleLogSpy).toHaveBeenNthCalledWith(8, '1  1  0  | 0');
    expect(consoleLogSpy).toHaveBeenNthCalledWith(9, '1  1  1  | 1');

    consoleLogSpy.mockRestore();
    });

    it('should generate and print correct binary truth table for 4 variables.', () => {
        const tableOfTruth = new TruthTable([2,2,2,2], [0,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0]);
        tableOfTruth.generateTable();
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

        tableOfTruth.printTable();

        expect(consoleLogSpy).toHaveBeenCalledTimes(17);

        expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'x0 x1 x2 x3   f');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(2, '0  0  0  0  | 0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(3, '0  0  0  1  | 1');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(4, '0  0  1  0  | 1');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(5, '0  0  1  1  | 0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(6, '0  1  0  0  | 1');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(7, '0  1  0  1  | 0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(8, '0  1  1  0  | 0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(9, '0  1  1  1  | 1');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(10, '1  0  0  0  | 1');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(11, '1  0  0  1  | 0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(12, '1  0  1  0  | 0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(13, '1  0  1  1  | 1');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(14, '1  1  0  0  | 0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(15, '1  1  0  1  | 1');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(16, '1  1  1  0  | 1');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(17, '1  1  1  1  | 0');

        consoleLogSpy.mockRestore();
    });

    it('should generate and print correct truth table for 3 variables, where one is ternary.', () => {
        // Test data from table 1.2 from thesis.
        const tableOfTruth = new TruthTable([2,2,3], [0,0,0,0,1,1,0,1,1,0,2,2]);
        tableOfTruth.generateTable();
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

        tableOfTruth.printTable();

        expect(consoleLogSpy).toHaveBeenCalledTimes(13);

        expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'x0 x1 x2   f');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(2, '0  0  0  | 0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(3, '0  0  1  | 0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(4, '0  0  2  | 0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(5, '0  1  0  | 0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(6, '0  1  1  | 1');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(7, '0  1  2  | 1');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(8, '1  0  0  | 0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(9, '1  0  1  | 1');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(10, '1  0  2  | 1');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(11, '1  1  0  | 0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(12, '1  1  1  | 2');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(13, '1  1  2  | 2');

        consoleLogSpy.mockRestore();
    });
});

describe('TruthTable - Table evaluation', () => {
    // Test data from table 1.2 from thesis.
    it('should evaluate each row of the table correctly.', () => {
        const tableOfTruth = new TruthTable([2,2,3], [0,0,0,0,1,1,0,1,1,0,2,2]);
        tableOfTruth.generateTable();

        expect(tableOfTruth.evaluate([0, 0, 0])).toBe(0);
        expect(tableOfTruth.evaluate([0, 0, 1])).toBe(0);
        expect(tableOfTruth.evaluate([0, 0, 2])).toBe(0);
        expect(tableOfTruth.evaluate([0, 1, 0])).toBe(0);
        expect(tableOfTruth.evaluate([0, 1, 1])).toBe(1);
        expect(tableOfTruth.evaluate([0, 1, 2])).toBe(1);
        expect(tableOfTruth.evaluate([1, 0, 0])).toBe(0);
        expect(tableOfTruth.evaluate([1, 0, 1])).toBe(1);
        expect(tableOfTruth.evaluate([1, 0, 2])).toBe(1);
        expect(tableOfTruth.evaluate([1, 1, 0])).toBe(0);
        expect(tableOfTruth.evaluate([1, 1, 1])).toBe(2);
        expect(tableOfTruth.evaluate([1, 1, 2])).toBe(2);
    });
});
