/***********************************************************************/
/***************��������Э�鹤���Զ����ɣ������ֶ��޸�****************/
/************************ Э��汾��:#�������ƣ�ע�� ******************************/
/***********************************************************************/
declare module Pan3d.me {
    class Protocols {
        private _send_func;
        private _stream;
        private _FUNCS;
        constructor(f: Function);
        getFuncName(cmd: number): string;
    }
}
