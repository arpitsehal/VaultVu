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

// Comprehensive banking fraud knowledge base
const FRAUD_KNOWLEDGE_BASE = {
  phishing: {
    keywords: ['phishing', 'fake email', 'suspicious email', 'email scam', 'spear phishing', 'vishing', 'smishing'],
    response: "🎣 **Phishing Attacks** - The #1 cybercrime targeting financial institutions\n\n**Types of Phishing:**\n• **Email Phishing:** Mass fake emails from 'banks'\n• **Spear Phishing:** Targeted attacks using personal info\n• **Vishing:** Voice/phone call scams\n• **Smishing:** SMS/text message fraud\n• **Whaling:** Targeting high-profile individuals\n\n**Advanced Warning Signs:**\n• Mismatched URLs (paypaI.com vs paypal.com)\n• Urgent language: 'Account suspended!'\n• Requests for sensitive info banks never ask for\n• Generic greetings: 'Dear Customer'\n• Suspicious attachments or links\n• Poor grammar/foreign language patterns\n\n**Real Example:** 'Your account will be closed in 24 hours. Click here to verify.' - Banks NEVER send such emails.\n\n**If You've Been Targeted:**\n1. Don't click anything - close the message\n2. Report to your bank's fraud department\n3. Forward phishing emails to reportphishing@apwg.org\n4. Check your accounts for unauthorized activity\n5. Consider credit monitoring services"
  },
  atm: {
    keywords: ['atm', 'card skimming', 'atm fraud', 'card reader', 'pin pad', 'shimming', 'jackpotting'],
    response: "🏧 **ATM Fraud** - $2.2 billion stolen annually through various methods\n\n**Types of ATM Fraud:**\n• **Skimming:** Devices steal card data\n• **Shimming:** Thin devices inside card slot\n• **Shoulder Surfing:** Watching PIN entry\n• **Card Trapping:** Devices trap your card\n• **Cash Trapping:** Blocking cash dispensing\n• **Jackpotting:** Malware forcing cash dispensing\n\n**Advanced Detection Tips:**\n• Check for loose, crooked, or damaged parts\n• Look for unusual colors/materials on card reader\n• Wiggle the card reader before inserting\n• Cover PIN pad completely with your hand\n• Be aware of people standing too close\n• Trust your instincts - if something feels wrong, leave\n\n**Safer ATM Practices:**\n• Use ATMs inside banks when possible\n• Avoid standalone ATMs in isolated areas\n• Use contactless/mobile payments when available\n• Check statements within 24 hours\n• Set up account alerts for all transactions\n\n**If Compromised:**\n1. Contact bank immediately (24/7 fraud hotline)\n2. Change PIN at a secure location\n3. Monitor accounts for 30+ days\n4. File police report if significant loss\n5. Request new cards for all accounts"
  },
  identity: {
    keywords: ['identity theft', 'personal information', 'ssn', 'social security', 'credit report', 'data breach', 'synthetic identity'],
    response: "🆔 **Identity Theft** - Affects 14.4 million Americans annually, $56 billion in losses\n\n**Types of Identity Theft:**\n• **Financial Identity Theft:** Credit cards, loans, bank accounts\n• **Medical Identity Theft:** Using your insurance for medical care\n• **Tax Identity Theft:** Filing fake tax returns\n• **Criminal Identity Theft:** Committing crimes in your name\n• **Synthetic Identity Theft:** Combining real/fake information\n• **Child Identity Theft:** Using children's clean credit\n\n**How Criminals Get Your Info:**\n• Data breaches (Equifax, Target, etc.)\n• Mail theft (pre-approved credit offers)\n• Social engineering/pretexting\n• Dumpster diving for documents\n• Public records and social media\n• Insider threats at companies\n\n**Comprehensive Protection Plan:**\n• Freeze credit reports at all 3 bureaus (free)\n• Monitor credit reports monthly (annualcreditreport.com)\n• Use identity monitoring services\n• Secure mail (PO Box or locking mailbox)\n• Shred everything with personal info\n• Limit social media personal information\n• Use unique passwords + 2FA everywhere\n\n**If You're a Victim:**\n1. Place fraud alerts with credit bureaus\n2. File FTC complaint at IdentityTheft.gov\n3. File police report (get case number)\n4. Contact affected financial institutions\n5. Keep detailed records of all communications\n6. Consider identity theft insurance"
  },
  online: {
    keywords: ['online banking', 'internet banking', 'digital fraud', 'cybersecurity', 'malware', 'keylogger', 'man in the middle'],
    response: "💻 **Online Banking Security** - $3.5 billion in online fraud losses annually\n\n**Common Online Banking Threats:**\n• **Malware/Trojans:** Zeus, Emotet stealing credentials\n• **Keyloggers:** Recording your keystrokes\n• **Man-in-the-Middle:** Intercepting communications\n• **Session Hijacking:** Stealing active login sessions\n• **Fake Banking Websites:** Identical-looking phishing sites\n• **SIM Swapping:** Taking over your phone number\n\n**Advanced Security Measures:**\n• **Multi-Factor Authentication:** SMS + app + biometric\n• **Dedicated Banking Device:** Separate device only for banking\n• **VPN Usage:** Encrypt internet connection\n• **Browser Security:** Use latest version, clear cache\n• **Network Security:** Never use public WiFi for banking\n• **Regular Updates:** OS, browser, antivirus software\n\n**Banking Session Best Practices:**\n• Type bank URL manually (don't click links)\n• Look for 'https://' and padlock icon\n• Log out completely (don't just close browser)\n• Clear browser history after banking\n• Use private/incognito browsing mode\n• Set up account alerts for all activities\n\n**Red Flags During Online Banking:**\n• Unexpected login verification requests\n• Pages asking for full SSN or passwords\n• Unusual account activity notifications\n• Slow loading or different-looking pages\n• Pop-ups asking for additional information\n\n**If Account Compromised:**\n1. Change passwords immediately\n2. Contact bank fraud department\n3. Review all recent transactions\n4. Run full antivirus scan\n5. Consider professional cybersecurity help"
  },
  investment: {
    keywords: ['investment scam', 'ponzi scheme', 'fake investment', 'get rich quick', 'pyramid scheme', 'affinity fraud', 'pump and dump'],
    response: "📈 **Investment Scams** - $4.2 billion lost to investment fraud in 2022\n\n**Types of Investment Fraud:**\n• **Ponzi Schemes:** Pay old investors with new money (Bernie Madoff)\n• **Pyramid Schemes:** Recruit others to make money\n• **Pump and Dump:** Artificially inflate stock prices\n• **Affinity Fraud:** Target specific communities/groups\n• **High-Yield Investment Programs:** Promise unrealistic returns\n• **Cryptocurrency Scams:** Fake exchanges, ICO fraud\n• **Real Estate Flipping Scams:** Non-existent properties\n\n**Sophisticated Warning Signs:**\n• Returns consistently above market rates (>10-15% annually)\n• Pressure to 'act now' or 'limited time offers'\n• Unlicensed sellers (check FINRA BrokerCheck)\n• Overly complex strategies you can't understand\n• Testimonials from 'satisfied investors' (often fake)\n• Difficulty withdrawing your money\n• Secretive about investment details\n\n**Due Diligence Checklist:**\n• Verify advisor licenses (FINRA.org, SEC.gov)\n• Research company background and complaints\n• Understand exactly where your money goes\n• Get everything in writing\n• Consult independent financial advisor\n• Start with small amounts to test legitimacy\n• Be extra cautious with overseas investments\n\n**Common Scam Tactics:**\n• Celebrity endorsements (often fake)\n• 'Insider information' or 'secret strategies'\n• Social media ads promising quick wealth\n• Fake news articles about investment opportunities\n• High-pressure sales tactics and urgency\n\n**If You've Been Scammed:**\n1. Stop sending money immediately\n2. Report to SEC (sec.gov/complaint)\n3. File complaint with FINRA\n4. Contact state securities regulator\n5. Consult with securities attorney\n6. Report to FBI's IC3 (ic3.gov)"
  },
  mobile: {
    keywords: ['mobile banking', 'app security', 'smartphone fraud', 'mobile scam', 'sim swap', 'fake app', 'sms fraud'],
    response: "📱 **Mobile Banking Security** - 89% of banks offer mobile banking, creating new attack vectors\n\n**Mobile-Specific Threats:**\n• **Fake Banking Apps:** Malicious apps mimicking real banks\n• **SIM Swapping:** Criminals take over your phone number\n• **SMS Phishing (Smishing):** Fake text messages\n• **Mobile Malware:** Android/iOS banking trojans\n• **Public WiFi Attacks:** Man-in-the-middle on open networks\n• **Bluetooth Attacks:** Unauthorized device pairing\n• **QR Code Scams:** Malicious codes leading to fake sites\n\n**Advanced Mobile Security:**\n• **App Store Only:** Download from official stores only\n• **App Permissions:** Review what apps can access\n• **Biometric Authentication:** Fingerprint, face, voice recognition\n• **App-Specific PINs:** Different from device unlock\n• **Auto-Lock Settings:** 1-2 minute timeout\n• **Remote Wipe Capability:** If device is stolen\n• **VPN for Public WiFi:** Encrypt all communications\n\n**Mobile Banking Best Practices:**\n• Update apps and OS regularly\n• Don't save banking passwords in browser\n• Log out after each session\n• Use official bank apps, not mobile websites\n• Enable push notifications for all transactions\n• Don't bank on jailbroken/rooted devices\n• Use separate device for banking if possible\n\n**SIM Swap Protection:**\n• Add PIN/password to mobile account\n• Use authenticator apps instead of SMS 2FA\n• Monitor phone service interruptions\n• Contact carrier if service suddenly stops\n• Use Google Voice or similar for 2FA when possible\n\n**If Mobile Device Compromised:**\n1. Contact bank immediately\n2. Change all banking passwords\n3. Remote wipe device if stolen\n4. Check all accounts for unauthorized access\n5. Contact mobile carrier about SIM swap\n6. Run security scan on recovered device"
  },
  social_engineering: {
    keywords: ['social engineering', 'pretexting', 'baiting', 'quid pro quo', 'tailgating', 'psychological manipulation'],
    response: "🧠 **Social Engineering** - 98% of cyberattacks involve some form of social engineering\n\n**Types of Social Engineering:**\n• **Pretexting:** Creating fake scenarios to gain trust\n• **Baiting:** Offering something enticing (free USB, gift cards)\n• **Quid Pro Quo:** 'Help' in exchange for information\n• **Tailgating:** Following authorized person into secure areas\n• **Authority Impersonation:** Posing as boss, IT, government\n• **Urgency Creation:** 'Emergency' requiring immediate action\n\n**Psychological Tactics Used:**\n• **Fear:** 'Your account will be closed!'\n• **Greed:** 'You've won $10,000!'\n• **Curiosity:** 'See who viewed your profile'\n• **Authority:** 'This is the IRS calling'\n• **Social Proof:** 'Everyone in your area is doing this'\n• **Scarcity:** 'Limited time offer!'\n\n**Real-World Examples:**\n• Fake IT calls asking for passwords\n• 'Bank security' calls requesting account verification\n• Emails from 'CEO' requesting urgent wire transfers\n• Fake charity calls after disasters\n• Romance scams on dating sites\n\n**Defense Strategies:**\n• Verify identity through independent channels\n• Never give sensitive info over unsolicited calls\n• Be suspicious of urgent requests\n• Trust your instincts if something feels wrong\n• Implement 'callback procedures' for verification\n• Train family members about common tactics"
  },
  cryptocurrency: {
    keywords: ['cryptocurrency', 'bitcoin', 'crypto scam', 'blockchain', 'wallet', 'exchange hack', 'ico scam'],
    response: "₿ **Cryptocurrency Fraud** - $14 billion lost to crypto scams in 2021\n\n**Common Crypto Scams:**\n• **Fake Exchanges:** Steal deposits, never allow withdrawals\n• **Ponzi Schemes:** Promise guaranteed crypto returns\n• **ICO Scams:** Fake initial coin offerings\n• **Wallet Scams:** Malicious wallet apps stealing keys\n• **Romance Scams:** Dating sites leading to crypto 'investments'\n• **Giveaway Scams:** 'Send 1 Bitcoin, get 2 back'\n• **DeFi Rug Pulls:** Developers abandon projects with funds\n\n**Red Flags in Crypto:**\n• Guaranteed returns or 'risk-free' investments\n• Celebrity endorsements (often deepfakes)\n• Pressure to invest quickly\n• Requests for private keys or seed phrases\n• Unregistered investment opportunities\n• Social media ads promising quick wealth\n\n**Crypto Security Best Practices:**\n• Use reputable exchanges (Coinbase, Binance, Kraken)\n• Enable 2FA on all crypto accounts\n• Use hardware wallets for large amounts\n• Never share private keys or seed phrases\n• Verify all addresses before sending\n• Be cautious of 'too good to be true' offers\n• Research thoroughly before investing\n\n**If Crypto Scammed:**\n1. Report to FBI's IC3 immediately\n2. Contact exchange if funds stolen from there\n3. Document all transactions and communications\n4. Report to FTC and state attorney general\n5. Consider blockchain analysis services\n6. Consult cryptocurrency attorney"
  }
};

