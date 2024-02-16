const { Vertex, ResultVertex, MDD } = require('../app/diagram'); // Imports the Vertex, ResultVertex and MDD class from diagram.js class.

/**
 *  README README README README README README README README README README README README README README
 *  !!!!!!!!!!!!!!!!!!!!!!!! To run tests, write "npx jest" in the terminal. !!!!!!!!!!!!!!!!!!!!!!!!
 *  For these tests to work:
 *  1. Install node.js from web.
 *  2. Execute "npm install --save-dev jest" in terminal here to install jest.
 *  3. Launch tests using "npx jest" in terminal.
 *  README README README README README README README README README README README README README README
 */


// Vertex here is the name of the test suite. (group of related test cases for a specific part of the code)
describe('Vertex', () => {
    it('should have the correct index', () => {
        const vertex = new Vertex(42); // Create a Vertex with index 42
        expect(vertex.index).toBe(42); // Check if the index is 42
    });

    it('should return 0 for a new vertex without successors', () => {
        const vertex = new Vertex(1);
        expect(vertex.getSuccessorsCount()).toBe(0);
    });

    it('should return the number of successors added', () => {
        const vertex1 = new Vertex(1);
        const vertex2 = new Vertex(2);
        const vertex3 = new Vertex(3);

        vertex1.addSuccessor(vertex2);
        vertex1.addSuccessor(vertex3);

        expect(vertex1.getSuccessorsCount()).toBe(2);
    });

    it('should return a successor based on its index', () => {
        const vertex1 = new Vertex(1);
        const vertex2 = new Vertex(2);
        const vertex3 = new Vertex(3);

        vertex1.addSuccessor(vertex2);
        vertex1.addSuccessor(vertex3);

        const successor = vertex1.getSuccessor(1);
        expect(successor).toBe(vertex3);
    });

    it('should return null for an invalid successor index', () => {
        const vertex1 = new Vertex(1);

        const successor = vertex1.getSuccessor(1);
        expect(successor).toBeNull();
    });
});

