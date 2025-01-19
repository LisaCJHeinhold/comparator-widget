// DOM Elements
let stackOne = document.querySelector("#stack1");
let stackTwo = document.querySelector("#stack2");
let stackOneCount = document.querySelector(".stack1-count");
let stackTwoCount = document.querySelector(".stack2-count");
let inputCount1 = document.querySelector("#input-count1");
let inputCount2 = document.querySelector("#input-count2");
let spanCount1 = document.querySelector("#span-count1");
let spanCount2 = document.querySelector("#span-count2");
let deleteBox = document.querySelector(".delete-box");
const topPoints = document.querySelectorAll('.point-box-top');
const bottomPoints = document.querySelectorAll('.point-box-bot');
const clearLinesButton = document.querySelector('.clear-btn');
const compareButton = document.querySelector('.compare-btn');
const playButton = document.querySelector('.play');

let currentLine = null;
let firstPoint = null;
let lineElement = null;
let lines = [];

// Add Event Listeners for stack1 and stack2
stackOne.addEventListener("click", () => addBlock(stackOne, stackOneCount));
stackTwo.addEventListener("click", () => addBlock(stackTwo, stackTwoCount));

// Add Event Listeners for stack counts input
spanCount1.addEventListener("click", () => toggleInputDisplay(spanCount1, inputCount1));
spanCount2.addEventListener("click", () => toggleInputDisplay(spanCount2, inputCount2));

// Handle blur event on input fields to update counts
inputCount1.addEventListener("blur", () => updateStackCount(stackOne, stackOneCount, inputCount1, spanCount1));
inputCount2.addEventListener("blur", () => updateStackCount(stackTwo, stackTwoCount, inputCount2, spanCount2));

// Handle keypress events for blur on Enter
inputCount1.addEventListener("keypress", (event) => handleKeyPress(event, inputCount1));
inputCount2.addEventListener("keypress", (event) => handleKeyPress(event, inputCount2));

// Add Event Listener for play button
playButton.addEventListener("click", () => compareStacks(stackOne, stackTwo));

// event listener to draw the static lines
compareButton.addEventListener('click', drawStaticLines);

// Add event listener for clear lines button
clearLinesButton.addEventListener('click', clearLines);

// function to determine which stack has more cubes and which comparitor to use
function compareStacks(stack1, stack2) {
    // get number of cubes in each stack
    const countOneCubes = stack1.querySelectorAll(".cube").length;
    const countTwoCubes = stack2.querySelectorAll(".cube").length;
    // determine which stack has more cubes and which comparitor to use
    let comparisonResults = '';
    if (countOneCubes > countTwoCubes) {
        comparisonResults = 'greater';
    } else if (countOneCubes < countTwoCubes) {
        comparisonResults = 'less';
    } else {
        comparisonResults = 'equal';
    }
    // call animateComparison function to animate comparison symbol
    animateComparison(comparisonResults);
}

// function to animate comparison symbol
function animateComparison(comparisonResults) {
    // determine which symbol to use
    let comparisonSymbol = '';
    if (comparisonResults === 'greater') {
        comparisonSymbol = '>';
    } else if (comparisonResults === 'less') {
        comparisonSymbol = '<';
    } else if (comparisonResults === 'equal') {
        comparisonSymbol = '=';
    }

    // create symbol element
    const symbolElement = document.createElement('div');
    symbolElement.textContent = comparisonSymbol;
    symbolElement.classList.add('comparison-symbol');
    document.body.appendChild(symbolElement);

  
    // animate symbol element
    symbolElement.style.top = '50%';
    symbolElement.style.left = '50%';
    symbolElement.style.transform = 'translate(-50%, -50%)';
    symbolElement.style.fontSize = '100px';
    symbolElement.style.color = 'white';
    symbolElement.style.position = 'absolute';
    symbolElement.style.zIndex = '9999';

    // remove symbol element after animation
    setTimeout(() => {
        symbolElement.remove();
    }, 2500);
}


// function to toggle stack count from label to input
function toggleInputDisplay(spanElement, inputElement) {
    inputElement.value = spanElement.textContent;
    spanElement.style.display = "none";
    inputElement.style.display = "inline-block";
    inputElement.focus();
}

// function to add cubes based on input
function updateStackCount(stack, countElement, inputElement, spanElement) {
    const targetCount = parseInt(inputElement.value, 10) || 0;
    addCubesOneByOne(stack, countElement, targetCount);

    // update span and input elements
    spanElement.textContent = targetCount;
    spanElement.style.display = "inline-block";
    inputElement.style.display = "none";
}

// press enter to add cubes after typing number
function handleKeyPress(event, inputElement) {
    if (event.key === "Enter") {
        inputElement.blur();
    }
}

