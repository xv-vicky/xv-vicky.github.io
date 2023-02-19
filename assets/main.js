! function(t, e, i) {
    "use strict";

    function n(t, e) {
        this.element = t, this.layers = t.getElementsByClassName("layer");
        var i = {
            calibrateX: this.data(this.element, "calibrate-x"),
            calibrateY: this.data(this.element, "calibrate-y"),
            invertX: this.data(this.element, "invert-x"),
            invertY: this.data(this.element, "invert-y"),
            limitX: this.data(this.element, "limit-x"),
            limitY: this.data(this.element, "limit-y"),
            scalarX: this.data(this.element, "scalar-x"),
            scalarY: this.data(this.element, "scalar-y"),
            frictionX: this.data(this.element, "friction-x"),
            frictionY: this.data(this.element, "friction-y"),
            originX: this.data(this.element, "origin-x"),
            originY: this.data(this.element, "origin-y")
        };
        for (var n in i) null === i[n] && delete i[n];
        this.extend(this, r, e, i), this.calibrationTimer = null, this.calibrationFlag = !0, this.enabled = !1, this.depths = [], this.raf = null, this.bounds = null, this.ex = 0, this.ey = 0, this.ew = 0, this.eh = 0, this.ecx = 0, this.ecy = 0, this.erx = 0, this.ery = 0, this.cx = 0, this.cy = 0, this.ix = 0, this.iy = 0, this.mx = 0, this.my = 0, this.vx = 0, this.vy = 0, this.onMouseMove = this.onMouseMove.bind(this), this.onDeviceOrientation = this.onDeviceOrientation.bind(this), this.onOrientationTimer = this.onOrientationTimer.bind(this), this.onCalibrationTimer = this.onCalibrationTimer.bind(this), this.onAnimationFrame = this.onAnimationFrame.bind(this), this.onWindowResize = this.onWindowResize.bind(this), this.initialise()
    }
    var o = "Parallax",
        s = 30,
        r = {
            relativeInput: !1,
            clipRelativeInput: !1,
            calibrationThreshold: 100,
            calibrationDelay: 500,
            supportDelay: 500,
            calibrateX: !1,
            calibrateY: !0,
            invertX: !0,
            invertY: !0,
            limitX: !1,
            limitY: !1,
            scalarX: 10,
            scalarY: 10,
            frictionX: .1,
            frictionY: .1,
            originX: .5,
            originY: .5
        };
    n.prototype.extend = function() {
        if (arguments.length > 1)
            for (var t = arguments[0], e = 1, i = arguments.length; i > e; e++) {
                var n = arguments[e];
                for (var o in n) t[o] = n[o]
            }
    }, n.prototype.data = function(t, e) {
        return this.deserialize(t.getAttribute("data-" + e))
    }, n.prototype.deserialize = function(t) {
        return "true" === t ? !0 : "false" === t ? !1 : "null" === t ? null : !isNaN(parseFloat(t)) && isFinite(t) ? parseFloat(t) : t
    }, n.prototype.camelCase = function(t) {
        return t.replace(/-+(.)?/g, function(t, e) {
            return e ? e.toUpperCase() : ""
        })
    }, n.prototype.transformSupport = function(n) {
        for (var o = e.createElement("div"), s = !1, r = null, a = !1, l = null, h = null, c = 0, p = this.vendors.length; p > c; c++)
            if (null !== this.vendors[c] ? (l = this.vendors[c][0] + "transform", h = this.vendors[c][1] + "Transform") : (l = "transform", h = "transform"), o.style[h] !== i) {
                s = !0;
                break
            }
        switch (n) {
            case "2D":
                a = s;
                break;
            case "3D":
                if (s) {
                    var u = e.body || e.createElement("body"),
                        d = e.documentElement,
                        f = d.style.overflow;
                    e.body || (d.style.overflow = "hidden", d.appendChild(u), u.style.overflow = "hidden", u.style.background = ""), u.appendChild(o), o.style[h] = "translate3d(1px,1px,1px)", r = t.getComputedStyle(o).getPropertyValue(l), a = r !== i && r.length > 0 && "none" !== r, d.style.overflow = f, u.removeChild(o)
                }
        }
        return a
    }, n.prototype.ww = null, n.prototype.wh = null, n.prototype.wcx = null, n.prototype.wcy = null, n.prototype.wrx = null, n.prototype.wry = null, n.prototype.portrait = null, n.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i), n.prototype.vendors = [null, ["-webkit-", "webkit"],
        ["-moz-", "Moz"],
        ["-o-", "O"],
        ["-ms-", "ms"]
    ], n.prototype.motionSupport = !!t.DeviceMotionEvent, n.prototype.orientationSupport = !!t.DeviceOrientationEvent, n.prototype.orientationStatus = 0, n.prototype.transform2DSupport = n.prototype.transformSupport("2D"), n.prototype.transform3DSupport = n.prototype.transformSupport("3D"), n.prototype.propertyCache = {}, n.prototype.initialise = function() {
        this.transform3DSupport && this.accelerate(this.element);
        var e = t.getComputedStyle(this.element);
        "static" === e.getPropertyValue("position") && (this.element.style.position = "relative"), this.updateLayers(), this.updateDimensions(), this.enable(), this.queueCalibration(this.calibrationDelay)
    }, n.prototype.updateLayers = function() {
        this.layers = this.element.getElementsByClassName("layer"), this.depths = [];
        for (var t = 0, e = this.layers.length; e > t; t++) {
            var i = this.layers[t];
            this.transform3DSupport && this.accelerate(i), i.style.position = t ? "absolute" : "relative", i.style.display = "block", i.style.left = 0, i.style.top = 0, this.depths.push(this.data(i, "depth") || 0)
        }
    }, n.prototype.updateDimensions = function() {
        this.ww = t.innerWidth, this.wh = t.innerHeight, this.wcx = this.ww * this.originX, this.wcy = this.wh * this.originY, this.wrx = Math.max(this.wcx, this.ww - this.wcx), this.wry = Math.max(this.wcy, this.wh - this.wcy)
    }, n.prototype.updateBounds = function() {
        this.bounds = this.element.getBoundingClientRect(), this.ex = this.bounds.left, this.ey = this.bounds.top, this.ew = this.bounds.width, this.eh = this.bounds.height, this.ecx = this.ew * this.originX, this.ecy = this.eh * this.originY, this.erx = Math.max(this.ecx, this.ew - this.ecx), this.ery = Math.max(this.ecy, this.eh - this.ecy)
    }, n.prototype.queueCalibration = function(t) {
        clearTimeout(this.calibrationTimer), this.calibrationTimer = setTimeout(this.onCalibrationTimer, t)
    }, n.prototype.enable = function() {
        this.enabled || (this.enabled = !0, this.orientationSupport ? (this.portrait = null, t.addEventListener("deviceorientation", this.onDeviceOrientation), setTimeout(this.onOrientationTimer, this.supportDelay)) : (this.cx = 0, this.cy = 0, this.portrait = !1, t.addEventListener("mousemove", this.onMouseMove)), t.addEventListener("resize", this.onWindowResize), this.raf = requestAnimationFrame(this.onAnimationFrame))
    }, n.prototype.disable = function() {
        this.enabled && (this.enabled = !1, this.orientationSupport ? t.removeEventListener("deviceorientation", this.onDeviceOrientation) : t.removeEventListener("mousemove", this.onMouseMove), t.removeEventListener("resize", this.onWindowResize), cancelAnimationFrame(this.raf))
    }, n.prototype.calibrate = function(t, e) {
        this.calibrateX = t === i ? this.calibrateX : t, this.calibrateY = e === i ? this.calibrateY : e
    }, n.prototype.invert = function(t, e) {
        this.invertX = t === i ? this.invertX : t, this.invertY = e === i ? this.invertY : e
    }, n.prototype.friction = function(t, e) {
        this.frictionX = t === i ? this.frictionX : t, this.frictionY = e === i ? this.frictionY : e
    }, n.prototype.scalar = function(t, e) {
        this.scalarX = t === i ? this.scalarX : t, this.scalarY = e === i ? this.scalarY : e
    }, n.prototype.limit = function(t, e) {
        this.limitX = t === i ? this.limitX : t, this.limitY = e === i ? this.limitY : e
    }, n.prototype.origin = function(t, e) {
        this.originX = t === i ? this.originX : t, this.originY = e === i ? this.originY : e
    }, n.prototype.clamp = function(t, e, i) {
        return t = Math.max(t, e), t = Math.min(t, i)
    }, n.prototype.css = function(t, e, n) {
        var o = this.propertyCache[e];
        if (!o)
            for (var s = 0, r = this.vendors.length; r > s; s++)
                if (o = null !== this.vendors[s] ? this.camelCase(this.vendors[s][1] + "-" + e) : e, t.style[o] !== i) {
                    this.propertyCache[e] = o;
                    break
                }
        t.style[o] = n
    }, n.prototype.accelerate = function(t) {
        this.css(t, "transform", "translate3d(0,0,0)"), this.css(t, "transform-style", "preserve-3d"), this.css(t, "backface-visibility", "hidden")
    }, n.prototype.setPosition = function(t, e, i) {
        e += "px", i += "px", this.transform3DSupport ? this.css(t, "transform", "translate3d(" + e + "," + i + ",0)") : this.transform2DSupport ? this.css(t, "transform", "translate(" + e + "," + i + ")") : (t.style.left = e, t.style.top = i)
    }, n.prototype.onOrientationTimer = function(t) {
        this.orientationSupport && 0 === this.orientationStatus && (this.disable(), this.orientationSupport = !1, this.enable())
    }, n.prototype.onCalibrationTimer = function(t) {
        this.calibrationFlag = !0
    }, n.prototype.onWindowResize = function(t) {
        this.updateDimensions()
    }, n.prototype.onAnimationFrame = function() {
        this.updateBounds();
        var t = this.ix - this.cx,
            e = this.iy - this.cy;
        (Math.abs(t) > this.calibrationThreshold || Math.abs(e) > this.calibrationThreshold) && this.queueCalibration(0), this.portrait ? (this.mx = this.calibrateX ? e : this.iy, this.my = this.calibrateY ? t : this.ix) : (this.mx = this.calibrateX ? t : this.ix, this.my = this.calibrateY ? e : this.iy), this.mx *= this.ew * (this.scalarX / 100), this.my *= this.eh * (this.scalarY / 100), isNaN(parseFloat(this.limitX)) || (this.mx = this.clamp(this.mx, -this.limitX, this.limitX)), isNaN(parseFloat(this.limitY)) || (this.my = this.clamp(this.my, -this.limitY, this.limitY)), this.vx += (this.mx - this.vx) * this.frictionX, this.vy += (this.my - this.vy) * this.frictionY;
        for (var i = 0, n = this.layers.length; n > i; i++) {
            var o = this.layers[i],
                s = this.depths[i],
                r = this.vx * s * (this.invertX ? -1 : 1),
                a = this.vy * s * (this.invertY ? -1 : 1);
            this.setPosition(o, r, a)
        }
        this.raf = requestAnimationFrame(this.onAnimationFrame)
    }, n.prototype.onDeviceOrientation = function(t) {
        if (!this.desktop && null !== t.beta && null !== t.gamma) {
            this.orientationStatus = 1;
            var e = (t.beta || 0) / s,
                i = (t.gamma || 0) / s,
                n = this.wh > this.ww;
            this.portrait !== n && (this.portrait = n, this.calibrationFlag = !0), this.calibrationFlag && (this.calibrationFlag = !1, this.cx = e, this.cy = i), this.ix = e, this.iy = i
        }
    }, n.prototype.onMouseMove = function(t) {
        var e = t.clientX,
            i = t.clientY;
        !this.orientationSupport && this.relativeInput ? (this.clipRelativeInput && (e = Math.max(e, this.ex), e = Math.min(e, this.ex + this.ew), i = Math.max(i, this.ey), i = Math.min(i, this.ey + this.eh)), this.ix = (e - this.ex - this.ecx) / this.erx, this.iy = (i - this.ey - this.ecy) / this.ery) : (this.ix = (e - this.wcx) / this.wrx, this.iy = (i - this.wcy) / this.wry)
    }, t[o] = n
}(window, document),
function() {
    for (var t = 0, e = ["ms", "moz", "webkit", "o"], i = 0; i < e.length && !window.requestAnimationFrame; ++i) window.requestAnimationFrame = window[e[i] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[e[i] + "CancelAnimationFrame"] || window[e[i] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(e, i) {
        var n = (new Date).getTime(),
            o = Math.max(0, 16 - (n - t)),
            s = window.setTimeout(function() {
                e(n + o)
            }, o);
        return t = n + o, s
    }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(t) {
        clearTimeout(t)
    })
}(), ! function(t, e, i) {
    "use strict";

    function n(t, e) {
        this.element = t, this.layers = t.getElementsByClassName("layer");
        var i = {
            calibrateX: this.data(this.element, "calibrate-x"),
            calibrateY: this.data(this.element, "calibrate-y"),
            invertX: this.data(this.element, "invert-x"),
            invertY: this.data(this.element, "invert-y"),
            limitX: this.data(this.element, "limit-x"),
            limitY: this.data(this.element, "limit-y"),
            scalarX: this.data(this.element, "scalar-x"),
            scalarY: this.data(this.element, "scalar-y"),
            frictionX: this.data(this.element, "friction-x"),
            frictionY: this.data(this.element, "friction-y"),
            originX: this.data(this.element, "origin-x"),
            originY: this.data(this.element, "origin-y")
        };
        for (var n in i) null === i[n] && delete i[n];
        this.extend(this, r, e, i), this.calibrationTimer = null, this.calibrationFlag = !0, this.enabled = !1, this.depths = [], this.raf = null, this.bounds = null, this.ex = 0, this.ey = 0, this.ew = 0, this.eh = 0, this.ecx = 0, this.ecy = 0, this.erx = 0, this.ery = 0, this.cx = 0, this.cy = 0, this.ix = 0, this.iy = 0, this.mx = 0, this.my = 0, this.vx = 0, this.vy = 0, this.onMouseMove = this.onMouseMove.bind(this), this.onDeviceOrientation = this.onDeviceOrientation.bind(this), this.onOrientationTimer = this.onOrientationTimer.bind(this), this.onCalibrationTimer = this.onCalibrationTimer.bind(this), this.onAnimationFrame = this.onAnimationFrame.bind(this), this.onWindowResize = this.onWindowResize.bind(this), this.initialise()
    }
    var o = "Parallax",
        s = 30,
        r = {
            relativeInput: !1,
            clipRelativeInput: !1,
            calibrationThreshold: 100,
            calibrationDelay: 500,
            supportDelay: 500,
            calibrateX: !1,
            calibrateY: !0,
            invertX: !0,
            invertY: !0,
            limitX: !1,
            limitY: !1,
            scalarX: 10,
            scalarY: 10,
            frictionX: .1,
            frictionY: .1,
            originX: .5,
            originY: .5
        };
    n.prototype.extend = function() {
        if (arguments.length > 1)
            for (var t = arguments[0], e = 1, i = arguments.length; i > e; e++) {
                var n = arguments[e];
                for (var o in n) t[o] = n[o]
            }
    }, n.prototype.data = function(t, e) {
        return this.deserialize(t.getAttribute("data-" + e))
    }, n.prototype.deserialize = function(t) {
        return "true" === t ? !0 : "false" === t ? !1 : "null" === t ? null : !isNaN(parseFloat(t)) && isFinite(t) ? parseFloat(t) : t
    }, n.prototype.camelCase = function(t) {
        return t.replace(/-+(.)?/g, function(t, e) {
            return e ? e.toUpperCase() : ""
        })
    }, n.prototype.transformSupport = function(n) {
        for (var o = e.createElement("div"), s = !1, r = null, a = !1, l = null, h = null, c = 0, p = this.vendors.length; p > c; c++)
            if (null !== this.vendors[c] ? (l = this.vendors[c][0] + "transform", h = this.vendors[c][1] + "Transform") : (l = "transform", h = "transform"), o.style[h] !== i) {
                s = !0;
                break
            }
        switch (n) {
            case "2D":
                a = s;
                break;
            case "3D":
                if (s) {
                    var u = e.body || e.createElement("body"),
                        d = e.documentElement,
                        f = d.style.overflow;
                    e.body || (d.style.overflow = "hidden", d.appendChild(u), u.style.overflow = "hidden", u.style.background = ""), u.appendChild(o), o.style[h] = "translate3d(1px,1px,1px)", r = t.getComputedStyle(o).getPropertyValue(l), a = r !== i && r.length > 0 && "none" !== r, d.style.overflow = f, u.removeChild(o)
                }
        }
        return a
    }, n.prototype.ww = null, n.prototype.wh = null, n.prototype.wcx = null, n.prototype.wcy = null, n.prototype.wrx = null, n.prototype.wry = null, n.prototype.portrait = null, n.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i), n.prototype.vendors = [null, ["-webkit-", "webkit"],
        ["-moz-", "Moz"],
        ["-o-", "O"],
        ["-ms-", "ms"]
    ], n.prototype.motionSupport = !!t.DeviceMotionEvent, n.prototype.orientationSupport = !!t.DeviceOrientationEvent, n.prototype.orientationStatus = 0, n.prototype.transform2DSupport = n.prototype.transformSupport("2D"), n.prototype.transform3DSupport = n.prototype.transformSupport("3D"), n.prototype.propertyCache = {}, n.prototype.initialise = function() {
        this.transform3DSupport && this.accelerate(this.element);
        var e = t.getComputedStyle(this.element);
        "static" === e.getPropertyValue("position") && (this.element.style.position = "relative"), this.updateLayers(), this.updateDimensions(), this.enable(), this.queueCalibration(this.calibrationDelay)
    }, n.prototype.updateLayers = function() {
        this.layers = this.element.getElementsByClassName("layer"), this.depths = [];
        for (var t = 0, e = this.layers.length; e > t; t++) {
            var i = this.layers[t];
            this.transform3DSupport && this.accelerate(i), i.style.position = t ? "absolute" : "relative", i.style.display = "block", i.style.left = 0, i.style.top = 0, this.depths.push(this.data(i, "depth") || 0)
        }
    }, n.prototype.updateDimensions = function() {
        this.ww = t.innerWidth, this.wh = t.innerHeight, this.wcx = this.ww * this.originX, this.wcy = this.wh * this.originY, this.wrx = Math.max(this.wcx, this.ww - this.wcx), this.wry = Math.max(this.wcy, this.wh - this.wcy)
    }, n.prototype.updateBounds = function() {
        this.bounds = this.element.getBoundingClientRect(), this.ex = this.bounds.left, this.ey = this.bounds.top, this.ew = this.bounds.width, this.eh = this.bounds.height, this.ecx = this.ew * this.originX, this.ecy = this.eh * this.originY, this.erx = Math.max(this.ecx, this.ew - this.ecx), this.ery = Math.max(this.ecy, this.eh - this.ecy)
    }, n.prototype.queueCalibration = function(t) {
        clearTimeout(this.calibrationTimer), this.calibrationTimer = setTimeout(this.onCalibrationTimer, t)
    }, n.prototype.enable = function() {
        this.enabled || (this.enabled = !0, this.orientationSupport ? (this.portrait = null, t.addEventListener("deviceorientation", this.onDeviceOrientation), setTimeout(this.onOrientationTimer, this.supportDelay)) : (this.cx = 0, this.cy = 0, this.portrait = !1, t.addEventListener("mousemove", this.onMouseMove)), t.addEventListener("resize", this.onWindowResize), this.raf = requestAnimationFrame(this.onAnimationFrame))
    }, n.prototype.disable = function() {
        this.enabled && (this.enabled = !1, this.orientationSupport ? t.removeEventListener("deviceorientation", this.onDeviceOrientation) : t.removeEventListener("mousemove", this.onMouseMove), t.removeEventListener("resize", this.onWindowResize), cancelAnimationFrame(this.raf))
    }, n.prototype.calibrate = function(t, e) {
        this.calibrateX = t === i ? this.calibrateX : t, this.calibrateY = e === i ? this.calibrateY : e
    }, n.prototype.invert = function(t, e) {
        this.invertX = t === i ? this.invertX : t, this.invertY = e === i ? this.invertY : e
    }, n.prototype.friction = function(t, e) {
        this.frictionX = t === i ? this.frictionX : t, this.frictionY = e === i ? this.frictionY : e
    }, n.prototype.scalar = function(t, e) {
        this.scalarX = t === i ? this.scalarX : t, this.scalarY = e === i ? this.scalarY : e
    }, n.prototype.limit = function(t, e) {
        this.limitX = t === i ? this.limitX : t, this.limitY = e === i ? this.limitY : e
    }, n.prototype.origin = function(t, e) {
        this.originX = t === i ? this.originX : t, this.originY = e === i ? this.originY : e
    }, n.prototype.clamp = function(t, e, i) {
        return t = Math.max(t, e), t = Math.min(t, i)
    }, n.prototype.css = function(t, e, n) {
        var o = this.propertyCache[e];
        if (!o)
            for (var s = 0, r = this.vendors.length; r > s; s++)
                if (o = null !== this.vendors[s] ? this.camelCase(this.vendors[s][1] + "-" + e) : e, t.style[o] !== i) {
                    this.propertyCache[e] = o;
                    break
                }
        t.style[o] = n
    }, n.prototype.accelerate = function(t) {
        this.css(t, "transform", "translate3d(0,0,0)"), this.css(t, "transform-style", "preserve-3d"), this.css(t, "backface-visibility", "hidden")
    }, n.prototype.setPosition = function(t, e, i) {
        e += "px", i += "px", this.transform3DSupport ? this.css(t, "transform", "translate3d(" + e + "," + i + ",0)") : this.transform2DSupport ? this.css(t, "transform", "translate(" + e + "," + i + ")") : (t.style.left = e, t.style.top = i)
    }, n.prototype.onOrientationTimer = function() {
        this.orientationSupport && 0 === this.orientationStatus && (this.disable(), this.orientationSupport = !1, this.enable())
    }, n.prototype.onCalibrationTimer = function() {
        this.calibrationFlag = !0
    }, n.prototype.onWindowResize = function() {
        this.updateDimensions()
    }, n.prototype.onAnimationFrame = function() {
        this.updateBounds();
        var t = this.ix - this.cx,
            e = this.iy - this.cy;
        (Math.abs(t) > this.calibrationThreshold || Math.abs(e) > this.calibrationThreshold) && this.queueCalibration(0), this.portrait ? (this.mx = this.calibrateX ? e : this.iy, this.my = this.calibrateY ? t : this.ix) : (this.mx = this.calibrateX ? t : this.ix, this.my = this.calibrateY ? e : this.iy), this.mx *= this.ew * (this.scalarX / 100), this.my *= this.eh * (this.scalarY / 100), isNaN(parseFloat(this.limitX)) || (this.mx = this.clamp(this.mx, -this.limitX, this.limitX)), isNaN(parseFloat(this.limitY)) || (this.my = this.clamp(this.my, -this.limitY, this.limitY)), this.vx += (this.mx - this.vx) * this.frictionX, this.vy += (this.my - this.vy) * this.frictionY;
        for (var i = 0, n = this.layers.length; n > i; i++) {
            var o = this.layers[i],
                s = this.depths[i],
                r = this.vx * s * (this.invertX ? -1 : 1),
                a = this.vy * s * (this.invertY ? -1 : 1);
            this.setPosition(o, r, a)
        }
        this.raf = requestAnimationFrame(this.onAnimationFrame)
    }, n.prototype.onDeviceOrientation = function(t) {
        if (!this.desktop && null !== t.beta && null !== t.gamma) {
            this.orientationStatus = 1;
            var e = (t.beta || 0) / s,
                i = (t.gamma || 0) / s,
                n = this.wh > this.ww;
            this.portrait !== n && (this.portrait = n, this.calibrationFlag = !0), this.calibrationFlag && (this.calibrationFlag = !1, this.cx = e, this.cy = i), this.ix = e, this.iy = i
        }
    }, n.prototype.onMouseMove = function(t) {
        var e = t.clientX,
            i = t.clientY;
        !this.orientationSupport && this.relativeInput ? (this.clipRelativeInput && (e = Math.max(e, this.ex), e = Math.min(e, this.ex + this.ew), i = Math.max(i, this.ey), i = Math.min(i, this.ey + this.eh)), this.ix = (e - this.ex - this.ecx) / this.erx, this.iy = (i - this.ey - this.ecy) / this.ery) : (this.ix = (e - this.wcx) / this.wrx, this.iy = (i - this.wcy) / this.wry)
    }, t[o] = n
}(window, document),
function() {
    for (var t = 0, e = ["ms", "moz", "webkit", "o"], i = 0; i < e.length && !window.requestAnimationFrame; ++i) window.requestAnimationFrame = window[e[i] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[e[i] + "CancelAnimationFrame"] || window[e[i] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(e) {
        var i = (new Date).getTime(),
            n = Math.max(0, 16 - (i - t)),
            o = window.setTimeout(function() {
                e(i + n)
            }, n);
        return t = i + n, o
    }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(t) {
        clearTimeout(t)
    })
}(),
function(t, e, i, n) {
    "use strict";

    function o(e, i) {
        this.element = e, this.$context = t(e).data("api", this), this.$layers = this.$context.find(".layer");
        var n = {
            calibrateX: this.$context.data("calibrate-x") || null,
            calibrateY: this.$context.data("calibrate-y") || null,
            invertX: this.$context.data("invert-x") || null,
            invertY: this.$context.data("invert-y") || null,
            limitX: parseFloat(this.$context.data("limit-x")) || null,
            limitY: parseFloat(this.$context.data("limit-y")) || null,
            scalarX: parseFloat(this.$context.data("scalar-x")) || null,
            scalarY: parseFloat(this.$context.data("scalar-y")) || null,
            frictionX: parseFloat(this.$context.data("friction-x")) || null,
            frictionY: parseFloat(this.$context.data("friction-y")) || null,
            originX: parseFloat(this.$context.data("origin-x")) || null,
            originY: parseFloat(this.$context.data("origin-y")) || null
        };
        for (var o in n) null === n[o] && delete n[o];
        t.extend(this, a, i, n), this.calibrationTimer = null, this.calibrationFlag = !0, this.enabled = !1, this.depths = [], this.raf = null, this.bounds = null, this.ex = 0, this.ey = 0, this.ew = 0, this.eh = 0, this.ecx = 0, this.ecy = 0, this.erx = 0, this.ery = 0, this.cx = 0, this.cy = 0, this.ix = 0, this.iy = 0, this.mx = 0, this.my = 0, this.vx = 0, this.vy = 0, this.onMouseMove = this.onMouseMove.bind(this), this.onDeviceOrientation = this.onDeviceOrientation.bind(this), this.onOrientationTimer = this.onOrientationTimer.bind(this), this.onCalibrationTimer = this.onCalibrationTimer.bind(this), this.onAnimationFrame = this.onAnimationFrame.bind(this), this.onWindowResize = this.onWindowResize.bind(this), this.initialise()
    }
    var s = "parallax",
        r = 30,
        a = {
            relativeInput: !1,
            clipRelativeInput: !1,
            calibrationThreshold: 100,
            calibrationDelay: 500,
            supportDelay: 500,
            calibrateX: !1,
            calibrateY: !0,
            invertX: !0,
            invertY: !0,
            limitX: !1,
            limitY: !1,
            scalarX: 10,
            scalarY: 10,
            frictionX: .1,
            frictionY: .1,
            originX: .5,
            originY: .5
        };
    o.prototype.transformSupport = function(t) {
        for (var o = i.createElement("div"), s = !1, r = null, a = !1, l = null, h = null, c = 0, p = this.vendors.length; p > c; c++)
            if (null !== this.vendors[c] ? (l = this.vendors[c][0] + "transform", h = this.vendors[c][1] + "Transform") : (l = "transform", h = "transform"), o.style[h] !== n) {
                s = !0;
                break
            }
        switch (t) {
            case "2D":
                a = s;
                break;
            case "3D":
                if (s) {
                    var u = i.body || i.createElement("body"),
                        d = i.documentElement,
                        f = d.style.overflow;
                    i.body || (d.style.overflow = "hidden", d.appendChild(u), u.style.overflow = "hidden", u.style.background = ""), u.appendChild(o), o.style[h] = "translate3d(1px,1px,1px)", r = e.getComputedStyle(o).getPropertyValue(l), a = r !== n && r.length > 0 && "none" !== r, d.style.overflow = f, u.removeChild(o)
                }
        }
        return a
    }, o.prototype.ww = null, o.prototype.wh = null, o.prototype.wcx = null, o.prototype.wcy = null, o.prototype.wrx = null, o.prototype.wry = null, o.prototype.portrait = null, o.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i), o.prototype.vendors = [null, ["-webkit-", "webkit"],
        ["-moz-", "Moz"],
        ["-o-", "O"],
        ["-ms-", "ms"]
    ], o.prototype.motionSupport = !!e.DeviceMotionEvent, o.prototype.orientationSupport = !!e.DeviceOrientationEvent, o.prototype.orientationStatus = 0, o.prototype.transform2DSupport = o.prototype.transformSupport("2D"), o.prototype.transform3DSupport = o.prototype.transformSupport("3D"), o.prototype.propertyCache = {}, o.prototype.initialise = function() {
        "static" === this.$context.css("position") && this.$context.css({
            position: "relative"
        }), this.accelerate(this.$context), this.updateLayers(), this.updateDimensions(), this.enable(), this.queueCalibration(this.calibrationDelay)
    }, o.prototype.updateLayers = function() {
        this.$layers = this.$context.find(".layer"), this.depths = [], this.$layers.css({
            position: "absolute",
            display: "block",
            left: 0,
            top: 0
        }), this.$layers.first().css({
            position: "relative"
        }), this.accelerate(this.$layers), this.$layers.each(t.proxy(function(e, i) {
            this.depths.push(t(i).data("depth") || 0)
        }, this))
    }, o.prototype.updateDimensions = function() {
        this.ww = e.innerWidth, this.wh = e.innerHeight, this.wcx = this.ww * this.originX, this.wcy = this.wh * this.originY, this.wrx = Math.max(this.wcx, this.ww - this.wcx), this.wry = Math.max(this.wcy, this.wh - this.wcy)
    }, o.prototype.updateBounds = function() {
        this.bounds = this.element.getBoundingClientRect(), this.ex = this.bounds.left, this.ey = this.bounds.top, this.ew = this.bounds.width, this.eh = this.bounds.height, this.ecx = this.ew * this.originX, this.ecy = this.eh * this.originY, this.erx = Math.max(this.ecx, this.ew - this.ecx), this.ery = Math.max(this.ecy, this.eh - this.ecy)
    }, o.prototype.queueCalibration = function(t) {
        clearTimeout(this.calibrationTimer), this.calibrationTimer = setTimeout(this.onCalibrationTimer, t)
    }, o.prototype.enable = function() {
        this.enabled || (this.enabled = !0, this.orientationSupport ? (this.portrait = null, e.addEventListener("deviceorientation", this.onDeviceOrientation), setTimeout(this.onOrientationTimer, this.supportDelay)) : (this.cx = 0, this.cy = 0, this.portrait = !1, e.addEventListener("mousemove", this.onMouseMove)), e.addEventListener("resize", this.onWindowResize), this.raf = requestAnimationFrame(this.onAnimationFrame))
    }, o.prototype.disable = function() {
        this.enabled && (this.enabled = !1, this.orientationSupport ? e.removeEventListener("deviceorientation", this.onDeviceOrientation) : e.removeEventListener("mousemove", this.onMouseMove), e.removeEventListener("resize", this.onWindowResize), cancelAnimationFrame(this.raf))
    }, o.prototype.calibrate = function(t, e) {
        this.calibrateX = t === n ? this.calibrateX : t, this.calibrateY = e === n ? this.calibrateY : e
    }, o.prototype.invert = function(t, e) {
        this.invertX = t === n ? this.invertX : t, this.invertY = e === n ? this.invertY : e
    }, o.prototype.friction = function(t, e) {
        this.frictionX = t === n ? this.frictionX : t, this.frictionY = e === n ? this.frictionY : e
    }, o.prototype.scalar = function(t, e) {
        this.scalarX = t === n ? this.scalarX : t, this.scalarY = e === n ? this.scalarY : e
    }, o.prototype.limit = function(t, e) {
        this.limitX = t === n ? this.limitX : t, this.limitY = e === n ? this.limitY : e
    }, o.prototype.origin = function(t, e) {
        this.originX = t === n ? this.originX : t, this.originY = e === n ? this.originY : e
    }, o.prototype.clamp = function(t, e, i) {
        return t = Math.max(t, e), t = Math.min(t, i)
    }, o.prototype.css = function(e, i, o) {
        var s = this.propertyCache[i];
        if (!s)
            for (var r = 0, a = this.vendors.length; a > r; r++)
                if (s = null !== this.vendors[r] ? t.camelCase(this.vendors[r][1] + "-" + i) : i, e.style[s] !== n) {
                    this.propertyCache[i] = s;
                    break
                }
        e.style[s] = o
    }, o.prototype.accelerate = function(t) {
        for (var e = 0, i = t.length; i > e; e++) {
            var n = t[e];
            this.css(n, "transform", "translate3d(0,0,0)"), this.css(n, "transform-style", "preserve-3d"), this.css(n, "backface-visibility", "hidden")
        }
    }, o.prototype.setPosition = function(t, e, i) {
        e += "px", i += "px", this.transform3DSupport ? this.css(t, "transform", "translate3d(" + e + "," + i + ",0)") : this.transform2DSupport ? this.css(t, "transform", "translate(" + e + "," + i + ")") : (t.style.left = e, t.style.top = i)
    }, o.prototype.onOrientationTimer = function(t) {
        this.orientationSupport && 0 === this.orientationStatus && (this.disable(), this.orientationSupport = !1, this.enable())
    }, o.prototype.onCalibrationTimer = function(t) {
        this.calibrationFlag = !0
    }, o.prototype.onWindowResize = function(t) {
        this.updateDimensions()
    }, o.prototype.onAnimationFrame = function() {
        this.updateBounds();
        var t = this.ix - this.cx,
            e = this.iy - this.cy;
        (Math.abs(t) > this.calibrationThreshold || Math.abs(e) > this.calibrationThreshold) && this.queueCalibration(0), this.portrait ? (this.mx = this.calibrateX ? e : this.iy, this.my = this.calibrateY ? t : this.ix) : (this.mx = this.calibrateX ? t : this.ix, this.my = this.calibrateY ? e : this.iy), this.mx *= this.ew * (this.scalarX / 100), this.my *= this.eh * (this.scalarY / 100), isNaN(parseFloat(this.limitX)) || (this.mx = this.clamp(this.mx, -this.limitX, this.limitX)), isNaN(parseFloat(this.limitY)) || (this.my = this.clamp(this.my, -this.limitY, this.limitY)), this.vx += (this.mx - this.vx) * this.frictionX, this.vy += (this.my - this.vy) * this.frictionY;
        for (var i = 0, n = this.$layers.length; n > i; i++) {
            var o = this.depths[i],
                s = this.$layers[i],
                r = this.vx * o * (this.invertX ? -1 : 1),
                a = this.vy * o * (this.invertY ? -1 : 1);
            this.setPosition(s, r, a)
        }
        this.raf = requestAnimationFrame(this.onAnimationFrame)
    }, o.prototype.onDeviceOrientation = function(t) {
        if (!this.desktop && null !== t.beta && null !== t.gamma) {
            this.orientationStatus = 1;
            var i = (t.beta || 0) / r,
                n = (t.gamma || 0) / r,
                o = e.innerHeight > e.innerWidth;
            this.portrait !== o && (this.portrait = o, this.calibrationFlag = !0), this.calibrationFlag && (this.calibrationFlag = !1, this.cx = i, this.cy = n), this.ix = i, this.iy = n
        }
    }, o.prototype.onMouseMove = function(t) {
        var e = t.clientX,
            i = t.clientY;
        !this.orientationSupport && this.relativeInput ? (this.clipRelativeInput && (e = Math.max(e, this.ex), e = Math.min(e, this.ex + this.ew), i = Math.max(i, this.ey), i = Math.min(i, this.ey + this.eh)), this.ix = (e - this.ex - this.ecx) / this.erx, this.iy = (i - this.ey - this.ecy) / this.ery) : (this.ix = (e - this.wcx) / this.wrx, this.iy = (i - this.wcy) / this.wry)
    };
    var l = {
        enable: o.prototype.enable,
        disable: o.prototype.disable,
        updateLayers: o.prototype.updateLayers,
        calibrate: o.prototype.calibrate,
        friction: o.prototype.friction,
        invert: o.prototype.invert,
        scalar: o.prototype.scalar,
        limit: o.prototype.limit,
        origin: o.prototype.origin
    };
    t.fn[s] = function(e) {
        var i = arguments;
        return this.each(function() {
            var n = t(this),
                r = n.data(s);
            r || (r = new o(this, e), n.data(s, r)), l[e] && r[e].apply(r, Array.prototype.slice.call(i, 1))
        })
    }
}(window.jQuery || window.Zepto, window, document),
function() {
    for (var t = 0, e = ["ms", "moz", "webkit", "o"], i = 0; i < e.length && !window.requestAnimationFrame; ++i) window.requestAnimationFrame = window[e[i] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[e[i] + "CancelAnimationFrame"] || window[e[i] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(e, i) {
        var n = (new Date).getTime(),
            o = Math.max(0, 16 - (n - t)),
            s = window.setTimeout(function() {
                e(n + o)
            }, o);
        return t = n + o, s
    }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(t) {
        clearTimeout(t)
    })
}(), ! function(t, e, i, n) {
    "use strict";

    function o(e, i) {
        this.element = e, this.$context = t(e).data("api", this), this.$layers = this.$context.find(".layer");
        var n = {
            calibrateX: this.$context.data("calibrate-x") || null,
            calibrateY: this.$context.data("calibrate-y") || null,
            invertX: this.$context.data("invert-x") || null,
            invertY: this.$context.data("invert-y") || null,
            limitX: parseFloat(this.$context.data("limit-x")) || null,
            limitY: parseFloat(this.$context.data("limit-y")) || null,
            scalarX: parseFloat(this.$context.data("scalar-x")) || null,
            scalarY: parseFloat(this.$context.data("scalar-y")) || null,
            frictionX: parseFloat(this.$context.data("friction-x")) || null,
            frictionY: parseFloat(this.$context.data("friction-y")) || null,
            originX: parseFloat(this.$context.data("origin-x")) || null,
            originY: parseFloat(this.$context.data("origin-y")) || null
        };
        for (var o in n) null === n[o] && delete n[o];
        t.extend(this, a, i, n), this.calibrationTimer = null, this.calibrationFlag = !0, this.enabled = !1, this.depths = [], this.raf = null, this.bounds = null, this.ex = 0, this.ey = 0, this.ew = 0, this.eh = 0, this.ecx = 0, this.ecy = 0, this.erx = 0, this.ery = 0, this.cx = 0, this.cy = 0, this.ix = 0, this.iy = 0, this.mx = 0, this.my = 0, this.vx = 0, this.vy = 0, this.onMouseMove = this.onMouseMove.bind(this), this.onDeviceOrientation = this.onDeviceOrientation.bind(this), this.onOrientationTimer = this.onOrientationTimer.bind(this), this.onCalibrationTimer = this.onCalibrationTimer.bind(this), this.onAnimationFrame = this.onAnimationFrame.bind(this), this.onWindowResize = this.onWindowResize.bind(this), this.initialise()
    }
    var s = "parallax",
        r = 30,
        a = {
            relativeInput: !1,
            clipRelativeInput: !1,
            calibrationThreshold: 100,
            calibrationDelay: 500,
            supportDelay: 500,
            calibrateX: !1,
            calibrateY: !0,
            invertX: !0,
            invertY: !0,
            limitX: !1,
            limitY: !1,
            scalarX: 10,
            scalarY: 10,
            frictionX: .1,
            frictionY: .1,
            originX: .5,
            originY: .5
        };
    o.prototype.transformSupport = function(t) {
        for (var o = i.createElement("div"), s = !1, r = null, a = !1, l = null, h = null, c = 0, p = this.vendors.length; p > c; c++)
            if (null !== this.vendors[c] ? (l = this.vendors[c][0] + "transform", h = this.vendors[c][1] + "Transform") : (l = "transform", h = "transform"), o.style[h] !== n) {
                s = !0;
                break
            }
        switch (t) {
            case "2D":
                a = s;
                break;
            case "3D":
                if (s) {
                    var u = i.body || i.createElement("body"),
                        d = i.documentElement,
                        f = d.style.overflow;
                    i.body || (d.style.overflow = "hidden", d.appendChild(u), u.style.overflow = "hidden", u.style.background = ""), u.appendChild(o), o.style[h] = "translate3d(1px,1px,1px)", r = e.getComputedStyle(o).getPropertyValue(l), a = r !== n && r.length > 0 && "none" !== r, d.style.overflow = f, u.removeChild(o)
                }
        }
        return a
    }, o.prototype.ww = null, o.prototype.wh = null, o.prototype.wcx = null, o.prototype.wcy = null, o.prototype.wrx = null, o.prototype.wry = null, o.prototype.portrait = null, o.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i), o.prototype.vendors = [null, ["-webkit-", "webkit"],
        ["-moz-", "Moz"],
        ["-o-", "O"],
        ["-ms-", "ms"]
    ], o.prototype.motionSupport = !!e.DeviceMotionEvent, o.prototype.orientationSupport = !!e.DeviceOrientationEvent, o.prototype.orientationStatus = 0, o.prototype.transform2DSupport = o.prototype.transformSupport("2D"), o.prototype.transform3DSupport = o.prototype.transformSupport("3D"), o.prototype.propertyCache = {}, o.prototype.initialise = function() {
        "static" === this.$context.css("position") && this.$context.css({
            position: "relative"
        }), this.accelerate(this.$context), this.updateLayers(), this.updateDimensions(), this.enable(), this.queueCalibration(this.calibrationDelay)
    }, o.prototype.updateLayers = function() {
        this.$layers = this.$context.find(".layer"), this.depths = [], this.$layers.css({
            position: "absolute",
            display: "block",
            left: 0,
            top: 0
        }), this.$layers.first().css({
            position: "relative"
        }), this.accelerate(this.$layers), this.$layers.each(t.proxy(function(e, i) {
            this.depths.push(t(i).data("depth") || 0)
        }, this))
    }, o.prototype.updateDimensions = function() {
        this.ww = e.innerWidth, this.wh = e.innerHeight, this.wcx = this.ww * this.originX, this.wcy = this.wh * this.originY, this.wrx = Math.max(this.wcx, this.ww - this.wcx),
            this.wry = Math.max(this.wcy, this.wh - this.wcy)
    }, o.prototype.updateBounds = function() {
        this.bounds = this.element.getBoundingClientRect(), this.ex = this.bounds.left, this.ey = this.bounds.top, this.ew = this.bounds.width, this.eh = this.bounds.height, this.ecx = this.ew * this.originX, this.ecy = this.eh * this.originY, this.erx = Math.max(this.ecx, this.ew - this.ecx), this.ery = Math.max(this.ecy, this.eh - this.ecy)
    }, o.prototype.queueCalibration = function(t) {
        clearTimeout(this.calibrationTimer), this.calibrationTimer = setTimeout(this.onCalibrationTimer, t)
    }, o.prototype.enable = function() {
        this.enabled || (this.enabled = !0, this.orientationSupport ? (this.portrait = null, e.addEventListener("deviceorientation", this.onDeviceOrientation), setTimeout(this.onOrientationTimer, this.supportDelay)) : (this.cx = 0, this.cy = 0, this.portrait = !1, e.addEventListener("mousemove", this.onMouseMove)), e.addEventListener("resize", this.onWindowResize), this.raf = requestAnimationFrame(this.onAnimationFrame))
    }, o.prototype.disable = function() {
        this.enabled && (this.enabled = !1, this.orientationSupport ? e.removeEventListener("deviceorientation", this.onDeviceOrientation) : e.removeEventListener("mousemove", this.onMouseMove), e.removeEventListener("resize", this.onWindowResize), cancelAnimationFrame(this.raf))
    }, o.prototype.calibrate = function(t, e) {
        this.calibrateX = t === n ? this.calibrateX : t, this.calibrateY = e === n ? this.calibrateY : e
    }, o.prototype.invert = function(t, e) {
        this.invertX = t === n ? this.invertX : t, this.invertY = e === n ? this.invertY : e
    }, o.prototype.friction = function(t, e) {
        this.frictionX = t === n ? this.frictionX : t, this.frictionY = e === n ? this.frictionY : e
    }, o.prototype.scalar = function(t, e) {
        this.scalarX = t === n ? this.scalarX : t, this.scalarY = e === n ? this.scalarY : e
    }, o.prototype.limit = function(t, e) {
        this.limitX = t === n ? this.limitX : t, this.limitY = e === n ? this.limitY : e
    }, o.prototype.origin = function(t, e) {
        this.originX = t === n ? this.originX : t, this.originY = e === n ? this.originY : e
    }, o.prototype.clamp = function(t, e, i) {
        return t = Math.max(t, e), t = Math.min(t, i)
    }, o.prototype.css = function(e, i, o) {
        var s = this.propertyCache[i];
        if (!s)
            for (var r = 0, a = this.vendors.length; a > r; r++)
                if (s = null !== this.vendors[r] ? t.camelCase(this.vendors[r][1] + "-" + i) : i, e.style[s] !== n) {
                    this.propertyCache[i] = s;
                    break
                }
        e.style[s] = o
    }, o.prototype.accelerate = function(t) {
        for (var e = 0, i = t.length; i > e; e++) {
            var n = t[e];
            this.css(n, "transform", "translate3d(0,0,0)"), this.css(n, "transform-style", "preserve-3d"), this.css(n, "backface-visibility", "hidden")
        }
    }, o.prototype.setPosition = function(t, e, i) {
        e += "px", i += "px", this.transform3DSupport ? this.css(t, "transform", "translate3d(" + e + "," + i + ",0)") : this.transform2DSupport ? this.css(t, "transform", "translate(" + e + "," + i + ")") : (t.style.left = e, t.style.top = i)
    }, o.prototype.onOrientationTimer = function() {
        this.orientationSupport && 0 === this.orientationStatus && (this.disable(), this.orientationSupport = !1, this.enable())
    }, o.prototype.onCalibrationTimer = function() {
        this.calibrationFlag = !0
    }, o.prototype.onWindowResize = function() {
        this.updateDimensions()
    }, o.prototype.onAnimationFrame = function() {
        this.updateBounds();
        var t = this.ix - this.cx,
            e = this.iy - this.cy;
        (Math.abs(t) > this.calibrationThreshold || Math.abs(e) > this.calibrationThreshold) && this.queueCalibration(0), this.portrait ? (this.mx = this.calibrateX ? e : this.iy, this.my = this.calibrateY ? t : this.ix) : (this.mx = this.calibrateX ? t : this.ix, this.my = this.calibrateY ? e : this.iy), this.mx *= this.ew * (this.scalarX / 100), this.my *= this.eh * (this.scalarY / 100), isNaN(parseFloat(this.limitX)) || (this.mx = this.clamp(this.mx, -this.limitX, this.limitX)), isNaN(parseFloat(this.limitY)) || (this.my = this.clamp(this.my, -this.limitY, this.limitY)), this.vx += (this.mx - this.vx) * this.frictionX, this.vy += (this.my - this.vy) * this.frictionY;
        for (var i = 0, n = this.$layers.length; n > i; i++) {
            var o = this.depths[i],
                s = this.$layers[i],
                r = this.vx * o * (this.invertX ? -1 : 1),
                a = this.vy * o * (this.invertY ? -1 : 1);
            this.setPosition(s, r, a)
        }
        this.raf = requestAnimationFrame(this.onAnimationFrame)
    }, o.prototype.onDeviceOrientation = function(t) {
        if (!this.desktop && null !== t.beta && null !== t.gamma) {
            this.orientationStatus = 1;
            var i = (t.beta || 0) / r,
                n = (t.gamma || 0) / r,
                o = e.innerHeight > e.innerWidth;
            this.portrait !== o && (this.portrait = o, this.calibrationFlag = !0), this.calibrationFlag && (this.calibrationFlag = !1, this.cx = i, this.cy = n), this.ix = i, this.iy = n
        }
    }, o.prototype.onMouseMove = function(t) {
        var e = t.clientX,
            i = t.clientY;
        !this.orientationSupport && this.relativeInput ? (this.clipRelativeInput && (e = Math.max(e, this.ex), e = Math.min(e, this.ex + this.ew), i = Math.max(i, this.ey), i = Math.min(i, this.ey + this.eh)), this.ix = (e - this.ex - this.ecx) / this.erx, this.iy = (i - this.ey - this.ecy) / this.ery) : (this.ix = (e - this.wcx) / this.wrx, this.iy = (i - this.wcy) / this.wry)
    };
    var l = {
        enable: o.prototype.enable,
        disable: o.prototype.disable,
        updateLayers: o.prototype.updateLayers,
        calibrate: o.prototype.calibrate,
        friction: o.prototype.friction,
        invert: o.prototype.invert,
        scalar: o.prototype.scalar,
        limit: o.prototype.limit,
        origin: o.prototype.origin
    };
    t.fn[s] = function(e) {
        var i = arguments;
        return this.each(function() {
            var n = t(this),
                r = n.data(s);
            r || (r = new o(this, e), n.data(s, r)), l[e] && r[e].apply(r, Array.prototype.slice.call(i, 1))
        })
    }
}(window.jQuery || window.Zepto, window, document),
function() {
    for (var t = 0, e = ["ms", "moz", "webkit", "o"], i = 0; i < e.length && !window.requestAnimationFrame; ++i) window.requestAnimationFrame = window[e[i] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[e[i] + "CancelAnimationFrame"] || window[e[i] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(e) {
        var i = (new Date).getTime(),
            n = Math.max(0, 16 - (i - t)),
            o = window.setTimeout(function() {
                e(i + n)
            }, n);
        return t = i + n, o
    }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(t) {
        clearTimeout(t)
    })
}(),
function(t, e, i) {
    "use strict";

    function n(i) {
        if (o = e.documentElement, s = e.body, H(), at = this, i = i || {}, ut = i.constants || {}, i.easing)
            for (var n in i.easing) V[n] = i.easing[n];
        wt = i.edgeStrategy || "set", ct = {
            beforerender: i.beforerender,
            render: i.render,
            keyframe: i.keyframe
        }, pt = i.forceHeight !== !1, pt && (Mt = i.scale || 1), dt = i.mobileDeceleration || k, mt = i.smoothScrolling !== !1, yt = i.smoothScrollingDuration || E, gt = {
            targetTop: at.getScrollTop()
        }, Bt = (i.mobileCheck || function() {
            return /Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent || navigator.vendor || t.opera)
        })(), Bt ? (ht = e.getElementById(i.skrollrBody || C), ht && rt(), Q(), Dt(o, [v, x], [w])) : Dt(o, [v, b], [w]), at.refresh(), Tt(t, "resize orientationchange", function() {
            var t = o.clientWidth,
                e = o.clientHeight;
            e === zt && t === _t || (zt = e, _t = t, qt = !0)
        });
        var r = j();
        return function a() {
            Z(), xt = r(a)
        }(), at
    }
    var o, s, r = {
            get: function() {
                return at
            },
            init: function(t) {
                return at || new n(t)
            },
            VERSION: "0.6.29"
        },
        a = Object.prototype.hasOwnProperty,
        l = t.Math,
        h = t.getComputedStyle,
        c = "touchstart",
        p = "touchmove",
        u = "touchcancel",
        d = "touchend",
        f = "skrollable",
        m = f + "-before",
        y = f + "-between",
        g = f + "-after",
        v = "skrollr",
        w = "no-" + v,
        b = v + "-desktop",
        x = v + "-mobile",
        T = "linear",
        S = 1e3,
        k = .004,
        C = "skrollr-body",
        E = 200,
        $ = "start",
        A = "end",
        O = "center",
        D = "bottom",
        F = "___skrollable_id",
        I = /^(?:input|textarea|button|select)$/i,
        L = /^\s+|\s+$/g,
        N = /^data(?:-(_\w+))?(?:-?(-?\d*\.?\d+p?))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/,
        P = /\s*(@?[\w\-\[\]]+)\s*:\s*(.+?)\s*(?:;|$)/gi,
        M = /^(@?[a-z\-]+)\[(\w+)\]$/,
        X = /-([a-z0-9_])/g,
        Y = function(t, e) {
            return e.toUpperCase()
        },
        R = /[\-+]?[\d]*\.?[\d]+/g,
        _ = /\{\?\}/g,
        z = /rgba?\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+/g,
        q = /[a-z\-]+-gradient/g,
        W = "",
        B = "",
        H = function() {
            var t = /^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;
            if (h) {
                var e = h(s, null);
                for (var i in e)
                    if (W = i.match(t) || +i == i && e[i].match(t)) break;
                if (!W) return void(W = B = "");
                W = W[0], "-" === W.slice(0, 1) ? (B = W, W = {
                    "-webkit-": "webkit",
                    "-moz-": "Moz",
                    "-ms-": "ms",
                    "-o-": "O"
                }[W]) : B = "-" + W.toLowerCase() + "-"
            }
        },
        j = function() {
            var e = t.requestAnimationFrame || t[W.toLowerCase() + "RequestAnimationFrame"],
                i = Lt();
            return !Bt && e || (e = function(e) {
                var n = Lt() - i,
                    o = l.max(0, 1e3 / 60 - n);
                return t.setTimeout(function() {
                    i = Lt(), e()
                }, o)
            }), e
        },
        U = function() {
            var e = t.cancelAnimationFrame || t[W.toLowerCase() + "CancelAnimationFrame"];
            return !Bt && e || (e = function(e) {
                return t.clearTimeout(e)
            }), e
        },
        V = {
            begin: function() {
                return 0
            },
            end: function() {
                return 1
            },
            linear: function(t) {
                return t
            },
            quadratic: function(t) {
                return t * t
            },
            cubic: function(t) {
                return t * t * t
            },
            swing: function(t) {
                return -l.cos(t * l.PI) / 2 + .5
            },
            sqrt: function(t) {
                return l.sqrt(t)
            },
            outCubic: function(t) {
                return l.pow(t - 1, 3) + 1
            },
            bounce: function(t) {
                var e;
                if (.5083 >= t) e = 3;
                else if (.8489 >= t) e = 9;
                else if (.96208 >= t) e = 27;
                else {
                    if (!(.99981 >= t)) return 1;
                    e = 91
                }
                return 1 - l.abs(3 * l.cos(t * e * 1.028) / e)
            }
        };
    n.prototype.refresh = function(t) {
        var n, o, s = !1;
        for (t === i ? (s = !0, lt = [], Wt = 0, t = e.getElementsByTagName("*")) : t.length === i && (t = [t]), n = 0, o = t.length; o > n; n++) {
            var r = t[n],
                a = r,
                l = [],
                h = mt,
                c = wt,
                p = !1;
            if (s && F in r && delete r[F], r.attributes) {
                for (var u = 0, d = r.attributes.length; d > u; u++) {
                    var m = r.attributes[u];
                    if ("data-anchor-target" !== m.name)
                        if ("data-smooth-scrolling" !== m.name)
                            if ("data-edge-strategy" !== m.name)
                                if ("data-emit-events" !== m.name) {
                                    var y = m.name.match(N);
                                    if (null !== y) {
                                        var g = {
                                            props: m.value,
                                            element: r,
                                            eventType: m.name.replace(X, Y)
                                        };
                                        l.push(g);
                                        var v = y[1];
                                        v && (g.constant = v.substr(1));
                                        var w = y[2];
                                        /p$/.test(w) ? (g.isPercentage = !0, g.offset = (0 | w.slice(0, -1)) / 100) : g.offset = 0 | w;
                                        var b = y[3],
                                            x = y[4] || b;
                                        b && b !== $ && b !== A ? (g.mode = "relative", g.anchors = [b, x]) : (g.mode = "absolute", b === A ? g.isEnd = !0 : g.isPercentage || (g.offset = g.offset * Mt))
                                    }
                                } else p = !0;
                    else c = m.value;
                    else h = "off" !== m.value;
                    else if (a = e.querySelector(m.value), null === a) throw 'Unable to find anchor target "' + m.value + '"'
                }
                if (l.length) {
                    var T, S, k;
                    !s && F in r ? (k = r[F], T = lt[k].styleAttr, S = lt[k].classAttr) : (k = r[F] = Wt++, T = r.style.cssText, S = Ot(r)), lt[k] = {
                        element: r,
                        styleAttr: T,
                        classAttr: S,
                        anchorTarget: a,
                        keyFrames: l,
                        smoothScrolling: h,
                        edgeStrategy: c,
                        emitEvents: p,
                        lastFrameIndex: -1
                    }, Dt(r, [f], [])
                }
            }
        }
        for (Et(), n = 0, o = t.length; o > n; n++) {
            var C = lt[t[n][F]];
            C !== i && (J(C), et(C))
        }
        return at
    }, n.prototype.relativeToAbsolute = function(t, e, i) {
        var n = o.clientHeight,
            s = t.getBoundingClientRect(),
            r = s.top,
            a = s.bottom - s.top;
        return e === D ? r -= n : e === O && (r -= n / 2), i === D ? r += a : i === O && (r += a / 2), r += at.getScrollTop(), r + .5 | 0
    }, n.prototype.animateTo = function(t, e) {
        e = e || {};
        var n = Lt(),
            o = at.getScrollTop(),
            s = e.duration === i ? S : e.duration;
        return ft = {
            startTop: o,
            topDiff: t - o,
            targetTop: t,
            duration: s,
            startTime: n,
            endTime: n + s,
            easing: V[e.easing || T],
            done: e.done
        }, ft.topDiff || (ft.done && ft.done.call(at, !1), ft = i), at
    }, n.prototype.stopAnimateTo = function() {
        ft && ft.done && ft.done.call(at, !0), ft = i
    }, n.prototype.isAnimatingTo = function() {
        return !!ft
    }, n.prototype.isMobile = function() {
        return Bt
    }, n.prototype.setScrollTop = function(e, i) {
        return vt = i === !0, Bt ? Ht = l.min(l.max(e, 0), Pt) : t.scrollTo(0, e), at
    }, n.prototype.getScrollTop = function() {
        return Bt ? Ht : t.pageYOffset || o.scrollTop || s.scrollTop || 0
    }, n.prototype.getMaxScrollTop = function() {
        return Pt
    }, n.prototype.on = function(t, e) {
        return ct[t] = e, at
    }, n.prototype.off = function(t) {
        return delete ct[t], at
    }, n.prototype.destroy = function() {
        var t = U();
        t(xt), kt(), Dt(o, [w], [v, b, x]);
        for (var e = 0, n = lt.length; n > e; e++) st(lt[e].element);
        o.style.overflow = s.style.overflow = "", o.style.height = s.style.height = "", ht && r.setStyle(ht, "transform", "none"), at = i, ht = i, ct = i, pt = i, Pt = 0, Mt = 1, ut = i, dt = i, Xt = "down", Yt = -1, _t = 0, zt = 0, qt = !1, ft = i, mt = i, yt = i, gt = i, vt = i, Wt = 0, wt = i, Bt = !1, Ht = 0, bt = i
    };
    var Q = function() {
            var n, r, a, h, f, m, y, g, v, w, b, x;
            Tt(o, [c, p, u, d].join(" "), function(t) {
                var o = t.changedTouches[0];
                for (h = t.target; 3 === h.nodeType;) h = h.parentNode;
                switch (f = o.clientY, m = o.clientX, w = t.timeStamp, I.test(h.tagName) || t.preventDefault(), t.type) {
                    case c:
                        n && n.blur(), at.stopAnimateTo(), n = h, r = y = f, a = m, v = w;
                        break;
                    case p:
                        I.test(h.tagName) && e.activeElement !== h && t.preventDefault(), g = f - y, x = w - b, at.setScrollTop(Ht - g, !0), y = f, b = w;
                        break;
                    default:
                    case u:
                    case d:
                        var s = r - f,
                            T = a - m,
                            S = T * T + s * s;
                        if (49 > S) {
                            if (!I.test(n.tagName)) {
                                n.focus();
                                var k = e.createEvent("MouseEvents");
                                k.initMouseEvent("click", !0, !0, t.view, 1, o.screenX, o.screenY, o.clientX, o.clientY, t.ctrlKey, t.altKey, t.shiftKey, t.metaKey, 0, null), n.dispatchEvent(k)
                            }
                            return
                        }
                        n = i;
                        var C = g / x;
                        C = l.max(l.min(C, 3), -3);
                        var E = l.abs(C / dt),
                            $ = C * E + .5 * dt * E * E,
                            A = at.getScrollTop() - $,
                            O = 0;
                        A > Pt ? (O = (Pt - A) / $, A = Pt) : 0 > A && (O = -A / $, A = 0), E *= 1 - O, at.animateTo(A + .5 | 0, {
                            easing: "outCubic",
                            duration: E
                        })
                }
            }), t.scrollTo(0, 0), o.style.overflow = s.style.overflow = "hidden"
        },
        K = function() {
            var t, e, i, n, s, r, a, h, c, p, u, d = o.clientHeight,
                f = $t();
            for (h = 0, c = lt.length; c > h; h++)
                for (t = lt[h], e = t.element, i = t.anchorTarget, n = t.keyFrames, s = 0, r = n.length; r > s; s++) a = n[s], p = a.offset, u = f[a.constant] || 0, a.frame = p, a.isPercentage && (p *= d, a.frame = p), "relative" === a.mode && (st(e), a.frame = at.relativeToAbsolute(i, a.anchors[0], a.anchors[1]) - p, st(e, !0)), a.frame += u, pt && !a.isEnd && a.frame > Pt && (Pt = a.frame);
            for (Pt = l.max(Pt, At()), h = 0, c = lt.length; c > h; h++) {
                for (t = lt[h], n = t.keyFrames, s = 0, r = n.length; r > s; s++) a = n[s], u = f[a.constant] || 0, a.isEnd && (a.frame = Pt - a.offset + u);
                t.keyFrames.sort(Nt)
            }
        },
        G = function(t, e) {
            for (var i = 0, n = lt.length; n > i; i++) {
                var o, s, l = lt[i],
                    h = l.element,
                    c = l.smoothScrolling ? t : e,
                    p = l.keyFrames,
                    u = p.length,
                    d = p[0],
                    v = p[p.length - 1],
                    w = c < d.frame,
                    b = c > v.frame,
                    x = w ? d : v,
                    T = l.emitEvents,
                    S = l.lastFrameIndex;
                if (w || b) {
                    if (w && -1 === l.edge || b && 1 === l.edge) continue;
                    switch (w ? (Dt(h, [m], [g, y]), T && S > -1 && (Ct(h, d.eventType, Xt), l.lastFrameIndex = -1)) : (Dt(h, [g], [m, y]), T && u > S && (Ct(h, v.eventType, Xt), l.lastFrameIndex = u)), l.edge = w ? -1 : 1, l.edgeStrategy) {
                        case "reset":
                            st(h);
                            continue;
                        case "ease":
                            c = x.frame;
                            break;
                        default:
                        case "set":
                            var k = x.props;
                            for (o in k) a.call(k, o) && (s = ot(k[o].value), 0 === o.indexOf("@") ? h.setAttribute(o.substr(1), s) : r.setStyle(h, o, s));
                            continue
                    }
                } else 0 !== l.edge && (Dt(h, [f, y], [m, g]), l.edge = 0);
                for (var C = 0; u - 1 > C; C++)
                    if (c >= p[C].frame && c <= p[C + 1].frame) {
                        var E = p[C],
                            $ = p[C + 1];
                        for (o in E.props)
                            if (a.call(E.props, o)) {
                                var A = (c - E.frame) / ($.frame - E.frame);
                                A = E.props[o].easing(A), s = nt(E.props[o].value, $.props[o].value, A), s = ot(s), 0 === o.indexOf("@") ? h.setAttribute(o.substr(1), s) : r.setStyle(h, o, s)
                            }
                        T && S !== C && ("down" === Xt ? Ct(h, E.eventType, Xt) : Ct(h, $.eventType, Xt), l.lastFrameIndex = C);
                        break
                    }
            }
        },
        Z = function() {
            qt && (qt = !1, Et());
            var t, e, n = at.getScrollTop(),
                o = Lt();
            if (ft) o >= ft.endTime ? (n = ft.targetTop, t = ft.done, ft = i) : (e = ft.easing((o - ft.startTime) / ft.duration), n = ft.startTop + e * ft.topDiff | 0), at.setScrollTop(n, !0);
            else if (!vt) {
                var s = gt.targetTop - n;
                s && (gt = {
                    startTop: Yt,
                    topDiff: n - Yt,
                    targetTop: n,
                    startTime: Rt,
                    endTime: Rt + yt
                }), o <= gt.endTime && (e = V.sqrt((o - gt.startTime) / yt), n = gt.startTop + e * gt.topDiff | 0)
            }
            if (vt || Yt !== n) {
                Xt = n > Yt ? "down" : Yt > n ? "up" : Xt, vt = !1;
                var a = {
                        curTop: n,
                        lastTop: Yt,
                        maxTop: Pt,
                        direction: Xt
                    },
                    l = ct.beforerender && ct.beforerender.call(at, a);
                l !== !1 && (G(n, at.getScrollTop()), Bt && ht && r.setStyle(ht, "transform", "translate(0, " + -Ht + "px) " + bt), Yt = n, ct.render && ct.render.call(at, a)), t && t.call(at, !1)
            }
            Rt = o
        },
        J = function(t) {
            for (var e = 0, i = t.keyFrames.length; i > e; e++) {
                for (var n, o, s, r, a = t.keyFrames[e], l = {}; null !== (r = P.exec(a.props));) s = r[1], o = r[2], n = s.match(M), null !== n ? (s = n[1], n = n[2]) : n = T, o = o.indexOf("!") ? tt(o) : [o.slice(1)], l[s] = {
                    value: o,
                    easing: V[n]
                };
                a.props = l
            }
        },
        tt = function(t) {
            var e = [];
            return z.lastIndex = 0, t = t.replace(z, function(t) {
                return t.replace(R, function(t) {
                    return t / 255 * 100 + "%"
                })
            }), B && (q.lastIndex = 0, t = t.replace(q, function(t) {
                return B + t
            })), t = t.replace(R, function(t) {
                return e.push(+t), "{?}"
            }), e.unshift(t), e
        },
        et = function(t) {
            var e, i, n = {};
            for (e = 0, i = t.keyFrames.length; i > e; e++) it(t.keyFrames[e], n);
            for (n = {}, e = t.keyFrames.length - 1; e >= 0; e--) it(t.keyFrames[e], n)
        },
        it = function(t, e) {
            var i;
            for (i in e) a.call(t.props, i) || (t.props[i] = e[i]);
            for (i in t.props) e[i] = t.props[i]
        },
        nt = function(t, e, i) {
            var n, o = t.length;
            if (o !== e.length) throw "Can't interpolate between \"" + t[0] + '" and "' + e[0] + '"';
            var s = [t[0]];
            for (n = 1; o > n; n++) s[n] = t[n] + (e[n] - t[n]) * i;
            return s
        },
        ot = function(t) {
            var e = 1;
            return _.lastIndex = 0, t[0].replace(_, function() {
                return t[e++]
            })
        },
        st = function(t, e) {
            t = [].concat(t);
            for (var i, n, o = 0, s = t.length; s > o; o++) n = t[o], i = lt[n[F]], i && (e ? (n.style.cssText = i.dirtyStyleAttr, Dt(n, i.dirtyClassAttr)) : (i.dirtyStyleAttr = n.style.cssText, i.dirtyClassAttr = Ot(n), n.style.cssText = i.styleAttr, Dt(n, i.classAttr)))
        },
        rt = function() {
            bt = "translateZ(0)", r.setStyle(ht, "transform", bt);
            var t = h(ht),
                e = t.getPropertyValue("transform"),
                i = t.getPropertyValue(B + "transform"),
                n = e && "none" !== e || i && "none" !== i;
            n || (bt = "")
        };
    r.setStyle = function(t, e, i) {
        var n = t.style;
        if (e = e.replace(X, Y).replace("-", ""), "zIndex" === e) isNaN(i) ? n[e] = i : n[e] = "" + (0 | i);
        else if ("float" === e) n.styleFloat = n.cssFloat = i;
        else try {
            W && (n[W + e.slice(0, 1).toUpperCase() + e.slice(1)] = i), n[e] = i
        } catch (o) {}
    };
    var at, lt, ht, ct, pt, ut, dt, ft, mt, yt, gt, vt, wt, bt, xt, Tt = r.addEvent = function(e, i, n) {
            var o = function(e) {
                return e = e || t.event, e.target || (e.target = e.srcElement), e.preventDefault || (e.preventDefault = function() {
                    e.returnValue = !1, e.defaultPrevented = !0
                }), n.call(this, e)
            };
            i = i.split(" ");
            for (var s, r = 0, a = i.length; a > r; r++) s = i[r], e.addEventListener ? e.addEventListener(s, n, !1) : e.attachEvent("on" + s, o), jt.push({
                element: e,
                name: s,
                listener: n
            })
        },
        St = r.removeEvent = function(t, e, i) {
            e = e.split(" ");
            for (var n = 0, o = e.length; o > n; n++) t.removeEventListener ? t.removeEventListener(e[n], i, !1) : t.detachEvent("on" + e[n], i)
        },
        kt = function() {
            for (var t, e = 0, i = jt.length; i > e; e++) t = jt[e], St(t.element, t.name, t.listener);
            jt = []
        },
        Ct = function(t, e, i) {
            ct.keyframe && ct.keyframe.call(at, t, e, i)
        },
        Et = function() {
            var t = at.getScrollTop();
            Pt = 0, pt && !Bt && (s.style.height = ""), K(), pt && !Bt && (s.style.height = Pt + o.clientHeight + "px"), Bt ? at.setScrollTop(l.min(at.getScrollTop(), Pt)) : at.setScrollTop(t, !0), vt = !0
        },
        $t = function() {
            var t, e, i = o.clientHeight,
                n = {};
            for (t in ut) e = ut[t], "function" == typeof e ? e = e.call(at) : /p$/.test(e) && (e = e.slice(0, -1) / 100 * i), n[t] = e;
            return n
        },
        At = function() {
            var t, e = 0;
            return ht && (e = l.max(ht.offsetHeight, ht.scrollHeight)), t = l.max(e, s.scrollHeight, s.offsetHeight, o.scrollHeight, o.offsetHeight, o.clientHeight), t - o.clientHeight
        },
        Ot = function(e) {
            var i = "className";
            return t.SVGElement && e instanceof t.SVGElement && (e = e[i], i = "baseVal"), e[i]
        },
        Dt = function(e, n, o) {
            var s = "className";
            if (t.SVGElement && e instanceof t.SVGElement && (e = e[s], s = "baseVal"), o === i) return void(e[s] = n);
            for (var r = e[s], a = 0, l = o.length; l > a; a++) r = It(r).replace(It(o[a]), " ");
            r = Ft(r);
            for (var h = 0, c = n.length; c > h; h++) - 1 === It(r).indexOf(It(n[h])) && (r += " " + n[h]);
            e[s] = Ft(r)
        },
        Ft = function(t) {
            return t.replace(L, "")
        },
        It = function(t) {
            return " " + t + " "
        },
        Lt = Date.now || function() {
            return +new Date
        },
        Nt = function(t, e) {
            return t.frame - e.frame
        },
        Pt = 0,
        Mt = 1,
        Xt = "down",
        Yt = -1,
        Rt = Lt(),
        _t = 0,
        zt = 0,
        qt = !1,
        Wt = 0,
        Bt = !1,
        Ht = 0,
        jt = [];
    "function" == typeof define && define.amd ? define([], function() {
        return r
    }) : "undefined" != typeof module && module.exports ? module.exports = r : t.skrollr = r
}(window, document),
function() {
    var t, e, i, n, o, s = function(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        },
        r = [].indexOf || function(t) {
            for (var e = 0, i = this.length; i > e; e++)
                if (e in this && this[e] === t) return e;
            return -1
        };
    e = function() {
        function t() {}
        return t.prototype.extend = function(t, e) {
            var i, n;
            for (i in e) n = e[i], null == t[i] && (t[i] = n);
            return t
        }, t.prototype.isMobile = function(t) {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(t)
        }, t.prototype.createEvent = function(t, e, i, n) {
            var o;
            return null == e && (e = !1), null == i && (i = !1), null == n && (n = null), null != document.createEvent ? (o = document.createEvent("CustomEvent"), o.initCustomEvent(t, e, i, n)) : null != document.createEventObject ? (o = document.createEventObject(), o.eventType = t) : o.eventName = t, o
        }, t.prototype.emitEvent = function(t, e) {
            return null != t.dispatchEvent ? t.dispatchEvent(e) : e in (null != t) ? t[e]() : "on" + e in (null != t) ? t["on" + e]() : void 0
        }, t.prototype.addEvent = function(t, e, i) {
            return null != t.addEventListener ? t.addEventListener(e, i, !1) : null != t.attachEvent ? t.attachEvent("on" + e, i) : t[e] = i
        }, t.prototype.removeEvent = function(t, e, i) {
            return null != t.removeEventListener ? t.removeEventListener(e, i, !1) : null != t.detachEvent ? t.detachEvent("on" + e, i) : delete t[e]
        }, t.prototype.innerHeight = function() {
            return "innerHeight" in window ? window.innerHeight : document.documentElement.clientHeight
        }, t
    }(), i = this.WeakMap || this.MozWeakMap || (i = function() {
        function t() {
            this.keys = [], this.values = []
        }
        return t.prototype.get = function(t) {
            var e, i, n, o, s;
            for (s = this.keys, e = n = 0, o = s.length; o > n; e = ++n)
                if (i = s[e], i === t) return this.values[e]
        }, t.prototype.set = function(t, e) {
            var i, n, o, s, r;
            for (r = this.keys, i = o = 0, s = r.length; s > o; i = ++o)
                if (n = r[i], n === t) return void(this.values[i] = e);
            return this.keys.push(t), this.values.push(e)
        }, t
    }()), t = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (t = function() {
        function t() {
            "undefined" != typeof console && null !== console && console.warn("MutationObserver is not supported by your browser."), "undefined" != typeof console && null !== console && console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content.")
        }
        return t.notSupported = !0, t.prototype.observe = function() {}, t
    }()), n = this.getComputedStyle || function(t, e) {
        return this.getPropertyValue = function(e) {
            var i;
            return "float" === e && (e = "styleFloat"), o.test(e) && e.replace(o, function(t, e) {
                return e.toUpperCase()
            }), (null != (i = t.currentStyle) ? i[e] : void 0) || null
        }, this
    }, o = /(\-([a-z]){1})/g, this.WOW = function() {
        function o(t) {
            null == t && (t = {}), this.scrollCallback = s(this.scrollCallback, this), this.scrollHandler = s(this.scrollHandler, this), this.resetAnimation = s(this.resetAnimation, this), this.start = s(this.start, this), this.scrolled = !0, this.config = this.util().extend(t, this.defaults), this.animationNameCache = new i, this.wowEvent = this.util().createEvent(this.config.boxClass)
        }
        return o.prototype.defaults = {
            boxClass: "wow",
            animateClass: "animated",
            offset: 0,
            mobile: !0,
            live: !0,
            callback: null
        }, o.prototype.init = function() {
            var t;
            return this.element = window.document.documentElement, "interactive" === (t = document.readyState) || "complete" === t ? this.start() : this.util().addEvent(document, "DOMContentLoaded", this.start), this.finished = []
        }, o.prototype.start = function() {
            var e, i, n, o;
            if (this.stopped = !1, this.boxes = function() {
                    var t, i, n, o;
                    for (n = this.element.querySelectorAll("." + this.config.boxClass), o = [], t = 0, i = n.length; i > t; t++) e = n[t], o.push(e);
                    return o
                }.call(this), this.all = function() {
                    var t, i, n, o;
                    for (n = this.boxes, o = [], t = 0, i = n.length; i > t; t++) e = n[t], o.push(e);
                    return o
                }.call(this), this.boxes.length)
                if (this.disabled()) this.resetStyle();
                else
                    for (o = this.boxes, i = 0, n = o.length; n > i; i++) e = o[i], this.applyStyle(e, !0);
            return this.disabled() || (this.util().addEvent(window, "scroll", this.scrollHandler), this.util().addEvent(window, "resize", this.scrollHandler), this.interval = setInterval(this.scrollCallback, 50)), this.config.live ? new t(function(t) {
                return function(e) {
                    var i, n, o, s, r;
                    for (r = [], i = 0, n = e.length; n > i; i++) s = e[i], r.push(function() {
                        var t, e, i, n;
                        for (i = s.addedNodes || [], n = [], t = 0, e = i.length; e > t; t++) o = i[t], n.push(this.doSync(o));
                        return n
                    }.call(t));
                    return r
                }
            }(this)).observe(document.body, {
                childList: !0,
                subtree: !0
            }) : void 0
        }, o.prototype.stop = function() {
            return this.stopped = !0, this.util().removeEvent(window, "scroll", this.scrollHandler), this.util().removeEvent(window, "resize", this.scrollHandler), null != this.interval ? clearInterval(this.interval) : void 0
        }, o.prototype.sync = function(e) {
            return t.notSupported ? this.doSync(this.element) : void 0
        }, o.prototype.doSync = function(t) {
            var e, i, n, o, s;
            if (null == t && (t = this.element), 1 === t.nodeType) {
                for (t = t.parentNode || t, o = t.querySelectorAll("." + this.config.boxClass), s = [], i = 0, n = o.length; n > i; i++) e = o[i], r.call(this.all, e) < 0 ? (this.boxes.push(e), this.all.push(e), this.stopped || this.disabled() ? this.resetStyle() : this.applyStyle(e, !0), s.push(this.scrolled = !0)) : s.push(void 0);
                return s
            }
        }, o.prototype.show = function(t) {
            return this.applyStyle(t), t.className = t.className + " " + this.config.animateClass, null != this.config.callback && this.config.callback(t), this.util().emitEvent(t, this.wowEvent), this.util().addEvent(t, "animationend", this.resetAnimation), this.util().addEvent(t, "oanimationend", this.resetAnimation), this.util().addEvent(t, "webkitAnimationEnd", this.resetAnimation), this.util().addEvent(t, "MSAnimationEnd", this.resetAnimation), t
        }, o.prototype.applyStyle = function(t, e) {
            var i, n, o;
            return n = t.getAttribute("data-wow-duration"), i = t.getAttribute("data-wow-delay"), o = t.getAttribute("data-wow-iteration"), this.animate(function(s) {
                return function() {
                    return s.customStyle(t, e, n, i, o)
                }
            }(this))
        }, o.prototype.animate = function() {
            return "requestAnimationFrame" in window ? function(t) {
                return window.requestAnimationFrame(t)
            } : function(t) {
                return t()
            }
        }(), o.prototype.resetStyle = function() {
            var t, e, i, n, o;
            for (n = this.boxes, o = [], e = 0, i = n.length; i > e; e++) t = n[e], o.push(t.style.visibility = "visible");
            return o
        }, o.prototype.resetAnimation = function(t) {
            var e;
            return t.type.toLowerCase().indexOf("animationend") >= 0 ? (e = t.target || t.srcElement, e.className = e.className.replace(this.config.animateClass, "").trim()) : void 0
        }, o.prototype.customStyle = function(t, e, i, n, o) {
            return e && this.cacheAnimationName(t), t.style.visibility = e ? "hidden" : "visible", i && this.vendorSet(t.style, {
                animationDuration: i
            }), n && this.vendorSet(t.style, {
                animationDelay: n
            }), o && this.vendorSet(t.style, {
                animationIterationCount: o
            }), this.vendorSet(t.style, {
                animationName: e ? "none" : this.cachedAnimationName(t)
            }), t
        }, o.prototype.vendors = ["moz", "webkit"], o.prototype.vendorSet = function(t, e) {
            var i, n, o, s;
            n = [];
            for (i in e) o = e[i], t["" + i] = o, n.push(function() {
                var e, n, r, a;
                for (r = this.vendors, a = [], e = 0, n = r.length; n > e; e++) s = r[e], a.push(t["" + s + i.charAt(0).toUpperCase() + i.substr(1)] = o);
                return a
            }.call(this));
            return n
        }, o.prototype.vendorCSS = function(t, e) {
            var i, o, s, r, a, l;
            for (a = n(t), r = a.getPropertyCSSValue(e), s = this.vendors, i = 0, o = s.length; o > i; i++) l = s[i], r = r || a.getPropertyCSSValue("-" + l + "-" + e);
            return r
        }, o.prototype.animationName = function(t) {
            var e;
            try {
                e = this.vendorCSS(t, "animation-name").cssText
            } catch (i) {
                e = n(t).getPropertyValue("animation-name")
            }
            return "none" === e ? "" : e
        }, o.prototype.cacheAnimationName = function(t) {
            return this.animationNameCache.set(t, this.animationName(t))
        }, o.prototype.cachedAnimationName = function(t) {
            return this.animationNameCache.get(t)
        }, o.prototype.scrollHandler = function() {
            return this.scrolled = !0
        }, o.prototype.scrollCallback = function() {
            var t;
            return !this.scrolled || (this.scrolled = !1, this.boxes = function() {
                var e, i, n, o;
                for (n = this.boxes, o = [], e = 0, i = n.length; i > e; e++) t = n[e], t && (this.isVisible(t) ? this.show(t) : o.push(t));
                return o
            }.call(this), this.boxes.length || this.config.live) ? void 0 : this.stop()
        }, o.prototype.offsetTop = function(t) {
            for (var e; void 0 === t.offsetTop;) t = t.parentNode;
            for (e = t.offsetTop; t = t.offsetParent;) e += t.offsetTop;
            return e
        }, o.prototype.isVisible = function(t) {
            var e, i, n, o, s;
            return i = t.getAttribute("data-wow-offset") || this.config.offset, s = window.pageYOffset, o = s + Math.min(this.element.clientHeight, this.util().innerHeight()) - i, n = this.offsetTop(t), e = n + t.clientHeight, o >= n && e >= s
        }, o.prototype.util = function() {
            return null != this._util ? this._util : this._util = new e
        }, o.prototype.disabled = function() {
            return !this.config.mobile && this.util().isMobile(navigator.userAgent)
        }, o
    }()
}.call(this),
    function(t, e, i, n) {
        function o(e, i) {
            this.element = e, this.options = t.extend({}, r, i), this._defaults = r, this._name = s, this.init()
        }
        var s = "stellar",
            r = {
                scrollProperty: "scroll",
                positionProperty: "position",
                horizontalScrolling: !0,
                verticalScrolling: !0,
                horizontalOffset: 0,
                verticalOffset: 0,
                responsive: !1,
                parallaxBackgrounds: !0,
                parallaxElements: !0,
                hideDistantElements: !0,
                hideElement: function(t) {
                    t.hide()
                },
                showElement: function(t) {
                    t.show()
                }
            },
            a = {
                scroll: {
                    getLeft: function(t) {
                        return t.scrollLeft()
                    },
                    setLeft: function(t, e) {
                        t.scrollLeft(e)
                    },
                    getTop: function(t) {
                        return t.scrollTop()
                    },
                    setTop: function(t, e) {
                        t.scrollTop(e)
                    }
                },
                position: {
                    getLeft: function(t) {
                        return -1 * parseInt(t.css("left"), 10)
                    },
                    getTop: function(t) {
                        return -1 * parseInt(t.css("top"), 10)
                    }
                },
                margin: {
                    getLeft: function(t) {
                        return -1 * parseInt(t.css("margin-left"), 10)
                    },
                    getTop: function(t) {
                        return -1 * parseInt(t.css("margin-top"), 10)
                    }
                },
                transform: {
                    getLeft: function(t) {
                        var e = getComputedStyle(t[0])[c];
                        return "none" !== e ? -1 * parseInt(e.match(/(-?[0-9]+)/g)[4], 10) : 0
                    },
                    getTop: function(t) {
                        var e = getComputedStyle(t[0])[c];
                        return "none" !== e ? -1 * parseInt(e.match(/(-?[0-9]+)/g)[5], 10) : 0
                    }
                }
            },
            l = {
                position: {
                    setLeft: function(t, e) {
                        t.css("left", e)
                    },
                    setTop: function(t, e) {
                        t.css("top", e)
                    }
                },
                transform: {
                    setPosition: function(t, e, i, n, o) {
                        t[0].style[c] = "translate3d(" + (e - i) + "px, " + (n - o) + "px, 0)"
                    }
                }
            },
            h = function() {
                var e, i = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,
                    n = t("script")[0].style,
                    o = "";
                for (e in n)
                    if (i.test(e)) {
                        o = e.match(i)[0];
                        break
                    }
                return "WebkitOpacity" in n && (o = "Webkit"), "KhtmlOpacity" in n && (o = "Khtml"),
                    function(t) {
                        return o + (o.length > 0 ? t.charAt(0).toUpperCase() + t.slice(1) : t)
                    }
            }(),
            c = h("transform"),
            p = t("<div />", {
                style: "background:#fff"
            }).css("background-position-x") !== n,
            u = p ? function(t, e, i) {
                t.css({
                    "background-position-x": e,
                    "background-position-y": i
                })
            } : function(t, e, i) {
                t.css("background-position", e + " " + i)
            },
            d = p ? function(t) {
                return [t.css("background-position-x"), t.css("background-position-y")]
            } : function(t) {
                return t.css("background-position").split(" ")
            },
            f = e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame || function(t) {
                setTimeout(t, 1e3 / 60)
            };
        o.prototype = {
            init: function() {
                this.options.name = s + "_" + Math.floor(1e9 * Math.random()), this._defineElements(), this._defineGetters(), this._defineSetters(), this._handleWindowLoadAndResize(), this._detectViewport(), this.refresh({
                    firstLoad: !0
                }), "scroll" === this.options.scrollProperty ? this._handleScrollEvent() : this._startAnimationLoop()
            },
            _defineElements: function() {
                this.element === i.body && (this.element = e), this.$scrollElement = t(this.element), this.$element = this.element === e ? t("body") : this.$scrollElement, this.$viewportElement = this.options.viewportElement !== n ? t(this.options.viewportElement) : this.$scrollElement[0] === e || "scroll" === this.options.scrollProperty ? this.$scrollElement : this.$scrollElement.parent()
            },
            _defineGetters: function() {
                var t = this,
                    e = a[t.options.scrollProperty];
                this._getScrollLeft = function() {
                    return e.getLeft(t.$scrollElement)
                }, this._getScrollTop = function() {
                    return e.getTop(t.$scrollElement)
                }
            },
            _defineSetters: function() {
                var e = this,
                    i = a[e.options.scrollProperty],
                    n = l[e.options.positionProperty],
                    o = i.setLeft,
                    s = i.setTop;
                this._setScrollLeft = "function" == typeof o ? function(t) {
                    o(e.$scrollElement, t)
                } : t.noop, this._setScrollTop = "function" == typeof s ? function(t) {
                    s(e.$scrollElement, t)
                } : t.noop, this._setPosition = n.setPosition || function(t, i, o, s, r) {
                    e.options.horizontalScrolling && n.setLeft(t, i, o), e.options.verticalScrolling && n.setTop(t, s, r)
                }
            },
            _handleWindowLoadAndResize: function() {
                var i = this,
                    n = t(e);
                i.options.responsive && n.bind("load." + this.name, function() {
                    i.refresh()
                }), n.bind("resize." + this.name, function() {
                    i._detectViewport(), i.options.responsive && i.refresh()
                })
            },
            refresh: function(i) {
                var n = this,
                    o = n._getScrollLeft(),
                    s = n._getScrollTop();
                i && i.firstLoad || this._reset(), this._setScrollLeft(0), this._setScrollTop(0), this._setOffsets(), this._findParticles(), this._findBackgrounds(), i && i.firstLoad && /WebKit/.test(navigator.userAgent) && t(e).load(function() {
                    var t = n._getScrollLeft(),
                        e = n._getScrollTop();
                    n._setScrollLeft(t + 1), n._setScrollTop(e + 1), n._setScrollLeft(t), n._setScrollTop(e)
                }), this._setScrollLeft(o), this._setScrollTop(s)
            },
            _detectViewport: function() {
                var t = this.$viewportElement.offset(),
                    e = null !== t && t !== n;
                this.viewportWidth = this.$viewportElement.width(), this.viewportHeight = this.$viewportElement.height(), this.viewportOffsetTop = e ? t.top : 0, this.viewportOffsetLeft = e ? t.left : 0
            },
            _findParticles: function() {
                var e = this;
                this._getScrollLeft(), this._getScrollTop();
                if (this.particles !== n)
                    for (var i = this.particles.length - 1; i >= 0; i--) this.particles[i].$element.data("stellar-elementIsActive", n);
                this.particles = [], this.options.parallaxElements && this.$element.find("[data-stellar-ratio]").each(function(i) {
                    var o, s, r, a, l, h, c, p, u, d = t(this),
                        f = 0,
                        m = 0,
                        y = 0,
                        g = 0;
                    if (d.data("stellar-elementIsActive")) {
                        if (d.data("stellar-elementIsActive") !== this) return
                    } else d.data("stellar-elementIsActive", this);
                    e.options.showElement(d), d.data("stellar-startingLeft") ? (d.css("left", d.data("stellar-startingLeft")), d.css("top", d.data("stellar-startingTop"))) : (d.data("stellar-startingLeft", d.css("left")), d.data("stellar-startingTop", d.css("top"))), r = d.position().left, a = d.position().top, l = "auto" === d.css("margin-left") ? 0 : parseInt(d.css("margin-left"), 10), h = "auto" === d.css("margin-top") ? 0 : parseInt(d.css("margin-top"), 10), p = d.offset().left - l, u = d.offset().top - h, d.parents().each(function() {
                        var e = t(this);
                        return e.data("stellar-offset-parent") === !0 ? (f = y, m = g, c = e, !1) : (y += e.position().left, void(g += e.position().top))
                    }), o = d.data("stellar-horizontal-offset") !== n ? d.data("stellar-horizontal-offset") : c !== n && c.data("stellar-horizontal-offset") !== n ? c.data("stellar-horizontal-offset") : e.horizontalOffset, s = d.data("stellar-vertical-offset") !== n ? d.data("stellar-vertical-offset") : c !== n && c.data("stellar-vertical-offset") !== n ? c.data("stellar-vertical-offset") : e.verticalOffset, e.particles.push({
                        $element: d,
                        $offsetParent: c,
                        isFixed: "fixed" === d.css("position"),
                        horizontalOffset: o,
                        verticalOffset: s,
                        startingPositionLeft: r,
                        startingPositionTop: a,
                        startingOffsetLeft: p,
                        startingOffsetTop: u,
                        parentOffsetLeft: f,
                        parentOffsetTop: m,
                        stellarRatio: d.data("stellar-ratio") !== n ? d.data("stellar-ratio") : 1,
                        width: d.outerWidth(!0),
                        height: d.outerHeight(!0),
                        isHidden: !1
                    })
                })
            },
            _findBackgrounds: function() {
                var e, i = this,
                    o = this._getScrollLeft(),
                    s = this._getScrollTop();
                this.backgrounds = [], this.options.parallaxBackgrounds && (e = this.$element.find("[data-stellar-background-ratio]"), this.$element.data("stellar-background-ratio") && (e = e.add(this.$element)), e.each(function() {
                    var e, r, a, l, h, c, p, f = t(this),
                        m = d(f),
                        y = 0,
                        g = 0,
                        v = 0,
                        w = 0;
                    if (f.data("stellar-backgroundIsActive")) {
                        if (f.data("stellar-backgroundIsActive") !== this) return
                    } else f.data("stellar-backgroundIsActive", this);
                    f.data("stellar-backgroundStartingLeft") ? u(f, f.data("stellar-backgroundStartingLeft"), f.data("stellar-backgroundStartingTop")) : (f.data("stellar-backgroundStartingLeft", m[0]), f.data("stellar-backgroundStartingTop", m[1])), a = "auto" === f.css("margin-left") ? 0 : parseInt(f.css("margin-left"), 10), l = "auto" === f.css("margin-top") ? 0 : parseInt(f.css("margin-top"), 10), h = f.offset().left - a - o, c = f.offset().top - l - s, f.parents().each(function() {
                        var e = t(this);
                        return e.data("stellar-offset-parent") === !0 ? (y = v, g = w, p = e, !1) : (v += e.position().left, void(w += e.position().top))
                    }), e = f.data("stellar-horizontal-offset") !== n ? f.data("stellar-horizontal-offset") : p !== n && p.data("stellar-horizontal-offset") !== n ? p.data("stellar-horizontal-offset") : i.horizontalOffset, r = f.data("stellar-vertical-offset") !== n ? f.data("stellar-vertical-offset") : p !== n && p.data("stellar-vertical-offset") !== n ? p.data("stellar-vertical-offset") : i.verticalOffset, i.backgrounds.push({
                        $element: f,
                        $offsetParent: p,
                        isFixed: "fixed" === f.css("background-attachment"),
                        horizontalOffset: e,
                        verticalOffset: r,
                        startingValueLeft: m[0],
                        startingValueTop: m[1],
                        startingBackgroundPositionLeft: isNaN(parseInt(m[0], 10)) ? 0 : parseInt(m[0], 10),
                        startingBackgroundPositionTop: isNaN(parseInt(m[1], 10)) ? 0 : parseInt(m[1], 10),
                        startingPositionLeft: f.position().left,
                        startingPositionTop: f.position().top,
                        startingOffsetLeft: h,
                        startingOffsetTop: c,
                        parentOffsetLeft: y,
                        parentOffsetTop: g,
                        stellarRatio: f.data("stellar-background-ratio") === n ? 1 : f.data("stellar-background-ratio")
                    })
                }))
            },
            _reset: function() {
                var t, e, i, n, o;
                for (o = this.particles.length - 1; o >= 0; o--) t = this.particles[o], e = t.$element.data("stellar-startingLeft"), i = t.$element.data("stellar-startingTop"), this._setPosition(t.$element, e, e, i, i), this.options.showElement(t.$element), t.$element.data("stellar-startingLeft", null).data("stellar-elementIsActive", null).data("stellar-backgroundIsActive", null);
                for (o = this.backgrounds.length - 1; o >= 0; o--) n = this.backgrounds[o], n.$element.data("stellar-backgroundStartingLeft", null).data("stellar-backgroundStartingTop", null), u(n.$element, n.startingValueLeft, n.startingValueTop)
            },
            destroy: function() {
                this._reset(), this.$scrollElement.unbind("resize." + this.name).unbind("scroll." + this.name), this._animationLoop = t.noop, t(e).unbind("load." + this.name).unbind("resize." + this.name)
            },
            _setOffsets: function() {
                var i = this,
                    n = t(e);
                n.unbind("resize.horizontal-" + this.name).unbind("resize.vertical-" + this.name), "function" == typeof this.options.horizontalOffset ? (this.horizontalOffset = this.options.horizontalOffset(), n.bind("resize.horizontal-" + this.name, function() {
                    i.horizontalOffset = i.options.horizontalOffset()
                })) : this.horizontalOffset = this.options.horizontalOffset, "function" == typeof this.options.verticalOffset ? (this.verticalOffset = this.options.verticalOffset(), n.bind("resize.vertical-" + this.name, function() {
                    i.verticalOffset = i.options.verticalOffset()
                })) : this.verticalOffset = this.options.verticalOffset
            },
            _repositionElements: function() {
                var t, e, i, n, o, s, r, a, l, h, c = this._getScrollLeft(),
                    p = this._getScrollTop(),
                    d = !0,
                    f = !0;
                if (this.currentScrollLeft !== c || this.currentScrollTop !== p || this.currentWidth !== this.viewportWidth || this.currentHeight !== this.viewportHeight) {
                    for (this.currentScrollLeft = c, this.currentScrollTop = p, this.currentWidth = this.viewportWidth, this.currentHeight = this.viewportHeight, h = this.particles.length - 1; h >= 0; h--) t = this.particles[h], e = t.isFixed ? 1 : 0, this.options.horizontalScrolling ? (s = (c + t.horizontalOffset + this.viewportOffsetLeft + t.startingPositionLeft - t.startingOffsetLeft + t.parentOffsetLeft) * -(t.stellarRatio + e - 1) + t.startingPositionLeft, a = s - t.startingPositionLeft + t.startingOffsetLeft) : (s = t.startingPositionLeft, a = t.startingOffsetLeft), this.options.verticalScrolling ? (r = (p + t.verticalOffset + this.viewportOffsetTop + t.startingPositionTop - t.startingOffsetTop + t.parentOffsetTop) * -(t.stellarRatio + e - 1) + t.startingPositionTop, l = r - t.startingPositionTop + t.startingOffsetTop) : (r = t.startingPositionTop, l = t.startingOffsetTop), this.options.hideDistantElements && (f = !this.options.horizontalScrolling || a + t.width > (t.isFixed ? 0 : c) && a < (t.isFixed ? 0 : c) + this.viewportWidth + this.viewportOffsetLeft, d = !this.options.verticalScrolling || l + t.height > (t.isFixed ? 0 : p) && l < (t.isFixed ? 0 : p) + this.viewportHeight + this.viewportOffsetTop), f && d ? (t.isHidden && (this.options.showElement(t.$element), t.isHidden = !1), this._setPosition(t.$element, s, t.startingPositionLeft, r, t.startingPositionTop)) : t.isHidden || (this.options.hideElement(t.$element), t.isHidden = !0);
                    for (h = this.backgrounds.length - 1; h >= 0; h--) i = this.backgrounds[h], e = i.isFixed ? 0 : 1, n = this.options.horizontalScrolling ? (c + i.horizontalOffset - this.viewportOffsetLeft - i.startingOffsetLeft + i.parentOffsetLeft - i.startingBackgroundPositionLeft) * (e - i.stellarRatio) + "px" : i.startingValueLeft, o = this.options.verticalScrolling ? (p + i.verticalOffset - this.viewportOffsetTop - i.startingOffsetTop + i.parentOffsetTop - i.startingBackgroundPositionTop) * (e - i.stellarRatio) + "px" : i.startingValueTop, u(i.$element, n, o)
                }
            },
            _handleScrollEvent: function() {
                var t = this,
                    e = !1,
                    i = function() {
                        t._repositionElements(), e = !1
                    },
                    n = function() {
                        e || (f(i), e = !0)
                    };
                this.$scrollElement.bind("scroll." + this.name, n), n()
            },
            _startAnimationLoop: function() {
                var t = this;
                this._animationLoop = function() {
                    f(t._animationLoop), t._repositionElements()
                }, this._animationLoop()
            }
        }, t.fn[s] = function(e) {
            var i = arguments;
            return e === n || "object" == typeof e ? this.each(function() {
                t.data(this, "plugin_" + s) || t.data(this, "plugin_" + s, new o(this, e))
            }) : "string" == typeof e && "_" !== e[0] && "init" !== e ? this.each(function() {
                var n = t.data(this, "plugin_" + s);
                n instanceof o && "function" == typeof n[e] && n[e].apply(n, Array.prototype.slice.call(i, 1)), "destroy" === e && t.data(this, "plugin_" + s, null)
            }) : void 0
        }, t[s] = function(i) {
            var n = t(e);
            return n.stellar.apply(n, Array.prototype.slice.call(arguments, 0))
        }, t[s].scrollProperty = a, t[s].positionProperty = l, e.Stellar = o
    }(jQuery, this, document),
    function() {
        var t;
        t = function() {
                function t(t, e) {
                    var i, n;
                    if (this.options = {
                            target: "instafeed",
                            get: "popular",
                            resolution: "thumbnail",
                            sortBy: "none",
                            links: !0,
                            mock: !1,
                            useHttp: !1
                        }, "object" == typeof t)
                        for (i in t) n = t[i], this.options[i] = n;
                    this.context = null != e ? e : this, this.unique = this._genKey()
                }
                return t.prototype.hasNext = function() {
                    return "string" == typeof this.context.nextUrl && this.context.nextUrl.length > 0
                }, t.prototype.next = function() {
                    return this.hasNext() ? this.run(this.context.nextUrl) : !1
                }, t.prototype.run = function(e) {
                    var i, n, o;
                    if ("string" != typeof this.options.clientId && "string" != typeof this.options.accessToken) throw new Error("Missing clientId or accessToken.");
                    if ("string" != typeof this.options.accessToken && "string" != typeof this.options.clientId) throw new Error("Missing clientId or accessToken.");
                    return null != this.options.before && "function" == typeof this.options.before && this.options.before.call(this), "undefined" != typeof document && null !== document && (o = document.createElement("script"), o.id = "instafeed-fetcher", o.src = e || this._buildUrl(), i = document.getElementsByTagName("head"), i[0].appendChild(o), n = "instafeedCache" + this.unique, window[n] = new t(this.options, this), window[n].unique = this.unique), !0
                }, t.prototype.parse = function(t) {
                    var e, i, n, o, s, r, a, l, h, c, p, u, d, f, m, y, g, v, w, b, x, T, S, k, C, E, $, A, O, D, F, I, L;
                    if ("object" != typeof t) {
                        if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, "Invalid JSON data"), !1;
                        throw new Error("Invalid JSON response")
                    }
                    if (200 !== t.meta.code) {
                        if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, t.meta.error_message), !1;
                        throw new Error("Error from Instagram: " + t.meta.error_message)
                    }
                    if (0 === t.data.length) {
                        if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, "No images were returned from Instagram"), !1;
                        throw new Error("No images were returned from Instagram")
                    }
                    if (null != this.options.success && "function" == typeof this.options.success && this.options.success.call(this, t), this.context.nextUrl = "", null != t.pagination && (this.context.nextUrl = t.pagination.next_url), "none" !== this.options.sortBy) switch (F = "random" === this.options.sortBy ? ["", "random"] : this.options.sortBy.split("-"), D = "least" === F[0], F[1]) {
                        case "random":
                            t.data.sort(function() {
                                return .5 - Math.random()
                            });
                            break;
                        case "recent":
                            t.data = this._sortBy(t.data, "created_time", D);
                            break;
                        case "liked":
                            t.data = this._sortBy(t.data, "likes.count", D);
                            break;
                        case "commented":
                            t.data = this._sortBy(t.data, "comments.count", D);
                            break;
                        default:
                            throw new Error("Invalid option for sortBy: '" + this.options.sortBy + "'.")
                    }
                    if ("undefined" != typeof document && null !== document && this.options.mock === !1) {
                        if (y = t.data, O = parseInt(this.options.limit, 10), null != this.options.limit && y.length > O && (y = y.slice(0, O)), a = document.createDocumentFragment(), null != this.options.filter && "function" == typeof this.options.filter && (y = this._filter(y, this.options.filter)), null != this.options.template && "string" == typeof this.options.template) {
                            for (h = "", f = "", b = "", L = document.createElement("div"), p = 0, C = y.length; C > p; p++) {
                                if (u = y[p], d = u.images[this.options.resolution], "object" != typeof d) throw r = "No image found for resolution: " + this.options.resolution + ".", new Error(r);
                                x = d.width, v = d.height, w = "square", x > v && (w = "landscape"), v > x && (w = "portrait"), m = d.url, c = window.location.protocol.indexOf("http") >= 0, c && !this.options.useHttp && (m = m.replace(/https?:\/\//, "//")), f = this._makeTemplate(this.options.template, {
                                    model: u,
                                    id: u.id,
                                    link: u.link,
                                    type: u.type,
                                    image: m,
                                    width: x,
                                    height: v,
                                    orientation: w,
                                    caption: this._getObjectProperty(u, "caption.text"),
                                    likes: u.likes.count,
                                    comments: u.comments.count,
                                    location: this._getObjectProperty(u, "location.name")
                                }), h += f
                            }
                            for (L.innerHTML = h, o = [], n = 0, i = L.childNodes.length; i > n;) o.push(L.childNodes[n]), n += 1;
                            for (S = 0, E = o.length; E > S; S++) A = o[S], a.appendChild(A)
                        } else
                            for (k = 0, $ = y.length; $ > k; k++) {
                                if (u = y[k], g = document.createElement("img"), d = u.images[this.options.resolution], "object" != typeof d) throw r = "No image found for resolution: " + this.options.resolution + ".", new Error(r);
                                m = d.url, c = window.location.protocol.indexOf("http") >= 0, c && !this.options.useHttp && (m = m.replace(/https?:\/\//, "//")), g.src = m, this.options.links === !0 ? (e = document.createElement("a"), e.href = u.link, e.appendChild(g), a.appendChild(e)) : a.appendChild(g)
                            }
                        if (I = this.options.target, "string" == typeof I && (I = document.getElementById(I)), null == I) throw r = 'No element with id="' + this.options.target + '" on page.', new Error(r);
                        I.appendChild(a), l = document.getElementsByTagName("head")[0], l.removeChild(document.getElementById("instafeed-fetcher")), T = "instafeedCache" + this.unique, window[T] = void 0;
                        try {
                            delete window[T]
                        } catch (N) {
                            s = N
                        }
                    }
                    return null != this.options.after && "function" == typeof this.options.after && this.options.after.call(this), !0
                }, t.prototype._buildUrl = function() {
                    var t, e, i;
                    switch (t = "https://api.instagram.com/v1", this.options.get) {
                        case "popular":
                            e = "media/popular";
                            break;
                        case "tagged":
                            if (!this.options.tagName) throw new Error("No tag name specified. Use the 'tagName' option.");
                            e = "tags/" + this.options.tagName + "/media/recent";
                            break;
                        case "location":
                            if (!this.options.locationId) throw new Error("No location specified. Use the 'locationId' option.");
                            e = "locations/" + this.options.locationId + "/media/recent";
                            break;
                        case "user":
                            if (!this.options.userId) throw new Error("No user specified. Use the 'userId' option.");
                            e = "users/" + this.options.userId + "/media/recent";
                            break;
                        default:
                            throw new Error("Invalid option for get: '" + this.options.get + "'.")
                    }
                    return i = t + "/" + e, i += null != this.options.accessToken ? "?access_token=" + this.options.accessToken : "?client_id=" + this.options.clientId, null != this.options.limit && (i += "&count=" + this.options.limit), i += "&callback=instafeedCache" + this.unique + ".parse"
                }, t.prototype._genKey = function() {
                    var t;
                    return t = function() {
                        return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
                    }, "" + t() + t() + t() + t()
                }, t.prototype._makeTemplate = function(t, e) {
                    var i, n, o, s, r;
                    for (n = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/, i = t; n.test(i);) s = i.match(n)[1], r = null != (o = this._getObjectProperty(e, s)) ? o : "", i = i.replace(n, function() {
                        return "" + r
                    });
                    return i
                }, t.prototype._getObjectProperty = function(t, e) {
                    var i, n;
                    for (e = e.replace(/\[(\w+)\]/g, ".$1"), n = e.split("."); n.length;) {
                        if (i = n.shift(), !(null != t && i in t)) return null;
                        t = t[i]
                    }
                    return t
                }, t.prototype._sortBy = function(t, e, i) {
                    var n;
                    return n = function(t, n) {
                        var o, s;
                        return o = this._getObjectProperty(t, e), s = this._getObjectProperty(n, e), i ? o > s ? 1 : -1 : s > o ? 1 : -1
                    }, t.sort(n.bind(this)), t
                }, t.prototype._filter = function(t, e) {
                    var i, n, o, s, r;
                    for (i = [], n = function(t) {
                            return e(t) ? i.push(t) : void 0
                        }, o = 0, r = t.length; r > o; o++) s = t[o], n(s);
                    return i
                }, t
            }(),
            function(t, e) {
                return "function" == typeof define && define.amd ? define([], e) : "object" == typeof module && module.exports ? module.exports = e() : t.Instafeed = e()
            }(this, function() {
                return t
            })
    }.call(this),
    function() {
        "use strict";

        function t(n) {
            if (!n) throw new Error("No options passed to Waypoint constructor");
            if (!n.element) throw new Error("No element option passed to Waypoint constructor");
            if (!n.handler) throw new Error("No handler option passed to Waypoint constructor");
            this.key = "waypoint-" + e, this.options = t.Adapter.extend({}, t.defaults, n), this.element = this.options.element, this.adapter = new t.Adapter(this.element), this.callback = n.handler, this.axis = this.options.horizontal ? "horizontal" : "vertical", this.enabled = this.options.enabled, this.triggerPoint = null, this.group = t.Group.findOrCreate({
                name: this.options.group,
                axis: this.axis
            }), this.context = t.Context.findOrCreateByElement(this.options.context), t.offsetAliases[this.options.offset] && (this.options.offset = t.offsetAliases[this.options.offset]), this.group.add(this), this.context.add(this), i[this.key] = this, e += 1
        }
        var e = 0,
            i = {};
        t.prototype.queueTrigger = function(t) {
            this.group.queueTrigger(this, t)
        }, t.prototype.trigger = function(t) {
            this.enabled && this.callback && this.callback.apply(this, t)
        }, t.prototype.destroy = function() {
            this.context.remove(this), this.group.remove(this), delete i[this.key]
        }, t.prototype.disable = function() {
            return this.enabled = !1, this
        }, t.prototype.enable = function() {
            return this.context.refresh(), this.enabled = !0, this
        }, t.prototype.next = function() {
            return this.group.next(this)
        }, t.prototype.previous = function() {
            return this.group.previous(this)
        }, t.invokeAll = function(t) {
            var e = [];
            for (var n in i) e.push(i[n]);
            for (var o = 0, s = e.length; s > o; o++) e[o][t]()
        }, t.destroyAll = function() {
            t.invokeAll("destroy")
        }, t.disableAll = function() {
            t.invokeAll("disable")
        }, t.enableAll = function() {
            t.invokeAll("enable")
        }, t.refreshAll = function() {
            t.Context.refreshAll()
        }, t.viewportHeight = function() {
            return window.innerHeight || document.documentElement.clientHeight
        }, t.viewportWidth = function() {
            return document.documentElement.clientWidth
        }, t.adapters = [], t.defaults = {
            context: window,
            continuous: !0,
            enabled: !0,
            group: "default",
            horizontal: !1,
            offset: 0
        }, t.offsetAliases = {
            "bottom-in-view": function() {
                return this.context.innerHeight() - this.adapter.outerHeight()
            },
            "right-in-view": function() {
                return this.context.innerWidth() - this.adapter.outerWidth()
            }
        }, window.Waypoint = t
    }(),
    function() {
        "use strict";

        function t(t) {
            window.setTimeout(t, 1e3 / 60)
        }

        function e(t) {
            this.element = t, this.Adapter = o.Adapter, this.adapter = new this.Adapter(t), this.key = "waypoint-context-" + i, this.didScroll = !1, this.didResize = !1, this.oldScroll = {
                x: this.adapter.scrollLeft(),
                y: this.adapter.scrollTop()
            }, this.waypoints = {
                vertical: {},
                horizontal: {}
            }, t.waypointContextKey = this.key, n[t.waypointContextKey] = this, i += 1, this.createThrottledScrollHandler(), this.createThrottledResizeHandler()
        }
        var i = 0,
            n = {},
            o = window.Waypoint,
            s = window.onload;
        e.prototype.add = function(t) {
            var e = t.options.horizontal ? "horizontal" : "vertical";
            this.waypoints[e][t.key] = t, this.refresh()
        }, e.prototype.checkEmpty = function() {
            var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
                e = this.Adapter.isEmptyObject(this.waypoints.vertical);
            t && e && (this.adapter.off(".waypoints"), delete n[this.key])
        }, e.prototype.createThrottledResizeHandler = function() {
            function t() {
                e.handleResize(), e.didResize = !1
            }
            var e = this;
            this.adapter.on("resize.waypoints", function() {
                e.didResize || (e.didResize = !0, o.requestAnimationFrame(t))
            })
        }, e.prototype.createThrottledScrollHandler = function() {
            function t() {
                e.handleScroll(), e.didScroll = !1
            }
            var e = this;
            this.adapter.on("scroll.waypoints", function() {
                e.didScroll && !o.isTouch || (e.didScroll = !0, o.requestAnimationFrame(t))
            })
        }, e.prototype.handleResize = function() {
            o.Context.refreshAll()
        }, e.prototype.handleScroll = function() {
            var t = {},
                e = {
                    horizontal: {
                        newScroll: this.adapter.scrollLeft(),
                        oldScroll: this.oldScroll.x,
                        forward: "right",
                        backward: "left"
                    },
                    vertical: {
                        newScroll: this.adapter.scrollTop(),
                        oldScroll: this.oldScroll.y,
                        forward: "down",
                        backward: "up"
                    }
                };
            for (var i in e) {
                var n = e[i],
                    o = n.newScroll > n.oldScroll,
                    s = o ? n.forward : n.backward;
                for (var r in this.waypoints[i]) {
                    var a = this.waypoints[i][r],
                        l = n.oldScroll < a.triggerPoint,
                        h = n.newScroll >= a.triggerPoint,
                        c = l && h,
                        p = !l && !h;
                    (c || p) && (a.queueTrigger(s), t[a.group.id] = a.group)
                }
            }
            for (var u in t) t[u].flushTriggers();
            this.oldScroll = {
                x: e.horizontal.newScroll,
                y: e.vertical.newScroll
            }
        }, e.prototype.innerHeight = function() {
            return this.element == this.element.window ? o.viewportHeight() : this.adapter.innerHeight()
        }, e.prototype.remove = function(t) {
            delete this.waypoints[t.axis][t.key], this.checkEmpty()
        }, e.prototype.innerWidth = function() {
            return this.element == this.element.window ? o.viewportWidth() : this.adapter.innerWidth()
        }, e.prototype.destroy = function() {
            var t = [];
            for (var e in this.waypoints)
                for (var i in this.waypoints[e]) t.push(this.waypoints[e][i]);
            for (var n = 0, o = t.length; o > n; n++) t[n].destroy()
        }, e.prototype.refresh = function() {
            var t, e = this.element == this.element.window,
                i = e ? void 0 : this.adapter.offset(),
                n = {};
            this.handleScroll(), t = {
                horizontal: {
                    contextOffset: e ? 0 : i.left,
                    contextScroll: e ? 0 : this.oldScroll.x,
                    contextDimension: this.innerWidth(),
                    oldScroll: this.oldScroll.x,
                    forward: "right",
                    backward: "left",
                    offsetProp: "left"
                },
                vertical: {
                    contextOffset: e ? 0 : i.top,
                    contextScroll: e ? 0 : this.oldScroll.y,
                    contextDimension: this.innerHeight(),
                    oldScroll: this.oldScroll.y,
                    forward: "down",
                    backward: "up",
                    offsetProp: "top"
                }
            };
            for (var s in t) {
                var r = t[s];
                for (var a in this.waypoints[s]) {
                    var l, h, c, p, u, d = this.waypoints[s][a],
                        f = d.options.offset,
                        m = d.triggerPoint,
                        y = 0,
                        g = null == m;
                    d.element !== d.element.window && (y = d.adapter.offset()[r.offsetProp]), "function" == typeof f ? f = f.apply(d) : "string" == typeof f && (f = parseFloat(f), d.options.offset.indexOf("%") > -1 && (f = Math.ceil(r.contextDimension * f / 100))), l = r.contextScroll - r.contextOffset, d.triggerPoint = y + l - f, h = m < r.oldScroll, c = d.triggerPoint >= r.oldScroll, p = h && c, u = !h && !c, !g && p ? (d.queueTrigger(r.backward), n[d.group.id] = d.group) : !g && u ? (d.queueTrigger(r.forward), n[d.group.id] = d.group) : g && r.oldScroll >= d.triggerPoint && (d.queueTrigger(r.forward), n[d.group.id] = d.group)
                }
            }
            return o.requestAnimationFrame(function() {
                for (var t in n) n[t].flushTriggers()
            }), this
        }, e.findOrCreateByElement = function(t) {
            return e.findByElement(t) || new e(t)
        }, e.refreshAll = function() {
            for (var t in n) n[t].refresh()
        }, e.findByElement = function(t) {
            return n[t.waypointContextKey]
        }, window.onload = function() {
            s && s(), e.refreshAll()
        }, o.requestAnimationFrame = function(e) {
            var i = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || t;
            i.call(window, e)
        }, o.Context = e
    }(),
    function() {
        "use strict";

        function t(t, e) {
            return t.triggerPoint - e.triggerPoint
        }

        function e(t, e) {
            return e.triggerPoint - t.triggerPoint
        }

        function i(t) {
            this.name = t.name, this.axis = t.axis, this.id = this.name + "-" + this.axis, this.waypoints = [], this.clearTriggerQueues(), n[this.axis][this.name] = this
        }
        var n = {
                vertical: {},
                horizontal: {}
            },
            o = window.Waypoint;
        i.prototype.add = function(t) {
            this.waypoints.push(t)
        }, i.prototype.clearTriggerQueues = function() {
            this.triggerQueues = {
                up: [],
                down: [],
                left: [],
                right: []
            }
        }, i.prototype.flushTriggers = function() {
            for (var i in this.triggerQueues) {
                var n = this.triggerQueues[i],
                    o = "up" === i || "left" === i;
                n.sort(o ? e : t);
                for (var s = 0, r = n.length; r > s; s += 1) {
                    var a = n[s];
                    (a.options.continuous || s === n.length - 1) && a.trigger([i])
                }
            }
            this.clearTriggerQueues()
        }, i.prototype.next = function(e) {
            this.waypoints.sort(t);
            var i = o.Adapter.inArray(e, this.waypoints),
                n = i === this.waypoints.length - 1;
            return n ? null : this.waypoints[i + 1]
        }, i.prototype.previous = function(e) {
            this.waypoints.sort(t);
            var i = o.Adapter.inArray(e, this.waypoints);
            return i ? this.waypoints[i - 1] : null
        }, i.prototype.queueTrigger = function(t, e) {
            this.triggerQueues[e].push(t)
        }, i.prototype.remove = function(t) {
            var e = o.Adapter.inArray(t, this.waypoints);
            e > -1 && this.waypoints.splice(e, 1)
        }, i.prototype.first = function() {
            return this.waypoints[0]
        }, i.prototype.last = function() {
            return this.waypoints[this.waypoints.length - 1]
        }, i.findOrCreate = function(t) {
            return n[t.axis][t.name] || new i(t)
        }, o.Group = i
    }(),
    function() {
        "use strict";

        function t(t) {
            return t === t.window
        }

        function e(e) {
            return t(e) ? e : e.defaultView
        }

        function i(t) {
            this.element = t, this.handlers = {}
        }
        var n = window.Waypoint;
        i.prototype.innerHeight = function() {
            var e = t(this.element);
            return e ? this.element.innerHeight : this.element.clientHeight
        }, i.prototype.innerWidth = function() {
            var e = t(this.element);
            return e ? this.element.innerWidth : this.element.clientWidth
        }, i.prototype.off = function(t, e) {
            function i(t, e, i) {
                for (var n = 0, o = e.length - 1; o > n; n++) {
                    var s = e[n];
                    i && i !== s || t.removeEventListener(s)
                }
            }
            var n = t.split("."),
                o = n[0],
                s = n[1],
                r = this.element;
            if (s && this.handlers[s] && o) i(r, this.handlers[s][o], e), this.handlers[s][o] = [];
            else if (o)
                for (var a in this.handlers) i(r, this.handlers[a][o] || [], e), this.handlers[a][o] = [];
            else if (s && this.handlers[s]) {
                for (var l in this.handlers[s]) i(r, this.handlers[s][l], e);
                this.handlers[s] = {}
            }
        }, i.prototype.offset = function() {
            if (!this.element.ownerDocument) return null;
            var t = this.element.ownerDocument.documentElement,
                i = e(this.element.ownerDocument),
                n = {
                    top: 0,
                    left: 0
                };
            return this.element.getBoundingClientRect && (n = this.element.getBoundingClientRect()), {
                top: n.top + i.pageYOffset - t.clientTop,
                left: n.left + i.pageXOffset - t.clientLeft
            }
        }, i.prototype.on = function(t, e) {
            var i = t.split("."),
                n = i[0],
                o = i[1] || "__default",
                s = this.handlers[o] = this.handlers[o] || {},
                r = s[n] = s[n] || [];
            r.push(e), this.element.addEventListener(n, e)
        }, i.prototype.outerHeight = function(e) {
            var i, n = this.innerHeight();
            return e && !t(this.element) && (i = window.getComputedStyle(this.element), n += parseInt(i.marginTop, 10), n += parseInt(i.marginBottom, 10)), n
        }, i.prototype.outerWidth = function(e) {
            var i, n = this.innerWidth();
            return e && !t(this.element) && (i = window.getComputedStyle(this.element), n += parseInt(i.marginLeft, 10), n += parseInt(i.marginRight, 10)), n
        }, i.prototype.scrollLeft = function() {
            var t = e(this.element);
            return t ? t.pageXOffset : this.element.scrollLeft
        }, i.prototype.scrollTop = function() {
            var t = e(this.element);
            return t ? t.pageYOffset : this.element.scrollTop
        }, i.extend = function() {
            function t(t, e) {
                if ("object" == typeof t && "object" == typeof e)
                    for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                return t
            }
            for (var e = Array.prototype.slice.call(arguments), i = 1, n = e.length; n > i; i++) t(e[0], e[i]);
            return e[0]
        }, i.inArray = function(t, e, i) {
            return null == e ? -1 : e.indexOf(t, i)
        }, i.isEmptyObject = function(t) {
            for (var e in t) return !1;
            return !0
        }, n.adapters.push({
            name: "noframework",
            Adapter: i
        }), n.Adapter = i
    }(),
    function() {
        var t, e, i, n, o, s, r, a, l, h, c, p, u, d, f, m, y, g, v, w, b, x, T, S, k, C, E, $, A, O, D, F, I, L, N, P, M, X, Y, R, _, z, q, W, B, H, j, U, V, Q = [].slice,
            K = {}.hasOwnProperty,
            G = function(t, e) {
                function i() {
                    this.constructor = t
                }
                for (var n in e) K.call(e, n) && (t[n] = e[n]);
                return i.prototype = e.prototype, t.prototype = new i, t.__super__ = e.prototype, t
            },
            Z = [].indexOf || function(t) {
                for (var e = 0, i = this.length; i > e; e++)
                    if (e in this && this[e] === t) return e;
                return -1
            };
        for (b = {
                catchupTime: 100,
                initialRate: .03,
                minTime: 250,
                ghostTime: 100,
                maxProgressPerFrame: 20,
                easeFactor: 1.25,
                startOnPageLoad: !0,
                restartOnPushState: !0,
                restartOnRequestAfter: 500,
                target: "body",
                elements: {
                    checkInterval: 100,
                    selectors: ["body"]
                },
                eventLag: {
                    minSamples: 10,
                    sampleCount: 3,
                    lagThreshold: 3
                },
                ajax: {
                    trackMethods: ["GET"],
                    trackWebSockets: !0,
                    ignoreURLs: []
                }
            }, A = function() {
                var t;
                return null != (t = "undefined" != typeof performance && null !== performance && "function" == typeof performance.now ? performance.now() : void 0) ? t : +new Date
            }, D = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame, w = window.cancelAnimationFrame || window.mozCancelAnimationFrame, null == D && (D = function(t) {
                return setTimeout(t, 50)
            }, w = function(t) {
                return clearTimeout(t)
            }), I = function(t) {
                var e, i;
                return e = A(), (i = function() {
                    var n;
                    return n = A() - e, n >= 33 ? (e = A(), t(n, function() {
                        return D(i)
                    })) : setTimeout(i, 33 - n)
                })()
            }, F = function() {
                var t, e, i;
                return i = arguments[0], e = arguments[1], t = 3 <= arguments.length ? Q.call(arguments, 2) : [], "function" == typeof i[e] ? i[e].apply(i, t) : i[e]
            }, x = function() {
                var t, e, i, n, o, s, r;
                for (e = arguments[0], n = 2 <= arguments.length ? Q.call(arguments, 1) : [], s = 0, r = n.length; r > s; s++)
                    if (i = n[s])
                        for (t in i) K.call(i, t) && (o = i[t], null != e[t] && "object" == typeof e[t] && null != o && "object" == typeof o ? x(e[t], o) : e[t] = o);
                return e
            }, y = function(t) {
                var e, i, n, o, s;
                for (i = e = 0, o = 0, s = t.length; s > o; o++) n = t[o], i += Math.abs(n), e++;
                return i / e
            }, S = function(t, e) {
                var i, n, o;
                if (null == t && (t = "options"), null == e && (e = !0), o = document.querySelector("[data-pace-" + t + "]")) {
                    if (i = o.getAttribute("data-pace-" + t), !e) return i;
                    try {
                        return JSON.parse(i)
                    } catch (s) {
                        return n = s, "undefined" != typeof console && null !== console ? console.error("Error parsing inline pace options", n) : void 0
                    }
                }
            }, r = function() {
                function t() {}
                return t.prototype.on = function(t, e, i, n) {
                    var o;
                    return null == n && (n = !1), null == this.bindings && (this.bindings = {}), null == (o = this.bindings)[t] && (o[t] = []), this.bindings[t].push({
                        handler: e,
                        ctx: i,
                        once: n
                    })
                }, t.prototype.once = function(t, e, i) {
                    return this.on(t, e, i, !0)
                }, t.prototype.off = function(t, e) {
                    var i, n, o;
                    if (null != (null != (n = this.bindings) ? n[t] : void 0)) {
                        if (null == e) return delete this.bindings[t];
                        for (i = 0, o = []; i < this.bindings[t].length;) this.bindings[t][i].handler === e ? o.push(this.bindings[t].splice(i, 1)) : o.push(i++);
                        return o
                    }
                }, t.prototype.trigger = function() {
                    var t, e, i, n, o, s, r, a, l;
                    if (i = arguments[0], t = 2 <= arguments.length ? Q.call(arguments, 1) : [], null != (r = this.bindings) ? r[i] : void 0) {
                        for (o = 0, l = []; o < this.bindings[i].length;) a = this.bindings[i][o], n = a.handler, e = a.ctx, s = a.once, n.apply(null != e ? e : this, t), s ? l.push(this.bindings[i].splice(o, 1)) : l.push(o++);
                        return l
                    }
                }, t
            }(), h = window.Pace || {}, window.Pace = h, x(h, r.prototype), O = h.options = x({}, b, window.paceOptions, S()), j = ["ajax", "document", "eventLag", "elements"], q = 0, B = j.length; B > q; q++) M = j[q], O[M] === !0 && (O[M] = b[M]);
        l = function(t) {
            function e() {
                return U = e.__super__.constructor.apply(this, arguments)
            }
            return G(e, t), e
        }(Error), e = function() {
            function t() {
                this.progress = 0
            }
            return t.prototype.getElement = function() {
                var t;
                if (null == this.el) {
                    if (t = document.querySelector(O.target), !t) throw new l;
                    this.el = document.createElement("div"), this.el.className = "pace pace-active", document.body.className = document.body.className.replace(/pace-done/g, ""), document.body.className += " pace-running", this.el.innerHTML = '<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>', null != t.firstChild ? t.insertBefore(this.el, t.firstChild) : t.appendChild(this.el)
                }
                return this.el
            }, t.prototype.finish = function() {
                var t;
                return t = this.getElement(), t.className = t.className.replace("pace-active", ""), t.className += " pace-inactive", document.body.className = document.body.className.replace("pace-running", ""), document.body.className += " pace-done"
            }, t.prototype.update = function(t) {
                return this.progress = t, this.render()
            }, t.prototype.destroy = function() {
                try {
                    this.getElement().parentNode.removeChild(this.getElement())
                } catch (t) {
                    l = t
                }
                return this.el = void 0
            }, t.prototype.render = function() {
                var t, e, i, n, o, s, r;
                if (null == document.querySelector(O.target)) return !1;
                for (t = this.getElement(), n = "translate3d(" + this.progress + "%, 0, 0)", r = ["webkitTransform", "msTransform", "transform"], o = 0, s = r.length; s > o; o++) e = r[o], t.children[0].style[e] = n;
                return (!this.lastRenderedProgress || this.lastRenderedProgress | 0 !== this.progress | 0) && (t.children[0].setAttribute("data-progress-text", "" + (0 | this.progress) + "%"), this.progress >= 100 ? i = "99" : (i = this.progress < 10 ? "0" : "", i += 0 | this.progress), t.children[0].setAttribute("data-progress", "" + i)), this.lastRenderedProgress = this.progress
            }, t.prototype.done = function() {
                return this.progress >= 100
            }, t
        }(), a = function() {
            function t() {
                this.bindings = {}
            }
            return t.prototype.trigger = function(t, e) {
                var i, n, o, s, r;
                if (null != this.bindings[t]) {
                    for (s = this.bindings[t], r = [], n = 0, o = s.length; o > n; n++) i = s[n], r.push(i.call(this, e));
                    return r
                }
            }, t.prototype.on = function(t, e) {
                var i;
                return null == (i = this.bindings)[t] && (i[t] = []), this.bindings[t].push(e)
            }, t
        }(), z = window.XMLHttpRequest, _ = window.XDomainRequest, R = window.WebSocket, T = function(t, e) {
            var i, n, o;
            o = [];
            for (n in e.prototype) try {
                null == t[n] && "function" != typeof e[n] ? "function" == typeof Object.defineProperty ? o.push(Object.defineProperty(t, n, {
                    get: function() {
                        return e.prototype[n]
                    },
                    configurable: !0,
                    enumerable: !0
                })) : o.push(t[n] = e.prototype[n]) : o.push(void 0)
            } catch (s) {
                i = s
            }
            return o
        }, E = [], h.ignore = function() {
            var t, e, i;
            return e = arguments[0], t = 2 <= arguments.length ? Q.call(arguments, 1) : [], E.unshift("ignore"), i = e.apply(null, t), E.shift(), i
        }, h.track = function() {
            var t, e, i;
            return e = arguments[0], t = 2 <= arguments.length ? Q.call(arguments, 1) : [], E.unshift("track"), i = e.apply(null, t), E.shift(), i
        }, P = function(t) {
            var e;
            if (null == t && (t = "GET"), "track" === E[0]) return "force";
            if (!E.length && O.ajax) {
                if ("socket" === t && O.ajax.trackWebSockets) return !0;
                if (e = t.toUpperCase(), Z.call(O.ajax.trackMethods, e) >= 0) return !0
            }
            return !1
        }, c = function(t) {
            function e() {
                var t, i = this;
                e.__super__.constructor.apply(this, arguments), t = function(t) {
                    var e;
                    return e = t.open, t.open = function(n, o, s) {
                        return P(n) && i.trigger("request", {
                            type: n,
                            url: o,
                            request: t
                        }), e.apply(t, arguments)
                    }
                }, window.XMLHttpRequest = function(e) {
                    var i;
                    return i = new z(e), t(i), i
                };
                try {
                    T(window.XMLHttpRequest, z)
                } catch (n) {}
                if (null != _) {
                    window.XDomainRequest = function() {
                        var e;
                        return e = new _, t(e), e
                    };
                    try {
                        T(window.XDomainRequest, _)
                    } catch (n) {}
                }
                if (null != R && O.ajax.trackWebSockets) {
                    window.WebSocket = function(t, e) {
                        var n;
                        return n = null != e ? new R(t, e) : new R(t), P("socket") && i.trigger("request", {
                            type: "socket",
                            url: t,
                            protocols: e,
                            request: n
                        }), n
                    };
                    try {
                        T(window.WebSocket, R)
                    } catch (n) {}
                }
            }
            return G(e, t), e
        }(a), W = null, k = function() {
            return null == W && (W = new c), W
        }, N = function(t) {
            var e, i, n, o;
            for (o = O.ajax.ignoreURLs, i = 0, n = o.length; n > i; i++)
                if (e = o[i], "string" == typeof e) {
                    if (-1 !== t.indexOf(e)) return !0
                } else if (e.test(t)) return !0;
            return !1
        }, k().on("request", function(e) {
            var i, n, o, s, r;
            return s = e.type, o = e.request, r = e.url, N(r) ? void 0 : h.running || O.restartOnRequestAfter === !1 && "force" !== P(s) ? void 0 : (n = arguments, i = O.restartOnRequestAfter || 0, "boolean" == typeof i && (i = 0), setTimeout(function() {
                var e, i, r, a, l, c;
                if (e = "socket" === s ? o.readyState < 2 : 0 < (a = o.readyState) && 4 > a) {
                    for (h.restart(), l = h.sources, c = [], i = 0, r = l.length; r > i; i++) {
                        if (M = l[i], M instanceof t) {
                            M.watch.apply(M, n);
                            break
                        }
                        c.push(void 0)
                    }
                    return c
                }
            }, i))
        }), t = function() {
            function t() {
                var t = this;
                this.elements = [], k().on("request", function() {
                    return t.watch.apply(t, arguments)
                })
            }
            return t.prototype.watch = function(t) {
                var e, i, n, o;
                return n = t.type, e = t.request, o = t.url, N(o) ? void 0 : (i = "socket" === n ? new d(e) : new f(e), this.elements.push(i))
            }, t
        }(), f = function() {
            function t(t) {
                var e, i, n, o, s, r, a = this;
                if (this.progress = 0, null != window.ProgressEvent)
                    for (i = null, t.addEventListener("progress", function(t) {
                            return t.lengthComputable ? a.progress = 100 * t.loaded / t.total : a.progress = a.progress + (100 - a.progress) / 2
                        }, !1), r = ["load", "abort", "timeout", "error"], n = 0, o = r.length; o > n; n++) e = r[n], t.addEventListener(e, function() {
                        return a.progress = 100
                    }, !1);
                else s = t.onreadystatechange, t.onreadystatechange = function() {
                    var e;
                    return 0 === (e = t.readyState) || 4 === e ? a.progress = 100 : 3 === t.readyState && (a.progress = 50), "function" == typeof s ? s.apply(null, arguments) : void 0
                }
            }
            return t
        }(), d = function() {
            function t(t) {
                var e, i, n, o, s = this;
                for (this.progress = 0, o = ["error", "open"], i = 0, n = o.length; n > i; i++) e = o[i],
                    t.addEventListener(e, function() {
                        return s.progress = 100
                    }, !1)
            }
            return t
        }(), n = function() {
            function t(t) {
                var e, i, n, s;
                for (null == t && (t = {}), this.elements = [], null == t.selectors && (t.selectors = []), s = t.selectors, i = 0, n = s.length; n > i; i++) e = s[i], this.elements.push(new o(e))
            }
            return t
        }(), o = function() {
            function t(t) {
                this.selector = t, this.progress = 0, this.check()
            }
            return t.prototype.check = function() {
                var t = this;
                return document.querySelector(this.selector) ? this.done() : setTimeout(function() {
                    return t.check()
                }, O.elements.checkInterval)
            }, t.prototype.done = function() {
                return this.progress = 100
            }, t
        }(), i = function() {
            function t() {
                var t, e, i = this;
                this.progress = null != (e = this.states[document.readyState]) ? e : 100, t = document.onreadystatechange, document.onreadystatechange = function() {
                    return null != i.states[document.readyState] && (i.progress = i.states[document.readyState]), "function" == typeof t ? t.apply(null, arguments) : void 0
                }
            }
            return t.prototype.states = {
                loading: 0,
                interactive: 50,
                complete: 100
            }, t
        }(), s = function() {
            function t() {
                var t, e, i, n, o, s = this;
                this.progress = 0, t = 0, o = [], n = 0, i = A(), e = setInterval(function() {
                    var r;
                    return r = A() - i - 50, i = A(), o.push(r), o.length > O.eventLag.sampleCount && o.shift(), t = y(o), ++n >= O.eventLag.minSamples && t < O.eventLag.lagThreshold ? (s.progress = 100, clearInterval(e)) : s.progress = 100 * (3 / (t + 3))
                }, 50)
            }
            return t
        }(), u = function() {
            function t(t) {
                this.source = t, this.last = this.sinceLastUpdate = 0, this.rate = O.initialRate, this.catchup = 0, this.progress = this.lastProgress = 0, null != this.source && (this.progress = F(this.source, "progress"))
            }
            return t.prototype.tick = function(t, e) {
                var i;
                return null == e && (e = F(this.source, "progress")), e >= 100 && (this.done = !0), e === this.last ? this.sinceLastUpdate += t : (this.sinceLastUpdate && (this.rate = (e - this.last) / this.sinceLastUpdate), this.catchup = (e - this.progress) / O.catchupTime, this.sinceLastUpdate = 0, this.last = e), e > this.progress && (this.progress += this.catchup * t), i = 1 - Math.pow(this.progress / 100, O.easeFactor), this.progress += i * this.rate * t, this.progress = Math.min(this.lastProgress + O.maxProgressPerFrame, this.progress), this.progress = Math.max(0, this.progress), this.progress = Math.min(100, this.progress), this.lastProgress = this.progress, this.progress
            }, t
        }(), X = null, L = null, g = null, Y = null, m = null, v = null, h.running = !1, C = function() {
            return O.restartOnPushState ? h.restart() : void 0
        }, null != window.history.pushState && (H = window.history.pushState, window.history.pushState = function() {
            return C(), H.apply(window.history, arguments)
        }), null != window.history.replaceState && (V = window.history.replaceState, window.history.replaceState = function() {
            return C(), V.apply(window.history, arguments)
        }), p = {
            ajax: t,
            elements: n,
            document: i,
            eventLag: s
        }, ($ = function() {
            var t, i, n, o, s, r, a, l;
            for (h.sources = X = [], r = ["ajax", "elements", "document", "eventLag"], i = 0, o = r.length; o > i; i++) t = r[i], O[t] !== !1 && X.push(new p[t](O[t]));
            for (l = null != (a = O.extraSources) ? a : [], n = 0, s = l.length; s > n; n++) M = l[n], X.push(new M(O));
            return h.bar = g = new e, L = [], Y = new u
        })(), h.stop = function() {
            return h.trigger("stop"), h.running = !1, g.destroy(), v = !0, null != m && ("function" == typeof w && w(m), m = null), $()
        }, h.restart = function() {
            return h.trigger("restart"), h.stop(), h.start()
        }, h.go = function() {
            var t;
            return h.running = !0, g.render(), t = A(), v = !1, m = I(function(e, i) {
                var n, o, s, r, a, l, c, p, d, f, m, y, w, b, x, T;
                for (p = 100 - g.progress, o = m = 0, s = !0, l = y = 0, b = X.length; b > y; l = ++y)
                    for (M = X[l], f = null != L[l] ? L[l] : L[l] = [], a = null != (T = M.elements) ? T : [M], c = w = 0, x = a.length; x > w; c = ++w) r = a[c], d = null != f[c] ? f[c] : f[c] = new u(r), s &= d.done, d.done || (o++, m += d.tick(e));
                return n = m / o, g.update(Y.tick(e, n)), g.done() || s || v ? (g.update(100), h.trigger("done"), setTimeout(function() {
                    return g.finish(), h.running = !1, h.trigger("hide")
                }, Math.max(O.ghostTime, Math.max(O.minTime - (A() - t), 0)))) : i()
            })
        }, h.start = function(t) {
            x(O, t), h.running = !0;
            try {
                g.render()
            } catch (e) {
                l = e
            }
            return document.querySelector(".pace") ? (h.trigger("start"), h.go()) : setTimeout(h.start, 50)
        }, "function" == typeof define && define.amd ? define(["pace"], function() {
            return h
        }) : "object" == typeof exports ? module.exports = h : O.startOnPageLoad && h.start()
    }.call(this), + function(t) {
        "use strict";

        function e() {
            var t = document.createElement("bootstrap"),
                e = {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "oTransitionEnd otransitionend",
                    transition: "transitionend"
                };
            for (var i in e)
                if (void 0 !== t.style[i]) return {
                    end: e[i]
                };
            return !1
        }
        t.fn.emulateTransitionEnd = function(e) {
            var i = !1,
                n = this;
            t(this).one("bsTransitionEnd", function() {
                i = !0
            });
            var o = function() {
                i || t(n).trigger(t.support.transition.end)
            };
            return setTimeout(o, e), this
        }, t(function() {
            t.support.transition = e(), t.support.transition && (t.event.special.bsTransitionEnd = {
                bindType: t.support.transition.end,
                delegateType: t.support.transition.end,
                handle: function(e) {
                    return t(e.target).is(this) ? e.handleObj.handler.apply(this, arguments) : void 0
                }
            })
        })
    }(jQuery), + function(t) {
        "use strict";

        function e(e) {
            return this.each(function() {
                var i = t(this),
                    o = i.data("bs.alert");
                o || i.data("bs.alert", o = new n(this)), "string" == typeof e && o[e].call(i)
            })
        }
        var i = '[data-dismiss="alert"]',
            n = function(e) {
                t(e).on("click", i, this.close)
            };
        n.VERSION = "3.3.6", n.TRANSITION_DURATION = 150, n.prototype.close = function(e) {
            function i() {
                r.detach().trigger("closed.bs.alert").remove()
            }
            var o = t(this),
                s = o.attr("data-target");
            s || (s = o.attr("href"), s = s && s.replace(/.*(?=#[^\s]*$)/, ""));
            var r = t(s);
            e && e.preventDefault(), r.length || (r = o.closest(".alert")), r.trigger(e = t.Event("close.bs.alert")), e.isDefaultPrevented() || (r.removeClass("in"), t.support.transition && r.hasClass("fade") ? r.one("bsTransitionEnd", i).emulateTransitionEnd(n.TRANSITION_DURATION) : i())
        };
        var o = t.fn.alert;
        t.fn.alert = e, t.fn.alert.Constructor = n, t.fn.alert.noConflict = function() {
            return t.fn.alert = o, this
        }, t(document).on("click.bs.alert.data-api", i, n.prototype.close)
    }(jQuery), + function(t) {
        "use strict";

        function e(e) {
            return this.each(function() {
                var n = t(this),
                    o = n.data("bs.button"),
                    s = "object" == typeof e && e;
                o || n.data("bs.button", o = new i(this, s)), "toggle" == e ? o.toggle() : e && o.setState(e)
            })
        }
        var i = function(e, n) {
            this.$element = t(e), this.options = t.extend({}, i.DEFAULTS, n), this.isLoading = !1
        };
        i.VERSION = "3.3.6", i.DEFAULTS = {
            loadingText: "loading..."
        }, i.prototype.setState = function(e) {
            var i = "disabled",
                n = this.$element,
                o = n.is("input") ? "val" : "html",
                s = n.data();
            e += "Text", null == s.resetText && n.data("resetText", n[o]()), setTimeout(t.proxy(function() {
                n[o](null == s[e] ? this.options[e] : s[e]), "loadingText" == e ? (this.isLoading = !0, n.addClass(i).attr(i, i)) : this.isLoading && (this.isLoading = !1, n.removeClass(i).removeAttr(i))
            }, this), 0)
        }, i.prototype.toggle = function() {
            var t = !0,
                e = this.$element.closest('[data-toggle="buttons"]');
            if (e.length) {
                var i = this.$element.find("input");
                "radio" == i.prop("type") ? (i.prop("checked") && (t = !1), e.find(".active").removeClass("active"), this.$element.addClass("active")) : "checkbox" == i.prop("type") && (i.prop("checked") !== this.$element.hasClass("active") && (t = !1), this.$element.toggleClass("active")), i.prop("checked", this.$element.hasClass("active")), t && i.trigger("change")
            } else this.$element.attr("aria-pressed", !this.$element.hasClass("active")), this.$element.toggleClass("active")
        };
        var n = t.fn.button;
        t.fn.button = e, t.fn.button.Constructor = i, t.fn.button.noConflict = function() {
            return t.fn.button = n, this
        }, t(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function(i) {
            var n = t(i.target);
            n.hasClass("btn") || (n = n.closest(".btn")), e.call(n, "toggle"), t(i.target).is('input[type="radio"]') || t(i.target).is('input[type="checkbox"]') || i.preventDefault()
        }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function(e) {
            t(e.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(e.type))
        })
    }(jQuery), + function(t) {
        "use strict";

        function e(e) {
            return this.each(function() {
                var n = t(this),
                    o = n.data("bs.carousel"),
                    s = t.extend({}, i.DEFAULTS, n.data(), "object" == typeof e && e),
                    r = "string" == typeof e ? e : s.slide;
                o || n.data("bs.carousel", o = new i(this, s)), "number" == typeof e ? o.to(e) : r ? o[r]() : s.interval && o.pause().cycle()
            })
        }
        var i = function(e, i) {
            this.$element = t(e), this.$indicators = this.$element.find(".carousel-indicators"), this.options = i, this.paused = null, this.sliding = null, this.interval = null, this.$active = null, this.$items = null, this.options.keyboard && this.$element.on("keydown.bs.carousel", t.proxy(this.keydown, this)), "hover" == this.options.pause && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", t.proxy(this.pause, this)).on("mouseleave.bs.carousel", t.proxy(this.cycle, this))
        };
        i.VERSION = "3.3.6", i.TRANSITION_DURATION = 600, i.DEFAULTS = {
            interval: 5e3,
            pause: "hover",
            wrap: !0,
            keyboard: !0
        }, i.prototype.keydown = function(t) {
            if (!/input|textarea/i.test(t.target.tagName)) {
                switch (t.which) {
                    case 37:
                        this.prev();
                        break;
                    case 39:
                        this.next();
                        break;
                    default:
                        return
                }
                t.preventDefault()
            }
        }, i.prototype.cycle = function(e) {
            return e || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(t.proxy(this.next, this), this.options.interval)), this
        }, i.prototype.getItemIndex = function(t) {
            return this.$items = t.parent().children(".item"), this.$items.index(t || this.$active)
        }, i.prototype.getItemForDirection = function(t, e) {
            var i = this.getItemIndex(e),
                n = "prev" == t && 0 === i || "next" == t && i == this.$items.length - 1;
            if (n && !this.options.wrap) return e;
            var o = "prev" == t ? -1 : 1,
                s = (i + o) % this.$items.length;
            return this.$items.eq(s)
        }, i.prototype.to = function(t) {
            var e = this,
                i = this.getItemIndex(this.$active = this.$element.find(".item.active"));
            return t > this.$items.length - 1 || 0 > t ? void 0 : this.sliding ? this.$element.one("slid.bs.carousel", function() {
                e.to(t)
            }) : i == t ? this.pause().cycle() : this.slide(t > i ? "next" : "prev", this.$items.eq(t))
        }, i.prototype.pause = function(e) {
            return e || (this.paused = !0), this.$element.find(".next, .prev").length && t.support.transition && (this.$element.trigger(t.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
        }, i.prototype.next = function() {
            return this.sliding ? void 0 : this.slide("next")
        }, i.prototype.prev = function() {
            return this.sliding ? void 0 : this.slide("prev")
        }, i.prototype.slide = function(e, n) {
            var o = this.$element.find(".item.active"),
                s = n || this.getItemForDirection(e, o),
                r = this.interval,
                a = "next" == e ? "left" : "right",
                l = this;
            if (s.hasClass("active")) return this.sliding = !1;
            var h = s[0],
                c = t.Event("slide.bs.carousel", {
                    relatedTarget: h,
                    direction: a
                });
            if (this.$element.trigger(c), !c.isDefaultPrevented()) {
                if (this.sliding = !0, r && this.pause(), this.$indicators.length) {
                    this.$indicators.find(".active").removeClass("active");
                    var p = t(this.$indicators.children()[this.getItemIndex(s)]);
                    p && p.addClass("active")
                }
                var u = t.Event("slid.bs.carousel", {
                    relatedTarget: h,
                    direction: a
                });
                return t.support.transition && this.$element.hasClass("slide") ? (s.addClass(e), s[0].offsetWidth, o.addClass(a), s.addClass(a), o.one("bsTransitionEnd", function() {
                    s.removeClass([e, a].join(" ")).addClass("active"), o.removeClass(["active", a].join(" ")), l.sliding = !1, setTimeout(function() {
                        l.$element.trigger(u)
                    }, 0)
                }).emulateTransitionEnd(i.TRANSITION_DURATION)) : (o.removeClass("active"), s.addClass("active"), this.sliding = !1, this.$element.trigger(u)), r && this.cycle(), this
            }
        };
        var n = t.fn.carousel;
        t.fn.carousel = e, t.fn.carousel.Constructor = i, t.fn.carousel.noConflict = function() {
            return t.fn.carousel = n, this
        };
        var o = function(i) {
            var n, o = t(this),
                s = t(o.attr("data-target") || (n = o.attr("href")) && n.replace(/.*(?=#[^\s]+$)/, ""));
            if (s.hasClass("carousel")) {
                var r = t.extend({}, s.data(), o.data()),
                    a = o.attr("data-slide-to");
                a && (r.interval = !1), e.call(s, r), a && s.data("bs.carousel").to(a), i.preventDefault()
            }
        };
        t(document).on("click.bs.carousel.data-api", "[data-slide]", o).on("click.bs.carousel.data-api", "[data-slide-to]", o), t(window).on("load", function() {
            t('[data-ride="carousel"]').each(function() {
                var i = t(this);
                e.call(i, i.data())
            })
        })
    }(jQuery), + function(t) {
        "use strict";

        function e(e) {
            var i, n = e.attr("data-target") || (i = e.attr("href")) && i.replace(/.*(?=#[^\s]+$)/, "");
            return t(n)
        }

        function i(e) {
            return this.each(function() {
                var i = t(this),
                    o = i.data("bs.collapse"),
                    s = t.extend({}, n.DEFAULTS, i.data(), "object" == typeof e && e);
                !o && s.toggle && /show|hide/.test(e) && (s.toggle = !1), o || i.data("bs.collapse", o = new n(this, s)), "string" == typeof e && o[e]()
            })
        }
        var n = function(e, i) {
            this.$element = t(e), this.options = t.extend({}, n.DEFAULTS, i), this.$trigger = t('[data-toggle="collapse"][href="#' + e.id + '"],[data-toggle="collapse"][data-target="#' + e.id + '"]'), this.transitioning = null, this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger), this.options.toggle && this.toggle()
        };
        n.VERSION = "3.3.6", n.TRANSITION_DURATION = 350, n.DEFAULTS = {
            toggle: !0
        }, n.prototype.dimension = function() {
            var t = this.$element.hasClass("width");
            return t ? "width" : "height"
        }, n.prototype.show = function() {
            if (!this.transitioning && !this.$element.hasClass("in")) {
                var e, o = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
                if (!(o && o.length && (e = o.data("bs.collapse"), e && e.transitioning))) {
                    var s = t.Event("show.bs.collapse");
                    if (this.$element.trigger(s), !s.isDefaultPrevented()) {
                        o && o.length && (i.call(o, "hide"), e || o.data("bs.collapse", null));
                        var r = this.dimension();
                        this.$element.removeClass("collapse").addClass("collapsing")[r](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1;
                        var a = function() {
                            this.$element.removeClass("collapsing").addClass("collapse in")[r](""), this.transitioning = 0, this.$element.trigger("shown.bs.collapse")
                        };
                        if (!t.support.transition) return a.call(this);
                        var l = t.camelCase(["scroll", r].join("-"));
                        this.$element.one("bsTransitionEnd", t.proxy(a, this)).emulateTransitionEnd(n.TRANSITION_DURATION)[r](this.$element[0][l])
                    }
                }
            }
        }, n.prototype.hide = function() {
            if (!this.transitioning && this.$element.hasClass("in")) {
                var e = t.Event("hide.bs.collapse");
                if (this.$element.trigger(e), !e.isDefaultPrevented()) {
                    var i = this.dimension();
                    this.$element[i](this.$element[i]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1;
                    var o = function() {
                        this.transitioning = 0, this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
                    };
                    return t.support.transition ? void this.$element[i](0).one("bsTransitionEnd", t.proxy(o, this)).emulateTransitionEnd(n.TRANSITION_DURATION) : o.call(this)
                }
            }
        }, n.prototype.toggle = function() {
            this[this.$element.hasClass("in") ? "hide" : "show"]()
        }, n.prototype.getParent = function() {
            return t(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(t.proxy(function(i, n) {
                var o = t(n);
                this.addAriaAndCollapsedClass(e(o), o)
            }, this)).end()
        }, n.prototype.addAriaAndCollapsedClass = function(t, e) {
            var i = t.hasClass("in");
            t.attr("aria-expanded", i), e.toggleClass("collapsed", !i).attr("aria-expanded", i)
        };
        var o = t.fn.collapse;
        t.fn.collapse = i, t.fn.collapse.Constructor = n, t.fn.collapse.noConflict = function() {
            return t.fn.collapse = o, this
        }, t(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function(n) {
            var o = t(this);
            o.attr("data-target") || n.preventDefault();
            var s = e(o),
                r = s.data("bs.collapse"),
                a = r ? "toggle" : o.data();
            i.call(s, a)
        })
    }(jQuery), + function(t) {
        "use strict";

        function e(e) {
            var i = e.attr("data-target");
            i || (i = e.attr("href"), i = i && /#[A-Za-z]/.test(i) && i.replace(/.*(?=#[^\s]*$)/, ""));
            var n = i && t(i);
            return n && n.length ? n : e.parent()
        }

        function i(i) {
            i && 3 === i.which || (t(o).remove(), t(s).each(function() {
                var n = t(this),
                    o = e(n),
                    s = {
                        relatedTarget: this
                    };
                o.hasClass("open") && (i && "click" == i.type && /input|textarea/i.test(i.target.tagName) && t.contains(o[0], i.target) || (o.trigger(i = t.Event("hide.bs.dropdown", s)), i.isDefaultPrevented() || (n.attr("aria-expanded", "false"), o.removeClass("open").trigger(t.Event("hidden.bs.dropdown", s)))))
            }))
        }

        function n(e) {
            return this.each(function() {
                var i = t(this),
                    n = i.data("bs.dropdown");
                n || i.data("bs.dropdown", n = new r(this)), "string" == typeof e && n[e].call(i)
            })
        }
        var o = ".dropdown-backdrop",
            s = '[data-toggle="dropdown"]',
            r = function(e) {
                t(e).on("click.bs.dropdown", this.toggle)
            };
        r.VERSION = "3.3.6", r.prototype.toggle = function(n) {
            var o = t(this);
            if (!o.is(".disabled, :disabled")) {
                var s = e(o),
                    r = s.hasClass("open");
                if (i(), !r) {
                    "ontouchstart" in document.documentElement && !s.closest(".navbar-nav").length && t(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(t(this)).on("click", i);
                    var a = {
                        relatedTarget: this
                    };
                    if (s.trigger(n = t.Event("show.bs.dropdown", a)), n.isDefaultPrevented()) return;
                    o.trigger("focus").attr("aria-expanded", "true"), s.toggleClass("open").trigger(t.Event("shown.bs.dropdown", a))
                }
                return !1
            }
        }, r.prototype.keydown = function(i) {
            if (/(38|40|27|32)/.test(i.which) && !/input|textarea/i.test(i.target.tagName)) {
                var n = t(this);
                if (i.preventDefault(), i.stopPropagation(), !n.is(".disabled, :disabled")) {
                    var o = e(n),
                        r = o.hasClass("open");
                    if (!r && 27 != i.which || r && 27 == i.which) return 27 == i.which && o.find(s).trigger("focus"), n.trigger("click");
                    var a = " li:not(.disabled):visible a",
                        l = o.find(".dropdown-menu" + a);
                    if (l.length) {
                        var h = l.index(i.target);
                        38 == i.which && h > 0 && h--, 40 == i.which && h < l.length - 1 && h++, ~h || (h = 0), l.eq(h).trigger("focus")
                    }
                }
            }
        };
        var a = t.fn.dropdown;
        t.fn.dropdown = n, t.fn.dropdown.Constructor = r, t.fn.dropdown.noConflict = function() {
            return t.fn.dropdown = a, this
        }, t(document).on("click.bs.dropdown.data-api", i).on("click.bs.dropdown.data-api", ".dropdown form", function(t) {
            t.stopPropagation()
        }).on("click.bs.dropdown.data-api", s, r.prototype.toggle).on("keydown.bs.dropdown.data-api", s, r.prototype.keydown).on("keydown.bs.dropdown.data-api", ".dropdown-menu", r.prototype.keydown)
    }(jQuery), + function(t) {
        "use strict";

        function e(e, n) {
            return this.each(function() {
                var o = t(this),
                    s = o.data("bs.modal"),
                    r = t.extend({}, i.DEFAULTS, o.data(), "object" == typeof e && e);
                s || o.data("bs.modal", s = new i(this, r)), "string" == typeof e ? s[e](n) : r.show && s.show(n)
            })
        }
        var i = function(e, i) {
            this.options = i, this.$body = t(document.body), this.$element = t(e), this.$dialog = this.$element.find(".modal-dialog"), this.$backdrop = null, this.isShown = null, this.originalBodyPad = null, this.scrollbarWidth = 0, this.ignoreBackdropClick = !1, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, t.proxy(function() {
                this.$element.trigger("loaded.bs.modal")
            }, this))
        };
        i.VERSION = "3.3.6", i.TRANSITION_DURATION = 300, i.BACKDROP_TRANSITION_DURATION = 150, i.DEFAULTS = {
            backdrop: !0,
            keyboard: !0,
            show: !0
        }, i.prototype.toggle = function(t) {
            return this.isShown ? this.hide() : this.show(t)
        }, i.prototype.show = function(e) {
            var n = this,
                o = t.Event("show.bs.modal", {
                    relatedTarget: e
                });
            this.$element.trigger(o), this.isShown || o.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', t.proxy(this.hide, this)), this.$dialog.on("mousedown.dismiss.bs.modal", function() {
                n.$element.one("mouseup.dismiss.bs.modal", function(e) {
                    t(e.target).is(n.$element) && (n.ignoreBackdropClick = !0)
                })
            }), this.backdrop(function() {
                var o = t.support.transition && n.$element.hasClass("fade");
                n.$element.parent().length || n.$element.appendTo(n.$body), n.$element.show().scrollTop(0), n.adjustDialog(), o && n.$element[0].offsetWidth, n.$element.addClass("in"), n.enforceFocus();
                var s = t.Event("shown.bs.modal", {
                    relatedTarget: e
                });
                o ? n.$dialog.one("bsTransitionEnd", function() {
                    n.$element.trigger("focus").trigger(s)
                }).emulateTransitionEnd(i.TRANSITION_DURATION) : n.$element.trigger("focus").trigger(s)
            }))
        }, i.prototype.hide = function(e) {
            e && e.preventDefault(), e = t.Event("hide.bs.modal"), this.$element.trigger(e), this.isShown && !e.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), t(document).off("focusin.bs.modal"), this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"), this.$dialog.off("mousedown.dismiss.bs.modal"), t.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", t.proxy(this.hideModal, this)).emulateTransitionEnd(i.TRANSITION_DURATION) : this.hideModal())
        }, i.prototype.enforceFocus = function() {
            t(document).off("focusin.bs.modal").on("focusin.bs.modal", t.proxy(function(t) {
                this.$element[0] === t.target || this.$element.has(t.target).length || this.$element.trigger("focus")
            }, this))
        }, i.prototype.escape = function() {
            this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", t.proxy(function(t) {
                27 == t.which && this.hide()
            }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
        }, i.prototype.resize = function() {
            this.isShown ? t(window).on("resize.bs.modal", t.proxy(this.handleUpdate, this)) : t(window).off("resize.bs.modal")
        }, i.prototype.hideModal = function() {
            var t = this;
            this.$element.hide(), this.backdrop(function() {
                t.$body.removeClass("modal-open"), t.resetAdjustments(), t.resetScrollbar(), t.$element.trigger("hidden.bs.modal")
            })
        }, i.prototype.removeBackdrop = function() {
            this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
        }, i.prototype.backdrop = function(e) {
            var n = this,
                o = this.$element.hasClass("fade") ? "fade" : "";
            if (this.isShown && this.options.backdrop) {
                var s = t.support.transition && o;
                if (this.$backdrop = t(document.createElement("div")).addClass("modal-backdrop " + o).appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", t.proxy(function(t) {
                        return this.ignoreBackdropClick ? void(this.ignoreBackdropClick = !1) : void(t.target === t.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide()))
                    }, this)), s && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !e) return;
                s ? this.$backdrop.one("bsTransitionEnd", e).emulateTransitionEnd(i.BACKDROP_TRANSITION_DURATION) : e()
            } else if (!this.isShown && this.$backdrop) {
                this.$backdrop.removeClass("in");
                var r = function() {
                    n.removeBackdrop(), e && e()
                };
                t.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", r).emulateTransitionEnd(i.BACKDROP_TRANSITION_DURATION) : r()
            } else e && e()
        }, i.prototype.handleUpdate = function() {
            this.adjustDialog()
        }, i.prototype.adjustDialog = function() {
            var t = this.$element[0].scrollHeight > document.documentElement.clientHeight;
            this.$element.css({
                paddingLeft: !this.bodyIsOverflowing && t ? this.scrollbarWidth : "",
                paddingRight: this.bodyIsOverflowing && !t ? this.scrollbarWidth : ""
            })
        }, i.prototype.resetAdjustments = function() {
            this.$element.css({
                paddingLeft: "",
                paddingRight: ""
            })
        }, i.prototype.checkScrollbar = function() {
            var t = window.innerWidth;
            if (!t) {
                var e = document.documentElement.getBoundingClientRect();
                t = e.right - Math.abs(e.left)
            }
            this.bodyIsOverflowing = document.body.clientWidth < t, this.scrollbarWidth = this.measureScrollbar()
        }, i.prototype.setScrollbar = function() {
            var t = parseInt(this.$body.css("padding-right") || 0, 10);
            this.originalBodyPad = document.body.style.paddingRight || "", this.bodyIsOverflowing && this.$body.css("padding-right", t + this.scrollbarWidth)
        }, i.prototype.resetScrollbar = function() {
            this.$body.css("padding-right", this.originalBodyPad)
        }, i.prototype.measureScrollbar = function() {
            var t = document.createElement("div");
            t.className = "modal-scrollbar-measure", this.$body.append(t);
            var e = t.offsetWidth - t.clientWidth;
            return this.$body[0].removeChild(t), e
        };
        var n = t.fn.modal;
        t.fn.modal = e, t.fn.modal.Constructor = i, t.fn.modal.noConflict = function() {
            return t.fn.modal = n, this
        }, t(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(i) {
            var n = t(this),
                o = n.attr("href"),
                s = t(n.attr("data-target") || o && o.replace(/.*(?=#[^\s]+$)/, "")),
                r = s.data("bs.modal") ? "toggle" : t.extend({
                    remote: !/#/.test(o) && o
                }, s.data(), n.data());
            n.is("a") && i.preventDefault(), s.one("show.bs.modal", function(t) {
                t.isDefaultPrevented() || s.one("hidden.bs.modal", function() {
                    n.is(":visible") && n.trigger("focus")
                })
            }), e.call(s, r, this)
        })
    }(jQuery), + function(t) {
        "use strict";

        function e(e) {
            return this.each(function() {
                var n = t(this),
                    o = n.data("bs.tooltip"),
                    s = "object" == typeof e && e;
                !o && /destroy|hide/.test(e) || (o || n.data("bs.tooltip", o = new i(this, s)), "string" == typeof e && o[e]())
            })
        }
        var i = function(t, e) {
            this.type = null, this.options = null, this.enabled = null, this.timeout = null, this.hoverState = null, this.$element = null, this.inState = null, this.init("tooltip", t, e)
        };
        i.VERSION = "3.3.6", i.TRANSITION_DURATION = 150, i.DEFAULTS = {
            animation: !0,
            placement: "top",
            selector: !1,
            template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
            trigger: "hover focus",
            title: "",
            delay: 0,
            html: !1,
            container: !1,
            viewport: {
                selector: "body",
                padding: 0
            }
        }, i.prototype.init = function(e, i, n) {
            if (this.enabled = !0, this.type = e, this.$element = t(i), this.options = this.getOptions(n), this.$viewport = this.options.viewport && t(t.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport), this.inState = {
                    click: !1,
                    hover: !1,
                    focus: !1
                }, this.$element[0] instanceof document.constructor && !this.options.selector) throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
            for (var o = this.options.trigger.split(" "), s = o.length; s--;) {
                var r = o[s];
                if ("click" == r) this.$element.on("click." + this.type, this.options.selector, t.proxy(this.toggle, this));
                else if ("manual" != r) {
                    var a = "hover" == r ? "mouseenter" : "focusin",
                        l = "hover" == r ? "mouseleave" : "focusout";
                    this.$element.on(a + "." + this.type, this.options.selector, t.proxy(this.enter, this)), this.$element.on(l + "." + this.type, this.options.selector, t.proxy(this.leave, this))
                }
            }
            this.options.selector ? this._options = t.extend({}, this.options, {
                trigger: "manual",
                selector: ""
            }) : this.fixTitle()
        }, i.prototype.getDefaults = function() {
            return i.DEFAULTS
        }, i.prototype.getOptions = function(e) {
            return e = t.extend({}, this.getDefaults(), this.$element.data(), e), e.delay && "number" == typeof e.delay && (e.delay = {
                show: e.delay,
                hide: e.delay
            }), e
        }, i.prototype.getDelegateOptions = function() {
            var e = {},
                i = this.getDefaults();
            return this._options && t.each(this._options, function(t, n) {
                i[t] != n && (e[t] = n)
            }), e
        }, i.prototype.enter = function(e) {
            var i = e instanceof this.constructor ? e : t(e.currentTarget).data("bs." + this.type);
            return i || (i = new this.constructor(e.currentTarget, this.getDelegateOptions()), t(e.currentTarget).data("bs." + this.type, i)), e instanceof t.Event && (i.inState["focusin" == e.type ? "focus" : "hover"] = !0), i.tip().hasClass("in") || "in" == i.hoverState ? void(i.hoverState = "in") : (clearTimeout(i.timeout), i.hoverState = "in", i.options.delay && i.options.delay.show ? void(i.timeout = setTimeout(function() {
                "in" == i.hoverState && i.show()
            }, i.options.delay.show)) : i.show())
        }, i.prototype.isInStateTrue = function() {
            for (var t in this.inState)
                if (this.inState[t]) return !0;
            return !1
        }, i.prototype.leave = function(e) {
            var i = e instanceof this.constructor ? e : t(e.currentTarget).data("bs." + this.type);
            return i || (i = new this.constructor(e.currentTarget, this.getDelegateOptions()), t(e.currentTarget).data("bs." + this.type, i)), e instanceof t.Event && (i.inState["focusout" == e.type ? "focus" : "hover"] = !1), i.isInStateTrue() ? void 0 : (clearTimeout(i.timeout), i.hoverState = "out", i.options.delay && i.options.delay.hide ? void(i.timeout = setTimeout(function() {
                "out" == i.hoverState && i.hide()
            }, i.options.delay.hide)) : i.hide())
        }, i.prototype.show = function() {
            var e = t.Event("show.bs." + this.type);
            if (this.hasContent() && this.enabled) {
                this.$element.trigger(e);
                var n = t.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
                if (e.isDefaultPrevented() || !n) return;
                var o = this,
                    s = this.tip(),
                    r = this.getUID(this.type);
                this.setContent(), s.attr("id", r), this.$element.attr("aria-describedby", r), this.options.animation && s.addClass("fade");
                var a = "function" == typeof this.options.placement ? this.options.placement.call(this, s[0], this.$element[0]) : this.options.placement,
                    l = /\s?auto?\s?/i,
                    h = l.test(a);
                h && (a = a.replace(l, "") || "top"), s.detach().css({
                    top: 0,
                    left: 0,
                    display: "block"
                }).addClass(a).data("bs." + this.type, this), this.options.container ? s.appendTo(this.options.container) : s.insertAfter(this.$element), this.$element.trigger("inserted.bs." + this.type);
                var c = this.getPosition(),
                    p = s[0].offsetWidth,
                    u = s[0].offsetHeight;
                if (h) {
                    var d = a,
                        f = this.getPosition(this.$viewport);
                    a = "bottom" == a && c.bottom + u > f.bottom ? "top" : "top" == a && c.top - u < f.top ? "bottom" : "right" == a && c.right + p > f.width ? "left" : "left" == a && c.left - p < f.left ? "right" : a, s.removeClass(d).addClass(a)
                }
                var m = this.getCalculatedOffset(a, c, p, u);
                this.applyPlacement(m, a);
                var y = function() {
                    var t = o.hoverState;
                    o.$element.trigger("shown.bs." + o.type), o.hoverState = null, "out" == t && o.leave(o)
                };
                t.support.transition && this.$tip.hasClass("fade") ? s.one("bsTransitionEnd", y).emulateTransitionEnd(i.TRANSITION_DURATION) : y()
            }
        }, i.prototype.applyPlacement = function(e, i) {
            var n = this.tip(),
                o = n[0].offsetWidth,
                s = n[0].offsetHeight,
                r = parseInt(n.css("margin-top"), 10),
                a = parseInt(n.css("margin-left"), 10);
            isNaN(r) && (r = 0), isNaN(a) && (a = 0), e.top += r, e.left += a, t.offset.setOffset(n[0], t.extend({
                using: function(t) {
                    n.css({
                        top: Math.round(t.top),
                        left: Math.round(t.left)
                    })
                }
            }, e), 0), n.addClass("in");
            var l = n[0].offsetWidth,
                h = n[0].offsetHeight;
            "top" == i && h != s && (e.top = e.top + s - h);
            var c = this.getViewportAdjustedDelta(i, e, l, h);
            c.left ? e.left += c.left : e.top += c.top;
            var p = /top|bottom/.test(i),
                u = p ? 2 * c.left - o + l : 2 * c.top - s + h,
                d = p ? "offsetWidth" : "offsetHeight";
            n.offset(e), this.replaceArrow(u, n[0][d], p)
        }, i.prototype.replaceArrow = function(t, e, i) {
            this.arrow().css(i ? "left" : "top", 50 * (1 - t / e) + "%").css(i ? "top" : "left", "")
        }, i.prototype.setContent = function() {
            var t = this.tip(),
                e = this.getTitle();
            t.find(".tooltip-inner")[this.options.html ? "html" : "text"](e), t.removeClass("fade in top bottom left right")
        }, i.prototype.hide = function(e) {
            function n() {
                "in" != o.hoverState && s.detach(), o.$element.removeAttr("aria-describedby").trigger("hidden.bs." + o.type), e && e()
            }
            var o = this,
                s = t(this.$tip),
                r = t.Event("hide.bs." + this.type);
            return this.$element.trigger(r), r.isDefaultPrevented() ? void 0 : (s.removeClass("in"), t.support.transition && s.hasClass("fade") ? s.one("bsTransitionEnd", n).emulateTransitionEnd(i.TRANSITION_DURATION) : n(), this.hoverState = null, this)
        }, i.prototype.fixTitle = function() {
            var t = this.$element;
            (t.attr("title") || "string" != typeof t.attr("data-original-title")) && t.attr("data-original-title", t.attr("title") || "").attr("title", "")
        }, i.prototype.hasContent = function() {
            return this.getTitle()
        }, i.prototype.getPosition = function(e) {
            e = e || this.$element;
            var i = e[0],
                n = "BODY" == i.tagName,
                o = i.getBoundingClientRect();
            null == o.width && (o = t.extend({}, o, {
                width: o.right - o.left,
                height: o.bottom - o.top
            }));
            var s = n ? {
                    top: 0,
                    left: 0
                } : e.offset(),
                r = {
                    scroll: n ? document.documentElement.scrollTop || document.body.scrollTop : e.scrollTop()
                },
                a = n ? {
                    width: t(window).width(),
                    height: t(window).height()
                } : null;
            return t.extend({}, o, r, a, s)
        }, i.prototype.getCalculatedOffset = function(t, e, i, n) {
            return "bottom" == t ? {
                top: e.top + e.height,
                left: e.left + e.width / 2 - i / 2
            } : "top" == t ? {
                top: e.top - n,
                left: e.left + e.width / 2 - i / 2
            } : "left" == t ? {
                top: e.top + e.height / 2 - n / 2,
                left: e.left - i
            } : {
                top: e.top + e.height / 2 - n / 2,
                left: e.left + e.width
            }
        }, i.prototype.getViewportAdjustedDelta = function(t, e, i, n) {
            var o = {
                top: 0,
                left: 0
            };
            if (!this.$viewport) return o;
            var s = this.options.viewport && this.options.viewport.padding || 0,
                r = this.getPosition(this.$viewport);
            if (/right|left/.test(t)) {
                var a = e.top - s - r.scroll,
                    l = e.top + s - r.scroll + n;
                a < r.top ? o.top = r.top - a : l > r.top + r.height && (o.top = r.top + r.height - l)
            } else {
                var h = e.left - s,
                    c = e.left + s + i;
                h < r.left ? o.left = r.left - h : c > r.right && (o.left = r.left + r.width - c)
            }
            return o
        }, i.prototype.getTitle = function() {
            var t, e = this.$element,
                i = this.options;
            return t = e.attr("data-original-title") || ("function" == typeof i.title ? i.title.call(e[0]) : i.title)
        }, i.prototype.getUID = function(t) {
            do t += ~~(1e6 * Math.random()); while (document.getElementById(t));
            return t
        }, i.prototype.tip = function() {
            if (!this.$tip && (this.$tip = t(this.options.template), 1 != this.$tip.length)) throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
            return this.$tip
        }, i.prototype.arrow = function() {
            return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
        }, i.prototype.enable = function() {
            this.enabled = !0
        }, i.prototype.disable = function() {
            this.enabled = !1
        }, i.prototype.toggleEnabled = function() {
            this.enabled = !this.enabled
        }, i.prototype.toggle = function(e) {
            var i = this;
            e && (i = t(e.currentTarget).data("bs." + this.type), i || (i = new this.constructor(e.currentTarget, this.getDelegateOptions()), t(e.currentTarget).data("bs." + this.type, i))), e ? (i.inState.click = !i.inState.click, i.isInStateTrue() ? i.enter(i) : i.leave(i)) : i.tip().hasClass("in") ? i.leave(i) : i.enter(i)
        }, i.prototype.destroy = function() {
            var t = this;
            clearTimeout(this.timeout), this.hide(function() {
                t.$element.off("." + t.type).removeData("bs." + t.type), t.$tip && t.$tip.detach(), t.$tip = null, t.$arrow = null, t.$viewport = null
            })
        };
        var n = t.fn.tooltip;
        t.fn.tooltip = e,
            t.fn.tooltip.Constructor = i, t.fn.tooltip.noConflict = function() {
                return t.fn.tooltip = n, this
            }
    }(jQuery), + function(t) {
        "use strict";

        function e(e) {
            return this.each(function() {
                var n = t(this),
                    o = n.data("bs.popover"),
                    s = "object" == typeof e && e;
                !o && /destroy|hide/.test(e) || (o || n.data("bs.popover", o = new i(this, s)), "string" == typeof e && o[e]())
            })
        }
        var i = function(t, e) {
            this.init("popover", t, e)
        };
        if (!t.fn.tooltip) throw new Error("Popover requires tooltip.js");
        i.VERSION = "3.3.6", i.DEFAULTS = t.extend({}, t.fn.tooltip.Constructor.DEFAULTS, {
            placement: "right",
            trigger: "click",
            content: "",
            template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
        }), i.prototype = t.extend({}, t.fn.tooltip.Constructor.prototype), i.prototype.constructor = i, i.prototype.getDefaults = function() {
            return i.DEFAULTS
        }, i.prototype.setContent = function() {
            var t = this.tip(),
                e = this.getTitle(),
                i = this.getContent();
            t.find(".popover-title")[this.options.html ? "html" : "text"](e), t.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof i ? "html" : "append" : "text"](i), t.removeClass("fade top bottom left right in"), t.find(".popover-title").html() || t.find(".popover-title").hide()
        }, i.prototype.hasContent = function() {
            return this.getTitle() || this.getContent()
        }, i.prototype.getContent = function() {
            var t = this.$element,
                e = this.options;
            return t.attr("data-content") || ("function" == typeof e.content ? e.content.call(t[0]) : e.content)
        }, i.prototype.arrow = function() {
            return this.$arrow = this.$arrow || this.tip().find(".arrow")
        };
        var n = t.fn.popover;
        t.fn.popover = e, t.fn.popover.Constructor = i, t.fn.popover.noConflict = function() {
            return t.fn.popover = n, this
        }
    }(jQuery), + function(t) {
        "use strict";

        function e(i, n) {
            this.$body = t(document.body), this.$scrollElement = t(t(i).is(document.body) ? window : i), this.options = t.extend({}, e.DEFAULTS, n), this.selector = (this.options.target || "") + " .nav li > a", this.offsets = [], this.targets = [], this.activeTarget = null, this.scrollHeight = 0, this.$scrollElement.on("scroll.bs.scrollspy", t.proxy(this.process, this)), this.refresh(), this.process()
        }

        function i(i) {
            return this.each(function() {
                var n = t(this),
                    o = n.data("bs.scrollspy"),
                    s = "object" == typeof i && i;
                o || n.data("bs.scrollspy", o = new e(this, s)), "string" == typeof i && o[i]()
            })
        }
        e.VERSION = "3.3.6", e.DEFAULTS = {
            offset: 10
        }, e.prototype.getScrollHeight = function() {
            return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
        }, e.prototype.refresh = function() {
            var e = this,
                i = "offset",
                n = 0;
            this.offsets = [], this.targets = [], this.scrollHeight = this.getScrollHeight(), t.isWindow(this.$scrollElement[0]) || (i = "position", n = this.$scrollElement.scrollTop()), this.$body.find(this.selector).map(function() {
                var e = t(this),
                    o = e.data("target") || e.attr("href"),
                    s = /^#./.test(o) && t(o);
                return s && s.length && s.is(":visible") && [
                    [s[i]().top + n, o]
                ] || null
            }).sort(function(t, e) {
                return t[0] - e[0]
            }).each(function() {
                e.offsets.push(this[0]), e.targets.push(this[1])
            })
        }, e.prototype.process = function() {
            var t, e = this.$scrollElement.scrollTop() + this.options.offset,
                i = this.getScrollHeight(),
                n = this.options.offset + i - this.$scrollElement.height(),
                o = this.offsets,
                s = this.targets,
                r = this.activeTarget;
            if (this.scrollHeight != i && this.refresh(), e >= n) return r != (t = s[s.length - 1]) && this.activate(t);
            if (r && e < o[0]) return this.activeTarget = null, this.clear();
            for (t = o.length; t--;) r != s[t] && e >= o[t] && (void 0 === o[t + 1] || e < o[t + 1]) && this.activate(s[t])
        }, e.prototype.activate = function(e) {
            this.activeTarget = e, this.clear();
            var i = this.selector + '[data-target="' + e + '"],' + this.selector + '[href="' + e + '"]',
                n = t(i).parents("li").addClass("active");
            n.parent(".dropdown-menu").length && (n = n.closest("li.dropdown").addClass("active")), n.trigger("activate.bs.scrollspy")
        }, e.prototype.clear = function() {
            t(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
        };
        var n = t.fn.scrollspy;
        t.fn.scrollspy = i, t.fn.scrollspy.Constructor = e, t.fn.scrollspy.noConflict = function() {
            return t.fn.scrollspy = n, this
        }, t(window).on("load.bs.scrollspy.data-api", function() {
            t('[data-spy="scroll"]').each(function() {
                var e = t(this);
                i.call(e, e.data())
            })
        })
    }(jQuery), + function(t) {
        "use strict";

        function e(e) {
            return this.each(function() {
                var n = t(this),
                    o = n.data("bs.tab");
                o || n.data("bs.tab", o = new i(this)), "string" == typeof e && o[e]()
            })
        }
        var i = function(e) {
            this.element = t(e)
        };
        i.VERSION = "3.3.6", i.TRANSITION_DURATION = 150, i.prototype.show = function() {
            var e = this.element,
                i = e.closest("ul:not(.dropdown-menu)"),
                n = e.data("target");
            if (n || (n = e.attr("href"), n = n && n.replace(/.*(?=#[^\s]*$)/, "")), !e.parent("li").hasClass("active")) {
                var o = i.find(".active:last a"),
                    s = t.Event("hide.bs.tab", {
                        relatedTarget: e[0]
                    }),
                    r = t.Event("show.bs.tab", {
                        relatedTarget: o[0]
                    });
                if (o.trigger(s), e.trigger(r), !r.isDefaultPrevented() && !s.isDefaultPrevented()) {
                    var a = t(n);
                    this.activate(e.closest("li"), i), this.activate(a, a.parent(), function() {
                        o.trigger({
                            type: "hidden.bs.tab",
                            relatedTarget: e[0]
                        }), e.trigger({
                            type: "shown.bs.tab",
                            relatedTarget: o[0]
                        })
                    })
                }
            }
        }, i.prototype.activate = function(e, n, o) {
            function s() {
                r.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), e.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), a ? (e[0].offsetWidth, e.addClass("in")) : e.removeClass("fade"), e.parent(".dropdown-menu").length && e.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), o && o()
            }
            var r = n.find("> .active"),
                a = o && t.support.transition && (r.length && r.hasClass("fade") || !!n.find("> .fade").length);
            r.length && a ? r.one("bsTransitionEnd", s).emulateTransitionEnd(i.TRANSITION_DURATION) : s(), r.removeClass("in")
        };
        var n = t.fn.tab;
        t.fn.tab = e, t.fn.tab.Constructor = i, t.fn.tab.noConflict = function() {
            return t.fn.tab = n, this
        };
        var o = function(i) {
            i.preventDefault(), e.call(t(this), "show")
        };
        t(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', o).on("click.bs.tab.data-api", '[data-toggle="pill"]', o)
    }(jQuery), + function(t) {
        "use strict";

        function e(e) {
            return this.each(function() {
                var n = t(this),
                    o = n.data("bs.affix"),
                    s = "object" == typeof e && e;
                o || n.data("bs.affix", o = new i(this, s)), "string" == typeof e && o[e]()
            })
        }
        var i = function(e, n) {
            this.options = t.extend({}, i.DEFAULTS, n), this.$target = t(this.options.target).on("scroll.bs.affix.data-api", t.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", t.proxy(this.checkPositionWithEventLoop, this)), this.$element = t(e), this.affixed = null, this.unpin = null, this.pinnedOffset = null, this.checkPosition()
        };
        i.VERSION = "3.3.6", i.RESET = "affix affix-top affix-bottom", i.DEFAULTS = {
            offset: 0,
            target: window
        }, i.prototype.getState = function(t, e, i, n) {
            var o = this.$target.scrollTop(),
                s = this.$element.offset(),
                r = this.$target.height();
            if (null != i && "top" == this.affixed) return i > o ? "top" : !1;
            if ("bottom" == this.affixed) return null != i ? o + this.unpin <= s.top ? !1 : "bottom" : t - n >= o + r ? !1 : "bottom";
            var a = null == this.affixed,
                l = a ? o : s.top,
                h = a ? r : e;
            return null != i && i >= o ? "top" : null != n && l + h >= t - n ? "bottom" : !1
        }, i.prototype.getPinnedOffset = function() {
            if (this.pinnedOffset) return this.pinnedOffset;
            this.$element.removeClass(i.RESET).addClass("affix");
            var t = this.$target.scrollTop(),
                e = this.$element.offset();
            return this.pinnedOffset = e.top - t
        }, i.prototype.checkPositionWithEventLoop = function() {
            setTimeout(t.proxy(this.checkPosition, this), 1)
        }, i.prototype.checkPosition = function() {
            if (this.$element.is(":visible")) {
                var e = this.$element.height(),
                    n = this.options.offset,
                    o = n.top,
                    s = n.bottom,
                    r = Math.max(t(document).height(), t(document.body).height());
                "object" != typeof n && (s = o = n), "function" == typeof o && (o = n.top(this.$element)), "function" == typeof s && (s = n.bottom(this.$element));
                var a = this.getState(r, e, o, s);
                if (this.affixed != a) {
                    null != this.unpin && this.$element.css("top", "");
                    var l = "affix" + (a ? "-" + a : ""),
                        h = t.Event(l + ".bs.affix");
                    if (this.$element.trigger(h), h.isDefaultPrevented()) return;
                    this.affixed = a, this.unpin = "bottom" == a ? this.getPinnedOffset() : null, this.$element.removeClass(i.RESET).addClass(l).trigger(l.replace("affix", "affixed") + ".bs.affix")
                }
                "bottom" == a && this.$element.offset({
                    top: r - e - s
                })
            }
        };
        var n = t.fn.affix;
        t.fn.affix = e, t.fn.affix.Constructor = i, t.fn.affix.noConflict = function() {
            return t.fn.affix = n, this
        }, t(window).on("load", function() {
            t('[data-spy="affix"]').each(function() {
                var i = t(this),
                    n = i.data();
                n.offset = n.offset || {}, null != n.offsetBottom && (n.offset.bottom = n.offsetBottom), null != n.offsetTop && (n.offset.top = n.offsetTop), e.call(i, n)
            })
        })
    }(jQuery),
    function(t) {
        var e = {
                common: {
                    init: function() {
                        function e() {
                            var t = new google.maps.LatLng(33.917062, -118.410325),
                                e = {
                                    scrollwheel: !1,
                                    draggable: !1,
                                    zoom: 12,
                                    styles: [{
                                        featureType: "administrative",
                                        elementType: "labels.text.fill",
                                        stylers: [{
                                            color: "#444444"
                                        }]
                                    }, {
                                        featureType: "landscape",
                                        elementType: "all",
                                        stylers: [{
                                            color: "#f2f2f2"
                                        }]
                                    }, {
                                        featureType: "poi",
                                        elementType: "all",
                                        stylers: [{
                                            visibility: "off"
                                        }]
                                    }, {
                                        featureType: "road",
                                        elementType: "all",
                                        stylers: [{
                                            saturation: -100
                                        }, {
                                            lightness: 45
                                        }]
                                    }, {
                                        featureType: "road.highway",
                                        elementType: "all",
                                        stylers: [{
                                            visibility: "simplified"
                                        }]
                                    }, {
                                        featureType: "road.arterial",
                                        elementType: "labels.icon",
                                        stylers: [{
                                            visibility: "off"
                                        }]
                                    }, {
                                        featureType: "transit",
                                        elementType: "all",
                                        stylers: [{
                                            visibility: "off"
                                        }]
                                    }, {
                                        featureType: "water",
                                        elementType: "all",
                                        stylers: [{
                                            color: "#a9dff6"
                                        }, {
                                            visibility: "on"
                                        }]
                                    }],
                                    center: t,
                                    mapTypeId: google.maps.MapTypeId.ROADMAP
                                },
                                n = new google.maps.Map(document.getElementById("mapa-canvas"), e),
                                o = new google.maps.Marker({
                                    position: t,
                                    map: n
                                });
                            o.setMap(n), i(n, o)
                        }

                        function i(t, e) {
                            setTimeout(function() {
                                e.setPosition(new google.maps.LatLng(-33.008075, -58.501926)), t.panTo(new google.maps.LatLng(-33.008075, -58.501926))
                            }, 1500)
                        }
                        var n;
                        t("body").jpreLoader({
                            showSplash: !1,
                            loaderVPos: "40%",
                            autoClose: !0
                        }, function() {
                            clearInterval(n)
                        }), t(function() {
                            t(".going").click(function() {
                                t(".yes-rsvp-form").fadeIn(), t(".no-rsvp-form").fadeOut(), t("#rsvpOptions").hide()
                            }), t(".notgoing").click(function() {
                                t(".no-rsvp-form").fadeIn(), t(".yes-rsvp-form").fadeOut(), t("#rsvpOptions").hide()
                            })
                        }), t(".dark-sec").waypoint(function(e) {
                            "down" === e ? t(".inverted").removeClass("dark") : t(".inverted").addClass("dark")
                        }, {
                            offset: "bottom-in-view"
                        }), t(".light-sec").waypoint(function(e) {
                            "down" === e ? t(".inverted").addClass("dark") : t(".inverted").removeClass("dark")
                        }, {
                            offset: "-1"
                        }), t(".dark-sec").waypoint(function(e) {
                            "down" === e ? t(".button_container").addClass("white") : t(".button_container").removeClass("white")
                        }, {
                            offset: "bottom-in-view"
                        }), t(".light-sec").waypoint(function(e) {
                            "down" === e ? t(".button_container").removeClass("white") : t(".button_container").addClass("white")
                        }, {
                            offset: "-1"
                        }), t(".dark-sec").waypoint(function(e) {
                            "down" === e ? t(".site-nav").addClass("white") : t(".site-nav").removeClass("white")
                        }, {
                            offset: "bottom-in-view"
                        }), t(".light-sec").waypoint(function(e) {
                            "down" === e ? t(".site-nav").removeClass("white") : t(".site-nav").addClass("white")
                        }, {
                            offset: "-1"
                        }), t(".sec-title").waypoint(function(e) {
                            "down" === e ? t(".sec-title").addClass("active") : t(".sec-title").removeClass("active")
                        }, {
                            offset: "bottom-in-view"
                        }), t(".sec-title").waypoint(function(e) {
                            "up" === e ? t(".sec-title").removeClass("active") : t(".sec-title").addClass("active")
                        }, {
                            offset: "-1"
                        }), (new WOW).init(), t(function() {
                            t(".oneGuest").click(function() {
                                t("#guestName").show("fast"), t("#guestName2").hide("fast"), t("#guestName3").hide("fast")
                            }), t(".twoGuests").click(function() {
                                t("#guestName").show("fast"), t("#guestName2").show("fast"), t("#guestName3").hide("fast")
                            }), t(".threeGuests").click(function() {
                                t("#guestName").show("fast"), t("#guestName2").show("fast"), t("#guestName3").show("fast")
                            }), t(".noGuest").click(function() {
                                t("#guestName").hide("fast"), t("#guestName2").hide("fast"), t("#guestName3").hide("fast")
                            })
                        });
                        var o = {
                            Android: function() {
                                return navigator.userAgent.match(/Android/i)
                            },
                            BlackBerry: function() {
                                return navigator.userAgent.match(/BlackBerry/i)
                            },
                            iOS: function() {
                                return navigator.userAgent.match(/iPhone|iPad|iPod/i)
                            },
                            Opera: function() {
                                return navigator.userAgent.match(/Opera Mini/i)
                            },
                            Windows: function() {
                                return navigator.userAgent.match(/IEMobile/i)
                            },
                            any: function() {
                                return o.Android() || o.BlackBerry() || o.iOS() || o.Opera() || o.Windows()
                            }
                        };
                        jQuery(document).ready(function() {
                            if (!o.any()) {
                                skrollr.init()
                            }
                        });
                        var s, r, a, l, h = new Date("Nov 26, 2016 22:00:00").getTime(),
                            c = document.getElementById("countdown");
                        setInterval(function() {
                            var t = (new Date).getTime(),
                                e = (h - t) / 1e3;
                            s = parseInt(e / 86400), e %= 86400, r = parseInt(e / 3600), e %= 3600, a = parseInt(e / 60), l = parseInt(e % 60), c.innerHTML = s + ' <span class="calendar">días y </span>' + r + ' <span class="calendar">h0ras</span>'
                        }, 1e3), t("#menu-burger").click(function() {
                            var e = t("#overlay-menu"),
                                i = t("#menu-burger .menu-icon"),
                                n = t("#menu-burger");
                            e.hasClass("open") ? (e.removeClass("open"), i.removeClass("open"), n.removeClass("open")) : (e.addClass("open"), i.addClass("open"), n.addClass("open"))
                        }), t(".menu-link").click(function() {
                            t("#menu-burger .menu-icon").toggleClass("open"), t("#overlay-menu").toggleClass("open"), t("#menu-burger").toggleClass("open")
                        }), t('a[rel="relativeanchor"]').click(function() {
                            return t("html, body").animate({
                                scrollTop: t(t.attr(this, "href")).offset().top
                            }, 1800), !1
                        });
                        var p = new Instafeed({
                            get: "tagged",
                            limit: 20,
                            tagName: "puttinonthefritts",
                            clientId: "21eb5beef3a24aaeb08c7c2c5c885efb",
                            sortBy: "most-recent",
                            template: '<div class="col-xs-6 col-sm-3"><a href="{{model.images.standard_resolution.url}}"><img src="{{image}}" class="img-responsive"/></a></div>',
                            resolution: "standard_resolution",
                            target: "insta-photos",
                            after: function() {}
                        });
                        p.run(), t(window).on("scroll", function() {
                            var e = t(window).scrollTop(),
                                i = t("#insta-photos"),
                                n = i.innerHeight(),
                                o = 520;
                            o >= n - e && p.hasNext() && p.next()
                        }), e()
                    },
                    finalize: function() {}
                },
                home: {
                    init: function() {},
                    finalize: function() {}
                },
                about_us: {
                    init: function() {}
                }
            },
            i = {
                fire: function(t, i, n) {
                    var o, s = e;
                    i = void 0 === i ? "init" : i, o = "" !== t, o = o && s[t], o = o && "function" == typeof s[t][i], o && s[t][i](n)
                },
                loadEvents: function() {
                    i.fire("common"), t.each(document.body.className.replace(/-/g, "_").split(/\s+/), function(t, e) {
                        i.fire(e), i.fire(e, "finalize")
                    }), i.fire("common", "finalize")
                }
            };
        t(document).ready(i.loadEvents)
    }(jQuery);
//# sourceMappingURL=main.js.map