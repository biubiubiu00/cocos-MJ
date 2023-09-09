cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _leixingxuanze: null,
        _gamelist: null,
        _currentGame: null,
        _typeId:null,
        _curTableType: null
    },

    // use this for initialization
    onLoad: function () {
        this._gamelist = this.node.getChildByName('game_list');

        this._leixingxuanze = [];
        var t = this.node.getChildByName("leixingxuanze");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._leixingxuanze.push(n);
            }
        }
    },

    onBtnBack: function () {
        this.node.active = false;
    },

    onBtnOK: function () {
        var usedTypes = ['mhmj','mhmjdxj'];
        var type = this.getType();
        if (usedTypes.indexOf(type) == -1) {
            return;
        }

        this.node.active = false;
        this.joinRoom();
    },

    getType: function () {
        var type = 0;
        for (var i = 0; i < this._leixingxuanze.length; ++i) {
            if (this._leixingxuanze[i].checked) {
                type = i;
                break;
            }
        }
        this._typeId=type;
        if (type == 0) {
            return 'mhmj';
        }
        else if (type == 1) {
            return 'mhmjdxj';
        }
        return 'mhmj';
    },

    joinRoom: function () {
        var self = this;
        var onCreate = function (ret) {
            if (ret.errcode !== 0) {
                cc.vv.wc.hide();
                //console.log(ret.errmsg);
                if (ret.errcode == 2222) {
                    cc.vv.alert.show("提示", "钻石不足，创建房间失败!");
                }
                else {
                    cc.vv.alert.show("提示", "创建房间失败,错误码:" + ret.errcode);
                }
            }
            else {
                cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };

        var type = this.getType();
        var conf = this.constructSCMJConf();
  
        if(this._typeId==1){//小鸡飞蛋
            conf.daixiaoji=true;
        }

        conf.type = type;

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            conf: JSON.stringify(conf)
        };
        console.log(data);
        cc.vv.wc.show("正在加入房间");
        // 改为加入房间的接口
        // cc.vv.http.sendRequest("/create_private_room", data, onCreate);
    },

    constructSCMJConf: function () {
        var conf = {
            tableType: this._curTableType
        };
        return conf;
    },

    onJoinRoomClicked : function (event) {
        var target = event.target;
        var type = this.getType();
        var game = this._gamelist.getChildByName(type);
        if (target.parent && game && game.children) {
            var tableType = game.children.indexOf(target.parent);
            this._curTableType = tableType > -1 ? tableType : null;
        }
        if (this._curTableType >= 0) {
            this.joinRoom()
        }
    },


    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        var type = this.getType();
        if (this.lastType != type) {
            this.lastType = type;
            for (var i = 0; i < this._gamelist.childrenCount; ++i) {
                this._gamelist.children[i].active = false;
            }

            var game = this._gamelist.getChildByName(type);
            if (game) {
                game.active = true;
            }
            this._currentGame = game;
        }
    },
});