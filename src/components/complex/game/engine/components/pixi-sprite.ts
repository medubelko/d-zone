import { Component } from 'ape-ecs'
import * as PIXI from 'pixi.js-legacy'

export default class PixiSprite extends Component {
	sprite!: PIXI.Sprite
	static typeName = 'PixiSprite'
	static properties = {
		sprite: null,
	}
}