// Additional specialized knowledge areas
const ADVANCED_TOPICS = {
  elder_fraud: {
    keywords: ['elder fraud', 'senior scam', 'grandparent scam', 'medicare fraud', 'elderly'],
    response: "👴 **Elder Fraud** - Adults 60+ lose $3 billion annually to financial scams\n\n**Common Elder Scams:**\n• **Grandparent Scam:** 'Grandma, I'm in jail, send money!'\n• **Medicare/Health Insurance Scams:** Fake medical services\n• **Charity Scams:** Fake disaster relief organizations\n• **Romance Scams:** Online dating leading to money requests\n• **Tech Support Scams:** 'Microsoft' calling about computer virus\n• **Lottery/Sweepstakes:** 'You've won, pay taxes first'\n\n**Why Seniors Are Targeted:**\n• Often have substantial savings/retirement funds\n• May be more trusting of authority figures\n• Less familiar with modern scam tactics\n• Social isolation makes them vulnerable\n• Cognitive decline may affect judgment\n\n**Protection Strategies:**\n• Never give personal info over unsolicited calls\n• Verify 'emergencies' by calling family directly\n• Be skeptical of 'limited time' offers\n• Consult family/friends before major decisions\n• Register with Do Not Call Registry\n• Use caller ID and don't answer unknown numbers"
  },
  business_fraud: {
    keywords: ['business email compromise', 'bec', 'wire fraud', 'invoice scam', 'ceo fraud', 'vendor fraud'],
    response: "🏢 **Business Email Compromise (BEC)** - $43 billion in losses since 2016\n\n**Types of BEC Attacks:**\n• **CEO Fraud:** Impersonating executives for wire transfers\n• **Invoice Scams:** Fake invoices from 'vendors'\n• **Attorney Impersonation:** Fake legal urgency\n• **Data Theft:** Requesting employee W-2s, customer data\n• **Real Estate Fraud:** Intercepting closing communications\n\n**Attack Methodology:**\n1. Research company structure via social media/websites\n2. Compromise or spoof executive email accounts\n3. Time attacks when executives are traveling\n4. Create urgency: 'Confidential acquisition, wire funds now'\n5. Request unusual payment methods (gift cards, crypto)\n\n**Business Protection Measures:**\n• Implement dual approval for wire transfers\n• Verify all payment requests via phone (known numbers)\n• Train employees on social engineering tactics\n• Use email authentication (SPF, DKIM, DMARC)\n• Establish clear financial authorization procedures\n• Regular cybersecurity awareness training\n\n**Red Flags for Businesses:**\n• Urgent requests outside normal procedures\n• Requests for secrecy or confidentiality\n• Changes to vendor payment information\n• Executive emails with slight spelling differences\n• Pressure to bypass normal approval processes"
  },
  romance_fraud: {
    keywords: ['romance scam', 'dating scam', 'catfish', 'online dating fraud', 'military romance scam'],
    response: "💔 **Romance Scams** - $547 million lost in 2021, highest per-person losses\n\n**How Romance Scams Work:**\n1. Create fake profiles on dating sites/social media\n2. Use stolen photos of attractive people\n3. Build emotional connection over weeks/months\n4. Create elaborate backstories (military, doctor, engineer)\n5. Profess love quickly and intensely\n6. Create 'emergency' requiring money\n\n**Common Scammer Profiles:**\n• Military personnel deployed overseas\n• Doctors/engineers working abroad\n• Widowed with children\n• Wealthy but temporarily cash-strapped\n• Claims to live nearby but always traveling\n\n**Warning Signs:**\n• Professes love very quickly\n• Refuses to meet in person or video chat\n• Photos look too professional/model-like\n• Stories don't add up or change over time\n• Poor grammar despite claiming to be American\n• Always has emergencies requiring money\n• Asks for gift cards, wire transfers, or cryptocurrency\n\n**Verification Steps:**\n• Reverse image search their photos\n• Video chat before developing feelings\n• Ask specific questions about their claimed location\n• Be suspicious if they can't meet in person\n• Never send money, gifts, or personal information\n• Trust friends/family who express concerns\n\n**If You've Been Scammed:**\n1. Stop all contact immediately\n2. Don't send any more money\n3. Report to FBI's IC3 and FTC\n4. Contact your bank about sent funds\n5. Report fake profiles to dating platforms\n6. Consider counseling for emotional recovery"
  },
  tax_fraud: {
    keywords: ['tax scam', 'irs scam', 'tax fraud', 'refund fraud', 'tax identity theft'],
    response: "🧾 **Tax Fraud** - $5.2 billion in tax refund fraud annually\n\n**Common Tax Scams:**\n• **IRS Impersonation:** Threatening calls about owed taxes\n• **Refund Fraud:** Filing fake returns to steal refunds\n• **Tax Preparer Fraud:** Dishonest preparers stealing refunds\n• **Phishing Emails:** Fake IRS emails requesting information\n• **Identity Theft:** Using stolen SSNs to file fake returns\n\n**IRS Impersonation Red Flags:**\n• Demanding immediate payment via gift cards/wire transfer\n• Threatening arrest or deportation\n• Calling about refunds or stimulus payments\n• Requesting personal information over phone\n• Claiming you owe money without prior written notice\n\n**Important IRS Facts:**\n• IRS never initiates contact by phone, email, or text\n• First contact is always by mail\n• IRS never demands specific payment methods\n• You have rights to question and appeal\n• IRS never threatens immediate arrest\n\n**Tax Identity Theft Protection:**\n• File tax returns as early as possible\n• Use secure internet connections for e-filing\n• Choose reputable tax preparers\n• Protect your SSN and tax documents\n• Monitor credit reports for suspicious activity\n• Consider IRS Identity Protection PIN\n\n**If Targeted by Tax Scam:**\n1. Hang up immediately on suspicious calls\n2. Report to Treasury Inspector General (tigta.gov)\n3. File complaint with FTC\n4. If identity stolen, file Form 14039 with IRS\n5. Contact credit bureaus if SSN compromised"
  }
};

