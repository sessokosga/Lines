export interface NodeData {
    number: number;
    row: number;
    col: number;
}

export interface LevelData {
    id: number;
    gridSize: number;
    nodes: NodeData[];
}

export const LEVELS: LevelData[] = [
    {
        id: 1,
        gridSize: 4,
        nodes: [
            { number: 1, row: 0, col: 0 },
            { number: 2, row: 3, col: 0 },
            { number: 3, row: 3, col: 3 },
            { number: 4, row: 0, col: 3 }
        ]
    },
    {
        id: 2,
        gridSize: 5,
        nodes: [
            { number: 1, row: 0, col: 0 },
            { number: 2, row: 2, col: 2 },
            { number: 3, row: 4, col: 4 }
        ]
    },
    {
        id: 3,
        gridSize: 6,
        nodes: [
            { number: 1, row: 0, col: 0 },
            { number: 2, row: 5, col: 0 },
            { number: 3, row: 5, col: 5 },
            { number: 4, row: 0, col: 5 }
        ]
    },
    {
        id: 4,
        gridSize: 7,
        nodes: [
            { "number": 1, "row": 3, "col": 3 },
            { "number": 2, "row": 1, "col": 1 },
            { "number": 3, "row": 5, "col": 5 },
            { "number": 4, "row": 6, "col": 0 },
            { "number": 5, "row": 6, "col": 6 },
            { "number": 6, "row": 0, "col": 6 },
            { "number": 7, "row": 0, "col": 0 },
            { "number": 8, "row": 4, "col": 4 },
            { "number": 9, "row": 2, "col": 2 }
        ]
    }
];
