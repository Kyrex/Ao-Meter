
export interface Player {
    uid?: string
    name?: string
    profession?: string
    
    hp?: number
    rank?: number,
    max_hp?: number,
    dead_count?: number
    fightPoint?: number
    taken_damage?: number

    total_dps?: number
    realtime_dps?: number
    realtime_dps_max?: number
    total_hps?: number
    realtime_hps?: number
    realtime_hps_max?: number

    total_count?: PlayerCount
    total_damage?: PlayerDamage
    total_healing?: PlayerHealing

    percentages?: PlayerPercentages
}

export interface PlayerCount {
    normal?: number
    critical?: number
    lucky?: number
    crit_lucky?: number
    total?: number
}

export interface PlayerDamage {
    normal?: number
    critical?: number
    lucky?: number
    crit_lucky?: number
    hpLessen?: number
    total?: number
}

export interface PlayerHealing {
    normal?: number
    critical?: number
    lucky?: number
    crit_lucky?: number
    hpLessen?: number
    total?: number
}

export interface PlayerPercentages {
    hp: number,
    barDamage: number,
    barHealing: number,
    damage: number
    healing: number
    critical: number,
    lucky: number,
}

export type PlayerRole = 'none' | 'dps' | 'tank' | 'healer';

export abstract class PlayerRoles {
    static NONE: PlayerRole = 'none'
    static DPS: PlayerRole = 'dps'
    static TANK: PlayerRole = 'tank'
    static HEALER: PlayerRole = 'healer'
}