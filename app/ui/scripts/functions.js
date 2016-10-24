/**
 * Utilities
 *
 * @author Luchik
 *
 * @param {function} utilsFactory
 * @returns {undefined}
 */
var Utils;
/* commonjs package manager support (eg componentjs) */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = Utils;
}

(function () {
    "use strict";

    Utils = {
        'Console': {
            prn: prn,
            sprn: sprn,
            lprn: lprn
        },
        'Type': {
            'constructorOf': constructorOf,
            'isArray': isArray,
            'isInt': isInt,
            'isFloat': isFloat,
            'int': int,
            'float': float
        },
        'Object': {
            'isObjectEmtyOrNull': isObjectEmtyOrNull,
            'tpPrecision': tpPrecision,
            'forEach': forEach,
            'firstKey': firstKey,
            'lastKey': lastKey,
            'length': length,
            'areSame': areSame,
            'merge': merge,
            'clone': clone,
            'toSimpleObject': toSimpleObject
        },
        'Class': {
            'extend': extend,
            'follow': follow
        },
        'String': {
            'pad': pad,
            'lcFirst': lcFirst,
            'ucFirst': ucFirst
        },
        'Date': {
            'resetToDayStart': resetToDayStart,
            'resetToDayEnd': resetToDayEnd,
            'getWeekNumber': getWeekNumber,
            'getWeeksInYear': getWeeksInYear
        },
        'Generation': {
            'keygen': keygen,
            'keygenNum': keygenNum
        }
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // OBJECT FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get entity class
     *
     * @description Get class name of provided entity if it is not standart. If it is standart returns [undefined]
     *
     * @function
     * @param {mixed} entity Any entyty
     * @returns {String|undefined} Returns class name ifobject is a class with its constructor
     */
    function constructorOf(entity) {
        var funcNameRegex, results, constructor;

        if ('object' !== typeof entity || null === entity) {
            return undefined;
        }

//        constructor = Object.prototype.toString.call(entity)
//            .match(/^\[object\s(.*)\]$/)[1];

        funcNameRegex = /function ([^>(]*)\(/;
        results = (funcNameRegex).exec((entity).constructor.toString());
        constructor = (results && results.length > 1) ? results[1] : "";

        switch (constructor) {
            case 'Null':
            case 'Boolean':
            case 'Number':
            case 'String':
            case 'Function':
            case 'Object':
                return undefined;

            default:
                return constructor;
        }
    }

    function isArray(value) {
        if ('object' !== typeof value || null === value) {
            return false;
        }

        if (value.length > 0) {
            return true;
        }

        if ([] === value.length) {
            return true;
        }
        return false;
    }

    function isObjectEmtyOrNull(value) {
        if ('object' !== typeof value) {
            return false;
        }

        if (null === value) {
            return true;
        }

        var i;
        for (i in value) {
            if (value.hasOwnProperty(value)) {
                return false;
            }
        }

        return true;
    }

    function isInt(value) {
        var type = typeof value;
        if ('number' !== type && 'string' !== type) {
            return false;
        }

        var parsedValue = parseInt(value, 10);
        return (parsedValue == value);
    }

    function isFloat(value) {
        var type = typeof value;
        if ('number' !== type && 'string' !== type) {
            return false;
        }

        var parsedValue = parseFloat(value);
        return (parsedValue == value);
    }

    function int(value) {
        if ('undefined' === typeof value) {
            return undefined;
        }

        if (parseFloat(value) != value) {
            throw new Error('Value should be a valid integer number, "' + value + '" is given', 'functions');
        }
        return parseInt(value, 10);
    }

    function float(value) {
        if ('undefined' === typeof value) {
            return undefined;
        }

        var parsedValue = parseFloat(value);
        if (parsedValue != value) {
            throw new Error('Value should be a valid float number, "' + value + '" is given', 'functions');
        }
        return parsedValue;
    }

    function tpPrecision(val) {
        if ('object' === typeof val) {
            var i, iLength;
            iLength = val.length;
            for (i = 0; i < iLength; i++) {
                val[i] = tpPrecision(val[i]);
            }
            return val;
        }
        return parseFloat((val).toFixed(4));
    }

    /**
     * Apply function for each element of an array or an object
     *
     * @description Apply function fn(element, index) for each element of list object
     *
     * @function
     * @param {object} list
     * @param {function} fn Function fn(element, index) that will be applied to each element of provided list
     * @returns {undefined}
     */
    function forEach(list, fn) {
        var i, lLength;

        if (undefined !== list && 'object' === typeof list && null !== list) {
            i = null;
            for (i in list) {
                if (list.hasOwnProperty(i)) {
                    fn(list[i], i);
                }
            }
            if (null === i) {
                lLength = (list).length;
                if (lLength > 0) {
                    for (i = 0; i < lLength; i++) {
                        if (undefined !== list[i]) {
                            fn(list[i], i);
                        }
                    }
                }
            }
        }
    }

    function firstKey(list) {
        var key;
        if ((undefined !== list) && ('object' === (typeof list)) && (null !== list)) {
            for (key in list) {
                return key;
            }

            if (list.length < 1) {
                return undefined;
            }
            return 0;
        }

        return undefined;
    }

    function lastKey(list) {
        var key;
        if ((undefined !== list) && ('object' === (typeof list)) && (null !== list)) {
            for (key in list) {
            }

            if (key) {
                return key;
            }

            if (list.length < 1) {
                return undefined;
            }
            return list.length;
        }

        return undefined;
    }

    function length(list) {

        if (list.length > 0) {
            return list.length;
        }

        var i, length;
        length = 0;
        for (i in list) {
            length++;
        }
        return length;
    }

    function areSame(obj1, obj2, exclude) {
        exclude = exclude || [];
        if (typeof obj1 !== typeof obj2) {
            return false;
        }
        switch (typeof obj1) {
            case 'string':
            case 'number':
            case 'boolean':
                return (obj1 === obj2);

            case 'object':
                var i, iLength;

                if (null === obj1 || null === obj2) {
                    return (obj1 === obj2);
                }

                if (obj1.length !== obj2.length) {
                    return false;
                }

                if (obj1.length > 0) {
                    var iLength = obj1.length;
                    for (i = 0; i < iLength; i++) {
                        if (!areSame(obj1[i], obj2[i], exclude)) {
                            return false;
                        }
                    }
                    return true;
                }

                for (i in obj1) {
                    if ((-1 === exclude.indexOf(i)) && !areSame(obj1[i], obj2[i], exclude)) {
                        return false;
                    }
                }
                for (i in obj2) {
                    if ((-1 === exclude.indexOf(i)) && !areSame(obj1[i], obj2[i], exclude)) {
                        return false;
                    }
                }

                return true;

//        case 'undefined':
//        case 'function':
            default:
                return false;
        }
    }

    function merge(mergeFirstObj, mergeSecondObj) {
        if ('undefined' === (typeof mergeFirstObj) || (typeof mergeFirstObj) !== (typeof mergeSecondObj)) {
            if ('function' === typeof mergeSecondObj) {
                return mergeSecondObj;
            }
            return clone(mergeSecondObj);
        }

        switch (typeof mergeSecondObj) {
            case 'object':
                var merjedResultObj, i, sLength, fLength;

                if (null === mergeSecondObj) {
                     //merjedResultObj = mergeSecondObj
                     return clone(mergeFirstObj);
                }


                // If one of objects is an array and another is not
                if (mergeSecondObj.length > 0 || [] === mergeSecondObj) {
                    if (mergeFirstObj.length < 1) {
                        return clone(mergeSecondObj);
                    }

                    merjedResultObj = [];
                    sLength = mergeSecondObj.length;
                    for (i = 0; i < sLength; i++) {
                        merjedResultObj.push(clone(mergeSecondObj[i]));
                    }
                    if (mergeFirstObj.length > sLength) {
                        fLength = mergeFirstObj.length;
                        for (i = sLength; i < fLength; i++) {
                            merjedResultObj.push(clone(mergeFirstObj[i]));
                        }
                    }
                    return merjedResultObj;
                }

                merjedResultObj = {};
                for (i in mergeFirstObj) {
                    if ('undefined' === typeof mergeSecondObj[i]) {
                        merjedResultObj[i] = clone(mergeFirstObj[i]);
                    }
                }
                for (i in mergeSecondObj) {
                    merjedResultObj[i] = merge(mergeFirstObj[i], mergeSecondObj[i]);
                }
                return merjedResultObj;

            default:
                return mergeSecondObj;
        }

        return clone(mergeFirstObj);
    }

    function clone(simpleObg) {
        var newObj, i, iLength;

        switch (typeof simpleObg) {
            case 'object':
                if (simpleObg instanceof Date) {
                    return new Date(simpleObg);
                }
                if (null === simpleObg) {
                    return null;
                }
                if ([] === simpleObg) {
                    return [];
                }
                if ({} === simpleObg) {
                    return {};
                }

                iLength = simpleObg.length;
                if (iLength > 0) {
                    newObj = [];
                    for (i = 0; i < iLength; i++) {
                        newObj.push(clone(simpleObg[i]));
                    }
                } else {
                    newObj = {};
                    for (i in simpleObg) {
                        newObj[i] = clone(simpleObg[i]);
                    }
                }
                return newObj;

            case 'function':
            case 'undefined':
                return undefined;

                /**
                 * In case 'string', 'number', 'boolean'
                 */
            default:
                return simpleObg;
        }

        return simpleObg;
    }

    /**
     * Object serialization
     *
     * Fields are an object in a format
     *     {
     *          fieldToFind1 : fieldToConvert1,
     *          fieldToFind2 : fieldToConvert2,
     *          ...
     *          fieldToFindN : fieldToConvertN
     *     }
     * If fieldToConvertM === '', then no subkey will be used for convertion
     * @example
     * function Entity() {
     *     this._privat_ = {
     *         key1 : 123,
     *         key2 : {a : 'a'},
     *     };
     *     this._const_ = {
     *         VAR_1 : 'CONSTANT'
     *     };
     *     this.any = 'any other key';
     * };
     * var res = toSimpleObject(new Entity(), {
     *     '_privat_' : '',
     *     '_const_' : '_CONST_'
     * });
     * Wiill be translated to:
     * {
     *      key1 : 123,
     *      key2 : {a : 'a'},
     *      _CONST_ : {
     *          VAR_1 : 'CONSTANT'
     *      }
     * }
     *
     * @public
     * @param {object} entity Class object
     * @param {object} fields Fields that we need if class is given
     * @returns {object} simple js object
     */
    function toSimpleObject(entity, fields) {
        switch (typeof entity) {
            case 'string':
            case 'number':
            case 'boolean':
                return entity;

            case 'undefined':
            case 'function':
                return undefined;

            case 'object':
                if (null === entity) {
                    return null;
                }
                if (entity.length > 0) {
                    return entity;
                }
                break;

            default:
                return undefined;
        }

        var convertedSimpleObject, key, classname;

        convertedSimpleObject = {};

        classname = constructorOf(entity);

        if (
            // If simple object given
            !classname
            // OR If fields limitation for classes is not given and we need to get all class fields
            || ('object' !== (typeof fields)) || (null === fields.length) || (1 > fields.length)
            ) {
            toObject(convertedSimpleObject, entity, fields);
            return convertedSimpleObject;
        }

        // If fields limitation is given for classes - we need to take onkly required field for the class
        for (key in fields) {
            if (('string' !== (typeof key)) && ('number' !== (typeof key))) {
                throw new Error('incorrect data for field key provided in toSimpleObject', 'toSimpleObject')
            }
            if (('string' !== (typeof fields[key])) && ('number' !== (typeof fields[key]))) {
                throw new Error('incorrect data for field value provided in toSimpleObject', 'toSimpleObject')
            }

            if ('' === fields[key]) {
                toObject(convertedSimpleObject, entity[key], fields);
            } else {
                toObject(convertedSimpleObject[fields[key]], entity[key], fields);
            }
        }
        return convertedSimpleObject;

        function toObject(target, object, fields) {
            if ('object' !== (typeof target)) {
                target = {};
            }
            forEach(object, function (item, i) {
                if (('object' === (typeof item)) && (null !== item) && ('function' === (typeof item.toSimpleObject))) {
                    target[i] = item.toSimpleObject();
                } else {
                    target[i] = toSimpleObject(item, fields);
                }
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // CLASSES FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Extend class child class to function of parent class. If child class
     * has the same functions as parent, they will
     *
     * @syntax extend(child, parent)
     * @param {object} parent Parent class
     * @param {object} child Child class that has to be extended
     * @param {object} options
     */
    function extend(child, parent, options)
    {
        if ('object' !== typeof options) {
            options = {};
        }

        if ('function' === typeof Object.create) {
            child.prototype = Object.create(parent.prototype, options);
            child.prototype.constructor = child;

        } else {
            // For IE8 and earlier
            var F = function () {
            };
            F.prototype = parent.prototype;
            child.prototype = new F();
            child.prototype.constructor = child;
        }

        return child;
    }

    /**
     * Make child class to follow interface
     *
     * @syntax follow(child, interfaceObj1[, interfaceObj2[,...[,interfaceObjN]]])
     * @throw {Error} if method was not found
     */
    function follow()
    {
        var child, interfaceObj, i, field, interfaceType, childType;
        child = arguments[0];

        for (i = 1; i < arguments.length; i++) {
            interfaceObj = arguments[i];

            for (field in interfaceObj.prototype) {
                childType = typeof child.prototype[field];
                interfaceType = typeof interfaceObj.prototype[field];
                if ('undefined' === childType) {
                    throw new Error('Method ' + constructorOf(interfaceObj.prototype) + ':' + field
                        + ' was not found in ' + constructorOf(child.prototype))
                }
                if (interfaceType !== childType) {
                    throw new Error('Method  ' + constructorOf(interfaceObj.prototype) + ':' + field
                        + ' in ' + constructorOf(child.prototype)
                        + ' has another type then in' + constructorOf(interfaceObj.prototype)
                        + ' : ' + interfaceType + ' expected, ' + childType + ' given')
                }
            }
        }

        return true;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STRING FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /**
     * Convert number or string to number/string of proper length, if number/string length is less then expected, fill
     * it with sybol provided
     *
     * @param {string|number} n
     * @param {number} requiredWidth
     * @param {string} fillWordStartWithSymbol '0' on default
     * @returns {string}
     */
    function pad(value, requiredWidth, fillWordStartWithSymbol) {
        if (!requiredWidth) {
            return value;
        }

        fillWordStartWithSymbol = fillWordStartWithSymbol || '0';
        value = value + '';

        if (2 === requiredWidth) {
            if (value < 10) {
                return fillWordStartWithSymbol + value;
            }
            return value;
        }

        var valueLength;
        valueLength = value.length;

        return valueLength >= requiredWidth
            ? value
            : new Array(requiredWidth - valueLength + 1).join(fillWordStartWithSymbol) + value;
    }

    /**
     * Convert first letter to Lower Case
     *
     * @param {string} str
     * @returns {string}
     */
    function lcFirst(str) {
        if ('string' !== typeof str) {
            return str;
        }

        var newStr;
        newStr = str.charAt(0).toLowerCase() + str.slice(1);

        return newStr;
    }

    /**
     * Convert first letter to Upper Case
     *
     * @param {string} str
     * @returns {string}
     */
    function ucFirst(str) {
        if ('string' !== typeof str) {
            return str;
        }

        var newStr;
        newStr = str.charAt(0).toUpperCase() + str.slice(1);

        return newStr;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // RANDOM GENERATION ///////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*
     * Generate a random uuid.
     *
     * USAGE: Math.uuid(length, radix)
     *   length - the desired number of characters
     *   radix  - the number of allowable values for each character.
     *
     * EXAMPLES:
     *   // No arguments  - returns RFC4122, version 4 ID
     *   >>> Math.uuid()
     *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
     *
     *   // One argument - returns ID of the specified length
     *   >>> Math.uuid(15)     // 15 character ID (default base=62)
     *   "VcydxgltxrVZSTV"
     *
     *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
     *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
     *   "01001010"
     *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
     *   "47473046"
     *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
     *   "098F4D35"
     */
    function keygen() {
        // Private array of chars to use
        var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

        return _generator();

        function _generator(len, radix) {
            var chars = CHARS, uuid = [];
            radix = radix || chars.length;

            if (len) {
                // Compact form
                for (var i = 0; i < len; i++)
                    uuid[i] = chars[0 | Math.random() * radix];
            } else {
                // rfc4122, version 4 form
                var r;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (var i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i === 19) ? ((r & 0x3) | 0x8) : (r & 0xf)];
                    }
                }
            }

            return uuid.join('');
        }
    }

    function keygenNum(range) {
        var key, i, pow;

        if (!isInt(range) || range < 1) {
            range = 3;
        }

        key = 0;
        for (i = 0; i < range; i++) {
            pow = Math.pow(10, i + 1);
            key += (Math.random() * pow) * 0.3
                + (Math.random() * pow) * 0.3
                + (Math.random() * pow) * 0.3
                + pow * 0.1;
        }

        return Math.floor(key);
    }

    function resetToDayStart(date) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
    }

    function resetToDayEnd(date) {
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        date.setMilliseconds(999);
    }

    /**
     * Get number of w]a week for the date
     *
     * @param {Date} ddate
     * @returns {number}
     */
    function getWeekNumber(date) {
        var weekStartDay, yearStart, weekNo;

        // Get first day of year
        yearStart = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 1);
        weekStartDay = yearStart.getDay();

        // Copy date so don't modify original
        date = new Date(date);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(1);

        // Calculate full week number
        if (0 !== weekStartDay) {
            weekNo = Math.ceil((((date - yearStart) / 86400000) - (6 - weekStartDay)) / 7);
        } else {
            weekNo = Math.floor(((date - yearStart) / 86400000) / 7);
        }

        // Return week number
        return weekNo;
    }

    /**
     * Get number of weeks in a year
     *
     * @param {number} year
     * @returns {number}
     */
    function getWeeksInYear(year) {
        return 52 + (new Date(year, 0, 1).getDay() != 0
            || new Date(year, 11, 31).getDay() != 6);
    }



})();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONSOLE FUNCTIONS ///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function prn() {
    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    console.log(arguments);
}
function sprn() {
    var i, iLngth;
    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    switch (typeof arguments) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'undefined':
            console.log(arguments);

        case 'object':
            var i, iLngth = arguments.length;
            if (iLngth > 0) {
                for (i = 0; i < iLngth; i++) {
                    console.log('[' + i + '] : ' + JSON.stringify(arguments[i]));
                }

            } else {
                for (i in arguments) {
                    console.log('[' + i + '] : ' + JSON.stringify(arguments[i]()));
                }
            }
            break;

        default:
            console.log(JSON.stringify(arguments));
            break;
    }
}
function lprn() {
    console.log('---------------------------------------------------------------------------------------------');
    console.log('Length = ' + arguments.length + ' : ');
    for (var i = 0; i < arguments.length; i++) {
        console.log('----------  ' + i + '  ----------');
        sprnPrint(null, arguments[i], 0, 3, true);
    }
    console.log('---------------------------------------------------------------------------------------------');

    function sprnPrint(key, value, level, maxLevel, isRestStringified) {
        var beforeSpace;
        beforeSpace = sprnShifts(level)
            + ((('number' === typeof key) || ('string' === typeof key))
                ? key + ' : ' : '');

        level = level || 0;
        if (level >= maxLevel) {
            if (true === isRestStringified) {
                console.log(beforeSpace + sprnString(value));
            } else {
                console.log(beforeSpace + '...');
            }
            return;
        }

        switch (typeof value) {
            case 'object':
                if (null === value) {
                    console.log(beforeSpace + 'null');

                } else if (value.length > 0) {
                    if ((1 === value.length) && ('object' !== typeof value[0])) {
                        console.log(beforeSpace + '[ ' + sprnString(value[0]) + ' ]');
                    } else {
                        console.log(beforeSpace + '[');
                        for (key = 0; key < value.length; key++) {
                            sprnPrint(null, value[key], level + 1, maxLevel, isRestStringified);
                        }
                        console.log(sprnShifts(level) + ']');
                    }

                } else {
                    var objCout = 0, lastValue;
                    for (key in value) {
                        objCout++;
                        lastValue = value;
                    }

                    if (0 === objCout) {
                        console.log(beforeSpace + '{ }');

                    } else if ((1 === objCout) && ('object' !== typeof lastValue)) {
                        console.log(beforeSpace + '{ <' + typeof lastValue + '>' + sprnString(lastValue) + ' }');

                    } else {
                        console.log(beforeSpace + '{');
                        for (key in value) {
                            sprnPrint(key, value[key], level + 1, maxLevel, isRestStringified);
                            objCout++;
                        }
                        console.log(sprnShifts(level) + '}');
                    }
                }
                break;

            case 'string':
            case 'number':
            case 'boolean':
            case 'undefined':
            default:
                console.log(beforeSpace + sprnString(value));
                break;
        }

    }
    function sprnShifts(count, key) {
        var str;
        str = '';
        for (var i = 0; i < count; i++) {
            str += '  ';
        }
        return str;
    }
    function sprnString(value) {
        var type;
        type = typeof value;
        switch (type) {
            case 'object':
                return  JSON.stringify(value);
                break;

            case 'string':
            case 'number':
            case 'boolean':
                return JSON.stringify(value);
                break;

            case 'function':
                return 'function()';
                break;

            case 'undefined':
            default:
                return '<' + type + '>' + JSON.stringify(value);
                break;
        }
    }
}
