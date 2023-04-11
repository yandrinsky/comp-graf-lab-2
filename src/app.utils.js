import { nearDot } from './CNV_lib/Engine/geometry';

const factorial = num => {
    let newNum = 1;

    for (let i = 1; i <= num; i++) {
        newNum = newNum * i;
    }

    return newNum;
};

const getBezierCurveDots = dots => {
    const bezierDotsX = dots.map(pair => pair.x);
    const bezierDotsY = dots.map(pair => pair.y);

    let t = 0;
    const bezierDegree = bezierDotsX.length - 1;
    let P = null;
    let PY = null;
    const res = [];

    while (t <= 1 && bezierDegree > 0) {
        P =
            (1 - t) ** bezierDegree * bezierDotsX[0] +
            t ** bezierDegree * bezierDotsX[bezierDotsX.length - 1];

        for (let i = 1; i < bezierDegree; i++) {
            P =
                P +
                (factorial(bezierDegree) / (factorial(i) * factorial(bezierDegree - i))) *
                    t ** i *
                    (1 - t) ** (bezierDegree - i) *
                    bezierDotsX[i];
        }

        PY =
            (1 - t) ** bezierDegree * bezierDotsY[0] +
            t ** bezierDegree * bezierDotsY[bezierDotsY.length - 1];

        for (let i = 1; i < bezierDegree; i++) {
            PY =
                PY +
                (factorial(bezierDegree) / (factorial(i) * factorial(bezierDegree - i))) *
                    t ** i *
                    (1 - t) ** (bezierDegree - i) *
                    bezierDotsY[i];
        }

        t += 0.0005;

        res.push({ x: P, y: PY });

        P = 0;
        PY = 0;
    }

    return res;
};

export const renderBezierCurve = ({ dots: initialDots, CNV }) => {
    const dots = getBezierCurveDots(initialDots);

    CNV.combineRender(() => {
        CNV.querySelectorAll('.circleAsBezier').forEach(item => {
            item.remove();
        });
    });

    CNV.combineRender(() => {
        dots.filter((item, index) => index % 2 === 0).forEach(dot => {
            const circle = CNV.createCircle({ x0: dot.x, y0: dot.y, className: 'circleAsBezier' });

            circle.onmouseenter = e => {
                if (e.target.classList.contains('circleAsBezierActive')) {
                    console.log('return');
                    return;
                }

                CNV.combineRender(() => {
                    CNV.querySelectorAll('.circleAsBezier').forEach(item => {
                        item.classList.add('circleAsBezierActive');
                    });
                });
            };

            circle.onmouseleave = e => {
                const allCircles = CNV.querySelectorAll('.circleAsBezier');

                let isEverythingLeft = true;

                allCircles.forEach(circle => {
                    nearDot(
                        {
                            distance: circle.link.getCSS().radius,
                            userX: e.clientX,
                            userY: e.clientY,
                            circle: circle.link
                        },
                        () => (isEverythingLeft = false)
                    );
                });

                console.log('isEverythingLeft', isEverythingLeft);

                if (isEverythingLeft) {
                    console.log('her');
                    CNV.combineRender(() => {
                        CNV.querySelectorAll('.circleAsBezierActive').forEach(item => {
                            item.classList.remove('circleAsBezierActive');
                        });
                    });
                }
            };
        });
    });
};
