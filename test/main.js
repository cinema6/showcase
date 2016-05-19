import '../src/polyfill';
import { Promise } from 'es6-promise';
import 'core-js/es6/weak-map';

window.Promise = Promise;

const realSetTimeout = global.setTimeout;
Promise._setScheduler(flush => realSetTimeout(flush));
