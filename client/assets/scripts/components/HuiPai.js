cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        // _huanpaitip:null,
        // _huanpaiArr:[]

    },

    // use this for initialization
    onLoad: function () {
        var huipaiinfo = cc.find("Canvas/game/huipai");
        huipaiinfo.active = false;
        var self = this;
        self.showHuiPai();
        this.node.on('set_huipai',function(data){
            self.showHuiPai();
        });
        
        this.node.on('game_over',function(data){
            huipaiinfo.active = false;
        });
    },
    
    showHuiPai:function(){
        var huipaiinfo = cc.find("Canvas/game/huipai");
        var huipai = cc.vv.gameNetMgr.huipai;
        if (huipai == null) {
            huipaiinfo.active = false;
            return;
        }
     
        huipaiinfo.active = true;
   
        for(var i = 0; i < 2; ++i){
            var curPaiNum = i == 0 ? cc.vv.gameNetMgr.huipai : cc.vv.gameNetMgr.getRealHuiPai();
            huipaiinfo.getChildByName("hp" + (i + 1)).getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_", curPaiNum);
        }
    },
});
