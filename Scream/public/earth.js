var questions = [
    {
        title: "<video id='my_video' class='video-js vjs-default-skin vjs-big-play-centered' controls preload='auto' data-setup='{}'><source src='videos/earth1.mp4' type='video/mp4' /></video>",
        options: ["Energy is equivalent to an objects mass times the speed of light squared.", "Existence is relative to the mass of civilization divided by history squared."],
        correctanswer: "Energy is equivalent to an objects mass times the speed of light squared."

    },
    {
        title: "<video id='my_video' class='video-js vjs-default-skin vjs-big-play-centered' controls preload='auto' data-setup='{}'><source src='videos/earth2.mp4' type='video/mp4' /></video>",
        options: ["I didn't claim that the information would benefit you", "I didn't believe that the papers would be a plus for you"],
        correctanswer: "I didn't claim that the information would benefit you"
    },
    {
        title: "<video id='my_video' class='video-js vjs-default-skin vjs-big-play-centered' controls preload='auto' data-setup='{}'><source src='videos/earth3.mp4' type='video/mp4' /></video>",
        options: ["A: I've on live! B: Too early. A: And you are too fat", "A: Not dead yet! B: It's early days. A: And you remain overweight"],
        correctanswer: "A: Not dead yet! B: It's early days. A: And you remain overweight"
    }
]


var panel = document.querySelector("#panel");
var answer = []


function addtitle(place, text) {
    var title = document.createElement("div");
    title.innerHTML = text;
    place.appendChild(title);
}

function addaoptions(place, index, text, key) {
    var choices = document.createElement("input");
    choices.type="button"
    choices.name = index;
    choices.value= text;


    place.appendChild(choices)
    choices.onclick=function(){
        answer[index] = text;
        if(key==text){
            choices.style.backgroundColor="#00cf6e";
            choices.style.borderColor="#00cf6e";
            choices.style.color="white";
        }else{
            choices.style.backgroundColor="#ff5a57";
            choices.style.borderColor="#ff5a57";
            choices.style.color="white";
        }
    }
}
    
 
    // var label = document.createElement("label");
    // label.innerText = text;
    // label.htmlFor = text;
    // place.appendChild(label);


//问题进度
var progress = document.querySelector("#progress")
function showprogress() {
    var currentQuestionNum = n + 1;
    progress.innerText = "Question " + currentQuestionNum + " of " + questions.length
}


// 切换问题

var gopage = document.querySelector("#goPage")

var n = 1
var score = 0;
var key=[]
gopage.onclick = function () {
    if (n >= questions.length) {
        // 检查答案
        for (var i = 0; i < answer.length; i++) {
             key[i]=questions[i].correctanswer;
            if (answer[i] == questions[i].correctanswer) {
                score = score + 10;
            }    
        }
        alert("最终得分为：" + score);
    } else {
        panel.innerHTML = "";
        var thisquestion = questions[n];
        addtitle(panel, thisquestion.title);
        for (var i = 0; i < thisquestion.options.length; i++) {
            addaoptions(panel, n, thisquestion.options[i],thisquestion.correctanswer);            
        }
        showprogress();
        n++;
    }
}


// 一开始页面加载
addtitle(panel, questions[0].title);
for (i = 0; i < questions[0].options.length; i++) {
   
    addaoptions(panel, 0, questions[0].options[i],questions[0].correctanswer);
    
}
progress.innerText = "Question 1 of " + questions.length


// var input=document.querySelectorAll("input")
// for(var i=0;i<input.length;i++){
//     if(this.onclick.id==)
// }