const emptyWindowState = { size: { w: 100, h: 300 }, position: { x: 0, y: 0 } };
interface WindowState {
    size: WindowSize;
    position: WindowPosition;
}

const KEY_WINDOW_STATE = "KEY_WINDOW_STATE";
export class WindowService {
    private state: WindowState;
    private onLock: (locked: boolean) => void;

    private onMoved = (pos: WindowPosition) => {
        console.log('On Moved', pos);
        this.state = { ...this.state, position: pos };
        this.save();
    }

    constructor(onLock: (locked: boolean) => void) {
        this.onLock = onLock;
        this.state = emptyWindowState;
    }

    listen = () => {
        window.api.onMoved(this.onMoved.bind(this));
        window.api.onLock(this.onLock);
    }

    dispose = () => {
        window.api.offMoved(this.onMoved.bind(this));
        window.api.offLock(this.onLock);
    }

    close = () => {
        window.api.closeWindow();
    }

    load = () => {
        const json = localStorage.getItem(KEY_WINDOW_STATE);
        if (!json) return;
        const data = JSON.parse(json);
        this.state = { ...this.state, ...data };
    }

    save = () => {
        const data = JSON.stringify(this.state);
        localStorage.setItem(KEY_WINDOW_STATE, data);
    }

    move = (position: WindowPosition) => {
        this.state = { ...this.state, position: position };
        window.api.moveWindow(position);
    }

    resize = (size: WindowSize, isLite: boolean) => {
        const MIN_LITE_W = 425;
        const MIN_ADVC_W = 525;
        const MIN_LITE_H = 28 + 5 + 30 + 6 * 40;
        const MIN_ADVC_H = 28 + 5 + 30 + 6 * 64;
        const minWidth = isLite ? MIN_LITE_W : MIN_ADVC_W;
        size.w = Math.max(minWidth, size.w);
        size.h = Math.max(MIN_LITE_H, size.h);

        if (isLite && this.state.size.w === MIN_ADVC_W) {
            size.w = MIN_LITE_W;
        } else if (!isLite && this.state.size.w === MIN_LITE_W) {
            size.w = MIN_ADVC_W;
        }

        if (isLite && this.state.size.h === MIN_ADVC_H) {
            size.h = MIN_LITE_H;
            console.log('SET MIN LITE');
        } else if (!isLite && this.state.size.h === MIN_LITE_H) {
            size.h = MIN_ADVC_H;
            console.log('SET MIN ADVC');
        }

        console.log(size);
        this.state = { ...this.state, size: size };
        window.api.resizeWindow(size);
    }

    apply = (isLite: boolean) => {
        this.move(this.state.position);
        this.resize(this.state.size, isLite);
    }
}