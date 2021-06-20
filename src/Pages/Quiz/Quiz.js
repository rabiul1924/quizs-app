import { CircularProgress } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import Question from "../../components/Question/Question";
import "./Quiz.css";

const Quiz = ({ name, questions, score, setScore, setQuestions }) => {
  const [options, setOptions] = useState();
  const [currQues, setCurrQues] = useState(0);

  const intervalRef = useRef(null);
  const [timer, setTimer] = useState('00:00:00');
  function getTimeRemaining(endTime){
    const total = Date.parse(endTime) - Date.parse(new Date());
    const seconds = Math.floor ((total/1000) % 60 );
    const minuets = Math.floor ((total/1000/60) % 60);
    const hours = Math.floor ((total/1000*60*60) % 24);
    const days = Math.floor ((total / 1000*60*60*24));
    return{
      total, days, hours, minuets,seconds
    }
  }

  function startTimer(deadline) {
    let { total, days, hours, minuets, seconds } = getTimeRemaining(deadline);
    if (total>=0){
      setTimer((hours > 9 ? hours : '0'+hours) + ':' +
      (minuets > 9 ? minuets : '0'+minuets) + ':' +
      (seconds > 9 ? seconds : '0'+seconds)
      )
    }
   else{
     clearInterval(intervalRef.current);
   }
  }

  function clearTimer(endTime) {
    setTimer('00:10:00');
           if (intervalRef.current) clearInterval(intervalRef.current);
           const id = setInterval(()=>{
             startTimer(endTime);
            },1000)
            intervalRef.current=id;
  }

  function getDeadLineTime(){
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds()+600);
    return deadline;
  }

  useEffect(()=>{
    clearTimer(getDeadLineTime());
    return () => {if (intervalRef.current) clearInterval(intervalRef.current)}
  },[]);

 

  useEffect(() => {
    setOptions(
      questions &&
        handleShuffle([
          questions[currQues]?.correct_answer,
          ...questions[currQues]?.incorrect_answers,
        ])
    );
  }, [currQues, questions]);

  console.log(questions);

  const handleShuffle = (options) => {
    return options.sort(() => Math.random() - 0.5);
  };

  return (
    <div className="quiz">
      {timer}
      <span className="subtitle">Welcome to your chosen category, {name}</span>

      {questions ? (
        <>
          <div className="quizInfo">
            <span>{questions[currQues].category}</span>
            <span>
              {/* {questions[currQues].difficulty} */}
              Score : {score}
            </span>
          </div>
          <Question
            currQues={currQues}
            setCurrQues={setCurrQues}
            questions={questions}
            options={options}
            correct={questions[currQues]?.correct_answer}
            score={score}
            setScore={setScore}
            setQuestions={setQuestions}
          />
        </>
      ) : (
        <CircularProgress
          style={{ margin: 100 }}
          color="inherit"
          size={150}
          thickness={1}
        />
      )}
      
    </div>
  );
};

export default Quiz;
