export interface Error {
    code: string;
    errno: string;
    index: number;
    sql: string;
    sqlMessage: string;
    sqlState: string;
};