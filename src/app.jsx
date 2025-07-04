import React, { useState } from 'react';

const VoiceInspectionAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);

  const questions = [
    { key: 'brake_pads', question: 'Quelle est l’épaisseur des plaquettes de frein en millimètres ?', tolerance: '>= 3mm' },
  ];

  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscription(transcript);
      processResponse(transcript);
    };
    recognition.start();
    setIsListening(true);
  };

  const processResponse = (response) => {
    const question = questions[currentQuestion];
    let processedValue = response.toLowerCase();
    let status = 'unknown';

    if (question.key === 'brake_pads') {
      const numberMatch = response.match(/(\d+\.?\d*)/);
      if (numberMatch) {
        processedValue = parseFloat(numberMatch[1]);
        status = processedValue >= 3 ? 'pass' : 'fail';
      }
    }

    setResponses([...responses, { question: question.question, response: processedValue, status }]);
    setCurrentQuestion(currentQuestion + 1);
    setIsListening(false);
  };

  return (
    <div>
      <h1>Assistant d'Inspection Mécanique</h1>
      <p>Question actuelle : {questions[currentQuestion]?.question || 'Terminé !'}</p>
      <button onClick={startListening} disabled={isListening}>
        {isListening ? 'Écoute en cours...' : 'Répondre'}
      </button>
      <p>Dernière réponse : {transcription}</p>
      <div>
        <h2>Journal des échanges</h2>
        <ul>
          {responses.map((response, index) => (
            <li key={index}>
              <p>Question : {response.question}</p>
              <p>Réponse : {response.response}</p>
              <p>Statut : {response.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VoiceInspectionAssistant;
