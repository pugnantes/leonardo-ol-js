import { Feature, Overlay } from "ol";
import { Polygon } from "ol/geom";
import BaseLayer from "ol/layer/Base";
import Map from 'ol/Map';
// @ts-ignore
import EditBar from 'ol-ext/control/EditBar';
import 'ol-ext/dist/ol-ext.css';
// @ts-ignore
import { click } from 'ol/events/condition';
import Select, { SelectEvent, Options as SelectOptions } from 'ol/interaction/Select';
import { Options } from 'ol/layer/BaseTile';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import 'ol/ol.css';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import proj4 from 'proj4';
// @ts-ignore
import { Coordinate } from "ol/coordinate";
import { Extent } from "ol/extent";
import { EventTypes } from "ol/Observable";
import { transform, transformExtent } from "ol/proj";
import { register } from 'ol/proj/proj4';
// @ts-ignore
import FullScreen from 'ol/control/FullScreen';
import ScaleLine from 'ol/control/ScaleLine';
import Zoom from 'ol/control/Zoom';
import Graticule from 'ol/layer/Graticule.js';
import { TileImage } from "ol/source";
import { BarInteractions, defaultInteractions, defaultTileLayerOptions, FeatureListenersProps, LayersListenersProps, ListenersProps, MapsProps, TileLayerOptionsInterface } from "./map-type";
import { defaultScaleline, defaultView } from "./map-utils";



/** Componente base della mappa */
export class LeonardoMap implements MapsProps {
    id?: string;
    style?: string;
    initialFeaturesList?: Array<Feature<Polygon>>;
    featureSelected?: Feature;
    customLayers?: BaseLayer[];
    barInteractions?: BarInteractions;
    options?: Options<TileImage /*OSM*/> | undefined;
    tileLayersOptions?: TileLayerOptionsInterface;
    dimensioni?: { width: string, height: string };
    customView?: View;
    customInteractions: (event: SelectEvent) => unknown = () => { };
    customOverlay?: Overlay;
    customListeners: ListenersProps[] = [];
    customFeaturesListeners: FeatureListenersProps[] = [];
    customLayersListeners?: LayersListenersProps[];
    customGraticule?: Graticule;
    customScaleline?: ScaleLine;
    customVectorLayer?: VectorLayer<Feature<Polygon>>;
    customVectorSource?: VectorSource<Feature<Polygon>>;
    customSelect?: SelectOptions;
    classes?: string;
    map?: Map;

