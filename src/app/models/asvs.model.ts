export interface AsvsItem {
    id: string;
    description: string;
    l1: boolean;
    l2: boolean;
    l3: boolean;
    cwe: string;
    selected?: boolean; // UI state for implementation
}

export interface AsvsCategory {
    name: string;
    items: AsvsItem[];
}