// functionality so cubes are added one by one for visual interest
function addCubesOneByOne(stack, countElement, targetCount) {
    const currentCount = stack.querySelectorAll(".cube").length;
    const validTargetCount = Math.min(Math.max(targetCount, 0), 10);
    const difference = validTargetCount - currentCount;
    
    // add or remove blocks one by one with a delay
    if (difference > 0) {
        let added = 0;
        const interval = setInterval(() => {
            if (added < difference) {
                addBlock(stack, countElement);
                added++;
            } else {
                clearInterval(interval);
            }
        }, 500);
    } else if (difference < 0) {
        let removed = 0;
        const cubes = stack.querySelectorAll(".cube");
        const interval = setInterval(() => {
            if (removed < Math.abs(difference)) {
                stack.removeChild(cubes[cubes.length - 1 - removed]);
                updateCount(stack, countElement);
                removed++;
            } else {
                clearInterval(interval);
            }
        }, 500);
    }
}

// function to add each block
function addBlock(stack, countElement) {
    // check if stack limit has been reached
    if (stack.querySelectorAll(".cube").length >= 10) {
        alert("Stack limit reached!");
        return;
    }

    const message = stack.querySelector(".add-message");
    if (message) message.remove();

    const cube = document.createElement("div");
    cube.classList.add("cube");
    
    // declare variables to track cube position
    let isDragging = false;
    let offsetX, offsetY; 

    // add event listener for mouse down
    cube.addEventListener("mousedown", (event) => {
        isDragging = true;
        // Calculate offset from mouse to cube's top-left corner
        offsetX = event.clientX - cube.getBoundingClientRect().left;
        offsetY = event.clientY - cube.getBoundingClientRect().top;
        
        // Add dragging styles
        cube.classList.add("dragging");
        deleteBox.classList.add("active");

        // Disable text selection while dragging
        document.body.style.userSelect = "none";

        // Temporarily remove the bounce animation during drag
        cube.classList.remove("bounce");
    });

    // add event listener for mouse move
    document.addEventListener("mousemove", (event) => {
        if (isDragging) {
            // Get the current scroll offsets
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;
    
            // Update cube position based on mouse movement with scroll offset
            cube.style.position = "absolute";
            cube.style.left = `${event.clientX - offsetX + scrollX}px`;
            cube.style.top = `${event.clientY - offsetY + scrollY}px`; 
        }
    });
    
    // add event listener for mouse up
    document.addEventListener("mouseup", (event) => {
        if (isDragging) {
            isDragging = false;
            cube.classList.remove("dragging");
            deleteBox.classList.remove("active");
    
            // Re-apply bounce animation
            cube.classList.add("bounce");
    
            // Enable text selection again
            document.body.style.userSelect = "";
    
            // Get the current scroll offsets
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;
    
            // Get the position of the delete box
            const deleteBoxRect = deleteBox.getBoundingClientRect();
    
            // Check if the cube is inside the delete box (considering the scroll position)
            const cubePositionX = event.clientX + scrollX;
            const cubePositionY = event.clientY + scrollY;
    
            if (
                cubePositionX >= deleteBoxRect.left + scrollX &&
                cubePositionX <= deleteBoxRect.right + scrollX &&
                cubePositionY >= deleteBoxRect.top + scrollY &&
                cubePositionY <= deleteBoxRect.bottom + scrollY
            ) {
                stack.removeChild(cube);
                updateCount(stack, countElement);
            } else {
                // Restore the cube to its original position
                cube.style.position = "relative";
                cube.style.left = "";
                cube.style.top = "";
            }
        }
    });    
    // add cube to stack and update count
    stack.appendChild(cube);
    updateCount(stack, countElement);
}


// update cube count
function updateCount(stack, countElement) {
    let remainingCubes = stack.querySelectorAll(".cube").length;
    countElement.textContent = remainingCubes;

    // update span and input elements for each stack count
    if (stack.id === "stack1") {
        spanCount1.textContent = remainingCubes;
        inputCount1.value = remainingCubes;
    } else if (stack.id === "stack2") {
        spanCount2.textContent = remainingCubes;
        inputCount2.value = remainingCubes;
    }

    // add message if no cubes remain
    if (remainingCubes === 0) {
        const addMessage = document.createElement("p");
        addMessage.textContent = "Click to add a cube";
        addMessage.classList.add("add-message");
        addMessage.addEventListener("click", () => addMessage.remove());
        stack.appendChild(addMessage);
    }
}

// add message if no cubes remain on page load
window.addEventListener("load", () => {
    if (stackOne.querySelectorAll(".cube").length === 0) {
        const addMessage = document.createElement("p");
        addMessage.textContent = "Click to add a cube";
        addMessage.classList.add("add-message");
        addMessage.addEventListener("click", () => addMessage.remove());
        stackOne.appendChild(addMessage);
    }

    // add message if no cubes remain on page load
    if (stackTwo.querySelectorAll(".cube").length === 0) {
        const addMessage = document.createElement("p");
        addMessage.textContent = "Click to add a cube";
        addMessage.classList.add("add-message");
        addMessage.addEventListener("click", () => addMessage.remove());
        stackTwo.appendChild(addMessage);
    }
});

// Line drawing functionality
topPoints.forEach(point => {
    point.addEventListener('click', () => handlePointClick(point, 'top'));
});

