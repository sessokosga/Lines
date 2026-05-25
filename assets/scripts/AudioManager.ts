import { _decorator, Component, AudioSource, AudioClip, assert } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    private static _instance: AudioManager = null!;

    public static get instance() {
        return this._instance;
    }

    @property(AudioSource)
    bgmSource: AudioSource = null!;

    @property(AudioSource)
    sfxSource: AudioSource = null!;

    @property(AudioClip)
    victorySound: AudioClip = null!;

    @property(AudioClip)
    successSound: AudioClip = null!;

    @property(AudioClip)
    errorSound: AudioClip = null!;

    @property({ type: cc.Float, min: 0, max: 1, step: 0.1, tooltip: "Volume des bruitages (0 à 1)" })
    sfxVolume: number = 1.0;

    private _isMuted: boolean = false;
    private _originalBgmVolume: number = 1.0;

    onLoad() {
        if (AudioManager._instance) {
            this.node.destroy();
            return;
        }
        AudioManager._instance = this;

        if (this.bgmSource) {
            this._originalBgmVolume = this.bgmSource.volume;
        }
    }

    public playVictory() {
        this.playOneShot(this.victorySound);
    }

    public playSuccess() {
        this.playOneShot(this.successSound);
    }

    public playError() {
        this.playOneShot(this.errorSound);
    }

    private playOneShot(clip: AudioClip) {
        if (this._isMuted || !clip || !this.sfxSource) return;
        
        // playOneShot ignore le volume de l'AudioSource, 
        // donc on utilise obligatoirement sfxVolume ici.
        this.sfxSource.playOneShot(clip, this.sfxVolume);
    }

    public toggleMute() {
        this._isMuted = !this._isMuted;
        
        if (this.bgmSource) {
            // Si mute, volume à 0, sinon on remet le volume d'origine
            this.bgmSource.volume = this._isMuted ? 0 : this._originalBgmVolume;
        }
        
        return this._isMuted;
    }

    public isMuted(): boolean {
        return this._isMuted;
    }
}
