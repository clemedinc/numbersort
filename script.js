// Game state
let currentNumber;
let score = 0;
let goalPoints = 50;
let gameTime = 5; // in minutes
let hoverEnabled = true;
let enabledCategories = new Set(["Basic Properties", "Multiples", "Comparisons", "Rounding", "Written Form", "Expanded Form"]);
let gameTimer;

// Category definitions
const categories = {
    "Basic Properties": ["Even", "Odd", "Prime", "Composite", "Square Number"],
    "Multiples": ["Multiple of 3", "Multiple of 4", "Multiple of 5", "Multiple of 6", "Multiple of 7", "Multiple of 8"],
    "Comparisons": ["Greater than 50", "Less than 50", "Equal to 50", "Greater than 100", "Less than 100", "Equal to 100"],
    "Rounding": ["Rounds to nearest 10", "Rounds to nearest 100", "Rounds to nearest 1000"],
    "Written Form": [], // Will be populated dynamically
    "Expanded Form": [] // Will be populated dynamically
};

// Category explanations (2nd-grade level)
const categoryExplanations = {
    'Even': 'Numbers that can be divided by 2 with no leftovers.',
    'Odd': 'Numbers that have 1 left over when divided by 2.',
    'Prime': 'Numbers that can only be divided by 1 and themselves.',
    'Composite': 'Numbers that can be divided by more than just 1 and themselves.',
    'Square Number': 'Numbers that are the result of multiplying a number by itself.',
    'Multiple of 3': 'Numbers that can be divided by 3 with no leftovers.',
    'Multiple of 4': 'Numbers that can be divided by 4 with no leftovers.',
    'Multiple of 5': 'Numbers that can be divided by 5 with no leftovers.',
    'Multiple of 6': 'Numbers that can be divided by 6 with no leftovers.',
    'Multiple of 7': 'Numbers that can be divided by 7 with no leftovers.',
    'Multiple of 8': 'Numbers that can be divided by 8 with no leftovers.',
    'Greater than 50': 'Numbers that are bigger than 50.',
    'Less than 50': 'Numbers that are smaller than 50.',
    'Equal to 50': 'The number is exactly 50.',
    'Greater than 100': 'Numbers that are bigger than 100.',
    'Less than 100': 'Numbers that are smaller than 100.',
    'Equal to 100': 'The number is exactly 100.',
    'Rounds to nearest 10': 'When we round this number to the closest ten.',
    'Rounds to nearest 100': 'When we round this number to the closest hundred.',
    'Rounds to nearest 1000': 'When we round this number to the closest thousand.',
    'Number in Words': 'How we say this number using words.',
    'Expanded Form': 'Writing the number to show the value of each digit.'
};

// Helper functions
function numberToWords(num) {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? '-' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 !== 0 ? ' ' + numberToWords(num % 100) : '');
    return 'number too large';
}

function expandedForm(num) {
    return num.toString()
        .split('')
        .reverse()
        .map((digit, index) => digit + '0'.repeat(index))
        .filter(term => parseInt(term) !== 0)
        .reverse()
        .join(' + ');
}

function isPrime(num) {
    for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
        if (num % i === 0) return false;
    }
    return num > 1;
}

// Game functions
function startGame() {
    score = 0;
    updateScore();
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    startTimer();
    newRound();
}

function newRound() {
    // Generate a random number based on difficulty
    const difficulty = Math.random();
    if (difficulty < 0.33) {
        currentNumber = Math.floor(Math.random() * 100) + 1; // Easy: 1-100
    } else if (difficulty < 0.67) {
        currentNumber = Math.floor(Math.random() * 100) + 101; // Medium: 101-200
    } else {
        currentNumber = Math.floor(Math.random() * 300) + 201; // Hard: 201-500
    }

    document.getElementById('number-display').textContent = currentNumber;

    // Generate options for Written Form and Expanded Form
    categories["Written Form"] = [numberToWords(currentNumber)];
    categories["Expanded Form"] = [expandedForm(currentNumber)];

    generateCategories();
    document.getElementById('result').textContent = '';
}

function generateCategories() {
    const categoriesContainer = document.getElementById('categories-container');
    categoriesContainer.innerHTML = '';

    for (const [groupName, categoryList] of Object.entries(categories)) {
        if (enabledCategories.has(groupName)) {
            const groupElement = document.createElement('div');
            groupElement.className = 'category-group';
            groupElement.innerHTML = `<h3>${groupName}</h3>`;
            
            categoryList.forEach(category => {
                const categoryElement = document.createElement('div');
                categoryElement.className = 'category';
                categoryElement.textContent = category;
                categoryElement.onclick = () => categoryElement.classList.toggle('selected');
                
                if (hoverEnabled && categoryExplanations[category]) {
                    categoryElement.title = categoryExplanations[category];
                }

                groupElement.appendChild(categoryElement);
            });

            categoriesContainer.appendChild(groupElement);
        }
    }
}

