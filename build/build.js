var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
define("counter", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setupCounter = setupCounter;
    function setupCounter(element) {
        var counter = 0;
        var setCounter = function (count) {
            counter = count;
            element.innerHTML = "count is ".concat(counter);
        };
        // element.addEventListener('click', () => setCounter(counter + 1))
        setCounter(0);
    }
});
define("main", ["require", "exports", "./typescript.svg", "/vite.svg", "counter", "./style.css"], function (require, exports, typescript_svg_1, vite_svg_1, counter_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    document.querySelector('#app').innerHTML = "\n  <div>\n    <a href=\"https://vite.dev\" target=\"_blank\">\n      <img src=\"".concat(vite_svg_1.default, "\" class=\"logo\" alt=\"Vite logo\" />\n    </a>\n    <a href=\"https://www.typescriptlang.org/\" target=\"_blank\">\n      <img src=\"").concat(typescript_svg_1.default, "\" class=\"logo vanilla\" alt=\"TypeScript logo\" />\n    </a>\n    <h1>Vite + TypeScript</h1>\n    <div class=\"card\">\n      <button id=\"counter\" type=\"button\"></button>\n    </div>\n    <p class=\"read-the-docs\">\n      Click on the Vite and TypeScript logos to learn more\n    </p>\n    </div>\n    <div className=\"map\" id=\"map\" style=\"width: 100%; height: 100vh\"></div>\n");
    (0, counter_ts_1.setupCounter)(document.querySelector('#counter'));
});
define("map/map-type", ["require", "exports", "ol/source/OSM", "ol-ext/dist/ol-ext.css", "ol/ol.css"], function (require, exports, OSM_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultTileLayerOptions = exports.defaultInteractions = void 0;
    exports.defaultInteractions = {
        drawInteraction: false,
        drawPolygonInteraction: false,
        drawPointInteraction: false,
        drawLineInteraction: false,
        drawCircleInteraction: false,
        drawRectangleInteraction: false,
        drawHoleInteraction: false,
        selectInteraction: false,
        modifyInteraction: false,
        deleteInteraction: false,
        transformInteraction: false,
        undoInteraction: false,
        redoInteraction: false
    };
    exports.defaultTileLayerOptions = {
        /** Istanza di open street map */
        source: new OSM_1.default(),
        /** Opacita */
        opacity: 1,
        /** Visibilità */
        visible: true,
    };
});
define("map/map-utils", ["require", "exports", "ol-ext/overlay/Popup", "ol/View", "ol/proj", "ol/control/ScaleLine", "ol/coordinate", "ol/layer/Graticule.js", "ol/style", "ol-ext/dist/ol-ext.css", "ol/ol.css"], function (require, exports, Popup_1, View_1, proj_1, ScaleLine_1, coordinate_1, Graticule_js_1, style_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultOnSelect = exports.defaultPopup = exports.defaultGraticule = exports.defaultScaleline = exports.defaultView = void 0;
    exports.defaultView = new View_1.default({
        /** Imposto il centro su Roma se non definito altrimenti */
        center: (0, proj_1.fromLonLat)([12.4964, 41.9028], 'EPSG:3857'),
        /** Imposto lo zoom */
        zoom: 5,
        /** Imposto la projection */
        projection: 'EPSG:3857',
    });
    exports.defaultScaleline = new ScaleLine_1.default({
        /** La metrica della barra: 'metric', 'imperial', 'nautical', 'degrees', 'us' */
        units: 'metric',
        /** mostra una barra al posto del segmento */
        bar: true,
        /** numero di segmenti della barra */
        steps: 4,
        /** mostra la scala */
        text: true,
        /** lunghezza minima barra */
        minWidth: 140
    });
    /** Graticolato di default */
    exports.defaultGraticule = new Graticule_js_1.default({
        strokeStyle: new style_1.Stroke({
            color: 'rgba(255,120,0,0.9)',
            width: 2,
            lineDash: [0.5, 4],
        }),
        showLabels: true,
        wrapX: false,
    });
    /** Popup di default */
    exports.defaultPopup = new Popup_1.default({
        popupClass: 'default anim', // Classe CSS per lo stile e l'animazione del popup
        closeBox: true,
    });
    /** listener di default al select */
    var defaultOnSelect = function (event, popup) {
        /** Estraggo la feature selezionata */
        var feature = event.selected[0];
        if (feature) {
            /** Definisco le coordinate dove è stato premuto il pulsante */
            var coordinate = event.mapBrowserEvent.coordinate;
            popup.setPosition(coordinate);
            var hdms = (0, coordinate_1.toStringHDMS)((0, proj_1.toLonLat)(coordinate));
            popup.show(coordinate, hdms);
        }
        else {
            /** Se clicco al di fuori di una feature chiudo il popup */
            popup.hide();
        }
    };
    exports.defaultOnSelect = defaultOnSelect;
});
define("map/map", ["require", "exports", "ol/Map", "ol-ext/control/EditBar", "ol/events/condition", "ol/interaction/Select", "ol/layer/Tile", "ol/layer/Vector", "ol/source/Vector", "proj4", "ol/proj", "ol/proj/proj4", "ol/control/FullScreen", "ol/control/Zoom", "map/map-type", "map/map-utils", "ol-ext/dist/ol-ext.css", "ol/ol.css"], function (require, exports, Map_1, EditBar_1, condition_1, Select_1, Tile_1, Vector_1, Vector_2, proj4_1, proj_2, proj4_2, FullScreen_1, Zoom_1, map_type_1, map_utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LeonardoMap = void 0;
    /** Componente base della mappa */
    var LeonardoMap = /** @class */ (function () {
        function LeonardoMap(_a) {
            var _b = _a.id, id = _b === void 0 ? "map" : _b, _c = _a.initialFeaturesList, initialFeaturesList = _c === void 0 ? [] : _c, _d = _a.barInteractions, barInteractions = _d === void 0 ? map_type_1.defaultInteractions : _d, _e = _a.tileLayersOptions, tileLayersOptions = _e === void 0 ? map_type_1.defaultTileLayerOptions : _e, _f = _a.customLayers, customLayers = _f === void 0 ? [] : _f, style = _a.style, _g = _a.dimensioni, dimensioni = _g === void 0 ? { width: "100%", height: "100vh" } : _g, _h = _a.customListeners, customListeners = _h === void 0 ? [] : _h, _j = _a.customInteractions, customInteractions = _j === void 0 ? function () { } : _j, _k = _a.customFeaturesListeners, customFeaturesListeners = _k === void 0 ? [] : _k, customOverlay = _a.customOverlay, _l = _a.customLayersListeners, customLayersListeners = _l === void 0 ? [] : _l, classes = _a.classes, _m = _a.customView, customView = _m === void 0 ? map_utils_1.defaultView : _m, customGraticule = _a.customGraticule, _o = _a.customScaleline, customScaleline = _o === void 0 ? map_utils_1.defaultScaleline : _o, customVectorLayer = _a.customVectorLayer, customVectorSource = _a.customVectorSource, customSelect = _a.customSelect, featureSelected = _a.featureSelected, options = _a.options;
            this.customInteractions = function () { };
            this.customListeners = [];
            this.customFeaturesListeners = [];
            /** conversione da 3004 a 3587 */
            this.from3004To3857 = function (coordinate) {
                return (0, proj_2.transform)(coordinate, 'EPSG:3004', 'EPSG:3857');
            };
            /** conversione da 3003 a 3587 */
            this.from3003To3857 = function (coordinate) {
                return (0, proj_2.transform)(coordinate, 'EPSG:3003', 'EPSG:3857');
            };
            /** conversione a 3004 */
            this.from3857To3004 = function (coordinate) {
                return (0, proj_2.transform)(coordinate, 'EPSG:3857', 'EPSG:3004');
            };
            /** conversione a 3003 */
            this.from3857To3003 = function (coordinate) {
                return (0, proj_2.transform)(coordinate, 'EPSG:3857', 'EPSG:3003');
            };
            this.extentFrom3003To3857 = function (extent) {
                return (0, proj_2.transformExtent)(extent, 'EPSG:3003', 'EPSG:3857');
            };
            this.extentFrom3004To3857 = function (extent) {
                return (0, proj_2.transformExtent)(extent, 'EPSG:3004', 'EPSG:3857');
            };
            this.extentFrom3857To3003 = function (extent) {
                return (0, proj_2.transformExtent)(extent, 'EPSG:3857', 'EPSG:3003');
            };
            this.extentFrom3857To3004 = function (extent) {
                return (0, proj_2.transformExtent)(extent, 'EPSG:3857', 'EPSG:3004');
            };
            this.id = id;
            this.initialFeaturesList = initialFeaturesList;
            this.barInteractions = barInteractions;
            this.tileLayersOptions = tileLayersOptions;
            this.customLayers = customLayers;
            this.style = style;
            this.dimensioni = dimensioni;
            this.customListeners = customListeners;
            this.customInteractions = customInteractions;
            this.customFeaturesListeners = customFeaturesListeners;
            this.customOverlay = customOverlay;
            this.customLayersListeners = customLayersListeners;
            this.classes = classes;
            this.customView = customView;
            this.customGraticule = customGraticule;
            this.customScaleline = customScaleline;
            this.customVectorLayer = customVectorLayer;
            this.customVectorSource = customVectorSource;
            this.customSelect = customSelect;
            this.featureSelected = featureSelected;
            this.options = options;
            this.initializeMap();
        }
        LeonardoMap.prototype.initializeMap = function () {
            var _this = this;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            /** definisco proiezioni 3003 e 3004 */
            proj4_1.default.defs('EPSG:3003', '+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68 +units=m +no_defs');
            proj4_1.default.defs('EPSG:3004', '+proj=tmerc +lat_0=0 +lon_0=15 +k=0.9996 +x_0=2520000 +y_0=0 +ellps=intl +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68 +units=m +no_defs');
            (0, proj4_2.register)(proj4_1.default);
            /** Definisco la lista iniziale di vettori */
            var vectorSource = this.customVectorSource || new Vector_2.default({
                features: this.initialFeaturesList || [],
            });
            /** trasformo la lista in layer */
            var vectorLayer = this.customVectorLayer || new Vector_1.default({
                source: vectorSource,
                properties: {
                    name: "Poligoni"
                }
            });
            /** Istanza di selezione */
            var select = this.customSelect
                ? new Select_1.default(__assign(__assign({}, this.customSelect), { layers: [vectorLayer] }))
                : new Select_1.default({
                    condition: condition_1.click,
                    layers: [vectorLayer],
                });
            this.map = new Map_1.default({
                /** Faccio l'override del div con il rispettivo id */
                target: this.id,
                /** Lista dei layer nella mappa */
                layers: __spreadArray(__spreadArray([
                    /** Layer di base */
                    new Tile_1.default(this.tileLayersOptions),
                    /** layer dei vettori */
                    vectorLayer
                ], (this.customGraticule ? [this.customGraticule] : []), true), this.customLayers || [], true),
                /** Imposto la view */
                view: this.customView,
                /** Imposto i controlli */
                controls: [
                    /** Creo la barra collegata ai vettori */
                    new EditBar_1.default({
                        source: vectorSource,
                        /** Definisco le interazioni sulla source dei vettori */
                        interactions: {
                            Draw: (_a = this.barInteractions) === null || _a === void 0 ? void 0 : _a.drawInteraction,
                            DrawPolygon: (_b = this.barInteractions) === null || _b === void 0 ? void 0 : _b.drawPolygonInteraction,
                            DrawPoint: (_c = this.barInteractions) === null || _c === void 0 ? void 0 : _c.drawPointInteraction,
                            DrawLine: (_d = this.barInteractions) === null || _d === void 0 ? void 0 : _d.drawLineInteraction,
                            DrawCircle: (_e = this.barInteractions) === null || _e === void 0 ? void 0 : _e.drawCircleInteraction,
                            DrawRectangle: (_f = this.barInteractions) === null || _f === void 0 ? void 0 : _f.drawRectangleInteraction,
                            DrawHole: (_g = this.barInteractions) === null || _g === void 0 ? void 0 : _g.drawHoleInteraction,
                            Select: (_h = this.barInteractions) === null || _h === void 0 ? void 0 : _h.selectInteraction,
                            Modify: (_j = this.barInteractions) === null || _j === void 0 ? void 0 : _j.modifyInteraction,
                            Delete: (_k = this.barInteractions) === null || _k === void 0 ? void 0 : _k.deleteInteraction,
                            Transform: (_l = this.barInteractions) === null || _l === void 0 ? void 0 : _l.transformInteraction,
                            Undo: (_m = this.barInteractions) === null || _m === void 0 ? void 0 : _m.undoInteraction,
                            Redo: (_o = this.barInteractions) === null || _o === void 0 ? void 0 : _o.redoInteraction
                        }
                    }),
                    /** Creo la barra della scala */
                    this.customScaleline,
                    /** Creo la gestione fullscreen */
                    new FullScreen_1.default(),
                    /** Creo la gestione zoom */
                    new Zoom_1.default()
                ]
            });
            if (this.customOverlay) {
                this.map.addOverlay(this.customOverlay);
            }
            /** Aggiungo le interazioni per la select sui vettori */
            if (this.customInteractions) {
                select.on('select', function (event) { return _this.customInteractions(event); });
                this.map.addInteraction(select);
            }
            /** Aggiungo i listeners dei layer */
            if (this.customLayersListeners) {
                this.customLayersListeners.map(function (l) { var _a; return (_a = _this.map) === null || _a === void 0 ? void 0 : _a.getLayers().on(l.listenerType, l.listenerCallback); });
            }
            /** aggiungo i listeners */
            if (this.customListeners) {
                this.customListeners.map(function (l) { var _a; return (_a = _this.map) === null || _a === void 0 ? void 0 : _a.on(l.listenerType, l.listenerCallback); });
            }
            /** Aggiungo i listener dei vettori */
            if (this.customLayersListeners) {
                this.customFeaturesListeners.map(function (l) { return vectorSource.on(l.listenerType, l.listenerCallback); });
            }
        };
        return LeonardoMap;
    }());
    exports.LeonardoMap = LeonardoMap;
    ;
});
