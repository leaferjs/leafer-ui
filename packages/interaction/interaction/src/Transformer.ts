import { IMoveEvent, IZoomEvent, IRotateEvent, ITimer } from '@leafer/interface'
import { MoveEvent, ZoomEvent, RotateEvent } from '@leafer-ui/event'

import { InteractionBase } from './Interaction'


export class Transformer {

    public get transforming(): boolean { return !!(this.moveData || this.zoomData || this.rotateData) }

    protected interaction: InteractionBase
    protected moveData: IMoveEvent
    protected zoomData: IZoomEvent
    protected rotateData: IRotateEvent
    protected transformTimer: ITimer

    constructor(interaction: InteractionBase) {
        this.interaction = interaction
    }

    public move(data: IMoveEvent): void {
        const { interaction } = this
        if (!data.moveType) data.moveType = 'move'

        if (!this.moveData) {
            const { path } = interaction.selector.getByPoint(data, interaction.hitRadius)
            data.path = path
            this.moveData = { ...data, moveX: 0, moveY: 0 }
            interaction.cancelHover()
            interaction.emit(MoveEvent.START, this.moveData)
        }

        data.path = this.moveData.path
        interaction.emit(MoveEvent.BEFORE_MOVE, data)
        interaction.emit(MoveEvent.MOVE, data)

        this.transformEndWait()
    }

    public zoom(data: IZoomEvent): void {
        const { interaction } = this

        if (!this.zoomData) {
            const { path } = interaction.selector.getByPoint(data, interaction.hitRadius)
            data.path = path
            this.zoomData = { ...data, scale: 1 }
            interaction.cancelHover()
            interaction.emit(ZoomEvent.START, this.zoomData)
        }

        data.path = this.zoomData.path
        interaction.emit(ZoomEvent.BEFORE_ZOOM, data)
        interaction.emit(ZoomEvent.ZOOM, data)

        this.transformEndWait()
    }

    public rotate(data: IRotateEvent): void {
        const { interaction } = this

        if (!this.rotateData) {
            const { path } = interaction.selector.getByPoint(data, interaction.hitRadius)
            data.path = path
            this.rotateData = { ...data, rotation: 0 }
            interaction.cancelHover()
            interaction.emit(RotateEvent.START, this.rotateData)
        }

        data.path = this.rotateData.path
        interaction.emit(RotateEvent.BEFORE_ROTATE, data)
        interaction.emit(RotateEvent.ROTATE, data)

        this.transformEndWait()
    }


    protected transformEndWait(): void {
        clearTimeout(this.transformTimer)
        this.transformTimer = setTimeout(() => {
            this.transformEnd()
        }, this.interaction.config.pointer.transformTime)
    }

    public transformEnd(): void {
        this.moveEnd()
        this.zoomEnd()
        this.rotateEnd()
    }

    protected moveEnd(): void {
        if (this.moveData) {
            this.interaction.emit(MoveEvent.END, this.moveData)
            this.moveData = null
        }
    }

    protected zoomEnd(): void {
        if (this.zoomData) {
            this.interaction.emit(ZoomEvent.END, this.zoomData)
            this.zoomData = null
        }
    }

    protected rotateEnd(): void {
        if (this.rotateData) {
            this.interaction.emit(RotateEvent.END, this.rotateData)
            this.rotateData = null
        }
    }

    public destroy(): void {
        this.zoomData = this.moveData = this.rotateData = null
    }
}