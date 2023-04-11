import { CNV as CNV_lib } from './CNV_lib/library';
import { CSS } from './css';
import { renderBezierCurve } from './app.utils';

export const useInitial = () => {
    let CNV;

    const canvas = document.querySelector('#canvas');
    const context = canvas.getContext('2d');

    CNV = new CNV_lib({
        canvas,
        context,
        css: CSS
    });

    const renderCurve = () => {
        const dots = CNV.querySelectorAll('.circle').map(circle => ({
            x: circle.link.getCoords().start.x,
            y: circle.link.getCoords().start.y
        }));

        renderBezierCurve({
            dots,
            CNV
        });
    };

    return { CNV, renderCurve };
};
