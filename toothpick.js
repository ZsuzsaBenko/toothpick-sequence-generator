class ToothPickSequence {
    canvas = document.getElementById('canvas');
    context = this.canvas.getContext('2d');
    halfLength = 10;
    openPoints = new Map();

    generateFractal(steps) {
        this.reset();
        this.openPoints.set(0, [{x: 250, y: 250, isVertical: true}]);
        for (let i = 1; i <= steps; i++) {
            const currentPoints = this.openPoints.get(i - 1);
            this.openPoints.set(i, []);
            for (const coords of currentPoints) {
                const nextPoints = this.draw(coords.x, coords.y, coords.isVertical);
                this.openPoints.set(i, [...this.openPoints.get(i), ...nextPoints]);
            }
            this.deleteMeetingPoints(i);
        }
    }

    draw(x, y, isVertical) {
        if (this.context) {
            let nextCoords = [];
            this.context.beginPath();
            this.context.moveTo(x, y);
            if (isVertical) {
                this.context.lineTo(x, y + this.halfLength);
                this.context.moveTo(x, y);
                this.context.lineTo(x, y - this.halfLength);
                nextCoords =[{x, y: y + this.halfLength, isVertical: false}, {x, y: y - this.halfLength, isVertical: false}];
            } else {
                this.context.lineTo(x + this.halfLength, y);
                this.context.moveTo(x, y);
                this.context.lineTo(x - this.halfLength, y);
                nextCoords = [{x: x + this.halfLength, y, isVertical: true}, {x: x - this.halfLength, y, isVertical: true}];
            }
            this.context.stroke();
            return nextCoords;
        }
    }

    deleteMeetingPoints(step) {
        const currentPoints = Array.from(this.openPoints.get(step));
        for (const [key, value] of this.openPoints.entries()) {
            for (let i = 0; i < value.length; i++) {
                for (let j = 0; j < currentPoints.length; j++) {
                    if (key !== step && this.areCoordinatesEqual(value[i], currentPoints[j]) ||
                        i !== j && this.areCoordinatesEqual(value[i], currentPoints[j])) {
                        currentPoints[j] = null;
                    }
                }
            }
        }
        const filtered = currentPoints.filter(obj => null !== obj);
        this.openPoints.set(step, filtered);
    }

    areCoordinatesEqual(point1, point2) {
        return (point1 && point2) ? point1.x === point2.x && point1.y === point2.y : false;
    }

    reset() {
        this.openPoints = new Map();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

const toothPickSequence = new ToothPickSequence();
const generateBtn = document.getElementById('generate-btn');
const steps = document.getElementById('steps');
generateBtn.addEventListener('click', () => toothPickSequence.generateFractal(steps.value));

