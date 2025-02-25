const {InternalNode, TerminalNode, MDD} = require('../app/diagram'); // Imports the InternalNode, TerminalNode and MDD class from diagram.js.
import seedrandom from "seedrandom";

/**
 *  README README README README README README README README README README README README README README
 *  For these tests to work:
 *  1. Install node.js from web.
 *  2. Execute "npm install --save-dev jest" in terminal here to install jest.
 *  3. Launch tests using "npx jest" in terminal. npx jest --verbose prints detailed info about tests.
 *  README README README README README README README README README README README README README README
 */

describe('InternalNode', () => {
    it('should have the correct index - static test', () => {
        const internalNode = new InternalNode(42);
        expect(internalNode.getIndex()).toBe(42);
    });

    it("should have the correct index - dynamic test", () => {
        // Generate new seed each test run, but log it for reproducibility
        const seed = Date.now().toString();
        console.log(`Test seed: ${seed}`);
        const rng = seedrandom(seed);

        for (let i = 0; i < 100; i++) {
            const randomIndex = Math.floor(rng() * 1000);
            const internalNode = new InternalNode(randomIndex);
            expect(internalNode.getIndex()).toBe(randomIndex);
        }
    });

    it('should return 0 for a new InternalNode without successors', () => {
        const internalNode = new InternalNode(1);
        expect(internalNode.getSuccessorsCount()).toBe(0);
    });

    it('should return the number of successors added', () => {
        const internalNode0 = new InternalNode(1);
        const internalNode1 = new InternalNode(2);
        const internalNode2 = new InternalNode(3);

        internalNode0.addSuccessor(internalNode1);
        internalNode0.addSuccessor(internalNode2);

        expect(internalNode0.getSuccessorsCount()).toBe(2);
    });

    it("should return the number of successors added - dynamic test", () => {
        // Generate new seed each test run, but log it, if the test fails, it can be reproduced.
        const seed = Date.now().toString();
        console.log(`Test seed: ${seed}`);
        const rng = seedrandom(seed);


        for (let i = 0; i < 100; i++) {
            const randomIndex0 = Math.floor(rng() * 1000);
            const randomIndex1 = Math.floor(rng() * 1000);
            const randomIndex2 = Math.floor(rng() * 1000);

            const internalNode0 = new InternalNode(randomIndex0);
            const internalNode1 = new InternalNode(randomIndex1);
            const internalNode2 = new InternalNode(randomIndex2);

            internalNode0.addSuccessor(internalNode1);
            internalNode0.addSuccessor(internalNode2);

            expect(internalNode0.getSuccessorsCount()).toBe(2);
        }
    });


    it('should return a successor based on its index', () => {
        const internalNode0 = new InternalNode(1);
        const internalNode1 = new InternalNode(2);
        const internalNode2 = new InternalNode(3);

        internalNode0.addSuccessor(internalNode1);
        internalNode0.addSuccessor(internalNode2);

        const successor = internalNode0.getSuccessor(1);
        expect(successor).toBe(internalNode2);
    });

    it("should return a successor based on its index - dynamic test", () => {
        const seed = Date.now().toString();
        console.log(`Test seed: ${seed}`);
        const rng = seedrandom(seed);

        for (let i = 0; i < 100; i++) {
            const randomIndex0 = Math.floor(rng() * 1000);
            const randomIndex1 = Math.floor(rng() * 1000);
            const randomIndex2 = Math.floor(rng() * 1000);

            const internalNode0 = new InternalNode(randomIndex0);
            const internalNode1 = new InternalNode(randomIndex1);
            const internalNode2 = new InternalNode(randomIndex2);

            internalNode0.addSuccessor(internalNode1);
            internalNode0.addSuccessor(internalNode2);

            const successor = internalNode0.getSuccessor(1);
            expect(successor).toBe(internalNode2);
        }
    });

    it('should return null for an invalid successor index', () => {
        const internalNode = new InternalNode(1);
        const successor = internalNode.getSuccessor(1);
        expect(successor).toBeNull();
    });

    it("should return null for an invalid successor index - dynamic test", () => {
        const seed = Date.now().toString();
        console.log(`Test seed: ${seed}`);
        const rng = seedrandom(seed);

        for (let i = 0; i < 100; i++) {
            const randomIndex = Math.floor(rng() * 1000);
            const internalNode = new InternalNode(randomIndex);
            const successor = internalNode.getSuccessor(1);
            expect(successor).toBeNull();
        }
    });
});

