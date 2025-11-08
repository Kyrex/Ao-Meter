interface Window {
    api: {
        closeWindow: () => void;
        moveWindow: (pos: WindowPosition) => void;
        resizeWindow: (res: WindowSize) => void;
        windowArgs: () => Promise<string[]>;
        //
        onReady: (fn: (url: string) => void) => void;
        offReady: (fn: (url: string) => void) => void;
        onMoved: (fn: (pos: WindowPosition) => void) => void;
        offMoved: (fn: (pos: WindowPosition) => void) => void;
        onLock: (fn: (locked: boolean) => void) => void;
        offLock: (fn: (locked: boolean) => void) => void;
    };
}

interface WindowSize {
    w: number;
    h: number;
}

interface WindowPosition {
    x: number;
    y: number;
}