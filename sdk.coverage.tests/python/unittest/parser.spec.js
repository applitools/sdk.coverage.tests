'use strict'
const assert = require('assert')
const {checkSettingsParser} = require('../parser')

describe('Check settings parser tests', () => {

    it('Window', () => {
        assert.deepStrictEqual(checkSettingsParser(undefined), `Target.window()`)
    })

    it('Window fully', () => {
        assert.deepStrictEqual(checkSettingsParser({isFully:true}), `Target.window().fully()`)
    })

    it('Region element', () => {
        assert.deepStrictEqual(checkSettingsParser({region:'#name'}), `Target.region("#name")`)
    })

    it('Region rectangle', () => {
        assert.deepStrictEqual(checkSettingsParser({region: {left: 10, top: 20, width: 30, height: 40}}), `Target.region(Region(10, 20, 30, 40))`)
    })

    it('Frames 1', () => {
        assert.deepStrictEqual(checkSettingsParser({frames: ['[name="frame1"]']}), `Target.frame("frame1")`)
    })

    it('Frames 2', () => {
        assert.deepStrictEqual(checkSettingsParser({frames: ['[name="frame1"]', '[name="frame2"]']}), `Target.frame("frame1").frame("frame2")`)
    })

    it('Region in frame', () => {
        assert.deepStrictEqual(checkSettingsParser({frames: ['[name="frame1"]'], region: '#name'}), `Target.frame("frame1").region("#name")`)
    })

    it('Ignore region', () => {
        assert.deepStrictEqual(checkSettingsParser({ignoreRegions: ['#name']}), `Target.window().ignore("#name")`)
    })


})