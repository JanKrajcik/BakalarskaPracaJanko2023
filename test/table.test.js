const {TruthTable} = require('../app/table'); // Imports the TruthTable class from table.js.
const {TerminalNode, InternalNode} = require('../app/diagram'); // Imports the TruthTable class from table.js.

describe('TruthTable - Table generating and printing', () => {
    it('should generate and print correct binary truth table for 2 variables.', () => {
        const tableOfTruth = new TruthTable([2, 2], [0, 0, 0, 1]);

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
        tableOfTruth.getTruthTable();
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
        const tableOfTruth = new TruthTable([2, 2, 2, 2], [0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0]);
        tableOfTruth.getTruthTable();
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
        const tableOfTruth = new TruthTable([2, 2, 3], [0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 2, 2]);
        tableOfTruth.getTruthTable();
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
        const tableOfTruth = new TruthTable([2, 2, 3], [0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 2, 2]);
        tableOfTruth.getTruthTable();

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

describe('TruthTable - fromTable', () => {
    it('should create only one TerminalNode for each value', () => {
        const tableOfTruth = new TruthTable();

        // Call createTerminalNode multiple times with the same argument
        tableOfTruth._nodeFactory.createTerminalNode(1);
        tableOfTruth._nodeFactory.createTerminalNode(0);
        tableOfTruth._nodeFactory.createTerminalNode(0);
        tableOfTruth._nodeFactory.createTerminalNode(1);
        tableOfTruth._nodeFactory.createTerminalNode(2);
        tableOfTruth._nodeFactory.createTerminalNode(1);
        tableOfTruth._nodeFactory.createTerminalNode(2);
        tableOfTruth._nodeFactory.createTerminalNode(0);
        tableOfTruth._nodeFactory.createTerminalNode(1);
        tableOfTruth._nodeFactory.createTerminalNode(1);
        tableOfTruth._nodeFactory.createTerminalNode(2);

        // Assert that only three TerminalNode were created.
        expect(tableOfTruth._nodeFactory._terminalTable.size).toBe(3);

        // Assert that TerminalNodes have been created.
        expect(tableOfTruth._nodeFactory._terminalTable.get(0)).toBeInstanceOf(TerminalNode);
        expect(tableOfTruth._nodeFactory._terminalTable.get(1)).toBeInstanceOf(TerminalNode);
        expect(tableOfTruth._nodeFactory._terminalTable.get(2)).toBeInstanceOf(TerminalNode);

        // Assert the values of created terminalNodes.
        expect(tableOfTruth._nodeFactory._terminalTable.get(0).value).toBe(0);
        expect(tableOfTruth._nodeFactory._terminalTable.get(1).value).toBe(1);
        expect(tableOfTruth._nodeFactory._terminalTable.get(2).value).toBe(2);
    });

    it('should create only one InternalNode for each specific node instance, as no duplicates are allowed.', () => {
        // Initialize a test TruthTable instance
        const tableOfTruth = new TruthTable();

        // Create diagram structure in a bottom-up manner.
        tableOfTruth._nodeFactory.createTerminalNode(0);
        tableOfTruth._nodeFactory.createTerminalNode(1);
        tableOfTruth._nodeFactory.createTerminalNode(2);

        tableOfTruth._nodeFactory.createInternalNode(1, [tableOfTruth._nodeFactory._terminalTable.get(0), tableOfTruth._nodeFactory._terminalTable.get(1)]);
        tableOfTruth._nodeFactory.createInternalNode(1, [tableOfTruth._nodeFactory._terminalTable.get(1), tableOfTruth._nodeFactory._terminalTable.get(2)]);

        tableOfTruth._nodeFactory.createInternalNode(1, [tableOfTruth._nodeFactory._terminalTable.get(1), tableOfTruth._nodeFactory._terminalTable.get(2)]);
        tableOfTruth._nodeFactory.createInternalNode(1, [tableOfTruth._nodeFactory._terminalTable.get(0), tableOfTruth._nodeFactory._terminalTable.get(1)]);
        // Assert that the size of the internalTable is 2, meaning five internalNodes were created.
        expect(tableOfTruth._nodeFactory._internalTable.size).toBe(2);
    });

    it('should not create any InternalNode, as they would be redundant (all their edges are leading to the same node).', () => {
        // Initialize a test TruthTable instance
        const tableOfTruth = new TruthTable();

        // Create diagram structure in a bottom-up manner.
        tableOfTruth._nodeFactory.createTerminalNode(0);
        tableOfTruth._nodeFactory.createTerminalNode(1);
        tableOfTruth._nodeFactory.createTerminalNode(2);

        tableOfTruth._nodeFactory.createInternalNode(1, [tableOfTruth._nodeFactory._terminalTable.get(2)]);
        tableOfTruth._nodeFactory.createInternalNode(2, [tableOfTruth._nodeFactory._terminalTable.get(1)]);
        tableOfTruth._nodeFactory.createInternalNode(2, [tableOfTruth._nodeFactory._terminalTable.get(2)]);
        tableOfTruth._nodeFactory.createInternalNode(1, [tableOfTruth._nodeFactory._terminalTable.get(2)]);
        tableOfTruth._nodeFactory.createInternalNode(1, [tableOfTruth._nodeFactory._terminalTable.get(1)]);
        // Assert that the size of the internalTable is 0, as no internalNode should have been created.
        expect(tableOfTruth._nodeFactory._internalTable.size).toBe(0);
    });
});

describe('TruthTable - fromVector method', () => {
    it('should generate a correct MDD structure and print it', () => {
        const tableOfTruth = new TruthTable([2, 2, 3], [0, 1, 2, 0, 1, 2, 0, 1, 2, 1, 1, 2]);
        const mddFromVector = tableOfTruth.fromVector();

        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

        mddFromVector.printMDDStructure();

        expect(consoleLogSpy).toHaveBeenCalledTimes(14);
        expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'N0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(2, '  N2');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(3, '    TN0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(4, '    TN1');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(5, '    TN2');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(6, '  N1');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(7, '    N2');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(8, '      TN0');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(9, '      TN1');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(10, '      TN2');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(11, '    N2');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(12, '      TN1');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(13, '      TN1');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(14, '      TN2');

        consoleLogSpy.mockRestore();
    });

    it('should generate only one TerminalNode, as the function is constant, even though it has multiple domains.', () => {
        const tableOfTruth = new TruthTable([1, 1, 1, 1, 1, 1, 1], [0,0,0,0,0,0,0]);
        const mddFromVector = tableOfTruth.fromVector();

        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

        mddFromVector.printMDDStructure();

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'TN0');

        consoleLogSpy.mockRestore();
    });
});