const GENERAL_RESPONSES = [
  "I'm here to help you learn about banking fraud prevention! Ask me about phishing, ATM safety, identity theft, online banking security, investment scams, mobile banking, social engineering, cryptocurrency fraud, elder fraud, business fraud, romance scams, or tax fraud.",
  "Banking security is crucial in today's digital world! I can provide detailed information about various fraud types, real-world examples, and step-by-step protection strategies. What specific topic interests you?",
  "Let me help you stay safe from financial fraud. I have comprehensive knowledge about scams, prevention tactics, victim response procedures, and regulatory information. What would you like to explore?",
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
    
    // Check for specific fraud topics in main knowledge base
    for (const [topic, data] of Object.entries(FRAUD_KNOWLEDGE_BASE)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return data.response;
      }
    }
    
    // Check for advanced topics
    for (const [topic, data] of Object.entries(ADVANCED_TOPICS)) {
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
      return "🤝 I can help you with comprehensive fraud prevention knowledge:\n\n**Core Topics:**\n• **Phishing** - Email, SMS, and voice scams\n• **ATM Safety** - Skimming, shimming, and physical attacks\n• **Identity Theft** - Personal information protection\n• **Online Banking** - Digital security and malware protection\n• **Investment Scams** - Ponzi schemes and fake opportunities\n• **Mobile Banking** - Smartphone and app security\n• **Social Engineering** - Psychological manipulation tactics\n• **Cryptocurrency** - Digital asset fraud prevention\n\n**Specialized Areas:**\n• **Elder Fraud** - Scams targeting seniors\n• **Business Fraud** - Corporate email compromise\n• **Romance Scams** - Online dating fraud\n• **Tax Fraud** - IRS impersonation and refund fraud\n\nJust ask about any topic for detailed information, real examples, and step-by-step protection strategies!";
    }
    
    // Check for case studies or examples
    if (lowerMessage.includes('example') || lowerMessage.includes('case study') || lowerMessage.includes('real world')) {
      return "📚 **Real-World Fraud Examples:**\n\n• **Bernie Madoff Ponzi Scheme:** $65 billion fraud over 20+ years\n• **Target Data Breach (2013):** 40 million credit cards stolen\n• **Equifax Breach (2017):** 147 million Americans' data exposed\n• **Twitter Bitcoin Scam (2020):** Hackers compromised celebrity accounts\n• **Colonial Pipeline Ransomware (2021):** $4.4 million paid to criminals\n\nWhich type of fraud would you like specific examples and prevention strategies for?";
    }
    
    // Check for statistics or data
    if (lowerMessage.includes('statistic') || lowerMessage.includes('data') || lowerMessage.includes('numbers')) {
      return "📊 **Fraud Statistics (2022-2023):**\n\n• **Total Losses:** $8.8 billion reported to FTC\n• **Identity Theft:** 1.4 million reports, $52 billion losses\n• **Investment Scams:** $4.2 billion in losses\n• **Romance Scams:** $547 million, highest per-person losses\n• **Business Email Compromise:** $43 billion since 2016\n• **Cryptocurrency Fraud:** $14 billion in 2021\n• **Elder Fraud:** $3 billion targeting adults 60+\n\n**Most Targeted Age Groups:**\n• 30-39 years: Highest report rates\n• 70+ years: Highest dollar losses per person\n\nWhat specific fraud type would you like detailed information about?";
    }
    
    // Check for thanks
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "😊 You're welcome! Stay vigilant and keep learning about fraud prevention. Financial security is an ongoing process. Is there anything else you'd like to know?";
    }
    
    // Check for reporting information
    if (lowerMessage.includes('report') || lowerMessage.includes('authorities') || lowerMessage.includes('police')) {
      return "🚨 **How to Report Fraud:**\n\n**Federal Agencies:**\n• **FTC:** reportfraud.ftc.gov or 1-877-FTC-HELP\n• **FBI IC3:** ic3.gov for internet crimes\n• **IRS:** tigta.gov for tax-related fraud\n• **SEC:** sec.gov/complaint for investment fraud\n\n**Financial Institutions:**\n• Contact your bank's fraud department immediately\n• File disputes for unauthorized transactions\n• Request account freezes if compromised\n\n**Credit Bureaus:**\n• Equifax, Experian, TransUnion\n• Place fraud alerts or credit freezes\n• Monitor credit reports regularly\n\n**Documentation Tips:**\n• Keep records of all communications\n• Screenshot fraudulent messages\n• Note dates, times, and amounts\n• Get police report numbers when applicable";
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
