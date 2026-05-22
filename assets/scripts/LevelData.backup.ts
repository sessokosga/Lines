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
    // --- SIZE 4x4 (Levels 1-3) ---
    // Snake 4x4: (0,0-3), (1,3-0), (2,0-3), (3,3-0)
    {
        id: 1, gridSize: 4,
        nodes: [
            { number: 1, row: 0, col: 0 }, // snake[0]
            { number: 2, row: 2, col: 0 }, // snake[8]
            { number: 3, row: 3, col: 0 }  // snake[15]
        ]
    },
    {
        id: 2, gridSize: 4,
        nodes: [
            { number: 1, row: 0, col: 0 }, // snake[0]
            { number: 2, row: 1, col: 2 }, // snake[5]
            { number: 3, row: 2, col: 2 }, // snake[10]
            { number: 4, row: 3, col: 0 }  // snake[15]
        ]
    },
    {
        id: 3, gridSize: 4,
        nodes: [
            { number: 1, row: 0, col: 0 }, // snake[0]
            { number: 2, row: 1, col: 3 }, // snake[4]
            { number: 3, row: 2, col: 0 }, // snake[8]
            { number: 4, row: 3, col: 3 }, // snake[12]
            { number: 5, row: 3, col: 0 }  // snake[15]
        ]
    },

    // --- SIZE 5x5 (Levels 4-6) ---
    // Snake 5x5: (0,0-4), (1,4-0), (2,0-4), (3,4-0), (4,0-4)
    {
        id: 4, gridSize: 5,
        nodes: [
            { number: 1, row: 0, col: 0 }, // snake[0]
            { number: 2, row: 1, col: 4 }, // snake[5]
            { number: 3, row: 2, col: 0 }, // snake[10]
            { number: 4, row: 3, col: 4 }, // snake[15]
            { number: 5, row: 4, col: 0 }, // snake[20]
            { number: 6, row: 4, col: 4 }  // snake[24]
        ]
    },
    {
        id: 5, gridSize: 5,
        nodes: [
            { number: 1, row: 0, col: 0 }, // snake[0]
            { number: 2, row: 0, col: 4 }, // snake[4]
            { number: 3, row: 1, col: 1 }, // snake[8]
            { number: 4, row: 2, col: 4 }, // snake[14]
            { number: 5, row: 3, col: 1 }, // snake[18]
            { number: 6, row: 4, col: 0 }, // snake[20]
            { number: 7, row: 4, col: 4 }  // snake[24]
        ]
    },
    {
        id: 6, gridSize: 5,
        nodes: [
            { number: 1, row: 0, col: 0 }, // snake[0]
            { number: 2, row: 0, col: 3 }, // snake[3]
            { number: 3, row: 1, col: 2 }, // snake[7]
            { number: 4, row: 2, col: 0 }, // snake[10]
            { number: 5, row: 2, col: 4 }, // snake[14]
            { number: 6, row: 3, col: 2 }, // snake[17]
            { number: 7, row: 4, col: 1 }, // snake[21]
            { number: 8, row: 4, col: 4 }  // snake[24]
        ]
    },

    // --- SIZE 6x6 (Levels 7-9) ---
    // Snake 6x6: (0,0-5), (1,5-0), (2,0-5), (3,5-0), (4,0-5), (5,5-0)
    {
        id: 7, gridSize: 6,
        nodes: [
            { number: 1, row: 0, col: 0 }, // snake[0]
            { number: 2, row: 0, col: 4 }, // snake[4]
            { number: 3, row: 1, col: 2 }, // snake[9]
            { number: 4, row: 2, col: 2 }, // snake[14]
            { number: 5, row: 3, col: 4 }, // snake[19]
            { number: 6, row: 4, col: 0 }, // snake[24]
            { number: 7, row: 4, col: 5 }, // snake[29]
            { number: 8, row: 5, col: 3 }, // snake[32]
            { number: 9, row: 5, col: 0 }  // snake[35]
        ]
    },
    {
        id: 8, gridSize: 6,
        nodes: [
            { number: 1, row: 0, col: 0 },  // snake[0]
            { number: 2, row: 0, col: 3 },  // snake[3]
            { number: 3, row: 1, col: 4 },  // snake[7]
            { number: 4, row: 1, col: 0 },  // snake[11]
            { number: 5, row: 2, col: 3 },  // snake[15]
            { number: 6, row: 3, col: 4 },  // snake[19]
            { number: 7, row: 3, col: 0 },  // snake[23]
            { number: 8, row: 4, col: 3 },  // snake[27]
            { number: 9, row: 5, col: 4 },  // snake[31]
            { number: 10, row: 5, col: 0 }  // snake[35]
        ]
    },
    {
        id: 9, gridSize: 6,
        nodes: [
            { number: 1, row: 0, col: 0 },  // snake[0]
            { number: 2, row: 0, col: 3 },  // snake[3]
            { number: 3, row: 1, col: 5 },  // snake[6]
            { number: 4, row: 1, col: 2 },  // snake[9]
            { number: 5, row: 2, col: 1 },  // snake[13]
            { number: 6, row: 2, col: 5 },  // snake[17]
            { number: 7, row: 3, col: 3 },  // snake[21]
            { number: 8, row: 4, col: 1 },  // snake[25]
            { number: 9, row: 4, col: 5 },  // snake[29]
            { number: 10, row: 5, col: 3 }, // snake[32]
            { number: 11, row: 5, col: 0 }  // snake[35]
        ]
    },

    // --- SIZE 7x7 (Levels 10-12) ---
    // Snake 7x7: (0,0-6), (1,6-0), (2,0-6), (3,6-0), (4,0-6), (5,6-0), (6,0-6)
    {
        id: 10, gridSize: 7,
        nodes: [
            { number: 1, row: 0, col: 0 },  // snake[0]
            { number: 2, row: 0, col: 5 },  // snake[5]
            { number: 3, row: 1, col: 3 },  // snake[10]
            { number: 4, row: 2, col: 2 },  // snake[16]
            { number: 5, row: 3, col: 5 },  // snake[22]
            { number: 6, row: 4, col: 0 },  // snake[28]
            { number: 7, row: 4, col: 6 },  // snake[34]
            { number: 8, row: 5, col: 2 },  // snake[39]
            { number: 9, row: 6, col: 2 },  // snake[44]
            { number: 10, row: 6, col: 6 }  // snake[48]
        ]
    },
    {
        id: 11, gridSize: 7,
        nodes: [
            { number: 1, row: 0, col: 0 },  // snake[0]
            { number: 2, row: 0, col: 4 },  // snake[4]
            { number: 3, row: 1, col: 4 },  // snake[9]
            { number: 4, row: 2, col: 0 },  // snake[14]
            { number: 5, row: 2, col: 5 },  // snake[19]
            { number: 6, row: 3, col: 3 },  // snake[24]
            { number: 7, row: 4, col: 1 },  // snake[29]
            { number: 8, row: 4, col: 6 },  // snake[34]
            { number: 9, row: 5, col: 2 },  // snake[39]
            { number: 10, row: 6, col: 2 }, // snake[44]
            { number: 11, row: 6, col: 6 }  // snake[48]
        ]
    },
    {
        id: 12, gridSize: 7,
        nodes: [
            { number: 1, row: 0, col: 0 },  // snake[0]
            { number: 2, row: 0, col: 4 },  // snake[4]
            { number: 3, row: 1, col: 5 },  // snake[8]
            { number: 4, row: 1, col: 1 },  // snake[12]
            { number: 5, row: 2, col: 2 },  // snake[16]
            { number: 6, row: 2, col: 6 },  // snake[20]
            { number: 7, row: 3, col: 3 },  // snake[24]
            { number: 8, row: 4, col: 0 },  // snake[28]
            { number: 9, row: 4, col: 5 },  // snake[33]
            { number: 10, row: 5, col: 3 }, // snake[38]
            { number: 11, row: 6, col: 1 }, // snake[43]
            { number: 12, row: 6, col: 6 }  // snake[48]
        ]
    }
];