describe('MDD', () => {
    let consoleErrorSpy;

    beforeAll(() => {
        // Mock console.error
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
    });

    afterAll(() => {
        // Restore console.error
        consoleErrorSpy.mockRestore();
    });

    it('should print the MDD structure consisting of only InternalNodes correctly', () => {
        const internalNode0 = new InternalNode(1);
        const internalNode1 = new InternalNode(2);
        const internalNode2 = new InternalNode(3);
        const internalNode3 = new InternalNode(4);
        const internalNode4 = new InternalNode(5);

        internalNode0.addSuccessor(internalNode1);
        internalNode0.addSuccessor(internalNode2);
        internalNode0.addSuccessor(internalNode3);
        internalNode1.addSuccessor(internalNode4);

        const mdd = new MDD(internalNode0);

        const consoleSpy = jest.spyOn(console, 'log');
        mdd.printMDDStructure(internalNode0);

        // Expectations for InternalNodes only
        expect(consoleSpy).toHaveBeenCalledTimes(5);
        expect(consoleSpy).toHaveBeenNthCalledWith(1, 'N1');
        expect(consoleSpy).toHaveBeenNthCalledWith(2, '  N2');
        expect(consoleSpy).toHaveBeenNthCalledWith(3, '    N5');
        expect(consoleSpy).toHaveBeenNthCalledWith(4, '  N3');
        expect(consoleSpy).toHaveBeenNthCalledWith(5, '  N4');

        consoleSpy.mockRestore();
    });

    it('should print the MDD structure consisting of both InternalNodes and TerminalNodes correctly', () => {
        const internalNode0 = new InternalNode(1);
        const internalNode1 = new InternalNode(2);
        const internalNode2 = new InternalNode(3);
        const internalNode3 = new InternalNode(4);
        const internalNode4 = new InternalNode(5);
        const internalNode5 = new InternalNode(6);
        const internalNode6 = new InternalNode(7);
        const internalNode7 = new InternalNode(8);
        const internalNode8 = new InternalNode(9);
        const internalNode9 = new InternalNode(10);
        const internalNode10 = new InternalNode(11);

        const terminalNode0 = new TerminalNode(1);
        const terminalNode1 = new TerminalNode(2);
        const terminalNode2 = new TerminalNode(3);
        const terminalNode3 = new TerminalNode(4);

        internalNode0.addSuccessor(internalNode1);
        internalNode0.addSuccessor(internalNode2);
        internalNode1.addSuccessor(internalNode3);
        internalNode1.addSuccessor(internalNode4);
        internalNode3.addSuccessor(internalNode5);
        internalNode3.addSuccessor(internalNode6);
        internalNode4.addSuccessor(internalNode7);
        internalNode4.addSuccessor(internalNode8);
        internalNode7.addSuccessor(internalNode9);
        internalNode8.addSuccessor(internalNode10);

        internalNode5.addSuccessor(terminalNode0);
        internalNode6.addSuccessor(terminalNode1);
        internalNode9.addSuccessor(terminalNode2);
        internalNode10.addSuccessor(terminalNode3);

        const mdd = new MDD(internalNode0);

        const consoleSpy = jest.spyOn(console, 'log');
        mdd.printMDDStructure(internalNode0);

        expect(consoleSpy).toHaveBeenCalledTimes(15);
        expect(consoleSpy).toHaveBeenNthCalledWith(1, 'N1');
        expect(consoleSpy).toHaveBeenNthCalledWith(2, '  N2');
        expect(consoleSpy).toHaveBeenNthCalledWith(3, '    N4');
        expect(consoleSpy).toHaveBeenNthCalledWith(4, '      N6');
        expect(consoleSpy).toHaveBeenNthCalledWith(5, '        TN1');
        expect(consoleSpy).toHaveBeenNthCalledWith(6, '      N7');
        expect(consoleSpy).toHaveBeenNthCalledWith(7, '        TN2');
        expect(consoleSpy).toHaveBeenNthCalledWith(8, '    N5');
        expect(consoleSpy).toHaveBeenNthCalledWith(9, '      N8');
        expect(consoleSpy).toHaveBeenNthCalledWith(10, '        N10');
        expect(consoleSpy).toHaveBeenNthCalledWith(11, '          TN3');
        expect(consoleSpy).toHaveBeenNthCalledWith(12, '      N9');

        consoleSpy.mockRestore();
    });


    it('should evaluate decisions correctly and return a TerminalNode for evaluate', () => {

        // Create internalNodes for the diagram
        const internalNode0 = new InternalNode(0);
        const internalNode11 = new InternalNode(1);
        const internalNode12 = new InternalNode(1);
        const internalNode21 = new InternalNode(2);
        const internalNode22 = new InternalNode(2);

        const terminalNode0 = new TerminalNode(1);
        const terminalNode1 = new TerminalNode(0);
        const terminalNode2 = new TerminalNode(2);

        // Define the structure of the diagram
        internalNode0.addSuccessor(internalNode11);
        internalNode0.addSuccessor(internalNode12);
        internalNode11.addSuccessor(terminalNode1);
        internalNode11.addSuccessor(internalNode21);
        internalNode12.addSuccessor(internalNode21);
        internalNode12.addSuccessor(internalNode22);

        internalNode21.addSuccessor(terminalNode1);
        internalNode21.addSuccessor(terminalNode0);
        internalNode21.addSuccessor(terminalNode0);
        internalNode22.addSuccessor(terminalNode1);
        internalNode22.addSuccessor(terminalNode2);
        internalNode22.addSuccessor(terminalNode2);

        const mdd = new MDD(internalNode0);

        const result = mdd.evaluate([1, 0, 2]);

        expect(result instanceof TerminalNode).toBe(true);
        expect(result.getResultValue()).toBe(1);
    });

    it('should evaluate decisions correctly, print path and return a TerminalNode for evaluateAndPrintPath', () => {
        // Test data from decision diagram from Picture 2.2 from thesis.
        const internalNode0 = new InternalNode(0);
        const internalNode11 = new InternalNode(1);
        const internalNode12 = new InternalNode(1);
        const internalNode21 = new InternalNode(2);
        const internalNode22 = new InternalNode(2);

        const resultInternalNode0 = new TerminalNode(1);
        const resultInternalNode1 = new TerminalNode(0);
        const resultInternalNode2 = new TerminalNode(2);

        // Define the structure of the diagram
        internalNode0.addSuccessor(internalNode11);
        internalNode0.addSuccessor(internalNode12);
        internalNode11.addSuccessor(resultInternalNode1);
        internalNode11.addSuccessor(internalNode21);
        internalNode12.addSuccessor(internalNode21);
        internalNode12.addSuccessor(internalNode22);

        internalNode21.addSuccessor(resultInternalNode1);
        internalNode21.addSuccessor(resultInternalNode0);
        internalNode21.addSuccessor(resultInternalNode0);
        internalNode22.addSuccessor(resultInternalNode1);
        internalNode22.addSuccessor(resultInternalNode2);
        internalNode22.addSuccessor(resultInternalNode2);

        const mdd = new MDD(internalNode0);

        const consoleSpy = jest.spyOn(console, 'log');

        const result = mdd.evaluateAndPrintPath([1, 0, 2]);

        expect(result instanceof TerminalNode).toBe(true);
        expect(result.getResultValue()).toBe(1);

        expect(consoleSpy).toHaveBeenCalledWith('---Path through the diagram---');
        expect(consoleSpy).toHaveBeenCalledWith('N0 -> N1 -> N2 -> TN1');

        consoleSpy.mockRestore();
    });


    it('should print an error message when an invalid decision is provided in evaluate', () => {
        const internalNode0 = new InternalNode(0);
        const internalNode1 = new InternalNode(1);
        internalNode0.addSuccessor(internalNode1);
        const mdd = new MDD(internalNode0);

        const consoleErrorSpy = jest.spyOn(console, 'error');

        mdd.evaluate([1]);

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid decision at node index 0: Either the decision exceeds the number of node\'s successors or it is beyond the provided decisions\' scope.');

        consoleErrorSpy.mockRestore();
    });

    it('should print an error message when an invalid decision is provided in evaluateAndPrintPath', () => {
        const internalNode0 = new InternalNode(0);
        const internalNode1 = new InternalNode(1);
        internalNode0.addSuccessor(internalNode1);
        const mdd = new MDD(internalNode0);

        const consoleErrorSpy = jest.spyOn(console, 'error');

        mdd.evaluateAndPrintPath([1]);

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid decision at node index 0: Either the decision exceeds the number of node\'s successors or it is beyond the provided decisions\' scope.');

        consoleErrorSpy.mockRestore();
    });
});