// Line drawing functionality
bottomPoints.forEach(point => {
    point.addEventListener('click', () => handlePointClick(point, 'bottom'));
});


observeCountChange(stackOneCount);
observeCountChange(stackTwoCount);

// function to observe count changes to make sure counts are updated
function observeCountChange(countElement) {
    const observer = new MutationObserver(() => {
        clearLines();
    });
    observer.observe(countElement, { childList: true, characterData: true, subtree: true });
}


// function to handle point clicks for the lines to be drawn
function handlePointClick(clickedPoint) {

     // Check if the clicked point is already connected to a line
     if (clickedPoint.classList.contains('connected')) {
        // Discard if the point is already connected or a line is being drawn
        return; 
    }

    // If no line is being drawn, start a new line
    if (!firstPoint) {
        console.log('clickedPoint', clickedPoint);
        console.log('firstPoint', firstPoint);
        firstPoint = clickedPoint;
        lineElement = createLineElement();
        document.body.appendChild(lineElement);
        document.addEventListener('mousemove', followMouse);
    } else {
        // If a line is being drawn, snap the line to the clicked point
        if (firstPoint !== clickedPoint && isValidConnection(firstPoint, clickedPoint)) {
            snapLineToEnd(clickedPoint);
            document.removeEventListener('mousemove', followMouse);
            firstPoint = null;
        } else {
            // follow the mouse
            document.addEventListener('mousemove', followMouse);
        }
    }
}

// function to check if two points are valid connections (top-top or bottom-bottom)
function isValidConnection(firstPoint, secondPoint) {
    if (firstPoint.classList.contains('point-box-top') && secondPoint.classList.contains('point-box-top')) return true;
    if (firstPoint.classList.contains('point-box-bot') && secondPoint.classList.contains('point-box-bot')) return true;
    return false;
}

// function to create a new line element
function createLineElement() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'line-canvas');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('class', 'line');
    line.setAttribute('x1', 0);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', 0);
    line.setAttribute('y2', 0);
    svg.appendChild(line);
    lines.push(svg);
    return svg;
}

// function to follow the mouse while drawing the line and update the line coordinates
function followMouse(event) {
    if (lineElement) {
        const line = lineElement.querySelector('line');
        const startRect = firstPoint.getBoundingClientRect();
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        line.setAttribute('x1', startRect.left + startRect.width / 2 + scrollX);
        line.setAttribute('y1', startRect.top + startRect.height / 2 + scrollY);
        line.setAttribute('x2', event.clientX + scrollX);
        line.setAttribute('y2', event.clientY + scrollY);
    }
}

// function to snap the line to the clicked point
function snapLineToEnd(clickedPoint) {
    // Check if the clicked point is a valid connection
    if (!isValidConnection(firstPoint, clickedPoint)) return;
    // add the connected class to the points
    clickedPoint.classList.add('connected');
    firstPoint.classList.add('connected');

    const startRect = firstPoint.getBoundingClientRect();
    const endRect = clickedPoint.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const line = lineElement.querySelector('line');

    line.setAttribute('x1', startRect.left + startRect.width / 2 + scrollX);
    line.setAttribute('y1', startRect.top + startRect.height / 2 + scrollY);
    line.setAttribute('x2', endRect.left + endRect.width / 2 + scrollX);
    line.setAttribute('y2', endRect.top + endRect.height / 2 + scrollY);
}

// function to clear the lines
function clearLines() {
    lines.forEach(line => line.remove());
    lines = []; 
    
    // remove the connected class from the points
    topPoints.forEach(point => point.classList.remove('connected'));
    bottomPoints.forEach(point => point.classList.remove('connected'));
}

// function to draw the static lines
function drawStaticLines() {
    // Get the current scroll position
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Draw the top and bottom lines
    const topPoint1 = topPoints[0].getBoundingClientRect();
    const topPoint2 = topPoints[1].getBoundingClientRect();
    drawLineBetweenPoints(topPoint1, topPoint2, scrollX, scrollY);

    const bottomPoint1 = bottomPoints[0].getBoundingClientRect();
    const bottomPoint2 = bottomPoints[1].getBoundingClientRect();
    drawLineBetweenPoints(bottomPoint1, bottomPoint2, scrollX, scrollY);
}

// function to draw a line between two points
function drawLineBetweenPoints(point1, point2, scrollX, scrollY) {
    // create a new SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'line-canvas');
    svg.style.position = 'absolute';
    svg.style.top = 0;
    svg.style.left = 0;
    svg.style.width = '100%';
    svg.style.height = '100%';

    // create a line element
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('class', 'line');
    line.setAttribute('x1', point1.left + point1.width / 2 + scrollX);
    line.setAttribute('y1', point1.top + point1.height / 2 + scrollY);
    line.setAttribute('x2', point2.left + point2.width / 2 + scrollX);
    line.setAttribute('y2', point2.top + point2.height / 2 + scrollY);
    line.setAttribute('stroke', 'white');
    line.setAttribute('stroke-width', '2');

    // add the line element to the SVG
    svg.appendChild(line);
    document.body.appendChild(svg);
    lines.push(svg);
}
