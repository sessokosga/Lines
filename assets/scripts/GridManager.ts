import {
  _decorator,
  Component,
  Node,
  Prefab,
  instantiate,
  UITransform,
  Vec2,
  Vec3,
  EventTouch,
  Color,
} from "cc";
import { Cell, PathDirection } from "./Cell";
import { LevelData, LEVELS } from "./LevelData";
import { GameUI } from "./GameUI";

const { ccclass, property } = _decorator;

@ccclass("GridLayout")
export class GridLayout {
  @property
  gridSize: number = 4;
  @property
  cellSize: number = 120;
}

@ccclass("GridManager")
export class GridManager extends Component {
  @property(Prefab)
  cellPrefab: Prefab = null!;

  @property(GameUI)
  gameUI: GameUI = null!;

  @property([GridLayout])
  layouts: GridLayout[] = [];

  @property
  defaultCellSize: number = 100;

  @property({
    type: cc.Integer,
    tooltip: "Number of the level to load on start (1-12)",
  })
  startLevelNumber: number = 1;

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

    this.loadLevel(this.startLevelNumber - 1);
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
      console.error(
        "GridManager node must have a UITransform component for UI layout!",
      );
      return;
    }

    // Get cell size from config or default
    const config = this.layouts.find((l) => l.gridSize === this.gridSize);
    const S = config ? config.cellSize : this.defaultCellSize;
    const N = this.gridSize;

    const totalGridWidth = N * S;
    const totalGridHeight = N * S;

    // Origin for centering the grid in the container
    const startX = -totalGridWidth / 2 + S / 2;
    const startY = totalGridHeight / 2 - S / 2;

    for (let r = 0; r < N; r++) {
      this.cells[r] = [];
      for (let c = 0; c < N; c++) {
        const cellNode = instantiate(this.cellPrefab);
        cellNode.parent = this.node;

        const x = startX + c * S;
        const y = startY - r * S;
        cellNode.setPosition(x, y);

        const cellTransform = cellNode.getComponent(UITransform);
        if (cellTransform) {
          cellTransform.setContentSize(S, S);
        }

        const cell = cellNode.getComponent(Cell);
        if (cell) {
          const nodeData = levelData.nodes.find(
            (n) => n.row === r && n.col === c,
          );
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
      const interpX =
        this.lastTouchPos.x + (touchPos.x - this.lastTouchPos.x) * t;
      const interpY =
        this.lastTouchPos.y + (touchPos.y - this.lastTouchPos.y) * t;
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

    const localPos = uiTransform.convertToNodeSpaceAR(
      new Vec3(screenPos.x, screenPos.y, 0),
    );

    const config = this.layouts.find((l) => l.gridSize === this.gridSize);
    const S = config ? config.cellSize : this.defaultCellSize;
    const N = this.gridSize;

    const totalGridWidth = N * S;
    const totalGridHeight = N * S;

    const col = Math.floor((localPos.x + totalGridWidth / 2) / S);
    const row = Math.floor((totalGridHeight / 2 - localPos.y) / S);

    if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
      return this.cells[row][col];
    }
    return null;
  }

  private startPath(cell: Cell) {
    this.resetPath();
    cell.setVisited(true);
    this.currentPath.push(cell);
    cell.updateVisual(true);
    this.nextExpectedNode = 2;
    this.updateUI();
  }

  private handleCellEntry(cell: Cell) {
    const lastCell = this.currentPath[this.currentPath.length - 1];
    if (cell === lastCell) return;

    // Check for retract
    if (
      this.currentPath.length > 1 &&
      cell === this.currentPath[this.currentPath.length - 2]
    ) {
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
    this.updatePathDirection(
      lastCell,
      this.currentPath[this.currentPath.length - 2],
      cell,
    );

    cell.setVisited(true);
    this.currentPath.push(cell);
    cell.pathDirection = PathDirection.NONE;
    cell.updateVisual(true);

    lastCell.updateVisual();
    this.updateUI();
  }

  private retractPath() {
    const removedCell = this.currentPath.pop()!;
    if (
      removedCell.nodeNumber !== -1 &&
      removedCell.nodeNumber === this.nextExpectedNode - 1
    ) {
      this.nextExpectedNode--;
    }
    removedCell.setEmpty();

    const newHead = this.currentPath[this.currentPath.length - 1];
    if (newHead) {
      newHead.setVisited(true);
      newHead.pathDirection = PathDirection.NONE;
      newHead.updateVisual(true);
    }

    this.updateUI();
  }

  private updatePathDirection(
    middle: Cell,
    prev: Cell | undefined,
    next: Cell,
  ) {
    const dr = next.row - middle.row;
    const dc = next.col - middle.col;

    if (dr === -1) middle.pathDirection = PathDirection.UP;
    else if (dr === 1) middle.pathDirection = PathDirection.DOWN;
    else if (dc === -1) middle.pathDirection = PathDirection.LEFT;
    else if (dc === 1) middle.pathDirection = PathDirection.RIGHT;

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
      this.gameUI.updateProgress(
        this.currentPath.length,
        this.gridSize * this.gridSize,
      );
    }
  }

  public restartGame() {
      if (this.gameUI) {
          this.gameUI.hideGameComplete();
      }
      this.loadLevel(0);
  }

  private validateVictory() {
      const allNodesTouched = this.nextExpectedNode > this.totalNodes;
      const allCellsVisited = this.currentPath.length === this.gridSize * this.gridSize;

      if (allNodesTouched && allCellsVisited && this.gameUI) {
          if (this.currentLevelIndex < LEVELS.length - 1) {
              this.gameUI.showVictory(() => {
                  this.loadLevel(this.currentLevelIndex + 1);
              });
          } else {
              // Game completely finished
              this.gameUI.showGameComplete();
          }
      }
  }
  }

