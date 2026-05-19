import { _decorator, Component, Node, Sprite, Label, Color, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

export enum PathDirection {
    NONE,
    HORIZONTAL,
    VERTICAL,
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT
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
    horizontalFrame: SpriteFrame = null!;
    @property(SpriteFrame)
    verticalFrame: SpriteFrame = null!;
    @property(SpriteFrame)
    topLeftFrame: SpriteFrame = null!;
    @property(SpriteFrame)
    topRightFrame: SpriteFrame = null!;
    @property(SpriteFrame)
    bottomLeftFrame: SpriteFrame = null!;
    @property(SpriteFrame)
    bottomRightFrame: SpriteFrame = null!;

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
        this.bgSprite.color = isHead ? this.headColor : this.visitedColor;
        this.updateVisual();
    }

    public setEmpty() {
        this.isVisited = false;
        this.pathDirection = PathDirection.NONE;
        this.bgSprite.color = this.normalColor;
        this.updateVisual();
    }

    public updateVisual() {
        // Node visual
        if (this.nodeNumber !== -1) {
            this.nodeVisual.active = true;
            this.numberLabel.string = this.nodeNumber.toString();
            // Optional: special color for node background if needed
        } else {
            this.nodeVisual.active = false;
        }

        // Path visual
        if (this.isVisited && this.pathDirection !== PathDirection.NONE) {
            this.pathSprite.node.active = true;
            switch (this.pathDirection) {
                case PathDirection.HORIZONTAL:
                    this.pathSprite.spriteFrame = this.horizontalFrame;
                    break;
                case PathDirection.VERTICAL:
                    this.pathSprite.spriteFrame = this.verticalFrame;
                    break;
                case PathDirection.TOP_LEFT:
                    this.pathSprite.spriteFrame = this.topLeftFrame;
                    break;
                case PathDirection.TOP_RIGHT:
                    this.pathSprite.spriteFrame = this.topRightFrame;
                    break;
                case PathDirection.BOTTOM_LEFT:
                    this.pathSprite.spriteFrame = this.bottomLeftFrame;
                    break;
                case PathDirection.BOTTOM_RIGHT:
                    this.pathSprite.spriteFrame = this.bottomRightFrame;
                    break;
            }
        } else {
            this.pathSprite.node.active = false;
        }
    }
}
