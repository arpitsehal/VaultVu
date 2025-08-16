import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Banking fraud knowledge base
const FRAUD_KNOWLEDGE_BASE = {
  phishing: {
    keywords: ['phishing', 'fake email', 'suspicious email', 'email scam'],
    response: "🎣 **Phishing** is when scammers send fake emails, texts, or calls pretending to be from legitimate organizations like banks.\n\n**Warning signs:**\n• Urgent requests for personal info\n• Suspicious sender addresses\n• Poor grammar/spelling\n• Generic greetings\n\n**Stay safe:** Never click suspicious links, verify sender through official channels, and report phishing attempts."
  },
  atm: {
    keywords: ['atm', 'card skimming', 'atm fraud', 'card reader'],
    response: "🏧 **ATM Fraud** includes card skimming, shoulder surfing, and fake ATMs.\n\n**Protection tips:**\n• Cover your PIN when entering\n• Check for loose card readers\n• Use ATMs in well-lit, busy areas\n• Monitor your account regularly\n• Report suspicious devices immediately\n\n**If compromised:** Contact your bank immediately and change your PIN."
  },
  identity: {
    keywords: ['identity theft', 'personal information', 'ssn', 'social security'],
    response: "🆔 **Identity Theft** occurs when criminals steal your personal information to commit fraud.\n\n**Prevention:**\n• Secure personal documents\n• Monitor credit reports\n• Use strong, unique passwords\n• Be cautious sharing info online\n• Shred sensitive documents\n\n**If affected:** File police report, contact credit bureaus, and monitor accounts closely."
  },
  online: {
    keywords: ['online banking', 'internet banking', 'digital fraud', 'cybersecurity'],
    response: "💻 **Online Banking Security** is crucial in today's digital world.\n\n**Best practices:**\n• Use official bank apps/websites\n• Enable two-factor authentication\n• Never bank on public WiFi\n• Log out completely after sessions\n• Keep devices updated\n\n**Red flags:** Unexpected login alerts, unfamiliar transactions, or requests for credentials."
  },
  investment: {
    keywords: ['investment scam', 'ponzi scheme', 'fake investment', 'get rich quick'],
    response: "📈 **Investment Scams** promise unrealistic returns with little risk.\n\n**Warning signs:**\n• Guaranteed high returns\n• Pressure to invest quickly\n• Unlicensed sellers\n• Complex strategies you don't understand\n\n**Protection:** Research thoroughly, verify credentials, be skeptical of 'too good to be true' offers, and consult financial advisors."
  },
  mobile: {
    keywords: ['mobile banking', 'app security', 'smartphone fraud', 'mobile scam'],
    response: "📱 **Mobile Banking Security** requires extra vigilance.\n\n**Safety measures:**\n• Download apps from official stores\n• Use device lock screens\n• Enable app-specific PINs\n• Avoid banking on public networks\n• Keep apps updated\n\n**Threats:** Fake banking apps, SMS phishing, and malware targeting mobile devices."
  }
};

const GENERAL_RESPONSES = [
  "I'm here to help you learn about banking fraud prevention! Ask me about phishing, ATM safety, identity theft, online banking security, investment scams, or mobile banking.",
  "Banking security is important! I can provide information about various fraud types and how to protect yourself. What specific topic interests you?",
  "Let me help you stay safe from financial fraud. You can ask about common scams, prevention tips, or what to do if you've been targeted.",
];

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hello! I'm VaultVu AI, your banking fraud prevention assistant. I'm here to help you learn about financial security and protect yourself from scams. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for specific fraud topics
    for (const [topic, data] of Object.entries(FRAUD_KNOWLEDGE_BASE)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return data.response;
      }
    }
    
    // Check for greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "👋 Hello! I'm here to help you learn about banking fraud prevention. What specific topic would you like to explore?";
    }
    
    // Check for help requests
    if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
      return "🤝 I can help you with:\n\n• **Phishing** - Email and message scams\n• **ATM Safety** - Card skimming and ATM fraud\n• **Identity Theft** - Personal information protection\n• **Online Banking** - Digital security best practices\n• **Investment Scams** - Fraudulent investment schemes\n• **Mobile Banking** - Smartphone security\n\nJust ask about any of these topics!";
    }
    
    // Check for thanks
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "😊 You're welcome! Stay vigilant and keep learning about fraud prevention. Is there anything else you'd like to know?";
    }
    
    // Default responses
    const randomResponse = GENERAL_RESPONSES[Math.floor(Math.random() * GENERAL_RESPONSES.length)];
    return randomResponse;
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(userMessage.text),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 seconds delay
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      {!message.isUser && (
        <View style={styles.aiAvatar}>
          <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text style={[
          styles.messageText,
          message.isUser ? styles.userText : styles.aiText,
        ]}>
          {message.text}
        </Text>
        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
      {message.isUser && (
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={16} color="#F0F4F8" />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#F0F4F8" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>VaultVu AI Assistant</Text>
          <Text style={styles.headerSubtitle}>Banking Fraud Prevention</Text>
        </View>
        <View style={styles.statusIndicator}>
          <View style={styles.onlineIndicator} />
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top + 60}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          
          {/* Typing indicator */}
          {isTyping && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={styles.aiAvatar}>
                <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
              </View>
              <View style={[styles.messageBubble, styles.aiBubble]}>
                <View style={styles.typingIndicator}>
                  <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
                  <View style={[styles.typingDot, { animationDelay: '150ms' }]} />
                  <View style={[styles.typingDot, { animationDelay: '300ms' }]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about banking fraud prevention..."
            placeholderTextColor="#A8C3D1"
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() ? "#F0F4F8" : "#A8C3D1"} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2F3E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#374151',
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F0F4F8',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#A8C3D1',
  },
  statusIndicator: {
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: screenWidth * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#4F46E5',
    marginLeft: 8,
  },
  aiBubble: {
    backgroundColor: '#374151',
    marginRight: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#F0F4F8',
  },
  aiText: {
    color: '#F0F4F8',
  },
  timestamp: {
    fontSize: 10,
    color: '#A8C3D1',
    marginTop: 4,
    textAlign: 'right',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#374151',
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2A2F3E',
    borderRadius: 20,
    color: '#F0F4F8',
    fontSize: 16,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#4F46E5',
  },
  sendButtonInactive: {
    backgroundColor: '#4B5563',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A8C3D1',
    marginHorizontal: 2,
    opacity: 0.4,
  },
});
