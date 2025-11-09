import { AnimatePresence, motion } from "framer-motion";
import type { Player } from "../data/player";
import type { Encounter } from "../services/DataService";
import PlayerUtils from "../utils/PlayerUtils";
import Utils from "../utils/Utils";
import './Leaderboard.css';

export function MiniLabel({ text }: { text: string }) {
    return (
        <span style={{
            color: "#eee8",
            fontSize: "8pt",
        }}>{text}</span>
    );
}

interface PlayerEntryProps {
    player: Player
    isLite: boolean,
    selfUid?: string
}

function PlayerEntry(props: PlayerEntryProps) {
    const { player, isLite, selfUid } = props;

    const height = isLite ? 40 : 56;
    const iconHeight = 36;
    const subIconHeight = iconHeight / 1.8;

    const color = PlayerUtils.getPlayerColor(player, selfUid);
    const [main, spec] = PlayerUtils.getPlayerProfessions(player);
    const peakDps = player.realtime_dps_max ?? 0;
    const hpPercent = player.percentages?.hp ?? 0;
    const barPercent = player.percentages?.barDamage ?? 0;
    const damagePercent = player.percentages?.damage ?? 0;
    const luckPercent = player.percentages?.lucky ?? 0;
    const criticalPercent = player.percentages?.critical ?? 0;

    return (
        <div className="rank-bar" style={{
            minHeight: `${height}px`,
            padding: `${isLite ? 0 : 4}px 8px ${isLite ? 0 : 4}px 4px`,
            '--fill': `${barPercent}%`,
            '--color': `linear-gradient(0, ${color}, transparent)`,
        } as React.CSSProperties}>
            <div className="rank-col" style={{ width: "30px", textAlign: "center", paddingTop: "2px" }}>
                <span>{player.rank ?? '-'}</span>
                <span style={{ fontSize: "8pt" }}><MiniLabel text={Utils.formatValue(player.fightPoint)} /></span>
            </div>
            <div style={{ width: `${iconHeight}px`, height: `${iconHeight}px`, position: "relative" }}>
                <img src={main.icon} width={`${iconHeight}px`} height={`${iconHeight}px`} style={{ display: "block", opacity: 0.3 }} />
                {spec?.icon && <img className="rank-img-spec" src={spec?.icon ?? main.icon} width={`${subIconHeight}px`} height={`${subIconHeight}px`} />}
            </div>
            <div className="rank-col" style={{ flex: 1, textAlign: "left", overflow: "hidden", paddingLeft: "4px" }}>
                <span>{player.name || `#${player.uid}`}</span>
                {!isLite && <span>
                    <div className="rank-hp-bar-bg" >
                        <div className="rank-hp-bar-fg" style={{ height: "100%", width: `${hpPercent}%`, backgroundColor: PlayerUtils.getHealthColor(hpPercent) }}></div>
                        <span>🤍 {Utils.formatValue(player.hp ?? 0)}/{Utils.formatValue(player.max_hp ?? 0)}</span>
                    </div>
                </span>}
            </div>
            <div className="rank-col" style={{ width: "70px" }}>
                <span>{Utils.formatValue(player.total_dps)}{isLite && <MiniLabel text="/s" />}</span>
                {!isLite && <span>{Utils.formatValue(player.total_hps)}</span>}
                {!isLite && <span>{Utils.formatValue(player.taken_damage)}</span>}
            </div>
            {!isLite && <div className="rank-col">
                <span><MiniLabel text="DPS" /></span>
                <span><MiniLabel text="HPS" /></span>
                <span><MiniLabel text="DTK" /></span>
            </div>}
            <div className="rank-col" style={{ width: isLite ? "40px" : "70px" }}>
                <span>{Utils.formatValue(criticalPercent)}<MiniLabel text="%" /></span>
                {!isLite && <span>{Utils.formatValue(luckPercent)}<MiniLabel text="%" /></span>}
                {!isLite && <span>{Utils.formatValue(peakDps)}</span>}
            </div>
            <div className="rank-col" style={{ width: "60px" }}>
                <span>{Utils.formatValue(player.total_damage?.total)}</span>
                {!isLite && <span>{Utils.formatValue(player.total_healing?.total)}</span>}
                {!isLite && <span>{Utils.formatValue(player.dead_count)}</span>}
            </div>
            {!isLite && <div className="rank-col">
                <span><MiniLabel text="🔥" /></span>
                <span><MiniLabel text="💉" /></span>
                <span><MiniLabel text="💀" /></span>
            </div>}
            <div style={{ width: "40px", marginRight: "8px" }}>{Utils.formatValue(damagePercent)}<MiniLabel text="%" /></div>
        </div>
    );
}

interface TeamEntryProps {
    isLite: boolean;
    encounter: Encounter;
}

function TeamEntry(props: TeamEntryProps) {
    const { isLite, encounter } = props;
    const ellapsed = encounter.startTime <= 0 ? 0 : (encounter.endTime - encounter.startTime);
    return <>
        <div className="rank-bar" style={{
            width: `calc(100% - 12px)`,
            height: `${30}px`,
            paddingLeft: "4px",
            paddingRight: "8px",
        }}>
            <div style={{ width: "30px", textAlign: "center" }}>#</div>
            <div style={{ flex: 1, textAlign: "left" }}><span>{Utils.formatStopwatch(ellapsed)}</span></div>
            <div style={{ width: isLite ? "40px" : "70px" }}>
                <span>{Utils.formatValue(encounter.response.totalDps)}{isLite && <MiniLabel text="/s" />}</span>
            </div>
            {!isLite && <span><MiniLabel text="DPS" /></span>}
            <div style={{ width: isLite ? "40px" : "70px" }}><span></span></div>
            <div style={{ width: "60px" }}><span>{Utils.formatValue(encounter.response.totalDamage)}</span></div>
            {!isLite && <span><MiniLabel text="🔥" /></span>}
            <div style={{ width: "40px", marginRight: "8px" }}></div>
        </div>
    </>
}

interface LeaderboardProps {
    uid?: string;
    limit: number;
    isLite: boolean;
    encounter: Encounter;
}

function Leaderboard(props: LeaderboardProps) {
    const { uid, limit, isLite, encounter } = props;

    function playersWithSelf(): Player[] {
        const response = encounter.response;
        const idx = response.players.findIndex((p) => p.uid === uid);
        if (!uid || idx === -1 || idx < limit) {
            return response.players.slice(0, limit);
        }
        return [...response.players.slice(0, limit), response.players[idx]];
    }

    return (
        <>
            <TeamEntry isLite={isLite} encounter={encounter} />
            <AnimatePresence>
                {playersWithSelf().map((player) => {
                    return (
                        <motion.div key={player.uid} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                            <PlayerEntry player={player} isLite={isLite} selfUid={uid} />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </>
    );
}

export default Leaderboard;