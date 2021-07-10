import { Arg, GetType, IntArg, AnyArg, SnowflakeArg, StringArg, UserArg, MemberArg } from './types';
import { Message } from 'discord.js';
declare const AVString: <N extends string>() => StringArg<N>;
declare const AVNumber: <N extends string>() => IntArg<N>;
declare const AVSnowflake: <N extends string>() => SnowflakeArg<N>;
declare const AVAny: <N extends string>() => AnyArg<N>;
declare const AVUser: <N extends string>() => UserArg<N>;
declare const AVMember: <N extends string>() => MemberArg<N>;
declare function AVArgs<T extends Arg<string, any>[]>(message: Message, ...parsers: T): (rawArgs: string[]) => Promise<{
    parsed: GetType<T>;
    default: string[];
}>;
export { AVString as String, AVAny as Any, AVNumber as Number, AVSnowflake as Snowflake, AVUser as User, AVMember as Member, AVArgs as Parse, };
