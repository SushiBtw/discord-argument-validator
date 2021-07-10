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
export { AVString as string, AVAny as any, AVNumber as number, AVSnowflake as snowflake, AVUser as user, AVMember as member, AVArgs as parse, };
