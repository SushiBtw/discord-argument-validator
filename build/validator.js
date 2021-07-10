"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.member = exports.user = exports.snowflake = exports.number = exports.any = exports.string = void 0;
var types_1 = require("./types");
var discord_js_1 = require("discord.js");
var ArgBase = /** @class */ (function () {
    function ArgBase() {
        this._remaining = false;
        this._id = 0;
    }
    ArgBase.prototype.constraint = function (fn) {
        var parse = this.parse;
        this.parse = function (v) {
            var res = parse(v);
            return fn(res);
        };
        return this;
    };
    ArgBase.prototype.remaining = function (r) {
        if (r === void 0) { r = true; }
        this._remaining = r;
        return this;
    };
    return ArgBase;
}());
/*
* Parsers
*/
var StringArgParser = /** @class */ (function (_super) {
    __extends(StringArgParser, _super);
    function StringArgParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StringArgParser.prototype.parse = function (v) {
        return v;
    };
    StringArgParser.prototype.min = function (n) {
        var _this = this;
        return this.constraint(function (v) {
            if (v.length < n)
                throw new types_1.ArgParseError({
                    arg: _this._id,
                    key: "TooSmall",
                    minimum: n,
                    got: v
                });
            return v;
        });
    };
    StringArgParser.prototype.max = function (n) {
        var _this = this;
        return this.constraint(function (v) {
            if (v.length > n)
                throw new types_1.ArgParseError({
                    arg: _this._id,
                    key: "TooBig",
                    maximum: n,
                    got: v
                });
            return v;
        });
    };
    StringArgParser.prototype.email = function () {
        var _this = this;
        return this.constraint(function (v) {
            if (!types_1.RegexList.email.test(v))
                throw new types_1.ArgParseError({
                    arg: _this._id,
                    key: "InvalidEmail",
                    expected: types_1.RegexList.email,
                    got: v
                });
            return v;
        });
    };
    StringArgParser.prototype.regex = function (r) {
        var _this = this;
        return this.constraint(function (v) {
            if (!r.test(v))
                throw new types_1.ArgParseError({
                    arg: _this._id,
                    key: "InvalidRegex",
                    expected: r,
                    got: v
                });
            return v;
        });
    };
    return StringArgParser;
}(ArgBase));
var IntArgParser = /** @class */ (function (_super) {
    __extends(IntArgParser, _super);
    function IntArgParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IntArgParser.prototype.parse = function (v) {
        var res = Number(v);
        if (isNaN(res))
            throw new types_1.ArgParseError({
                arg: this._id,
                key: "InvalidNumber",
                expected: Number.name,
                got: v
            });
        return res;
    };
    IntArgParser.prototype.min = function (n) {
        var _this = this;
        return this.constraint(function (v) {
            if (v < n)
                throw new types_1.ArgParseError({
                    arg: _this._id,
                    key: "TooSmall",
                    minimum: n,
                    got: v
                });
            return v;
        });
    };
    IntArgParser.prototype.max = function (n) {
        var _this = this;
        return this.constraint(function (v) {
            if (v > n)
                throw new types_1.ArgParseError({
                    arg: _this._id,
                    key: "TooBig",
                    maximum: n,
                    got: v
                });
            return v;
        });
    };
    return IntArgParser;
}(ArgBase));
var SnowflakeArgParser = /** @class */ (function (_super) {
    __extends(SnowflakeArgParser, _super);
    function SnowflakeArgParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SnowflakeArgParser.prototype.parse = function (v) {
        var test = types_1.RegexList.snowflake.test(v);
        if (!test)
            throw new types_1.ArgParseError({
                arg: this._id,
                key: 'InvalidSnowflake',
                expected: types_1.RegexList.snowflake,
                got: v
            });
        return v;
    };
    return SnowflakeArgParser;
}(ArgBase));
var AnyArgParser = /** @class */ (function (_super) {
    __extends(AnyArgParser, _super);
    function AnyArgParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnyArgParser.prototype.parse = function (v) {
        return v;
    };
    return AnyArgParser;
}(ArgBase));
var UserArgParser = /** @class */ (function (_super) {
    __extends(UserArgParser, _super);
    function UserArgParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // @ts-ignore
    UserArgParser.prototype.parse = function (user, message) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var returnValue, _d, users;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!message)
                            throw new types_1.ArgParseError({
                                arg: this._id,
                                key: 'MessageMissing',
                                got: message,
                                expected: discord_js_1.Message.name,
                            });
                        if (user instanceof discord_js_1.User)
                            return [2 /*return*/, user];
                        if (!types_1.RegexList.userOrMember.test(user)) return [3 /*break*/, 4];
                        if (!((_a = message.client.user) === null || _a === void 0 ? void 0 : _a.bot)) return [3 /*break*/, 2];
                        // @ts-ignore
                        return [4 /*yield*/, message.client.users.fetch(types_1.RegexList.userOrMember.exec(user)[1]).catch(function () { return null; })];
                    case 1:
                        // @ts-ignore
                        _d = _e.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _d = message.client.users.cache.get(types_1.RegexList.userOrMember.exec(user)[1]);
                        _e.label = 3;
                    case 3:
                        returnValue = _d;
                        if (!returnValue)
                            throw new types_1.ArgParseError({
                                arg: this._id,
                                key: 'UnknownUser',
                                got: user,
                                expected: discord_js_1.User.name,
                            });
                        else
                            return [2 /*return*/, returnValue];
                        return [3 /*break*/, 7];
                    case 4:
                        if (!(message.guild instanceof discord_js_1.Guild)) return [3 /*break*/, 6];
                        return [4 /*yield*/, message.guild.members.fetch({ query: user, limit: 1 }).catch(function () { return null; })];
                    case 5:
                        users = _e.sent();
                        if (!((_b = users === null || users === void 0 ? void 0 : users.first()) === null || _b === void 0 ? void 0 : _b.user))
                            throw new types_1.ArgParseError({
                                arg: this._id,
                                key: 'UnknownUser',
                                got: user,
                                expected: discord_js_1.User.name,
                            });
                        else
                            return [2 /*return*/, (_c = users.first()) === null || _c === void 0 ? void 0 : _c.user];
                        return [3 /*break*/, 7];
                    case 6: throw new types_1.ArgParseError({
                        arg: this._id,
                        key: 'UnknownUser',
                        got: user,
                        expected: discord_js_1.User.name,
                    });
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return UserArgParser;
}(ArgBase));
var MemberArgParser = /** @class */ (function (_super) {
    __extends(MemberArgParser, _super);
    function MemberArgParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // @ts-ignore
    MemberArgParser.prototype.parse = function (member, message) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var returnValue, _f, users;
            var _this = this;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!message)
                            throw new types_1.ArgParseError({
                                arg: this._id,
                                key: 'MessageMissing',
                                got: message,
                                expected: discord_js_1.Message.name,
                            });
                        if (member instanceof discord_js_1.GuildMember)
                            return [2 /*return*/, member];
                        if (!types_1.RegexList.userOrMember.test(member)) return [3 /*break*/, 4];
                        if (!((_a = message.client.user) === null || _a === void 0 ? void 0 : _a.bot)) return [3 /*break*/, 2];
                        // @ts-ignore
                        return [4 /*yield*/, message.client.users.fetch(types_1.RegexList.userOrMember.exec(member)[1]).catch(function () { return null; })];
                    case 1:
                        // @ts-ignore
                        _f = _g.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _f = message.client.users.cache.get(types_1.RegexList.userOrMember.exec(member)[1]);
                        _g.label = 3;
                    case 3:
                        returnValue = _f;
                        if (!returnValue)
                            throw new types_1.ArgParseError({
                                arg: this._id,
                                key: 'UnknownMember',
                                got: member,
                                expected: discord_js_1.User.name,
                            });
                        else
                            return [2 /*return*/, (_c = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.members) === null || _c === void 0 ? void 0 : _c.fetch(returnValue).catch(function () {
                                    throw new types_1.ArgParseError({
                                        arg: _this._id,
                                        key: 'UnknownMember',
                                        got: member,
                                        expected: discord_js_1.User.name,
                                    });
                                })];
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, ((_e = (_d = message.guild) === null || _d === void 0 ? void 0 : _d.members) === null || _e === void 0 ? void 0 : _e.fetch({ query: member, limit: 1 }).catch(function () { return null; }))];
                    case 5:
                        users = _g.sent();
                        if (!(users === null || users === void 0 ? void 0 : users.first()))
                            throw new types_1.ArgParseError({
                                arg: this._id,
                                key: 'UnknownMember',
                                got: member,
                                expected: discord_js_1.User.name,
                            });
                        else
                            return [2 /*return*/, users.first()];
                        _g.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return MemberArgParser;
}(ArgBase));
/*
* AVTypes
*/
var AVString = function () { return new StringArgParser(); };
exports.string = AVString;
var AVNumber = function () { return new IntArgParser(); };
exports.number = AVNumber;
var AVSnowflake = function () { return new SnowflakeArgParser(); };
exports.snowflake = AVSnowflake;
var AVAny = function () { return new AnyArgParser(); };
exports.any = AVAny;
// @ts-ignore
var AVUser = function () { return new UserArgParser(); };
exports.user = AVUser;
// @ts-ignore
var AVMember = function () { return new MemberArgParser(); };
exports.member = AVMember;
/*
* AVCheckers
*/
function AVArgs(message) {
    var _this = this;
    var parsers = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        parsers[_i - 1] = arguments[_i];
    }
    return function (rawArgs) { return __awaiter(_this, void 0, void 0, function () {
        var _remaining, res, i, parser, arg, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _remaining = parsers.slice(-1)[0]._remaining;
                    if (rawArgs.length < parsers.length
                        ||
                            !_remaining && rawArgs.length > parsers.length)
                        throw new types_1.ArgParseError({
                            key: 'InvalidArgsSize',
                            got: rawArgs.length,
                            expected: parsers.length
                        });
                    res = [];
                    i = 0;
                    _c.label = 1;
                case 1:
                    if (!(i < parsers.length)) return [3 /*break*/, 4];
                    parser = parsers[i];
                    arg = rawArgs[i];
                    if (parser._remaining && rawArgs.length > parsers.length)
                        arg += ' ' + rawArgs.slice(parsers.length).join(' ');
                    parser._id = i;
                    _a = res;
                    _b = i;
                    return [4 /*yield*/, parser.parse(arg, message)];
                case 2:
                    _a[_b] = _c.sent();
                    _c.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, {
                        parsed: res,
                        default: rawArgs,
                    }];
            }
        });
    }); };
}
exports.parse = AVArgs;
