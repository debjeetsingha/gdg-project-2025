'use client';

import { motion } from 'framer-motion';
import { FiPaperclip, FiSend, FiX } from 'react-icons/fi';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';

interface Message {
  sender: 'user' | 'assistant';
  content: string;
  isAttachment?: boolean;
  attachmentType?: 'file' | 'image';
  attachmentUrl?: string;
}

export interface LearningModule {
  id: number;
  title: string;
  progress: number;
  content: string;
}

interface QuizState {
  sessionId: string | null;
  currentQuestion: string | null;
  isQuizActive: boolean;
  quizLevel: string | null;
  quizHistory: Array<{
    question: string;
    userAnswer: string;
    evaluation: string;
    score: number;
  }>;
}

// interface UserProfile {
//   name: string;
//   age: number;
//   monthlyIncome: number;
//   monthlySaving: number;
//   primaryReasonForInvesting: string;
//   financialRisk: string;
//   expAboutInvesting: string;
//   estimateInvestingDuration: number;
//   typesOfInvestment: string[];
//   portfolio: string[];
// }

interface PersonalizedTutorProps {
  onClose: () => void;
  selectedModule: LearningModule | null;
  authToken: string;
}

export default function PersonalizedTutor({ onClose, selectedModule, authToken }: PersonalizedTutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'assistant', 
      content: selectedModule 
        ? `Let's discuss ${selectedModule.title}.\n\n${selectedModule.content}\n\nWhere would you like to start?`
        : 'Hello! I\'m your personalized trading tutor. How can I help you with your trading strategies today?'
    },
  ]);
  const [currentScore, setCurrentScore] = useState(0);
  const [chatSessionId] = useState(`session-${Date.now()}`);
  const [isLoading, setIsLoading] = useState(false);
  const [quizState, setQuizState] = useState<QuizState>({
    sessionId: null,
    currentQuestion: null,
    isQuizActive: false,
    quizLevel: null,
    quizHistory: []
  });

  // const [showProfileForm, setShowProfileForm] = useState(false);
  // const [profileFormData, setProfileFormData] = useState({
  //   name: '',
  //   age: 25,
  //   monthlyIncome: 0,
  //   monthlySaving: 0,
  //   primaryReasonForInvesting: 'Retirement savings',
  //   financialRisk: 'Moderate',
  //   expAboutInvesting: 'Beginner',
  //   estimateInvestingDuration: 5,
  //   typesOfInvestment: [] as string[],
  //   portfolio: [] as string[]
  // });
  const [showQuizLevelSelector, setShowQuizLevelSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('https://tutor-api-gdg.vercel.app/v1/profile', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          }
        });

        if (response.ok) {
          
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    if (authToken) {
      loadProfile();
    }
  }, [authToken]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startQuiz = async (level: string = 'Beginner') => {
    setIsLoading(true);
    setShowQuizLevelSelector(false);
    try {
      const response = await fetch('https://tutor-api-gdg.vercel.app/v1/start', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          level: level
        })
      });

      if (response.ok) {
        const data = await response.json();
        setQuizState({
          sessionId: data.sessionId,
          currentQuestion: data.message,
          isQuizActive: true,
          quizLevel: level,
          quizHistory: []
        });
        setMessages(prev => [...prev, {
          sender: 'assistant',
          content: `Quiz started (${level} level). First question: ${data.message}`
        }]);
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      setMessages(prev => [...prev, {
        sender: 'assistant',
        content: "Failed to start quiz. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const stopQuiz = async () => {
    setQuizState({
      sessionId: null,
      currentQuestion: null,
      isQuizActive: false,
      quizLevel: null,
      quizHistory: []
    });
    setMessages(prev => [...prev, {
      sender: 'assistant',
      content: `Quiz stopped. Your final score is ${currentScore} points.`
    }]);
  };

  const submitQuizAnswer = async (answer: string) => {
    if (!quizState.sessionId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://tutor-api-gdg.vercel.app/v1/answer', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          sessionId: quizState.sessionId,
          answer: answer
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        setQuizState(prev => ({
          ...prev,
          currentQuestion: data.nextQuestion,
          quizHistory: [
            ...prev.quizHistory,
            {
              question: quizState.currentQuestion || '',
              userAnswer: answer,
              evaluation: data.evaluation,
              score: data.currentScore - currentScore
            }
          ]
        }));
        
        setCurrentScore(data.currentScore);
        
        setMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            content: `Evaluation: ${data.evaluation}\n\n\nNext question: ${data.nextQuestion || 'Quiz completed!'}`
          }
        ]);
        
        if (!data.nextQuestion) {
          setQuizState(prev => ({
            ...prev,
            isQuizActive: false,
            currentQuestion: null
          }));
        }
      }
    } catch (error) {
      console.error('Error submitting quiz answer:', error);
      setMessages(prev => [...prev, {
        sender: 'assistant',
        content: "Failed to submit answer. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // const getQuizProgress = async () => {
  //   if (!quizState.sessionId) return;
    
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(`https://tutor-api-gdg.vercel.app/v1/progress/${quizState.sessionId}`, {
  //       method: 'GET',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Authorization': `Bearer ${authToken}`,
  //       }
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setQuizState(prev => ({
  //         ...prev,
  //         quizHistory: data.history
  //       }));
  //       setCurrentScore(data.score);
  //     }
  //   } catch (error) {
  //     console.error('Error getting quiz progress:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleProfileSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   try {
  //     const endpoint = userProfile ? '/v1/profile' : '/v1/profile';
  //     const method = userProfile ? 'PUT' : 'POST';

  //     const response = await fetch(`https://tutor-api-gdg.vercel.app${endpoint}`, {
  //       method,
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${authToken}`,
  //       },
  //       body: JSON.stringify({
  //         name: profileFormData.name,
  //         age: profileFormData.age,
  //         monthlyincome: profileFormData.monthlyIncome,
  //         monthlysaving: profileFormData.monthlySaving,
  //         primaryreasonforinvesting: profileFormData.primaryReasonForInvesting,
  //         financialrisk: profileFormData.financialRisk,
  //         expaboutinvesting: profileFormData.expAboutInvesting,
  //         estimateinvestingduration: profileFormData.estimateInvestingDuration,
  //         typesofinvestment: profileFormData.typesOfInvestment,
  //         portfolio: profileFormData.portfolio
  //       })
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setUserProfile(data.profile);
  //       setShowProfileForm(false);
  //       setMessages(prev => [...prev, {
  //         sender: 'assistant',
  //         content: `Profile ${userProfile ? 'updated' : 'created'} successfully! How can I help you with your investments today?`
  //       }]);
  //     }
  //   } catch (error) {
  //     console.error('Error saving profile:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileType = file.type.split('/')[0];
      const isImage = fileType === 'image';

      if (isImage) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const imageUrl = event.target?.result as string;
          setMessages(prev => [...prev, {
            sender: 'user',
            content: '',
            isAttachment: true,
            attachmentType: 'image',
            attachmentUrl: imageUrl
          }]);
          
          await sendToGemini('', imageUrl);
        };
        reader.readAsDataURL(file);
      } else {
        setMessages(prev => [...prev, {
          sender: 'user',
          content: `Attachment: ${file.name}`,
          isAttachment: true,
          attachmentType: 'file'
        }]);
      }
    }
  };

  const sendToGemini = async (message: string, imageUrl?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://tutor-api-gdg.vercel.app/v1/chatwithimage', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          message: message,
          chatSessionId: chatSessionId,
          ...(imageUrl && { imageUrl: imageUrl })
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        sender: 'assistant',
        content: data.reply
      }]);
      
      // setCurrentScore(prev => prev + 5);

    } catch (error) {
      console.error('Error communicating with AI:', error);
      setMessages(prev => [...prev, {
        sender: 'assistant',
        content: "Sorry, I'm having trouble connecting to the AI service. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input');
    if (input && input instanceof HTMLInputElement && input.value.trim()) {
      const messageContent = input.value;
      const newMessage: Message = {
        sender: 'user',
        content: messageContent
      };
      setMessages(prev => [...prev, newMessage]);
      input.value = '';
      
      if (messageContent.toLowerCase().includes('stop quiz')) {
        await stopQuiz();
        return;
      }
      
      if (messageContent.toLowerCase().includes('start quiz')) {
        const levelMatch = messageContent.match(/beginner|intermediate|advanced/i);
        const level = levelMatch ? levelMatch[0] : 'Beginner';
        await startQuiz(level);
        return;
      } 
      
      if (quizState.isQuizActive && quizState.currentQuestion) {
        await submitQuizAnswer(messageContent);
        return;
      }
      
      await sendToGemini(messageContent);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">
            {selectedModule ? `Tutor: ${selectedModule.title}` : 'Personalized Tutor'}
          </h2>
          <div className="text-sm text-gray-400">
            <span className="text-yellow-400 font-medium">Your Current Score : {currentScore} pts</span>
            {quizState.isQuizActive && (
              <span className="ml-2 text-blue-400">(Quiz: {quizState.quizLevel})</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {quizState.isQuizActive ? (
            <button
              onClick={stopQuiz}
              className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition"
              disabled={isLoading}
            >
              Stop Quiz
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowQuizLevelSelector(!showQuizLevelSelector)}
                className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30 transition"
                disabled={isLoading}
              >
                Start Quiz
              </button>
              {showQuizLevelSelector && (
                <div className="absolute right-0 mt-1 w-40 bg-gray-700 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => startQuiz('Beginner')}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-600"
                  >
                    Beginner Level
                  </button>
                  <button
                    onClick={() => startQuiz('Intermediate')}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-600"
                  >
                    Intermediate Level
                  </button>
                  <button
                    onClick={() => startQuiz('Advanced')}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-600"
                  >
                    Advanced Level
                  </button>
                </div>
              )}
            </div>
          )}
          {/* <button 
            onClick={() => setShowProfileForm(!showProfileForm)}
            className="p-1 text-gray-400 hover:text-white transition"
            title="Profile"
          >
            <FiUser size={20} />
          </button> */}
          <span className={`px-2 py-1 text-xs rounded-full ${
            isLoading ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
          }`}>
            {isLoading ? 'Thinking...' : 'Online'}
          </span>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4 h-100 overflow-y-auto pr-2 custom-scrollbar">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.isAttachment ? (
              message.attachmentType === 'image' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-600/70 to-blue-800/70 rounded-2xl rounded-br-none p-2 max-w-xs md:max-w-md"
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={message.attachmentUrl || ''}
                      alt="Uploaded chart"
                      className="object-contain rounded-lg w-full h-full"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-600/70 to-blue-800/70 rounded-2xl rounded-br-none p-4 max-w-xs md:max-w-md"
                >
                  <div className="flex items-center gap-2">
                    <FiPaperclip />
                    <p>{message.content}</p>
                  </div>
                </motion.div>
              )
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-4 max-w-xs md:max-w-md ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-blue-600/70 to-blue-800/70 rounded-br-none' 
                    : 'bg-gray-700/70 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line">{message.content}</p>
              </motion.div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="mt-6 relative">
        <div className="flex items-center bg-gray-700/50 rounded-full px-4 py-2">
          <button 
            type="button"
            className="p-2 text-gray-400 hover:text-white transition"
            onClick={handleAttachmentClick}
            disabled={isLoading}
          >
            <FiPaperclip size={20} />
          </button>
          <input
            type="text"
            placeholder={
              quizState.isQuizActive 
                ? "Type your answer here..." 
                : selectedModule 
                  ? `Ask about ${selectedModule.title}...` 
                  : "Ask about trading strategies..."
            }
            className="flex-1 bg-transparent border-none focus:outline-none px-3 py-2 text-sm"
            disabled={isLoading}
          />
          <button 
            type="submit"
            className="p-2 text-blue-400 hover:text-blue-300 transition"
            disabled={isLoading}
          >
            <FiSend size={20} />
          </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          disabled={isLoading}
        />
      </form>
    </div>
  );
}