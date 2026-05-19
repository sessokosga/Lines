import { _decorator, Component, Node, Prefab, instantiate, UITransform, Vec2, Vec3, EventTouch, Color } from 'cc';
import { Cell, PathDirection } from './Cell';
import { LevelData, LEVELS } from './LevelData';
import { GameUI } from './GameUI';

const { ccclass, property } = _decorator;

@ccclass('GridManager')
export class GridManager extends Component {
    @property(Prefab)
    cellPrefab: Prefab = null!;

    @property(GameUI)
    gameUI: GameUI = null!;

    private currentLevelIndex: number = 0;
    private gridSize: number = 0;
    private cells: Cell[][] = [];
    private currentPath: Cell[] = [];
    private nextExpectedNode: number = 1;
    private totalNodes: number = 0;
    private isDragging: boolean = false;
    private lastTouchPos: Vec2 = new Vec2();

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.loadLevel(this.currentLevelIndex);
    }

    public loadLevel(index: number) {
        this.currentLevelIndex = index;
        const levelData = LEVELS[index];
        this.gridSize = levelData.gridSize;
        this.totalNodes = levelData.nodes.length;
        this.nextExpectedNode = 1;
        this.currentPath = [];
        this.isDragging = false;

        this.generateGrid(levelData);
        if (this.gameUI) {
            this.gameUI.updateProgress(0, this.gridSize * this.gridSize);
            this.gameUI.updateLevelInfo(levelData.id);
        }
    }

    private generateGrid(levelData: LevelData) {
        this.node.removeAllChildren();
        this.cells = [];

        const uiTransform = this.node.getComponent(UITransform);
        if (!uiTransform) {
            console.error("GridManager node must have a UITransform component for UI layout!");
            return;
        }

        const gridWidth = uiTransform.contentSize.width;
        const cellSize = gridWidth / this.gridSize;

        for (let r = 0; r < this.gridSize; r++) {
            this.cells[r] = [];
            for (let c = 0; c < this.gridSize; c++) {
                const cellNode = instantiate(this.cellPrefab);
                cellNode.parent = this.node;
                
                const x = -gridWidth / 2 + (c + 0.5) * cellSize;
                const y = gridWidth / 2 - (r + 0.5) * cellSize;
                cellNode.setPosition(x, y);
                
                const cellTransform = cellNode.getComponent(UITransform);
                if (cellTransform) {
                    cellTransform.setContentSize(cellSize, cellSize);
                } else {
                    console.warn(`Cell prefab at [${r},${c}] is missing UITransform! Add it to the prefab root.`);
                }

                const cell = cellNode.getComponent(Cell);
                if (cell) {
                    const nodeData = levelData.nodes.find(n => n.row === r && n.col === c);
                    cell.init(r, c, nodeData ? nodeData.number : -1);
                    this.cells[r][c] = cell;
                }
            }
        }
    }

    private onTouchStart(event: EventTouch) {
        if (this.isDragging) return;

        const touchPos = event.getUILocation();
        const cell = this.getCellAtPos(touchPos);

        if (cell && cell.nodeNumber === 1) {
            this.isDragging = true;
            this.startPath(cell);
            this.lastTouchPos.set(touchPos.x, touchPos.y);
        }
    }

    private onTouchMove(event: EventTouch) {
        if (!this.isDragging) return;

        const touchPos = event.getUILocation();
        
        // Interpolation for fast swipe
        const steps = 10;
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const interpX = this.lastTouchPos.x + (touchPos.x - this.lastTouchPos.x) * t;
            const interpY = this.lastTouchPos.y + (touchPos.y - this.lastTouchPos.y) * t;
            const cell = this.getCellAtPos(new Vec2(interpX, interpY));
            
            if (cell) {
                this.handleCellEntry(cell);
            }
        }
        
        this.lastTouchPos.set(touchPos.x, touchPos.y);
    }

    private onTouchEnd() {
        this.isDragging = false;
        this.validateVictory();
    }

    private getCellAtPos(screenPos: Vec2): Cell | null {
        const uiTransform = this.node.getComponent(UITransform);
        if (!uiTransform) return null;

        const localPos = uiTransform.convertToNodeSpaceAR(new Vec3(screenPos.x, screenPos.y, 0));
        
        const gridWidth = uiTransform.contentSize.width;
        const cellSize = gridWidth / this.gridSize;

        const col = Math.floor((localPos.x + gridWidth / 2) / cellSize);
        const row = Math.floor((gridWidth / 2 - localPos.y) / cellSize);

        if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
            return this.cells[row][col];
        }
        return null;
    }

    private startPath(cell: Cell) {
        this.resetPath();
        cell.setVisited(true);
        this.currentPath.push(cell);
        this.nextExpectedNode = 2;
        this.updateUI();
    }

    private handleCellEntry(cell: Cell) {
        const lastCell = this.currentPath[this.currentPath.length - 1];
        if (cell === lastCell) return;

        // Check for retract
        if (this.currentPath.length > 1 && cell === this.currentPath[this.currentPath.length - 2]) {
            this.retractPath();
            return;
        }

        // Check if adjacent
        const dr = Math.abs(cell.row - lastCell.row);
        const dc = Math.abs(cell.col - lastCell.col);
        if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
            if (!cell.isVisited) {
                // Check if it's a node
                if (cell.nodeNumber !== -1) {
                    if (cell.nodeNumber === this.nextExpectedNode) {
                        this.extendPath(cell);
                        this.nextExpectedNode++;
                    } else {
                        this.isDragging = false;
                    }
                } else {
                    this.extendPath(cell);
                }
            }
        }
    }

    private extendPath(cell: Cell) {
        const lastCell = this.currentPath[this.currentPath.length - 1];
        this.updatePathDirection(lastCell, this.currentPath[this.currentPath.length - 2], cell);
        
        cell.setVisited(true);
        this.currentPath.push(cell);
        cell.pathDirection = PathDirection.NONE;
        cell.updateVisual();
        
        lastCell.updateVisual();
        this.updateUI();
    }

    private retractPath() {
        const removedCell = this.currentPath.pop()!;
        if (removedCell.nodeNumber !== -1 && removedCell.nodeNumber === this.nextExpectedNode - 1) {
            this.nextExpectedNode--;
        }
        removedCell.setEmpty();

        const newHead = this.currentPath[this.currentPath.length - 1];
        if (newHead) {
            newHead.setVisited(true);
            newHead.pathDirection = PathDirection.NONE;
            newHead.updateVisual();
        }

        this.updateUI();
    }

    private updatePathDirection(middle: Cell, prev: Cell | undefined, next: Cell) {
        if (!prev) {
            if (next.row < middle.row || next.row > middle.row) middle.pathDirection = PathDirection.VERTICAL;
            else middle.pathDirection = PathDirection.HORIZONTAL;
        } else {
            const fromR = prev.row - middle.row;
            const fromC = prev.col - middle.col;
            const toR = next.row - middle.row;
            const toC = next.col - middle.col;

            if (fromR !== 0 && toR !== 0) middle.pathDirection = PathDirection.VERTICAL;
            else if (fromC !== 0 && toC !== 0) middle.pathDirection = PathDirection.HORIZONTAL;
            else {
                if ((fromR === -1 && toC === 1) || (fromC === 1 && toR === -1)) middle.pathDirection = PathDirection.TOP_RIGHT;
                else if ((fromR === -1 && toC === -1) || (fromC === -1 && toR === -1)) middle.pathDirection = PathDirection.TOP_LEFT;
                else if ((fromR === 1 && toC === 1) || (fromC === 1 && toR === 1)) middle.pathDirection = PathDirection.BOTTOM_RIGHT;
                else if ((fromR === 1 && toC === -1) || (fromC === -1 && toR === 1)) middle.pathDirection = PathDirection.BOTTOM_LEFT;
            }
        }
        middle.updateVisual();
    }

    private resetPath() {
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                if (this.cells[r] && this.cells[r][c]) {
                    this.cells[r][c].setEmpty();
                }
            }
        }
        this.currentPath = [];
        this.nextExpectedNode = 1;
    }

    public resetLevel() {
        this.loadLevel(this.currentLevelIndex);
    }

    public undo() {
        if (this.currentPath.length > 1) {
            this.retractPath();
        }
    }

    private updateUI() {
        if (this.gameUI) {
            this.gameUI.updateProgress(this.currentPath.length, this.gridSize * this.gridSize);
        }
    }

    private validateVictory() {
        const allNodesTouched = this.nextExpectedNode > this.totalNodes;
        const allCellsVisited = this.currentPath.length === this.gridSize * this.gridSize;

        if (allNodesTouched && allCellsVisited && this.gameUI) {
            this.gameUI.showVictory(() => {
                if (this.currentLevelIndex < LEVELS.length - 1) {
                    this.loadLevel(this.currentLevelIndex + 1);
                }
            });
        }
    }
}
