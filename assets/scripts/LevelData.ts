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
  {
    id: 1,
    gridSize: 4,
    nodes: [
      { number: 1, row: 0, col: 0 },
      { number: 2, row: 1, col: 2 },
      { number: 3, row: 3, col: 0 },
    ],
  },
  {
    id: 2,
    gridSize: 4,
    nodes: [
      { number: 1, row: 0, col: 0 },
      { number: 2, row: 3, col: 1 },
      { number: 3, row: 2, col: 2 },
      { number: 4, row: 0, col: 2 },
    ],
  },
  {
    id: 3,
    gridSize: 4,
    nodes: [
      { number: 1, row: 1, col: 1 },
      { number: 2, row: 3, col: 0 },
      { number: 3, row: 2, col: 2 },
      { number: 4, row: 1, col: 3 },
      { number: 5, row: 1, col: 2 },
    ],
  },

  // --- SIZE 5x5 (Levels 4-6) ---
  {
    id: 4,
    gridSize: 5,
    nodes: [
      { number: 1, row: 0, col: 0 },
      { number: 2, row: 0, col: 4 },
      { number: 3, row: 1, col: 0 },
      { number: 4, row: 2, col: 4 },
      { number: 5, row: 3, col: 0 },
      { number: 6, row: 4, col: 4 },
    ],
  },
  {
    id: 5,
    gridSize: 5,
    nodes: [
      { number: 1, row: 0, col: 0 },
      { number: 2, row: 0, col: 2 },
      { number: 3, row: 3, col: 0 },
      { number: 4, row: 4, col: 2 },
      { number: 5, row: 1, col: 3 },
      { number: 6, row: 0, col: 4 },
      { number: 7, row: 4, col: 4 },
    ],
  },
  {
    id: 6,
    gridSize: 5,
    nodes: [
      { number: 1, row: 2, col: 2 },
      { number: 2, row: 0, col: 0 },
      { number: 3, row: 0, col: 2 },
      { number: 4, row: 0, col: 4 },
      { number: 5, row: 2, col: 4 },
      { number: 6, row: 4, col: 4 },
      { number: 7, row: 4, col: 2 },
      { number: 8, row: 4, col: 0 },
    ],
  },

  // --- SIZE 6x6 (Levels 7-9) ---
  {
    id: 7,
    gridSize: 6,
    nodes: [
      { number: 1, row: 0, col: 0 },
      { number: 2, row: 0, col: 5 },
      { number: 3, row: 1, col: 0 },
      { number: 4, row: 2, col: 0 },
      { number: 5, row: 2, col: 5 },
      { number: 6, row: 3, col: 0 },
      { number: 7, row: 4, col: 0 },
      { number: 8, row: 4, col: 5 },
      { number: 9, row: 5, col: 0 },
    ],
  },
  {
    id: 8,
    gridSize: 6,
    nodes: [
      { number: 1, row: 0, col: 0 },
      { number: 2, row: 5, col: 0 },
      { number: 3, row: 5, col: 1 },
      { number: 4, row: 0, col: 1 },
      { number: 5, row: 0, col: 2 },
      { number: 6, row: 5, col: 2 },
      { number: 7, row: 5, col: 3 },
      { number: 8, row: 0, col: 3 },
      { number: 9, row: 0, col: 4 },
      { number: 10, row: 0, col: 5 },
    ],
  },
  {
    id: 9,
    gridSize: 6,
    nodes: [
      { number: 1, row: 2, col: 0 },
      { number: 2, row: 2, col: 1 },
      { number: 3, row: 5, col: 0 },
      { number: 4, row: 4, col: 2 },
      { number: 5, row: 3, col: 3 },
      { number: 6, row: 1, col: 2 },
      { number: 7, row: 1, col: 4 },
      { number: 8, row: 2, col: 5 },
      { number: 9, row: 5, col: 5 },
      { number: 10, row: 4, col: 4 },
      { number: 11, row: 3, col: 4 },
    ],
  },

  // --- SIZE 7x7 (Levels 10-12) ---
  {
    id: 10,
    gridSize: 7,
    nodes: [
      { number: 1, row: 0, col: 0 },
      { number: 2, row: 2, col: 1 },
      { number: 3, row: 1, col: 2 },
      { number: 4, row: 6, col: 0 },
      { number: 5, row: 4, col: 2 },
      { number: 6, row: 6, col: 3 },
      { number: 7, row: 2, col: 4 },
      { number: 8, row: 6, col: 5 },
      { number: 9, row: 1, col: 4 },
      { number: 10, row: 6, col: 6 },
    ],
  },
  {
    id: 11,
    gridSize: 7,
    nodes: [
      { number: 1, row: 0, col: 0 },
      { number: 2, row: 0, col: 6 },
      { number: 3, row: 6, col: 6 },
      { number: 4, row: 6, col: 0 },
      { number: 5, row: 1, col: 0 },
      { number: 6, row: 1, col: 5 },
      { number: 7, row: 5, col: 5 },
      { number: 8, row: 5, col: 1 },
      { number: 9, row: 2, col: 1 },
      { number: 10, row: 3, col: 4 },
      { number: 11, row: 3, col: 3 },
    ],
  },
  {
    id: 12,
    gridSize: 7,
    nodes: [
      { number: 1, row: 0, col: 0 },
      { number: 2, row: 0, col: 1 },
      { number: 3, row: 2, col: 0 },
      { number: 4, row: 3, col: 1 },
      { number: 5, row: 6, col: 0 },
      { number: 6, row: 3, col: 3 },
      { number: 7, row: 0, col: 4 },
      { number: 8, row: 6, col: 4 },
      { number: 9, row: 0, col: 5 },
      { number: 10, row: 0, col: 6 },
      { number: 11, row: 3, col: 6 },
      { number: 12, row: 6, col: 6 },
    ],
  },
  {
    id: 13,
    gridSize: 7,
    nodes: [
      { number: 1, row: 3, col: 3 },
      { number: 2, row: 1, col: 1 },
      { number: 3, row: 5, col: 5 },
      { number: 4, row: 6, col: 0 },
      { number: 5, row: 6, col: 6 },
      { number: 6, row: 0, col: 6 },
      { number: 7, row: 0, col: 0 },
      { number: 8, row: 4, col: 4 },
      { number: 9, row: 2, col: 2 },
    ],
  },
];
