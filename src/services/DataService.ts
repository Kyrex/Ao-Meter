import { type Player } from "../data/player";
import PlayerUtils from "../utils/PlayerUtils";

export interface PlayerResponse {
    players: Player[];
    totalDps: number;
    totalDamage: number;
    totalHealing: number;
}

export interface Encounter {
    endTime: number;
    startTime: number;
    response: PlayerResponse;
}

export const emptyResponse: PlayerResponse = { players: [], totalDps: 0, totalDamage: 0, totalHealing: 0 };
export const emptyEncounter: Encounter = { endTime: 0, startTime: 0, response: emptyResponse };

export class DataService {
    private uid: string;
    private limit: number;
    private baseUrl: string;
    private interval?: number;

    private startTime: number;
    private encounters: Encounter[];
    private lastResponse?: PlayerResponse;

    constructor(baseUrl: string, uid: string = '', limit: number = 20) {
        this.uid = uid;
        this.limit = limit;
        this.baseUrl = baseUrl;

        this.startTime = 0;
        this.encounters = [];
    }

    setUid(uid: string) {
        this.uid = uid;
    }

    liveDpsAsEncounter(): Encounter {
        return {
            endTime: Date.now(),
            startTime: this.startTime,
            response: this.lastResponse ?? emptyResponse,
        }
    }

    getEncounter(idx: number): Encounter {
        return this.encounters[idx];
    }

    getEncounters(): Encounter[] {
        return this.encounters;
    }

    private async apiFetchUsers(): Promise<PlayerResponse> {
        function percent(value: number | undefined, total: number) {
            if (!value || total <= 0) return 0;
            return Math.round(value / total * 100);
        }

        return fetch(`${this.baseUrl}/api/data`)
            .then((r) => r.json())
            .then((r) => {
                const entries = Object.entries<Player>(r.user);
                const allPlayers = entries
                    .map(([k, p]) => PlayerUtils.setUid(p, k))
                    .filter((p) => PlayerUtils.filterByTotalDamage(p))
                    .sort((a, b) => PlayerUtils.sortByTotalDamage(b, a))
                    .map((p, i) => PlayerUtils.setRank(p, i + 1));

                const players = allPlayers.slice(0, this.limit);
                if (this.uid) {
                    const idx = allPlayers.findIndex((p) => p.uid === this.uid);
                    if (idx !== -1 && idx >= this.limit) {
                        players.push(allPlayers[idx]);
                    }
                }

                let totalDps = 0;
                let totalDamage = 0;
                let totalHealing = 0;
                let bestDamage = 0;
                let beastHealing = 0;
                players.forEach((p) => {
                    totalDps += p.total_dps ?? 0;
                    totalDamage += p.total_damage?.total ?? 0;
                    totalHealing += p.total_healing?.total ?? 0;
                    bestDamage = Math.max(p.total_damage?.total ?? 0, bestDamage);
                    beastHealing = Math.max(p.total_healing?.total ?? 0, beastHealing);
                });

                players.forEach((p) => {
                    const totalHits = Math.max(1, p.total_count?.total ?? 0);
                    p.percentages = {
                        hp: percent(p.hp, p.max_hp ?? 0),
                        barDamage: percent(p.total_damage?.total, bestDamage),
                        barHealing: percent(p.total_healing?.total, beastHealing),
                        damage: percent(p.total_damage?.total, totalDamage),
                        healing: percent(p.total_healing?.total, totalHealing),
                        lucky: percent(p.total_count?.lucky, totalHits),
                        critical: percent(p.total_count?.critical, totalHits),
                    };
                });
                return {
                    players: players,
                    totalDps: totalDps,
                    totalDamage: totalDamage,
                    totalHealing: totalHealing,
                }
            })
            .catch((e) => {
                console.warn(e);
                return emptyResponse;
            });
    }

    private async apiClear() {
        return fetch(`${this.baseUrl}/api/clear`)
            .then((r) => r.json())
            .catch((e) => console.warn(e));
    }

    start(
        onLiveDpsUpdate: (e: Encounter) => void,
        onEncountersUpdate: (e: Encounter[]) => void,
        delta: number = 100,
    ) {
        if (this.interval) return;
        this.interval = setInterval(async () => {
            const response = await this.apiFetchUsers();
            if (response.totalDamage > 0) {
                this.lastResponse = response;
                if (this.startTime === 0) {
                    this.startTime = Date.now();
                }
            } else if (this.lastResponse) {
                this.saveCurrent();
                onEncountersUpdate(this.encounters);
            }
            onLiveDpsUpdate(this.liveDpsAsEncounter());
        }, delta);
    }

    stop() {
        if (!this.interval) return;
        clearInterval(this.interval);
    }

    clear() {
        this.apiClear();
        this.saveCurrent();
    }

    private saveCurrent() {
        if (!this.lastResponse) return;
        this.encounters.unshift({
            endTime: Date.now(),
            startTime: this.startTime,
            response: this.lastResponse,
        });
        this.encounters = this.encounters.slice(0, 10);
        this.lastResponse = undefined;
        this.startTime = 0;
    }
}


