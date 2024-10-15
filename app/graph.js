const { TruthTable } = require("./table");
const { TerminalNode, InternalNode, MDD } = require("./diagram");

class Graph {
    constructor() {
        this.vertices = new Map(); // Map to store vertices by node reference
        this.edges = new Map();    // Map to store edges with {from, to, decision}
        this.vertexId = 0;         // Unique identifier for each vertex

        // Default edge styles for decisions (0: dashed, 1: solid, 2: dotted)
        this.edgeStyles = ["dashed", "solid", "dotted"];

        // Default edge colors for decisions (0: red, 1: black, 2: blue)
        this.edgeColors = ["red", "black", "blue"];

        // Flag for displaying labels on edges
        this.labelsEnabled = true;

        // Flag for matching edge color with label color
        this.labelColorMatchesEdge = false;
    }

    /**
     * Sets the style of the edge at the specified index.
     * @param {number} index - The index of the edge style.
     * @param {string} style - The style to set (e.g., "solid", "dashed").
     */
    setEdgeStyle(index, style) {
        this.edgeStyles[index] = style;
    }

    /**
     * Sets the color of the edge at the specified index.
     * @param {number} index - The index of the edge color.
     * @param {string} color - The color to set (e.g., "red", "blue").
     */
    setEdgeColor(index, color) {
        this.edgeColors[index] = color;
    }

    /**
     * Enables or disables labels on edges.
     * @param {boolean} enabled - True to enable edge labels, false to disable.
     */
    setLabelsEnabled(enabled) {
        this.labelsEnabled = enabled;
    }

    /**
     * Enables or disables matching edge label color with the edge color.
     * @param {boolean} enabled - True to match label color with edge color, false otherwise.
     */
    setLabelColorMatchesEdge(enabled) {
        this.labelColorMatchesEdge = enabled;
    }

    /**
     * Adds a vertex for a given node. If the node already exists, it reuses the existing vertex.
     * @param {TerminalNode|InternalNode} node - The node for which to add a vertex.
     * @returns {number} - The unique ID of the added or existing vertex.
     */
    addVertex(node) {
        if (!this.vertices.has(node)) {
            const vertexId = this.vertexId++;
            if (node instanceof TerminalNode) {
                this.vertices.set(node, { id: vertexId, value: node.getResultValue()});
            } else {
                this.vertices.set(node, { id: vertexId, index: node.index });
            }
        }
        return this.vertices.get(node).id;
    }

    /**
     * Adds an edge between two vertices based on the decision index.
     * Prevents duplicate edges from being added.
     * @param {number} from - The starting vertex ID.
     * @param {number} to - The ending vertex ID.
     * @param {number} decision - The decision index associated with the edge.
     */
    addEdge(from, to, decision) {
        const edgeKey = `${from}-${to}-${decision}`; // Create a unique key for the edge
        if (!this.edges.has(edgeKey)) {
            this.edges.set(edgeKey, { from, to, decision });
        }
    }

    /**
     * Recursively traverses the Multi-valued Decision Diagram (MDD) and adds vertices and edges to the graph.
     * @param {TerminalNode|InternalNode} node - The current node being traversed.
     * @returns {number} - The unique ID of the vertex added for the current node.
     */
    traverseMDD(node) {
        let vertexId = this.addVertex(node); // Add vertex for the current node

        if (node instanceof TerminalNode) {
            return vertexId; // No successors to process for terminal nodes
        }

        let successors = node.getSuccessors(); // Get the successors of the internal node
        for (let decision = 0; decision < successors.length; decision++) {
            const successorVertexId = this.traverseMDD(successors[decision]); // Recur for each successor
            this.addEdge(vertexId, successorVertexId, decision); // Add edge with decision index
        }

        return vertexId;
    }

    /**
     * Generates the DOT representation of the graph, which can be used for visualization.
     * @returns {string} - The DOT string representing the graph.
     */
    toDOTString() {
        let dotString = 'digraph DD {\n'; // Start of the DOT string

        // Set graph styling
        dotString += '    graph [fontname = "Times-Roman",\n' +
            '                    splines = true,\n' +
            '                    overlap = false];\n' +
            '    node [fontname = "Times-Roman",\n' +
            '                    fontsize = 18,\n' +
            '                    fixedsize = true];\n' +
            '    edge [fontname = "Times-Roman",\n' +
            '                    fontsize = 14];\n';

        let terminalNodeIDs = []; // Array to collect terminal node IDs
        for (const [node, vertex] of this.vertices.entries()) {
            if (node instanceof TerminalNode) {
                terminalNodeIDs.push(vertex.id); // Collect IDs of terminal nodes
            }
        }

        if (terminalNodeIDs.length > 0) {
            dotString += `    node [shape = square] ${terminalNodeIDs.join(' ')};\n`; // Set terminal nodes to square shape
        }

        dotString += '    node [shape = circle];\n'; // Set internal nodes to circular shape

        // Add vertices
        for (const [node, vertex] of this.vertices.entries()) {
            if (node instanceof TerminalNode) {
                dotString += `    ${vertex.id} [label = "${vertex.value}"];\n`; // Add terminal node with its value
            } else {
                dotString += `${vertex.id} [label = <x<sub><font point-size="10">${vertex.index}</font></sub>>];\n`; // Add internal node with index as subscript
            }
        }

        // Add edges
        for (const { from, to, decision } of this.edges.values()) {
            let edgeStyle = this.edgeStyles[decision] || "solid"; // Get the edge style
            let edgeColor = this.edgeColors[decision] || "black"; // Get the edge color

            dotString += `    ${from} -> ${to} [style="${edgeStyle}", color="${edgeColor}"`; // Add edge

            // Add label if labels are enabled
            if (this.labelsEnabled) {
                let labelColor = this.labelColorMatchesEdge ? `, fontcolor="${edgeColor}"` : ''; // Determine label color based on settings
                dotString += `, label="${decision}"${labelColor}`; // Add label to edge definition
            }

            dotString += '];\n'; // End edge definition
        }

        dotString += '}'; // End the DOT string
        return dotString; // Return the generated DOT string
    }
}