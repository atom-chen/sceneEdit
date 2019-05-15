declare module menutwo {
    import BaseEvent = Pan3d.me.BaseEvent;
    import Module = Pan3d.me.Module;
    import Processor = Pan3d.me.Processor;
    import BaseProcessor = Pan3d.me.BaseProcessor;
    import Vector2D = Pan3d.me.Vector2D;
    import InteractiveEvent = Pan3d.me.InteractiveEvent;
    class MenuTwoEvent extends BaseEvent {
        static SHOW_RIGHT_MENU: string;
        static SHOW_COMBOX_MENU: string;
        posv2d: Vector2D;
        comboxData: Array<any>;
        comboxFun: Function;
    }
    class MenuTwoModule extends Module {
        getModuleName(): string;
        protected listProcessors(): Array<Processor>;
    }
    class MenuTwoProcessor extends BaseProcessor {
        getName(): string;
        private _MenuTwoPanel;
        protected receivedModuleEvent($event: BaseEvent): void;
        private _comboBoxMenuPanel;
        private showComboBoxMenuPanel;
        private showMenuPanel;
        private topMenuPanel;
        private addUIContainer;
        private removeUIContainer;
        onMouseDown($evt: InteractiveEvent): void;
        protected listenModuleEvents(): Array<BaseEvent>;
    }
}