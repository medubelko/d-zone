import * as PIXI from 'pixi.js-legacy'
import { Viewport } from 'pixi-viewport'
import WheelStepped from './wheel-stepped'
import Cull from 'pixi-cull'

// Global PIXI settings
PIXI.settings.RESOLUTION = 1
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

const zoomLevels = [0.25, 0.5, 1, 2, 3, 4, 5, 6, 8] as const

export default class Renderer {
	app: PIXI.Application
	view: Viewport
	cull: any

	constructor(canvas: HTMLCanvasElement) {
		this.app = new PIXI.Application({
			backgroundColor: 0x1d171f,
			view: canvas,
		})
		this.view = new Viewport({
			screenWidth: this.app.view.offsetWidth,
			screenHeight: this.app.view.offsetHeight,
			interaction: this.app.renderer.plugins.interaction,
		})
		this.view.plugins.add(
			'wheel-stepped',
			new WheelStepped(this.view, { smooth: 3, steps: zoomLevels }),
			0
		)
		this.view
			.drag({ wheel: false })
			.pinch()
			.decelerate({ friction: 0.8 })
			.clampZoom({
				minScale: zoomLevels[0],
				maxScale: zoomLevels[zoomLevels.length - 1],
			})
		this.view.moveCenter(0, 0)
		this.view.scaled = zoomLevels[3]
		// @ts-ignore
		this.view.sortableChildren = true
		// @ts-ignore
		this.app.stage.addChild(this.view)
		canvas.addEventListener(
			'wheel',
			(event) => {
				event.preventDefault()
				return false
			},
			false
		)

		this.cull = new Cull.SpatialHash()
		this.cull.addContainer(this.view)
		this.app.ticker.add(() => {
			if (this.view.dirty) {
				// @ts-ignore
				this.view.x = Math.round(this.view.x)
				// @ts-ignore
				this.view.y = Math.round(this.view.y)
				this.cull.cull(this.view.getVisibleBounds())
				this.view.dirty = false
			}
		})
	}
}
