import moment from 'moment';

function toNearest(value, rounder) {
    return Math.round(value / rounder) * rounder;
}

export function estimateImpressions({ end, viewsPerDay, start = moment() }) {
    const days = Math.round(end.diff(start, 'days', true));

    return toNearest(days * viewsPerDay, 50);
}
