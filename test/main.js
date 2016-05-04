import '../src/polyfill';
import { Promise } from 'es6-promise';

window.Promise = Promise;

const realSetTimeout = global.setTimeout;
Promise._setScheduler(flush => realSetTimeout(flush));
