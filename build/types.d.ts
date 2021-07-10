import { User, Snowflake, Message, GuildMember } from 'discord.js';
export declare const ArgParseErrors: {
    [key: string]: string;
};
export declare class ArgParseError {
    options?: ArgParseInterface;
    key: string;
    msg: string;
    constructor(options: ArgParseInterface);
}
export declare const RegexList: {
    userOrMember: RegExp;
    channel: RegExp;
    role: RegExp;
    snowflake: RegExp;
    email: RegExp;
};
export interface ArgParseInterface {
    key: string;
    arg?: number;
    expected?: any;
    got?: any;
    minimum?: number;
    maximum?: number;
}
export interface Arg<N extends string, T> {
    parse(v: any, message?: Message): T;
    remaining(r?: boolean): this;
    optional(r?: boolean): this;
    _remaining: boolean;
    _optional: boolean;
    _id: number;
}
export interface StringArg<N extends string> extends Arg<N, string> {
    min(n: number): this;
    max(n: number): this;
    email(): this;
    regex(r: RegExp): this;
}
export interface IntArg<N extends string> extends Arg<N, number> {
    min(n: number): this;
    max(n: number): this;
}
export interface SnowflakeArg<N extends string> extends Arg<N, string> {
}
export interface AnyArg<N extends string> extends Arg<N, string> {
}
export interface UserArg<N extends string> extends Arg<N, User | Snowflake> {
}
export interface MemberArg<N extends string> extends Arg<N, GuildMember | Snowflake> {
}
export declare type GetType<T extends unknown[]> = T extends [Arg<infer N, infer T>] ? {
    [id in N]: T;
} : T extends [Arg<infer N, infer T>, ...(infer R)] ? {
    [id in N]: T;
} & GetType<R> : never;
