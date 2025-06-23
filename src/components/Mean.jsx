import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Mean = () => {
  // State management
  const [numbers, setNumbers] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userInputs, setUserInputs] = useState({
    step1: '',
    step2: '',
    step3: ''
  });
  const [inputStatus, setInputStatus] = useState({
    step1: null,
    step2: null,
    step3: null
  });
  const [stepCompleted, setStepCompleted] = useState({
    step1: false,
    step2: false,
    step3: false
  });
  const [stepSkipped, setStepSkipped] = useState({
    step1: false,
    step2: false,
    step3: false
  });
  const [steps, setSteps] = useState([]);
  const [showNavigationButtons, setShowNavigationButtons] = useState(false);
  const [navigationDirection, setNavigationDirection] = useState(null);
  const [inputError, setInputError] = useState('');

  const MAX_NUMBERS = 6;

  // Generate random numbers
  const generateRandomNumbers = () => {
    const count = Math.floor(Math.random() * (MAX_NUMBERS - 1)) + 2;
    const randomNumbers = Array.from({ length: count }, () => Math.floor(Math.random() * 100) + 1);
    setNumbers(randomNumbers.join(', '));
    setInputError('');
  };

  // Show navigation buttons when all steps are completed
  useEffect(() => {
    if (stepCompleted.step1 && stepCompleted.step2 && stepCompleted.step3) {
      setShowNavigationButtons(true);
    }
  }, [stepCompleted]);

  // Handle input changes
  const handleNumbersChange = (e) => {
    const input = e.target.value;
    const sanitizedInput = input.replace(/[^0-9., ]/g, '');
    const numArray = sanitizedInput.split(/[\s,]+/).filter(num => num.trim() !== '');
    
    if (numArray.length <= MAX_NUMBERS) {
      setNumbers(sanitizedInput);
    } else {
      const truncatedInput = numArray.slice(0, MAX_NUMBERS).join(', ');
      setNumbers(truncatedInput);
    }
    setInputError('');
  };

  // Validate inputs before calculating
  const validateInputs = () => {
    if (!numbers.trim()) {
      setInputError('Please enter some numbers');
      return false;
    }
    
    const numArray = numbers.split(/[\s,]+/).filter(num => num.trim() !== '').map(Number);
    
    if (numArray.length < 2) {
      setInputError('Please enter at least 2 numbers');
      return false;
    }
    
    if (numArray.length > MAX_NUMBERS) {
      setInputError(`You can enter a maximum of ${MAX_NUMBERS} numbers`);
      return false;
    }
    
    if (numArray.some(num => isNaN(num) || num <= 0 || num > 100)) {
      setInputError('Please enter valid numbers between 1 and 100');
      return false;
    }
    
    return true;
  };

  // Parse input numbers
  const parseInput = (input) => {
    return input.split(/[\s,]+/).filter(num => num.trim() !== '').map(Number);
  };

  // Calculate steps
  const calculateSteps = () => {
    if (!validateInputs()) return;

    const numArray = parseInput(numbers);
    const sum = numArray.reduce((acc, curr) => acc + curr, 0);
    const count = numArray.length;
    const mean = sum / count;

    const newSteps = [
      {
        main: 'Step 1: Sum all numbers',
        formula: numArray.join(' + '),
        answer: sum.toString()
      },
      {
        main: 'Step 2: Count the numbers',
        formula: numArray.join(', '),
        answer: count.toString()
      },
      {
        main: 'Step 3: Divide sum by count',
        formula: `${sum} ÷ ${count}`,
        answer: mean.toFixed(2)
      }
    ];

    setSteps(newSteps);
    setShowSteps(true);
    setUserInputs({ step1: '', step2: '', step3: '' });
    setCurrentStepIndex(0);
    setStepCompleted({ step1: false, step2: false, step3: false });
    setInputStatus({ step1: null, step2: null, step3: null });
    setShowNavigationButtons(false);
  };

  // Handle step input change
  const handleStepInputChange = (e, step) => {
    setUserInputs({ ...userInputs, [step]: e.target.value });
    setInputStatus({ ...inputStatus, [step]: null });
  };

  // Skip step
  const skipStep = (step) => {
    setUserInputs({ ...userInputs, [step]: steps[currentStepIndex].answer });
    setInputStatus({ ...inputStatus, [step]: 'correct' });
    setStepCompleted(prev => ({ ...prev, [step]: true }));
    setStepSkipped(prev => ({ ...prev, [step]: true }));
  };

  // Check step answer
  const checkStep = (step) => {
    const correctAnswer = steps[currentStepIndex].answer;
    const userAnswer = userInputs[step];
    const isCorrect = Math.abs(parseFloat(userAnswer) - parseFloat(correctAnswer)) < 0.1;

    setInputStatus({ ...inputStatus, [step]: isCorrect ? 'correct' : 'incorrect' });
    
    if (isCorrect) {
      setStepCompleted(prev => ({ ...prev, [step]: true }));
      setStepSkipped(prev => ({ ...prev, [step]: false }));
    }
  };

  // Handle navigation
  const handleNavigateHistory = (direction) => {
    setNavigationDirection(direction);
    
    if (direction === 'back' && currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else if (direction === 'forward' && currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }

    setTimeout(() => {
      setNavigationDirection(null);
    }, 300);
  };

  return (
    <>
      <style>{`
        @property --r {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .glow-button { 
          min-width: auto; 
          height: auto; 
          position: relative; 
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: all .3s ease;
          padding: 7px;
        }

        .glow-button::before {
          content: "";
          display: block;
          position: absolute;
          background: #fff;
          inset: 2px;
          border-radius: 4px;
          z-index: -2;
        }

        .simple-glow {
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          transition: animation 0.3s ease;
        }

        .simple-glow.stopped {
          animation: none;
          background: none;
        }

        @keyframes rotating {
          0% {
            --r: 0deg;
          }
          100% {
            --r: 360deg;
          }
        }

        .nav-button {
          opacity: 1;
          cursor: default !important;
          position: relative;
          z-index: 2;
          outline: 2px white solid;
        }

        .nav-button-orbit {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          z-index: 0;
        }

        .nav-button-orbit::before {
          content: "";
          position: absolute;
          inset: 2px;
          background: transparent;
          border-radius: 50%;
          z-index: 0;
        }

        .nav-button svg {
          position: relative;
          z-index: 1;
        }
      `}</style>
      <div className="w-[500px] h-auto mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] bg-white rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#5750E3] text-sm font-medium select-none">Mean Calculator</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={numbers}
                  onChange={handleNumbersChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5750E3]"
                  placeholder={`Enter 2-${MAX_NUMBERS} numbers (1-100 each)`}
                />
              </div>
              <Button 
                onClick={generateRandomNumbers}
                className="bg-[#008545] hover:bg-[#00703d] text-white px-4 h-[42px]"
              >
                Random
              </Button>
            </div>

            {inputError && (
              <p className="text-sm text-red-500">{inputError}</p>
            )}

            <div className={`glow-button ${!showSteps ? 'simple-glow' : 'simple-glow stopped'}`}>
              <button 
                onClick={calculateSteps}
                className="w-full bg-[#008545] hover:bg-[#00703d] text-white text-sm py-2 rounded"
              >
                Calculate Mean
              </button>
            </div>
          </div>
        </div>

        {showSteps && (
          <div className="p-4 bg-gray-50">
            <div className="space-y-2">
              <h3 className="text-[#5750E3] text-sm font-medium mb-2">
                Steps to calculate the mean:
              </h3>
              <div className="space-y-4">
                <div className="w-full p-2 mb-1 bg-white border border-[#5750E3]/30 rounded-md">
                  <p className="text-sm">{steps[currentStepIndex].main}</p>
                  <pre className="text-sm whitespace-pre-wrap mt-1">{steps[currentStepIndex].formula}</pre>
                  {stepCompleted[`step${currentStepIndex + 1}`] && (
                    <p className="text-sm text-[#008545] font-medium mt-1">
                      = {steps[currentStepIndex].answer}
                      {currentStepIndex === 2 && " (This is the mean)"}
                    </p>
                  )}
                  {!stepCompleted[`step${currentStepIndex + 1}`] && (
                    <div className="flex items-center space-x-1 mt-2">
                      <input
                        type="number"
                        value={userInputs[`step${currentStepIndex + 1}`]}
                        onChange={(e) => handleStepInputChange(e, `step${currentStepIndex + 1}`)}
                        placeholder="Enter Answer"
                        className={`w-full text-sm p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#5750E3] ${
                          inputStatus[`step${currentStepIndex + 1}`] === 'correct'
                            ? 'border-green-500'
                            : inputStatus[`step${currentStepIndex + 1}`] === 'incorrect'
                            ? 'border-yellow-500'
                            : 'border-gray-300'
                        }`}
                      />
                      <div className="glow-button simple-glow">
                        <div className="flex gap-1">
                          <button 
                            onClick={() => checkStep(`step${currentStepIndex + 1}`)} 
                            className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md min-w-[80px]"
                          >
                            Check
                          </button>
                          <button 
                            onClick={() => skipStep(`step${currentStepIndex + 1}`)} 
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-md min-w-[80px]"
                          >
                            Skip
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {stepCompleted[`step${currentStepIndex + 1}`] && !showNavigationButtons && (
                    <div className="flex items-center gap-4 mt-2 justify-end">
                      {!stepSkipped[`step${currentStepIndex + 1}`] && (
                        <span className="text-green-600 font-bold select-none">Great Job!</span>
                      )}
                      {currentStepIndex < steps.length - 1 && (
                        <div className="glow-button simple-glow">
                          <button 
                            onClick={() => {
                              if (currentStepIndex < steps.length - 1) {
                                setCurrentStepIndex(prev => prev + 1);
                              }
                            }}
                            className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md min-w-[80px]"
                          >
                            Continue
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <div
                    className="nav-orbit-wrapper"
                    style={{
                      position: 'relative',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      visibility: showNavigationButtons && currentStepIndex > 0 ? 'visible' : 'hidden',
                      opacity: showNavigationButtons && currentStepIndex > 0 ? 1 : 0,
                      pointerEvents: showNavigationButtons && currentStepIndex > 0 ? 'auto' : 'none',
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    <div className="nav-button-orbit"></div>
                    <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'white', zIndex: 1 }}></div>
                    <button
                      onClick={() => handleNavigateHistory('back')}
                      className={`nav-button w-8 h-8 flex items-center justify-center rounded-full bg-[#008545]/20 text-[#008545] hover:bg-[#008545]/30 relative z-50`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6"/>
                      </svg>
                    </button>
                  </div>
                  <span className="text-sm text-gray-500 min-w-[100px] text-center">
                    Step {currentStepIndex + 1} of {steps.length}
                  </span>
                  <div
                    className="nav-orbit-wrapper"
                    style={{
                      position: 'relative',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      visibility: showNavigationButtons && currentStepIndex < steps.length - 1 ? 'visible' : 'hidden',
                      opacity: showNavigationButtons && currentStepIndex < steps.length - 1 ? 1 : 0,
                      pointerEvents: showNavigationButtons && currentStepIndex < steps.length - 1 ? 'auto' : 'none',
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    <div className="nav-button-orbit"></div>
                    <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'white', zIndex: 1 }}></div>
                    <button
                      onClick={() => handleNavigateHistory('forward')}
                      className={`nav-button w-8 h-8 flex items-center justify-center rounded-full bg-[#008545]/20 text-[#008545] hover:bg-[#008545]/30 relative z-50`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Mean;