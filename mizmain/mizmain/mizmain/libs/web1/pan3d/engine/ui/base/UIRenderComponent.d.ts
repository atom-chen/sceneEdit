declare module Pan3d {
    class UIRenderComponent {
        public getUiListLen(): number 
       
        protected _uiList: Array<UICompenent>;
        readonly uiListLen: number;
        objData: ObjData;
        program: WebGLProgram;
        shader: Shader3D;
        textureRes: TextureRes;
        container: UIConatiner;
        uiAtlas: UIAtlas;
        private _rendering;
        mask: UIMask;
        modelRenderList: Array<Display3D>;
        name: string;
        scale: number;
        sortnum: number;
        blenderMode: number;
        constructor();
        rendering: boolean;
        readonly texture: WebGLTexture;
        protected uiProLocation: WebGLUniformLocation;
        protected ui2ProLocation: WebGLUniformLocation;
        protected initData(): void;
        resize(): void;
        setImgUrl($url: string): void;
        setInfo(configUrl: string, imgUrl: string, $fun: Function): void;
        setAtlas($atlas: UIAtlas): void;
        creatComponent($tx: number, $ty: number, $tw: number, $th: number): UICompenent;
        getComponent($uiName: string): UICompenent;
        createFrame($upskin: string): FrameCompenent;
        creatBaseComponent($skinName: string): UICompenent;
        creatGrid9Component($skinName: string, $width: number, $height: number): Grid9Compenent;
        creatButton($upskin: string, $downskin: string): Button;
        createSelectButton($upskin: string, $selectedskin: string): SelectButton;
        addRenderUI(ui: UICompenent): void;
        removeRenderUI(ui: UICompenent): void;
        applyObjData(): void;
        protected renderData: Float32Array;
        protected renderData2: Float32Array;
        makeRenderDataVc($vcId: number): void;
        private num;
        visible: boolean;
        update(): void;
        protected setTextureToGpu(): void;
        setVc(): void;
        addModel($display: Display3D): void;
        removeModel($display: Display3D): void;
        insetUi($e: Vector2D): UICompenent;
        interactiveEvent($e: InteractiveEvent): boolean;
        dispose(): void;
    }
}
