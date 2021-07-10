import {
    // Utils
    Arg,
    ArgParseError,
    RegexList,
    ArgParseErrors,
    ArgParseInterface,
    GetType,
    // Args
    IntArg,
    AnyArg,
    SnowflakeArg,
    StringArg,
    UserArg,
    MemberArg
} from './types';

import { Snowflake, User, Message, Guild, GuildMember } from 'discord.js';

abstract class ArgBase<N extends string, T> implements Arg<N, T> {
    constructor() {}
    abstract parse(v: any): T;
    _remaining: boolean = false;
    _id: number = 0;

    protected constraint(fn: (v: T) => T): this {
        const parse = this.parse;
        this.parse = (v: any): T => {
            const res = parse(v);
            return fn(res);
        }
        return this;
    }

    remaining(r: boolean = true): this {
        this._remaining = r;
        return this;
    }
}

/*
* Parsers
*/
class StringArgParser<N extends string> extends ArgBase<N, string> implements StringArg<N> {
    parse(v: string) {
        return v as string;
    }
    min(n: number): this {
        return this.constraint((v: string): string => {
            if(v.length < n) throw new ArgParseError({
                arg: this._id,
                key: `TooSmall`,
                minimum: n,
                got: v
            });
            return v;
        });
    }
    max(n: number): this {
        return this.constraint((v: string): string => {
            if(v.length > n) throw new ArgParseError({
                arg: this._id,
                key: `TooBig`,
                maximum: n,
                got: v
            });
            return v;
        });
    }
    email(): this {
        return this.constraint((v: string): string => {
            if(!RegexList.email.test(v)) throw new ArgParseError({
                arg: this._id,
                key: `InvalidEmail`,
                expected: RegexList.email,
                got: v
            });
            return v;
        });
    }
    regex(r: RegExp): this {
        return this.constraint((v: string): string => {
            if(!r.test(v)) throw new ArgParseError({
                arg: this._id,
                key: `InvalidRegex`,
                expected: r,
                got: v
            });
            return v;
        });
    }
}

class IntArgParser<N extends string> extends ArgBase<N, number> implements IntArg<N> {
    parse(v: string) {
        const res = Number(v);
        if(isNaN(res)) throw new ArgParseError({
            arg: this._id,
            key: `InvalidNumber`,
            expected: Number.name,
            got: v
        });
        return res;
    }

    min(n: number): this {
        return this.constraint((v: number): number => {
            if(v < n) throw new ArgParseError({
                arg: this._id,
                key: `TooSmall`,
                minimum: n,
                got: v
            });
            return v;
        });
    }

    max(n: number): this {
        return this.constraint((v: number): number => {
            if(v > n) throw new ArgParseError({
                arg: this._id,
                key: `TooBig`,
                maximum: n,
                got: v
            });
            return v;
        });
    }
}

class SnowflakeArgParser<N extends string> extends ArgBase<N, string> implements SnowflakeArg<N> {
    parse(v: string) {
        let test = RegexList.snowflake.test(v);
        if(!test) throw new ArgParseError({
            arg: this._id,
            key: 'InvalidSnowflake',
            expected: RegexList.snowflake,
            got: v
        });
        return v;
    }
}

class AnyArgParser<N extends string> extends ArgBase<N, string> implements AnyArg<N> {
    parse(v: string) {
        return v as any;
    }
}

