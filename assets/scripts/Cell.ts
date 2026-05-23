import { _decorator, Component, Node, Sprite, Label, Color, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

export enum PathDirection {
    NONE,
    UP,
    DOWN,
    LEFT,
    RIGHT
}

@ccclass('Cell')
export class Cell extends Component {
    @property(Sprite)
    bgSprite: Sprite = null!;

    @property(Sprite)
    pathSprite: Sprite = null!;

    @property(Node)
    nodeVisual: Node = null!;

    @property(Label)
    numberLabel: Label = null!;

    @property(SpriteFrame)
    upFrame: SpriteFrame = null!;
    @property(SpriteFrame)
    downFrame: SpriteFrame = null!;
    @property(SpriteFrame)
    leftFrame: SpriteFrame = null!;
    @property(SpriteFrame)
    rightFrame: SpriteFrame = null!;

    public row: number = 0;
    public col: number = 0;
    public isVisited: boolean = false;
    public nodeNumber: number = -1;
    public pathDirection: PathDirection = PathDirection.NONE;

    private readonly normalColor = new Color(255, 255, 255, 255);
    private readonly visitedColor = new Color(144, 238, 144, 150); // Light green with opacity
    private readonly headColor = new Color(144, 238, 144, 255); // Brighter green for head
    private readonly nodeColor = new Color(0, 100, 0, 255); // Dark green

    start() {
        this.updateVisual();
    }

    public init(row: number, col: number, nodeNumber: number = -1) {
        this.row = row;
        this.col = col;
        this.nodeNumber = nodeNumber;
        this.isVisited = false;
        this.pathDirection = PathDirection.NONE;
        this.updateVisual();
    }

    public setVisited(isHead: boolean = false) {
        this.isVisited = true;
        this.updateVisual(isHead);
    }

    public setEmpty() {
        this.isVisited = false;
        this.pathDirection = PathDirection.NONE;
        this.updateVisual();
    }

    public updateVisual(isHead: boolean = false) {
        // Node visual
        if (this.nodeNumber !== -1) {
            this.nodeVisual.active = true;
            this.numberLabel.string = this.nodeNumber.toString();
            // Node is green ONLY if it's the current head, otherwise white
            this.bgSprite.color = (this.isVisited && isHead) ? this.headColor : this.normalColor;
        } else {
            this.nodeVisual.active = false;
            // Normal cells are green if visited
            if (this.isVisited) {
                this.bgSprite.color = isHead ? this.headColor : this.visitedColor;
            } else {
                this.bgSprite.color = this.normalColor;
            }
        }

        // Path visual
        if (this.isVisited && this.pathDirection !== PathDirection.NONE && this.nodeNumber === -1) {
            this.pathSprite.node.active = true;
            switch (this.pathDirection) {
                case PathDirection.UP:
                    this.pathSprite.spriteFrame = this.upFrame;
                    break;
                case PathDirection.DOWN:
                    this.pathSprite.spriteFrame = this.downFrame;
                    break;
                case PathDirection.LEFT:
                    this.pathSprite.spriteFrame = this.leftFrame;
                    break;
                case PathDirection.RIGHT:
                    this.pathSprite.spriteFrame = this.rightFrame;
                    break;
            }
        } else {
            this.pathSprite.node.active = false;
        }
    }
}
