export interface ChartData {
    username: string;
    followers: number;
    fill: string;
}

export interface ChartConfig {
    [key: string]: {
        label: string;
        color: string;
    };
}
