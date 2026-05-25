import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
    @property(Label)
    levelLabel: Label = null!;

    @property(Label)
    progressLabel: Label = null!;

    @property(Node)
    victoryNode: Node = null!;

    @property(Node)
    gameCompleteNode: Node = null!;

    start() {
        if (this.victoryNode) {
            this.victoryNode.active = false;
        }
        if (this.gameCompleteNode) {
            this.gameCompleteNode.active = false;
        }
    }

    public toggleMute() {
        if (AudioManager.instance) {
            const isMuted = AudioManager.instance.toggleMute();
            // Optionnel: tu pourras ici changer l'icône du bouton mute si tu en as une
            console.log("Mute state:", isMuted);
        }
    }

    public updateLevelInfo(id: number) {
        this.levelLabel.string = `Level ${id}`;
    }

    public updateProgress(current: number, total: number) {
        this.progressLabel.string = `${current}/${total}`;
    }

    public showVictory(onComplete: () => void) {
        if (!this.victoryNode) return;

        this.victoryNode.active = true;
        this.victoryNode.setScale(new Vec3(0, 0, 0));

        tween(this.victoryNode)
            .to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .delay(1.5)
            .to(0.5, { scale: new Vec3(0, 0, 0) }, { easing: 'backIn' })
            .call(() => {
                this.victoryNode.active = false;
                onComplete();
            })
            .start();
    }

    public showGameComplete() {
        if (this.gameCompleteNode) {
            this.gameCompleteNode.active = true;
            this.gameCompleteNode.setScale(new Vec3(0, 0, 0));
            tween(this.gameCompleteNode)
                .to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
                .start();
        }
    }

    public hideGameComplete() {
        if (this.gameCompleteNode) {
            this.gameCompleteNode.active = false;
        }
    }
}
