import { Feature, MapEvent, Overlay, Tile } from "ol";
import { Polygon } from "ol/geom";
import BaseLayer from "ol/layer/Base";
// @ts-ignore
import EditBar from 'ol-ext/control/EditBar';
import 'ol-ext/dist/ol-ext.css';
// @ts-ignore
import Popup from 'ol-ext/overlay/Popup';
import View from 'ol/View';
import { SelectEvent, Options as SelectOptions } from 'ol/interaction/Select';
import { Options } from 'ol/layer/BaseTile';
import VectorLayer from 'ol/layer/Vector';
import 'ol/ol.css';
import OSM from 'ol/source/OSM';
import VectorSource, { VectorSourceEvent } from 'ol/source/Vector';
// @ts-ignore
import { containsExtent, Extent, intersects } from "ol/extent";
import { TileSourceEvent } from "ol/source/Tile";
import { Types } from "ol/MapEventType";
import { VectorSourceEventTypes } from "ol/source/VectorEventType";
import BaseEvent from "ol/events/Event";
import { EventTypes } from "ol/Observable";
import RenderEvent from "ol/render/Event";
import { MapRenderEventTypes } from "ol/render/EventType";
// @ts-ignore
import { ImageStatic, Source, TileImage, TileWMS } from "ol/source";
import ScaleLine from 'ol/control/ScaleLine';
import Graticule from 'ol/layer/Graticule.js';

/** Interfaccia della barra di interazioni */
export interface BarInteractions {
    drawInteraction?: boolean,
    drawPolygonInteraction?: boolean,
    drawPointInteraction?: boolean,
    drawLineInteraction?: boolean,
    drawCircleInteraction?: boolean,
    drawRectangleInteraction?: boolean,
    drawHoleInteraction?: boolean,
    selectInteraction?: boolean,
    modifyInteraction?: boolean,
    deleteInteraction?: boolean,
    transformInteraction?: boolean,
    undoInteraction?: boolean,
    redoInteraction?: boolean
}

export const defaultInteractions: BarInteractions = {
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

/** Interfaccia del layer principale */
export interface TileLayerOptionsInterface {
    source?: TileImage; // | OSM | TileWMS
    opacity?: number;
    visible?: boolean;
    extent?: Extent;
    zIndex?: number;
    minResolution?: number;
    maxResolution?: number;
    preload?: number;
    useInterimTilesOnError?: boolean;
    className?: string;
    tileClass?: string;
    updateWhileAnimating?: boolean;
    updateWhileInteracting?: boolean;
    renderOrder?: (a: Tile, b: Tile) => number;
    renderBuffer?: number;
    renderMode?: 'image' | 'hybrid' | 'vector';
    declutter?: boolean;
    sourceChanged?: () => void;
    tileLoadStart?: (event: TileSourceEvent) => void;
    tileLoadEnd?: (event: TileSourceEvent) => void;
    tileLoadError?: (event: TileSourceEvent) => void;
}

export const defaultTileLayerOptions: TileLayerOptionsInterface = {
    /** Istanza di open street map */
    source: new OSM(),
    /** Opacita */
    opacity: 1,
    /** Visibilità */
    visible: true,
};

export interface ListenersProps {
    listenerType: Types | MapRenderEventTypes | any, // TODO da correggere il type
    listenerCallback: (event: MapEvent | RenderEvent) => unknown
}

export interface FeatureListenersProps {
    listenerType: VectorSourceEventTypes,
    listenerCallback: (event: VectorSourceEvent<Feature<Polygon>>) => unknown
}

export interface LayersListenersProps {
    listenerType: 'add' | EventTypes | 'propertychange' | 'change:length' | 'remove',
    listenerCallback: (event: BaseEvent) => unknown
}

export interface MapsProps {
    /** id of the div */
    id?: string;
    /** stile del div */
    style?: string
    /** Lista dei vettori iniziali */
    initialFeaturesList?: Array<Feature<Polygon>>
    /** la feature selezionata */
    featureSelected?: Feature
    /** Lista dei layer iniziali */
    customLayers?: BaseLayer[]
    /** Lista delle interazioni ammesse sulla mappa */
    barInteractions?: BarInteractions
    /** Opzioni per le tile del layer di base */
    options?: Options<TileImage /*OSM*/> | undefined
    /** Opzioni per le tile del layer di base */
    tileLayersOptions?: TileLayerOptionsInterface
    /** Dimensioni della mappa */
    dimensioni?: { width: string, height: string }
    /** La mappa usata compresa di zoom, projection e centro */
    customView?: View
    /** Interazioni personalizzate per le select */
    customInteractions?: (event: SelectEvent) => unknown
    /** Overlay personalizzati */
    customOverlay?: Overlay
    /** Listeners personalizzati */
    customListeners?: ListenersProps[]
    /** Listeners features */
    customFeaturesListeners?: FeatureListenersProps[]
    /** Listeners layers */
    customLayersListeners?: LayersListenersProps[]
    /** Il graticolato - modello di default defaultGraticule presente come export */
    customGraticule?: Graticule
    /** Barra della scala della mappa */
    customScaleline?: ScaleLine
    /** Layer dei vettori */
    customVectorLayer?: VectorLayer<Feature<Polygon>>
    /** Risorse del layer di vettori */
    customVectorSource?: VectorSource<Feature<Polygon>>
    /** Select dei layer di vettori */
    customSelect?: SelectOptions
    /** Classi personalizzate */
    classes?: string
}