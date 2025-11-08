import { useEffect, useRef } from 'react';
import './ResizeHandle.css';

interface ResizeHandleProps {
    onResize: (size: { w: number, h: number }, completed: boolean) => void,
}

function ResizeHandle(props: ResizeHandleProps) {
    const { onResize } = props;
    const isResizing = useRef(false);
    const mouseStart = useRef({ x: 0, y: 0 });
    const mousePosition = useRef({ x: 0, y: 0 });
    const windowStart = useRef({ x: 0, y: 0 });

    const invokeResize = (completed: boolean) => {
        const { x, y } = mousePosition.current;
        const deltaX = x - mouseStart.current.x;
        const deltaY = y - mouseStart.current.y;
        const sizeX = windowStart.current.x + deltaX;
        const sizeY = windowStart.current.y + deltaY;
        onResize({ w: sizeX, h: sizeY }, completed);
    }

    const startResize = (e: React.MouseEvent) => {
        isResizing.current = true;
        document.body.style.cursor = "nwse-resize";
        mouseStart.current = { x: e.pageX, y: e.pageY };
        windowStart.current = { x: window.innerWidth, y: window.innerHeight };
        e.preventDefault();
        e.stopPropagation();
    };

    const doResize = (e: MouseEvent) => {
        if (!isResizing.current) return;
        mousePosition.current = { x: e.pageX, y: e.pageY };
        invokeResize(false);
    };

    const stopResize = () => {
        if (!isResizing.current) return;
        isResizing.current = false;
        document.body.style.cursor = "";
        invokeResize(true);
    };

    useEffect(() => {
        window.addEventListener("mousemove", doResize);
        window.addEventListener("mouseup", stopResize);
        return () => {
            window.removeEventListener("mousemove", doResize);
            window.removeEventListener("mouseup", stopResize);
        };
    }, []);

    return (
        <div
            className="resize-handle"
            onMouseDown={startResize}
        ></div>
    );
}

export default ResizeHandle;