function checkAnswers() {
    const selectedCategories = document.querySelectorAll('.category.selected');
    let correct = 0;
    let incorrect = 0;

    selectedCategories.forEach(categoryElement => {
        const category = categoryElement.textContent;
        const isCorrect = checkCategory(category, currentNumber);

        if (isCorrect) {
            correct++;
            categoryElement.style.backgroundColor = 'green';
        } else {
            incorrect++;
            categoryElement.style.backgroundColor = 'red';
        }
    });

    score += correct - incorrect;
    updateScore();

    const resultText = `Correct: ${correct}, Incorrect: ${incorrect}`;
    const encouragement = getEncouragement(correct, incorrect);
    document.getElementById('result').textContent = `${resultText}. ${encouragement}`;

    setTimeout(() => {
        document.getElementById('result').textContent = '';
        newRound();
    }, 3000);
}

function checkCategory(category, number) {
    switch (true) {
        case category === "Even": return number % 2 === 0;
        case category === "Odd": return number % 2 !== 0;
        case category === "Prime": return isPrime(number);
        case category === "Composite": return !isPrime(number) && number > 1;
        case category === "Square Number": return Math.sqrt(number) % 1 === 0;
        case category.startsWith("Multiple of"):
            const multiple = parseInt(category.split(" ")[2]);
            return number % multiple === 0;
        case category === "Greater than 50": return number > 50;
        case category === "Less than 50": return number < 50;
        case category === "Equal to 50": return number === 50;
        case category === "Greater than 100": return number > 100;
        case category === "Less than 100": return number < 100;
        case category === "Equal to 100": return number === 100;
        case category.startsWith("Rounds to nearest"):
            const roundTo = parseInt(category.split(" ")[3]);
            return Math.round(number / roundTo) * roundTo === number;
        case category === numberToWords(number): return true;
        case category === expandedForm(number): return true;
        default: return false;
    }
}

function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
    const progress = (score / goalPoints) * 100;
    document.getElementById('progress-bar').style.width = `${Math.min(progress, 100)}%`;

    if (score >= goalPoints) {
        endGame(true);
    }
}

function startTimer() {
    const endTime = Date.now() + gameTime * 60 * 1000;
    
    gameTimer = setInterval(() => {
        const timeLeft = Math.max(0, endTime - Date.now());
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        
        document.getElementById('timer').textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft === 0) {
            endGame(false);
        }
    }, 1000);
}

function endGame(won) {
    clearInterval(gameTimer);
    
    const message = won ? `Congratulations! You reached ${goalPoints} points!` : 'Time\'s up!';
    alert(`${message}\nFinal Score: ${score}`);
    
    returnToMenu();
}

function returnToMenu() {
    clearInterval(gameTimer);
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}

function getEncouragement(correct, incorrect) {
    if (correct > incorrect) {
        return "Great job! Keep it up!";
    } else if (correct === incorrect) {
        return "Not bad! You can do even better!";
    } else {
        return "Don't give up! You're learning with each try!";
    }
}

// Settings functions
function openSettings() {
    document.getElementById('category-modal').style.display = 'block';
    document.getElementById('goal-points').value = goalPoints;
    document.getElementById('game-time').value = gameTime;
    document.getElementById('hover-toggle').checked = hoverEnabled;
    
    const categoryOptions = document.getElementById('category-options');
    categoryOptions.innerHTML = '';
    Object.keys(categories).forEach(category => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = enabledCategories.has(category);
        checkbox.value = category;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(category));
        categoryOptions.appendChild(label);
        categoryOptions.appendChild(document.createElement('br'));
    });
}

function saveSettings() {
    goalPoints = parseInt(document.getElementById('goal-points').value);
    gameTime = parseInt(document.getElementById('game-time').value);
    hoverEnabled = document.getElementById('hover-toggle').checked;
    
    enabledCategories.clear();
    document.querySelectorAll('#category-options input:checked').forEach(checkbox => {
        enabledCategories.add(checkbox.value);
    });
    
    closeSettings();
}

function closeSettings() {
    document.getElementById('category-modal').style.display = 'none';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('select-categories').addEventListener('click', openSettings);
    document.getElementById('submit').addEventListener('click', checkAnswers);
    document.getElementById('back-to-menu').addEventListener('click', returnToMenu);
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    document.getElementsByClassName('close')[0].addEventListener('click', closeSettings);
});

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == document.getElementById('category-modal')) {
        closeSettings();
    }
}