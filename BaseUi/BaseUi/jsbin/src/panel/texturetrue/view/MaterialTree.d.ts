declare module materialui {
    import TexItem = Pan3d.me.TexItem;
    import TextureCube = Pan3d.me.TextureCube;
    import Material = Pan3d.me.Material;
    import Shader3D = Pan3d.me.Shader3D;
    import ConstItem = Pan3d.me.ConstItem;
    class MaterialTree extends Material {
        private _data;
        zbuff: boolean;
        pointlight: boolean;
        private _compileData;
        private _url;
        shaderStr: string;
        texList: Array<TexItem>;
        cubeTextItem: TextureCube;
        constList: Array<ConstItem>;
        hasTime: boolean;
        timeValue: Vector2D;
        blendMode: number;
        backCull: boolean;
        killNum: number;
        hasVertexColor: boolean;
        usePbr: boolean;
        useNormal: boolean;
        useUv: boolean;
        useLightUv: boolean;
        roughness: number;
        writeZbuffer: boolean;
        useDynamicIBL: boolean;
        normalScale: number;
        lightProbe: boolean;
        directLight: boolean;
        scaleLightMap: boolean;
        noLight: boolean;
        fogMode: number;
        useKill: boolean;
        hasAlpha: boolean;
        hasSkyBox: boolean;
        skyBoxTextId: number;
        materialBaseData: MaterialBaseData;
        fcNum: number;
        fcIDAry: Array<number>;
        modelShader: Shader3D;
        roleShader: Shader3D;
        data: any;
        setData(value: any): void;
        clone(): MaterialTree;
        compileData: any;
    }
}
