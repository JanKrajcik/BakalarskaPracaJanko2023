import { TerminalNode, InternalNode} from "./diagram.js";

/**
 * Class representing the Graph structure used for visualization.
 * It stores vertices, edges, and provides methods to generate DOT representations.
 */
class Graph {
    constructor() {
        this.vertices = new Map(); // Map to store vertices by node reference
        this.edges = new Map();    // Map to store edges with {from, to, decision}
        this.vertexId = 0;         // Unique identifier for each vertex

        this.font = "Times-Roman"; // Default font for the whole graph

        // Default edge styles for decisions (0: dashed, 1: solid, 2: dotted)
        this.edgeStyles = ["dashed", "solid", "dotted"];

        // Default edge colors for decisions (0: red, 1: black, 2: blue)
        this.edgeColors = ["red", "black", "blue"];

        // Flag for styling edges based on the decision they represent
        this.edgeStyling = true;

        // Flag for coloring edges based on the decision they represent
        this.edgeColoring = true;

        // Flag for displaying labels on edges
        this.labelsEnabled = true;

        // Flag for matching edge color with label color
        this.labelColorMatchesEdge = false;
    }

    /**
     * Sets the font for the graph.
     * @param {string} font - The font to set (e.g., "Arial", "Courier New").
     */
    setFont(font) {
        this.font = font;
    }

    /**
     * Sets the edge styling based on the decision they represent
     * @param {boolean} enabled - True to enable edge styling, false to disable.
     */
    setEdgeStyling(enabled) {
        this.edgeStyling = enabled;
    }

    /**
     * Sets the edge coloring based on the decision they represent
     * @param {boolean} enabled - True to enable edge coloring, false to disable.
     */
    setEdgeColoring(enabled) {
        this.edgeColoring = enabled;
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
                this.vertices.set(node, {id: vertexId, value: node.getResultValue()});
            } else {
                this.vertices.set(node, {id: vertexId, index: node.getIndex()});
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
            this.edges.set(edgeKey, {from, to, decision});
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
        let dotString = 'digraph DD {\n';

        dotString += this.getCoreGraphStyling();

        // Add vertices (terminal and internal nodes)
        dotString += this.getVertexDefinitions();

        // Add edges
        dotString += this.getEdgeDefinitions();

        dotString += '}';
        return dotString;
    }

    /**
     *  Generates Graph header information.
     * @returns {string}
     */
    getCoreGraphStyling() {
        return `    graph [fontname = "${this.font}", splines = true, overlap = false];\n` +
            `    node [fontname = "${this.font}", fontsize = 18, fixedsize = true];\n` +
            `    edge [fontname = "${this.font}", fontsize = 14];\n`;
    }

    /**
     * Generates vertex definitions with all modifications done.
     * @returns {string}
     */
    getVertexDefinitions() {
        let vertexDefinitions = '';

        let terminalNodeIDs = [];
        for (const [node, vertex] of this.vertices.entries()) {
            if (node instanceof TerminalNode) {
                terminalNodeIDs.push(vertex.id);
            }
        }

        if (terminalNodeIDs.length > 0) {
            vertexDefinitions += `    node [shape = square] ${terminalNodeIDs.join(' ')};\n`;
        }

        vertexDefinitions += '    node [shape = circle];\n';

        // Add vertex labels
        for (const [node, vertex] of this.vertices.entries()) {
            if (node instanceof TerminalNode) {
                vertexDefinitions += `    ${vertex.id} [label = "${vertex.value}"];\n`;
            } else {
                vertexDefinitions += `    ${vertex.id} [label = <x<sub><font point-size="10">${vertex.index}</font></sub>>];\n`;
            }
        }

        return vertexDefinitions;
    }

    /**
     * Generates edge definitions with all modifications done.
     * @returns {string}
     */
    getEdgeDefinitions() {
        let edgeDefinitions = '';

        // Add edges
        for (const { from, to, decision } of this.edges.values()) {
            let edgeAttributes = [];

            // Apply styling if enabled
            if (this.edgeStyling) {
                let edgeStyle = this.edgeStyles[decision] || "solid";
                edgeAttributes.push(`style="${edgeStyle}"`);
            }

            // Apply coloring if enabled
            if (this.edgeColoring) {
                let edgeColor = this.edgeColors[decision] || "black";
                edgeAttributes.push(`color="${edgeColor}"`);
            }

            // Add label if labels are enabled
            if (this.labelsEnabled) {
                let label = `label="${decision}"`;
                if (this.labelColorMatchesEdge && this.edgeColoring) {
                    let fontColor = `fontcolor="${this.edgeColors[decision] || "black"}"`;
                    edgeAttributes.push(`${label}, ${fontColor}`);
                } else {
                    edgeAttributes.push(label);
                }
            }

            // Join everything with a space and a comma
            const attributesString = edgeAttributes.join(', ');
            edgeDefinitions += `    ${from} -> ${to} [${attributesString}];\n`;
        }


        return edgeDefinitions;
    }
}


if (typeof window !== 'undefined') {
    window.Graph = Graph;
}
