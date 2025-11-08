import { PlayerRoles } from "./player";

interface PlayerProfession {
    name: string
    icon: string
    role: string
}

function getPlayerProfession(name: string): PlayerProfession | undefined {
    switch (name) {
        case '雷影剑士': return { name: "Stormblade", icon: "icons/class_stormblade.webp", role: PlayerRoles.DPS };
        case '居合': return { name: "laido Slash", icon: "icons/spec_slash.webp", role: PlayerRoles.DPS };
        case '月刃': return { name: "Moonstrike", icon: "icons/spec_moon.webp", role: PlayerRoles.DPS };

        case '冰魔导师': return { name: "Frost Mage", icon: "icons/class_frost_mage.webp", role: PlayerRoles.DPS };
        case '冰矛': return { name: "Icicle", icon: "icons/spec_icicle.webp", role: PlayerRoles.DPS };
        case '射线': return { name: "Frostbeam", icon: "icons/spec_frostbeam.webp", role: PlayerRoles.DPS };

        case '青岚骑士': return { name: "Wind Knight", icon: "icons/class_wind_knight.webp", role: PlayerRoles.DPS };
        case '空枪': return { name: "Skyward", icon: "icons/spec_skyward.webp", role: PlayerRoles.DPS };
        case '重装': return { name: "Vanguard", icon: "icons/spec_vanguard.webp", role: PlayerRoles.DPS, };

        case '神射手': return { name: "Marksman", icon: "icons/class_marksman.webp", role: PlayerRoles.DPS };
        case '狼弓': return { name: "Wildpack", icon: "icons/spec_wildpack.webp", role: PlayerRoles.DPS };
        case '鹰弓': return { name: "Falconry", icon: "icons/spec_falcon.webp", role: PlayerRoles.DPS };

        case '巨刃守护者': return { name: "Heavy Guardian", icon: "icons/class_heavy_guardian.webp", role: PlayerRoles.TANK };
        case '防盾': return { name: "Recovery", icon: "icons/spec_recovery.webp", role: PlayerRoles.TANK };
        case '岩盾': return { name: "Earthfort", icon: "icons/spec_earth.webp", role: PlayerRoles.TANK };

        case '神盾骑士': return { name: "Shield Knight", icon: "icons/class_shield_knight.webp", role: PlayerRoles.TANK };
        case '格挡': return { name: "Block", icon: "icons/spec_recovery.webp", role: PlayerRoles.TANK };
        case '光盾': return { name: "Shield", icon: "icons/spec_shield.webp", role: PlayerRoles.TANK };

        case '森语者': return { name: "Verdant Oracle", icon: "icons/class_verdant_oracle.webp", role: PlayerRoles.HEALER };
        case '惩戒': return { name: "Smite", icon: "icons/spec_smite.webp", role: PlayerRoles.HEALER };
        case '愈合': return { name: "Lifebind", icon: "icons/spec_lifebind.webp", role: PlayerRoles.HEALER };

        case '灵魂乐手': return { name: "Soul Musician", icon: "icons/class_soul_musician.webp", role: PlayerRoles.HEALER };
        case '协奏': return { name: "Concerto", icon: "icons/spec_concerto.webp", role: PlayerRoles.HEALER };
        case '狂音': return { name: "Dissonance", icon: "icons/spec_diss.webp", role: PlayerRoles.HEALER };
    }
    return undefined;
}

function getClassFromSpec(spec: string): string {
    if (spec === "居合" || spec === "月刃") return "雷影剑士";
    if (spec === "冰矛" || spec === "射线") return "冰魔导师";
    if (spec === "空枪" || spec === "重装") return "青岚骑士";
    if (spec === "惩戒" || spec === "愈合") return "森语者";
    if (spec === "防盾" || spec === "岩盾") return "巨刃守护者";
    if (spec === "狼弓" || spec === "鹰弓") return "神射手";
    if (spec === "光盾" || spec === "格挡") return "神盾骑士";
    if (spec === "协奏" || spec === "狂音") return "灵魂乐手";
    return "";
}

const defaultProfession: PlayerProfession = {
    name: "Unknown",
    icon: "icons/missing_icon.png",
    role: PlayerRoles.NONE,
};

export { defaultProfession, getClassFromSpec, getPlayerProfession, type PlayerProfession };