describe('MDD', () => {
    it('should print the MDD structure consisting of only Vertexes correctly', () => {
        const vertex1 = new Vertex(1);
        const vertex2 = new Vertex(2);
        const vertex3 = new Vertex(3);
        const vertex4 = new Vertex(4);
        const vertex5 = new Vertex(5);

        vertex1.addSuccessor(vertex2);
        vertex1.addSuccessor(vertex3);
        vertex1.addSuccessor(vertex4);
        vertex2.addSuccessor(vertex5);

        const mdd = new MDD(vertex1);

        const consoleSpy = jest.spyOn(console, 'log');
        mdd.printMDDStructure(vertex1); // Call printMDDStructure with the root vertex

        // Expectations for Vertexes only
        expect(consoleSpy).toHaveBeenCalledTimes(5);
        expect(consoleSpy).toHaveBeenNthCalledWith(1, 'V1');
        expect(consoleSpy).toHaveBeenNthCalledWith(2, '  V2');
        expect(consoleSpy).toHaveBeenNthCalledWith(3, '    V5');
        expect(consoleSpy).toHaveBeenNthCalledWith(4, '  V3');
        expect(consoleSpy).toHaveBeenNthCalledWith(5, '  V4');

        consoleSpy.mockRestore();
    });

    it('should print the MDD structure consisting of both Vertexes and ResultVertexes correctly', () => {
        const vertex1 = new Vertex(1);
        const vertex2 = new Vertex(2);
        const vertex3 = new Vertex(3);
        const vertex4 = new Vertex(4);
        const vertex5 = new Vertex(5);
        const vertex6 = new Vertex(6);
        const vertex7 = new Vertex(7);
        const vertex8 = new Vertex(8);
        const vertex9 = new Vertex(9);
        const vertex10 = new Vertex(10);
        const vertex11 = new Vertex(11);

        const resultVertex1 = new ResultVertex(1);
        const resultVertex2 = new ResultVertex(2);
        const resultVertex3 = new ResultVertex(3);
        const resultVertex4 = new ResultVertex(4);

        vertex1.addSuccessor(vertex2);
        vertex1.addSuccessor(vertex3);
        vertex2.addSuccessor(vertex4);
        vertex2.addSuccessor(vertex5);
        vertex4.addSuccessor(vertex6);
        vertex4.addSuccessor(vertex7);
        vertex5.addSuccessor(vertex8);
        vertex5.addSuccessor(vertex9);
        vertex8.addSuccessor(vertex10);
        vertex9.addSuccessor(vertex11);

        vertex6.addSuccessor(resultVertex1);
        vertex7.addSuccessor(resultVertex2);
        vertex10.addSuccessor(resultVertex3);
        vertex11.addSuccessor(resultVertex4);

        const mdd = new MDD(vertex1);

        const consoleSpy = jest.spyOn(console, 'log');
        mdd.printMDDStructure(vertex1); // Call printMDDStructure with the root vertex

        // Expectations for both Vertexes and ResultVertexes
        expect(consoleSpy).toHaveBeenCalledTimes(15); // Total vertices including ResultVertexes
        expect(consoleSpy).toHaveBeenNthCalledWith(1, 'V1');
        expect(consoleSpy).toHaveBeenNthCalledWith(2, '  V2');
        expect(consoleSpy).toHaveBeenNthCalledWith(3, '    V4');
        expect(consoleSpy).toHaveBeenNthCalledWith(4, '      V6');
        expect(consoleSpy).toHaveBeenNthCalledWith(5, '        RV1');
        expect(consoleSpy).toHaveBeenNthCalledWith(6, '      V7');
        expect(consoleSpy).toHaveBeenNthCalledWith(7, '        RV2');
        expect(consoleSpy).toHaveBeenNthCalledWith(8, '    V5');
        expect(consoleSpy).toHaveBeenNthCalledWith(9, '      V8');
        expect(consoleSpy).toHaveBeenNthCalledWith(10, '        V10');
        expect(consoleSpy).toHaveBeenNthCalledWith(11, '          RV3');
        expect(consoleSpy).toHaveBeenNthCalledWith(12, '      V9');

        consoleSpy.mockRestore();
    });


    it('should evaluate steps correctly and return a ResultVertex for evaluate', () => {
        // Create vertices for the diagram
        const vertex1 = new Vertex(1);
        const vertex2 = new Vertex(2);
        const vertex3 = new Vertex(3);
        const vertex4 = new Vertex(4);
        const vertex5 = new Vertex(5);
        const vertex6 = new Vertex(6);
        const vertex7 = new Vertex(7);
        const vertex8 = new Vertex(8);
        const vertex9 = new Vertex(9);
        const vertex10 = new Vertex(10);
        const vertex11 = new Vertex(11);

        const resultVertex1 = new ResultVertex(1);
        const resultVertex2 = new ResultVertex(2);
        const resultVertex3 = new ResultVertex(3);
        const resultVertex4 = new ResultVertex(4);

        // Define the structure of the diagram
        vertex1.addSuccessor(vertex2);
        vertex1.addSuccessor(vertex3);
        vertex2.addSuccessor(vertex4);
        vertex2.addSuccessor(vertex5);
        vertex4.addSuccessor(vertex6);
        vertex4.addSuccessor(vertex7);
        vertex5.addSuccessor(vertex8);
        vertex5.addSuccessor(vertex9);
        vertex8.addSuccessor(vertex10);
        vertex9.addSuccessor(vertex11);

        vertex6.addSuccessor(resultVertex1);
        vertex7.addSuccessor(resultVertex2);
        vertex10.addSuccessor(resultVertex3);
        vertex11.addSuccessor(resultVertex4);

        // Create the MDD with the root vertex
        const mdd = new MDD(vertex1);

        // Call evaluate with valid steps
        const result = mdd.evaluate([0, 1, 0, 0, 0]);

        // Check if the result is a ResultVertex
        expect(result instanceof ResultVertex).toBe(true);
        // Check if the value of the ResultVertex is correct
        expect(result.resultValue).toBe(3);
    });

    it('should evaluate steps correctly, print path and return a ResultVertex for evaluateAndPrintPath', () => {
        // Create vertices for the diagram
        const vertex1 = new Vertex(1);
        const vertex2 = new Vertex(2);
        const vertex3 = new Vertex(3);
        const vertex4 = new Vertex(4);
        const vertex5 = new Vertex(5);
        const vertex6 = new Vertex(6);
        const vertex7 = new Vertex(7);
        const vertex8 = new Vertex(8);
        const vertex9 = new Vertex(9);
        const vertex10 = new Vertex(10);
        const vertex11 = new Vertex(11);

        const resultVertex1 = new ResultVertex(1);
        const resultVertex2 = new ResultVertex(2);
        const resultVertex3 = new ResultVertex(3);
        const resultVertex4 = new ResultVertex(4);

        // Define the structure of the diagram
        vertex1.addSuccessor(vertex2);
        vertex1.addSuccessor(vertex3);
        vertex2.addSuccessor(vertex4);
        vertex2.addSuccessor(vertex5);
        vertex4.addSuccessor(vertex6);
        vertex4.addSuccessor(vertex7);
        vertex5.addSuccessor(vertex8);
        vertex5.addSuccessor(vertex9);
        vertex8.addSuccessor(vertex10);
        vertex9.addSuccessor(vertex11);

        vertex6.addSuccessor(resultVertex1);
        vertex7.addSuccessor(resultVertex2);
        vertex10.addSuccessor(resultVertex3);
        vertex11.addSuccessor(resultVertex4);

        // Create the MDD with the root vertex
        const mdd = new MDD(vertex1);

        // Spy on console.log to capture the printed path
        const consoleSpy = jest.spyOn(console, 'log');

        // Call evaluateAndPrintPath with valid steps
        const result = mdd.evaluateAndPrintPath([0, 1, 0, 0, 0]);

        // Check if the result is a ResultVertex
        expect(result instanceof ResultVertex).toBe(true);
        // Check if the value of the ResultVertex is correct
        expect(result.resultValue).toBe(3);

        // Check if console.log was called with the correct path
        expect(consoleSpy).toHaveBeenCalledWith('---Path through the diagram---');
        expect(consoleSpy).toHaveBeenCalledWith('V1 -> V2 -> V5 -> V8 -> V10 -> RV3');

        // Restore the original console.log function
        consoleSpy.mockRestore();
    });


    it('should print an error message when an invalid step is provided in evaluate', () => {
        const vertex1 = new Vertex(1);
        const vertex2 = new Vertex(2);
        vertex1.addSuccessor(vertex2);
        const mdd = new MDD(vertex1);

        // Spy on console.error to capture the error message
        const consoleErrorSpy = jest.spyOn(console, 'error');

        // Call evaluate with an invalid step
        mdd.evaluate([1]);

        // Check if console.error was called with the expected error message
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid step 1 at vertex 1');

        // Restore the original console.error function
        consoleErrorSpy.mockRestore();
    });

    it('should print an error message when an invalid step is provided in evaluateAndPrintPath', () => {
        const vertex1 = new Vertex(1);
        const vertex2 = new Vertex(2);
        vertex1.addSuccessor(vertex2);
        const mdd = new MDD(vertex1);

        // Spy on console.error to capture the error message
        const consoleErrorSpy = jest.spyOn(console, 'error');

        // Call evaluateAndPrintPath with an invalid step
        mdd.evaluateAndPrintPath([1]);

        // Check if console.error was called with the expected error message
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid step 1 at vertex 1');

        // Restore the original console.error function
        consoleErrorSpy.mockRestore();
    });
});
