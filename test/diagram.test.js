const { Vertex, MDD } = require('../app/diagram'); // Imports the Vertex and MDD class from diagram.js class.

//To run tests, write "npx jest" in the terminal.


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
    it('should print the MDD structure correctly', () => {
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
        mdd.evaluate();
        expect(consoleSpy).toHaveBeenCalledTimes(5);
        expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Vertex 1');
        expect(consoleSpy).toHaveBeenNthCalledWith(2, '   Vertex 2');
        expect(consoleSpy).toHaveBeenNthCalledWith(3, '      Vertex 5');
        expect(consoleSpy).toHaveBeenNthCalledWith(4, '   Vertex 3');
        expect(consoleSpy).toHaveBeenNthCalledWith(5, '   Vertex 4');

        //expect(consoleSpy).toHaveBeenNthCalledWith(6, 'Vertex 1');
        consoleSpy.mockRestore();
    });
});
