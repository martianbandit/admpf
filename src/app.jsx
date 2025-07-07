import React, { useState } from 'react';
import './app.css';

const VoiceInspectionAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [pendingResponse, setPendingResponse] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const questions = [
    // Freinage
    { key: 'brake_pads', type: 'numeric', question: 'Quelle est l\'épaisseur des plaquettes de frein en millimètres ?', tolerance: '>= 3', unit: 'mm' },
    { key: 'brake_fluid', type: 'boolean', question: 'Le niveau de liquide de frein est-il correct ? Répondez par oui ou non.' },
    
    // Pneumatiques
    { key: 'tire_tread', type: 'numeric', question: 'Quelle est la profondeur de sculpture des pneus en millimètres ?', tolerance: '>= 1.6', unit: 'mm' },
    { key: 'tire_pressure', type: 'numeric', question: 'Quelle est la pression des pneus en bars ?', tolerance: '2.0-2.5', unit: 'bar' },
    
    // Éclairage
    { key: 'headlights', type: 'boolean', question: 'Les phares avant fonctionnent-ils correctement ? Répondez par oui ou non.' },
    { key: 'taillights', type: 'boolean', question: 'Les feux arrière fonctionnent-ils correctement ? Répondez par oui ou non.' },
    { key: 'indicators', type: 'boolean', question: 'Les clignotants fonctionnent-ils tous ? Répondez par oui ou non.' },
    
    // Fluides
    { key: 'oil_level', type: 'boolean', question: 'Le niveau d\'huile moteur est-il correct ? Répondez par oui ou non.' },
    { key: 'coolant_level', type: 'boolean', question: 'Le niveau de liquide de refroidissement est-il correct ? Répondez par oui ou non.' },
    
    // Mécanique
    { key: 'belt_condition', type: 'descriptive', question: 'Décrivez l\'état de la courroie. Est-elle en bon état, usée, ou à remplacer ?' },
    { key: 'battery_voltage', type: 'numeric', question: 'Quelle est la tension de la batterie en volts ?', tolerance: '>= 12.4', unit: 'V' },
    
    // Carrosserie et sécurité
    { key: 'windshield', type: 'boolean', question: 'Le pare-brise est-il en bon état sans fissures ? Répondez par oui ou non.' },
    { key: 'horn', type: 'boolean', question: 'Le klaxon fonctionne-t-il ? Répondez par oui ou non.' },
    { key: 'mirrors', type: 'boolean', question: 'Tous les rétroviseurs sont-ils en bon état ? Répondez par oui ou non.' },
    
    // Suspension et direction
    { key: 'suspension', type: 'descriptive', question: 'Comment décrivez-vous l\'état de la suspension ? Bonne, moyenne, ou mauvaise ?' },
    { key: 'steering', type: 'boolean', question: 'La direction répond-elle correctement sans jeu excessif ? Répondez par oui ou non.' }
  ];

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
      setTranscription('');
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscription(transcript);
      processResponse(transcript);
    };
    
    recognition.onerror = (event) => {
      console.error('Erreur de reconnaissance vocale:', event.error);
      setIsListening(false);
      alert('Erreur de reconnaissance vocale. Veuillez réessayer.');
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  const validateResponse = (response, question) => {
    const lowerResponse = response.toLowerCase();
    let errors = [];
    
    switch (question.type) {
      case 'numeric':
        const numberMatch = response.match(/(\d+\.?\d*)/);
        if (!numberMatch) {
          errors.push('Aucun nombre détecté dans la réponse');
        } else {
          const value = parseFloat(numberMatch[1]);
          if (question.tolerance.includes('>=')) {
            const minValue = parseFloat(question.tolerance.replace('>= ', ''));
            if (value < minValue) {
              errors.push(`Valeur trop faible (minimum: ${minValue}${question.unit || ''})`);
            }
          } else if (question.tolerance.includes('-')) {
            const [min, max] = question.tolerance.split('-').map(v => parseFloat(v));
            if (value < min || value > max) {
              errors.push(`Valeur hors plage (attendu: ${min}-${max}${question.unit || ''})`);
            }
          }
        }
        break;
        
      case 'boolean':
        if (!lowerResponse.includes('oui') && !lowerResponse.includes('non') && 
            !lowerResponse.includes('yes') && !lowerResponse.includes('no')) {
          errors.push('Réponse non reconnue. Veuillez répondre par "oui" ou "non"');
        }
        break;
        
      case 'descriptive':
        if (response.trim().length < 3) {
          errors.push('Réponse trop courte. Veuillez donner plus de détails');
        }
        break;
    }
    
    return errors;
  };

  const processResponse = (response) => {
    const question = questions[currentQuestion];
    const validationErrors = validateResponse(response, question);
    
    if (validationErrors.length > 0) {
      setValidationMessage(validationErrors.join('. '));
      setTimeout(() => setValidationMessage(''), 5000);
      return;
    }
    
    let processedValue = response.toLowerCase();
    let status = 'unknown';
    let displayValue = response;

    switch (question.type) {
      case 'numeric':
        const numberMatch = response.match(/(\d+\.?\d*)/);
        if (numberMatch) {
          processedValue = parseFloat(numberMatch[1]);
          displayValue = `${processedValue} ${question.unit || ''}`;
          
          // Check tolerance
          if (question.tolerance.includes('>=')) {
            const minValue = parseFloat(question.tolerance.replace('>= ', ''));
            status = processedValue >= minValue ? 'pass' : 'fail';
          } else if (question.tolerance.includes('-')) {
            const [min, max] = question.tolerance.split('-').map(v => parseFloat(v));
            status = (processedValue >= min && processedValue <= max) ? 'pass' : 'fail';
          }
        }
        break;
        
      case 'boolean':
        if (processedValue.includes('oui') || processedValue.includes('yes')) {
          status = 'pass';
          displayValue = 'Oui';
        } else if (processedValue.includes('non') || processedValue.includes('no')) {
          status = 'fail';
          displayValue = 'Non';
        }
        break;
        
      case 'descriptive':
        displayValue = response;
        if (processedValue.includes('bon') || processedValue.includes('bonne')) {
          status = 'pass';
        } else if (processedValue.includes('mauvais') || processedValue.includes('mauvaise') || processedValue.includes('remplacer')) {
          status = 'fail';
        } else {
          status = 'warning';
        }
        break;
        
      default:
        displayValue = response;
    }

    // Store pending response for confirmation
    setPendingResponse({
      question: question.question, 
      response: displayValue, 
      status,
      category: getCategoryFromKey(question.key)
    });
    setShowConfirmation(true);
  };

  const confirmResponse = () => {
    setResponses([...responses, pendingResponse]);
    setCurrentQuestion(currentQuestion + 1);
    setShowConfirmation(false);
    setPendingResponse(null);
    setTranscription('');
  };

  const rejectResponse = () => {
    setShowConfirmation(false);
    setPendingResponse(null);
    setTranscription('');
  };

  const getCategoryFromKey = (key) => {
    if (key.includes('brake')) return 'Freinage';
    if (key.includes('tire')) return 'Pneumatiques';
    if (key.includes('light') || key.includes('indicator')) return 'Éclairage';
    if (key.includes('oil') || key.includes('coolant') || key.includes('fluid')) return 'Fluides';
    if (key.includes('belt') || key.includes('battery')) return 'Mécanique';
    if (key.includes('windshield') || key.includes('horn') || key.includes('mirror')) return 'Sécurité';
    if (key.includes('suspension') || key.includes('steering')) return 'Suspension/Direction';
    return 'Général';
  };

  const skipQuestion = () => {
    setResponses([...responses, { 
      question: questions[currentQuestion].question, 
      response: 'Question ignorée', 
      status: 'unknown',
      category: getCategoryFromKey(questions[currentQuestion].key)
    }]);
    setCurrentQuestion(currentQuestion + 1);
  };

  const restartInspection = () => {
    setCurrentQuestion(0);
    setResponses([]);
    setTranscription('');
  };

  const exportReport = () => {
    const reportData = {
      date: new Date().toLocaleString('fr-FR'),
      questions: questions.length,
      responses: responses,
      summary: {
        pass: responses.filter(r => r.status === 'pass').length,
        fail: responses.filter(r => r.status === 'fail').length,
        warning: responses.filter(r => r.status === 'warning').length,
        unknown: responses.filter(r => r.status === 'unknown').length
      }
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inspection-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="inspection-assistant">
      <header className="app-header">
        <h1>🔧 Assistant d'Inspection Mécanique</h1>
        <p>Inspection vocale automatisée pour véhicules</p>
      </header>

      <div className="current-question">
        <div className="question-header">
          <span className="question-counter">
            Question {currentQuestion + 1} sur {questions.length}
          </span>
          {currentQuestion < questions.length && (
            <span className="category-badge">
              {getCategoryFromKey(questions[currentQuestion].key)}
            </span>
          )}
        </div>
        
        <div className="question-text">
          {questions[currentQuestion]?.question || 'Inspection terminée !'}
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="controls">
        <button 
          className={`voice-button ${isListening ? 'listening' : ''}`}
          onClick={startListening} 
          disabled={isListening || currentQuestion >= questions.length}
        >
          {isListening ? '🎤 Écoute en cours...' : 
           currentQuestion >= questions.length ? '✅ Inspection terminée' : '🎤 Répondre'}
        </button>
        
        {currentQuestion > 0 && currentQuestion < questions.length && (
          <button className="skip-button" onClick={skipQuestion}>
            ⏭️ Ignorer cette question
          </button>
        )}

        {currentQuestion >= questions.length && responses.length > 0 && (
          <div className="final-actions">
            <button className="restart-button" onClick={restartInspection}>
              🔄 Nouvelle inspection
            </button>
            <button className="export-button" onClick={exportReport}>
              📄 Exporter le rapport
            </button>
          </div>
        )}
      </div>

      {validationMessage && (
        <div className="validation-error">
          <span className="error-icon">⚠️</span>
          {validationMessage}
        </div>
      )}

      {showConfirmation && pendingResponse && (
        <div className="confirmation-dialog">
          <div className="confirmation-content">
            <h3>Confirmer la réponse</h3>
            <div className="confirmation-details">
              <p><strong>Question :</strong> {pendingResponse.question}</p>
              <p><strong>Votre réponse :</strong> {pendingResponse.response}</p>
              <div className={`status-preview ${pendingResponse.status}`}>
                <span className="status-icon">
                  {pendingResponse.status === 'pass' ? '✓' : 
                   pendingResponse.status === 'fail' ? '✗' : 
                   pendingResponse.status === 'warning' ? '⚠' : '?'}
                </span>
                <span className="status-text">
                  {pendingResponse.status === 'pass' ? 'Conforme' : 
                   pendingResponse.status === 'fail' ? 'Non conforme' : 
                   pendingResponse.status === 'warning' ? 'À surveiller' : 'Indéterminé'}
                </span>
              </div>
            </div>
            <div className="confirmation-buttons">
              <button className="confirm-btn" onClick={confirmResponse}>
                ✓ Confirmer
              </button>
              <button className="reject-btn" onClick={rejectResponse}>
                🎤 Réenregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {transcription && !showConfirmation && (
        <div className="last-transcription">
          <strong>Dernière réponse :</strong> {transcription}
        </div>
      )}

      <div className="inspection-log">
        <h2>Journal d'inspection</h2>
        {responses.length === 0 ? (
          <p className="no-responses">Aucune réponse enregistrée</p>
        ) : (
          <div className="responses-grid">
            {responses.map((response, index) => (
              <div key={index} className={`response-card ${response.status}`}>
                <div className="response-header">
                  <span className="category">{response.category}</span>
                  <span className={`status-badge ${response.status}`}>
                    {response.status === 'pass' ? '✓' : 
                     response.status === 'fail' ? '✗' : 
                     response.status === 'warning' ? '⚠' : '?'}
                  </span>
                </div>
                <p className="question">{response.question}</p>
                <p className="response-value">{response.response}</p>
              </div>
            ))}
          </div>
        )}
        
        {currentQuestion >= questions.length && responses.length > 0 && (
          <div className="inspection-summary">
            <h3>Résumé de l'inspection</h3>
            <div className="summary-stats">
              <span className="stat pass">
                ✓ {responses.filter(r => r.status === 'pass').length} Conformes
              </span>
              <span className="stat fail">
                ✗ {responses.filter(r => r.status === 'fail').length} Non conformes
              </span>
              <span className="stat warning">
                ⚠ {responses.filter(r => r.status === 'warning').length} À surveiller
              </span>
              <span className="stat unknown">
                ? {responses.filter(r => r.status === 'unknown').length} Indéterminés
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInspectionAssistant;