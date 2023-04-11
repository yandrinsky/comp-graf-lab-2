import React, { useEffect } from 'react';
import './app.css';
import { useInitial } from './app.hook';

export const App = () => {
    useEffect(() => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { CNV, renderCurve } = useInitial();

        CNV.state.isAuxLines = true;

        CNV.layout.onclick = e => {
            const circle = CNV.createCircle({
                x0: e.clientX,
                y0: e.clientY,
                className: CNV.state.isAuxLines ? 'circle' : ['circle', 'hidden']
            });

            circle.onmouseenter = e => {
                e.target.classList.add('circleActive');
            };

            circle.onmouseleave = e => {
                e.target.classList.remove('circleActive');
            };

            circle.ondrag = e => {
                e.target.update.start.x = e.clientX;
                e.target.update.start.y = e.clientY;

                const line = CNV.querySelector('#' + circle.link.id);
                const circles = CNV.querySelectorAll('.circle');

                if (line) {
                    line.update.end.x = e.clientX;
                    line.update.end.y = e.clientY;

                    const index = circles.indexOf(circle);

                    if (index !== circles.length - 1) {
                        const lineAfter = CNV.querySelector(
                            '#' + CNV.querySelectorAll('.circle')[index + 1].id
                        );

                        lineAfter.update.start.x = e.clientX;
                        lineAfter.update.start.y = e.clientY;
                    }
                } else {
                    const index = circles.indexOf(circle) + 1;
                    const line = CNV.querySelector('#' + CNV.querySelectorAll('.circle')[index].id);

                    line.update.start.x = e.clientX;
                    line.update.start.y = e.clientY;
                }

                renderCurve();
            };

            renderCurve();

            const circles = CNV.querySelectorAll('.circle');

            if (circles.length > 1) {
                CNV.createLine({
                    x0: circles.at(-2).link.getCoords().start.x,
                    y0: circles.at(-2).link.getCoords().start.y,
                    x1: circles.at(-1).link.getCoords().start.x,
                    y1: circles.at(-1).link.getCoords().start.y,
                    className: CNV.state.isAuxLines ? 'line' : ['line', 'hidden'],
                    id: circle.link.id
                });
            }

            circle.onclick = () => {};
        };

        const text = CNV.createText({
            x0: CNV.canvas.clientWidth - 230,
            y0: CNV.canvas.clientHeight - 20,
            text: 'Вспомогательные линии',
            className: 'auxLinesButton'
        });

        text.onclick = () => {
            CNV.state.isAuxLines = !CNV.state.isAuxLines;

            CNV.combineRender(() => {
                if (CNV.state.isAuxLines) {
                    CNV.querySelectorAll('.circle').forEach(item =>
                        item.classList.remove('hidden')
                    );
                    CNV.querySelectorAll('.line').forEach(item => item.classList.remove('hidden'));
                } else {
                    CNV.querySelectorAll('.circle').forEach(item => item.classList.add('hidden'));
                    CNV.querySelectorAll('.line').forEach(item => item.classList.add('hidden'));
                }
            });
        };
    }, []);

    return (
        <div>
            <canvas id="canvas" width={window.innerWidth} height={window.innerHeight} />
        </div>
    );
};
