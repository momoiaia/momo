// 題目資料
const quizData = [
    { word: "ability", options: ["能力", "時間", "地點", "金錢"], correct: 0 },
    { word: "about", options: ["之下", "關於", "之後", "之前"], correct: 1 },
    { word: "abroad", options: ["國內", "鄉下", "國外", "城市"], correct: 2 },
    { word: "accept", options: ["拒絕", "質疑", "懷疑", "接受"], correct: 3 },
    { word: "accident", options: ["意外", "計畫", "活動", "工作"], correct: 0 },
    { word: "achieve", options: ["失敗", "達到", "放棄", "開始"], correct: 1 },
    { word: "action", options: ["想法", "計畫", "行動", "結果"], correct: 2 },
    { word: "active", options: ["懶惰的", "安靜的", "疲倦的", "活躍的"], correct: 3 },
    { word: "actor", options: ["演員", "老師", "醫生", "警察"], correct: 0 },
    { word: "address", options: ["時間", "地址", "年齡", "名字"], correct: 1 },
    { word: "adult", options: ["小孩", "青少年", "成年人", "老年人"], correct: 2 },
    { word: "afraid", options: ["開心的", "生氣的", "傷心的", "害怕的"], correct: 3 },
    { word: "again", options: ["再次", "永遠", "從不", "經常"], correct: 0 },
    { word: "age", options: ["身高", "年齡", "體重", "長度"], correct: 1 },
    { word: "agree", options: ["反對", "懷疑", "同意", "拒絕"], correct: 2 },
    { word: "air", options: ["水", "火", "土", "空氣"], correct: 3 },
    { word: "airport", options: ["機場", "車站", "港口", "公園"], correct: 0 },
    { word: "alive", options: ["死的", "活著的", "睡著的", "生病的"], correct: 1 },
    { word: "allow", options: ["禁止", "懲罰", "允許", "命令"], correct: 2 },
    { word: "alone", options: ["熱鬧的", "擁擠的", "吵雜的", "單獨的"], correct: 3 },
    { word: "apple", options: ["蘋果", "香蕉", "橘子", "葡萄"], correct: 0 },
    { word: "book", options: ["電視", "書本", "電腦", "手機"], correct: 1 },
    { word: "cat", options: ["狗", "兔子", "貓", "鳥"], correct: 2 },
    { word: "house", options: ["公園", "商店", "學校", "房子"], correct: 3 },
    { word: "water", options: ["水", "茶", "咖啡", "牛奶"], correct: 0 },
    { word: "computer", options: ["相機", "電腦", "手錶", "收音機"], correct: 1 },
    { word: "friend", options: ["老師", "醫生", "朋友", "警察"], correct: 2 },
    { word: "time", options: ["天氣", "日期", "季節", "時間"], correct: 3 },
    { word: "school", options: ["學校", "醫院", "銀行", "郵局"], correct: 0 },
    { word: "music", options: ["電影", "音樂", "新聞", "書籍"], correct: 1 },
    { word: "dog", options: ["貓", "狗", "兔子", "魚"], correct: 1 },
    { word: "sun", options: ["月亮", "星星", "太陽", "雲"], correct: 2 },
    { word: "phone", options: ["手機", "電腦", "平板", "電視"], correct: 0 },
    { word: "food", options: ["衣服", "玩具", "書本", "食物"], correct: 3 },
    { word: "car", options: ["汽車", "腳踏車", "公車", "火車"], correct: 0 }
];

let currentQuestionIndex = 0;
let timer;
let timeLeft;
let score = 0;
let answers = [];

// 語音合成
const synth = window.speechSynthesis;

// 初始化測驗
function initQuiz() {
    showQuestion(currentQuestionIndex);
    startTimer();
}

// 顯示問題
function showQuestion(index) {
    const question = quizData[index];
    document.getElementById('word').textContent = question.word;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, i) => {
        const button = document.createElement('div');
        button.className = 'option';
        button.textContent = option;
        button.onclick = () => checkAnswer(i);
        optionsContainer.appendChild(button);
    });

    document.getElementById('currentQuestion').textContent = index + 1;
    document.getElementById('feedback').style.display = 'none';
    
    timeLeft = 15;
    document.getElementById('timeLeft').textContent = timeLeft;
}

// 開始計時器
function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timeLeft').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeout();
        }
    }, 1000);
}

// 處理超時
function handleTimeout() {
    showFeedback(false, "時間到！");
    answers.push({
        word: quizData[currentQuestionIndex].word,
        correct: false,
        userAnswer: "未作答",
        correctAnswer: quizData[currentQuestionIndex].options[quizData[currentQuestionIndex].correct]
    });
    
    setTimeout(nextQuestion, 2000);
}

// 檢查答案
function checkAnswer(selectedIndex) {
    clearInterval(timer);
    const correct = selectedIndex === quizData[currentQuestionIndex].correct;
    
    if (correct) {
        score += 10;
    }
    
    answers.push({
        word: quizData[currentQuestionIndex].word,
        correct: correct,
        userAnswer: quizData[currentQuestionIndex].options[selectedIndex],
        correctAnswer: quizData[currentQuestionIndex].options[quizData[currentQuestionIndex].correct]
    });
    
    showFeedback(correct);
    setTimeout(nextQuestion, 2000);
}

// 顯示回饋
function showFeedback(correct, message = null) {
    const feedback = document.getElementById('feedback');
    feedback.style.display = 'block';
    feedback.className = 'feedback ' + (correct ? 'correct' : 'incorrect');
    feedback.textContent = message || (correct ? '答對了！' : '答錯了！');
}

// 下一題
function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizData.length) {
        showQuestion(currentQuestionIndex);
        startTimer();
    } else {
        showResults();
    }
}

// 顯示結果
function showResults() {
    document.querySelector('.quiz-container').style.display = 'none';
    const results = document.getElementById('results');
    results.style.display = 'block';
    
    document.getElementById('totalScore').textContent = score;
    
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';
    
    answers.forEach((answer, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div>第 ${index + 1} 題: ${answer.word}</div>
            <div>你的答案: ${answer.userAnswer}</div>
            <div>正確答案: ${answer.correctAnswer}</div>
            <div style="color: ${answer.correct ? 'green' : 'red'}">
                ${answer.correct ? '✓ 正確' : '✗ 錯誤'}
            </div>
        `;
        resultsList.appendChild(resultItem);
    });
}

// 播放單字發音
function speakWord() {
    const utterance = new SpeechSynthesisUtterance(quizData[currentQuestionIndex].word);
    utterance.lang = 'en-US';
    synth.speak(utterance);
}

// 開始測驗
initQuiz();
