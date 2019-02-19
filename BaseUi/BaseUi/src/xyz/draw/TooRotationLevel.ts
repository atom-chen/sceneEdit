﻿module xyz {
    import Shader3D = Pan3d.Shader3D
    import Display3D = Pan3d.Display3D;
    import ProgrmaManager = Pan3d.ProgrmaManager
    import TextureManager = Pan3d.TextureManager
    import UIManager = Pan3d.UIManager;
    import TextureRes = Pan3d.TextureRes;
    import Matrix3D = Pan3d.Matrix3D
    import Scene_data = Pan3d.Scene_data;
    import MathUtil = Pan3d.MathUtil
    import LineDisplaySprite = Pan3d.LineDisplaySprite
    import TooRotationDisplay3DSprite = cctv.TooRotationDisplay3DSprite


    export class TooRotationLevel extends TooBaseModelLevel {
        private _roundA: TooRotationDisplay3DSprite;
        private _roundB: TooRotationDisplay3DSprite;
        private _roundC: TooRotationDisplay3DSprite;
 

        constructor(value: MoveScaleRotationLevel) {
            super(value);

            this._roundA = new TooRotationDisplay3DSprite();
            this._roundB = new TooRotationDisplay3DSprite();
            this._roundC = new TooRotationDisplay3DSprite();

    

            this._roundA.colorVect = new Vector3D(1, 0, 0);
            this._roundB.colorVect = new Vector3D(0, 1, 0);
            this._roundC.colorVect = new Vector3D(0, 0, 1);


        }
        public isHit(mouseVect2d: Vector2D): void {


            this.testHitTemp(this._roundA, mouseVect2d, [new Vector3D(1, 1, 1), new Vector3D(1, 0, 0)]);
            this.testHitTemp(this._roundB, mouseVect2d, [new Vector3D(1, 1, 1), new Vector3D(0, 1, 0)]);
            this.testHitTemp(this._roundC, mouseVect2d, [new Vector3D(1, 1, 1), new Vector3D(0, 0, 1)]);


        }

        public onMouseDown(mouseVect2d: Vector2D): void {
            console.log("mouseVect2d", mouseVect2d)
            if (TooMathHitModel.testHitModel(this._roundA, this._scene, mouseVect2d)) {
                this.selectId = 1;
            } else if (TooMathHitModel.testHitModel(this._roundB, this._scene, mouseVect2d)) {
                this.selectId = 2;
            } else if (TooMathHitModel.testHitModel(this._roundC, this._scene, mouseVect2d)) {
                this.selectId = 3;
            }
            if (this.selectId) {
                var a: Vector3D, b: Vector3D, c: Vector3D
                switch (this.selectId) {
                    case 1:
                        a = new Vector3D(0, -100, +50)
                        b = new Vector3D(0, -100, -50)
                        c = new Vector3D(0, 100, +50)
                        break
                    case 2:
                        a = new Vector3D(-100, 0, +50)
                        b = new Vector3D(-100, 0, -50)
                        c = new Vector3D(+100, 0, +50)
                        break
                    case 3:
                        a = new Vector3D(-100, +50, 0)
                        b = new Vector3D(-100, -50, 0)
                        c = new Vector3D(+100, +50, 0)
                        break;
                    default:
                        break
                }
                console.log("旋转轴", this.selectId)
                this.showYaix(a,b,c)
            }
           
        }
        private showYaix(a: Vector3D, b: Vector3D, c: Vector3D): void {
            var scene: Pan3d.SceneManager = this._scene
            var mat: Matrix3D = scene.cam3D.cameraMatrix.clone();
            var viewMatrx3D: Matrix3D = scene.viewMatrx3D.clone();
            mat.append(viewMatrx3D);

            var _xyzMoveData: TooXyzPosData = this.parent.xyzMoveData;
            a = _xyzMoveData.modeMatrx3D.transformVector(a)
            b = _xyzMoveData.modeMatrx3D.transformVector(b)
            c = _xyzMoveData.modeMatrx3D.transformVector(c)

            var $triNrm: Vector3D = Vector3D.calTriNormal(a, b, c, true);//获取平面法线

            var centen2d: Vector2D = TooMathHitModel.math3DWorldtoDisplay2DPos(_xyzMoveData.modeMatrx3D.position, mat, scene.cam3D.cavanRect) 
            var outPos2d: Vector2D = TooMathHitModel.math3DWorldtoDisplay2DPos($triNrm.add(_xyzMoveData.modeMatrx3D.position), mat, scene.cam3D.cavanRect)

   

            this._linePosinA = centen2d;
            this._linePosinB = outPos2d;

    
        }
        
        private _linePosinA: Vector2D
        private _linePosinB: Vector2D
        public onMouseUp(mouseVect2d: Vector2D): void {
 
            this.selectId = 0;
            this.lastDis = null
 
        }
        private lastDis: number
 
        public onMouseMove(mouseVect2d: Vector2D): void {
            if (this.selectId > 0) {
                var dis: number = MathUtil.pointToLine2dDis(this._linePosinA, this._linePosinB, mouseVect2d);
                if (!isNaN(this.lastDis)) {
                    var addRotation: number = dis - this.lastDis
                    var _xyzMoveData: TooXyzPosData = this.parent.xyzMoveData;
                    switch (this.selectId) {
                        case 1:
                            _xyzMoveData.rotationX += addRotation;
                            break
                        case 2:
                            _xyzMoveData.rotationY += addRotation;
                            break
                        case 3:
                            _xyzMoveData.rotationZ += addRotation;
                            break;
                        default:
                            break
                    }
                }
                this.lastDis = dis
            }
        }
       


 

        public update(): void {
            super.update()
    
            if (this.parent.xyzMoveData) {
                this.posMatrix.append(this.parent.xyzMoveData.modeMatrx3D);
            }


            this._roundA.posMatrix = this.posMatrix.clone();
 

            this._roundB.posMatrix = this.posMatrix.clone();
            this._roundB.posMatrix.prependRotation(90, Vector3D.Z_AXIS);

            this._roundC.posMatrix = this.posMatrix.clone();
            this._roundC.posMatrix.prependRotation(-90, Vector3D.Y_AXIS);

     
            Scene_data.context3D.renderContext.enable(Scene_data.context3D.renderContext.CULL_FACE);
            Scene_data.context3D.renderContext.cullFace(Scene_data.context3D.renderContext.BACK);

  
            Scene_data.context3D.setWriteDepth(true);
            Scene_data.context3D.setDepthTest(true);


            this._roundA.update();
             this._roundB.update();
             this._roundC.update();
 




        }



    }
}