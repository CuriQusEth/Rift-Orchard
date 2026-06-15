/**
 * ERC-8021 Transaction Attribution
 * 
 * Standardizes how transactions are attributed to builders, interfaces, and platforms.
 */

export const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";
export const BUILDER_CODE = "bc_5g9pobvt";

export interface ERC8021Attribution {
    builder: string;
    platform?: string;
    interface?: string;
}

export function getAttributionData(): ERC8021Attribution {
    return {
        builder: BUILDER_CODE,
        platform: ATTRIBUTION_CODE,
    }
}
