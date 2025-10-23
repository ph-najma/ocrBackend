export declare class Database {
    private static instance;
    private isConnected;
    private constructor();
    static getInstance(): Database;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getConnectionState(): boolean;
}
declare const _default: Database;
export default _default;
//# sourceMappingURL=database.d.ts.map