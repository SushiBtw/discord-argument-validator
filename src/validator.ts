import {
    // Utils
    Arg,
    ArgParseError,
    RegexList,
    ArgParseErrors,
    ArgParseInterface,
    GetType,
    UserExtended,
    ChannelType,
    EmojiType,
    // Args
    IntArg,
    AnyArg,
    SnowflakeArg,
    StringArg,
    UserArg,
    MemberArg,
    ChannelArg,
    RoleArg,
    EmojiArg
} from './types';
import { Snowflake, User, Message, Guild, GuildMember, Channel, Role, Emoji, SnowflakeUtil } from 'discord.js';

abstract class ArgBase<N extends string, T> implements Arg<N, T> {
    constructor() {}
    abstract parse(v: any, m?: Message): T;
    _remaining: boolean = false;
    _optional: boolean = false;
    _id: number = 0;

    protected constraint(fn: (v: T) => T): this {
        const parse = this.parse;
        this.parse = (v: any, m?: Message): T => {
            const res = parse(v, m);
            return fn(res);
        }
        return this;
    }
    includes(r: any[], strict = false): this {

        return this.constraint((v: any): any => {
            let _boolean: boolean = false;
            if(strict) {
                _boolean = r.includes(v);
            } else {
                _boolean = r.some(
                    val =>
                    typeof val === 'string' && typeof v === 'string' ?
                    val.toLowerCase() === v.toLowerCase() :
                    val === v
                )
            }

            if(!_boolean)
                throw new ArgParseError({
                    arg: this._id,
                    key: `InvalidInclude`,
                    expected: r,
                    got: v
                });
            return v;
        });

        return this;
    }
    remaining(r: boolean = true): this {
        this._remaining = r;
        return this;
    }
    optional(r: boolean = true): this {
        this._optional = r;
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

class UserArgParser<N extends string> extends ArgBase<N, Promise<User | undefined>> implements UserArg<N> {
    async parse(user: string, message?: Message) {
        if (!message)
            throw new ArgParseError({
                arg: this._id,
                key: 'MessageMissing',
                got: message,
                expected: Message.name,
            });
        if (RegexList.userOrMember.test(user)) {
            let returnValue = message.client.user?.bot ?
                await message.client.users.fetch(
                    RegexList.userOrMember.exec(user)![1]
                ).catch(() => null) :
                message.client.users.cache.get(
                    RegexList.userOrMember.exec(user)![1]
                );
            if(!returnValue)
                throw new ArgParseError({
                    arg: this._id,
                    key: 'UnknownUser',
                    got: user,
                    expected: User.name,
                });
            else {
                (returnValue as UserExtended).member = message.guild?.members.cache.get(returnValue?.id);
                (returnValue as UserExtended).messageCreator = message.member;
                return returnValue;
            }

        } else if (message.guild) {
            const users = await message.guild.members.fetch({query: user, limit: 1}).catch(() => null);
            let returnValue = users?.first()?.user;
            if(!returnValue)
                throw new ArgParseError({
                    arg: this._id,
                    key: 'UnknownUser',
                    got: user,
                    expected: User.name,
                });
            else {
                (returnValue as UserExtended).member = message.guild.members.cache.get(returnValue.id);
                (returnValue as UserExtended).messageCreator = message.member;
                return returnValue;
            }
        } else throw new ArgParseError({
            arg: this._id,
            key: 'UnknownUser',
            got: user,
            expected: User.name,
        });
    }
}

class MemberArgParser<N extends string> extends ArgBase<N, Promise<GuildMember | undefined>> implements MemberArg<N> {
    async parse(member: string, message?: Message) {
        if (!message)
            throw new ArgParseError({
                arg: this._id,
                key: 'MessageMissing',
                got: message,
                expected: Message.name,
            });
        if (RegexList.userOrMember.test(member)) {
            let returnValue = message.client.user?.bot ?
                await message.client.users.fetch(
                    RegexList.userOrMember.exec(member)![1]
                ).catch(() => null) :
                message.client.users.cache.get(
                    RegexList.userOrMember.exec(member)![1]
                );
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

class ChannelArgParser<N extends string> extends ArgBase<N, Channel | undefined> implements ChannelArg<N> {
    parse(channel: string, message?: Message) {
        if (!message)
            throw new ArgParseError({
                arg: this._id,
                key: 'MessageMissing',
                got: message,
                expected: Message.name,
            });
        if(message.guild && RegexList.channel.test(channel)) {
            let returnValue = message.guild.channels.cache.get(
                RegexList.channel.exec(channel)![1]
            );
            if(!returnValue)
                throw new ArgParseError({
                    arg: this._id,
                    key: 'UnknownChannel',
                    got: channel,
                    expected: Channel.name,
                });
            return returnValue;
        } else {
            throw new ArgParseError({
                arg: this._id,
                key: 'UnknownChannel',
                got: channel,
                expected: Channel.name,
            });
        }
    }

    type(s: ChannelType[]) {
        return this.constraint((v: Channel | undefined): Channel | undefined => {
            if(!s.includes(v!.type))
                throw new ArgParseError({
                    arg: this._id,
                    key: 'InvalidChannelType',
                    expected: s,
                    got: v!.type
                });
            return v;
        });
    }
}

class RoleArgParser<N extends string> extends ArgBase<N, Role | undefined> implements RoleArg<N> {
    parse(role: string, message?: Message) {
        if (!message)
            throw new ArgParseError({
                arg: this._id,
                key: 'MessageMissing',
                got: message,
                expected: Message.name,
            });
        if(message.guild && RegexList.role.test(role)) {
            let returnValue = message.guild.roles.cache.get(
                RegexList.role.exec(role)![1]
            );
            if(!returnValue)
                throw new ArgParseError({
                    arg: this._id,
                    key: 'UnknownRole',
                    got: role,
                    expected: Role.name,
                });
            return returnValue;
        } else {
            throw new ArgParseError({
                arg: this._id,
                key: 'UnknownRole',
                got: role,
                expected: Role.name,
            });
        }
    }
}

class EmojiArgParser<N extends string> extends ArgBase<N, Emoji> implements EmojiArg<N> {
    parse(emoji: string, message?: Message) {
        if (!message)
            throw new ArgParseError({
                arg: this._id,
                key: 'MessageMissing',
                got: message,
                expected: Message.name,
            });
        let _emojiMatch = emoji.match(RegexList.emoji);
        let _isUnicode = false,
            _isEmoji = !!_emojiMatch,
            _isAnimated = false;
        if(!_isEmoji) {
            _isUnicode = RegexList.unicodeEmoji.test(emoji);
            if(_isUnicode)
                _isEmoji = false;
        } else _isAnimated = _emojiMatch![1] === '<a';

        if(!_isEmoji && !_isUnicode) {
            throw new ArgParseError({
                arg: this._id,
                key: 'UnknownEmoji',
                got: emoji,
                expected: Emoji.name,
            });
        } else if(_isEmoji) {
            return new Emoji(message.client, {
                animated: _isAnimated,
                id: _emojiMatch![3].slice(0, -1),
                name: _emojiMatch![2]
            });
        } else {
            return new Emoji(message.client, {
                animated: false,
                id: null,
                name: emoji
            });
        }
    }

    type(s: EmojiType[]) {
        return this.constraint((v: Emoji): Emoji => {
            let _type: EmojiType = v.id ? 'global' : 'unicode';
            if(!s.includes(_type))
                throw new ArgParseError({
                    arg: this._id,
                    key: 'InvalidEmojiType',
                    expected: s,
                    got: _type
                });
            return v;
        });
    }
}

/*
* AVTypes
*/
const AVString = <N extends string>(): StringArg<N> => new StringArgParser();
const AVNumber = <N extends string>(): IntArg<N> => new IntArgParser();
const AVSnowflake = <N extends string>(): SnowflakeArg<N> => new SnowflakeArgParser();
const AVAny = <N extends string>(): AnyArg<N> => new AnyArgParser();
const AVUser = <N extends string>(): UserArg<N> => new UserArgParser();
const AVMember = <N extends string>(): MemberArg<N> => new MemberArgParser();
const AVChannel = <N extends string>(): ChannelArg<N> => new ChannelArgParser();
const AVRole = <N extends string>(): RoleArg<N> => new RoleArgParser();
const AVEmoji = <N extends string>(): EmojiArg<N> => new EmojiArgParser();

/*
* AVCheckers
*/
function AVArgs<T extends Arg<string, any>[]>(...parsers: T): (message: Message, rawArgs: string[]) => Promise<{ parsed: GetType<T>; default: string[]; }> {
    return async (message, rawArgs) => {
        const res: any = [];
        for (let i = 0; i < parsers.length; i++) {
            const parser = parsers[i];
            let arg = rawArgs[i];
            if(arg) {
                if(parser._remaining && rawArgs.length > parsers.length)
                    arg += ' ' + rawArgs.slice(parsers.length).join(' ');
                parser._id = i;
                res[i] = await parser.parse(arg, message);
            } else if(!parser._optional) {
                throw new ArgParseError({
                    key: 'ArgumentRequired',
                    got: arg,
                    expected: parser.constructor.name.slice(0, -9),
                    arg: i,
                });
            } else res[i] = undefined;
        }

        return {
            parsed: res as GetType<T>,
            default: rawArgs,
        }
    };
}

export {
    AVString as string,
    AVAny as any,
    AVNumber as number,
    AVSnowflake as snowflake,
    AVUser as user,
    AVMember as member,
    AVChannel as channel,
    AVRole as role,
    AVEmoji as emoji,
    AVArgs as parse,
};
