const {TruthTable} = require("./table");
const {TerminalNode, InternalNode, MDD} = require("./diagram");

class Graph {
    constructor() {
        this.vertices = new Map();
        this.edges = new Map();
        this.vertexId = 0;

        // Default edge styles for decisions (0: dashed, 1: solid, 2: dotted)
        this.edgeStyles = ["dashed", "solid", "dotted"];

        // Default edge colors for decisions (0: red, 1: black, 2: blue)
        this.edgeColors = ["red", "black", "blue"];

        // Flag for displaying labels on edges
        this.labelsEnabled = true;

        // Flag for matching edge color with label color
        this.labelColorMatchesEdge = false;
    }

    setEdgeStyle(index, style) {
        this.edgeStyles[index] = style;
    }

    setEdgeColor(index, color) {
        this.edgeColors[index] = color;
    }

    setLabelsEnabled(enabled) {
        this.labelsEnabled = enabled;
    }

    setLabelColorMatchesEdge(enabled) {
        this.labelColorMatchesEdge = enabled;
    }

    addVertex(node) {
        if (!this.vertices.has(node)) {
            const vertexId = this.vertexId++;
            if (node instanceof TerminalNode) {
                this.vertices.set(node, { id: vertexId, value: node.resultValue });
            } else {
                this.vertices.set(node, { id: vertexId, index: node.index });
            }
        }
        return this.vertices.get(node).id;
    }

    addEdge(from, to, decision) {
        const edgeKey = `${from}-${to}-${decision}`;
        if (!this.edges.has(edgeKey)) {
            this.edges.set(edgeKey, { from, to, decision });
        }
    }

    traverseMDD(node) {
        let vertexId = this.addVertex(node);

        if (node instanceof TerminalNode) {
            return vertexId;
        }

        let successors = node.successors;
        for (let decision = 0; decision < successors.length; decision++) {
            const successorVertexId = this.traverseMDD(successors[decision]);
            this.addEdge(vertexId, successorVertexId, decision);
        }

        return vertexId;
    }

    toDOTString() {
        let dotString = 'digraph DD {\n';

        // Set graph styles
        dotString += '    graph [fontname = "Times-Roman",\n' +
            '                    splines = true,\n' +
            '                    overlap = false];\n' +
            '    node [fontname = "Times-Roman",\n' +
            '                    fontsize = 18,\n' +
            '                    fixedsize = true];\n' +
            '    edge [fontname = "Times-Roman",\n' +
            '                    fontsize = 14];\n';

        let terminalNodeIDs = [];
        for (const [node, vertex] of this.vertices.entries()) {
            if (node instanceof TerminalNode) {
                terminalNodeIDs.push(vertex.id);
            }
        }

        if (terminalNodeIDs.length > 0) {
            dotString += `    node [shape = square] ${terminalNodeIDs.join(' ')};\n`;
        }

        dotString += '    node [shape = circle];\n';

        // Add vertices
        for (const [node, vertex] of this.vertices.entries()) {
            if (node instanceof TerminalNode) {
                dotString += `    ${vertex.id} [label = "${vertex.value}"];\n`;
            } else {
                dotString += `${vertex.id} [label = <x<sub><font point-size="10">${vertex.index}</font></sub>>];\n`;
            }
        }

        // Add edges
        for (const { from, to, decision } of this.edges.values()) {
            let edgeStyle = this.edgeStyles[decision] || "solid";
            let edgeColor = this.edgeColors[decision] || "black";

            dotString += `    ${from} -> ${to} [style="${edgeStyle}", color="${edgeColor}"`;

            // Add label if labels are enabled
            if (this.labelsEnabled) {
                let labelColor = this.labelColorMatchesEdge ? `, fontcolor="${edgeColor}"` : '';
                dotString += `, label="${decision}"${labelColor}`;
            }

            dotString += '];\n';
        }

        dotString += '}';
        return dotString;
    }
}