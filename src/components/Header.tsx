import type { Encounter } from "../services/DataService";
import Utils from "../utils/Utils";
import './Header.css';
import { MiniLabel } from "./Leaderboard";

type Action = () => void;

interface HeaderProps {
    limit: number;
    isLite: boolean;
    selected: number;
    encounters: Encounter[];
    onMode: Action;
    onLimit: Action;
    onClear: Action;
    onClose: Action;
    onSelect: (e: number) => void;
}

function Header(props: HeaderProps) {
    const { isLite, limit, selected, encounters, onMode, onLimit, onClear, onClose, onSelect } = props;

    return (
        <div className="dps-header" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", paddingRight: "8px" }}>
            <div className='dps-handle' >
                <img src="icon.png" width="28px" height="28px" style={{ borderRadius: "6px" }} />
                <span className='btn-dps-heal' style={{ width: "100%", textAlign: "center" }}>DPS</span>
            </div>
            <i className="btn-span" style={{ width: "25px", textAlign: "right" }} onClick={onLimit}>{limit}<MiniLabel text="P" /></i>
            <i className={`btn-span fa-solid ${isLite ? 'fa-eye-slash' : 'fa-eye'}`} style={{ width: "25px", textAlign: "center" }} onClick={onMode}></i>
            <i className="btn-span fa-solid fa-arrows-rotate" onClick={onClear}></i>
            <div style={{ flex: 1, borderLeft: "1px solid #eee1" }}>
                <select style={{ width: "100%" }}
                    value={selected}
                    onChange={(ev) => {
                        if (ev.target.value) {
                            onSelect(Number(ev.target.value));
                        } else {
                            onSelect(-1);
                        }
                    }}>
                    <option value={-1}>Live Dps</option>
                    {encounters.map((e, i) => {
                        return <option key={i} value={i}>#{i} - {e.response.players.length}P - {Utils.formatDuration(e.endTime - e.startTime)} - {Utils.formatValue(e.response.totalDamage)}</option>
                    })}
                </select>
            </div>
            <i className="btn-span btn-close fa-solid fa-xmark" onClick={onClose}></i>
        </div>
    );
}

export default Header;