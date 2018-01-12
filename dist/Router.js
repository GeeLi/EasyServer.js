'use strict';

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _package = require('./../package.json');

var _package2 = _interopRequireDefault(_package);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Router {
    constructor() {
        this.incomeDebug = (0, _debug2.default)('router income');
        this.debug = (0, _debug2.default)('router run');
        this.err_Console = (0, _debug2.default)('Error');
        this.incomeDebug.enabled = this.debug.enabled = this.err_Console.enabled = true;
        this.req = null;
        this.res = null;
    }
    default(req, res) {
        res.set('EasyServer', _package2.default.version);
        this.req = req;
        this.res = res;
        this.incomeDebug(req.path);
        let actName = this.getPathToAction(req.path);
        if (!this.before()) {
            if (!this.res.headersSent) {
                this.res.send('');
            }
            return;
        }
        try {
            if (!this[actName]()) {
                return;
            }
        } catch (e) {
            this.err_Console(e.toString());
            if (!this.__call()) {
                if (!this.res.headersSent) {
                    this.res.send('');
                }
                return;
            }
        }
        this.after();
    }
    display() {}
    getPathToAction(path) {
        let name;
        if (path.lastIndexOf('/') === path.indexOf('/')) {
            name = "";
        } else {
            name = path.substr(path.lastIndexOf('/') + 1);
        }

        return name == "" ? "indexAction" : name + "Action";
    }
    __call() {
        this.debug('__call');
        if (!this.res.headersSent) this.res.send('nothing');
        return true;
    }
    before() {
        this.debug('before');
        return true;
    }
    after() {
        this.debug('after');
        if (!this.res.headersSent) {
            this.res.send('');
        }
        return true;
    }
    compilePhyPath(path) {
        var arr = path.split('/');
        //默认路径模式

        var index = -1;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == 'routes') {
                index = i + 1;
            }
        }
        this.allPath = path;
        this.fullpath = "/" + arr.slice(index).join('/');
        this.fullpath = this.fullpath.replace('.js', '/');
        if (arr[arr.length - 1] === 'index.js') {
            arr.pop();
        }
        this.path = "/" + arr.slice(index).join('/');
        this.middlepath = "/" + arr.slice(index).join('/') + "/";
        this.nickName = arr.slice(index).join('_');
    }
}
module.exports = Router;