declare module prop {
    class InputFunTextUi extends BaseMeshUi {
        constructor(w?: number, h?: number);
        protected initView(): void;
        destory(): void;
        private chatHtmlIArea;
        private setInputTxtPos;
        private changeInputTxt;
        resize(): void;
        width: number;
        height: number;
        text: string;
    }
}