class UserArgParser<N extends string> extends ArgBase<N, User|Snowflake> implements UserArg<N> {
    // @ts-ignore
    async parse(user: User | Snowflake, message?: Message) {
        if (!message)
            throw new ArgParseError({
                arg: this._id,
                key: 'MessageMissing',
                got: message,
                expected: Message.name,
            });
        if (user instanceof User)
            return user;
        if (RegexList.userOrMember.test(user)) {
            let returnValue = message.client.user?.bot ?
                // @ts-ignore
                await message.client.users.fetch(RegexList.userOrMember.exec(user)[1]).catch(() => null) : message.client.users.cache.get(RegexList.userOrMember.exec(user)[1]);
            if(!returnValue)
                throw new ArgParseError({
                    arg: this._id,
                    key: 'UnknownUser',
                    got: user,
                    expected: User.name,
                });
            else return returnValue;

        } else if (message.guild instanceof Guild) {
            const users = await message.guild.members.fetch({query: user, limit: 1}).catch(() => null);
            if(!users?.first()?.user)
                throw new ArgParseError({
                    arg: this._id,
                    key: 'UnknownUser',
                    got: user,
                    expected: User.name,
                });
            else return users.first()?.user;
        } else throw new ArgParseError({
            arg: this._id,
            key: 'UnknownUser',
            got: user,
            expected: User.name,
        });
    }
}

class MemberArgParser<N extends string> extends ArgBase<N, GuildMember|Snowflake> implements MemberArg<N> {
    // @ts-ignore
    async parse(member: GuildMember | Snowflake, message?: Message) {
        if (!message)
            throw new ArgParseError({
                arg: this._id,
                key: 'MessageMissing',
                got: message,
                expected: Message.name,
            });
        if (member instanceof GuildMember)
            return member;
        if (RegexList.userOrMember.test(member)) {
            let returnValue = message.client.user?.bot ?
                // @ts-ignore
                await message.client.users.fetch(RegexList.userOrMember.exec(member)[1]).catch(() => null) : message.client.users.cache.get(RegexList.userOrMember.exec(member)[1]);
            if(!returnValue)
                throw new ArgParseError({
                    arg: this._id,
                    key: 'UnknownMember',
                    got: member,
                    expected: User.name,
                });
            else return message.guild?.members?.fetch(returnValue).catch(() => {
                throw new ArgParseError({
                    arg: this._id,
                    key: 'UnknownMember',
                    got: member,
                    expected: User.name,
                });
            });

        } else {
            const users = await message.guild?.members?.fetch({query: member, limit: 1}).catch(() => null);
            if(!users?.first())
                throw new ArgParseError({
                    arg: this._id,
                    key: 'UnknownMember',
                    got: member,
                    expected: User.name,
                });
            else return users.first();
        }
    }
}

/*
* AVTypes
*/
const AVString = <N extends string>(): StringArg<N> => new StringArgParser();
const AVNumber = <N extends string>(): IntArg<N> => new IntArgParser();
const AVSnowflake = <N extends string>(): SnowflakeArg<N> => new SnowflakeArgParser();
const AVAny = <N extends string>(): AnyArg<N> => new AnyArgParser();
// @ts-ignore
const AVUser = <N extends string>(): UserArg<N> => new UserArgParser();
// @ts-ignore
const AVMember = <N extends string>(): MemberArg<N> => new MemberArgParser();

/*
* AVCheckers
*/
function AVArgs<T extends Arg<string, any>[]>(message: Message, ...parsers: T): (rawArgs: string[]) => Promise<{ parsed: GetType<T>; default: string[]; }> {
    return async (rawArgs) => {

        let { _remaining } = parsers.slice(-1)[0];
        if(_remaining)
            console.log('last sum up!');

        if (
            rawArgs.length < parsers.length
            ||
            !_remaining && rawArgs.length > parsers.length
        ) throw new ArgParseError({
            key: 'InvalidArgsSize',
            got: rawArgs.length,
            expected: parsers.length
        });

        const res: any = [];
        for (let i = 0; i < parsers.length; i++) {
            const parser = parsers[i];
            let arg = rawArgs[i];
            if(parser._remaining && rawArgs.length > parsers.length)
                arg += ' ' + rawArgs.slice(parsers.length).join(' ');
            console.log(arg);
            parser._id = i;
            res[i] = await parser.parse(arg, message);
        }

        return {
            parsed: res as GetType<T>,
            default: rawArgs,
        }
    };
}

export {
    AVString as String,
    AVAny as Any,
    AVNumber as Number,
    AVSnowflake as Snowflake,
    AVUser as User,
    AVMember as Member,
    AVArgs as Parse,
};