    constructor({
        id = "map",
        initialFeaturesList = [],
        barInteractions = defaultInteractions,
        tileLayersOptions = defaultTileLayerOptions,
        customLayers = [],
        style,
        dimensioni = { width: "100%", height: "100vh" },
        customListeners = [],
        customInteractions = () => { },
        customFeaturesListeners = [],
        customOverlay,
        customLayersListeners = [],
        classes,
        customView = defaultView,
        customGraticule,
        customScaleline = defaultScaleline,
        customVectorLayer,
        customVectorSource,
        customSelect,
        featureSelected,
        options
    }: MapsProps) {
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

    private initializeMap() {

        /** definisco proiezioni 3003 e 3004 */
        proj4.defs('EPSG:3003', '+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68 +units=m +no_defs');
        proj4.defs('EPSG:3004', '+proj=tmerc +lat_0=0 +lon_0=15 +k=0.9996 +x_0=2520000 +y_0=0 +ellps=intl +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68 +units=m +no_defs');
        register(proj4);

        /** Definisco la lista iniziale di vettori */
        const vectorSource = this.customVectorSource || new VectorSource({
            features: this.initialFeaturesList || [],
        });

        /** trasformo la lista in layer */
        const vectorLayer = this.customVectorLayer || new VectorLayer({
            source: vectorSource,
            properties: {
                name: "Poligoni"
            }
        })

        /** Istanza di selezione */
        const select = this.customSelect
            ? new Select({ ...this.customSelect, layers: [vectorLayer] })
            : new Select({
                condition: click,
                layers: [vectorLayer],
            });

        this.map = new Map({
            /** Faccio l'override del div con il rispettivo id */
            target: this.id,
            /** Lista dei layer nella mappa */
            layers: [
                /** Layer di base */
                new TileLayer(this.tileLayersOptions),
                /** layer dei vettori */
                vectorLayer,
                /** graticolato con latitudine e longitudine */
                ...(this.customGraticule ? [this.customGraticule] : []),
                /** layer vari (RASTER) */
                ...this.customLayers || [],
            ],
            /** Imposto la view */
            view: this.customView,
            /** Imposto i controlli */
            controls: [
                /** Creo la barra collegata ai vettori */
                new EditBar({
                    source: vectorSource,
                    /** Definisco le interazioni sulla source dei vettori */
                    interactions: {
                        Draw: this.barInteractions?.drawInteraction,
                        DrawPolygon: this.barInteractions?.drawPolygonInteraction,
                        DrawPoint: this.barInteractions?.drawPointInteraction,
                        DrawLine: this.barInteractions?.drawLineInteraction,
                        DrawCircle: this.barInteractions?.drawCircleInteraction,
                        DrawRectangle: this.barInteractions?.drawRectangleInteraction,
                        DrawHole: this.barInteractions?.drawHoleInteraction,
                        Select: this.barInteractions?.selectInteraction,
                        Modify: this.barInteractions?.modifyInteraction,
                        Delete: this.barInteractions?.deleteInteraction,
                        Transform: this.barInteractions?.transformInteraction,
                        Undo: this.barInteractions?.undoInteraction,
                        Redo: this.barInteractions?.redoInteraction
                    }
                }),
                /** Creo la barra della scala */
                this.customScaleline,
                /** Creo la gestione fullscreen */
                new FullScreen(),
                /** Creo la gestione zoom */
                new Zoom()
            ]
        });

        if (this.customOverlay) {
            this.map.addOverlay(this.customOverlay);
        }

        /** Aggiungo le interazioni per la select sui vettori */
        if (this.customInteractions) {
            select.on('select', (event: SelectEvent) => this.customInteractions(event));
            this.map.addInteraction(select);
        }

        /** Aggiungo i listeners dei layer */
        if (this.customLayersListeners) {
            this.customLayersListeners.map(l => this.map?.getLayers().on(l.listenerType as EventTypes, l.listenerCallback));
        }

        /** aggiungo i listeners */
        if (this.customListeners) {
            this.customListeners.map(l => this.map?.on(l.listenerType, l.listenerCallback));
        }

        /** Aggiungo i listener dei vettori */
        if (this.customLayersListeners) {
            this.customFeaturesListeners.map(l => vectorSource.on(l.listenerType, l.listenerCallback));
        }

    }

    /** conversione da 3004 a 3587 */
    public from3004To3857 = (coordinate: Coordinate): Coordinate => {
        return transform(coordinate, 'EPSG:3004', 'EPSG:3857')
    }

    /** conversione da 3003 a 3587 */
    public from3003To3857 = (coordinate: Coordinate): Coordinate => {
        return transform(coordinate, 'EPSG:3003', 'EPSG:3857')
    }

    /** conversione a 3004 */
    public from3857To3004 = (coordinate: Coordinate): Coordinate => {
        return transform(coordinate, 'EPSG:3857', 'EPSG:3004')
    }

    /** conversione a 3003 */
    public from3857To3003 = (coordinate: Coordinate): Coordinate => {
        return transform(coordinate, 'EPSG:3857', 'EPSG:3003')
    }

    public extentFrom3003To3857 = (extent: Extent): Extent => {
        return transformExtent(extent, 'EPSG:3003', 'EPSG:3857');
    }

    public extentFrom3004To3857 = (extent: Extent): Extent => {
        return transformExtent(extent, 'EPSG:3004', 'EPSG:3857');
    }

    public extentFrom3857To3003 = (extent: Extent): Extent => {
        return transformExtent(extent, 'EPSG:3857', 'EPSG:3003');
    }

    public extentFrom3857To3004 = (extent: Extent): Extent => {
        return transformExtent(extent, 'EPSG:3857', 'EPSG:3004');
    }

};

