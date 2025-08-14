// ... existing code ...

import { useState } from "react";

export default function QuizLevel() {
  const [coinsEarned, setCoinsEarned] = useState(0);

  const handleQuizCompletion = async (finalScore: number) => {
    // ... existing code ...

      const data = await response.json();
      console.log("✅ Level completion submitted:", data);
      setCoinsEarned(data.coinsEarned); // Capture coins earned

      // Show results modal
      setShowResultModal(true);
    } catch (error) {
      console.error("⚠ Error while updating user data:", error);
      // Still show results even if API call fails
      setShowResultModal(true);
    }
  };

  return (
    // ... existing code ...

      <ResultModal
        isVisible={showResultModal}
        score={score}
        totalQuestions={quizQuestions.length}
        coinsEarned={coinsEarned} // Pass coinsEarned to the modal
        onLevelsPress={() => {
          setShowResultModal(false);
          router.push('/levels');
        }}
        onDashboardPress={() => {
          setShowResultModal(false);
          router.push('/dashboard');
        }}
      />
    </SafeAreaView>
  );
}