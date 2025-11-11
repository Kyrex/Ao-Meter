type Action<T> = (data: T) => void;
type Listener<T> = (fn: (data: T) => void) => void;

interface Window {
    api: {
        closeWindow: () => void;
        moveWindow: Action<WindowPosition>;
        resizeWindow: Action<WindowSize>;
        //
        onUid: Listener<string>;
        offUid: Listener<string>;
        onError: Listener<string>;
        offError: Listener<string>;
        onReady: Listener<string>;
        offReady: Listener<string>;
        onMoved: Listener<WindowPosition>;
        offMoved: Listener<WindowPosition>;
        onLock: Listener<boolean>;
        offLock: Listener<boolean>;
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