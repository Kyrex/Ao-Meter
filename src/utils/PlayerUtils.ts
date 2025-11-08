import { PlayerRoles, type Player } from "../data/player";
import { defaultProfession, getClassFromSpec, getPlayerProfession, type PlayerProfession } from "../data/professions";
import Utils from "./Utils";

export default abstract class PlayerUtils {
    static setRank(player: Player, rank: number): Player {
        player.rank = rank;
        return player;
    }

    static setUid(player: Player, uid: string): Player {
        player.uid = uid;
        return player;
    }

    static filterByTotalDamage(player: Player): boolean {
        return (player.total_damage?.total ?? 0) > 0;
    }

    static sortByTotalDamage(a: Player, b: Player): number {
        return (a.total_damage?.total ?? 0) - (b.total_damage?.total ?? 0);
    }

    static getPlayerProfessions(player: Player): [PlayerProfession, PlayerProfession | undefined] {
        const parts = player.profession?.split("-");
        const mainKey = parts?.at(0) ?? '';
        const specKey = parts?.at(1) ?? '';
        const main = getPlayerProfession(mainKey) ?? getPlayerProfession(getClassFromSpec(specKey)) ?? defaultProfession;
        const spec = getPlayerProfession(specKey);
        return [main, spec];
    }

    static getPlayerRole(p: Player): string {
        const [main, spec] = PlayerUtils.getPlayerProfessions(p);
        return spec?.role ?? main.role;
    }

    static getPlayerColor(player: Player, uid?: string): string {
        if (uid && player.uid === uid) return 'rgba(255, 159, 64, 0.7)';
        switch (PlayerUtils.getPlayerRole(player)) {
            case PlayerRoles.DPS: return 'rgba(145, 48, 48, 0.7)';
            case PlayerRoles.TANK: return 'rgba(56, 120, 193, 0.7)';
            case PlayerRoles.HEALER: return 'rgba(35, 158, 101, 0.7)';
            default: return '#8888';
        }

    }

    static getHealthColor(percent: number): string {
        percent = Math.floor(Utils.clamp(percent, 0, 100));
        return `hsl(${percent}, 50%, 30%)`;

    }
}