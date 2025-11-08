import { useEffect, useRef, useState } from "react";

export default abstract class Utils {
    static formatValue(value?: number, dec: number = 1): string {
        if (!value) return '0';
        const vt = 1000000000000;
        const vg = 1000000000;
        const vm = 1000000;
        const vk = 1000;
        if (value >= vt) return (value / vt).toFixed(dec) + "T";
        if (value >= vg) return (value / vg).toFixed(dec) + "G";
        if (value >= vm) return (value / vm).toFixed(dec) + "M";
        if (value >= vk) return (value / vk).toFixed(dec) + "K";
        return value.toFixed(0);
    }

    private static padNumber(value: number): string {
        return value.toString().padStart(2, '0');
    }

    static formatDuration(time: number): string {
        const totalSeconds = Math.floor(time / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        if (hours > 0) return `${Utils.padNumber(hours)}h`;
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        if (minutes > 0) return `${Utils.padNumber(minutes)}m`;
        const seconds = totalSeconds % 60;
        return `${Utils.padNumber(seconds)}s`;
    }

    static formatStopwatch(time: number): string {
        if (!time) return "00:00";
        const totalSeconds = Math.floor(time / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return [Utils.padNumber(hours), Utils.padNumber(minutes), Utils.padNumber(seconds)].join(":");
        }
        return [Utils.padNumber(minutes), Utils.padNumber(seconds)].join(":");
    }

    static clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(value, max));
    }
}

export function useStateWithRef<T>(value: T): [get: T, set: React.Dispatch<React.SetStateAction<T>>, ref: React.RefObject<T>] {
    const [getValue, setValue] = useState<T>(value);
    const refValue = useRef(getValue);
    useEffect(() => { refValue.current = getValue }, [getValue]);
    return [getValue, setValue, refValue];
}