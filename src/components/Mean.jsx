import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Calculator, Lightbulb, BookOpen, Check, X, RefreshCw } from 'lucide-react';

const Mean = () => {
  const [numbers, setNumbers] = useState('');
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userInputs, setUserInputs] = useState({ sum: '', count: '', mean: '' });
  const [inputStatus, setInputStatus] = useState({ sum: null, count: null, mean: null });
  const [stepCompleted, setStepCompleted] = useState({ sum: false, count: false, mean: false });

  const MAX_NUMBERS = 6;

  const parseInput = (input) => {
    return input.split(/[\s,]+/).filter(num => num.trim() !== '').map(Number);
  };

  const countNumbers = (input) => {
    return input.split(/[\s,]+/).filter(num => num.trim() !== '').length;
  };

  const validateAndFormatInput = (input) => {
    const numArray = input.split(/[\s,]+/).filter(num => num.trim() !== '');
    const validNumbers = numArray.map(num => {
      const parsed = parseFloat(num);
      return !isNaN(parsed) && parsed > 0 && parsed <= 100 ? parsed : '';
    }).filter(num => num !== '');
    return validNumbers.join(', ');
  };

  const validateInput = (input) => {
    const numArray = parseInput(input);
    return numArray.length >= 2 && numArray.length <= MAX_NUMBERS && numArray.every(num => !isNaN(num) && num > 0 && num <= 100);
  };

  const generateRandomNumbers = () => {
    const count = Math.floor(Math.random() * (MAX_NUMBERS - 1)) + 2; // 2 to MAX_NUMBERS numbers
    const randomNumbers = Array.from({ length: count }, () => Math.floor(Math.random() * 100) + 1);
    setNumbers(randomNumbers.join(', '));
  };

  const calculateMean = () => {
    if (!validateInput(numbers)) {
      setShowWarning(true);
      setWarningMessage(`Please enter 2 to ${MAX_NUMBERS} valid numbers, each between 1 and 100.`);
      return;
    }

    setShowWarning(false);
    setWarningMessage('');
    setIsCalculating(true);

    const numArray = parseInput(numbers);
    const sum = numArray.reduce((acc, curr) => acc + curr, 0);
    const count = numArray.length;
    const mean = sum / count;

    const newSteps = [
      { main: `Step 1: Sum all numbers: ${numArray.join(' + ')}`, answer: sum },
      { main: `Step 2: Count the numbers`, answer: count },
      { main: `Step 3: Divide the sum by the count to get the mean`, answer: mean.toFixed(2) },
    ];

    setResult({ numbers: numArray, sum, count, mean });
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setUserInputs({ sum: '', count: '', mean: '' });
    setInputStatus({ sum: null, count: null, mean: null });
    setStepCompleted({ sum: false, count: false, mean: false });
    setIsCalculating(false);
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    
    // Only allow numbers, decimal points, spaces, and commas
    const sanitizedInput = input.replace(/[^0-9., ]/g, '');
    
    const currentCount = countNumbers(sanitizedInput);
    
    if (currentCount <= MAX_NUMBERS) {
      setNumbers(sanitizedInput);
    } else {
      // If max numbers reached, don't allow more numbers but allow editing
      const truncatedInput = sanitizedInput.split(/[\s,]+/).slice(0, MAX_NUMBERS).join(', ');
      setNumbers(truncatedInput);
    }
  };

  useEffect(() => {
    const numCount = countNumbers(numbers);
    if (numCount > MAX_NUMBERS) {
      setShowWarning(true);
      setWarningMessage(`You can enter a maximum of ${MAX_NUMBERS} numbers.`);
    } else {
      setShowWarning(false);
      setWarningMessage('');
    }
  }, [numbers]);

  const handleStepInputChange = (e, field) => {
    setUserInputs({ ...userInputs, [field]: e.target.value });
    setInputStatus({ ...inputStatus, [field]: null });
  };

  const checkStep = (field) => {
    let isCorrect = false;
    switch (field) {
      case 'sum':
        isCorrect = Math.abs(parseFloat(userInputs.sum) - result.sum) < 0.01;
        break;
      case 'count':
        isCorrect = parseInt(userInputs.count) === result.count;
        break;
      case 'mean':
        isCorrect = Math.abs(parseFloat(userInputs.mean) - result.mean) < 0.01;
        break;
    }

    setInputStatus({ ...inputStatus, [field]: isCorrect ? 'correct' : 'incorrect' });
    if (isCorrect) {
      setStepCompleted({ ...stepCompleted, [field]: true });
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      }
    }
  };

  const skipStep = (field) => {
    setUserInputs({ ...userInputs, [field]: result[field].toString() });
    setInputStatus({ ...inputStatus, [field]: 'correct' });
    setStepCompleted({ ...stepCompleted, [field]: true });
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const getInputClassName = (field) => {
    let baseClass = "text-xs px-1 text-left";
    switch (inputStatus[field]) {
      case 'correct':
        return `${baseClass} border-green-500 focus:border-green-500`;
      case 'incorrect':
        return `${baseClass} border-red-500 focus:border-red-500`;
      default:
        return `${baseClass} border-gray-300 focus:border-blue-500`;
    }
  };

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <Card className="w-full max-w-2xl mx-auto shadow-md bg-white">
        <CardHeader className="bg-sky-100 text-sky-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold">Mean Explorer</CardTitle>
            <Calculator size={40} className="text-sky-600" />
          </div>
          <CardDescription className="text-sky-700 text-lg">Discover the Average of Numbers!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <Alert className="bg-blue-50 border-blue-100">
            <Lightbulb className="h-4 w-4 text-blue-400" />
            <AlertTitle className="text-blue-700">What is the Mean (Average)?</AlertTitle>
            <AlertDescription className="text-blue-600">
              <p>The mean is the average of a set of numbers. It's calculated by adding up all the numbers and then dividing by how many numbers there are. It's like finding the "middle" or "balanced" point of the data!</p>
              <p className="mt-2"><strong>Example:</strong> Let's calculate the mean of 2, 4, and 6:</p>
              <ol className="list-decimal list-inside mt-1">
                <li>Add the numbers: 2 + 4 + 6 = 12</li>
                <li>Count how many numbers: 3</li>
                <li>Divide the sum by the count: 12 ÷ 3 = 4</li>
              </ol>
              <p className="mt-1">So, the mean of 2, 4, and 6 is 4.</p>
            </AlertDescription>
          </Alert>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="numberInput" className="block text-xl font-medium text-gray-700">Numbers to calculate:</label>
              <div className="flex items-center space-x-4">
                <div className="flex-grow">
                  <Input
                    id="numberInput"
                    type="text"
                    value={numbers}
                    onChange={handleInputChange}
                    placeholder={`Enter 2-${MAX_NUMBERS} numbers (1-100 each, separated by commas or spaces)`}
                    className="w-full text-lg border-sky-200 focus:border-sky-400"
                  />
                </div>
                <Button onClick={generateRandomNumbers} className="flex items-center bg-sky-500 hover:bg-sky-600 text-white h-10 whitespace-nowrap">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Random
                </Button>
              </div>
            </div>
            {showWarning && (
              <p className="text-sm text-red-500">{warningMessage}</p>
            )}
            <Button 
              onClick={calculateMean} 
              className="w-full bg-emerald-400 hover:bg-emerald-500 text-white text-xl py-6"
              disabled={isCalculating}
            >
              {isCalculating ? 'Calculating...' : 'Calculate Mean'}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start bg-gray-50">
          {result && (
            <div className="w-full space-y-2">
              <p className="font-semibold text-purple-600">Calculation Steps:</p>
              {steps.slice(0, currentStepIndex + 1).map((step, index) => (
                <div key={index} className="bg-purple-50 p-2 rounded">
                  <p>{step.main}</p>
                  {stepCompleted[Object.keys(stepCompleted)[index]] && (
                    <p className="text-green-600">
                      = {step.answer}
                      {index === 2 && " (This is the mean)"}
                    </p>
                  )}
                  {index === currentStepIndex && !stepCompleted[Object.keys(stepCompleted)[index]] && (
                    <div className="flex items-center space-x-1 text-sm mt-2">
                      <Input
                        type="number"
                        value={userInputs[Object.keys(userInputs)[index]]}
                        onChange={(e) => handleStepInputChange(e, Object.keys(userInputs)[index])}
                        placeholder={`Enter ${Object.keys(userInputs)[index]}`}
                        className={getInputClassName(Object.keys(userInputs)[index])}
                        style={{ width: '120px' }}
                      />
                      <Button onClick={() => checkStep(Object.keys(userInputs)[index])} className="bg-blue-400 hover:bg-blue-500 px-2 py-1 text-xs">
                        Check
                      </Button>
                      <Button onClick={() => skipStep(Object.keys(userInputs)[index])} className="bg-gray-400 hover:bg-gray-500 px-2 py-1 text-xs">
                        Skip
                      </Button>
                      {inputStatus[Object.keys(userInputs)[index]] === 'correct' && <Check className="text-green-500 w-4 h-4" />}
                      {inputStatus[Object.keys(userInputs)[index]] === 'incorrect' && <X className="text-red-500 w-4 h-4" />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardFooter>
      </Card>
      <div className="mt-4 text-center text-gray-700">
        <p className="flex items-center justify-center">
          <BookOpen className="mr-2 text-gray-600" />
          The mean is used in everyday life for things like calculating average scores, determining typical weather patterns, or figuring out average spending habits!
        </p>
      </div>
    </div>
  );
};

export default Mean;