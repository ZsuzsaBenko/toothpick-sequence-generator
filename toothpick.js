class ToothPickSequence {
    canvas = document.getElementById('canvas');
    table = document.querySelector('table');
    tbody = document.querySelector('tbody');
    context = this.canvas.getContext('2d');
    startXCoordinate = 300;
    startYCoordinate = 300;
    halfLength = 12;
    color = '#001a66';
    milliSecs = 750;
    openCoordinates = new Map();

    generateFractal(steps) {
        this.reset();
        this.table.style.display = 'block';
        this.openCoordinates.set(0, [{x: this.startXCoordinate, y: this.startYCoordinate}]);
        for (let i = 1; i <= steps; i++) {
            this.animate(i);
        }
    }

    animate(step) {
        setTimeout( () => {
            this.openCoordinates.set(step, []);
            this.setNextCoordinates(step);
            this.deleteMeetingPoints(step);
            this.addSequenceTableRow(step);
        }, step * this.milliSecs);
    }

    setNextCoordinates(step) {
        const currentCoordinates = this.openCoordinates.get(step - 1);
        const isVertical = 0 !== step % 2;
        for (const coords of currentCoordinates) {
            const nextCoordinates = this.draw(coords.x, coords.y, isVertical);
            this.openCoordinates.set(step, [...this.openCoordinates.get(step), ...nextCoordinates]);
        }
    }

    draw(x, y, isVertical) {
        if (this.context) {
            this.context.beginPath();
            this.context.moveTo(x, y);
            const nextCoords = isVertical ? this.drawVertically(x, y) : this.drawHorizontally(x, y);
            this.context.strokeStyle = this.color;
            this.context.stroke();
            return nextCoords;
        }
    }

    drawVertically(x, y) {
        this.context.lineTo(x, y + this.halfLength);
        this.context.moveTo(x, y);
        this.context.lineTo(x, y - this.halfLength);
        return [{x, y: y + this.halfLength}, {x, y: y - this.halfLength}];
    }

    drawHorizontally(x, y) {
        this.context.lineTo(x + this.halfLength, y);
        this.context.moveTo(x, y);
        this.context.lineTo(x - this.halfLength, y);
        return [{x: x + this.halfLength, y}, {x: x - this.halfLength, y}];
    }

    deleteMeetingPoints(step) {
        const currentCoordinates = Array.from(this.openCoordinates.get(step));
        for (const [key, value] of this.openCoordinates.entries()) {
            for (let i = 0; i < value.length; i++) {
                for (let j = 0; j < currentCoordinates.length; j++) {
                    if (key !== step && this.areCoordinatesEqual(value[i], currentCoordinates[j]) ||
                        i !== j && this.areCoordinatesEqual(value[i], currentCoordinates[j])) {
                        currentCoordinates[j] = null;
                    }
                }
            }
        }
        const filtered = currentCoordinates.filter(obj => null !== obj);
        this.openCoordinates.set(step, filtered);
    }

    areCoordinatesEqual(coord1, coord2) {
        return (coord1 && coord2) ? coord1.x === coord2.x && coord1.y === coord2.y : false;
    }

    reset() {
        this.tbody.innerHTML = '';
        this.openCoordinates = new Map();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addSequenceTableRow(step) {
        const row = document.createElement('tr');
        const tdStep = document.createElement('td');
        const tdTotal = document.createElement('td');
        const tdFree = document.createElement('td');
        tdStep.textContent = step;
        tdTotal.textContent = this.sumToothpicks(step);
        tdFree.textContent = this.openCoordinates.get(step).length;
        row.appendChild(tdStep);
        row.appendChild(tdTotal);
        row.appendChild(tdFree);
        this.tbody.appendChild(row);
    }

    sumToothpicks(step) {
        return (Array.from(this.openCoordinates.values()))
            .map(arr => arr.length)
            .reduce((prev, curr) => prev + curr) - this.openCoordinates.get(step).length;
    }
}

const toothPickSequence = new ToothPickSequence();
const generateBtn = document.getElementById('generate-btn');
const steps = document.getElementById('steps');
generateBtn.addEventListener('click', () => {
    const stepNumber = 0 < steps.value && 50 >= steps.value ? steps.value : 0;
    toothPickSequence.generateFractal(stepNumber);
});
