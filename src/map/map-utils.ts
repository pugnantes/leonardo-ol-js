// @ts-ignore
import 'ol-ext/dist/ol-ext.css';
// @ts-ignore
import Popup from 'ol-ext/overlay/Popup';
import View from 'ol/View';
import 'ol/ol.css';
// @ts-ignore
import { fromLonLat, toLonLat } from "ol/proj";
// @ts-ignore
import { Feature } from 'ol';
import ScaleLine from 'ol/control/ScaleLine';
import { toStringHDMS } from 'ol/coordinate';
import { SelectEvent } from 'ol/interaction/Select';
import Graticule from 'ol/layer/Graticule.js';
import { Stroke } from "ol/style";

export const defaultView: View = new View({
    /** Imposto il centro su Roma se non definito altrimenti */
    center: fromLonLat([12.4964, 41.9028], 'EPSG:3857'),
    /** Imposto lo zoom */
    zoom: 5,
    /** Imposto la projection */
    projection: 'EPSG:3857',
})

export const defaultScaleline: ScaleLine = new ScaleLine({
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
})

/** Graticolato di default */
export const defaultGraticule: Graticule = new Graticule({
    strokeStyle: new Stroke({
        color: 'rgba(255,120,0,0.9)',
        width: 2,
        lineDash: [0.5, 4],
    }),
    showLabels: true,
    wrapX: false,
})

/** Popup di default */
export const defaultPopup = new Popup({
    popupClass: 'default anim', // Classe CSS per lo stile e l'animazione del popup
    closeBox: true,
});

/** listener di default al select */
export const defaultOnSelect = (event: SelectEvent, popup: Popup) => {
    /** Estraggo la feature selezionata */
    const feature = event.selected[0] as Feature;
    if (feature) {
        /** Definisco le coordinate dove è stato premuto il pulsante */
        const coordinate = event.mapBrowserEvent.coordinate;
        popup.setPosition(coordinate);
        const hdms = toStringHDMS(toLonLat(coordinate));
        popup.show(coordinate, hdms);
    } else {
        /** Se clicco al di fuori di una feature chiudo il popup */
        popup.hide();
    }
};