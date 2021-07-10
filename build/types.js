"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegexList = exports.ArgParseError = exports.ArgParseErrors = void 0;
exports.ArgParseErrors = {
    'InvalidNumber': 'The provided number was invalid',
    'InvalidString': 'The provided string was invalid',
    'InvalidSnowflake': 'The provided snowflake was invalid',
    'TooSmall': 'The provided number/string length was too small',
    'TooBig': 'The provided number/string length was too big',
    'InvalidArgsSize': 'The provided arguments length is not valid',
    'InvalidEmail': 'The provided string was not an email',
    'InvalidRegex': 'The provided string was not an provided regex',
    'UnknownUser': 'The provided argument was not a user',
    'UnknownMember': 'The provided argument was not a member',
    'MessageMissing': 'Message object was missing or invalid'
};
var ArgParseError = /** @class */ (function () {
    function ArgParseError(options) {
        var _a;
        this.key = options.key;
        this.msg = (_a = exports.ArgParseErrors[options.key]) !== null && _a !== void 0 ? _a : options.key;
        for (var _i = 0, _b = Object.entries(options); _i < _b.length; _i++) {
            var _c = _b[_i], K = _c[0], V = _c[1];
            // @ts-ignore
            this[K] = V;
        }
    }
    return ArgParseError;
}());
exports.ArgParseError = ArgParseError;
exports.RegexList = {
    userOrMember: new RegExp("^(?:<@!?)?(\\d{17,21})>?$"),
    channel: new RegExp("^(?:<#)?(\\d{17,21})>?$"),
    role: new RegExp("^(?:<@&)?(\\d{17,21})>?$"),
    snowflake: new RegExp("^(\\d{17,21})$"),
    email: new RegExp(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)
};
